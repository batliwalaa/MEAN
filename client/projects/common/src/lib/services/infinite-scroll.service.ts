import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map, pairwise } from 'rxjs/operators';
import { WINDOW } from './window.service';

interface Position {
    scrollHeight: number,
    scrollTop:    number,
    clientHeight: number
}

@Injectable({
    providedIn: 'root'
})
export class InfiniteScrollService {
    private _scrollPercent: number = 80;
    private scrollSubject: Subject<any> = new Subject();

    constructor(
        @Inject(DOCUMENT) private document: any,
        @Inject(WINDOW) private window: Window
    ) {
        this.window.addEventListener('scroll', this.onScroll, true);
    }

    private onScroll = (event: UIEvent): void => this.scrollSubject.next(event.target);

    private isUserScrollingDown = (positions: Array<Position>) => positions[0].scrollTop < positions[1].scrollTop;

    private isScrollExpectedPercent = (position:Position, percent:number) => {
        return (position.scrollTop / position.scrollHeight) > (percent/100);
    }
     
    public get onScrolledDown(): Observable<[Position, Position]> {
        return this.scrollSubject
            .asObservable()
            .pipe(
                map(() => {
                    return <Position>{
                        scrollHeight: this.document.documentElement.scrollHeight,
                        scrollTop: this.document.documentElement.scrollTop || this.document.body.scrollTop,
                        clientHeight: this.document.documentElement.clientHeight
                    }
                })
            ).pipe(pairwise())
            .pipe(filter(positions => {
                const scrollingDown = this.isUserScrollingDown(positions);
                const expectedPercent = this.isScrollExpectedPercent(positions[1], this._scrollPercent);
                return scrollingDown && expectedPercent; 
            }));
    }
}
