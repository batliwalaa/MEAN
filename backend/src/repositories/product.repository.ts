import { ProductCollection } from './collections';
import { ProductItemModel } from './models/product-item.model';
import { SearchMap } from '../models/search-map';
import { ProductDetail } from '../models/product-detail';
import { Injectable } from '../core/decorators';
import { Model, Types } from 'mongoose';
import { Product, ProductRating } from '../models';
import { isEmptyOrWhiteSpace } from '../core/utils';
import { Injector } from '../core/di/injector';
import ProductMappingConfiguration from '../singletons/product-mapping.configuration';

@Injectable()
export class ProductRepository {
    private pageSize: number;
    private productCollection: Model<ProductItemModel, any>;

    constructor(
        // @ts-ignore
        environment: Environment
    ) {
        this.pageSize = environment.pageSize;
        if (!this.pageSize) {
            this.pageSize = 25;
        }
        this.productCollection = ProductCollection();
    }

    public getAll(): Promise<Array<ProductItemModel>> {
        return this.productCollection.find().exec();
    }

    public async getProductByType(type: string, pageNumber: number = 1): Promise<Array<ProductItemModel>> {
        return await this.search(pageNumber, { types: [type] });
    }

    public async getProductById(id: string): Promise<ProductItemModel> {
        return await this.productCollection.findById(id).exec();
    }

    public async quickSearch(pageNumber: number, term: string): Promise<Array<ProductItemModel>> {
        const regExp = new RegExp(`${term}`, 'i');
        let query = this.productCollection.aggregate([
            { $match: { $or: [{ type: regExp, active: true }, { brand: regExp, active: true }, { 'details.value': regExp, active: true }] } },
            {
                $project: {
                    _id: 0,
                    type: '$type',
                    brand: '$brand',
                    sellerID: '$sellerID',
                    pricing: {
                        retail: '$pricing.retail',
                        discountpercent: '$pricing.discountPercent',
                    },
                    description: '$description',
                },
            },
        ]);

        if (!isNaN(pageNumber)) {
            query = query.skip((pageNumber - 1) * Number(this.pageSize));
        }

        return await query.limit(Number(this.pageSize)).exec();
    }

    public async search(
        pageNumber: number,
        search: SearchMap,
        projection: any = { 
            _id: 1,
            lob: 1,
            type: 1,
            subType: 1,
            brand: 1,
            title:1,
            details: 1,
            pricing: 1,
            reviewSummary: 1,
            images: 1,
            bestSeller: 1,
            country:1,
            sellerID: 1
        }
    ): Promise<Array<ProductItemModel>> {
        const isTextSearch = search && !isEmptyOrWhiteSpace(search.searchString);
        const skip = (pageNumber - 1) * Number(this.pageSize);
        const queryObject = isTextSearch ? this.getTextSearchQuery(search) : this.getQueryObject(search);      
        
        if (!queryObject) {
            return [];
        }
        
        const aggregation: Array<any> = [];
        let filter: any;
        if (isTextSearch && (search.lob || search.brands || search.types || search.subTypes || search.filters || search.description)) {
            filter = this.getTextSearchFilterObject(search);
        }

        aggregation.push(queryObject);
        if (isTextSearch) {
            projection['score'] = { $meta: 'textScore' };
            aggregation.push({ $sort: { score: { $meta: 'textScore' } }});
        }
        aggregation.push({ $project: projection });
        if (filter) {
            aggregation.push(filter);
        }        
        aggregation.push({ $skip: skip });
        aggregation.push({ $limit: Number(this.pageSize)});

        let query = this.productCollection.aggregate(aggregation);

        const items = await query.exec();

        return items;
    }

    public async getSizes(productID: string): Promise<Array<Product>> {
        const model: any = await this.getProductById(productID);
        const product: Product = model._doc ? model._doc : model;
        const searchMap: SearchMap = { lob: product.lob, subTypes: [product.subType], types: [product.type], brands: [product.brand], description: product.title };

        return await this.search(1, searchMap, { _id: 1, pricing: 1, description: 1, sellerID: 1, details: 1 });
    }

    public async getFilters(type: string, brand?: string, subType?: string): Promise<Array<ProductDetail>> {
        const queryObject = this.getFilterAggregateQueryObject(type, brand, subType);

        const items = await this.productCollection.aggregate(queryObject).exec();

        return items;
    }

    public async getBrandsForSearchMap(search: SearchMap): Promise<Array<any>> {
        return await this.getDistinctFilterFor(search, 'brand');
    }

    public async getSubTypeForSearchMap(search: SearchMap): Promise<Array<any>> {
        return await this.getDistinctFilterFor(search, 'subType');
    }

    public async getProductFilters(searchMap: SearchMap): Promise<Array<{key: string, values: Array<string> }>> {
        const isTextSearch = searchMap && !isEmptyOrWhiteSpace(searchMap.searchString);        
        const $match = isTextSearch ? this.getTextSearchQuery(searchMap) : this.getQueryObject(searchMap);

        if (!$match) return [];

        let query: any = [
            $match,
            { $unwind: '$details' },
            { $project: { _id: 0, value: '$details.value', filter: '$details.filter', title: '$details.title' } },
            {
                $redact: {
                    $cond: { if: { $in: [{ $ifNull: ['$filter', false] }, [false]] }, then: '$$PRUNE', else: '$$KEEP' }
                },
            },
            { $group: { _id: '$title', list: { $addToSet: '$value' } } },
        ];

        if (isTextSearch) {
            query.push({ $sort: { score: { $meta: 'textScore' } }});
        }

        const data = await this.productCollection.aggregate(query).exec();

        if (Array.isArray(data) && data.length >= 1) {
            const filters: Array<{key: string, values: Array<string> }> = [];
            for (let i = 0; i < data.length; i++) {
                if (Array.isArray(data[i].list) && data[i].list.length > 0) {
                    filters.push({ key: data[i]._id, values: data[i].list });
                }
            }
            return filters;
        }

        return [];
    }

    public async updateReviewSummary(
        productID: string,
        totalRatings: number,
        avarageRating: number,
        ratingSummary: Array<{ productRating: ProductRating, value: number }>
    ): Promise<void> {
        await this.productCollection.collection.updateOne(
            { _id: Types.ObjectId(productID) },
            { $set: { reviewSummary: {
                productID,
                totalRatings,
                avarageRating,
                ratingSummary
            } }},
            { bypassDocumentValidation: true }
        );
    }

    private getQueryObject(search: SearchMap): any {
        const $andArray: any = [{ active: true }];
        
        if (search.category) {
                const kvp = this.getProductMap(search);
                const map: any = {}
                
                if (!kvp) return null;

                map[kvp.key] =  kvp.value;
                $andArray.push(map);
        }

        if (search.lob) {
            $andArray.push({ lob: new RegExp(`^.*${search.lob}.*$`, 'im')});
        }

        if (Array.isArray(search.types) && search.types.length > 0) {
            const $inArray = [];
            for (let i = 0; i < search.types.length; i++) {
                $inArray.push( new RegExp(`^.*${search.types[i]}.*$`, 'im'));
            }
            
            $andArray.push  ({ type: { $in: $inArray } });
        }

        if (Array.isArray(search.subTypes) && search.subTypes.length > 0) {
            const $inArray = [];
            for (let i = 0; i < search.subTypes.length; i++) {
                $inArray.push(new RegExp(`^.*${search.subTypes[i]}.*$`, 'im'));
            }
            
            $andArray.push  ( { subType: { $in: $inArray } });
        }

        if (Array.isArray(search.brands) && search.brands.length > 0) {
            const $inArray = [];
            for (let i = 0; i < search.brands.length; i++) {
                $inArray.push(new RegExp(`^.*${search.brands[i]}.*$`, 'im'));
            }
            
            $andArray.push  ( { brand: { $in: $inArray } });
        }

        if (search.description) {
            $andArray.push({ description: new RegExp(`^.*${search.description}.*$`, 'im') });
        }

        if (Array.isArray(search.filters) && search.filters.length > 0) {
            const $titleIn: any = [];
            const $keyValueIn: Array<{key: string, values: Array<any> }> = [];

            for (let i = 0; i < search.filters.length; i++) {
                if ($titleIn.findIndex((v: any) => v === search.filters[i].Key) === -1) {
                    $titleIn.push(search.filters[i].Key);
                    $andArray.push( { 'details.title': RegExp(`^.*${search.filters[i].Key}.*$`, 'im') });        
                }                
                let current = $keyValueIn.find(kv => kv.key === search.filters[i].Key);
                if (!current) {
                    $keyValueIn.push({ key: search.filters[i].Key, values: []});
                    current = $keyValueIn.find(kv => kv.key === search.filters[i].Key);
                }
                current.values.push(new RegExp(`^.*${search.filters[i].Value}.*$`, 'im'));
            }

            for (let i = 0; i < $keyValueIn.length; i++) {
                $andArray.push( { 'details.value': { $in: $keyValueIn[i].values }});
            }
        }

        return $andArray.length === 0 ? null : { $match: { $and: $andArray }};
    }

    private getFilterAggregateQueryObject(type: string, brand?: string, subType?: string): any {
        let query: any = { active: true };

        if (type) {
            query['type'] = new RegExp(`\\b${type}\\b`, 'i');
        }

        if (brand) {
            query['brand'] = new RegExp(`\\b${brand}\\b`, 'i');
        }

        if (subType) {
            query['subType'] = new RegExp(`\\b${subType}\\b`, 'i');
        }

        return [
            { $match: query },
            { $unwind: '$details' },
            { $project: { _id: 0, title: '$details.title', value: '$details.value', filter: '$details.filter' } },
            {
                $redact: {
                    $cond: { if: { $in: [{ $ifNull: ['$filter', false] }, [false]] }, then: '$$PRUNE', else: '$$KEEP' },
                },
            },
            { $group: { _id: '$title', list: { $addToSet: { value: '$value' } } } },
        ];
    }
    
    private getTextSearchQuery(search: SearchMap): any {
        const $andArray: any = [{ active: true }, { $text: { $search: search.searchString } }];

        return { $match: { $and: $andArray } };
    }

    private getTextSearchFilterObject(search: SearchMap): any {
        const query: any = { active: true };
        
        if (search.category) {
            const kvp = this.getProductMap(search);
            query[kvp.key] = kvp.value;
        }

        if (search.lob) {
            query['lob'] = new RegExp(`^.*${search.lob}.*$`, 'im');
        }

        if (Array.isArray(search.types) && search.types.length > 0) {
            const $inArray = [];
            for (let i = 0; i < search.types.length; i++) {
                $inArray.push( new RegExp(`^.*${search.types[i]}.*$`, 'im'));
            }
            
            query['type'] = { $in: $inArray };
        }

        if (Array.isArray(search.subTypes) && search.subTypes.length > 0) {
            const $inArray = [];
            for (let i = 0; i < search.subTypes.length; i++) {
                $inArray.push(new RegExp(`^.*${search.subTypes[i]}.*$`, 'im'));
            }
            
            query['subType'] = { $in: $inArray };
        }

        if (Array.isArray(search.brands) && search.brands.length > 0) {
            const $inArray = [];
            for (let i = 0; i < search.brands.length; i++) {
                $inArray.push(new RegExp(`^.*${search.brands[i]}.*$`, 'im'));
            }
            
            query['brand'] = { $in: $inArray };
        }

        if (search.description) {
            query['title'] = new RegExp(`^.*${search.description}.*$`, 'im');
        }

        if (Array.isArray(search.filters) && search.filters.length > 0) {
            const $titleIn: any = [];
            const $valueIn: any = [];

            for (let i = 0; i < search.filters.length; i++) {
                if ($titleIn.findIndex((v: any) => v === search.filters[i].Key) === -1) {
                    $titleIn.push(search.filters[i].Key);                    
                }                
                $valueIn.push(new RegExp(`^.*${search.filters[i].Value}.*$`, 'im'));
            }

            query['details.title'] = { $in: $titleIn };
            query['details.value']  = { $in: $valueIn };
        }

        return { $match: query };
    }

    private async getDistinctFilterFor(search: SearchMap, key: string): Promise<Array<string>> {
        const projection: any = {};
        const isTextSearch = search && !isEmptyOrWhiteSpace(search.searchString);
        const queryObject = isTextSearch ? this.getTextSearchQuery(search) : this.getQueryObject(search);
        
        if (!queryObject) return [];
        
        const aggregation: Array<any> = [];

        projection[key] = 1;
        
        aggregation.push(queryObject);        
        aggregation.push({ $project: projection });
        aggregation.push({ $group: { _id: 0, brands: { $addToSet: '$' + key }}});

        let query = this.productCollection.aggregate(aggregation);

        const items: any = await query.exec();

        return Array.isArray(items) && items.length === 1 ? items[0].brands : [];
    }

    private getProductMap(search: SearchMap): { key: string, value: any } {
        const mappings = Injector.resolveSingleton<ProductMappingConfiguration>(ProductMappingConfiguration).mappings;
        const mapping = mappings.find(m => m.key === 'category' && m.value.toLowerCase() === search.category.toLowerCase());

        if (mapping && mapping.map && mapping.map.key && Array.isArray(mapping.map.values) && mapping.map.values.length > 0) {
            const $inArray: Array<any> = [];

            for (let i = 0; i < mapping.map.values.length; i++) {
                $inArray.push(new RegExp(`^.*${mapping.map.values[i]}.*$`, 'im'));
            }
                            
            return { key: mapping.map.key, value: { $in: $inArray } };
        }

        return null;
    }
}
