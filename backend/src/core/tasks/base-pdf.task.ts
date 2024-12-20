import { PDFTaskContext } from "../../services/tasks";
import { isEmptyOrWhiteSpace } from "../utils";
import amountToWords from "../../utils/amount-to-words";
import { Logger } from "../structured-logging/logger";
import { Logging } from "../structured-logging/log-manager";
import { MetadataKeyConstants } from "../../constants/metadata-key.constants";

export abstract class BasePdfTask<T extends PDFTaskContext> {
    protected readonly logger: Logger = Logging.getLogger(this.constructor.name);
    constructor () {
    }

    public abstract isValid(state: T): boolean;
    public abstract execute(state: T): Promise<T>;
    
    public async process(state: T): Promise<T> {
        if (!state.continue) return state;

        try {
            return await this.execute(state);
        } catch(e) {
            state.failed = true;
            this.logger.error(`ERROR: PDF generate task failed - contextID: ${state._id.toString()}, contextType: ${state.contextType}`, { ...state, action: 'process' }, e);
            state.continue = false;
        }

        return state;
    }

    protected getWidth(widthKey: string, documentPage: PDFKit.PDFPage): number {
        if (widthKey === 'PageWidth') {
            return documentPage.width;
        }

        return Number(widthKey);
    }

    protected getValue(key: any, value: string, state: any): any {
        if (!Array.isArray(key) && isEmptyOrWhiteSpace(key)) {
            return value;
        }
        let keyParts: Array<string> = [];
        if (Array.isArray(key)) {
            keyParts = key;
        } else {
            keyParts.push(key);
        }

        for (const k of keyParts) {
            if (k.startsWith('[')) {
                const d = this.getStaticData(k);
                value = value.replace(k, d ?? '');
            } else if (k.startsWith('{{')) {
                const d = this.getData(k, state);
                value = value.replace(k, d ?? '');
            }
        }
        
        return value;
    }

    protected getStaticData(key: string): string {
        const now = new Date();
        switch(key) {
            case '[DATE_UTC]':                
                return `${now.getUTCFullYear()}-${(now.getUTCMonth() + 1).toString().padStart(2, '0')}-${now.getUTCDate().toString().padStart(2, '0')} ${now.getUTCHours().toString().padStart(2, '0')}:${now.getUTCMinutes().toString().padStart(2, '0')}:${now.getUTCSeconds().toString().padStart(2, '0')}`;
            case '[DATE]':
                return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
            default:
                return '';
        }
    }

    protected getData(propertyPath: string, state: T): any {
        const propertyPathParts = propertyPath.replace('{{', '').replace('}}', '').split('.');

        let current: any = state;
        for (const property of propertyPathParts) {
            current = current[property];

            if (!current) {
                break;
            }
        }

        return !current ? null : current;
    }
    
    protected getFormattedValue(format: string, formatter: string, value: any): string {
        let fValue = value;
        switch(formatter.toLowerCase()) {
            case 'date':
                fValue = this.getDateFormattedValue(format, value);
                break;
            case 'currency':
                fValue = this.getCurrencyFormattedValue(format, value);
                break;
            case 'amounttowords':
                fValue = amountToWords(value);
            default:
                break;
        }
        

        return fValue;
    }

    protected ensurePage(document: PDFKit.PDFDocument): boolean {
        if (document.y >= document.page.height - 65) {
            document.addPage();
            document.y = 65;
            document.moveDown();
            return true;
        }
        return false;
    }

    protected splitString(document:PDFKit.PDFDocument, str: string, width: number): Array<string> {
        const output: Array<string> = [];        
        let parts = str.split(' ');
        let value: string = '';

        while(parts && parts.length > 0) {
            const valueWidth = document.widthOfString(value + (value.length == 0 ? '' : ' ') + parts[0]);

            if (valueWidth <= width) {
                value += (value.length == 0 ? '' : ' ') + parts[0];
            } else  {
                output.push(value);
                value = parts[0];
            }

            parts = parts.slice(1);
        }
        if (value.length > 0) output.push(value);

        return output;
    }

    protected documentKey(contextType: string): string {
        return contextType === 'Invoice' ? MetadataKeyConstants.INVOICE_TEMPLATE : MetadataKeyConstants.CREDIT_NOTE_TEMPLATE;
    }

    private getDateFormattedValue(format: string, value: any): string {
        let fValue = value;

        switch(format) {
            case 'DD/MM/YYYY':
                const dt = new Date(value);
                fValue = `${dt.getDate().toString().padStart(2, '0')}/${(dt.getMonth()+1).toString().padStart(2, '0')}/${dt.getFullYear().toString().padStart(2, '0')}`
                break;
            default:
                break;
        }

        return fValue;
    }

    private getCurrencyFormattedValue(format: string, value: any): string { 
        return Number(value).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
}
