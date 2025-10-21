import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-settings-staff',
    standalone: true,
    imports: [CommonModule, HttpClientModule],
    templateUrl: './staff.component.html',
    styleUrls: ['./staff.component.scss', '../settings-common.scss']
})
export class StaffComponent implements OnInit, OnDestroy {
    items: any[] = [];
    loading = false;
    lastUpdated: Date | null = null;
    private pollTimer: any = null;
    pollingEnabled = true; // static toggle default: on
    constructor(private http: HttpClient, private auth: AuthService, private router: Router, private toast: ToastService) { }
    ngOnInit() { this.load(); }
    ngAfterViewInit() {
        // start polling every 10s if enabled
        if (this.pollingEnabled) this.startPolling();
    }
    startPolling() {
        this.stopPolling();
        this.pollTimer = setInterval(() => this.load(false), 10000);
    }
    stopPolling() {
        if (this.pollTimer) { clearInterval(this.pollTimer); this.pollTimer = null; }
    }
    togglePolling() {
        this.pollingEnabled = !this.pollingEnabled;
        if (this.pollingEnabled) this.startPolling(); else this.stopPolling();
    }
    goBack() { try { this.router.navigate(['/settings']); } catch { history.back(); } }
    ngOnDestroy() {
        this.stopPolling();
    }

    load(showLoading = true) {
        if (showLoading) this.loading = true;
        const url = `${environment.apiBase.replace(/\/$/, '')}/staff`;
        this.http.get<any>(url, { headers: this.auth.authHeaders() }).subscribe({ next: r => { this.items = r?.data ?? r; this.loading = false; this.lastUpdated = new Date(); }, error: (e) => { this.loading = false; this.toast.show('Failed to load Staff', 'error'); } });
    }

    /**
     * Toggle active state locally for a staff item (UI-only). This does not call the API.
     */
    toggleItemActive(item: any) {
        if (!item) return;
        // flip between 1 and 0
        item.is_active = item.is_active === 1 ? 0 : 1;
        const state = item.is_active === 1 ? 'Active' : 'Inactive';
        this.toast.show(`Set ${item.name || item.full_name || 'staff'} to ${state}`, 'info');
    }
}
