import {Component, OnInit} from '@angular/core';
import {MyHeaders} from '../../my-configs/my-headers';
import {MyOrder} from '../../my-configs/my-order';
import {MySearch} from '../../my-configs/my-search';
import {MyPagination} from '../../my-configs/my-pagination';
import {MyTableConfig} from '../../my-configs/my-table-config';
import {MyTableActionEnum} from '../../my-configs/my-table-action-enum';
import {MyWrapper} from '../../my-wrapper';
import {ReservationService} from '../../services/reservation.service';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {Reservation} from '../../models/reservation';


const headerconfig: MyHeaders[] = [
  {key: 'user' , label: 'User'},
  {key: 'vehicle' , label: 'Macchina'},
  {key: 'resBegin' , label: 'Data di inizio'},
  {key: 'resEnd' , label: 'Data di fine'},
  {key: 'approved', label: 'Approvata'}];

const orderConfig: MyOrder = {
  defaultColumn: 'id',
  orderType: 'ascending'
};

const search: MySearch = {
  colums: ['user', 'vehicle' , 'resBegin' , 'resEnd', 'approved']
};

const pagination: MyPagination =
  {
    itemsPerPage: 10, itemsPerPageOptions: [2, 5, 10, 20]
  };



const tableconfig: MyTableConfig = {
  headers: headerconfig,
  order: orderConfig,
  search,
  pagination,
  actions: [MyTableActionEnum.NEW_ROW,
    MyTableActionEnum.DELETE, MyTableActionEnum.EDIT]
};


@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {

  title: string;
  test: MyWrapper;
  dataSource: Reservation[] ;
  myTableConfig = tableconfig;
  urlSegments: UrlSegment[];

  constructor(private reservationService: ReservationService, private router: Router, private route: ActivatedRoute ,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.url.subscribe(params => {this.urlSegments = params; this.getReservations(); });
    if (sessionStorage.getItem('admin') === 'true') {
      this.myTableConfig.actions = [MyTableActionEnum.APPROVE, MyTableActionEnum.DISAPPROVE];
    }
  }

  getReservations(): void {
    if (this.urlSegments[1] === undefined){this.reservationService.getReservations().subscribe(x =>
    {if (sessionStorage.getItem('admin') === 'true'
      && this.urlSegments[0] === undefined) {
      this.dataSource = x;
    }else{
      this.dataSource = [];
      x.forEach(row =>
    { let url;
      if (this.urlSegments[0] !== undefined) {
      url = this.urlSegments[0].toString();
    }else{url = this.urlSegments[0];
    }
      if ((sessionStorage.getItem('admin') === 'false' && row.user.toString() === sessionStorage.getItem('username'))
      ||  url === row.user.toString() ) {
      this.dataSource.push(row);
    }
    }); }});
    }else{
      this.reservationService.getReservationsByUser(this.urlSegments[1].toString()).subscribe(x => this.dataSource = x);
    }
  }


  newRoute(event: MyWrapper): void {
    let url = null;
    if (event.command === 'edit') {
      url = './' + event.command + '/reservation/' + event.object.id;
    }
    if (event.command === 'new') {
      url = './' + event.command + '/reservation';
    }
    if (event.command === 'approve') {
      const res = this.dataSource.find(x => x.id === event.object.id);
      this.reservationService.approve(res).subscribe(_ => {this.getReservations(); }, _ => console.log('cazzoo'));
      /*if (this.urlSegments[0] !== undefined){
        url += this.urlSegments[0].toString();
      }*/
    }
    if (event.command === 'disapprove') {
      const res = this.dataSource.find(x => x.id === event.object.id);
      this.reservationService.disapprove(res).subscribe(_ => {this.getReservations(); }, _ => console.log('cazzooo'));
      /*if (this.urlSegments[0] !== undefined){
        url += this.urlSegments[0].toString();
      }*/
    }
    if (event.command === 'delete') {
      if (confirm('Are you sure to delete ' + event.object.id)) {
        url = '/reservations';
        console.log(event.object.id);
        this.reservationService.deleteReservation(event.object.id).subscribe(_ => {this.getReservations(); } );
      }else{return; }
    }
    console.log(url);
    if (url !== null) {
      this.router.navigate([url], {relativeTo: this.route});
    }
  }
}
