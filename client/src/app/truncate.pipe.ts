import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 25, completeWords = false, ellipsis = '...'): string {
    if (!value) return '';
    if (value.length <= limit) return value;
    
    if (completeWords) {
      limit = value.substr(0, limit).lastIndexOf(' ');
      if (limit === -1) limit = 25;
    }
    return `${value.substr(0, limit)}${ellipsis}`;
  }
}