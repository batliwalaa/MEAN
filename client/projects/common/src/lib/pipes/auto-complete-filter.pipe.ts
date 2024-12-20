import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'autoCompleteFilter'
})
export class AutoCompleteFilterPipe implements PipeTransform{
    transform(items: Array<any>, searchTerm: string, labelKey?: string) {
        if (!items || !searchTerm) {
            return items;
        }

        return items.filter(i => i[labelKey || 'label'].toLowerCase().includes(searchTerm.toLowerCase()) === true);
    }
}