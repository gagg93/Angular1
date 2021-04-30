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
  {key: 'userId' , label: 'User'},
  {key: 'vehicleId' , label: 'Macchina'},
  {key: 'resBegin' , label: 'Data di inizio'},
  {key: 'resEnd' , label: 'Data di fine'},
  {key: 'approved', label: 'Approvata'}];

const orderConfig: MyOrder = {
  defaultColumn: 'id',
  orderType: 'ascending'
};

const search: MySearch = {
  colums: ['userId', 'vehicleId' , 'resBegin' , 'resEnd', 'approved']
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
    if (sessionStorage.getItem('token') === 'fake-jwt-token-admin') {
      this.myTableConfig.actions = [MyTableActionEnum.APPROVE, MyTableActionEnum.DISAPPROVE];
    }
  }

  getReservations(): void {
    this.reservationService.getReservations().subscribe(x => {if (sessionStorage.getItem('token') === 'fake-jwt-token-admin'
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
      if ((sessionStorage.getItem('token') === 'fake-jwt-token-customer' && row.userId.toString() === sessionStorage.getItem('id'))
      ||  url === row.userId.toString() ) {
      this.dataSource.push(row);
    }
    }); }}); }


  newRoute(event: MyWrapper): void {
    let url;
    if (event.command === 'edit') {
      url = './' + event.command + '/reservation/' + event.object.id;
    }
    if (event.command === 'new') {
      url = './' + event.command + '/reservation';
    }
    if (event.command === 'approve') {
      const res = this.dataSource.find(x => x.id === event.object.id);
      res.approved = true;
      this.reservationService.update(res);
      url = '/reservations/';
      if (this.urlSegments[0] !== undefined){
        url += this.urlSegments[0].toString();
      }
    }
    if (event.command === 'disapprove') {
      const res = this.dataSource.find(x => x.id === event.object.id);
      res.approved = false;
      this.reservationService.update(res);
      url = '/reservations/';
      if (this.urlSegments[0] !== undefined){
        url += this.urlSegments[0].toString();
      }
    }
    if (event.command === 'delete') {
      if (confirm('Are you sure to delete ' + event.object.id)) {
        url = '/reservations';
        console.log(event.object.id);
        this.reservationService.deleteReservation(event.object.id).subscribe();
        this.getReservations();
      }else{return; }
    }
    console.log(url);
    this.router.navigate([url], {relativeTo: this.route});
  }
}
