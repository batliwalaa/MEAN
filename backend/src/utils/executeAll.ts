import camelize from './camelCase'
import { CacheService } from '../cache';
import { Response } from 'express';

const executeAll =  async function<T>(
        res: Response, 
        cacheKey: string,
        ttlInSeconds: number,
        funcs: Array<() => Promise<T>>,
        aggregator: (data: Array<any>) => Promise<T>,
        filter: (data: T) => Promise<T> = undefined) : Promise<void> {

    const promises: Array<Promise<any>> = [];

    funcs.forEach(async (f, index) => {
        promises.push(CacheService.GetSet<T>(`${cacheKey}.${index}`, ttlInSeconds, f));
    })

    const resultItems = await Promise.all(promises);

    let aggregatedData = await aggregator(resultItems);        

    if (filter) {
        aggregatedData = await filter(aggregatedData);
    }

    res.json(camelize(aggregatedData)).end();

    return Promise.resolve();
}

export default executeAll;