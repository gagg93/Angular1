import {Injectable} from '@angular/core';
import {InMemoryDbService} from 'angular-in-memory-web-api';
import {User} from '../models/user';
import {of, throwError} from 'rxjs';
import {HttpResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  // tslint:disable-next-line:typedef
  createDb() {
    const users = [
      {id: 1, admin: true, username: 'admin', password: 'test', name: 'admin', surname: 'admin', birthDate: '2020-04-21T00:00'},
      {id: 2, admin: false, username: 'gianni', password: 'test', name: 'gianni', surname: '1', birthDate: '1990-04-26T00:00'},
      {id: 3, admin: false, username: 'gagg', password: 'test', name: 'lorenzo', surname: 'gaggero', birthDate: '1993-03-23T00:00'},
      {id: 4, admin: false, username: 'marco', password: 'test', name: 'marco', surname: '2', birthDate: '2000-02-02T00:00'},
      {id: 5, admin: false, username: 'luca', password: 'test', name: 'luca', surname: '3', birthDate: '2020-04-21T00:00'},
      {id: 6, admin: false, username: 'federica', password: 'test', name: 'federica', surname: '4', birthDate: '2020-04-21T00:00'},
      {id: 7, admin: false, username: 'elisa', password: 'test', name: 'elisa', surname: '5', birthDate: '2020-04-21T00:00'},
      {id: 8, admin: false, username: 'daria', password: 'test', name: 'daria', surname: '6', birthDate: '2020-04-21T00:00'},
      {id: 9, admin: false, username: 'ivano', password: 'test', name: 'ivano', surname: '7', birthDate: '2020-04-21T00:00'},
      {id: 10, admin: false, username: 'antonella', password: 'test', name: 'antonella', surname: '8', birthDate: '2020-04-21T00:00'},
    ];
    const vehicles = [
      {id: 1, casaCostruttrice: 'honda', modello: 'civic', annoDiImmatricolazione: 2015, targa: 'da907ve'},
      {id: 2, casaCostruttrice: 'citroen', modello: 'c3', annoDiImmatricolazione: 2008, targa: 'fa817ge'},
      {id: 3, casaCostruttrice: 'ferrari', modello: 'modena', annoDiImmatricolazione: 2021, targa: 'gg999gg'}
    ];
    const reservations = [
      {id: 1, vehicleId: '3', userId: '3', resBegin: '2021-04-27T12:00', resEnd: '2021-04-29T14:00', approved: true},
      {id: 2, vehicleId: '2', userId: '4', resBegin: '2021-05-22T12:00', resEnd: '2021-05-22T14:00', approved: false},
      {id: 3, vehicleId: '1', userId: '2', resBegin: '2021-05-23T12:00', resEnd: '2021-05-23T14:00', approved: true},
      {id: 4, vehicleId: '2', userId: '3', resBegin: '2021-05-26T12:00', resEnd: '2021-05-30T14:00', approved: false},
    ];
    return {users, vehicles, reservations};
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  genId(users: User[]): number {
    return users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
  }

  authenticate(body: any): any {
    const { username, password } = body;
    const user = this.createDb().users.find(x => x.username === username && x.password === password);
    if (!user) {return this.error('Username or password is incorrect'); }
    if (user.admin) {
    return this.ok({
      id: user.id,
      username: user.username,
      name: user.name,
      surname: user.surname,
      birthDate: user.birthDate,
      admin: user.admin,
      token: 'fake-jwt-token-admin'
    });
    }else{
      return this.ok({
        id: user.id,
        username: user.username,
        name: user.name,
        surname: user.surname,
        birthDate: user.birthDate,
        admin: user.admin,
        token: 'fake-jwt-token-customer'
      });
    }
  }

  // tslint:disable-next-line:typedef
  ok(body?) {
    return of(new HttpResponse({ status: 200, body }));
  }

  // tslint:disable-next-line:typedef
  error(message) {
    return throwError({ error: { message } });
  }

}
