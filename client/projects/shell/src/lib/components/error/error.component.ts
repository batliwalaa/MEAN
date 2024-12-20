import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'ui-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss'],
})
export class ErrorComponent implements OnInit {
    errorType: string;

    constructor(private titleService: Title, private activatedRoute: ActivatedRoute) {}

    async ngOnInit(): Promise<void> {
        this.errorType = this.activatedRoute.snapshot.params['type'];
        this.titleService.setTitle('Amreet Bazzar - Error');

        await Promise.resolve();
    }
}
