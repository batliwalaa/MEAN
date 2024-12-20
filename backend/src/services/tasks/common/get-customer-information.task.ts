import { AddressService, UserService } from "../..";
import { Injectable } from "../../../core/decorators";
import { Address } from "../../../models";
import { DocumentGenerationContextRepository } from '../../../repositories';
import { BaseTask } from '../../../core/tasks';
import { DocumentGenerationContext } from '..';
import { DocumentGenerationContextModel } from "../../../repositories/models/document-generation-context.model";

@Injectable()
export class GetCustomerInformationTask extends BaseTask<DocumentGenerationContext, DocumentGenerationContextModel> {  
    constructor(
        DocumentGenerationContextRepository: DocumentGenerationContextRepository,
        private addressService: AddressService,
        private userService: UserService,
    ) {
        super(DocumentGenerationContextRepository)
    }

    public isValid(state: DocumentGenerationContext): boolean { 
        if (state.addressID && state.templateData && !state.templateData.shipping) {
            return true;
        }

        return false;
    }

    public async execute(state: DocumentGenerationContext): Promise<DocumentGenerationContext> {
        const address: Address = await this.addressService.get(state.addressID);
        const user = await this.userService.getUserById(state.userID);
        
        state.templateData.deliveryState = address.state;
        state.templateData.billing = this.getAddressAsString(address);
        state.templateData.shipping = this.getAddressAsString(address);
        state.customerName = `${user.firstName} ${user.lastName}`;

        await this.contextRepository.save(state);

        return state;
    }
}