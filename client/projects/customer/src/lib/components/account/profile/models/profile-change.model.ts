import { ProfileChangeProperty } from "../../../../../../../typings/custom";

export interface ProfileChange {
    otp?: string;
    email?: string;
    mobile?: number;
    isoCode?: string;
    type?: ProfileChangeProperty
}