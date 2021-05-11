import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';
import {Observable} from 'rxjs';

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
    // private inMemoryDataService: InMemoryDataService
  ) {
  }




  authenticate(username, password): Observable<any>{
    return this.httpClient.post<any>('http://localhost:8080/authenticate', {username, password}, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      map(
        (userData: any) => {
          sessionStorage.setItem('username', username);
          sessionStorage.setItem('admin', userData.admin);
          const tokenStr = 'Bearer ' + userData.jwt;
          sessionStorage.setItem('jwt', tokenStr);
          return userData;
        }
      ));
    /*return this.inMemoryDataService.authenticate({username, password}).pipe(
      map(
        (userData: any) => {
          console.log(userData.body);
          sessionStorage.setItem('username', userData.body.username);
          sessionStorage.setItem('token', userData.body.token);
          sessionStorage.setItem('id', userData.body.id);
          return userData;
        }
        )
  );*/
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
