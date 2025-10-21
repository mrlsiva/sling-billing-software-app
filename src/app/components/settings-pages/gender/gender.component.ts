import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-settings-gender',
    standalone: true,
    imports: [CommonModule, HttpClientModule],
    templateUrl: './gender.component.html',
    styleUrls: ['./gender.component.scss', '../settings-common.scss']
})
export class GenderComponent implements OnInit {
    items: any[] = [];
    loading = false;
    constructor(private http: HttpClient, private auth: AuthService, private router: Router, private toast: ToastService) { }
    ngOnInit() { this.load(); }
    goBack() {
        try { this.router.navigate(['/settings']); } catch { history.back(); }
    }
    load() {
        this.loading = true;
        const url = `${environment.apiBase.replace(/\/$/, '')}/gender`;
        this.http.get<any>(url, { headers: this.auth.authHeaders() }).subscribe({ next: r => { this.items = r?.data ?? r; this.loading = false; }, error: (e) => { this.loading = false; this.toast.show('Failed to load Gender', 'error'); } });
    }

    toggleItemActive(item: any) {
        if (!item) return;
        item.is_active = item.is_active === 1 ? 0 : 1;
        this.toast.show(`${item.name || item.label || item.title || 'item'} set to ${item.is_active === 1 ? 'Active' : 'Inactive'}`, 'info');
    }
}

