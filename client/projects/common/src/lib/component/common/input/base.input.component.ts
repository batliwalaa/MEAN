import { Input, OnInit, Output, EventEmitter, AfterViewInit, ElementRef, ViewChild, Directive } from '@angular/core';
import { IInputValue } from '../../../types/IInputValue';
import { CheckIsValidDirective } from '@common/src/lib/directives/check-is-valid.directive';
import { Observable } from 'rxjs';

@Directive()
export abstract class BaseInputComponent implements OnInit, AfterViewInit {
    private _md: any;
    data: any;
    showInfo: boolean;
    id: string;

    @ViewChild('inputControl') inputControl: ElementRef;    
    @Input() show = true;
    @Input() disableValidation: boolean;
    @Input() name: string;
    @Input() type: string;
    @Input() readonly: boolean;
    @Input() ignoreMediaQueries: boolean;
    @Input() set value(data: any) {
        this.data = data;
    }
    @Input() set metadata(value: any) {
        this._md = value;

        if (this._md && this._md.defaultValue) {
            this.onMetadata();
            this.data = this._md.defaultValue;
        }
    }

    get metadata(): any {
        return this._md;
    }

    @Output() valueChange: EventEmitter<IInputValue> = new EventEmitter<IInputValue>();

    async ngOnInit(): Promise<void> {
        this.showInfo = false;
        this.disableValidation = false;
        this.readonly = false;
        this.ignoreMediaQueries = true;
        this.id = this.makeid();

        await this.init();
    }

    async ngAfterViewInit(): Promise<void> {
        await this.afterInit();
    }

    onShowInfoIconClick(): void {
        this.showInfo = !this.showInfo;
        this.setFocus();
    }

    protected get diagnostic(): string {
        return JSON.stringify(this.metadata);
    }

    protected setFocus(): void {}

    protected async init(): Promise<void> {
        return Promise.resolve();
    }

    protected async afterInit(): Promise<void> {
        return Promise.resolve();
    }

    protected onMetadata(): void {}

    private makeid(): string {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < 10; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}
