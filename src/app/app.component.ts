import {Component, OnInit} from '@angular/core';
import {MyWrapper} from './my-wrapper';
import {User} from './models/user';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title: string;
  test: MyWrapper;
  dataSource: Observable<User[]> ;
  /*myTableConfig = tableconfig;*/

  constructor() {
  }

  ngOnInit(): void {
  }

  newRoute($event: MyWrapper): void {
    this.test = $event;
  }
}
