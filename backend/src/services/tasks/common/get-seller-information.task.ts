import { Injectable } from "../../../core/decorators";
import { DocumentGenerationContext } from '../contexts/document-generation.context';
import { DocumentGenerationContextRepository, SellerRepository } from '../../../repositories';
import { BaseTask } from '../../../core/tasks';
import { DocumentGenerationContextModel } from "../../../repositories/models/document-generation-context.model";
import { from } from "rxjs";

@Injectable()
export class GetSellerInformationTask extends BaseTask<DocumentGenerationContext, DocumentGenerationContextModel> {
    constructor(
        DocumentGenerationContextRepository: DocumentGenerationContextRepository,
        private sellerRepository: SellerRepository
    ) {
        super(DocumentGenerationContextRepository);
    }

    public isValid(state: DocumentGenerationContext): boolean { 
        if (state.templateData && !state.templateData.seller) {
            return true;
        }
        return false;
    }

    public async execute(state: DocumentGenerationContext): Promise<DocumentGenerationContext> {
        const s = 
            (({ name, address, stateUTCode, registrationDetails }) => 
                ({ name, address, stateUTCode, registrationDetails }))(await this.sellerRepository.getByID(state.sellerID));

        if (s) {
            const a = this.getAddressAsString(s.address);
            state.templateData.seller = { 
                address: a,
                name: s.name,
                stateUTCode: s.stateUTCode,
                gst: s.registrationDetails.find(r => r.Key === 'GST'),
                pan: s.registrationDetails.find(r => r.Key === 'PAN No')
             };
             state.templateData.supplyState = s.address.state;
        }

        await this.contextRepository.save(state)

        return state;
    }
}