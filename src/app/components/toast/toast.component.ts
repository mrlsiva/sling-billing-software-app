import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMsg } from '../../services/toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `<div class="toast" *ngIf="t">
    <div [class]="'toast-inner '+(t.type||'')">
        <div class="toast-content">
            <div class="toast-icon" *ngIf="t.type">
                <span *ngIf="t.type === 'success'" class="icon-success">✓</span>
                <span *ngIf="t.type === 'error'" class="icon-error">✕</span>
                <span *ngIf="t.type === 'info'" class="icon-info">ⓘ</span>
            </div>
            <span class="toast-message">{{ t.message }}</span>
        </div>
    </div>
</div>`,
    styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
    t: ToastMsg | null = null;
    constructor(public toast: ToastService) {
        this.toast.toast$.subscribe(s => this.t = s);
    }
}
