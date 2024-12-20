export class RouteKeys {
    public static get CheckoutDeliveryOptions(): string {
        return '../checkout/delivery/options';
    }

    public static get CheckoutDeliverySlots(): string {
        return '../checkout/delivery/slots';
    }

    public static get CheckoutAddressAdd(): string {
        return '../checkout/address/add';
    }

    public static get CheckoutPreview(): string {
        return '../checkout/preview';
    }

    public static get Signin(): string {
        return '/signin';
    }

    public static get Home(): string {
        return '../home';
    }

    public static get Checkout(): string {
        return 'checkout';
    }

    public static get ShoppingCart(): string {
        return '/shoppingcart';
    }

    public static get Register(): string {
        return '../customer/register';
    }

    public static get PaymentSuccess(): string {
        return '../checkout/payment/success';
    }

    public static get PaymentFailure(): string {
        return '../checkout/payment/failure';
    }

    public static get PaymentCancel(): string {
        return '../checkout/payment/cancel';
    }

    public static get ErrorFatal(): string {
        return '/error/fatal';
    }

    public static get ErrorPayment(): string {
        return '/error/payment';
    }

    public static get VerifyOtp(): string {
        return '/customer/verifyotp';
    }

    public static get ForgotPassword(): string {
        return '/customer/forgotpassword';
    }

    public static get PasswordReset(): string {
        return '/customer/passwordreset';
    }

    public static get ProductDetail(): string {
        return `/product/detail/`;
    }
    
    public static get ProductList(): string {
        return `/product/list/`;
    }

    public static get NotSupportedOrientation(): string {
        return '/notsupportedorientation';
    }

    public static get AccountHome(): string {
        return '/account/home';
    }

    public static get AccountOrders(): string {
        return '/account/orders';
    }

    public static get AccountProfile(): string {
        return '/account/profile';
    }

    public static get AccountOrderDetail(): string {
        return '/account/order/';
    }

    public static get AccountLoyaltyPoints(): string {
        return '/account/loyaltypoints';
    }

    public static get AccountProfileAccess(): string {
        return '/account/profile/access'
    }

    public static get AccountAddresses(): string {
        return '/account/addresses'
    }
}
