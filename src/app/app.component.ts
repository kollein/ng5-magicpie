import { Component } from '@angular/core';

import { MagicPie } from './custom-module/magic-pie';

@Component({
  selector: 'app-root',
  providers: [MagicPie],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  constructor (magicPie: MagicPie) {
    // FORM CONTROL : invoking
    magicPie.restartFormControl();
    // RIPPLE WAVE: invoking
    magicPie.restartRippleWave();
    // TOGGLE PAPER: invoking
    magicPie.checkStatusOnElement({
      strSelector: '.toggle-container .toggle-bar'
    });
    // CHECKBOX PAPER: invoking
    magicPie.checkStatusOnElement({
      strSelector: '.checkbox-container .checkbox'
    });
  }
}
