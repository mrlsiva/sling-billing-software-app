import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-lightbox',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './lightbox.component.html',
    styleUrls: ['./lightbox.component.scss']
})
export class LightboxComponent {
    @Input() src: string | null = null;
    @Output() closed = new EventEmitter<void>();

    close() {
        this.closed.emit();
    }
}
