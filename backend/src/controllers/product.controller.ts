import { Catch, Controller, Get, Injectable, Post, Validator } from '../core/decorators';
import { ProductService } from '../services/product.service';
import { ModelBinder } from '../core/decorators/model.binder.decorator';
import { ApiController } from './api.controller';
import { ProductSearchValidator } from '../validators/product.search.validator';
import { ProductValidator } from '../validators/product-validator';
import { ProductQuickSearchValidator } from '../validators/product-quick-search-validator';
import { ProductTypeValidator } from '../validators/product-type-validator';
import { IdValidator } from '../validators/id-validator';

@Injectable()
@Controller('/product')
export default class ProductController extends ApiController {
    constructor(private productService: ProductService) {
        super();
    }

    @Get('/filters/type/:type/brand/:brand/subtype/:subtype')
    @Catch()
    @ModelBinder(['type', 'brand', 'subtype'])
    @Validator(ProductValidator)
    async getFilterByTypeAndBrandAndSubtype(type: string, brand: string, subtype: string) {
        const result = await this.productService.getFilters(type, brand, subtype);

        return this.Ok(result);
    }

    @Get('/filters/type/:type/brand/:brand')
    @Catch()
    @ModelBinder(['type', 'brand'])
    @Validator(ProductValidator)
    async getFilterByTypeAndBrand(type: string, brand: string) {
        const result = await this.productService.getFilters(type, brand);

        return this.Ok(result);
    }

    @Get('/filters/type/:type')
    @Catch()
    @ModelBinder(['type'])
    @Validator(ProductValidator)
    async getFilterByType(type: string) {
        const result = await this.productService.getFilters(type);

        return this.Ok(result);
    }

    @Get('/:id')
    @Catch()
    @ModelBinder(['id'])
    @Validator(IdValidator)
    async getById(id: string) {
        const result = await this.productService.getProductById(id);

        return this.Ok(result);
    }

    @Get('/:type/:pn')
    @Catch()
    @ModelBinder(['type', 'pn::number'])
    @Validator(ProductTypeValidator)
    async getByType(type: string, pn: number) {
        const result = await this.productService.getProductByType(type, pn);

        return this.Ok(result);
    }

    @Get('/search/:term/:pn')
    @Catch()
    @ModelBinder(['term', 'pn::number'])
    @Validator(ProductQuickSearchValidator)
    async quickSearch(pn: number, term: string) {
        const result = await this.productService.quickSearch(term, pn);

        return this.Ok(result);
    }

    @Get('/search/map/:pn/:query')
    @Catch()
    @ModelBinder(['pn::number', 'query::string'])
    @Validator(ProductSearchValidator)
    async search(pn: number, query: string) {
        const searchMap = JSON.parse(Buffer.from(query, 'base64').toString('utf-8'));
        const result = await this.productService.search(searchMap, pn);

        return this.Ok(result);
    }

    @Get('/id/:productID/sizes')
    @Catch()
    @ModelBinder(['productID::string'])
    @Validator(IdValidator)
    async sizes(productID: string) {
        const result = await this.productService.getSizes(productID);

        return this.Ok(result);
    }



    /* @Post('/search/:pn')
    @Catch()
    @ModelBinder(['pn::number', '@FromBody::searchMap'])
    @Validator(ProductSearchValidator)
    async searchByPost(pn: number, searchMap: SearchMap) {
        const result = await this.productService.search(searchMap, pn);

        return this.Ok(result);
    } */
}
