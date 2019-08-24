import { Pipe, PipeTransform } from '@angular/core';
import { Item } from '../../model/item';

@Pipe({
  name: 'itemFilter',
  pure: false
})
export class ItemFilterPipe implements PipeTransform {

  transform(items: Item[], filter: string): Item[] {
    if (!items || !filter) {
      return items;
    }
    return items.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()));
  }

}
