import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
admin: boolean = null;
logged: boolean;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.admin = ('true' === sessionStorage.getItem('admin'));
    if (sessionStorage.getItem('token')) {
      this.logged = true;
    }
  }

  // tslint:disable-next-line:typedef
  logout(){
    sessionStorage.clear();
    this.router.navigateByUrl('/login');
    window.location.reload();
  }

}
