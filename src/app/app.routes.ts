import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { OrderComponent } from './components/order/order.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'pos', component: ProductListComponent },
            { path: 'profile', component: ProfileComponent },
            { path: 'settings', component: SettingsComponent },
            { path: 'settings/gender', loadComponent: () => import('./components/settings-pages/gender/gender.component').then(m => m.GenderComponent) },
            { path: 'settings/payment-list', loadComponent: () => import('./components/settings-pages/payment-list/payment-list.component').then(m => m.PaymentListComponent) },
            { path: 'settings/finance', loadComponent: () => import('./components/settings-pages/finance/finance.component').then(m => m.FinanceComponent) },
            { path: 'settings/staff', loadComponent: () => import('./components/settings-pages/staff/staff.component').then(m => m.StaffComponent) },
            { path: 'order', component: OrderComponent },
            { path: '', redirectTo: 'pos', pathMatch: 'full' }
        ]
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' },
];
