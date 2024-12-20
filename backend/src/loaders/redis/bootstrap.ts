import { CollectionConstants } from '../../constants/collection.constants';
import { RequestKeyConstants } from '../../constants/request-key.constants';
import { Injector } from '../../core/di/injector';
import { MediatR } from '../../core/mediator/MediatR';
import { InvoiceGenerateHandler, CreditNoteGenerateHandler } from '../../cqrs';
import { MetadataService } from '../../singletons/metadata.service';
import {
    GetDocumentGenerationContextTask,
    GetCustomerInformationTask,
    GetOrderInformationTask,
    GetSellerInformationTask,
    InitializePdfDocumentTask,
    WritePdfDocumentTask,
    GeneratePdfDocumentFooterTask,
    GeneratePdfDocumentBodyTask,
    GenerateDocumentNumberTask,
    UpdateOrderSetDocumentStateTask,
    SetDocumentGenerationDataStateTask,
    SetStateCompleteTask,
    FilterAndCalculateReturnableTask
} from '../../services/tasks';
import { FlakeIdGeneratorService } from '../../singletons/flake-id-generator.service';
import ProductMappingConfiguration from '../../singletons/product-mapping.configuration';


export default async () => {
    Injector.registerSingleton<MetadataService>(MetadataService);
    Injector.registerSingleton<ProductMappingConfiguration>(ProductMappingConfiguration);
    Injector.registerSingleton<FlakeIdGeneratorService>(FlakeIdGeneratorService);
    Injector.resolveSingleton<ProductMappingConfiguration>(ProductMappingConfiguration).initialize();
    Injector.resolveSingleton<FlakeIdGeneratorService>(FlakeIdGeneratorService).initialize();

    Injector.addToCollection(CollectionConstants.DOCUMENT_TASK_COLLECTION, GetDocumentGenerationContextTask);
    Injector.addToCollection(CollectionConstants.DOCUMENT_TASK_COLLECTION, SetDocumentGenerationDataStateTask);
    Injector.addToCollection(CollectionConstants.DOCUMENT_TASK_COLLECTION, GetCustomerInformationTask);
    Injector.addToCollection(CollectionConstants.DOCUMENT_TASK_COLLECTION, GetOrderInformationTask);
    Injector.addToCollection(CollectionConstants.DOCUMENT_TASK_COLLECTION, GetSellerInformationTask);
    Injector.addToCollection(CollectionConstants.DOCUMENT_TASK_COLLECTION, InitializePdfDocumentTask);
    Injector.addToCollection(CollectionConstants.DOCUMENT_TASK_COLLECTION, GeneratePdfDocumentFooterTask);
    Injector.addToCollection(CollectionConstants.DOCUMENT_TASK_COLLECTION, WritePdfDocumentTask);
    Injector.addToCollection(CollectionConstants.DOCUMENT_TASK_COLLECTION, GeneratePdfDocumentBodyTask);
    Injector.addToCollection(CollectionConstants.DOCUMENT_TASK_COLLECTION, GenerateDocumentNumberTask);
    Injector.addToCollection(CollectionConstants.DOCUMENT_TASK_COLLECTION, UpdateOrderSetDocumentStateTask);
    Injector.addToCollection(CollectionConstants.DOCUMENT_TASK_COLLECTION, SetStateCompleteTask);
    Injector.addToCollection(CollectionConstants.DOCUMENT_TASK_COLLECTION, FilterAndCalculateReturnableTask);

    MediatR.registerHandler(RequestKeyConstants.INVOICE_GENERATE_REQUEST, InvoiceGenerateHandler);
    MediatR.registerHandler(RequestKeyConstants.CREDIT_NOTE_GENERATE_REQUEST, CreditNoteGenerateHandler);
};
