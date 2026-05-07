import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, SkeletonLoaderComponent],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    user: any = null;
    userDetail: any = null;
    bankDetail: any = null;
    loading = true;
    assetsBase = environment.assetsBase;

    constructor(private auth: AuthService, private http: HttpClient) {}

    ngOnInit() {
        this.http.get(`${environment.apiBase}/profile`).subscribe({
            next: (res: any) => {
                const d = res?.data ?? res;
                this.user = d?.user ?? d;
                this.userDetail = d?.user?.user_detail ?? d?.user_detail ?? {};
                this.bankDetail = d?.user?.bank_detail ?? d?.bank_detail ?? {};
                this.loading = false;
            },
            error: () => {
                this.auth.user$.subscribe(u => { this.user = u; this.userDetail = u?.user_detail ?? {}; this.bankDetail = u?.bank_detail ?? {}; });
                this.loading = false;
            }
        });
    }

    get initials(): string {
        const name = this.user?.name ?? this.user?.username ?? 'U';
        return name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();
    }

    get roleBadge(): string {
        const id = this.user?.role_id;
        if (id === 1) return 'Super Admin';
        if (id === 2) return 'HO';
        if (id === 3) return 'Branch';
        return 'User';
    }

    logoUrl(): string | null {
        const logo = this.userDetail?.logo ?? this.user?.logo;
        if (!logo) return null;
        if (/^https?:\/\//i.test(logo)) return logo;
        return `${this.assetsBase.replace(/\/$/, '')}/${logo.replace(/^\//, '')}`;
    }
}
