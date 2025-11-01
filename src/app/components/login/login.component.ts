import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    form: FormGroup;
    loading = false;
    error = '';
    showPassword = false;

    constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
        this.form = this.fb.group({
            slug_name: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    submit() {
        if (this.form.invalid) return;

        this.loading = true;
        this.error = '';

        const { slug_name, password } = this.form.value;

        this.auth.login(slug_name, password).subscribe({
            next: (res: any) => {
                this.loading = false;
                console.log('Login Response:', res);

                const userDetail = res?.data?.user_detail;
                const paymentMethod = userDetail?.payment_method;

                // 🔒 Check payment method before proceeding
                if (paymentMethod === '1') {
                    this.error = 'Payment expired. Please Contact Admin.';
                    return;
                }

                // ✅ Proceed with login if payment is valid
                const token =
                    res?.token ||
                    res?.access_token ||
                    res?.auth_token ||
                    res?.data?.token ||
                    res?.data?.access_token ||
                    res?.data?.auth_token;

                if (token) {
                    sessionStorage.setItem('auth_token', token);

                    // Conditional routing based on role_id and billing status
                    // role_id: 1 = Super Admin -> Super Admin Dashboard
                    // role_id: 2 = HO -> HO Dashboard (if is_bill_enabled = 0) or POS (if is_bill_enabled = 1)
                    // role_id: 3 = Branch -> POS
                    if (this.auth.isSuperAdmin()) {
                        this.router.navigate(['/super-admin']);
                    } else if (this.auth.isHO()) {
                        // Check if HO has billing enabled
                        if (this.auth.isHOWithBilling()) {
                            this.router.navigate(['/pos']); // HO with billing goes to POS
                        } else {
                            this.router.navigate(['/dashboard']); // HO without billing goes to dashboard
                        }
                    } else if (this.auth.isBranch()) {
                        this.router.navigate(['/pos']);
                    } else {
                        // Fallback for unknown role
                        this.router.navigate(['/dashboard']);
                    }
                    return;
                }

                if (res?.success) {
                    // Conditional routing when no token but success flag
                    if (this.auth.isSuperAdmin()) {
                        this.router.navigate(['/super-admin']);
                    } else if (this.auth.isHO()) {
                        // Check if HO has billing enabled
                        if (this.auth.isHOWithBilling()) {
                            this.router.navigate(['/pos']); // HO with billing goes to POS
                        } else {
                            this.router.navigate(['/dashboard']); // HO without billing goes to dashboard
                        }
                    } else if (this.auth.isBranch()) {
                        this.router.navigate(['/pos']);
                    } else {
                        // Fallback for unknown role
                        this.router.navigate(['/dashboard']);
                    }
                    return;
                }

                this.error = 'Invalid login response';
            },
            error: (err) => {
                this.loading = false;
                this.error = err?.error?.message || 'Invalid credentials';
            },
        });
    }

}
