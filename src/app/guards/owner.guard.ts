import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class BranchGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) { }

    canActivate(): boolean | UrlTree {
        // Allow access if user should access POS (Branch OR HO with billing enabled)
        if (this.auth.shouldAccessPOS()) {
            return true;
        } else if (this.auth.isSuperAdmin()) {
            // Redirect Super Admin to their dashboard
            return this.router.createUrlTree(['/super-admin']);
        } else if (this.auth.isHO()) {
            // Redirect HO (without billing) to their dashboard
            return this.router.createUrlTree(['/dashboard']);
        } else {
            // Unknown role, redirect to login
            return this.router.createUrlTree(['/login']);
        }
    }
}
