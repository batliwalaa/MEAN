import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { schedule } from 'node-cron';
import { Logging } from '../../core/structured-logging/log-manager';
import { Logger } from '../../core/structured-logging/logger';
import isEmptyOrWhitespace from '../../core/utils/is-empty-or-whitespace';
import { Product, ProductDetail } from '../../models';
import { ProductCollection } from '../../repositories/collections';

export default async () => {
    const logger: Logger = Logging.getLogger('data-upload.worker')
    const productCollection = ProductCollection();

    schedule('* * * * *', async () => {
        const directoryPath = `${__dirname}/../../../src/data-files`;
        fs.readdir(directoryPath, async (error, files) => {            
            if (!error) {
                files.forEach(async (f) => {
                    if (path.extname(f) === '.psv') {
                        let isFirstLine: boolean = true;
                        let columnNames: Array<string>;
                        const file = readline.createInterface({
                            input: fs.createReadStream(`${directoryPath}/${f}`),
                            output: process.stdout,
                            terminal: false
                        });
                        file.on('close', () => {
                            fs.renameSync(`${directoryPath}/${f}`, `${directoryPath}/processed/${f}`);
                        });
                        file.on('line', line => {
                            if (isFirstLine) {
                                columnNames = line.split('|');
                            }
                            if (!isFirstLine && !isEmptyOrWhitespace(line)) {                                
                                const parts = line.split('|');
                                if (parts.length === 15) {
                                    const details: Array<ProductDetail> = [];
                                    let speciality = parts[9].startsWith('[') && parts[9].endsWith(']') ? parts[9].replace('[', '').replace(']', '').split('~') : parts[9];

                                    /*details.push({ title: 'subType', value: parts[3], filter: false, subType: true });
                                    details.push({ title: 'size', value: parts[10], filter: false, subType: false });
                                    details.push({ title: 'pack', value: parts[11], filter: false, subType: false });
                                    details.push({ title: 'sizePack', value: `${parts[10]} ${parts[11]}`, filter: false, subType: false });
                                    details.push({ title: '', value: parts[12], filter: false, subType: false });

                                    if (Array.isArray(speciality)) {
                                        for (let i = 0; i < speciality.length; i++) {
                                            details.push({ title: 'speciality', value: speciality[i], filter: true, subType: false });    
                                        }
                                    } else if (!isEmptyOrWhitespace(speciality)) {
                                        details.push({ title: 'speciality', value: speciality, filter: true, subType: false });
                                    }          */                          

                                    const productItem: Product = {
                                        _id: null,
                                        lob: parts[0],
                                        type: parts[1],
                                        subType: parts[2],
                                        brand: parts[3],
                                        title: parts[4],
                                        pricing: {
                                            list: Number(parts[5]),
                                            retail: Number(parts[6]),
                                            discountPercent: parts[7].includes('%') ? Number(parts[7]) : 0,
                                            savings: isEmptyOrWhitespace(parts[8]) ? 0 : Number(parts[8])
                                        },
                                        bestSeller: false,
                                        details,
                                        country: parts[14],
                                        images: [],
                                        payOnDelivery: false,
                                        shipping: {},
                                        active: true,
                                        test: false,
                                        sellerID: ''
                                    }

                                    const result = productCollection.collection.insertOne(productItem);
                                }
                            }                            
                            isFirstLine = false;
                        });
                    }
                });
            }
        });        
    });
};
