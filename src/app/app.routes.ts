import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { OrderComponent } from './components/order/order.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SuperAdminDashboardComponent } from './components/super-admin-dashboard/super-admin-dashboard.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AuthGuard } from './guards/auth.guard';
import { BranchGuard } from './guards/owner.guard';
import { HoGuard } from './guards/ho.guard';
import { SuperAdminGuard } from './guards/super-admin.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            // Super Admin
            { path: 'super-admin', component: SuperAdminDashboardComponent, canActivate: [SuperAdminGuard] },

            // HO Dashboard
            { path: 'dashboard', component: DashboardComponent, canActivate: [HoGuard] },

            // Branch Dashboard
            { path: 'branch/dashboard', loadComponent: () => import('./components/branch-dashboard/branch-dashboard.component').then(m => m.BranchDashboardComponent), canActivate: [BranchGuard] },

            // POS
            { path: 'pos', component: ProductListComponent, canActivate: [BranchGuard] },

            // HO Settings (existing)
            { path: 'categories',   loadComponent: () => import('./components/settings-pages/categories/categories.component').then(m => m.CategoriesComponent),     canActivate: [HoGuard] },
            { path: 'subcategories',loadComponent: () => import('./components/settings-pages/subcategories/subcategories.component').then(m => m.SubcategoriesComponent), canActivate: [HoGuard] },
            { path: 'products',     loadComponent: () => import('./components/settings-pages/products/products.component').then(m => m.ProductsComponent),             canActivate: [HoGuard] },
            { path: 'tax',          loadComponent: () => import('./components/settings-pages/tax/tax.component').then(m => m.TaxComponent),                             canActivate: [HoGuard] },
            { path: 'metric',       loadComponent: () => import('./components/settings-pages/metric/metric.component').then(m => m.MetricComponent),                   canActivate: [HoGuard] },

            // New settings
            { path: 'settings/sizes',    loadComponent: () => import('./components/settings-pages/sizes/sizes.component').then(m => m.SizesComponent),       canActivate: [HoGuard] },
            { path: 'settings/colours',  loadComponent: () => import('./components/settings-pages/colours/colours.component').then(m => m.ColoursComponent), canActivate: [HoGuard] },

            // Existing settings
            { path: 'settings/gender',        loadComponent: () => import('./components/settings-pages/gender/gender.component').then(m => m.GenderComponent) },
            { path: 'settings/payment-list',  loadComponent: () => import('./components/settings-pages/payment-list/payment-list.component').then(m => m.PaymentListComponent) },
            { path: 'settings/finance',       loadComponent: () => import('./components/settings-pages/finance/finance.component').then(m => m.FinanceComponent) },
            { path: 'settings/staff',         loadComponent: () => import('./components/settings-pages/staff/staff.component').then(m => m.StaffComponent) },

            // Vendor Ledger
            { path: 'vendors/:id/ledger', loadComponent: () => import('./components/vendor-ledger/vendor-ledger.component').then(m => m.VendorLedgerComponent), canActivate: [HoGuard] },

            // Purchase Orders
            { path: 'purchase-orders',        loadComponent: () => import('./components/purchase-orders/purchase-orders.component').then(m => m.PurchaseOrdersComponent),               canActivate: [HoGuard] },
            { path: 'purchase-orders/create', loadComponent: () => import('./components/purchase-orders/purchase-order-create/purchase-order-create.component').then(m => m.PurchaseOrderCreateComponent), canActivate: [HoGuard] },

            // Inventory (HO)
            { path: 'inventory/stock',    loadComponent: () => import('./components/inventory/inventory-stock/inventory-stock.component').then(m => m.InventoryStockComponent),       canActivate: [HoGuard] },
            { path: 'inventory/transfer', loadComponent: () => import('./components/inventory/inventory-transfer/inventory-transfer.component').then(m => m.InventoryTransferComponent), canActivate: [HoGuard] },

            // Branch Stock & Transfer
            { path: 'branch/stock', loadComponent: () => import('./components/branch-stock/branch-stock.component').then(m => m.BranchStockComponent), canActivate: [BranchGuard] },

            // Branch Orders & Refunds
            { path: 'branch/orders',            loadComponent: () => import('./components/branch-orders/branch-orders.component').then(m => m.BranchOrdersComponent),                     canActivate: [BranchGuard] },
            { path: 'branch/orders/:id/refund', loadComponent: () => import('./components/branch-orders/branch-refund/branch-refund.component').then(m => m.BranchRefundComponent),        canActivate: [BranchGuard] },

            // GST Billing
            { path: 'gst-bills',        loadComponent: () => import('./components/gst-billing/gst-billing.component').then(m => m.GstBillingComponent), canActivate: [HoGuard] },
            { path: 'branch/gst-bills', loadComponent: () => import('./components/gst-billing/gst-billing.component').then(m => m.GstBillingComponent), canActivate: [BranchGuard] },

            // Credits
            { path: 'credits',        loadComponent: () => import('./components/credits/credits.component').then(m => m.CreditsComponent), canActivate: [HoGuard] },
            { path: 'branch/credits', loadComponent: () => import('./components/credits/credits.component').then(m => m.CreditsComponent), canActivate: [BranchGuard] },

            // Reports
            { path: 'reports',        loadComponent: () => import('./components/reports/ho-reports/ho-reports.component').then(m => m.HoReportsComponent),         canActivate: [HoGuard] },
            { path: 'branch/reports', loadComponent: () => import('./components/reports/branch-reports/branch-reports.component').then(m => m.BranchReportsComponent), canActivate: [BranchGuard] },

            // Common
            { path: 'customers', loadComponent: () => import('./components/customers/customers.component').then(m => m.CustomersComponent) },
            { path: 'profile',   component: ProfileComponent },
            { path: 'settings',  component: SettingsComponent },
            { path: 'order',     component: OrderComponent },
            { path: 'checkout',  loadComponent: () => import('./components/checkout/checkout.component').then(m => m.CheckoutComponent) },

            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' },
];
