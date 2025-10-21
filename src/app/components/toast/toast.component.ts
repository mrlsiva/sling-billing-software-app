import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMsg } from '../../services/toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `<div class="toast" *ngIf="t">
    <div [class]="'toast-inner '+(t.type||'')">{{ t.message }}</div>
</div>`,
    styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
    t: ToastMsg | null = null;
    constructor(public toast: ToastService) {
        this.toast.toast$.subscribe(s => this.t = s);
    }
}
