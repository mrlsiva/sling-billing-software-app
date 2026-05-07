import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-stat-card',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="stat-card" [ngClass]="'stat-card--' + color">
            <div class="stat-card__icon" *ngIf="icon">
                <i [class]="icon"></i>
            </div>
            <div class="stat-card__body">
                <div class="stat-card__value">{{ value }}</div>
                <div class="stat-card__label">{{ label }}</div>
            </div>
        </div>
    `,
    styles: [`
        .stat-card {
            background: #fff;
            border-radius: 10px;
            padding: 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            display: flex;
            align-items: center;
            gap: 14px;
            border-left: 4px solid transparent;
        }
        .stat-card__icon {
            width: 46px;
            height: 46px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            flex-shrink: 0;
        }
        .stat-card__value {
            font-size: 20px;
            font-weight: 700;
            color: #333;
            line-height: 1.1;
        }
        .stat-card__label {
            font-size: 12px;
            color: #666;
            margin-top: 3px;
        }
        .stat-card--primary { border-left-color: var(--color-primary-bg); }
        .stat-card--primary .stat-card__icon { background: rgba(248,147,29,0.1); color: var(--color-primary-bg); }
        .stat-card--secondary { border-left-color: var(--color-secondary-bg); }
        .stat-card--secondary .stat-card__icon { background: rgba(25,173,159,0.1); color: var(--color-secondary-bg); }
        .stat-card--success { border-left-color: #28a745; }
        .stat-card--success .stat-card__icon { background: rgba(40,167,69,0.1); color: #28a745; }
        .stat-card--warning { border-left-color: #ffc107; }
        .stat-card--warning .stat-card__icon { background: rgba(255,193,7,0.1); color: #e6a800; }
        .stat-card--danger { border-left-color: #dc3545; }
        .stat-card--danger .stat-card__icon { background: rgba(220,53,69,0.1); color: #dc3545; }
    `]
})
export class StatCardComponent {
    @Input() label: string = '';
    @Input() value: string | number = '';
    @Input() icon: string = '';
    @Input() color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' = 'primary';
}
