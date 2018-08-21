import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

import { PlayerService } from '../service/player.service';
import { MessageService } from '../service/message.service';
import { Subscriber } from 'rxjs/Subscriber';
import { MagicPie } from '../custom-module/magic-pie';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  @ViewChild('usernameInput') username_input_el: ElementRef;
  @ViewChild('passwordInput') password_input_el: ElementRef;

  public userData: Array<any>;
  public userInput = {
    "username": "",
    "password": ""
  };
  public userInputState = {
    "username": true,
    "password": true,
    "onProgress": false
  };
  msg = {
    "error": {
      "username": "Username is incorrect.",
      "password": "Password is incorrect."
    },
    "success": {
      "login": "Login successfully."
    }
  };
  public message = '';

  constructor(
    public magicpie: MagicPie,
    private playerService: PlayerService,
    private messageService: MessageService
  ) {
    
    this.playerService.getPlayer()
      .subscribe(resData => {
        this.userData = resData.users;
      });
  }

  ngAfterViewInit() {
    // STO to do after View rendered and MagicPie invoked all events
    setTimeout(() => {
      this.username_input_el.nativeElement.focus();
    }, 500);
  }

  login() {
    
    console.log(this.messageService.getMessage());
    
    let msgError = '';

    for( let user of this.userData ) {
      if ( user.username === this.userInput.username ) {
        this.userInputState.username = true;
                
        if ( user.password === this.userInput.password ) {
          msgError = '';
          this.userInputState.password = true;
          this.userInputState.onProgress = true;
          this.username_input_el.nativeElement.blur();
          this.username_input_el.nativeElement.setAttribute('disabled', true);
          this.password_input_el.nativeElement.setAttribute('disabled', true);
          break;

        } else {
          this.password_input_el.nativeElement.focus();
          msgError = this.msg.error.password;
          this.userInputState.password = false;
          this.userInputState.onProgress = false;          
        }

      } else {
        this.username_input_el.nativeElement.focus();
        msgError = this.msg.error.username;
        this.userInputState.username = false;
        this.userInputState.onProgress = false;   
      }
    }

    this.showMessage(msgError);
  }

  showMessage(msg: string): void {
    this.message = msg;
  }
}
