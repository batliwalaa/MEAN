export interface IConfiguration {
    apiEndpoint: string;
    currencySymbol: string;
    currencyCode: string;
    mode: string;
    resourceEndpoint: string;
    version: string;
    recaptchaSiteKey: string;
    recaptchaSiteUrl: string;
    recaptchaUse: boolean;
    token: {
        aud: string;
        iss: string;
        offset: number;
    };
    country: string;
    countryCode: string;
    language: string;
    localResourcePointEndpoint: string;
    useLocalResourcePointEndpoint: boolean;
    payuBoltScript: string;
    payuBoltLogo: string;
    payuBoltColor: string;
    payuMode: string;
    usePaymentTestData: boolean;
    isDockerDeployed: boolean;
    nonDockerApiEndpoint: string;
    defaultLanguage: string;
    showReview: boolean;
    selectedLanguage: string;
    loyaltyPoints: boolean;
    productSupport: boolean;
    returnItems: boolean;
    reviewLimit: number;
    showCountryOfOrigin: boolean;
    showAllTaxInclusive: boolean;
}
