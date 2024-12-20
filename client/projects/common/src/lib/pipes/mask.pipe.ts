import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'mask',
})
export class MaskPipe implements PipeTransform {
    transform(value: string, numberOfLastCharactersToDisplay: number, email: boolean = false): any {
        if (value) {
            if (!email && value.length >= numberOfLastCharactersToDisplay) {
                return `****${value.substr(value.length - numberOfLastCharactersToDisplay)}`;
            } else if (email) {
                return `****${value.substr(value.indexOf('@'))}`;
            }
        }
        return value;
    }
}
