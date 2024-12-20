import { Directive, forwardRef, Attribute, Inject } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator, ValidationErrors } from '@angular/forms';
import { DOCUMENT } from '@angular/common';

@Directive({
    selector: '[validateEqual]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => EqualValidator),
            multi: true,
        },
    ],
})
export class EqualValidator implements Validator {
    constructor(@Attribute('validateEqual') public validateEqual: string, @Inject(DOCUMENT) private document: any) {}

    validate(control: AbstractControl): ValidationErrors {
        const validateEqualControl: HTMLElement = this.document.querySelector('input[validateequalcontrol]');

        if (validateEqualControl) {
            const controlName = validateEqualControl.getAttribute('validateequalcontrol');
            try {
                const otherControl = this.document.getElementsByName(controlName)[1];

                if (otherControl && otherControl.value !== control.value) {
                    return {
                        validateEqual: control.value,
                    };
                }
            } catch {}
        }
        return null;
    }

    registerOnValidatorChange?(fn: () => void): void {}
}
