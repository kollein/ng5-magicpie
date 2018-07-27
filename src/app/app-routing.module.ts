import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ObserComponent } from './obser/obser.component';
import { CustomeventComponent } from './customevent/customevent.component';
 
const routes: Routes = [
  { path: '', component: CustomeventComponent },
  { path: 'dashboard', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'obser', component: ObserComponent }
];
 
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}