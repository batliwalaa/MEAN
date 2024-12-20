import fs from 'fs';
import path from 'path';
import { Injector } from '../../core/di/injector';
import { MetadataService } from '../../singletons/metadata.service';

export const MetadataLoader = async (appName: string = 'redis') => {
    //@ts-ignore
    const directoryPath = path.join(global.appRoot, `../src/metadata/${appName}`);
    const metadataService = Injector.resolveSingleton(MetadataService);

    fs.readdir(directoryPath, async (error, files) => {            
        if (!error) {
            files.forEach(async (f) => {
                if (path.extname(f) === '.json') {
                    const buffer: any = fs.readFileSync(path.join(directoryPath, f));
                    const json: any = JSON.parse(buffer);

                    metadataService.add({ Key: json.key, Value: json.sections });
                }
            });
        }
    });

    return Promise.resolve();
};