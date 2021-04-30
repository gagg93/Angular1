import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {Vehicle} from '../models/vehicle';

@Injectable({ providedIn: 'root' })
export class VehicleService {

  private vehiclesUrl = 'api/vehicles';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient) { }

  /** GET heroes from the server */
  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.vehiclesUrl)
      .pipe(
        tap(_ => console.log('fetched vehicles')),
        catchError(this.handleError<Vehicle[]>('getVehicles', []))
      );
  }

  /** GET hero by id. Return `undefined` when id not found */
  getVehicleNo404<Data>(id: number): Observable<Vehicle> {
    const url = `${this.vehiclesUrl}/?id=${id}`;
    return this.http.get<Vehicle[]>(url)
      .pipe(
        map(vehicles => vehicles[0]), // returns a {0|1} element array
        tap(null),
        catchError(this.handleError<Vehicle>(`getVehicle id=${id}`))
      );
  }

  /** GET hero by id. Will 404 if id not found */
  getById(id: number): Observable<Vehicle> {
    const url = `${this.vehiclesUrl}/${id}`;
    return this.http.get<Vehicle>(url).pipe(
      tap(null),
      catchError(this.handleError<Vehicle>(`getVehicle id=${id}`))
    );
  }

  /* GET heroes whose name contains search term */
  searchVehicles(term: string): Observable<Vehicle[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Vehicle[]>(`${this.vehiclesUrl}/?name=${term}`).pipe(
      tap(null),
      catchError(this.handleError<Vehicle[]>('searchVehicle', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the server */
  addObj(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.vehiclesUrl, vehicle, this.httpOptions).pipe(
      tap(null),
      catchError(this.handleError<Vehicle>('addUser'))
    );
  }

  deleteVehicle(id: number): Observable<Vehicle> {
    const url = `${this.vehiclesUrl}/${id}`;
    return this.http.delete<Vehicle>(url, this.httpOptions).pipe(
      tap(_ => console.log()),
      catchError(this.handleError<Vehicle>('deleteVehicle'))
    );
  }

  /** PUT: update the hero on the server */
  update(vehicle: Vehicle): Observable<any> {
    return this.http.put(this.vehiclesUrl, vehicle, this.httpOptions).pipe(
      tap(null),
      catchError(this.handleError<any>('updateVehicle'))
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

  /** Log a HeroService message with the MessageService */
  // tslint:disable-next-line:typedef

}
