import fs from 'fs';
import path from 'path';
import { CryptoService } from '.';

import { Injectable } from '../core/decorators';
import { Resource } from '../models';
import {
    ProductCollection,
    MenuCollection,
    HomepageCollection,
    FooterCollection,
    UserCollection,
    VehicleCollection,
    ResourceCollection,
} from '../repositories/collections';

@Injectable()
export class SeedDataService {
    constructor(private cryptoService: CryptoService) {}

    public async insertMenu(navigate: string = '/../..'): Promise<void> {
        const buffer: any = fs.readFileSync(__dirname + navigate + '/src/seed-data/menu.json');
        const data = JSON.parse(buffer);

        MenuCollection().collection.insertMany(data, { ordered: false });
    }

    public async insertFooter(navigate: string = '/../..'): Promise<void> {
        const buffer: any = fs.readFileSync(__dirname + navigate + '/src/seed-data/footer.json');
        const data = JSON.parse(buffer);

        FooterCollection().collection.insertMany(data, { ordered: false });
    }

    public async insertHomepage(navigate: string = '/../..'): Promise<void> {
        const buffer: any = fs.readFileSync(__dirname + navigate + '/src/seed-data/homepage.json');
        const data = JSON.parse(buffer);

        HomepageCollection().collection.insertMany(data, { ordered: false });
    }

    public async insertPantry(navigate: string = '/../..'): Promise<void> {
        const buffer: any = fs.readFileSync(__dirname + navigate + '/src/seed-data/pantry/cookingessentials.json');
        const data = JSON.parse(buffer);

        ProductCollection().collection.insertMany(data, { ordered: false });
    }

    public async insertVehicles(navigate: string = '/../..'): Promise<void> {
        const buffer: any = fs.readFileSync(__dirname + navigate + '/src/seed-data/vehicle.json');
        const data = JSON.parse(buffer);

        VehicleCollection().collection.insertMany(data, { ordered: false });
    }

    public async insertResources(navigate: string = '/../..'): Promise<void> {
        const directoryPath = `${__dirname}${navigate}/src/seed-data/resources`;
        fs.readdir(directoryPath, async (error, files) => {            
            if (!error) {
                files.forEach(async (f) => {
                    if (path.extname(f) === '.json') {
                        const parts = f.split('.');

                        const buffer: any = fs.readFileSync(`${directoryPath}/${f}`);
                        const data = JSON.parse(buffer);
                        const resource: Resource = { _id: null, value: data, key: parts[0], language: parts[1], deleted: false };
                        await ResourceCollection().collection.insertOne(resource, { bypassDocumentValidation: true });
                    }
                });
            }
        });        
    }

    public async deleteVehicles(): Promise<void> {
        VehicleCollection().collection.deleteMany({});
    }

    public async deleteUsers(): Promise<void> {
        UserCollection().collection.deleteMany({});
    }

    public async deleteHomepage(): Promise<void> {
        HomepageCollection().collection.deleteMany({});
    }

    public async deletePantry(): Promise<void> {
        ProductCollection().collection.deleteMany({});
    }

    public async deleteFooter(): Promise<void> {
        FooterCollection().collection.deleteMany({});
    }

    public async deleteMenu(): Promise<void> {
        MenuCollection().collection.deleteMany({});
    }    
}
