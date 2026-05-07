import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-empty-state',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="empty-state">
            <i [class]="icon"></i>
            <p class="empty-title">{{ title }}</p>
            <p class="empty-sub" *ngIf="subtitle">{{ subtitle }}</p>
        </div>
    `,
    styles: [`
        .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: #999;
        }
        .empty-state i {
            font-size: 40px;
            margin-bottom: 12px;
            display: block;
            opacity: .45;
        }
        .empty-title { font-size: 15px; font-weight: 600; color: #777; margin: 0 0 4px; }
        .empty-sub   { font-size: 12px; color: #aaa; margin: 0; }
    `]
})
export class EmptyStateComponent {
    @Input() title: string = 'No records found';
    @Input() subtitle: string = '';
    @Input() icon: string = 'fa fa-inbox';
}
