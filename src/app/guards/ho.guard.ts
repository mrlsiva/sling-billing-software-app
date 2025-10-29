import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class HoGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) { }

    canActivate(): boolean | UrlTree {
        // Allow access only if user is HO (owner_id is not null)
        if (this.auth.hasOwner()) {
            return true;
        } else {
            // Redirect to POS for Branch users
            return this.router.createUrlTree(['/pos']);
        }
    }
}
