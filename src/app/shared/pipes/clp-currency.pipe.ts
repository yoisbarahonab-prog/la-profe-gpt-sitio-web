import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clpCurrency',
  standalone: true
})
export class ClpCurrencyPipe implements PipeTransform {
  transform(value: number | undefined | null): string {
    if (value === null || value === undefined) return '$0 CLP';
    const formatted = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(value);
    return `${formatted} CLP`;
  }
}
