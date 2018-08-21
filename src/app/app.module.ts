import { BrowserModule }        from '@angular/platform-browser';
import { NgModule }             from '@angular/core';
import { FormsModule }          from '@angular/forms';
import { HttpClientModule }     from '@angular/common/http';

import { AppComponent }         from './app.component';
import { LoginComponent }       from './login/login.component';
import { AppRoutingModule }     from './app-routing.module';

import { PlayerService }        from './service/player.service';
import { MessageService }       from './service/message.service';
import { HomeComponent } from './home/home.component';
import { ObserComponent } from './obser/obser.component';

import { MagicPie } from './custom-module/magic-pie';
import { CustomeventComponent } from './customevent/customevent.component';
import { FlashViewComponent } from './flash-view/flash-view.component';
import { QuickViewComponent } from './quick-view/quick-view.component';
import { QuickViewScaleComponent } from './quick-view-scale/quick-view-scale.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ObserComponent,
    CustomeventComponent,
    FlashViewComponent,
    QuickViewComponent,
    QuickViewScaleComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [ 
    PlayerService,
    MessageService,
    MagicPie,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
