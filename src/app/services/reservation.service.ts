import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {Reservation} from '../models/reservation';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private reservationsUrl = 'api/reservations';  // URL to web api
  private reservations;

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(
    private http: HttpClient) {
  }

  /** GET heroes from the server */
  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.reservationsUrl)
      .pipe(
        tap(_ => console.log('fetched reservations')),
        catchError(this.handleError<Reservation[]>('getReservations', []))
      );
  }

  getResArray(): Reservation[] {
    return this.reservations;
  }

  /** GET hero by id. Return `undefined` when id not found */
  getReservationNo404<Data>(id: number): Observable<Reservation> {
    const url = `${this.reservationsUrl}/?id=${id}`;
    return this.http.get<Reservation[]>(url)
      .pipe(
        map(reservations => reservations[0]), // returns a {0|1} element array
        tap(null),
        catchError(this.handleError<Reservation>(`getReservation id=${id}`))
      );
  }

  /** GET hero by id. Will 404 if id not found */
  getById(id: number): Observable<Reservation> {
    const url = `${this.reservationsUrl}/${id}`;
    return this.http.get<Reservation>(url).pipe(
      tap(null),
      catchError(this.handleError<Reservation>(`getReservation id=${id}`))
    );
  }

  /* GET heroes whose name contains search term */
  searchReservations(term: string): Observable<Reservation[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Reservation[]>(`${this.reservationsUrl}/?name=${term}`).pipe(
      tap(null),
      catchError(this.handleError<Reservation[]>('searchReservation', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the server */
  addObj(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.reservationsUrl, reservation, this.httpOptions).pipe(
      tap(null),
      catchError(this.handleError<Reservation>('addReservation'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteReservation(id: number): Observable<Reservation> {
    const url = `${this.reservationsUrl}/${id}`;

    return this.http.delete<Reservation>(url, this.httpOptions).pipe(
      tap(null),
      catchError(this.handleError<Reservation>('deleteReservation'))
    );
  }

  /** PUT: update the hero on the server */
  update(reservation: Reservation): Observable<any> {
    return this.http.put(this.reservationsUrl, reservation, this.httpOptions).pipe(
      tap(null),
      catchError(this.handleError<any>('updateReservation'))
    );
  }

  validate(reservation: Reservation, reservations: Reservation[]): string{
    const resBegin = moment(reservation.resBegin);
    const resEnd = moment(reservation.resEnd);
    if (resBegin.diff(resEnd) > 0) {return 'date invertite'; }
    const today = moment().add(2, 'days');
    if (resBegin.diff(today) < 0 || resEnd.diff(today) < 0) {return 'la data di inizio e di fine devono essere almeno tra due giorni'; }
    console.log(this.reservations);
    let flag = false;
    reservations.forEach(ress => {
        if (reservation.vehicleId === ress.vehicleId && reservation.id !== ress.id &&
          (moment(ress.resBegin).diff(resBegin) < 0 && moment(ress.resEnd).diff(resBegin) > 0 ||
            moment(ress.resBegin).diff(resEnd) < 0 && moment(ress.resEnd).diff(resEnd) > 0 ||
            moment(ress.resBegin).diff(resBegin) >= 0 && moment(ress.resEnd).diff(resEnd) <= 0
          )) {
          flag = true;
        }
      });
    if (flag) {return 'vehicle already booked'; }
    return '';
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
}

