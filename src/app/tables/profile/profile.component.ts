import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user';
import {MyButtonConfig} from '../../my-configs/my-button-config';
import {Location} from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User;
  button1: MyButtonConfig =
    {customCssClass: 'accent', text: 'edit', icon: 'done'
    };

  constructor(private userService: UserService, private location: Location) { }

  ngOnInit(): void {
    this.userService.getById(Number.parseInt(sessionStorage.getItem('id'), 10)).subscribe(x => this.user = x);
  }


  isDate(field: any): boolean{
    return Date.parse(field) && isNaN(field);
  }

  save(): void {
    this.userService.update(this.user)
      .subscribe(() => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }
}
