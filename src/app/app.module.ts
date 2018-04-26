import { BrowserModule }        from '@angular/platform-browser';
import { NgModule }             from '@angular/core';
import { FormsModule }          from '@angular/forms';
import { HttpClientModule }     from '@angular/common/http';

import { AppComponent }         from './app.component';
import { LoginComponent }       from './login/login.component';
import { AppRoutingModule }     from './app-routing.module';

import { PlayerService }        from './service/player.service';
import { MessageService }       from './service/message.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [ PlayerService, MessageService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
