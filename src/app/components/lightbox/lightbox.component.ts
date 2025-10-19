import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-lightbox',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="lb-backdrop" (click)="close()">
            <div class="lb-content" (click)="$event.stopPropagation()">
                <button class="lb-close" (click)="close()">✕</button>
                <img [src]="src" alt="lightbox-image" />
            </div>
        </div>
    `,
    styles: [`
        .lb-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:10000}
        .lb-content{position:relative;max-width:95%;max-height:95%;display:flex;align-items:center;justify-content:center}
        .lb-content img{max-width:100%;max-height:100%;border-radius:6px}
        .lb-close{position:absolute;top:-12px;right:-12px;background:#fff;border:0;border-radius:50%;width:32px;height:32px;cursor:pointer}
    `]
})
export class LightboxComponent {
    @Input() src: string | null = null;
    @Output() closed = new EventEmitter<void>();

    close() {
        this.closed.emit();
    }
}
