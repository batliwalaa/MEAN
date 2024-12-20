import fs from 'fs';
import path from 'path';
import { Injectable } from '../../../core/decorators';
import { BasePdfTask } from '../../../core/tasks';
import { DocumentGenerationContext } from '..';
import INVOICE_PATH from '../../../constants/invoice-path.constant';
import CREDIT_NOTE_PATH from '../../../constants/credit-note-path.constants';
import { FlakeIdGeneratorService } from '../../../singletons/flake-id-generator.service';
import { Injector } from '../../../core/di/injector';
import { FileService } from '../..';
import { TaskState } from '../../../core/tasks';

@Injectable()
export class WritePdfDocumentTask extends BasePdfTask<DocumentGenerationContext> {
    private idGeneratorService: FlakeIdGeneratorService;
    constructor (
        private fileService: FileService,
    ) {
        super();
        this.idGeneratorService = Injector.resolveSingleton<FlakeIdGeneratorService>(FlakeIdGeneratorService);

        if (!this.idGeneratorService.isInitialised) {
            this.idGeneratorService.initialize();
        }
    }

    public isValid(state: DocumentGenerationContext): boolean {
        return !!state.document && state.taskState == TaskState.Running;
    }

    public async execute(state: DocumentGenerationContext): Promise<DocumentGenerationContext> {
        //@ts-ignore
        const id: string = this.idGeneratorService.next();
        const document = state.document;
        const documentPath = state.contextType === 'Invoice' ? INVOICE_PATH : CREDIT_NOTE_PATH;

        document.end();

        this.fileService.createDirectoriesIfNotExist([documentPath]);
        document.pipe(fs.createWriteStream(path.join(documentPath, `${id}.pdf`)));
        state.fileName = `${id}.pdf`;
        delete state.document;

        return state;
    }
}         
            