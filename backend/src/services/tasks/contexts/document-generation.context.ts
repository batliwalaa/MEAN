import { PDFTaskContext } from "..";
import { Document } from "../../../models";

export interface DocumentGenerationContext extends PDFTaskContext {
    orderID: string;
    userID: string;    
    addressID?:string;
    sellerID?: string;    
    customerName?: string;
    templateData?: Document  
}
