import { ChangeDetectionStrategy, Component, Inject, Input } from "@angular/core";
import { Router } from "@angular/router";
import { RouteKeys } from "../../constants/route.keys";
import { NavigationService } from "../../services/navigation.service";
import { WINDOW } from "../../services/window.service";
import { BaseComponent } from "../base.component";

@Component({
    selector: 'ui-breadcrumb-component',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadCrumbComponent extends BaseComponent {
    @Input() items: Array<{label: string, key: string}>;

    constructor (
        router: Router,
        @Inject(WINDOW) window: Window,
        private navigationService: NavigationService
    ) {
        super(router, window);
    }

    public async onBreadCrumbClick(key: string): Promise<void> {
        await this.navigationService.navigateForUrl(this.getUrl(key), null, null, true);
    }

    private getUrl(key: string): string {
        return RouteKeys[key];
    }
}