import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';
import { AmountPipe } from '../../shared/pipes/amount.pipe';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, AmountPipe, StatCardComponent, SkeletonLoaderComponent, EmptyStateComponent],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    loading = true;
    data: any = null;
    fromDate: string = '';
    toDate: string = '';

    constructor(private dashboardService: DashboardService) {}

    ngOnInit() {
        const today = new Date().toISOString().split('T')[0];
        this.fromDate = today;
        this.toDate = today;
        this.load();
    }

    load() {
        this.loading = true;
        this.dashboardService.getHoDashboard(this.fromDate, this.toDate).subscribe({
            next: (res: any) => {
                this.data = res?.data ?? res;
                this.loading = false;
            },
            error: () => { this.loading = false; }
        });
    }

    get branches(): any[] {
        return this.data?.branches ?? [];
    }
}
