import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-status-badge',
    standalone: true,
    imports: [CommonModule],
    template: `<span class="badge" [ngClass]="badgeClass">{{ displayLabel }}</span>`,
    styles: [`
        .badge {
            display: inline-block;
            padding: 3px 9px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            text-transform: capitalize;
            white-space: nowrap;
        }
        .badge-success { background: #d4edda; color: #155724; }
        .badge-danger  { background: #f8d7da; color: #721c24; }
        .badge-warning { background: #fff3cd; color: #856404; }
        .badge-dark    { background: #6c1c1c; color: #fff; }
        .badge-info    { background: #d1ecf1; color: #0c5460; }
        .badge-secondary { background: #e2e3e5; color: #383d41; }
    `]
})
export class StatusBadgeComponent {
    @Input() status: string | number = '';
    @Input() label: string = '';

    get badgeClass(): string {
        const s = String(this.status).toLowerCase();
        if (['paid', 'active', '1', 'completed', 'success'].includes(s)) return 'badge-success';
        if (['unpaid', 'inactive', '0', 'failed', 'cancelled'].includes(s)) return 'badge-danger';
        if (['partial', 'pending', '2'].includes(s)) return 'badge-warning';
        if (['overdue'].includes(s)) return 'badge-dark';
        if (['refunded'].includes(s)) return 'badge-info';
        return 'badge-secondary';
    }

    get displayLabel(): string {
        if (this.label) return this.label;
        const s = String(this.status).toLowerCase();
        const map: Record<string, string> = {
            '1': 'Active', '0': 'Inactive',
            'paid': 'Paid', 'unpaid': 'Unpaid',
            'partial': 'Partial', 'overdue': 'Overdue',
            'refunded': 'Refunded', 'completed': 'Completed',
            'active': 'Active', 'inactive': 'Inactive',
            'pending': 'Pending'
        };
        return map[s] ?? String(this.status);
    }
}
