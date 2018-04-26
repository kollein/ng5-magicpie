import { Component, OnInit } from '@angular/core';

import { PlayerService } from '../service/player.service';
import { Subscriber } from 'rxjs/Subscriber';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private userData: Array<any>;
  private userInput = {
    "username": "",
    "password": ""
  };
  msg = {
    "error": {
      "username": "Username is wrong!",
      "password": "Password is wrong!"
    },
    "success": {
      "login": "Login successfully!"
    }
  };
  private message = '';

  constructor(private playerService: PlayerService) {
    
    this.playerService.getPlayer()
      .subscribe(resData => {
        this.userData = resData.users
      });
  }

  login(): void {
    let msgError = this.msg.error.username;

    for( let user of this.userData ) {
      if ( user.username === this.userInput.username ) {
        msgError = '';
        if ( user.password === this.userInput.password ) {
          msgError = '';
        } else {
          msgError = this.msg.error.password;
        }
      }
    }

    this.showMessage(msgError);
  }

  showMessage(msg): void {
    if ( msg ) {
      this.message = msg;
    }
  }
}
