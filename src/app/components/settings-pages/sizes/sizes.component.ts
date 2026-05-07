import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsExtraService } from '../../../services/settings-extra.service';
import { ToastService } from '../../../services/toast.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
    selector: 'app-sizes',
    standalone: true,
    imports: [CommonModule, FormsModule, StatusBadgeComponent, SkeletonLoaderComponent, EmptyStateComponent, ConfirmModalComponent],
    templateUrl: './sizes.component.html',
    styleUrls: ['../settings-common.scss']
})
export class SizesComponent implements OnInit {
    items: any[] = [];
    loading = true;
    search = '';
    showModal = false;
    editMode = false;
    saving = false;
    form = { size_id: 0, name: '' };
    errors: any = {};

    constructor(private svc: SettingsExtraService, private toast: ToastService) {}

    ngOnInit() { this.load(); }

    load() {
        this.loading = true;
        this.svc.getSizes(this.search).subscribe({
            next: (res: any) => { this.items = res?.data ?? res ?? []; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }

    openAdd() { this.form = { size_id: 0, name: '' }; this.errors = {}; this.editMode = false; this.showModal = true; }

    openEdit(item: any) {
        this.svc.getSizeById(item.id).subscribe({
            next: (res: any) => {
                const d = res?.data ?? res;
                this.form = { size_id: d.id, name: d.name };
                this.errors = {}; this.editMode = true; this.showModal = true;
            }
        });
    }

    save() {
        this.errors = {};
        if (!this.form.name.trim()) { this.errors.name = 'Name is required'; return; }
        this.saving = true;
        const obs = this.editMode
            ? this.svc.updateSize(this.form.size_id, this.form.name)
            : this.svc.storeSize(this.form.name);
        obs.subscribe({
            next: () => { this.saving = false; this.showModal = false; this.toast.show('Saved successfully', 'success'); this.load(); },
            error: (err: any) => { this.saving = false; this.errors = err?.error?.errors ?? {}; this.toast.show('Failed to save', 'error'); }
        });
    }

    toggleStatus(item: any) {
        this.svc.toggleSizeStatus(item.id).subscribe({
            next: () => { this.toast.show('Status updated', 'success'); this.load(); },
            error: () => this.toast.show('Failed to update status', 'error')
        });
    }
}
