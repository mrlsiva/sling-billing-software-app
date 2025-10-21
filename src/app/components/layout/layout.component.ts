import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CartComponent } from '../cart/cart.component';
import { ToastComponent } from '../toast/toast.component';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, CartComponent, ToastComponent],
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
    showCart = true;
    private routerSubscription?: Subscription;

    constructor(private router: Router) { }

    ngOnInit() {
        // Listen to route changes
        this.routerSubscription = this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                // Hide cart on checkout page
                this.showCart = !event.url.includes('/checkout');
            });

        // Check initial route
        this.showCart = !this.router.url.includes('/checkout');
    }

    ngOnDestroy() {
        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe();
        }
    }
}
