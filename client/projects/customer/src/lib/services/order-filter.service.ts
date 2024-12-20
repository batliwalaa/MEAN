import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class OrderFilterService {
    public getFilter(filter: string): { from: number, to: number } {
        const today = new Date(Date.now());
        let dates: any = {};

        switch(filter) {
            case 'last 30 days':
                dates['to'] = new Date(new Date(Date.now()).toDateString());
                dates['from'] = new Date(today.setMonth(today.getMonth() - 1));
                break;
            case 'past 3 months':
                dates = this.getFilterDates(today, 3);
                break;
            case 'past 6 months':
                dates = this.getFilterDates(today, 6);
                break;
            default:
                const d = this.getFilterDates(today, 7);
                dates['to'] = new Date(d.from.getFullYear(), d.from.getMonth(), new Date(d.from.getFullYear(), d.from.getMonth() + 1, 0).getDate());
                break;
        }
        
        return { 
            from: (dates.from ? new Date(dates.from.getFullYear(), dates.from.getMonth(), dates.from.getDate(), 0, 0, 0).getTime() : null),
            to: (dates.to ? new Date(dates.to.getFullYear(), dates.to.getMonth(), dates.to.getDate(), 23, 59, 59).getTime() : null)
        };
    }

    private getFilterDates(today: Date, offset: number): { from: Date, to: Date } {
        const t = new Date(today);
        const f = new Date(today.setMonth(today.getMonth() - (offset - 1)));

        return {
            to: new Date(t.getFullYear(), t.getMonth(), new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate()),
            from: new Date(f.getFullYear(), f.getMonth(), 1)
        };
    }
}
