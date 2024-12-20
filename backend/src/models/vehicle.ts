import { VehicleType } from './enums/vehicle-type';

export interface Vehicle {
    _id: any;
    vehicleType: VehicleType;
    registrationNumber?: string;
    deleted?: boolean;
    inactive?: Array<{ day: Date; from: string; to: string }>;
    test?: boolean;
}
