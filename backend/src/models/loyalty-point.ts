import { LoyaltyPointRedeem } from "./loyalty-point-redeem";

export interface LoyaltyPoint {
    _id: any;
    userID: string;
    orderID: string;
    points: number;
    availablePoints: number;
    createdBy: string;
    createdDate: Date;
    modifiedBy: string;
    modifiedDate: Date;
    redeems: Array<LoyaltyPointRedeem>;
    active: boolean;
    reservedPoints: number;
    reservedRedeems: Array<LoyaltyPointRedeem>;
}