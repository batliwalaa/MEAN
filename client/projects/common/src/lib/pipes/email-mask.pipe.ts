import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'emailMask',
})
export class EmailMaskPipe implements PipeTransform {
    transform(value: string): any {
        if (value) {
            const emailParts = value.split('@');

            if (emailParts.length === 2) {
                const parts = emailParts[0].split('');
                return `${parts[0]}****${parts[parts.length - 1]}@${emailParts[1]}`;
            }
        }

        return value;
    }
}
