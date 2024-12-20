import { Catch, Controller, Delete, Get, Injectable, Post, Validator } from '../core/decorators';

import { ModelBinder } from '../core/decorators/model.binder.decorator';
import { ApiController } from './api.controller';
import { TokenCookieValidator } from '../cookie-validators/token-cookie.validator';
import { Authorize } from '../core/decorators/authorize.decorator';
import { CookieValidator } from '../core/decorators/cookie-validator.decorator';
import { FileService } from '../services';
import { ActionResult } from '../core/action-results/action-result';
import { UploadProductReviewImageValidator } from '../validators/upload-product-review-image.validator';
import { RemoveProductReviewImageValidator } from '../validators/remove-product-review-image.validator';
import { FileType } from '../models/enums/file-type';
import { MediatR } from '../core/mediator/MediatR';
import { DownloadFileRequest, DownloadFileResponse } from '../cqrs';

@Injectable()
@Controller('/file')
export default class FileController extends ApiController {
    constructor(private fileService: FileService) {
        super();
    }
    
    @Authorize(['customer', 'admin', 'staff'])
    @Post('/product/:productID/review/:reviewID/upload')
    @Catch()
    @CookieValidator(TokenCookieValidator)
    @ModelBinder(['productID::string', 'reviewID::string'])
    @Validator(UploadProductReviewImageValidator)
    public async uploadReviewImageForProduct(productID: string, reviewID:string): Promise<ActionResult> {
        // @ts-ignore
        const path = await this.fileService.saveImageFile([productID, reviewID], this.request.file);

        return this.Ok({ url: path });
    }
    
    @Authorize(['customer', 'admin', 'staff'])
    @Delete('/product/:productID/review/:reviewID/:fileName')
    @Catch()
    @CookieValidator(TokenCookieValidator)
    @ModelBinder(['productID::string', 'reviewID::string', 'fileName::string'])
    @Validator(RemoveProductReviewImageValidator)
    public async removeReviewImageForProduct(productID: string, reviewID:string, fileName: string): Promise<ActionResult> {
        // @ts-ignore
        const path = await this.fileService.removeImageFile([productID, reviewID], fileName);

        return this.Ok();
    }

    
    @Authorize(['customer', 'admin', 'staff'])
    @Get(['/order/:orderID/type/:fileType'])
    @Catch()
    @CookieValidator(TokenCookieValidator)
    @ModelBinder(['orderID::string', 'fileType::string'])
    async downloadFile(orderID: string, type: string): Promise<ActionResult> {       
        const fileType = type === FileType.Invoice ? FileType.Invoice : FileType.CreditNote;     
        const response: DownloadFileResponse = await MediatR.send(new DownloadFileRequest(
            this.request.session.userID, orderID,  fileType
        ));

        return response.fileStream ? this.File(response.filename, response.fileStream) : this.NotFound({ message: response.fileStatus });
    }

}
