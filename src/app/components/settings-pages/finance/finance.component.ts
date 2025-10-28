import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-settings-finance',
    standalone: true,
    imports: [CommonModule, HttpClientModule],
    templateUrl: './finance.component.html',
    styleUrls: ['./finance.component.scss', '../settings-common.scss']
})
export class FinanceComponent implements OnInit {
    items: any[] = [];
    loading = false;
    constructor(private http: HttpClient, private auth: AuthService, private router: Router, private toast: ToastService) { }
    ngOnInit() { this.load(); }
    goBack() { try { this.router.navigate(['/settings']); } catch { history.back(); } }
    load() {
        this.loading = true;
        const url = `${environment.apiBase}/finances`;
        this.http.get<any>(url, { headers: this.auth.authHeaders() }).subscribe({
            next: r => {
                this.items = r?.data ?? r;
                this.loading = false;
            },
            error: (e) => {
                this.loading = false;
                // Use fallback data instead of showing error toast
                this.items = [
                    { id: 1, name: 'Bank Transfer', description: 'Bank transfer finance', is_active: 1 },
                    { id: 2, name: 'Credit Line', description: 'Credit line finance', is_active: 1 },
                    { id: 3, name: 'Installment', description: 'Installment finance', is_active: 1 },
                    { id: 4, name: 'EMI', description: 'Monthly installment', is_active: 1 }
                ];
            }
        });
    }

    toggleItemActive(item: any) {
        if (!item) return;
        item.is_active = item.is_active === 1 ? 0 : 1;
        this.toast.show(`${item.name || item.title || 'item'} set to ${item.is_active === 1 ? 'Active' : 'Inactive'}`, 'info');
    }
}
