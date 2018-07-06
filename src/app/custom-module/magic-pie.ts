import { Injectable } from "@angular/core";
import { locateHostElement } from "@angular/core/src/render3/instructions";

@Injectable()
export class MagicPie {
  a;
  d;
  eventMap = {
    "desktop": {
      mousedown: "mousedown",
      mouseup: "mouseup",
      mousemove: "mousemove",
      mouseleave: "mouseleave"
    },
    "mobile": {
      mousedown: "touchstart",
      mouseup: "touchend",
      mousemove: "touchmove",
      mouseleave: "touchcancel"
    }
  }
  eventList;

  constructor() {
    this.a = window;
    this.d = this.a.document;
    // switch Event List
    this.eventList = (typeof window.orientation !== 'undefined') ? this.eventMap.mobile : this.eventMap.desktop;
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

  getClosestTargetByAttrName(path, attrName) {
    path = path.slice(0, -3);
    let target, check = false;
    for ( let x of path ) {
      if ( x.hasAttribute(attrName) === true ) {
        target = x;
        break;
      }
    }
    return target;
  }

  restartRippleWave() {
    let opts = {
      data_container: "data-ripple",
      rippleCls: "ripple",
      activeCls: "active-ripple",
      mouseEvents: [this.eventList.mouseup, this.eventList.mouseleave],
      delayBeforeEndTour: 150,
      cheatKeys: {
        happyEnding: 'happy-ending'
      },
      delayTrigger: 0
    }
    // create DOM for each data-ripple
    // DOCs: https://eager.io/blog/how-to-decide-when-your-code-should-run/
    setTimeout(() => {
      let ripples = this.d.querySelectorAll(`[${opts.data_container}]`);
      ripples.forEach(ele => {
        let rippleDiv = this.d.createElement('div');
            rippleDiv.setAttribute('class', opts.rippleCls); 
        ele.prepend(rippleDiv);
      });

      this.d.addEventListener(this.eventList.mousedown, (event) => {
        
        let isRipple = false,
            target = event.target;
        if ( target.hasAttribute(opts.data_container) === true ) {
          isRipple = true;
        } else {
          let realTarget = this.getClosestTargetByAttrName(event.path, opts.data_container);
          if ( realTarget !== undefined ) {
            target = realTarget;
            isRipple = true;
          }
        }

        if( isRipple === true ) {
          // AVOID DUPLICATE CLICK ON @.ripple
          let old_el_ripple = target.querySelector(`.${opts.rippleCls}`);
          console.log("old_el_ripple:" + old_el_ripple);

          if ( old_el_ripple !== null ) {
            // ASSIGN LEXICAL @this
            let _self = target;
            _self.classList.add(opts.activeCls);
            /*
              FIND POSITION OF @this
              Note: clientX, clientY: get position with screen-captured as what you see on
            */
            let client = <any>this.getClientXY(event);
            
            let offs = _self.getBoundingClientRect(),
              x = client.x - offs.left,
              y = client.y - offs.top,
              elWidth = offs.width;
            // Stylize @.ripple
            let el_ripple = _self.querySelector(`.${opts.rippleCls}`);
            el_ripple.style.cssText = `width: ${elWidth}px;height:${elWidth}px;top:${y}px;left:${x}px;`;

            let setStransendState = (val = true) => {
              _self.setAttribute('istransend', val);            
            }
            let getStransendState = () => {
              return _self.getAttribute('istransend');            
            }

            setStransendState(false);
            
            let endtour = () => {
              if ( getStransendState() !== 'false' ) {
                console.log('happy ending!');
                removeEffect(opts.cheatKeys.happyEnding);
                setStransendState(false);
              } else {
                console.log('renew transitionend event then auto-delete!');
                el_ripple.removeEventListener("transitionend", setStransendState);
                el_ripple.addEventListener("transitionend", removeEffect);
              }
            }

            let removeEffect = (state) => {
              setTimeout(() => {
                _self.classList.remove(opts.activeCls);
              }, (state === opts.cheatKeys.happyEnding ? 0 : opts.delayBeforeEndTour) );

              el_ripple.removeEventListener("transitionend", setStransendState);
              el_ripple.removeEventListener("transitionend", removeEffect);
              opts.mouseEvents.forEach(evt => {
                _self.removeEventListener(evt, endtour);
              });       
            }
            
            el_ripple.addEventListener("transitionend", setStransendState);
            opts.mouseEvents.forEach(evt => {
              _self.addEventListener(evt, endtour);
            });
          }
        }
      });
    }, opts.delayTrigger);
  }

  restartFormControl() {
    let opts = {
      data_container: "data-bound-control",
      gg_bound_control_cls: "gg-bound-control",
      activeCls: "active-gg-bound-control",
      control_ipt_cls: "gg-bound-control-input",
      ef_bottom_border_cls: "gg-bound-control-ef-bottom-border",
      groupEvents: ['focusout', 'blur']
    }

    this.a.addEventListener('DOMContentLoaded', () => {
      let boundControls = this.d.querySelectorAll(`[${opts.data_container}]`);

      boundControls.forEach(_self => {

        let inputElement = _self.querySelector(`.${opts.control_ipt_cls}`);
        inputElement.addEventListener('focusin', (event) => {
          _self.classList.add(opts.activeCls);
          if (inputElement.value) {
            _self.classList.remove('hasValue');
          } 
        });

        // FOCUSOUT, BLUR
        let endtour = () => {
          _self.classList.remove(opts.activeCls);          
          if (inputElement.value) {
            _self.classList.add('hasValue');
          } else {
            _self.classList.remove('hasValue');
          }
        }

        opts.groupEvents.forEach(evt => {
          inputElement.addEventListener(evt, endtour);
        });

      });

      // SET POSITION TRANSFORM
      this.d.addEventListener(this.eventList.mousedown, (event) => {
        let target = event.target;
        let _self = this.getClosestTargetByAttrName(event.path, opts.data_container);
  
        if( target.classList.contains(opts.control_ipt_cls) === true ) {
          let client = <any>this.getClientXY(event);
          let offs = _self.getBoundingClientRect(),
              x = client.x - offs.left;
         // Stylize @.el_ef_bottom_border
         let el_ef_bottom_border = _self.querySelector(`.${opts.ef_bottom_border_cls}`);
         el_ef_bottom_border.style.cssText = `transform-origin: ${x}px center 0px;`;
        }
      }, true);
    });
  }

  showPaperRipple(el_container, eventType) {
    let opts = {
      paperRippleEl: 'paper-ripple'
    }
    let myRipple = el_container.querySelector('.' + opts.paperRippleEl), timer;
    // CHECK EVENT TO SHOW OR HIDE
    if ( eventType === this.eventList.mousedown ) {
      clearTimeout(timer);
      timer = 0;
      myRipple.style.opacity = 1;
      // SET SCALE BY parentNode
      var myRipple_parent_height = myRipple.parentNode.getBoundingClientRect().height,
          scale_n = 1;
      if( myRipple_parent_height ) {
        scale_n = 2.5; 
      }
      myRipple.style.transform = 'scale(' + scale_n + ')';
    } else {
      timer = setTimeout(() => {
        myRipple.style.opacity = 0;
        myRipple.style.transform = 'scale(0)';
      }, 100);
    }
  }

  checkStatusOnElement(options) {
    let opts = {
      ariaChecked: 'aria-checked'
    }

    setTimeout(() => {
      let switchEle = this.d.querySelectorAll(options.strSelector);
      let switchStatus = (el_container) => {
        if (el_container.getAttribute(opts.ariaChecked) === 'true') {
          el_container.setAttribute(opts.ariaChecked, 'false');
        } else {
          el_container.setAttribute(opts.ariaChecked, 'true');
        }
      }

      for (let index in switchEle) {
        // CHECK HAS PROP
        if (switchEle.hasOwnProperty(index)) {
          // MOUSEDOWN
          switchEle[index].addEventListener(this.eventList.mousedown, (event) => {
            event.preventDefault();
            let target = event.target;
            let client = <any>this.getClientXY(event);
            let startX = client.x;
            
            let el_container = target.parentNode;

            if (el_container.hasAttribute(opts.ariaChecked)) {
              // @.toggle-bar clicked
              switchStatus(el_container);

            } else {
              // @.circle clicked
              let el_container = this.getClosestTargetByAttrName(event.path, opts.ariaChecked);
              let status = el_container.getAttribute(opts.ariaChecked);
              
              let switchStatusByDragging = (event1) => {
                
                if ( startX !== 'stopped' ) {
                  let client = <any>this.getClientXY(event1);
                  let distance = startX - client.x;
                  console.log(distance);
                  let validDragging = false;
                  if ( status === 'true' ) {
                    validDragging = distance > 4 ? true : false;
                  } else {
                    validDragging = distance < -4 ? true : false;
                  }
                  if ( validDragging ) {
                    console.log('dragged');
                    startX = 'stopped';
                    switchStatus(el_container);
                  }
                }
              }

              target.addEventListener(this.eventList.mousemove, switchStatusByDragging);
              window.addEventListener(this.eventList.mouseup, () => {
                target.removeEventListener(this.eventList.mousemove, switchStatusByDragging);
              });

            }
            // GATHER BY MAP DATA
            let streamDATA = {
              "data-value": false
            };
            for (let k in options.mapDATA) {
              streamDATA[options.mapDATA[k]] = el_container.getAttribute(options.mapDATA[k]);
            }

            // SHOW EFFECT RIPPLE
            this.showPaperRipple(el_container, event.type);
            // INVOKE CALLBACK
            if (options.callback) {
              // TRANSFER : el_container, status TO CALLBACK
              options.callback(el_container, streamDATA);
            }
          });
          // MOUSEUP
          switchEle[index].addEventListener(this.eventList.mouseup, (event) => {
            let target = event.target;          
            this.showPaperRipple(target.parentNode, event.type);
          });
          // MOUSELEAVE
          switchEle[index].addEventListener(this.eventList.mouseleave, (event) => {
            let target = event.target;          
            this.showPaperRipple(target.parentNode, event.type);
          });
        }
      }
    });
  }
}