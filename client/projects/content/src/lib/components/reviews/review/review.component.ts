import { Component, ElementRef, Inject, Input, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ImageResult } from 'ngx-image2dataurl';
import { DOCUMENT } from "@angular/common";
import { from, fromEvent, interval } from "rxjs";
import { delay, first, takeUntil } from "rxjs/operators";
import {
    BaseComponent,
    DataStoreService,
    IInputValue,
    MenuStateService,
    Product,
    ProductRating,
    Review,
    WINDOW,
    IMAGE_OPTIONS,
    VideoResult,
    LightboxService,
    ProductReviewService,
    FileService,
    NotificationService
} from "@common/src/public-api";
import { NotificationMessageKeys } from "@common/src/lib/constants/notification.message.keys";

@Component({
    selector: 'ui-review-component',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss']
})
export class ReviewComponent extends BaseComponent {
    product: Product;
    review: Review;
    imageOptions = IMAGE_OPTIONS;
    hasMediaDevice: boolean = false;
    takeVideo: boolean = false;
    takePhoto: boolean = true;
    beginTakePhoto: boolean = false;
    recording: boolean;

    @Input() metadata: any;
    @ViewChild('cameraInput') cameraInput: ElementRef;

    private stream: any;
    private _type: string = 'CAMERA';
    // @ts-ignore
    private mediaRecorder: MediaRecorder;

    constructor(
        router: Router,
        @Inject(WINDOW) window: Window,
        menuStateService: MenuStateService,
        dataStoreService: DataStoreService,
        @Inject(DOCUMENT) private document: any,
        private activatedRoute: ActivatedRoute,        
        private lightboxService: LightboxService,
        private productReviewService: ProductReviewService,
        private fileService: FileService,
        private notificationService: NotificationService
    ) {
        super(router, window, menuStateService, dataStoreService);        
    }

    protected async init(): Promise<void> {
        this.hasMediaDevice = !!(this.window && this.window.navigator && this.window.navigator.mediaDevices);
        const data = this.activatedRoute.snapshot.data;

        this.metadata = data.metadata['AddEditReview'];
        this.product = data.detail;
        this.review = data.review;

        interval(100).pipe(takeUntil(this.$destroy)).subscribe(async _ => {
            this.menuStateService.changeShowMainMenu(!this.isMobile);
            this.menuStateService.changeShowSubMenu(this.menuStateService.getShowMainMenu());
        });
    }

    protected async destroy(): Promise<void> {
        if (this.mediaRecorder) {
            try {
                this.mediaRecorder.stop();
            } catch {}

            this.mediaRecorder = null;
        }
    }

    get featureRatings(): Array<{ feature: string, rating: ProductRating }> {
        if (this.product && Array.isArray(this.product.features) && this.product.features.length > 0){
            if (this.review && Array.isArray(this.review.featuresRating) && this.review.featuresRating.length === 0) {
                this.review.featuresRating = this.product.features.map(f => {
                    return { feature: f, rating: ProductRating.NoStar };
                });
            }

            return this.review.featuresRating;
        }
        
        return [];
    }

    get imageUrl(): string {
        if (this.product && Array.isArray(this.product.images)){
            const image = this.product.images.find(i => Number(i.size) === 0);

            if (image) {
                return image.src;
            }
        }
        return '';
    }

    public async onRatingChange($event: { selected: boolean, value: number }): Promise<void> {
        const review = { ...this.review }
        review.rating = this.review.rating === 1 && $event.value === 1 && !$event.selected ? 0 : $event.value;

        await this.updateReview(review);
        await Promise.resolve();
    }

    public async onFeatureRatingChange(index: number, $event: { selected: boolean, value: number }): Promise<void> {
        const review = { ...this.review }
        const fr = review.featuresRating[index];

        if (fr) {
            fr.rating = fr.rating === 1 && $event.value === 1 && !$event.selected ? 0 : $event.value;

            await this.updateReview(review);
        }
    }

    public async onValueChange(input: IInputValue): Promise<void> {
        const review = { ...this.review };
        review[input.name] = input.value;
        
        await this.updateReview(review);
    }

    public async onFileChange(result: ImageResult | VideoResult): Promise<void> {
        if (!result.error) {
            if (result as ImageResult) {
                try {
                    const ir = result as ImageResult;
                    const fileType = ir.file && ir.file.type || ir.resized.type;
                    const filename = ir.file && ir.file.name || `${Date.now()}.jpg`
                    await this.tokenService.xsrf();
                    const response = await this.fileService.upload(
                        'product', this.review.productID, this.review._id, ir.dataURL, fileType, filename).toPromise();

                    if (response && response.url) {
                        if (!this.review.urls) {
                            this.review.urls = [];
                        }
                        const review = { ...this.review };
                        review.urls.push({ type: 'image', src: response.url });

                        await this.updateReview(review);
                    }
                } catch {
                    //TODO: error handling
                }
            }
        }        
    }

    public async removeImage(index: number): Promise<void> {
        const review = { ...this.review };
        const items = review.urls.splice(index, 1);

        if (Array.isArray(items) && items.length === 1) {
            try {
                await this.updateReview(review);

                const filename = items[0].src.substring(items[0].src.lastIndexOf('/') +1 );
                await this.fileService.remove('product', this.review.productID, this.review._id, filename).toPromise();

            } catch {
            }
        }
    }

    public async onlightboxClose(id: string): Promise<void> {
        this.lightboxService.close(id);
    }

    public async openLightbox(id: string): Promise<void> {
        this.lightboxService.open(id);

        await Promise.resolve();
    }

    public async onCancel(): Promise<void> {
        this.beginTakePhoto = false;
        this.stopTracks();
        this.lightboxService.close('take-photo-or-video');

        await Promise.resolve();
    }

    public async onTakePhoto(): Promise<void> {
        this.beginTakePhoto = true;
        this.lightboxService.open('take-photo-or-video');

        await from([0]).pipe(delay(0), first()).toPromise();
        
        this.stream = await this.window.navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        const mediaStreamTrack: MediaStreamTrack = this.stream.getVideoTracks()[0];
        this.stream = new MediaStream([mediaStreamTrack]);
        if (HTMLMediaElement) {
            this.cameraInput.nativeElement.srcObject = this.stream;
        } else {
            this.cameraInput.nativeElement.src = URL.createObjectURL(this.stream);
        }
        this.cameraInput.nativeElement.play();
    }

    public async onCapture(): Promise<void> {
        if (this._type === 'CAMERA') {
            this.capturePhoto();            
            this.lightboxService.close('take-photo-or-video');
        } else {
            if (this.recording) {
                this.stopRecording();
            } else {
                this.startRecording();
            }
        }

        await Promise.resolve();
    }

    private startRecording(): void {
        this.recording = true;
        let chunks = [];

        // @ts-ignore
        this.mediaRecorder = new MediaRecorder(this.stream);
        this.mediaRecorder.addEventListener('dataavailable', $event => {
            if ($event.data.size > 0) {
                chunks.push($event.data);
            }
        });

        this.mediaRecorder.addEventListener('stop', _ => {
            const blob = new Blob(chunks, { type: 'video/mp4' });
            const file = new File([blob], 'video.mp4');
            const result: VideoResult = { file: file, type: 'video/mp4' };

            this.stopTracks();
            this.beginTakePhoto = false;

            if (FileReader) {
                const reader = new FileReader();
                fromEvent(reader, 'load').subscribe(_ => {
                    result.dataURL = reader.result as string;
                    this.onFileChange(result);
                });
                reader.readAsDataURL(file);
            }
        });
        this.mediaRecorder.start();
    }

    private stopRecording(): void {
        this.recording = false;
        this.mediaRecorder.stop();
    }

    private capturePhoto(): void {
        const canvas = this.document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const height = this.cameraInput.nativeElement.videoHeight;
        const width = this.cameraInput.nativeElement.videoWidth;

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(this.cameraInput.nativeElement, 0, 0, width, height);
        this.beginTakePhoto = false;
        this.stopTracks();

        const dataUrl = canvas.toDataURL('image/jpeg');
        const result: ImageResult = {
            file: null,
            dataURL: dataUrl,
            url: null,
            resized: { dataURL: dataUrl, type: 'image/jpeg' }
        };

        this.onFileChange(result);
    }

    private stopTracks(): void {
        if (this.stream && this.stream.getTracks) {
            this.stream.getTracks().forEach(track => track.stop());
        }
    }

    private async updateReview(review: Review): Promise<void> {
        try {
            await this.tokenService.xsrf();
            this.review = await this.productReviewService.saveReview(review).toPromise();
        } catch {
            this.notificationService.showMessage(NotificationMessageKeys.GenericError);
        }
    }
}