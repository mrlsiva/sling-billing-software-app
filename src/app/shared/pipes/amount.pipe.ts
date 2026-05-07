import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'amount', standalone: true })
export class AmountPipe implements PipeTransform {
    transform(value: number | string | null | undefined): string {
        if (value === null || value === undefined || value === '') return '₹ 0';
        const num = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(num)) return '₹ 0';
        return '₹ ' + num.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }
}
