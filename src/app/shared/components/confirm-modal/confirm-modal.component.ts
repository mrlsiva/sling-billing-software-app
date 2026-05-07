import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-confirm-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="overlay" *ngIf="isOpen" (click)="onOverlay($event)">
            <div class="modal-box">
                <div class="modal-icon" [ngClass]="'icon--' + type">
                    <i [class]="typeIcon"></i>
                </div>
                <h3 class="modal-title">{{ title }}</h3>
                <p class="modal-msg">{{ message }}</p>
                <div class="modal-actions">
                    <button class="btn-cancel" (click)="cancelled.emit()">Cancel</button>
                    <button class="btn-confirm" [ngClass]="'btn--' + type" (click)="confirmed.emit()">
                        {{ confirmLabel }}
                    </button>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .overlay {
            position: fixed; inset: 0; background: rgba(0,0,0,.45);
            z-index: 2000; display: flex; align-items: center; justify-content: center;
        }
        .modal-box {
            background: #fff; border-radius: 14px; padding: 28px 24px;
            max-width: 380px; width: 90%; text-align: center;
            box-shadow: 0 8px 32px rgba(0,0,0,.18);
        }
        .modal-icon {
            width: 54px; height: 54px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: 22px; margin: 0 auto 14px;
        }
        .icon--danger  { background: #fdecea; color: #dc3545; }
        .icon--warning { background: #fff8e1; color: #e6a800; }
        .icon--info    { background: #e8f4fd; color: #0d6efd; }
        .modal-title { font-size: 16px; font-weight: 700; color: #333; margin: 0 0 8px; }
        .modal-msg   { font-size: 13px; color: #666; margin: 0 0 20px; line-height: 1.5; }
        .modal-actions { display: flex; gap: 10px; justify-content: center; }
        .btn-cancel {
            flex: 1; padding: 9px; border: 1px solid #ddd; border-radius: 8px;
            background: #fff; color: #555; font-size: 13px; cursor: pointer;
        }
        .btn-confirm {
            flex: 1; padding: 9px; border: none; border-radius: 8px;
            font-size: 13px; font-weight: 600; cursor: pointer; color: #fff;
        }
        .btn--danger  { background: #dc3545; }
        .btn--warning { background: #ffc107; color: #333; }
        .btn--info    { background: #0d6efd; }
    `]
})
export class ConfirmModalComponent {
    @Input() isOpen: boolean = false;
    @Input() title: string = 'Confirm';
    @Input() message: string = 'Are you sure?';
    @Input() confirmLabel: string = 'Confirm';
    @Input() type: 'danger' | 'warning' | 'info' = 'danger';
    @Output() confirmed = new EventEmitter<void>();
    @Output() cancelled = new EventEmitter<void>();

    get typeIcon(): string {
        return { danger: 'fa fa-trash', warning: 'fa fa-exclamation-triangle', info: 'fa fa-question-circle' }[this.type];
    }

    onOverlay(e: MouseEvent) {
        if ((e.target as HTMLElement).classList.contains('overlay')) this.cancelled.emit();
    }
}
