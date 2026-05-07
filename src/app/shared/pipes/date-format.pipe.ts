import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateFormat', standalone: true })
export class DateFormatPipe implements PipeTransform {
    transform(value: string | Date | null | undefined): string {
        if (!value) return '-';
        const d = new Date(value);
        if (isNaN(d.getTime())) return '-';
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    }
}
