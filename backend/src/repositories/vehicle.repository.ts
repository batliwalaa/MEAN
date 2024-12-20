import { Model } from 'mongoose';
import { Injectable } from '../core/decorators';
import { Vehicle } from '../models';
import VehicleCollection from './collections/vehicle.collection';
import { VehicleModel } from './models/vehicle.model';

@Injectable()
export class VehicleRepository {
    private vehicleCollection: Model<VehicleModel, any>;

    constructor() {
        this.vehicleCollection = VehicleCollection();
    }

    public async save(Vehicle: Vehicle): Promise<string> {
        const options = await this.vehicleCollection.collection.insertOne(Vehicle, { bypassDocumentValidation: true });

        return options.insertedId.toString();
    }

    public async getByRegNo(registrationNumber: string): Promise<Vehicle> {
        return await this.vehicleCollection.findOne({ registrationNumber }).exec();
    }

    public async getAll(): Promise<Array<Vehicle>> {
        const vehicles = new Array<Vehicle>();
        const docs = await this.vehicleCollection.find({ delete: { $exists: false } }).exec();

        for (let doc of docs) {
            vehicles.push({
                _id: doc._doc._id.toString(),
                registrationNumber: doc._doc.registrationNumber,
                vehicleType: doc._doc.vehicleType,
            });
        }

        return vehicles;
    }
}
