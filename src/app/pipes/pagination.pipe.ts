import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pagination',
  pure: false
})
export class PaginationPipe implements PipeTransform {

  transform(value: any[], page: number, itemPerPage: number): unknown {
    return value.slice(page * itemPerPage , (1 + page) * itemPerPage);
  }

}
