import { StringConstants } from '../constants/string-constants';

export class PubSubChannelKeys {
    public static get CacheLoaderChannel(): string {
        return StringConstants.CACHE_LOADER;
    }

    public static get VerificationChannel(): string {
        return StringConstants.VERIFICATION;
    }

    public static get EmailChannel(): string {
        return StringConstants.EMAIL;
    }

    public static get DeliverySlotManagerChannel(): string {
        return StringConstants.DELIVERY_SLOT_MANAGER;
    }

    public static get InvoiceGenerateChannel(): string {
        return StringConstants.INVOICE_GENERATE;
    }

    public static get CreditNoteGenerateChannel(): string {
        return StringConstants.CREDIT_NOTE_GENERATE;
    }
}
