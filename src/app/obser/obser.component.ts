import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { from } from "rxjs/observable/from";
import { of } from "rxjs/observable/of";
import { timer } from "rxjs/observable/timer";
import { concat } from "rxjs/observable/concat";
import { fromEvent } from "rxjs/observable/fromEvent";
import { interval } from "rxjs/observable/interval";
import { map, switchMap, mapTo } from 'rxjs/operators';

import { PlayerService } from '../service/player.service';

@Component({
  selector: 'app-obser',
  templateUrl: './obser.component.html',
  styleUrls: ['./obser.component.scss']
})
export class ObserComponent implements OnInit {

  constructor(
    private playerService: PlayerService
  ) {
    console.log('sos');

    const clicks$ = fromEvent(document, 'click');
    const innerObservable$ = interval(500);

    clicks$.pipe(
      switchMap(event => innerObservable$)
    ).subscribe(val => console.log(val));
  }

  ngOnInit() {
    // const source = this.getUser()
    // .pipe(
    //   map(user => user.id + 10),
    //   switchMap(userId => 
    //     this.alertMsg(userId)
    //   )
    // );
    // source.subscribe(
    //   res => console.log('last: ', res)
    // );
    // console.log('sos1');
  }

  alertMsg(id): Observable<any> {
    console.log('id: ', id);
    return of(id);
  }

  getUser(): Observable<any> {
    const users = [
      {
        "id": 1,
        "username": "kollein",
        "password": "123"
      },
      {
        "id": 2,
        "username": "vinh",
        "password": "111"
      }
    ];
    return from(users);
  }
}
