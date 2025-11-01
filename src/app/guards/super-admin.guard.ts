import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class SuperAdminGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) { }

    canActivate(): boolean | UrlTree {
        // Allow access only if user is Super Admin (role_id = 1)
        if (this.auth.isSuperAdmin()) {
            return true;
        } else if (this.auth.isHO()) {
            // Redirect HO to their dashboard
            return this.router.createUrlTree(['/dashboard']);
        } else if (this.auth.isBranch()) {
            // Redirect Branch to POS
            return this.router.createUrlTree(['/pos']);
        } else {
            // Unknown role, redirect to login
            return this.router.createUrlTree(['/login']);
        }
    }
}