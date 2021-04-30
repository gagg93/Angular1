import {MyHeaders} from './my-headers';
import {MyOrder} from './my-order';
import {MySearch} from './my-search';
import {MyPagination} from './my-pagination';
import {MyTableActionEnum} from './my-table-action-enum';

export class MyTableConfig {
  headers: MyHeaders[];
  order: MyOrder;
  search: MySearch;
  pagination: MyPagination;
  actions: MyTableActionEnum[];
}
