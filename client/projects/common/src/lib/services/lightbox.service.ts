import  { Injectable } from'@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LightboxService {
    private lightBoxes: Array<any> = [];

    public add (lightbox: any): void {
        this.lightBoxes.push(lightbox);
    }

    public remove (id: string): void {
        this.lightBoxes = this.lightBoxes.filter(l => l.id !== id);
    }

    open(id: string): void {
        const lightbox = this.lightBoxes.find(l => l.id === id);

        if (lightbox) {
            lightbox.open();
        }
    }

    close(id: string): void {
        const lightbox = this.lightBoxes.find(l => l.id === id);

        if (lightbox) {
            lightbox.close();
        }
    }
}