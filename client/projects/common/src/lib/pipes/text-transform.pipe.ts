import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'textTransform',
})
export class TextTransformPipe implements PipeTransform {
    transform(value: string): any {
        if (value) {
            return value.replace(/([A-Z])/g, ' $1').trim();
        }
        return value;
    }
}
