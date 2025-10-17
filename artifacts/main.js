import { injectQuery as __vite__injectQuery } from "/@vite/client";import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/main.js");var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b ||= {})
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/main.ts
import { bootstrapApplication } from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_platform-browser.js?v=24267577";

// src/app/app.component.ts
import { Component } from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_core.js?v=24267577";
import { RouterOutlet } from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_router.js?v=24267577";
import * as i0 from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_core.js?v=24267577";
var AppComponent = class _AppComponent {
  static \u0275fac = function AppComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ i0.\u0275\u0275defineComponent({ type: _AppComponent, selectors: [["app-root"]], decls: 1, vars: 0, template: function AppComponent_Template(rf, ctx) {
    if (rf & 1) {
      i0.\u0275\u0275element(0, "router-outlet");
    }
  }, dependencies: [RouterOutlet], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i0.\u0275setClassMetadata(AppComponent, [{
    type: Component,
    args: [{
      selector: "app-root",
      standalone: true,
      imports: [RouterOutlet],
      template: `<router-outlet></router-outlet>`
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i0.\u0275setClassDebugInfo(AppComponent, { className: "AppComponent", filePath: "src/app/app.component.ts", lineNumber: 11 });
})();
(() => {
  const id = "src%2Fapp%2Fapp.component.ts%40AppComponent";
  function AppComponent_HmrLoad(t) {
    import(
      /* @vite-ignore */
      __vite__injectQuery(i0.\u0275\u0275getReplaceMetadataURL(id, t, import.meta.url), 'import')
    ).then((m) => m.default && i0.\u0275\u0275replaceMetadata(AppComponent, m.default, [i0], [RouterOutlet, Component], import.meta, id));
  }
  (typeof ngDevMode === "undefined" || ngDevMode) && AppComponent_HmrLoad(Date.now());
  (typeof ngDevMode === "undefined" || ngDevMode) && (import.meta.hot && import.meta.hot.on("angular:component-update", (d) => d.id === id && AppComponent_HmrLoad(d.timestamp)));
})();

// src/app/app.config.ts
import { provideRouter, withComponentInputBinding } from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_router.js?v=24267577";
import { provideHttpClient, withInterceptors } from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_common_http.js?v=24267577";
import { provideAnimations } from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_platform-browser_animations.js?v=24267577";

// src/app/components/login/login.component.ts
import { Component as Component2 } from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_core.js?v=24267577";
import { Validators, ReactiveFormsModule } from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_forms.js?v=24267577";
import { CommonModule } from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_common.js?v=24267577";
import * as i03 from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_core.js?v=24267577";
import * as i12 from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_forms.js?v=24267577";

// src/app/services/auth.service.ts
var auth_service_exports = {};
__export(auth_service_exports, {
  AuthService: () => AuthService
});
import { Injectable } from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_core.js?v=24267577";
import { HttpHeaders } from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_common_http.js?v=24267577";
import { tap } from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/rxjs_operators.js?v=24267577";

// src/environments/environment.ts
var environment = {
  production: false,
  apiBase: "http://3.110.13.56/api"
};

// src/app/services/auth.service.ts
import * as i02 from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_core.js?v=24267577";
import * as i1 from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_common_http.js?v=24267577";
import * as i2 from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_router.js?v=24267577";
var AuthService = class _AuthService {
  http;
  router;
  loginUrl = `${environment.apiBase}/login`;
  logoutUrl = `${environment.apiBase}/logout`;
  tokenKey = "auth_token";
  constructor(http, router) {
    this.http = http;
    this.router = router;
  }
  /** Get saved token */
  getToken() {
    return sessionStorage.getItem(this.tokenKey);
  }
  /** Perform login */
  login(phone, password) {
    return this.http.post(this.loginUrl, { phone, password }).pipe(tap((res) => {
      const token = res.token || res.access_token || res.auth_token;
      if (token) {
        sessionStorage.setItem(this.tokenKey, token);
      }
    }));
  }
  /** Perform logout */
  logout() {
    const token = this.getToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : void 0;
    return this.http.post(this.logoutUrl, {}, { headers }).pipe(tap(() => this.clearSession()));
  }
  /** Clear session */
  clearSession() {
    sessionStorage.removeItem(this.tokenKey);
    this.router.navigate(["/login"]);
  }
  /** Check login status */
  isLoggedIn() {
    return !!this.getToken();
  }
  static \u0275fac = function AuthService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthService)(i02.\u0275\u0275inject(i1.HttpClient), i02.\u0275\u0275inject(i2.Router));
  };
  static \u0275prov = /* @__PURE__ */ i02.\u0275\u0275defineInjectable({ token: _AuthService, factory: _AuthService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i02.\u0275setClassMetadata(AuthService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: i1.HttpClient }, { type: i2.Router }], null);
})();

// src/app/components/login/login.component.ts
import * as i3 from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_router.js?v=24267577";
import * as i4 from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_common.js?v=24267577";
function LoginComponent_div_14_Template(rf, ctx) {
  if (rf & 1) {
    i03.\u0275\u0275elementStart(0, "div", 7);
    i03.\u0275\u0275text(1);
    i03.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = i03.\u0275\u0275nextContext();
    i03.\u0275\u0275advance();
    i03.\u0275\u0275textInterpolate(ctx_r0.error);
  }
}
var LoginComponent = class _LoginComponent {
  fb;
  auth;
  router;
  form;
  loading = false;
  error = "";
  constructor(fb, auth, router) {
    this.fb = fb;
    this.auth = auth;
    this.router = router;
    this.form = this.fb.group({
      phone: ["", Validators.required],
      password: ["", Validators.required]
    });
  }
  submit() {
    if (this.form.invalid)
      return;
    this.loading = true;
    this.error = "";
    const { phone, password } = this.form.value;
    this.auth.login(phone, password).subscribe({
      next: (res) => {
        this.loading = false;
        const token = res.token || res.access_token || res.auth_token;
        if (token) {
          sessionStorage.setItem("auth_token", token);
          this.router.navigate(["/products"]);
        } else {
          this.error = "Invalid login response";
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || "Invalid credentials";
      }
    });
  }
  static \u0275fac = function LoginComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LoginComponent)(i03.\u0275\u0275directiveInject(i12.FormBuilder), i03.\u0275\u0275directiveInject(AuthService), i03.\u0275\u0275directiveInject(i3.Router));
  };
  static \u0275cmp = /* @__PURE__ */ i03.\u0275\u0275defineComponent({ type: _LoginComponent, selectors: [["app-login"]], decls: 15, vars: 4, consts: [[1, "login-container"], [3, "ngSubmit", "formGroup"], [1, "mb-3"], ["type", "text", "formControlName", "phone", "placeholder", "Enter phone", 1, "form-control"], ["type", "password", "formControlName", "password", "placeholder", "Enter password", 1, "form-control"], ["type", "submit", 1, "btn", "btn-primary", "w-100", 3, "disabled"], ["class", "text-danger mt-3", 4, "ngIf"], [1, "text-danger", "mt-3"]], template: function LoginComponent_Template(rf, ctx) {
    if (rf & 1) {
      i03.\u0275\u0275elementStart(0, "div", 0)(1, "h2");
      i03.\u0275\u0275text(2, "Login");
      i03.\u0275\u0275elementEnd();
      i03.\u0275\u0275elementStart(3, "form", 1);
      i03.\u0275\u0275listener("ngSubmit", function LoginComponent_Template_form_ngSubmit_3_listener() {
        return ctx.submit();
      });
      i03.\u0275\u0275elementStart(4, "div", 2)(5, "label");
      i03.\u0275\u0275text(6, "Phone");
      i03.\u0275\u0275elementEnd();
      i03.\u0275\u0275element(7, "input", 3);
      i03.\u0275\u0275elementEnd();
      i03.\u0275\u0275elementStart(8, "div", 2)(9, "label");
      i03.\u0275\u0275text(10, "Password");
      i03.\u0275\u0275elementEnd();
      i03.\u0275\u0275element(11, "input", 4);
      i03.\u0275\u0275elementEnd();
      i03.\u0275\u0275elementStart(12, "button", 5);
      i03.\u0275\u0275text(13);
      i03.\u0275\u0275elementEnd();
      i03.\u0275\u0275template(14, LoginComponent_div_14_Template, 2, 1, "div", 6);
      i03.\u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      i03.\u0275\u0275advance(3);
      i03.\u0275\u0275property("formGroup", ctx.form);
      i03.\u0275\u0275advance(9);
      i03.\u0275\u0275property("disabled", ctx.loading);
      i03.\u0275\u0275advance();
      i03.\u0275\u0275textInterpolate1(" ", ctx.loading ? "Logging in..." : "Login", " ");
      i03.\u0275\u0275advance();
      i03.\u0275\u0275property("ngIf", ctx.error);
    }
  }, dependencies: [CommonModule, i4.NgClass, i4.NgComponentOutlet, i4.NgForOf, i4.NgIf, i4.NgTemplateOutlet, i4.NgStyle, i4.NgSwitch, i4.NgSwitchCase, i4.NgSwitchDefault, i4.NgPlural, i4.NgPluralCase, ReactiveFormsModule, i12.\u0275NgNoValidate, i12.NgSelectOption, i12.\u0275NgSelectMultipleOption, i12.DefaultValueAccessor, i12.NumberValueAccessor, i12.RangeValueAccessor, i12.CheckboxControlValueAccessor, i12.SelectControlValueAccessor, i12.SelectMultipleControlValueAccessor, i12.RadioControlValueAccessor, i12.NgControlStatus, i12.NgControlStatusGroup, i12.RequiredValidator, i12.MinLengthValidator, i12.MaxLengthValidator, i12.PatternValidator, i12.CheckboxRequiredValidator, i12.EmailValidator, i12.MinValidator, i12.MaxValidator, i12.FormControlDirective, i12.FormGroupDirective, i12.FormControlName, i12.FormGroupName, i12.FormArrayName, i4.AsyncPipe, i4.UpperCasePipe, i4.LowerCasePipe, i4.JsonPipe, i4.SlicePipe, i4.DecimalPipe, i4.PercentPipe, i4.TitleCasePipe, i4.CurrencyPipe, i4.DatePipe, i4.I18nPluralPipe, i4.I18nSelectPipe, i4.KeyValuePipe], styles: ["\n\n[_nghost-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  background-color: #f5f5f5;\n}\nform[_ngcontent-%COMP%] {\n  background: #fff;\n  padding: 2rem;\n  border-radius: 8px;\n  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\n  width: 300px;\n}\ninput[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.5rem;\n  margin-bottom: 1rem;\n  border-radius: 4px;\n  border: 1px solid #ccc;\n}\nbutton[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.5rem;\n  background-color: #007bff;\n  border: none;\n  color: #fff;\n  border-radius: 4px;\n  cursor: pointer;\n}\nbutton[_ngcontent-%COMP%]:disabled {\n  background-color: #a0c8ff;\n}\n.error[_ngcontent-%COMP%] {\n  color: red;\n  margin-bottom: 1rem;\n  font-size: 0.9rem;\n  text-align: center;\n}\n/*# sourceMappingURL=login.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i03.\u0275setClassMetadata(LoginComponent, [{
    type: Component2,
    args: [{ selector: "app-login", standalone: true, imports: [CommonModule, ReactiveFormsModule], template: `<div class="login-container">\r
    <h2>Login</h2>\r
\r
    <form [formGroup]="form" (ngSubmit)="submit()">\r
        <div class="mb-3">\r
            <label>Phone</label>\r
            <input type="text" formControlName="phone" class="form-control" placeholder="Enter phone" />\r
        </div>\r
\r
        <div class="mb-3">\r
            <label>Password</label>\r
            <input type="password" formControlName="password" class="form-control" placeholder="Enter password" />\r
        </div>\r
\r
        <button type="submit" [disabled]="loading" class="btn btn-primary w-100">\r
            {{ loading ? 'Logging in...' : 'Login' }}\r
        </button>\r
\r
        <div *ngIf="error" class="text-danger mt-3">{{ error }}</div>\r
    </form>\r
</div>`, styles: ["/* src/app/components/login/login.component.scss */\n:host {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  background-color: #f5f5f5;\n}\nform {\n  background: #fff;\n  padding: 2rem;\n  border-radius: 8px;\n  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\n  width: 300px;\n}\ninput {\n  width: 100%;\n  padding: 0.5rem;\n  margin-bottom: 1rem;\n  border-radius: 4px;\n  border: 1px solid #ccc;\n}\nbutton {\n  width: 100%;\n  padding: 0.5rem;\n  background-color: #007bff;\n  border: none;\n  color: #fff;\n  border-radius: 4px;\n  cursor: pointer;\n}\nbutton:disabled {\n  background-color: #a0c8ff;\n}\n.error {\n  color: red;\n  margin-bottom: 1rem;\n  font-size: 0.9rem;\n  text-align: center;\n}\n/*# sourceMappingURL=login.component.css.map */\n"] }]
  }], () => [{ type: i12.FormBuilder }, { type: AuthService }, { type: i3.Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i03.\u0275setClassDebugInfo(LoginComponent, { className: "LoginComponent", filePath: "src/app/components/login/login.component.ts", lineNumber: 14 });
})();
(() => {
  const id = "src%2Fapp%2Fcomponents%2Flogin%2Flogin.component.ts%40LoginComponent";
  function LoginComponent_HmrLoad(t) {
    import(
      /* @vite-ignore */
      __vite__injectQuery(i03.\u0275\u0275getReplaceMetadataURL(id, t, import.meta.url), 'import')
    ).then((m) => m.default && i03.\u0275\u0275replaceMetadata(LoginComponent, m.default, [i03, i4, i12, auth_service_exports, i3], [CommonModule, ReactiveFormsModule, Component2], import.meta, id));
  }
  (typeof ngDevMode === "undefined" || ngDevMode) && LoginComponent_HmrLoad(Date.now());
  (typeof ngDevMode === "undefined" || ngDevMode) && (import.meta.hot && import.meta.hot.on("angular:component-update", (d) => d.id === id && LoginComponent_HmrLoad(d.timestamp)));
})();

// src/app/components/product-list/product-list.component.ts
import { Component as Component3 } from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_core.js?v=24267577";
import { CommonModule as CommonModule2 } from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_common.js?v=24267577";
import { RouterModule } from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_router.js?v=24267577";
import * as i05 from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_core.js?v=24267577";

// src/app/services/product.service.ts
var product_service_exports = {};
__export(product_service_exports, {
  ProductService: () => ProductService
});
import { Injectable as Injectable2 } from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_core.js?v=24267577";
import * as i04 from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_core.js?v=24267577";
import * as i13 from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_common_http.js?v=24267577";
var ProductService = class _ProductService {
  http;
  url = `${environment.apiBase}/products/list`;
  constructor(http) {
    this.http = http;
  }
  list() {
    return this.http.get(this.url);
  }
  static \u0275fac = function ProductService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProductService)(i04.\u0275\u0275inject(i13.HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ i04.\u0275\u0275defineInjectable({ token: _ProductService, factory: _ProductService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i04.\u0275setClassMetadata(ProductService, [{
    type: Injectable2,
    args: [{ providedIn: "root" }]
  }], () => [{ type: i13.HttpClient }], null);
})();

// src/app/components/product-list/product-list.component.ts
import * as i32 from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_common.js?v=24267577";
import * as i42 from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_router.js?v=24267577";
function ProductListComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "div");
    i05.\u0275\u0275text(1, "Loading...");
    i05.\u0275\u0275elementEnd();
  }
}
function ProductListComponent_div_6_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "div");
    i05.\u0275\u0275text(1);
    i05.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = i05.\u0275\u0275nextContext();
    i05.\u0275\u0275advance();
    i05.\u0275\u0275textInterpolate(ctx_r0.error);
  }
}
function ProductListComponent_ul_7_li_1_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "li");
    i05.\u0275\u0275text(1);
    i05.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r2 = ctx.$implicit;
    i05.\u0275\u0275advance();
    i05.\u0275\u0275textInterpolate2(" ", p_r2.name, " - ", p_r2.price, " ");
  }
}
function ProductListComponent_ul_7_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "ul");
    i05.\u0275\u0275template(1, ProductListComponent_ul_7_li_1_Template, 2, 2, "li", 2);
    i05.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = i05.\u0275\u0275nextContext();
    i05.\u0275\u0275advance();
    i05.\u0275\u0275property("ngForOf", ctx_r0.products);
  }
}
function ProductListComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "div");
    i05.\u0275\u0275text(1, "No products");
    i05.\u0275\u0275elementEnd();
  }
}
var ProductListComponent = class _ProductListComponent {
  productService;
  auth;
  products = [];
  loading = false;
  error = null;
  constructor(productService, auth) {
    this.productService = productService;
    this.auth = auth;
  }
  ngOnInit() {
    this.fetchProducts();
  }
  fetchProducts() {
    this.loading = true;
    this.error = null;
    this.productService.list().subscribe({
      next: (res) => {
        this.products = res.data ?? res;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || "Failed to load products";
        this.loading = false;
      }
    });
  }
  logout() {
    this.auth.logout().subscribe({
      error: () => this.auth.clearSession()
    });
  }
  static \u0275fac = function ProductListComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProductListComponent)(i05.\u0275\u0275directiveInject(ProductService), i05.\u0275\u0275directiveInject(AuthService));
  };
  static \u0275cmp = /* @__PURE__ */ i05.\u0275\u0275defineComponent({ type: _ProductListComponent, selectors: [["app-product-list"]], decls: 9, vars: 4, consts: [[3, "click"], [4, "ngIf"], [4, "ngFor", "ngForOf"]], template: function ProductListComponent_Template(rf, ctx) {
    if (rf & 1) {
      i05.\u0275\u0275elementStart(0, "div")(1, "button", 0);
      i05.\u0275\u0275listener("click", function ProductListComponent_Template_button_click_1_listener() {
        return ctx.logout();
      });
      i05.\u0275\u0275text(2, "Logout");
      i05.\u0275\u0275elementEnd();
      i05.\u0275\u0275elementStart(3, "h2");
      i05.\u0275\u0275text(4, "Products");
      i05.\u0275\u0275elementEnd();
      i05.\u0275\u0275template(5, ProductListComponent_div_5_Template, 2, 0, "div", 1)(6, ProductListComponent_div_6_Template, 2, 1, "div", 1)(7, ProductListComponent_ul_7_Template, 2, 1, "ul", 1)(8, ProductListComponent_div_8_Template, 2, 0, "div", 1);
      i05.\u0275\u0275elementEnd();
    }
    if (rf & 2) {
      i05.\u0275\u0275advance(5);
      i05.\u0275\u0275property("ngIf", ctx.loading);
      i05.\u0275\u0275advance();
      i05.\u0275\u0275property("ngIf", ctx.error);
      i05.\u0275\u0275advance();
      i05.\u0275\u0275property("ngIf", ctx.products == null ? null : ctx.products.length);
      i05.\u0275\u0275advance();
      i05.\u0275\u0275property("ngIf", !(ctx.products == null ? null : ctx.products.length) && !ctx.loading);
    }
  }, dependencies: [CommonModule2, i32.NgClass, i32.NgComponentOutlet, i32.NgForOf, i32.NgIf, i32.NgTemplateOutlet, i32.NgStyle, i32.NgSwitch, i32.NgSwitchCase, i32.NgSwitchDefault, i32.NgPlural, i32.NgPluralCase, RouterModule, i42.RouterOutlet, i42.RouterLink, i42.RouterLinkActive, i42.\u0275EmptyOutletComponent, i32.AsyncPipe, i32.UpperCasePipe, i32.LowerCasePipe, i32.JsonPipe, i32.SlicePipe, i32.DecimalPipe, i32.PercentPipe, i32.TitleCasePipe, i32.CurrencyPipe, i32.DatePipe, i32.I18nPluralPipe, i32.I18nSelectPipe, i32.KeyValuePipe], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  padding: 2rem;\n  background-color: #f5f5f5;\n}\nh2[_ngcontent-%COMP%] {\n  margin-bottom: 1rem;\n}\nul[_ngcontent-%COMP%] {\n  list-style: none;\n  padding: 0;\n}\nli[_ngcontent-%COMP%] {\n  background: #fff;\n  padding: 0.75rem 1rem;\n  margin-bottom: 0.5rem;\n  border-radius: 6px;\n  box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);\n}\n.loading[_ngcontent-%COMP%], \n.error[_ngcontent-%COMP%], \n.no-products[_ngcontent-%COMP%] {\n  text-align: center;\n  margin: 1rem 0;\n  font-weight: bold;\n  color: #555;\n}\nbutton.logout[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n  padding: 0.5rem 1rem;\n  background-color: #dc3545;\n  color: #fff;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n}\n/*# sourceMappingURL=product-list.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i05.\u0275setClassMetadata(ProductListComponent, [{
    type: Component3,
    args: [{ selector: "app-product-list", standalone: true, imports: [CommonModule2, RouterModule], template: '<div>\r\n    <button (click)="logout()">Logout</button>\r\n    <h2>Products</h2>\r\n    <div *ngIf="loading">Loading...</div>\r\n    <div *ngIf="error">{{error}}</div>\r\n    <ul *ngIf="products?.length">\r\n        <li *ngFor="let p of products">\r\n            {{ p.name }} - {{ p.price }}\r\n        </li>\r\n    </ul>\r\n    <div *ngIf="!products?.length && !loading">No products</div>\r\n</div>', styles: ["/* src/app/components/product-list/product-list.component.scss */\n:host {\n  display: block;\n  padding: 2rem;\n  background-color: #f5f5f5;\n}\nh2 {\n  margin-bottom: 1rem;\n}\nul {\n  list-style: none;\n  padding: 0;\n}\nli {\n  background: #fff;\n  padding: 0.75rem 1rem;\n  margin-bottom: 0.5rem;\n  border-radius: 6px;\n  box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);\n}\n.loading,\n.error,\n.no-products {\n  text-align: center;\n  margin: 1rem 0;\n  font-weight: bold;\n  color: #555;\n}\nbutton.logout {\n  margin-top: 1rem;\n  padding: 0.5rem 1rem;\n  background-color: #dc3545;\n  color: #fff;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n}\n/*# sourceMappingURL=product-list.component.css.map */\n"] }]
  }], () => [{ type: ProductService }, { type: AuthService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i05.\u0275setClassDebugInfo(ProductListComponent, { className: "ProductListComponent", filePath: "src/app/components/product-list/product-list.component.ts", lineNumber: 14 });
})();
(() => {
  const id = "src%2Fapp%2Fcomponents%2Fproduct-list%2Fproduct-list.component.ts%40ProductListComponent";
  function ProductListComponent_HmrLoad(t) {
    import(
      /* @vite-ignore */
      __vite__injectQuery(i05.\u0275\u0275getReplaceMetadataURL(id, t, import.meta.url), 'import')
    ).then((m) => m.default && i05.\u0275\u0275replaceMetadata(ProductListComponent, m.default, [i05, i32, i42, product_service_exports, auth_service_exports], [CommonModule2, RouterModule, Component3], import.meta, id));
  }
  (typeof ngDevMode === "undefined" || ngDevMode) && ProductListComponent_HmrLoad(Date.now());
  (typeof ngDevMode === "undefined" || ngDevMode) && (import.meta.hot && import.meta.hot.on("angular:component-update", (d) => d.id === id && ProductListComponent_HmrLoad(d.timestamp)));
})();

// src/app/guards/auth.guard.ts
import { Injectable as Injectable3 } from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_core.js?v=24267577";
import * as i06 from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_core.js?v=24267577";
import * as i22 from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_router.js?v=24267577";
var AuthGuard = class _AuthGuard {
  auth;
  router;
  constructor(auth, router) {
    this.auth = auth;
    this.router = router;
  }
  canActivate() {
    if (this.auth.isLoggedIn()) {
      return true;
    } else {
      return this.router.createUrlTree(["/login"]);
    }
  }
  static \u0275fac = function AuthGuard_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthGuard)(i06.\u0275\u0275inject(AuthService), i06.\u0275\u0275inject(i22.Router));
  };
  static \u0275prov = /* @__PURE__ */ i06.\u0275\u0275defineInjectable({ token: _AuthGuard, factory: _AuthGuard.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i06.\u0275setClassMetadata(AuthGuard, [{
    type: Injectable3,
    args: [{ providedIn: "root" }]
  }], () => [{ type: AuthService }, { type: i22.Router }], null);
})();

// src/app/app.routes.ts
var routes = [
  { path: "login", component: LoginComponent },
  { path: "products", component: ProductListComponent, canActivate: [AuthGuard] },
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "**", redirectTo: "/login" }
];

// src/app/interceptors/auth.interceptor.ts
import { inject } from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_core.js?v=24267577";
var authInterceptor = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }
  return next(req);
};

// src/app/app.config.ts
var appConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations()
  ]
};

// src/main.ts
import { provideAnimations as provideAnimations2 } from "/@fs/C:/xampp/htdocs/sling-billing-software-app/.angular/cache/20.3.6/sling-billing-software-app/vite/deps/@angular_platform-browser_animations.js?v=24267577";
bootstrapApplication(AppComponent, __spreadProps(__spreadValues({}, appConfig), {
  providers: [
    provideAnimations2()
  ]
})).catch((err) => console.error(err));


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9tYWluLnRzIiwic3JjL2FwcC9hcHAuY29tcG9uZW50LnRzIiwic3JjL2FwcC9hcHAuY29uZmlnLnRzIiwic3JjL2FwcC9jb21wb25lbnRzL2xvZ2luL2xvZ2luLmNvbXBvbmVudC50cyIsInNyYy9hcHAvY29tcG9uZW50cy9sb2dpbi9sb2dpbi5jb21wb25lbnQuaHRtbCIsInNyYy9hcHAvc2VydmljZXMvYXV0aC5zZXJ2aWNlLnRzIiwic3JjL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudC50cyIsInNyYy9hcHAvY29tcG9uZW50cy9wcm9kdWN0LWxpc3QvcHJvZHVjdC1saXN0LmNvbXBvbmVudC50cyIsInNyYy9hcHAvY29tcG9uZW50cy9wcm9kdWN0LWxpc3QvcHJvZHVjdC1saXN0LmNvbXBvbmVudC5odG1sIiwic3JjL2FwcC9zZXJ2aWNlcy9wcm9kdWN0LnNlcnZpY2UudHMiLCJzcmMvYXBwL2d1YXJkcy9hdXRoLmd1YXJkLnRzIiwic3JjL2FwcC9hcHAucm91dGVzLnRzIiwic3JjL2FwcC9pbnRlcmNlcHRvcnMvYXV0aC5pbnRlcmNlcHRvci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBib290c3RyYXBBcHBsaWNhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xyXG5pbXBvcnQgeyBBcHBDb21wb25lbnQgfSBmcm9tICcuL2FwcC9hcHAuY29tcG9uZW50JztcclxuaW1wb3J0IHsgYXBwQ29uZmlnIH0gZnJvbSAnLi9hcHAvYXBwLmNvbmZpZyc7XHJcbmltcG9ydCB7IHByb3ZpZGVBbmltYXRpb25zIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcclxuXHJcbmJvb3RzdHJhcEFwcGxpY2F0aW9uKEFwcENvbXBvbmVudCwge1xyXG4gIC4uLmFwcENvbmZpZyxcclxuICBwcm92aWRlcnM6IFtcclxuICAgIHByb3ZpZGVBbmltYXRpb25zKCksXHJcbiAgXVxyXG59KS5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcihlcnIpKTtcclxuIiwiLy8gc3JjL2FwcC9hcHAuY29tcG9uZW50LnRzXHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBSb3V0ZXJPdXRsZXQgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtcm9vdCcsXHJcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcclxuICBpbXBvcnRzOiBbUm91dGVyT3V0bGV0XSxcclxuICB0ZW1wbGF0ZTogYDxyb3V0ZXItb3V0bGV0Pjwvcm91dGVyLW91dGxldD5gLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQXBwQ29tcG9uZW50IHsgfVxyXG4iLCJpbXBvcnQgeyBBcHBsaWNhdGlvbkNvbmZpZyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBwcm92aWRlUm91dGVyLCB3aXRoQ29tcG9uZW50SW5wdXRCaW5kaW5nIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgcHJvdmlkZUh0dHBDbGllbnQsIHdpdGhJbnRlcmNlcHRvcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IHByb3ZpZGVBbmltYXRpb25zIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcclxuaW1wb3J0IHsgcm91dGVzIH0gZnJvbSAnLi9hcHAucm91dGVzJztcclxuaW1wb3J0IHsgYXV0aEludGVyY2VwdG9yIH0gZnJvbSAnLi9pbnRlcmNlcHRvcnMvYXV0aC5pbnRlcmNlcHRvcic7XHJcblxyXG5leHBvcnQgY29uc3QgYXBwQ29uZmlnOiBBcHBsaWNhdGlvbkNvbmZpZyA9IHtcclxuICBwcm92aWRlcnM6IFtcclxuICAgIHByb3ZpZGVSb3V0ZXIocm91dGVzLCB3aXRoQ29tcG9uZW50SW5wdXRCaW5kaW5nKCkpLFxyXG4gICAgcHJvdmlkZUh0dHBDbGllbnQod2l0aEludGVyY2VwdG9ycyhbYXV0aEludGVyY2VwdG9yXSkpLFxyXG4gICAgcHJvdmlkZUFuaW1hdGlvbnMoKVxyXG4gIF1cclxufTtcclxuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMsIFJlYWN0aXZlRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvYXV0aC5zZXJ2aWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdhcHAtbG9naW4nLFxyXG4gICAgc3RhbmRhbG9uZTogdHJ1ZSxcclxuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIFJlYWN0aXZlRm9ybXNNb2R1bGVdLFxyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2xvZ2luLmNvbXBvbmVudC5odG1sJyxcclxuICAgIHN0eWxlVXJsczogWycuL2xvZ2luLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIExvZ2luQ29tcG9uZW50IHtcclxuICAgIGZvcm06IEZvcm1Hcm91cDtcclxuICAgIGxvYWRpbmcgPSBmYWxzZTtcclxuICAgIGVycm9yID0gJyc7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIsIHByaXZhdGUgYXV0aDogQXV0aFNlcnZpY2UsIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIpIHtcclxuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcclxuICAgICAgICAgICAgcGhvbmU6IFsnJywgVmFsaWRhdG9ycy5yZXF1aXJlZF0sXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiBbJycsIFZhbGlkYXRvcnMucmVxdWlyZWRdXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3VibWl0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmZvcm0uaW52YWxpZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZXJyb3IgPSAnJztcclxuXHJcbiAgICAgICAgY29uc3QgeyBwaG9uZSwgcGFzc3dvcmQgfSA9IHRoaXMuZm9ybS52YWx1ZTtcclxuXHJcbiAgICAgICAgdGhpcy5hdXRoLmxvZ2luKHBob25lLCBwYXNzd29yZCkuc3Vic2NyaWJlKHtcclxuICAgICAgICAgICAgbmV4dDogKHJlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0b2tlbiA9IHJlcy50b2tlbiB8fCByZXMuYWNjZXNzX3Rva2VuIHx8IHJlcy5hdXRoX3Rva2VuO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYXV0aF90b2tlbicsIHRva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbJy9wcm9kdWN0cyddKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvciA9ICdJbnZhbGlkIGxvZ2luIHJlc3BvbnNlJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvciA9IGVycj8uZXJyb3I/Lm1lc3NhZ2UgfHwgJ0ludmFsaWQgY3JlZGVudGlhbHMnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiPGRpdiBjbGFzcz1cImxvZ2luLWNvbnRhaW5lclwiPlxyXG4gICAgPGgyPkxvZ2luPC9oMj5cclxuXHJcbiAgICA8Zm9ybSBbZm9ybUdyb3VwXT1cImZvcm1cIiAobmdTdWJtaXQpPVwic3VibWl0KClcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibWItM1wiPlxyXG4gICAgICAgICAgICA8bGFiZWw+UGhvbmU8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBmb3JtQ29udHJvbE5hbWU9XCJwaG9uZVwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgcGxhY2Vob2xkZXI9XCJFbnRlciBwaG9uZVwiIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtYi0zXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbD5QYXNzd29yZDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicGFzc3dvcmRcIiBmb3JtQ29udHJvbE5hbWU9XCJwYXNzd29yZFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgcGxhY2Vob2xkZXI9XCJFbnRlciBwYXNzd29yZFwiIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIFtkaXNhYmxlZF09XCJsb2FkaW5nXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgdy0xMDBcIj5cclxuICAgICAgICAgICAge3sgbG9hZGluZyA/ICdMb2dnaW5nIGluLi4uJyA6ICdMb2dpbicgfX1cclxuICAgICAgICA8L2J1dHRvbj5cclxuXHJcbiAgICAgICAgPGRpdiAqbmdJZj1cImVycm9yXCIgY2xhc3M9XCJ0ZXh0LWRhbmdlciBtdC0zXCI+e3sgZXJyb3IgfX08L2Rpdj5cclxuICAgIDwvZm9ybT5cclxuPC9kaXY+IiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IGVudmlyb25tZW50IH0gZnJvbSAnLi4vLi4vZW52aXJvbm1lbnRzL2Vudmlyb25tZW50JztcclxuXHJcbmludGVyZmFjZSBMb2dpblJlc3BvbnNlIHtcclxuICAgIHRva2VuPzogc3RyaW5nO1xyXG4gICAgYWNjZXNzX3Rva2VuPzogc3RyaW5nO1xyXG4gICAgYXV0aF90b2tlbj86IHN0cmluZztcclxuICAgIHVzZXI/OiBhbnk7XHJcbiAgICBtZXNzYWdlPzogc3RyaW5nO1xyXG59XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIEF1dGhTZXJ2aWNlIHtcclxuICAgIHByaXZhdGUgbG9naW5VcmwgPSBgJHtlbnZpcm9ubWVudC5hcGlCYXNlfS9sb2dpbmA7XHJcbiAgICBwcml2YXRlIGxvZ291dFVybCA9IGAke2Vudmlyb25tZW50LmFwaUJhc2V9L2xvZ291dGA7XHJcbiAgICBwcml2YXRlIHRva2VuS2V5ID0gJ2F1dGhfdG9rZW4nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCwgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcikgeyB9XHJcblxyXG4gICAgLyoqIEdldCBzYXZlZCB0b2tlbiAqL1xyXG4gICAgZ2V0VG9rZW4oKTogc3RyaW5nIHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIHNlc3Npb25TdG9yYWdlLmdldEl0ZW0odGhpcy50b2tlbktleSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFBlcmZvcm0gbG9naW4gKi9cclxuICAgIGxvZ2luKHBob25lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPExvZ2luUmVzcG9uc2U+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Q8TG9naW5SZXNwb25zZT4odGhpcy5sb2dpblVybCwgeyBwaG9uZSwgcGFzc3dvcmQgfSkucGlwZShcclxuICAgICAgICAgICAgdGFwKHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0b2tlbiA9IHJlcy50b2tlbiB8fCByZXMuYWNjZXNzX3Rva2VuIHx8IHJlcy5hdXRoX3Rva2VuO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSh0aGlzLnRva2VuS2V5LCB0b2tlbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogUGVyZm9ybSBsb2dvdXQgKi9cclxuICAgIGxvZ291dCgpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICAgIGNvbnN0IHRva2VuID0gdGhpcy5nZXRUb2tlbigpO1xyXG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSB0b2tlbiA/IG5ldyBIdHRwSGVhZGVycyh7IEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gIH0pIDogdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodGhpcy5sb2dvdXRVcmwsIHt9LCB7IGhlYWRlcnMgfSkucGlwZShcclxuICAgICAgICAgICAgdGFwKCgpID0+IHRoaXMuY2xlYXJTZXNzaW9uKCkpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQ2xlYXIgc2Vzc2lvbiAqL1xyXG4gICAgY2xlYXJTZXNzaW9uKCk6IHZvaWQge1xyXG4gICAgICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy50b2tlbktleSk7XHJcbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoWycvbG9naW4nXSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIENoZWNrIGxvZ2luIHN0YXR1cyAqL1xyXG4gICAgaXNMb2dnZWRJbigpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gISF0aGlzLmdldFRva2VuKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGNvbnN0IGVudmlyb25tZW50ID0ge1xyXG4gICAgcHJvZHVjdGlvbjogZmFsc2UsXHJcbiAgICBhcGlCYXNlOiAnaHR0cDovLzMuMTEwLjEzLjU2L2FwaSdcclxufTtcclxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgUHJvZHVjdFNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9wcm9kdWN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2F1dGguc2VydmljZSc7XHJcbmltcG9ydCB7IFJvdXRlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnYXBwLXByb2R1Y3QtbGlzdCcsXHJcbiAgICBzdGFuZGFsb25lOiB0cnVlLFxyXG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgUm91dGVyTW9kdWxlXSxcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9wcm9kdWN0LWxpc3QuY29tcG9uZW50Lmh0bWwnLFxyXG4gICAgc3R5bGVVcmxzOiBbJy4vcHJvZHVjdC1saXN0LmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIFByb2R1Y3RMaXN0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICAgIHByb2R1Y3RzOiBhbnlbXSA9IFtdO1xyXG4gICAgbG9hZGluZyA9IGZhbHNlO1xyXG4gICAgZXJyb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcHJvZHVjdFNlcnZpY2U6IFByb2R1Y3RTZXJ2aWNlLCBwcml2YXRlIGF1dGg6IEF1dGhTZXJ2aWNlKSB7IH1cclxuXHJcbiAgICBuZ09uSW5pdCgpIHtcclxuICAgICAgICB0aGlzLmZldGNoUHJvZHVjdHMoKTtcclxuICAgIH1cclxuXHJcbiAgICBmZXRjaFByb2R1Y3RzKCkge1xyXG4gICAgICAgIHRoaXMubG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5lcnJvciA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMucHJvZHVjdFNlcnZpY2UubGlzdCgpLnN1YnNjcmliZSh7XHJcbiAgICAgICAgICAgIG5leHQ6IChyZXM6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gYWRhcHQgYWNjb3JkaW5nIHRvIHlvdXIgQVBJIHJlc3BvbnNlIHN0cnVjdHVyZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9kdWN0cyA9IHJlcy5kYXRhID8/IHJlcztcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvciA9IGVycj8uZXJyb3I/Lm1lc3NhZ2UgfHwgJ0ZhaWxlZCB0byBsb2FkIHByb2R1Y3RzJztcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9nb3V0KCkge1xyXG4gICAgICAgIHRoaXMuYXV0aC5sb2dvdXQoKS5zdWJzY3JpYmUoe1xyXG4gICAgICAgICAgICBlcnJvcjogKCkgPT4gdGhpcy5hdXRoLmNsZWFyU2Vzc2lvbigpXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiPGRpdj5cclxuICAgIDxidXR0b24gKGNsaWNrKT1cImxvZ291dCgpXCI+TG9nb3V0PC9idXR0b24+XHJcbiAgICA8aDI+UHJvZHVjdHM8L2gyPlxyXG4gICAgPGRpdiAqbmdJZj1cImxvYWRpbmdcIj5Mb2FkaW5nLi4uPC9kaXY+XHJcbiAgICA8ZGl2ICpuZ0lmPVwiZXJyb3JcIj57e2Vycm9yfX08L2Rpdj5cclxuICAgIDx1bCAqbmdJZj1cInByb2R1Y3RzPy5sZW5ndGhcIj5cclxuICAgICAgICA8bGkgKm5nRm9yPVwibGV0IHAgb2YgcHJvZHVjdHNcIj5cclxuICAgICAgICAgICAge3sgcC5uYW1lIH19IC0ge3sgcC5wcmljZSB9fVxyXG4gICAgICAgIDwvbGk+XHJcbiAgICA8L3VsPlxyXG4gICAgPGRpdiAqbmdJZj1cIiFwcm9kdWN0cz8ubGVuZ3RoICYmICFsb2FkaW5nXCI+Tm8gcHJvZHVjdHM8L2Rpdj5cclxuPC9kaXY+IiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBlbnZpcm9ubWVudCB9IGZyb20gJy4uLy4uL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBQcm9kdWN0U2VydmljZSB7XHJcbiAgICBwcml2YXRlIHVybCA9IGAke2Vudmlyb25tZW50LmFwaUJhc2V9L3Byb2R1Y3RzL2xpc3RgO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkgeyB9XHJcblxyXG4gICAgbGlzdCgpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHRoaXMudXJsKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENhbkFjdGl2YXRlLCBSb3V0ZXIsIFVybFRyZWUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL2F1dGguc2VydmljZSc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgQXV0aEd1YXJkIGltcGxlbWVudHMgQ2FuQWN0aXZhdGUge1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhdXRoOiBBdXRoU2VydmljZSwgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcikgeyB9XHJcblxyXG4gICAgY2FuQWN0aXZhdGUoKTogYm9vbGVhbiB8IFVybFRyZWUge1xyXG4gICAgICAgIGlmICh0aGlzLmF1dGguaXNMb2dnZWRJbigpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJvdXRlci5jcmVhdGVVcmxUcmVlKFsnL2xvZ2luJ10pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBSb3V0ZXMgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBMb2dpbkNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9sb2dpbi9sb2dpbi5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBQcm9kdWN0TGlzdENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9wcm9kdWN0LWxpc3QvcHJvZHVjdC1saXN0LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEF1dGhHdWFyZCB9IGZyb20gJy4vZ3VhcmRzL2F1dGguZ3VhcmQnO1xyXG5cclxuZXhwb3J0IGNvbnN0IHJvdXRlczogUm91dGVzID0gW1xyXG4gICAgeyBwYXRoOiAnbG9naW4nLCBjb21wb25lbnQ6IExvZ2luQ29tcG9uZW50IH0sXHJcbiAgICB7IHBhdGg6ICdwcm9kdWN0cycsIGNvbXBvbmVudDogUHJvZHVjdExpc3RDb21wb25lbnQsIGNhbkFjdGl2YXRlOiBbQXV0aEd1YXJkXSB9LFxyXG4gICAgeyBwYXRoOiAnJywgcmVkaXJlY3RUbzogJy9sb2dpbicsIHBhdGhNYXRjaDogJ2Z1bGwnIH0sXHJcbiAgICB7IHBhdGg6ICcqKicsIHJlZGlyZWN0VG86ICcvbG9naW4nIH0sXHJcbl07XHJcbiIsImltcG9ydCB7IEh0dHBJbnRlcmNlcHRvckZuIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBpbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9hdXRoLnNlcnZpY2UnO1xyXG5cclxuLyoqXHJcbiAqIEZ1bmN0aW9uYWwgaW50ZXJjZXB0b3IgdG8gYXR0YWNoIEJlYXJlciB0b2tlbiB0byBhbGwgQVBJIHJlcXVlc3RzXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgYXV0aEludGVyY2VwdG9yOiBIdHRwSW50ZXJjZXB0b3JGbiA9IChyZXEsIG5leHQpID0+IHtcclxuICAgIGNvbnN0IGF1dGggPSBpbmplY3QoQXV0aFNlcnZpY2UpO1xyXG4gICAgY29uc3QgdG9rZW4gPSBhdXRoLmdldFRva2VuKCk7XHJcblxyXG4gICAgaWYgKHRva2VuKSB7XHJcbiAgICAgICAgY29uc3QgY2xvbmVkID0gcmVxLmNsb25lKHtcclxuICAgICAgICAgICAgc2V0SGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Rva2VufWBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBuZXh0KGNsb25lZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5leHQocmVxKTtcclxufTtcclxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsU0FBUyw0QkFBNEI7OztBQ0NyQyxTQUFTLGlCQUFpQjtBQUMxQixTQUFTLG9CQUFvQjs7QUFRdkIsSUFBTyxlQUFQLE1BQU8sY0FBWTs7cUNBQVosZUFBWTtFQUFBOzRFQUFaLGVBQVksV0FBQSxDQUFBLENBQUEsVUFBQSxDQUFBLEdBQUEsT0FBQSxHQUFBLE1BQUEsR0FBQSxVQUFBLFNBQUEsc0JBQUEsSUFBQSxLQUFBO0FBQUEsUUFBQSxLQUFBLEdBQUE7QUFGWixNQUFBLHVCQUFBLEdBQUEsZUFBQTs7b0JBREQsWUFBWSxHQUFBLGVBQUEsRUFBQSxDQUFBOzs7K0VBR1gsY0FBWSxDQUFBO1VBTnhCO1dBQVU7TUFDVCxVQUFVO01BQ1YsWUFBWTtNQUNaLFNBQVMsQ0FBQyxZQUFZO01BQ3RCLFVBQVU7S0FDWDs7OztnRkFDWSxjQUFZLEVBQUEsV0FBQSxnQkFBQSxVQUFBLDRCQUFBLFlBQUEsR0FBQSxDQUFBO0FBQUEsR0FBQTs7Ozs7Ozs4REFBWixjQUFZLEVBQUEsU0FBQSxDQUFBLEVBQUEsR0FBQSxDQUFBLGNBQUEsU0FBQSxHQUFBLGFBQUEsRUFBQSxDQUFBO0VBQUE7QUFBQSxHQUFBLE9BQUEsY0FBQSxlQUFBLGNBQUEscUJBQUEsS0FBQSxJQUFBLENBQUE7QUFBQSxHQUFBLE9BQUEsY0FBQSxlQUFBLGVBQUEsWUFBQSxPQUFBLFlBQUEsSUFBQSxHQUFBLDRCQUFBLE9BQUEsRUFBQSxPQUFBLE1BQUEscUJBQUEsRUFBQSxTQUFBLENBQUE7QUFBQSxHQUFBOzs7QUNUekIsU0FBUyxlQUFlLGlDQUFpQztBQUN6RCxTQUFTLG1CQUFtQix3QkFBd0I7QUFDcEQsU0FBUyx5QkFBeUI7OztBQ0hsQyxTQUFTLGFBQUFBLGtCQUFpQjtBQUMxQixTQUFpQyxZQUFZLDJCQUEyQjtBQUV4RSxTQUFTLG9CQUFvQjs7Ozs7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UyxDQUFBO1VBRHJCQztXQUFXLEVBQUUsWUFBWSxPQUFNLENBQUU7Ozs7O0FDQzNCLElBQU0sU0FBaUI7RUFDMUIsRUFBRSxNQUFNLFNBQVMsV0FBVyxlQUFjO0VBQzFDLEVBQUUsTUFBTSxZQUFZLFdBQVcsc0JBQXNCLGFBQWEsQ0FBQyxTQUFTLEVBQUM7RUFDN0UsRUFBRSxNQUFNLElBQUksWUFBWSxVQUFVLFdBQVcsT0FBTTtFQUNuRCxFQUFFLE1BQU0sTUFBTSxZQUFZLFNBQVE7Ozs7QUNSdEMsU0FBUyxjQUFjO0FBTWhCLElBQU0sa0JBQXFDLENBQUMsS0FBSyxTQUFRO0FBQzVELFFBQU0sT0FBTyxPQUFPLFdBQVc7QUFDL0IsUUFBTSxRQUFRLEtBQUssU0FBUTtBQUUzQixNQUFJLE9BQU87QUFDUCxVQUFNLFNBQVMsSUFBSSxNQUFNO01BQ3JCLFlBQVk7UUFDUixlQUFlLFVBQVUsS0FBSzs7S0FFckM7QUFDRCxXQUFPLEtBQUssTUFBTTtFQUN0QjtBQUVBLFNBQU8sS0FBSyxHQUFHO0FBQ25COzs7QVZkTyxJQUFNLFlBQStCO0VBQzFDLFdBQVc7SUFDVCxjQUFjLFFBQVEsMEJBQXlCLENBQUU7SUFDakQsa0JBQWtCLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ3JELGtCQUFpQjs7Ozs7QUZSckIsU0FBUyxxQkFBQUMsMEJBQXlCO0FBRWxDLHFCQUFxQixjQUFjLGlDQUM5QixZQUQ4QjtFQUVqQyxXQUFXO0lBQ1RDLG1CQUFpQjs7RUFFcEIsRUFBRSxNQUFNLFNBQU8sUUFBUSxNQUFNLEdBQUcsQ0FBQzsiLCJuYW1lcyI6WyJDb21wb25lbnQiLCJDb21wb25lbnQiLCJpMCIsImkxIiwiQ29tcG9uZW50IiwiQ29tbW9uTW9kdWxlIiwiSW5qZWN0YWJsZSIsIkluamVjdGFibGUiLCJDb21tb25Nb2R1bGUiLCJDb21wb25lbnQiLCJpMCIsImkzIiwiaTQiLCJJbmplY3RhYmxlIiwiSW5qZWN0YWJsZSIsInByb3ZpZGVBbmltYXRpb25zIiwicHJvdmlkZUFuaW1hdGlvbnMiXX0=