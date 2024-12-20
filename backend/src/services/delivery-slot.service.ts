import DeliveryOptionsConfiguration from '../singletons/delivery-options-configuration';
import { Injectable } from '../core/decorators';
import {
    PanchshilSlotRepository,
    SystemParameterRepository,
    VehicleRepository,
    VehicleSlotRepository,
} from '../repositories';
import { BaseService } from './base.service';
import { RedisService } from '../cache';
import {
    DeliverySlotType,
    Slot,
    VehicleSlot,
    SlotState,
    PanchshilSlot,
    SystemParameter,
    AvailableSlot,
    DeliverySlotKey,
    OrderSlot,
} from '../models';
import { IDeliveryOptions } from '../models/delivery-options';
import { Injector } from '../core/di/injector';
import { SystemParameterKeys } from '../keys/system-parameter.keys';

@Injectable()
export class DeliverySlotService extends BaseService {
    private _deliveryOptions: IDeliveryOptions;

    constructor(
        private panchshilSlotRepository: PanchshilSlotRepository,
        private vehicleSlotRepository: VehicleSlotRepository,
        private systemParameterRepository: SystemParameterRepository,
        private vehicleRepository: VehicleRepository,
        deliveryOptionsConfiguration: DeliveryOptionsConfiguration,
        redisService: RedisService
    ) {
        super(redisService);

        if (!deliveryOptionsConfiguration.isInitialised) {
            deliveryOptionsConfiguration.initialize();
        }

        this._deliveryOptions = deliveryOptionsConfiguration.options;
    }  

    public async getByIds(slots: Array<{ _id: string, slotType: DeliverySlotType }>): Promise<any> {
        const vSlots: Array<OrderSlot> = (
            await this.vehicleSlotRepository.getForIds(slots.filter(s => s.slotType === DeliverySlotType.Vehicle).map(s => s._id))
        )
        .map(s => ( { ...s, _id: s._id.toString(), slotType: DeliverySlotType.Vehicle } ));

        const pSlots: Array<OrderSlot> = (
            await this.panchshilSlotRepository.getForIds(slots.filter(s => s.slotType === DeliverySlotType.Panchshil).map(s => s._id))
        )
        .map(s => ( { ...s,  _id: s._id.toString(), slotType: DeliverySlotType.Panchshil } ));

        return vSlots.concat(pSlots);
    }

    public async findById(slotId: string, slotType: DeliverySlotType): Promise<any> {
        if (slotType === DeliverySlotType.Vehicle) {
            return await this.vehicleSlotRepository.findById(slotId);
        }
        else {
            return await this.panchshilSlotRepository.findById(slotId);
        }
    }

    public async getSlots(deliverySlotType: DeliverySlotType, from: Date, to: Date): Promise<Array<AvailableSlot>> {
        let slots: Array<AvailableSlot>;
        if (deliverySlotType === DeliverySlotType.Panchshil) {
            slots = await this.panchshilSlotRepository.getSlots(from, to);
        } else {
            slots = await this.vehicleSlotRepository.getSlots(from, to);
        }

        slots.forEach((s) => {
            s.deliverySlotType = deliverySlotType;

            if (!this.isSlotAvailable(s)) {
                s.availableSlots = 0;
            }
        });

        return slots;
    }

    public async getSelectedSlotForShoppingCartID(shoppingCartID: string): Promise<AvailableSlot> {
        let availableSlot: AvailableSlot = { deliverySlotType: DeliverySlotType.Vehicle };
        let slot: any;
        slot = await this.vehicleSlotRepository.find({ shoppingCartID, slotState: SlotState.Reserved });

        if (!slot) {
            slot = await this.panchshilSlotRepository.find({ shoppingCartID, slotState: SlotState.Reserved });
            availableSlot.deliverySlotType = DeliverySlotType.Panchshil;
        }

        if (slot && slot.reserveStateExpiresIn && slot.reserveStateExpiresIn <= Date.now()) {
            return null;
        }

        if (slot) {
            return {
                ...availableSlot,
                deliveryDate: slot.deliveryDate,
                startTime: slot.startTime,
                endTime: slot.endTime,
                reserveStateExpiresIn: slot.reserveStateExpiresIn,
            };
        }

        return null;
    }

    public async reserve(key: DeliverySlotKey, userID: string, deliverySlotType: DeliverySlotType): Promise<any> {
        if (deliverySlotType === DeliverySlotType.Panchshil) {
            await this.panchshilSlotRepository.clear(key.shoppingCartID, userID);
            return await this.reserveSlot(
                async () =>
                    this.panchshilSlotRepository.find({ ...key, shoppingCartID: null, slotState: SlotState.Open }),
                async (id: string) => this.panchshilSlotRepository.reserve(id, key.shoppingCartID, userID)
            );
        } else {
            await this.vehicleSlotRepository.clear(key.shoppingCartID, userID);
            return await this.reserveSlot(
                async () =>
                    this.vehicleSlotRepository.find({ ...key, shoppingCartID: null, slotState: SlotState.Open }),
                async (id: string) => this.vehicleSlotRepository.reserve(id, key.shoppingCartID, userID)
            );
        }
    }

    public async generateSlots(userID: string): Promise<void> {
        const deliveryOptions = Injector.resolveSingleton<DeliveryOptionsConfiguration>(DeliveryOptionsConfiguration)
            .options;
        const systemParameter = await this.systemParameterRepository.getForKey(
            SystemParameterKeys.LastSlotGeneratedDateKey
        );
        const endDate = new Date(
            new Date(Date.now()).setDate(new Date(Date.now()).getDate() + deliveryOptions.slotsInAdvance)
        );

        await this.generateVehicleSlots(userID, endDate, systemParameter, deliveryOptions);
        await this.generatePanchshilSlots(userID, endDate, systemParameter, deliveryOptions);
        await this.systemParameterRepository.save(SystemParameterKeys.LastSlotGeneratedDateKey, endDate);
    }

    public async clearExpiredReservedSlots(): Promise<void> {
        await this.panchshilSlotRepository.clearAllExpiredReservedSlots();
        await this.vehicleSlotRepository.clearAllExpiredReservedSlots();
    }

    private isSlotAvailable(slot: AvailableSlot): boolean {
        const slotDate = new Date(slot.deliveryDate);
        const slotStartDate = new Date(
            slotDate.getFullYear(),
            slotDate.getMonth(),
            slotDate.getDate(),
            Number(slot.startTime)
        );
        const now = new Date(Date.now());
        const unavailableDate = new Date(
            now.setHours(now.getHours() + this._deliveryOptions.deliverySlotsUnavailableInHours)
        );

        return slotStartDate.getTime() > unavailableDate.getTime();
    }

    private async reserveSlot<T extends Slot>(find: () => Promise<T>, reserve: (id: string) => Promise<T>): Promise<T> {
        const slot = await find();

        if (slot) {
            return await reserve(slot._id.toString());
        }

        return null;
    }

    private async generatePanchshilSlots(
        userID: string,
        endDate: Date,
        systemParameter: SystemParameter,
        deliveryOptions: IDeliveryOptions
    ): Promise<void> {
        const resources = new Array(deliveryOptions.panchshilDeliveryResourcePerSlot);

        const slots = await this.generate<PanchshilSlot>(
            userID,
            DeliverySlotType.Panchshil,
            deliveryOptions.panchshilSlotStartTime,
            deliveryOptions.panchshilSlotEndTime,
            deliveryOptions.panchshilSlotSize,
            resources,
            deliveryOptions.panchshilDeliveryPerSlot,
            endDate,
            systemParameter
        );

        if (Array.isArray(slots) && slots.length > 0) {
            await this.panchshilSlotRepository.saveMany(slots);
        }
    }

    private async generateVehicleSlots(
        userID: string,
        endDate: Date,
        systemParameter: SystemParameter,
        deliveryOptions: IDeliveryOptions
    ): Promise<void> {
        const vehicles = await this.vehicleRepository.getAll();

        const slots = await this.generate<VehicleSlot>(
            userID,
            DeliverySlotType.Vehicle,
            deliveryOptions.vehicleSlotStartTime,
            deliveryOptions.vehicleSlotEndTime,
            deliveryOptions.vehicleSlotSize,
            vehicles.map((v) => v._id),
            deliveryOptions.vehicleDeliveryPerSlot,
            endDate,
            systemParameter
        );

        if (Array.isArray(slots) && slots.length > 0) {
            await this.vehicleSlotRepository.saveMany(slots);
        }
    }

    private async generate<T>(
        userID: string,
        deliverySlotType: DeliverySlotType,
        slotStartTime: number,
        slotEndTime: number,
        slotSize: number,
        resources: Array<string>,
        resourceDeliveryPerSlot: number,
        endDate: Date,
        systemParameter: SystemParameter
    ): Promise<Array<T>> {
        const lastSlotGeneratedDate = !!systemParameter ? new Date(systemParameter.value) : new Date();
        const slots = this.slotGeneration(slotStartTime, slotEndTime, slotSize);

        let deliverySlotDate = new Date(lastSlotGeneratedDate.setDate(lastSlotGeneratedDate.getDate() + 1));
        let resourceSlots = new Array<T>();

        while (deliverySlotDate <= endDate) {
            const deliverySlotsForDate = this.generateSlotsForResources<T>(
                deliverySlotType,
                userID,
                deliverySlotDate,
                slots,
                resources,
                resourceDeliveryPerSlot
            );

            resourceSlots = resourceSlots.concat(deliverySlotsForDate);
            deliverySlotDate = new Date(deliverySlotDate.setDate(deliverySlotDate.getDate() + 1));
        }

        return resourceSlots;
    }

    private slotGeneration(start: number, end: number, increment: number): Array<{ start: number; end: number }> {
        const slots = new Array<{ start: number; end: number }>();

        for (let s = start; s < end; s = s + increment) {
            slots.push({ start: s, end: s + increment });
        }
        return slots;
    }

    private generateSlotsForResources<T>(
        deliverySlotType: DeliverySlotType,
        userID: string,
        currentDate: Date,
        slots: Array<{ start: number; end: number }>,
        resources: Array<string>,
        deliveriesPerSlot: number
    ): Array<T> {
        const resourceSlots: Array<T> = new Array<T>();

        for (let r = 0; r < resources.length; r++) {
            for (let s = 0; s < slots.length; s++) {
                for (let d = 0; d < deliveriesPerSlot; d++) {
                    const item: any = {
                        _id: null,
                        createdDate: new Date(Date.now()),
                        deliveryDate: new Date(
                            currentDate.getFullYear(),
                            currentDate.getMonth(),
                            currentDate.getDate()
                        ),
                        startTime: `${slots[s].start < 10 ? '0' : ''}${slots[s].start.toString()}`,
                        endTime: `${slots[s].end.toString()}`,
                        slotNo: d.toString(),
                        slotState: SlotState.Open,
                        modifiedDate: new Date(Date.now()),
                        createdBy: userID,
                        modifiedBy: userID,
                    };
                    if (deliverySlotType === DeliverySlotType.Vehicle) {
                        item.vehicleID = resources[r];
                    }
                    resourceSlots.push(item);
                }
            }
        }
        return resourceSlots;
    }
}
