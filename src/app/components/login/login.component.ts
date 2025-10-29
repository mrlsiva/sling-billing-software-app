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

                    // Conditional routing based on owner_id
                    // If owner_id is null/undefined (owner user) -> POS
                    // If owner_id has value (branch/staff user) -> Dashboard
                    if (this.auth.isOwner()) {
                        this.router.navigate(['/pos']);
                    } else {
                        this.router.navigate(['/dashboard']);
                    }
                    return;
                }

                if (res?.success) {
                    // Conditional routing when no token but success flag
                    if (this.auth.isOwner()) {
                        this.router.navigate(['/pos']);
                    } else {
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
