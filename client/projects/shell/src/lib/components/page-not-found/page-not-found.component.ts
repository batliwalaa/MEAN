import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'ui-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent implements OnInit {
    errorType: string;

    constructor(private titleService: Title) {}

    async ngOnInit(): Promise<void> {
        this.titleService.setTitle('Amreet Bazzar - Not Found');

        await Promise.resolve();
    }
}
