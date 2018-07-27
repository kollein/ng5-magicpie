import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customevent',
  templateUrl: './customevent.component.html',
  styleUrls: ['./customevent.component.scss']
})
export class CustomeventComponent implements OnInit {
  a;
  d;
  eventMap = {
    "desktop": {
      click: "click",
      mousedown: "mousedown",
      mouseup: "mouseup",
      mousemove: "mousemove",
      mouseleave: "mouseleave"
    },
    "mobile": {
      click: "touchstart",
      mousedown: "touchstart",
      mouseup: "touchend",
      mousemove: "touchmove",
      mouseleave: "touchcancel"
    }
  }
  eventList;
  options = {
    "delayDetectClick": 200
  }

  constructor() {
    this.a = window;
    this.d = this.a.document;
    // switch Event List
    this.eventList = (typeof window.orientation !== 'undefined') ? this.eventMap.mobile : this.eventMap.desktop;
    // 
    
  }

  ngOnInit() {
    this.restartFlashView();
  }

  getClientXY(e) {
    let client = {
      x: false,
      y: false,
      pageX: false,
      pageY: false
    }
    if (e.type.search('touch') > -1) {
      client.x = e.touches[0].clientX,
      client.y = e.touches[0].clientY;
      client.pageX = e.changedTouches[0].pageX;
      client.pageY = e.changedTouches[0].pageY;
    } else {
      client.x = e.clientX;
      client.y = e.clientY;
      client.pageX = e.pageX;
      client.pageY = e.pageY;
    }
    return client;
  }

  getClosestTargetByAttrName(el, attrName) {
    while ( (el = el.parentElement) && !el.hasAttribute(attrName) );
    return el;
  }

  restartFlashView() {
    let opts = {
      data_container: "data-flash-view",
      flash_view: ".view-modal",
      showCls: "show"
    }

    this.d.addEventListener(this.eventList.mousedown, (event) => {
        
      let real_target = event.target;
      let container_target = this.getClosestTargetByAttrName(real_target, opts.data_container);

      if ( container_target !== null ) {
        let flash_view_el = container_target.querySelector(opts.flash_view);
        flash_view_el.classList.add(opts.showCls);
      }

    });
}
