import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { ButtonComponent } from './reusable-components/button/button.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { TableComponent } from './reusable-components/table/table.component';
import { PaginationPipe } from './pipes/pagination.pipe';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './services/in-memory-data.service';
import { AppRoutingModule } from './app-routing.module';
import { FormComponent } from './app-components/form/form.component';
import { DashboardComponent } from './app-components/dashboard/dashboard.component';
import { UsersComponent } from './tables/users/users.component';
import { VehiclesComponent } from './tables/vehicles/vehicles.component';
import { KeysPipe } from './pipes/keys.pipe';
import { RemoveUnderscorePipe } from './pipes/remove-underscore.pipe';
import { ReservationsComponent } from './tables/reservations/reservations.component';
import {LoginComponent} from './auth/login/login.component';
import {AuthService} from './services/auth.service';
import { ProfileComponent } from './tables/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    TableComponent,
    PaginationPipe,
    FormComponent,
    DashboardComponent,
    UsersComponent,
    VehiclesComponent,
    KeysPipe,
    RemoveUnderscorePipe,
    ReservationsComponent,
    LoginComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    NoopAnimationsModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatTableModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, {dataEncapsulation: false}
    ),
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
