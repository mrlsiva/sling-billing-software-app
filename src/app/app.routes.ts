import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { OrderComponent } from './components/order/order.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AuthGuard } from './guards/auth.guard';
import { OwnerGuard } from './guards/owner.guard';
import { HoGuard } from './guards/ho.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent, canActivate: [HoGuard] },
            { path: 'pos', component: ProductListComponent, canActivate: [OwnerGuard] },
            { path: 'categories', loadComponent: () => import('./components/settings-pages/categories/categories.component').then(m => m.CategoriesComponent) },
            { path: 'customers', loadComponent: () => import('./components/customers/customers.component').then(m => m.CustomersComponent) },
            { path: 'profile', component: ProfileComponent },
            { path: 'settings', component: SettingsComponent },
            { path: 'settings/gender', loadComponent: () => import('./components/settings-pages/gender/gender.component').then(m => m.GenderComponent) },
            { path: 'settings/payment-list', loadComponent: () => import('./components/settings-pages/payment-list/payment-list.component').then(m => m.PaymentListComponent) },
            { path: 'settings/finance', loadComponent: () => import('./components/settings-pages/finance/finance.component').then(m => m.FinanceComponent) },
            { path: 'settings/staff', loadComponent: () => import('./components/settings-pages/staff/staff.component').then(m => m.StaffComponent) },
            { path: 'order', component: OrderComponent },
            { path: 'checkout', loadComponent: () => import('./components/checkout/checkout.component').then(m => m.CheckoutComponent) },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' },
];
