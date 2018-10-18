import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ObserComponent } from './obser/obser.component';
import { CustomeventComponent } from './customevent/customevent.component';
import { FlashViewComponent } from './flash-view/flash-view.component';
import { QuickViewComponent } from './quick-view/quick-view.component';
import { QuickViewScaleComponent } from './quick-view-scale/quick-view-scale.component';

 
const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'obser', component: ObserComponent },
  { path: 'photo', component: CustomeventComponent },
  { path: 'flash', component: FlashViewComponent },
  { path: 'quick', component: QuickViewScaleComponent }
];
 
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}