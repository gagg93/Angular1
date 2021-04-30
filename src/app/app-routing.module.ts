import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UsersComponent} from './tables/users/users.component';
import {VehiclesComponent} from './tables/vehicles/vehicles.component';
import {FormComponent} from './app-components/form/form.component';
import {ReservationsComponent} from './tables/reservations/reservations.component';
import {LoginComponent} from './auth/login/login.component';
import {AuthGuard} from './services/auth.guard';
import {CustomerAuthGuard} from './services/customer-auth.guard';
import {ProfileComponent} from './tables/profile/profile.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'profile', component: ProfileComponent, canActivate: [CustomerAuthGuard]},
  { path: 'reservations', children: [{path: '', component: ReservationsComponent, canActivate: [CustomerAuthGuard]},
      {path: ':id', component: ReservationsComponent, canActivate: [AuthGuard]},
      {path: 'edit/reservation/:id', component: FormComponent, canActivate: [CustomerAuthGuard]},
      {path: 'new/reservation', component: FormComponent, canActivate: [CustomerAuthGuard]},
      {path: 'delete/reservation/:id', component: ReservationsComponent, canActivate: [CustomerAuthGuard]}]},
  { path: 'users', children: [{path: '', component: UsersComponent, canActivate: [AuthGuard]},
      {path: 'edit/user/:id', component: FormComponent, canActivate: [AuthGuard]},
      {path: 'new/user', component: FormComponent, canActivate: [AuthGuard]},
      {path: 'delete/user/:id', component: UsersComponent, canActivate: [AuthGuard]}]},
  {path: 'login', component: LoginComponent},
  { path: 'vehicles', children: [{path: '', component: VehiclesComponent, canActivate: [CustomerAuthGuard]},
      {path: 'edit/vehicle/:id', component: FormComponent, canActivate: [AuthGuard]},
      {path: 'new/vehicle', component: FormComponent, canActivate: [AuthGuard]},
      {path:  'delete/vehicle/:id', component: VehiclesComponent, canActivate: [AuthGuard]} ]}];

@NgModule({
  imports: [RouterModule.forRoot(routes/*, {enableTracing: true}*/)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
