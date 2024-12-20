import { CacheService } from '../../cache';
import DeliveryOptionsConfiguration from '../../singletons/delivery-options-configuration';
import { Injector } from '../../core/di/injector';
import ProductMappingConfiguration from '../../singletons/product-mapping.configuration';
import { FlakeIdGeneratorService } from '../../singletons/flake-id-generator.service';
import { MediatR } from '../../core/mediator/MediatR';
import { RequestKeyConstants } from '../../constants/request-key.constants';
import { MetadataService } from '../../singletons/metadata.service';
import { CreateOrderHandler, GetSellerByIdHandler, PaymentCompleteHandler, OrderListHandler, GetOrderByIdHandler, UpdateOrderStatusHandler } from '../../cqrs';
import { DownloadFileHandler } from '../../cqrs/handlers/download-file.handler';

export default async () => {    
    CacheService.init();
    Injector.registerSingleton<MetadataService>(MetadataService);
    Injector.registerSingleton<DeliveryOptionsConfiguration>(DeliveryOptionsConfiguration);
    Injector.registerSingleton<ProductMappingConfiguration>(ProductMappingConfiguration);
    Injector.registerSingleton<FlakeIdGeneratorService>(FlakeIdGeneratorService);    
    Injector.registerSingleton<FlakeIdGeneratorService>(FlakeIdGeneratorService);
    Injector.resolveSingleton<DeliveryOptionsConfiguration>(DeliveryOptionsConfiguration).initialize();
    Injector.resolveSingleton<ProductMappingConfiguration>(ProductMappingConfiguration).initialize();
    Injector.resolveSingleton<FlakeIdGeneratorService>(FlakeIdGeneratorService).initialize();

    MediatR.registerHandler(RequestKeyConstants.GET_SELLER_BY_ID_REQUEST, GetSellerByIdHandler);
    MediatR.registerHandler(RequestKeyConstants.CREATE_ORDER_REQUEST, CreateOrderHandler);
    MediatR.registerHandler(RequestKeyConstants.PAYMENT_COMPLETE_REQUEST, PaymentCompleteHandler);

    MediatR.registerHandler(RequestKeyConstants.ORDER_LIST_REQUEST, OrderListHandler);
    MediatR.registerHandler(RequestKeyConstants.GET_ORDER_BY_ID_REQUEST, GetOrderByIdHandler);
    MediatR.registerHandler(RequestKeyConstants.UPDATE_ORDER_STATUS_REQUEST, UpdateOrderStatusHandler)
    MediatR.registerHandler(RequestKeyConstants.PAYMENT_COMPLETE_REQUEST, PaymentCompleteHandler);   
    MediatR.registerHandler(RequestKeyConstants.ORDER_LIST_REQUEST, OrderListHandler);
    MediatR.registerHandler(RequestKeyConstants.GET_ORDER_BY_ID_REQUEST, GetOrderByIdHandler);
    MediatR.registerHandler(RequestKeyConstants.PAYMENT_COMPLETE_REQUEST, PaymentCompleteHandler);   
    MediatR.registerHandler(RequestKeyConstants.ORDER_LIST_REQUEST, OrderListHandler);
    MediatR.registerHandler(RequestKeyConstants.GET_ORDER_BY_ID_REQUEST, GetOrderByIdHandler);
    MediatR.registerHandler(RequestKeyConstants.DOWNLOAD_FILE_REQUEST, DownloadFileHandler);
};
