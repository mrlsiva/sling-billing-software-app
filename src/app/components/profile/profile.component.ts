import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';


@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
    user: any = null;
    imgUrl = '';
    constructor(private auth: AuthService, private router: Router) {
        this.auth.user$.subscribe(u => {
            this.user = u;
            // Prefer fav_icon / favicon if provided by API, then avatar, then logo variants
            const candidate = (u && (u.fav_icon || u.favicon || u.avatar || u.logo || u.logo_url)) || '';
            this.imgUrl = this.resolveImage(candidate) || 'assets/no-avatar.png';
        });
    }

    goBack() {
        try { this.router.navigate(['/products']); } catch { history.back(); }
    }

    editProfile() {
        // placeholder for edit action
        // you can navigate to /profile/edit if implemented
        try { this.router.navigate(['/profile/edit']); } catch { }
    }
    private resolveImage(path: string | undefined | null): string | null {
        if (!path) return null;
        const p = String(path).trim();
        if (!p) return null;
        // return data URLs or absolute URLs as-is
        if (/^(data:|https?:)\/\//i.test(p)) return p;
        // otherwise prefix with assetsBase
        const base = (environment.assetsBase || '').replace(/\/$/, '');
        return base ? `${base}/${p.replace(/^\//, '')}` : p;
    }
}
