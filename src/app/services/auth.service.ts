import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {InMemoryDataService} from './in-memory-data.service';

export class User{
  constructor(
    public status: string,
  ) {}

}

export class JwtResponse{
  constructor(
    public jwttoken: string,
  ) {}

}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClient,
    private inMemoryDataService: InMemoryDataService
  ) {
  }

  // tslint:disable-next-line:typedef
  authenticate(username, password) {
    /*return this.httpClient.post<any>('api/authenticate', {username, password}).pipe(
      map(
        userData => {
          sessionStorage.setItem('username', username);
          const tokenStr = 'Bearer ' + userData.token;
          sessionStorage.setItem('token', tokenStr);
          return userData;
        }
      )*/
    return this.inMemoryDataService.authenticate({username, password}).pipe(
      map(
        (userData: any) => {
          console.log(userData.body);
          sessionStorage.setItem('username', userData.body.username);
          sessionStorage.setItem('token', userData.body.token);
          sessionStorage.setItem('id', userData.body.id);
          return userData;
        }
        )
  );
  }


  // tslint:disable-next-line:typedef
  isUserLoggedIn() {
    const user = sessionStorage.getItem('username');
    // console.log(!(user === null))
    return !(user === null);
  }

  // tslint:disable-next-line:typedef
  logOut() {
    sessionStorage.removeItem('username');
  }
}
