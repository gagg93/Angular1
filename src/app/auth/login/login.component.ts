import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  form: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(): void {
    const val = this.form.value;

    if (val.email && val.password) {
      this.authService.authenticate(val.email, val.password)
        .subscribe(
          (token) => {
            console.log(token.body.token);
            if (token.body.token === 'fake-jwt-token-admin') {
              this.router.navigateByUrl('/users');
            }

            if (token.body.token === 'fake-jwt-token-customer') {
              this.router.navigateByUrl('/reservations');
            }
          },
          () => {
            console.log('noooo');
          }
        );
    }
  }
}
