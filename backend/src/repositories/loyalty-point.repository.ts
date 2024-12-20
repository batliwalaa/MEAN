import { Model, Types } from 'mongoose';
import { Injectable } from '../core/decorators';
import { Logging } from '../core/structured-logging/log-manager';
import { Logger } from '../core/structured-logging/logger';
import { LoyaltyPoint, LoyaltyPointRedeem } from '../models';
import LoyaltyPointCollection  from './collections/loyalty-point.collection';
import { LoyaltyPointModel } from './models/loyalty-point.model';

@Injectable()
export class LoyaltyPointRepository {
    private loyaltyPointCollection: Model<LoyaltyPointModel, any>;
    private logger: Logger;

    constructor() {
        this.loyaltyPointCollection = LoyaltyPointCollection();
        this.logger = Logging.getLogger(`${this.constructor.name}`);
    }

    public async getForUser(userID: string): Promise<Array<LoyaltyPoint>> {
        return await this.loyaltyPointCollection.find({ userID: userID, active: true, availablePoints: { $gte: 1 } });
    }

    public async save(loyaltyPoint: LoyaltyPoint): Promise<string> {
        const options = await this.loyaltyPointCollection.collection.insertOne(loyaltyPoint, { bypassDocumentValidation: true });

        return options.insertedId.toString();
    }

    public async setActive(userID: string, orderID: string, active: boolean = false ): Promise<void> {
        const result = await this.loyaltyPointCollection.collection.updateOne(
            { userID, orderID, active },
            { $set: { active: true, moifiedDate: new Date(), modifiedBy: userID }},
            { bypassDocumentValidation: true }
        );

        if (result.modifiedCount !== 1) {
            this.logger.error(`Error: Failed to update active userID: ${userID}, orderID: ${orderID}`, { action: 'setActive'});
        }
    }

    public async redeem(userID: string, orderID: string): Promise<void> {
        const lPoints = await this.loyaltyPointCollection.find({ 'reservedRedeems.orderID': orderID }).exec();

        if (Array.isArray(lPoints) && lPoints.length > 0) {
            const points = lPoints.map(lp => lp._doc as LoyaltyPoint);

            for (let i = 0; i< points.length; i++) {
                const rRedeem = points[i].reservedRedeems.find(r => r.orderID === orderID);

                await this.loyaltyPointCollection.collection.updateOne(
                    { _id: Types.ObjectId(points[i]._id.toString()) },
                    { 
                        $push: { redeems: rRedeem },
                        $pull: { reservedRedeems: { orderID } },
                        $inc: { availablePoints: -rRedeem.points, reservedPoints: -rRedeem.points },
                        $set: { modifiedBy: userID, modifiedDate: new Date() }
                    },
                    { bypassDocumentValidation: true }
                )

                await this.loyaltyPointCollection.collection.updateOne(
                    { _id: Types.ObjectId(points[i]._id.toString()), availablePoints: 0 },
                    { $set: { active: false } },
                    { bypassDocumentValidation: true }
                )
            }
        }
    }

    public async clearReserved(userID: string, orderID: string): Promise<void> {
        const lPoints = await this.loyaltyPointCollection.find({ 'reservedRedeems.orderID': orderID }).exec();

        if (Array.isArray(lPoints) && lPoints.length > 0) {
            const points = lPoints.map(lp => lp._doc as LoyaltyPoint);

            for (let i = 0; i< points.length; i++) {
                const rRedeem = points[i].reservedRedeems.find(r => r.orderID === orderID);

                await this.loyaltyPointCollection.collection.updateOne(
                    { _id: Types.ObjectId(points[i]._id.toString()) },
                    { 
                        $pull: { reservedRedeems: { orderID } },
                        $inc: { reservedPoints: -rRedeem.points },
                        $set: { modifiedBy: userID, modifiedDate: new Date() }
                    },
                    { bypassDocumentValidation: true }
                )
            }
        }
    }

    public async reserve(orderID: string, userID: string, id: string, pointsToRedeem: number): Promise<number> {
        const result = await this.loyaltyPointCollection.collection.updateOne(
            { _id: Types.ObjectId(id) },
            { 
                $push: { reservedRedeems: { orderID, points: pointsToRedeem, redeemDate: new Date(new Date().toDateString()) } },
                $inc: { reservedPoints: pointsToRedeem },
                $set: { modifiedBy: userID, modifiedDate: new Date() }
            },
            { bypassDocumentValidation: true }
        );
        
        if (result.modifiedCount !== 1) {
            this.logger.error(`FATAL Error: Failed to reserve redeem points: ${JSON.stringify({id, pointsToRedeem})}`, { action: 'reserve'});
        }

        return result.modifiedCount;
    }
}
