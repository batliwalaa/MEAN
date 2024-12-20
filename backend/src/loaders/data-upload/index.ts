import { ConfigureLogger } from '../common/configure-logger';
import bootstrap from './bootstrap';
import dataUploadManager from './data-upload-manager.worker';

// @ts-ignore
export default async (environment: Environment) => {
    await bootstrap();

    await ConfigureLogger();
    await dataUploadManager();
};
