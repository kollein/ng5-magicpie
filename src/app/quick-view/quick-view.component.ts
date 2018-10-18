import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quick-view',
  templateUrl: './quick-view.component.html',
  styleUrls: ['./quick-view.component.scss']
})
export class QuickViewComponent implements OnInit {
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
    // switch Event List : Only support on Mobile Device
    if ( typeof window.orientation !== 'undefined' ) {
      this.eventList = this.eventMap.mobile;
    } else {
      this.eventList = this.eventMap.mobile;
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

  getTranslatePixel(str) {
    let getTranslateStr = str.replace(/translate\((.*?)\)(.*)/g,'$1');
    return getTranslateStr.replace(/([^0-9\-\.,]*)/g,'').split(',');
  }

  restartFlashView() {
    let opts = {
      data_container: "data-flash-view",
      data_flash_view_img: "data-flash-view-img",
      data_dismiss: "data-dismiss",
      view_modal: "view-modal",
      view_modal_img_wrapper: "view-modal-img-wrapper",
      is_pressed_cls: "is-pressed",
      is_zooming_cls: "is-zooming",
      is_zoomed_cls: "is-zoomed",
      on_dragging_cls: "on-dragging",
      on_loosing_cls: "on-loosing",
      is_loosed_cls: "is-loosed",
      is_zoomingout_cls: "is-zoomingout",
      mouseEvents: [this.eventList.mouseup, this.eventList.mouseleave],
      cheatKeys: {
        happyEnding: 'happy-ending'
      },
      dragScaleRatioToDismiss: 0.9,
      dragMaxBorderRadius: 12,
      dragDistanceThreshold: 3,
      detect_gesture_delay: 100
    }

    let _is_zooming_transform;
    let body_el = this.d.querySelector('body');

    let timer_detect_gesture,
        clientDoc,
        clientDoc1,
        distanceY_Doc = 0;

    this.d.addEventListener(this.eventList.mousemove, (event) => {
      clientDoc1 = <any>this.getClientXY(event);
    });

    this.d.addEventListener(this.eventList.mousedown, (event) => {

      /* 
      LIFE CYCLE HOOK:
        is_pressed_cls: "is-pressed",
        is_zooming_cls: "is-zooming",
        is_zoomed_cls: "is-zoomed",
        on_dragging_cls: "on-dragging",
        on_loosing_cls: "on-loosing",
        is_loosed_cls: "is-loosed",
        is_zoomingout_cls: "is-zoomingout"
      END
      */

      clientDoc = <any>this.getClientXY(event);
      clientDoc1 = clientDoc;

      clearTimeout(timer_detect_gesture);
      timer_detect_gesture = setTimeout(() => {
        
        distanceY_Doc = clientDoc1.y - clientDoc.y;
        // console.log('distanceY_Doc outside: ', distanceY_Doc);
        clientDoc = clientDoc1;
        
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
          let view_modal_img_wrapper_el = view_modal_el.querySelector(`.${opts.view_modal_img_wrapper}`);
          // cached for global using
          let modalFullWidth = 0,
              modalFullHeight = 0;

          let removeIsPressedEffect = () => {

            view_modal_el.classList.remove(opts.is_pressed_cls);
            view_modal_el.classList.add(opts.is_zooming_cls);
            view_modal_el.removeEventListener("transitionend", removeIsPressedEffect);
            view_modal_el.style.cssText = _is_zooming_transform;
            view_modal_el.addEventListener("transitionend", removeEffect);

          }

          let removeEffect = () => {

            view_modal_el.classList.remove(opts.is_zooming_cls);
            view_modal_el.classList.add(opts.is_zoomed_cls);
            view_modal_el.removeEventListener("transitionend", removeEffect);

          }

          let preventDefault = e => {
            e.preventDefault();
          }

          let changeMisc = (state) => {
            let overflowVal = 'hidden',
              heightVal = `${this.maxHeight}px`,
              attrVal = 'on',
              imgVisibility = 'hidden';

            if ( state === 'off' ) {
              overflowVal = 'static',
              heightVal = '100%',
              attrVal = 'off';
              imgVisibility = 'visible';

              console.log('enableScroll');
              body_el.removeEventListener('touchmove', preventDefault, { passive: false });
            } else {
              console.log('disableScroll');
              body_el.addEventListener('touchmove', preventDefault, { passive: false });
            }
            body_el.style.cssText = `overflow: ${overflowVal};height: ${heightVal}`;
            container_target.setAttribute(opts.data_container, attrVal);
            data_flash_view_img_el.style.cssText = `visibility: ${imgVisibility}`;
          }

          if ( container_target.getAttribute(opts.data_container) !== 'on' && distanceY_Doc === 0 ) {

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
            // let translateLeft = xAxisContainerToRight/2 - (container_target_rect.width/2 + container_target_rect.left/2);
            let translateLeft = (window.innerWidth - this.maxWidth)/2 - container_target_rect.left;

            let yAxisContainerToBottom = window.innerHeight - container_target_rect.top;
            let middleMinusTop = yAxisContainerToBottom/2 - container_target_rect.height/2;
            let translateTopX2 = middleMinusTop - (middleMinusTop + container_target_rect.top - container_target_rect.height/2);
            // let translateTop = translateTopX2 - ((2 - widthRatio) * container_target_rect.height)/2;
            let translateTop = -container_target_rect.top;
            


            // console.log('ratioFromWidth: ', ratioFromWidth , 'ratio: ', ratio, 'left: ', container_target_rect.left, 'top: ', container_target_rect.top);
            // console.log('windowWidth: ', this.maxWidth, 'windowHeight: ', this.maxHeight);
            // console.log('containerWidth: ', container_target_rect.width, 'containerHeight: ', container_target_rect.height);
            // console.log('modalFullWidth: ', modalFullWidth, 'modalFullHeight: ', modalFullHeight);
            // console.log('translateLeft: ', translateLeft, 'translateTop: ', translateTop);

            view_modal_el.classList.add(opts.is_pressed_cls);
            _is_zooming_transform = `transform: translate(${translateLeft}px, ${translateTop}px);width: ${this.maxWidth}px;height: ${window.innerHeight}px;`;

            view_modal_el.addEventListener("transitionend", removeIsPressedEffect);

          } else {

            // Dragging Image
            let clientOrigin = <any>this.getClientXY(event);
            let client = clientOrigin;
            let timer_for_dismiss;
            
            let movingByDragging = (event1) => {
              
              
              let client1 = <any>this.getClientXY(event1);
              let distanceX = client1.x - client.x;
              let distanceY = client1.y - client.y;

              // check direction
              if ( distanceY > 0 && view_modal_el.scrollTop === 0 ) {

                let distanceXOrigin = Math.abs(client1.x - clientOrigin.x);
                let distanceYOrigin = Math.abs(client1.y - clientOrigin.y);
                // console.log('distanceX: ', distanceXOrigin);
                // console.log('distanceY: ', distanceYOrigin);
                // console.log(view_modal_el_rect.height);
                
                

                let stackTransformValue = this.getTranslatePixel(view_modal_el.style.transform);

                let prevLeftPos = parseFloat(stackTransformValue[0]);
                    prevLeftPos = prevLeftPos ? prevLeftPos : 0;
                let prevTopPos = parseFloat(stackTransformValue[1]);
                    prevTopPos = prevTopPos ? prevTopPos : 0;
                // console.log(prevLeftPos, 'inpx');
                // console.log(prevTopPos, 'inpx');
                let distanceY_threshold = distanceY / opts.dragDistanceThreshold;
                let sum_distanceY = Math.round(distanceY_threshold + prevTopPos);
                let distanceYOrigin_ratio = 1 - (distanceYOrigin/window.innerHeight)/3;
                    distanceYOrigin_ratio = distanceYOrigin_ratio < opts.dragScaleRatioToDismiss ? opts.dragScaleRatioToDismiss : distanceYOrigin_ratio;
                let borderRadius = (1 - distanceYOrigin_ratio) * opts.dragMaxBorderRadius / opts.dragScaleRatioToDismiss * opts.dragMaxBorderRadius;
                // console.log(distanceY_threshold, prevTopPos, sum_distanceY, distanceYOrigin_ratio);

                view_modal_el.classList.add(opts.on_dragging_cls);
                view_modal_el.style.transform = `translate(${prevLeftPos}px, ${prevTopPos}px) scale(${distanceYOrigin_ratio})`;
                view_modal_el.style.borderRadius = `${borderRadius}px`;
                  

                /*
                  swipe up-down to dissmiss modal
                  delay to detect mouseup-leave for operation of the end tour. 
                */
                // clearTimeout(timer_for_dismiss);
                // timer_for_dismiss = setTimeout(() => {
                  
                //   // console.log(get_mouse_state(), opts.mouseEvents.indexOf(get_mouse_state()));
                  
                //   if ( opts.mouseEvents.indexOf(get_mouse_state()) > -1 ) {
                  distanceYOrigin_ratio === opts.dragScaleRatioToDismiss && endtour(opts.cheatKeys.happyEnding);
                //   }
                // }, 20);
              }
              // update
              client = client1;
            }

            let removeZoomingoutEffect = () => {
              view_modal_el.classList.remove(opts.is_pressed_cls, opts.is_zooming_cls, opts.is_zoomed_cls, opts.on_dragging_cls, opts.on_loosing_cls, opts.is_loosed_cls, opts.is_zoomingout_cls);
              view_modal_el.removeEventListener("transitionend", removeZoomingoutEffect);
              view_modal_el.removeEventListener("transitionend", removeOnDragEffect);
              view_modal_el.removeEventListener("transitionend", removeEffect);
              changeMisc('off');
            }
            
            let removeOnDragEffect = () => {
              view_modal_el.classList.remove(opts.on_loosing_cls);
              view_modal_el.classList.add(opts.is_loosed_cls);
              view_modal_img_wrapper_el.addEventListener("animationend", removeOnLooseEffect);
              view_modal_el.removeEventListener("transitionend", removeOnDragEffect);
            }

            let removeOnLooseEffect = () => {
              view_modal_el.classList.remove(opts.is_loosed_cls);
              view_modal_img_wrapper_el.removeEventListener("animationend", removeOnLooseEffect);
            }

            let endtour = (state) => {
              
              // update: state = event
              _mouse_state = state.type;

              // End the tour!
              if ( state === opts.cheatKeys.happyEnding ) {

                view_modal_el.classList.remove(opts.on_dragging_cls, opts.is_zoomed_cls);
                view_modal_el.classList.add(opts.is_zoomingout_cls);
                view_modal_el.style.cssText = '';
                view_modal_el.addEventListener("transitionend", removeZoomingoutEffect);

              } else {

                // End the img-drag-tour!
                view_modal_el.style.cssText = _is_zooming_transform;
                view_modal_el.classList.remove(opts.on_dragging_cls);         
                view_modal_el.classList.add(opts.on_loosing_cls);
                view_modal_el.addEventListener("transitionend", removeOnDragEffect);
              }
              
              view_modal_el.removeEventListener(this.eventList.mousemove, movingByDragging, true);
              opts.mouseEvents.forEach(evt => {
                view_modal_el.removeEventListener(evt, endtour);
              });

            }

            // Dismiss By Close Icon
            let dissmiss_el = this.getClosestTargetByAttrName(real_target, opts.data_dismiss);
            if ( dissmiss_el ) {

              endtour(opts.cheatKeys.happyEnding);

            } else {

              view_modal_el.addEventListener(this.eventList.mousemove, movingByDragging, true);
              opts.mouseEvents.forEach(evt => {
                view_modal_el.addEventListener(evt, endtour);
              });

            }

          }
        }
      }, opts.detect_gesture_delay);  
    });
  }
}