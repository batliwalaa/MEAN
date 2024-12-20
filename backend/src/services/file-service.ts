import { Injectable } from "../core/decorators";
import fs from 'fs';
import path from 'path';

import { FileInfo } from "../models";
import { FlakeIdGeneratorService } from "../singletons/flake-id-generator.service";
import { Injector } from "../core/di/injector";
import IMAGE_PATH from '../constants/image-path.constant';

@Injectable()
export class FileService {
    private idGeneratorService: FlakeIdGeneratorService;

    constructor () {
        this.idGeneratorService = Injector.resolveSingleton<FlakeIdGeneratorService>(FlakeIdGeneratorService);

        if (!this.idGeneratorService.isInitialised) {
            this.idGeneratorService.initialize();
        }
    }

    public async saveImageFile(pathDirectories: Array<string>, fileInfo: FileInfo): Promise<string> {
        pathDirectories.unshift(IMAGE_PATH);
        const [filePath, directory] = this.createDirectoriesIfNotExist(pathDirectories);

        const id: string = this.idGeneratorService.next();
        const fileName = path.resolve(directory, `${id}.${fileInfo.type}`)

        fs.writeFileSync(fileName, Buffer.from(fileInfo.buffer));
        
        const url = `${process.env.API_SITE}/resource/images${filePath}/${id}.${fileInfo.type}`;

        return await Promise.resolve(url);
    }

    public async removeImageFile(pathDirectories: Array<string>, fileName: string): Promise<void> {
        let directory: string = '';
        pathDirectories.unshift(IMAGE_PATH);

        for (let i = 0; i < pathDirectories.length; i++) {
            directory = `${directory}${directory === '' ?'' : '/'}${pathDirectories[i]}`;
        }

        fs.unlinkSync(path.resolve(directory, fileName));
    }

    public createDirectoriesIfNotExist(pathDirectories: Array<string>): Array<string> {
        let filePath: string = '';
        let directory: string = '';

        for (let i = 0; i < pathDirectories.length; i++) {
            if (!fs.existsSync(`${directory}${directory === '' ?'' : '/'}${pathDirectories[i]}`)) {
                fs.mkdirSync(`${directory}${directory === '' ?'' : '/'}${pathDirectories[i]}`);
            }
            filePath = i == 0 ? '' : `${filePath}/${pathDirectories[i]}`;
            directory = `${directory}${directory === '' ?'' : '/'}${pathDirectories[i]}`;
        }

        return [filePath, directory];
    }
}