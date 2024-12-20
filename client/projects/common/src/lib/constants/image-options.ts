import { Options } from 'ngx-image2dataurl';

export const IMAGE_OPTIONS: Options = {
    resize: {
        maxHeight: 150,
        maxWidth: 150
    },
    allowedExtensions: ['JPG', 'JPEG', 'PnG']
};
