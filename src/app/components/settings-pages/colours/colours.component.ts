import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsExtraService } from '../../../services/settings-extra.service';
import { ToastService } from '../../../services/toast.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
    selector: 'app-colours',
    standalone: true,
    imports: [CommonModule, FormsModule, StatusBadgeComponent, SkeletonLoaderComponent, EmptyStateComponent],
    templateUrl: './colours.component.html',
    styleUrls: ['../settings-common.scss']
})
export class ColoursComponent implements OnInit {
    items: any[] = [];
    loading = true;
    search = '';
    showModal = false;
    editMode = false;
    saving = false;
    form = { colour_id: 0, name: '' };
    errors: any = {};

    constructor(private svc: SettingsExtraService, private toast: ToastService) {}

    ngOnInit() { this.load(); }

    load() {
        this.loading = true;
        this.svc.getColours(this.search).subscribe({
            next: (res: any) => { this.items = res?.data ?? res ?? []; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }

    openAdd() { this.form = { colour_id: 0, name: '' }; this.errors = {}; this.editMode = false; this.showModal = true; }

    openEdit(item: any) {
        this.svc.getColourById(item.id).subscribe({
            next: (res: any) => {
                const d = res?.data ?? res;
                this.form = { colour_id: d.id, name: d.name ?? d.colour };
                this.errors = {}; this.editMode = true; this.showModal = true;
            }
        });
    }

    save() {
        this.errors = {};
        if (!this.form.name.trim()) { this.errors.name = 'Name is required'; return; }
        this.saving = true;
        const obs = this.editMode
            ? this.svc.updateColour(this.form.colour_id, this.form.name)
            : this.svc.storeColour(this.form.name);
        obs.subscribe({
            next: () => { this.saving = false; this.showModal = false; this.toast.show('Saved successfully', 'success'); this.load(); },
            error: (err: any) => { this.saving = false; this.errors = err?.error?.errors ?? {}; this.toast.show('Failed to save', 'error'); }
        });
    }

    toggleStatus(item: any) {
        this.svc.toggleColourStatus(item.id).subscribe({
            next: () => { this.toast.show('Status updated', 'success'); this.load(); },
            error: () => this.toast.show('Failed to update status', 'error')
        });
    }
}
