import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, tap, timeout } from 'rxjs/operators';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class PlayerService {

  // URL to web api
  private playerUrl = '../assets/data/player.json';
  // private playerUrl = 'http://httpstat.us/200?sleep=500 '; // to test Timeout

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET players from the server */
  getPlayer (): Observable<any> {
    return this.http.get<any>(this.playerUrl)
      .pipe(
        tap(players => this.log(`fetched getPlayer`)),
        timeout(300),
        catchError(this.handleError('getPlayer', []))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('PlayerService: ' + message);
  }
}