import { Component, OnInit } from '@angular/core';
import {MyHeaders} from '../../my-configs/my-headers';
import {MyOrder} from '../../my-configs/my-order';
import {MySearch} from '../../my-configs/my-search';
import {MyPagination} from '../../my-configs/my-pagination';
import {MyTableConfig} from '../../my-configs/my-table-config';
import {MyTableActionEnum} from '../../my-configs/my-table-action-enum';
import {MyWrapper} from '../../my-wrapper';
import {VehicleService} from '../../services/vehicle.service';
import {Vehicle} from '../../models/vehicle';
import {ActivatedRoute, Router} from '@angular/router';
import {ReservationService} from '../../services/reservation.service';
import {Reservation} from '../../models/reservation';

const headerconfig: MyHeaders[] = [
  {key: 'casaCostruttrice' , label: 'Casa costruttrice'},
  {key: 'modello' , label: 'Modello'},
  {key: 'annoDiImmatricolazione' , label: 'Anno di immatricolazione'},
  {key: 'targa' , label: 'Targa'}];

const orderConfig: MyOrder = {
  defaultColumn: 'id',
  orderType: 'ascending'
};

const search: MySearch = {
  colums: ['casaCostruttrice', 'modello' , 'annoDiImmatricolazione' , 'targa']
};

const pagination: MyPagination =
  {
    itemsPerPage: 2, itemsPerPageOptions: [2, 5, 10, 20]
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
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {
  title: string;
  test: MyWrapper;
  dataSource: Vehicle[] ;
  myTableConfig = tableconfig;
  reservations: Reservation[];

  constructor(private vehicleService: VehicleService, private router: Router, private route: ActivatedRoute,
              private reservationService: ReservationService) {
  }

  ngOnInit(): void {
    this.getVehicles();
    if (sessionStorage.getItem('token') === 'fake-jwt-token-customer') {
      this.myTableConfig.actions = [];
    }
  }

  getVehicles(): void {
    this.vehicleService.getVehicles().subscribe(x => this.dataSource = x);
    this.reservationService.getReservations().subscribe(res => this.reservations = res);
  }

  newRoute(event: MyWrapper): void {
    let url;
    if (event.command === 'edit') {
       url = './' + event.command + '/vehicle/' + event.object.id;
    }
    if (event.command === 'new') {
      url = './' + event.command + '/vehicle';
    }
    if (event.command === 'delete') {
      if (confirm('Are you sure to delete ' + event.object.id)) {
        let flag = true;
        this.reservations.forEach(x => { console.log(event.object.id.toString());
                                         console.log(x.vehicleId.toString());
                                         if (x.vehicleId.toString() === event.object.id.toString()) {flag = false; }});
        if (flag) {
          url = '/vehicles';
          console.log(event.object.id);
          this.vehicleService.deleteVehicle(event.object.id).subscribe(_ =>
          {          console.log('inizio');
                     this.vehicleService.getVehicles().subscribe(x => {
              console.log(x);
              // this.tableVisible = false;
              // this.cdr.detectChanges();
              this.dataSource = x;
              // this.tableVisible = true;
              // this.cdr.detectChanges();
            } );
                     console.log('fine'); });
        }else {alert('prenotazione a carico');
               url = '/vehicles';
        }
      }else{return; }
    }
    console.log(url);
    this.router.navigate([url], {relativeTo: this.route});
  }
}
