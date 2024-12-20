import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ToastrModule } from 'ngx-toastr';
import { ImageToDataUrlDirective } from 'ngx-image2dataurl';

import { DeviceInfoDirective } from './directives/device-info.directive';
import { CheckAllInputsValidDirective } from './directives/check-all-inputs-valid.directive';
import { CheckIsValidDirective } from './directives/check-is-valid.directive';
import { OutsideClickDirective } from './directives/outside-click.directive';
import { EqualValidator } from './directives/validate-equal.directive';
import { RecaptchaDirective } from './directives/recaptcha.directive';
import { WINDOW_PROVIDERS } from './services/window.service';

import { CheckboxComponent } from './component/common/input/checkbox/checkbox.component';
import { ConfirmTextboxComponent } from './component/common/input/confirm-textbox/confirm.textbox.component';
import { DropdownComponent } from './component/common/input/dropdown/dropdown.component';
import { NumberComponent } from './component/common/input/number/number.component';
import { TextboxComponent } from './component/common/input/textbox/textbox.component';
import { TextAreaComponent } from './component/common/input/textarea/textarea.component';
import { AddressEntryComponent } from './component/address/address-entry/address-entry.component';
import { StatementComponent } from './component/common/statement/statement.component';
import { AddressDisplayComponent } from './component/address/address-display/address-display.component';
import { RadioComponent } from './component/common/input/radio/radio.component';
import { RecaptchaProtectedComponent } from './component/common/recaptcha/recaptcha-protected.component';
import { MaskPipe } from './pipes/mask.pipe';
import { EmailMaskPipe } from './pipes/email-mask.pipe';
import { TextTransformPipe } from './pipes/text-transform.pipe';
import { RatingReviewComponent } from './component/review/rating/rating-review.component';
import { ReviewSummaryComponent } from './component/review/summary/review-summary.component';
import { FeatureReviewComponent } from './component/review/feature/feature-review.component';
import { BackComponent } from './component/back/back.component';
import { LanguageSelectorComponent } from './component/language-selector/language-selector.component';
import { AddressPreviewComponent } from './component/address/address-preview/address-preview.component';
import { BreadCrumbComponent } from './component/breadcrumb/breadcrumb.component';
import { LikeDislikeComponent } from './component/like-dislike/like-dislike.component';
import { CarouselComponent, CarouselItemElement } from './component/carousel/carousel.component';
import { CarouselItemDirective } from './directives/carousel-item.directive';
import { LightboxComponent } from './component/lightbox/lightbox.component';
import { StarComponent } from './component/review/star-rating/child-components/star-component/star.component';
import { StarRatingComponent } from './component/review/star-rating/star-rating.component';

@NgModule({
    declarations: [
        DeviceInfoDirective,
        CheckAllInputsValidDirective,
        CheckIsValidDirective,
        CheckboxComponent,
        ConfirmTextboxComponent,
        DropdownComponent,
        NumberComponent,
        TextboxComponent,
        AddressEntryComponent,
        AddressDisplayComponent,
        StatementComponent,
        TextAreaComponent,
        RadioComponent,
        OutsideClickDirective,
        EqualValidator,
        MaskPipe,
        EmailMaskPipe,
        RecaptchaDirective,
        RecaptchaProtectedComponent,
        TextTransformPipe,
        RatingReviewComponent,
        ReviewSummaryComponent,
        BackComponent,
        LanguageSelectorComponent,
        AddressPreviewComponent,
        BreadCrumbComponent,
        FeatureReviewComponent,
        LikeDislikeComponent,
        CarouselComponent,
        CarouselItemDirective,
        CarouselItemElement,
        LightboxComponent,
        StarComponent,
        StarRatingComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ToastrModule.forRoot(),
        ImageToDataUrlDirective
    ],
    providers: [
        DeviceDetectorService,
        CheckAllInputsValidDirective,
        CheckIsValidDirective,
        WINDOW_PROVIDERS,
        OutsideClickDirective,
        EqualValidator,
        MaskPipe,
        EmailMaskPipe,
        RecaptchaDirective,
        TextTransformPipe
    ],
    exports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ImageToDataUrlDirective,
        DeviceInfoDirective,
        CheckIsValidDirective,
        CheckAllInputsValidDirective,
        CheckboxComponent,
        ConfirmTextboxComponent,
        DropdownComponent,
        NumberComponent,
        TextboxComponent,
        AddressEntryComponent,
        AddressDisplayComponent,
        StatementComponent,
        TextAreaComponent,
        RadioComponent,
        OutsideClickDirective,
        EqualValidator,
        MaskPipe,
        EmailMaskPipe,
        RecaptchaDirective,
        RecaptchaProtectedComponent,
        ToastrModule,
        TextTransformPipe,
        RatingReviewComponent,
        ReviewSummaryComponent,
        BackComponent,
        LanguageSelectorComponent,
        AddressPreviewComponent,
        BreadCrumbComponent,
        FeatureReviewComponent,
        LikeDislikeComponent,
        CarouselComponent,
        CarouselItemDirective,
        CarouselItemElement,
        LightboxComponent,
        StarComponent,
        StarRatingComponent
    ],
})
export class CommonAppModule {}
