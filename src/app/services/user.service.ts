import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { User} from '../models/user';

@Injectable({ providedIn: 'root' })
export class UserService {

  private usersUrl = 'http://localhost:8080/users';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient) { }

  /** GET heroes from the server */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl)
      .pipe(
        tap(_ => console.log('fetched users')),
        catchError(this.handleError<User[]>('getUsers', []))
      );
  }

  /** GET hero by id. Return `undefined` when id not found */
  getUserNo404<Data>(id: number): Observable<User> {
    const url = `${this.usersUrl}/?id=${id}`;
    return this.http.get<User[]>(url)
      .pipe(
        map(users => users[0]), // returns a {0|1} element array
        tap(null),
        catchError(this.handleError<User>(`getUser id=${id}`))
      );
  }

  /** GET hero by id. Will 404 if id not found */
  getById(id: number): Observable<User> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get<User>(url).pipe(
      tap(null),
      catchError(this.handleError<User>(`getUser id=${id}`))
    );
  }

  /* GET heroes whose name contains search term */
  searchUsers(term: string): Observable<User[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<User[]>(`${this.usersUrl}/?name=${term}`).pipe(
      tap(null),
      catchError(this.handleError<User[]>('searchUser', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the server */
  addObj(user: User): Observable<User> {
    return this.http.post<User>(`${this.usersUrl}/new`, user, this.httpOptions).pipe(
      tap(null),
      catchError(this.handleError<User>('addUser'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteUser(id: number): Observable<User> {
    const url = `${this.usersUrl}/${id}`;
    console.log('delete' + id);
    return this.http.delete<User>(url, this.httpOptions).pipe(
      tap(null),
      catchError(this.handleError<User>('deleteUser'))
    );
  }

  /** PUT: update the hero on the server */
  update(user: User): Observable<any> {
    const url = `${this.usersUrl}/${user.id}`;
    return this.http.put(url, user, this.httpOptions).pipe(
      tap(null),
      catchError(this.handleError<any>('updateUser'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  // tslint:disable-next-line:typedef
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error);
      return of(result as T);
    };
  }

  getUserByUsername(username: string): Observable<User> {
    const url = `${this.usersUrl}/username/${username}`;
    return this.http.get<User>(url).pipe(
      tap(null),
      catchError(this.handleError<User>(`getUser id=${username}`))
    );
  }

  getProfile(): Observable<User> {
    const url = `${this.usersUrl}/my/profile`;
    return this.http.get<User>(url, {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    });
  }

  updateProfile(user: User): Observable<any> {
    const url = `${this.usersUrl}/my/profile`;
    return this.http.put<User>(url, user).pipe(
      tap(null),
      catchError(this.handleError<User>(`getProfile`))
    );
  }
}
