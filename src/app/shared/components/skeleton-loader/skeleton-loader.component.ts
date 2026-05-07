import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-skeleton-loader',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="skeleton-wrap">
            <ng-container *ngIf="type === 'table'">
                <div class="skeleton table-row" *ngFor="let r of rows"></div>
            </ng-container>
            <ng-container *ngIf="type === 'cards'">
                <div class="cards-row">
                    <div class="skeleton card" *ngFor="let r of rows"></div>
                </div>
            </ng-container>
            <ng-container *ngIf="type === 'line'">
                <div class="skeleton line" *ngFor="let r of rows"></div>
            </ng-container>
        </div>
    `,
    styles: [`
        @keyframes shimmer {
            0%   { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        .skeleton {
            background: linear-gradient(90deg,#f0f0f0 25%,#e4e4e4 50%,#f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.4s infinite;
            border-radius: 6px;
        }
        .table-row  { height: 44px; margin-bottom: 6px; width: 100%; }
        .card       { height: 82px; flex: 1; border-radius: 10px; }
        .line       { height: 14px; margin-bottom: 10px; width: 100%; }
        .cards-row  { display: flex; gap: 14px; }
    `]
})
export class SkeletonLoaderComponent {
    @Input() type: 'table' | 'cards' | 'line' = 'table';
    @Input() count: number = 5;
    get rows() { return Array(this.count); }
}
