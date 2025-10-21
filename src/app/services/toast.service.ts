import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMsg { message: string; type?: 'info' | 'error' | 'success'; id?: number }

@Injectable({ providedIn: 'root' })
export class ToastService {
    private subj = new BehaviorSubject<ToastMsg | null>(null);
    toast$ = this.subj.asObservable();
    private lastId = 0;

    show(message: string, type: 'info' | 'error' | 'success' = 'info', ms = 3000) {
        const id = ++this.lastId;
        this.subj.next({ message, type, id });
        if (ms > 0) setTimeout(() => { if (this.lastId === id) this.clear(); }, ms);
    }

    clear() { this.subj.next(null); }
}
