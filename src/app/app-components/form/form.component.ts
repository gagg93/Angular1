import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, UrlSegment} from '@angular/router';
import {VehicleService} from '../../services/vehicle.service';
import {UserService} from '../../services/user.service';
import { Location } from '@angular/common';
import {MyButtonConfig} from '../../my-configs/my-button-config';
import * as moment from 'moment';
import {ReservationService} from '../../services/reservation.service';



@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  urlSegments: UrlSegment[];
  object: any;
  service: any;
  button1: MyButtonConfig =
    {customCssClass: 'accent', text: 'edit', icon: 'done'
    };
  button2: MyButtonConfig =
    {customCssClass: 'white', text: 'back', icon: 'undo'
    };
  button3: MyButtonConfig =
    {customCssClass: 'accent', text: 'create', icon: 'done'
    };
  private reservations;
  private users;
  private vehicles;


constructor(private activatedRoute: ActivatedRoute, private vehicleService: VehicleService, private reservationService: ReservationService,
            private userService: UserService, private location: Location) { }

  ngOnInit(): void {
    this.reservationService.getReservations().subscribe(res => this.reservations = res);
    if (sessionStorage.getItem('admin') === ' true') {
      this.userService.getUsers().subscribe(users => this.users = users);
    }
    this.vehicleService.getVehicles().subscribe(vehicles => this.vehicles = vehicles);
    this.activatedRoute.url.subscribe(params => this.urlSegments = params);
    switch (this.urlSegments[1].toString()){
      case 'vehicle': this.service = this.vehicleService;
                      this.object = {id: null, casaCostruttrice: '', modello: '', annoImmatricolazione: '', targa: null}; break;
      case 'user': this.service = this.userService; this.object = {
        id: null, admin: false, password: '', username: '', firstName: '', lastName: '', birthDate: '2021-04-09T11:18'};
                   break;
      case 'reservation': this.service = this.reservationService;
                          this.object = {id: null, user: sessionStorage.getItem('username'), vehicle: null , resBegin: moment().add(2, 'days')
                              .format('yyyy-MM-DDTHH:mm'), resEnd: moment().add(2, 'days').add(1, 'hour')
                              .format('yyyy-MM-DDTHH:mm')};
                          break;
    }
    if (this.urlSegments[0].toString() === 'edit'){
      this.service.getById(+this.urlSegments[2].path.toString()).subscribe(params =>
      {this.object = params; Object.keys(this.object).forEach(key => console.log(key)); });
      Object.keys(this.object).forEach(key => {if (this.isDate(this.object)) {
        this.object[key] = moment(this.object[key]).format('yyyy-MM-DDThh:mm');
      }});
    }
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
  let flag = true;
  const fields: string[] = [];
  Object.keys(this.object).forEach(key => {if (key !== 'id' && key !== 'approved' && (
    this.object[key] === null || this.object[key].toString().trim() === '') ) { flag = false; fields.push(key); }});
  if (!flag) {
    alert ('field missing ' + fields.toString());
    return;
  }
  if (this.urlSegments[1].toString() === 'reservation') {
    flag = sessionStorage.getItem('username') === this.object.user.toString();
    if (!flag) {
      alert('user not you');
      return;
    }
    flag = false;
    this.vehicles.forEach(vehicle => {if (vehicle.targa.toString() === this.object.vehicle.toString()) {flag = true; }});
    if (!flag) {
      alert('vehicle not existing');
      return;
    }
    const s = this.service.validate(this.object, this.reservations);
    if (s !== '') {
      alert (s);
      return;
    }
  }
  if (this.object.id !== null) {
    if (this.object.approved !== undefined && this.object.approved === true) {this.object.approved = false; }
    if (this.object.userId !== undefined ) {this.object.userId = sessionStorage.getItem('id'); }
    this.service.update(this.object)
      .subscribe(() => this.goBack());
  }else{
    this.service.addObj(this.object)
      .subscribe(() => this.goBack());  }
  }

  isDate(field: any): boolean{
  if ( Date.parse(this.object[field]) && isNaN(this.object[field])) {
    this.object[field] = moment(this.object[field]).format('yyyy-MM-DDThh:mm');
    return true;
  }
  return false;
  }
}
