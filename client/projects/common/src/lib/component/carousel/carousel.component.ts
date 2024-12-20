import { animate, AnimationBuilder, AnimationFactory, AnimationPlayer, style } from "@angular/animations";
import { AfterViewInit, Component, ContentChildren, Directive, ElementRef, HostBinding, HostListener, Inject, Input, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { Router } from "@angular/router";
import { interval } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CarouselItemDirective } from "../../directives/carousel-item.directive";
import { WINDOW } from "../../services/window.service";
import { BaseComponent } from "../base.component";

@Directive({
    selector: '.carousel-item'
})
export class CarouselItemElement {
}

@Component({
    selector: 'ui-carousel-component',
    exportAs: 'carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent extends BaseComponent implements AfterViewInit {
    private player : AnimationPlayer;
    private itemWidth: number;
    private moveFromLastToFirst: boolean = false;

    @ContentChildren(CarouselItemDirective) items: QueryList<CarouselItemDirective>;
    @ViewChildren(CarouselItemElement, { read: ElementRef }) private itemElements: QueryList<ElementRef>;
    @ViewChild('carousel') private carousel: ElementRef;
    @Input() timing: string = '500ms ease-in';
    @Input() showControls: boolean = true;
    @Input() enableTimer: boolean = true;
    @Input() setWidth: boolean = true;

    carouselWrapperStyle = {};
    currentSlide: number = 0;

    constructor(
        router: Router,
        @Inject(WINDOW) window: Window,
        private animationBuilder: AnimationBuilder
    ) {
        super(router, window);
    }

    async ngAfterViewInit(): Promise<void> {
        if (this.setWidth) {
            this.setItemWidth();
        }
        
        interval(5000).pipe(takeUntil(this.$destroy)).subscribe(async _ => {
            if (this.currentSlide >= this.items.length - 1) {
                this.currentSlide = -1;
                this.moveFromLastToFirst = true;
            }
            this.next();
        });
        
        Promise.resolve();
    }

    public next(): void {
        if (this.currentSlide + 1 === this.items.length) {
            return;
        }
        this.currentSlide = (this.currentSlide + 1) % this.items.length;
        this.play();
    }

    public previous(): void {
        if (this.currentSlide === 0) {
            return;
        }
        this.currentSlide = ((this.currentSlide - 1) + this.items.length) % this.items.length;
        this.play();
    }

    private buildAnimation(offset: number): AnimationFactory {
        const timing = (this.moveFromLastToFirst ? '1ms ease-in' : this.timing);
        this.moveFromLastToFirst = false;

        return this.animationBuilder.build([
            animate(timing, style({ transform : `translateX(-${offset}px)`}))
        ]);
    }

    private play(): void {
        const offset = this.currentSlide * this.itemWidth;
        if (!isNaN(offset)) {
            const animation: AnimationFactory = this.buildAnimation(offset);
            this.player = animation.create(this.carousel.nativeElement);
            this.player.play();
        }        
    }

    private setItemWidth(): void {
        this.itemWidth = this.itemElements.first.nativeElement.getBoundingClientRect().width;
        this.carouselWrapperStyle = {
            width: `${this.itemWidth}px`
        }
    }
}