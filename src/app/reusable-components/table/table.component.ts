import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MyTableConfig} from '../../my-configs/my-table-config';
import {MyButtonConfig} from '../../my-configs/my-button-config';
import {Output, EventEmitter} from '@angular/core';
import {MyWrapper} from '../../my-wrapper';
import * as moment from 'moment';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnChanges {
  @Input() displayedColumns: MyTableConfig;
  @Input() dataSource: any[];
  @Output() newTableEvent = new EventEmitter<MyWrapper>();
  filteredList: any[];
  lastSortedByField;
  ascendingOrder = true;
  currentPage = 0;
  button1: MyButtonConfig =
    {
      customCssClass: 'accent', text: 'edit', icon: 'done'
    };
  button2: MyButtonConfig =
    {
      customCssClass: 'warn', text: 'delete', icon: 'delete'
    };
  button3: MyButtonConfig =
    {
      customCssClass: 'primary', text: 'new', icon: 'add'
    };
  button4: MyButtonConfig =
    {
      customCssClass: 'primary', text: 'approve', icon: 'done'
    };
  button5: MyButtonConfig =
    {
      customCssClass: 'warn', text: 'disapprove', icon: 'close'
    };
  button6: MyButtonConfig =
    {customCssClass: 'white', text: 'reservations', icon: 'event'};
  myWrapper: MyWrapper = {object: null, command: 'ciao'};

  setMyWrapper(object: any, command: string): MyWrapper {
    this.myWrapper.object = object;
    this.myWrapper.command = command;
    return this.myWrapper;
  }

  order(): void {
  }

  constructor() {
  }

  ngOnChanges(): void {
    this.filteredList = this.dataSource;
    this.ascendingOrder = this.displayedColumns.order.orderType !== 'ascending';
    this.lastSortedByField = this.displayedColumns.order.defaultColumn;
    this.onHeaderClick(this.displayedColumns.order.defaultColumn);
    }

  /*ngOnInit(): void {
    this.filteredList = this.dataSource;
    this.ascendingOrder = this.displayedColumns.order.orderType !== 'ascending';
    this.lastSortedByField = this.displayedColumns.order.defaultColumn;
    this.onHeaderClick(this.displayedColumns.order.defaultColumn);
  }*/

  onHeaderClick(header: string): void{
    if (header === 'actions'){
      return;
    }
    if (this.lastSortedByField === header) {
      this.ascendingOrder = !this.ascendingOrder;
    }
    else {
      this.lastSortedByField = header;
      this.ascendingOrder = true;
    }

    if (this.ascendingOrder) {

      this.filteredList = this.filteredList.sort((a, b) => {
        if (a[header] < b[header]) {
          return -1;
        }
        if (a[header] > b[header]) {
          return 1;
        }
        return 0;
      });
    } else {
      this.filteredList = this.filteredList.sort((a, b) => {
        if (a[header] < b[header]) {
          return 1;
        }
        if (a[header] > b[header]) {
          return -1;
        }
        return 0;
      });
  }
    this.onSelectPage((this.currentPage + 1).toString());
  }

  onSearchClick(search: string, field: string): any{
    field = field.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
    if (search.trim()) {
      if (search.indexOf('/') > -1) {
        if (moment(search, 'DD/MM/YYYYTHH:mm').format('YYYY-MM-DDTHH:mm') ===
          moment(search, 'DD/MM/YYYY').format('YYYY-MM-DDTHH:mm')){
          search = moment(search, 'DD/MM/YYYY').format('YYYY-MM-DD');
        }else{
          search = moment(search, 'DD/MM/YYYYTHH:mm').format('YYYY-MM-DDTHH:mm');
          console.log(search);
        }
        }
      this.filteredList = [];
      this.dataSource.forEach(element => {
        if (element[field].toString().toLowerCase().indexOf(search.toLowerCase()) > -1) {
        this.filteredList.push(element);
          }});
    }else {
      this.filteredList = this.dataSource;
    }
    this.onSelectPage('1');
  }

  onSelectPage(value: string): void{
    if ((Number(value) - 1) > this.filteredList.length / this.displayedColumns.pagination.itemsPerPage - 1) {
      this.currentPage = Math.ceil(this.filteredList.length / this.displayedColumns.pagination.itemsPerPage);
    }else{
      this.currentPage = (Number(value));
    }
    if (this.currentPage < 1) {this.currentPage = 1; }
    }


  onPageNumberSelect(value: string): void{
    this.displayedColumns.pagination.itemsPerPage = +value;
    this.onSelectPage('1');
  }

  buttonClick(myWrapper: MyWrapper): void {
    this.newTableEvent.emit(myWrapper);
  }

  isDate(field: any): boolean{
    return Date.parse(field) && isNaN(field);
  }
}

