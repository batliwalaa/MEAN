import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SearchStateService {
    public clearQuickSearch$: Subject<void>  = new Subject();
}