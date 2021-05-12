import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {MyButtonConfig} from '../../my-configs/my-button-config';
import {Location} from '@angular/common';
import * as moment from 'moment';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;
  button1: MyButtonConfig =
    {
      customCssClass: 'accent', text: 'edit', icon: 'done'
    };

  constructor(private userService: UserService, private location: Location, private router: Router) {
  }

  ngOnInit(): void {
    this.userService.getProfile()
      .subscribe(x => {
        this.user = x;
        this.user.birthDate = moment(this.user.birthDate).format('yyyy-MM-DDThh:mm');
      });
  }


  isDate(field: any): boolean {
    return Date.parse(field) && isNaN(field);
  }

  save(): void {
    this.userService.updateProfile(this.user)
      .subscribe(() => this.router.navigateByUrl('/reservations'));
  }
}
