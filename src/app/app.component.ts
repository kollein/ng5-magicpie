import { Component } from '@angular/core';

import { MagicPie } from './custom-module/magic-pie';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  constructor (magicpie: MagicPie) {
  }
}
