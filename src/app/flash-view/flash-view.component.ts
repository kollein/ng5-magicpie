import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flash-view',
  templateUrl: './flash-view.component.html',
  styleUrls: ['./flash-view.component.scss']
})
export class FlashViewComponent implements OnInit {
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
  maxWidth = window.innerWidth;
  maxHeight = window.innerHeight;
  options = {
    "delayDetectClick": 200
  }

  constructor() {
    this.d = window.document;
    // switch Event List
    if ( typeof window.orientation !== 'undefined' ) {
      this.eventList = this.eventMap.mobile;
    } else {
      this.eventList = this.eventMap.desktop;
      this.maxWidth = 980;
    }
  }

  ngOnInit() {
    this.restartFlashView();
  }

  getScrollbarWidth() {
    var outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    document.body.appendChild(outer);
    
    var widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = "scroll";
    
    // add innerdiv
    var inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);        
    
    var widthWithScroll = inner.offsetWidth;
    
    // remove divs
    outer.parentNode.removeChild(outer);
    
    return widthNoScroll - widthWithScroll;
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
      data_flash_view_img: "data-flash-view-img",
      view_modal: "view-modal",
      view_modal_img: "view-modal-img",
      view_modal_mask_bg: "view-modal-mask-bg",
      on_drag_cls: "on-drag",
      on_loose_cls: "on-loose",
      is_zooming_cls: "is-zooming",
      is_zoomed_cls: "is-zoomed",
      is_zoomingout_cls: "is-zoomingout",
      is_zoomedout_cls: "is-zoomedout",
      mouseEvents: [this.eventList.mouseup, this.eventList.mouseleave],
      cheatKeys: {
        happyEnding: 'happy-ending'
      },
      dragDistanceToDismiss: 3
    }
    let _is_zooming_transform;
    let body_el = this.d.querySelector('body');

    this.d.addEventListener(this.eventList.mousedown, (event) => {

      event.preventDefault();
      
      let _mouse_state = event.type;
      let get_mouse_state = () => {
        return _mouse_state;
      }

      let real_target = event.target;
      let container_target = this.getClosestTargetByAttrName(real_target, opts.data_container);

      if ( container_target !== null ) {
        let container_target_rect = container_target.getBoundingClientRect();
        let data_flash_view_img_el = container_target.querySelector(`[${opts.data_flash_view_img}]`);
        let view_modal_el = container_target.querySelector(`.${opts.view_modal}`);
        let view_modal_el_rect = view_modal_el.getBoundingClientRect();
        let view_modal_img_el = view_modal_el.querySelector(`.${opts.view_modal_img}`);
        let view_modal_mask_bg = view_modal_el.querySelector(`.${opts.view_modal_mask_bg}`);
        // cached for global using
        let modalFullWidth = 0,
            modalFullHeight = 0;

        let removeEffect = () => {

          view_modal_el.removeEventListener("transitionend", removeEffect);
          // make it smoothly on animation state
          // setTimeout(() => {
            view_modal_el.classList.remove(opts.is_zooming_cls);
            view_modal_el.classList.add(opts.is_zoomed_cls);
            // view_modal_el.style.cssText = '';
            view_modal_el.style.cssText = `width: ${this.maxWidth}px;`;
          // }, 1080);
        }

        let changeMisc = (state) => {
          let overflowVal = 'hidden',
              attrVal = 'on',
              imgVisibility = 'hidden';

          if ( state === 'off' ) {
            overflowVal = 'static',
            attrVal = 'off';
            imgVisibility = 'visible';
          }

          body_el.style.cssText = `overflow: ${overflowVal}`;
          container_target.setAttribute(opts.data_container, attrVal);
          data_flash_view_img_el.style.cssText = `visibility: ${imgVisibility}`;
        }

        if ( container_target.getAttribute(opts.data_container) !== 'on' ) {

          changeMisc('on');
          
          let widthRatio = this.maxWidth / container_target_rect.width,
              heightRatio = this.maxHeight / container_target_rect.height;

          let ratio = widthRatio, // default to the width ratio until proven wrong
              ratioFromWidth = true;
          if (widthRatio * container_target_rect.height > this.maxHeight) {
            ratio = heightRatio;
            ratioFromWidth = false;
          }

          modalFullWidth = this.maxWidth;
          modalFullHeight = ratio * container_target_rect.height;

          let xAxisContainerToRight = window.innerWidth - container_target_rect.left;
          let translateLeft = xAxisContainerToRight/2 - (container_target_rect.width/2 + container_target_rect.left/2);

          let yAxisContainerToBottom = window.innerHeight - container_target_rect.top;
          let middleMinusTop = yAxisContainerToBottom/2 - container_target_rect.height/2;
          let translateTopX2 = middleMinusTop - (middleMinusTop + container_target_rect.top - container_target_rect.height/2);
          let translateTop = translateTopX2 - ((2 - widthRatio) * container_target_rect.height)/2;

          console.log('ratioFromWidth: ', ratioFromWidth , 'ratio: ', ratio, 'left: ', container_target_rect.left, 'top: ', container_target_rect.top);
          console.log('windowWidth: ', this.maxWidth, 'windowHeight: ', this.maxHeight);
          console.log('containerWidth: ', container_target_rect.width, 'containerHeight: ', container_target_rect.height);
          // console.log('modalFullWidth: ', modalFullWidth, 'modalFullHeight: ', modalFullHeight);
          console.log('translateLeft: ', translateLeft, 'translateTop: ', translateTop);

          view_modal_el.classList.add(opts.is_zooming_cls);
          _is_zooming_transform = `transform: translate(${translateLeft}px, ${translateTop}px) scale(${widthRatio});`;
          // _is_zooming_transform = `transform: translate(${translateLeft}px, ${translateTop}px);width: ${this.maxWidth}px;`;
          view_modal_el.style.cssText = _is_zooming_transform;

          view_modal_el.addEventListener("transitionend", removeEffect);
        }
      

        // Dragging Image
        if ( real_target.classList.contains(opts.view_modal_img) ) {
          
          let clientOrigin = <any>this.getClientXY(event);
          let client = clientOrigin;
          let timer_for_dismiss;
          
          let movingByDragging = (event1) => {

            event1.preventDefault();
            let client1 = <any>this.getClientXY(event1);
            let distanceX = client1.x - client.x;
            let distanceY = client1.y - client.y;

            let distanceXOrigin = Math.abs(client1.x - clientOrigin.x);
            let distanceYOrigin = Math.abs(client1.y - clientOrigin.y);
            // console.log('distanceX: ', distanceXOrigin);
            // console.log('distanceY: ', distanceYOrigin);
            console.log(view_modal_el_rect.height);
            
            view_modal_mask_bg.style.opacity = 1 - Math.max(distanceXOrigin, distanceYOrigin) / view_modal_el_rect.height;

            client = client1;
            let stackTransformValue = real_target.style.transform.replace(/([^0-9\-,]*)/g,'').split(',');

            let prevLeftPos = parseInt(stackTransformValue[0]);
                prevLeftPos = prevLeftPos ? prevLeftPos : 0;
            let prevTopPos = parseInt(stackTransformValue[1]);
                prevTopPos = prevTopPos ? prevTopPos : 0;
            // console.log(prevLeftPos, 'inpx');
            // console.log(prevTopPos, 'inpx');
            real_target.style.transform = `translate(${(distanceX + prevLeftPos)}px, ${(distanceY + prevTopPos)}px)`;

            /*
              swipe up-down to dissmiss modal
              delay to detect mouseup-leave for operation of the end tour. 
            */
            clearTimeout(timer_for_dismiss);
            timer_for_dismiss = setTimeout(() => {
              
              // console.log(get_mouse_state(), opts.mouseEvents.indexOf(get_mouse_state()));
              
              if ( opts.mouseEvents.indexOf(get_mouse_state()) > -1 ) {
                Math.abs(distanceY) > opts.dragDistanceToDismiss && endtour(opts.cheatKeys.happyEnding);
              }
            }, 20);
          }

          let removeZoomingoutEffect = () => {
            view_modal_el.classList.remove(opts.is_zoomedout_cls);
            view_modal_el.removeEventListener("transitionend", removeZoomingoutEffect);
            changeMisc('off');
          }
          
          let endtour = (state) => {
            // update: state = event
            _mouse_state = state.type;
            // End the tour!
            if ( state === opts.cheatKeys.happyEnding ) {

              view_modal_el.classList.remove(opts.is_zoomed_cls);
              view_modal_el.classList.add(opts.is_zoomingout_cls);
              view_modal_el.style.cssText = _is_zooming_transform;

              real_target.style.cssText = '';
              real_target.classList.remove(opts.on_drag_cls);
              real_target.classList.remove(opts.on_loose_cls);

              setTimeout(() => {
                view_modal_el.classList.add(opts.is_zoomedout_cls);
                view_modal_el.classList.remove(opts.is_zoomingout_cls);
                view_modal_el.style.cssText = '';
                view_modal_el.addEventListener("transitionend", removeZoomingoutEffect);
              }, 50);

            } else {
              // End the img-drag-tour!
              let removeOnDragEffect = () => {
                real_target.classList.remove(opts.on_drag_cls);
                real_target.classList.add(opts.on_loose_cls);
                real_target.removeEventListener("transitionend", removeOnDragEffect);
              }

              let removeOnLooseEffect = () => {
                real_target.classList.remove(opts.on_loose_cls);
                real_target.removeEventListener("animationend", removeOnLooseEffect);
              }
              view_modal_mask_bg.style.opacity = 1;
              real_target.style.transform = '';
              real_target.style.trasition = '';
              real_target.classList.add(opts.on_drag_cls);
              real_target.addEventListener("transitionend", removeOnDragEffect);
              real_target.addEventListener("animationend", removeOnLooseEffect);

            }
            
            real_target.removeEventListener(this.eventList.mousemove, movingByDragging);
            opts.mouseEvents.forEach(evt => {
              real_target.removeEventListener(evt, endtour);
            });
          }

          real_target.addEventListener(this.eventList.mousemove, movingByDragging);
          opts.mouseEvents.forEach(evt => {
            real_target.addEventListener(evt, endtour);
          });
        }
      }
    });
  }
}
