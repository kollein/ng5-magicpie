import { Injectable } from "@angular/core";

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
    // FORM CONTROL : invoking
    this.restartFormControl();
    // RIPPLE WAVE: invoking
    this.restartRippleWave();
    // TOGGLE PAPER: invoking
    this.restartSwitchStatus();
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

  restartRippleWave() {
    let opts = {
      data_container: "data-ripple",
      rippleCls: "ripple",
      activeCls: "active",
      mouseEvents: [this.eventList.mouseup, this.eventList.mouseleave],
      delayBeforeEndTour: 150,
      cheatKeys: {
        happyEnding: 'happy-ending'
      },
      delayTrigger: 0,
      mapkeydata: {
        background_color: 'background-color',
        position: 'position'
      }
    }
    // create DOM for each data-ripple
    // DOCs: https://eager.io/blog/how-to-decide-when-your-code-should-run/
    setTimeout(() => {

      this.d.addEventListener(this.eventList.mousedown, (event) => {
        
        let real_target = event.target;
        let container_target = this.getClosestTargetByAttrName(real_target, opts.data_container);

        if ( container_target !== null ) {
          let target = container_target;
          let pallete = {
            background_color: target.getAttribute(`data-${opts.mapkeydata.background_color}`),
            position: target.getAttribute(`data-${opts.mapkeydata.position}`)
          }

          console.log(pallete);
          
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
              x = client.x - offs.left + 'px',
              y = client.y - offs.top + 'px',
              elWidth = offs.width + 'px';
            // Stylize @.ripple
            let el_ripple = _self.querySelector(`.${opts.rippleCls}`);
            if ( pallete.position === 'center' ) {
              x = '50%';
              y = '50%';
            }
            let customBackground = pallete.background_color !== '' ? `background: ${pallete.background_color}` : '';
            el_ripple.style.cssText = `width: ${elWidth};height:${elWidth};top:${y};left:${x};${customBackground}`;

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
                el_ripple.addEventListener("transitionend", removeEffect); // (2)
              }
            }

            let removeEffect = (state) => {
              setTimeout(() => {
                _self.classList.remove(opts.activeCls);
              }, (state === opts.cheatKeys.happyEnding ? 0 : opts.delayBeforeEndTour) );

              el_ripple.removeEventListener("transitionend", setStransendState); // (1)
              el_ripple.removeEventListener("transitionend", removeEffect); // (2)
              opts.mouseEvents.forEach(evt => {
                _self.removeEventListener(evt, endtour);
              });
            }
            
            el_ripple.addEventListener("transitionend", setStransendState); // (1)
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

    setTimeout(() => {

      this.d.addEventListener(this.eventList.mousedown, (event) => {

        let real_target = event.target;
        let container_target = this.getClosestTargetByAttrName(real_target, opts.data_container);

        if ( container_target !== null ) {

          let inputElement = container_target.querySelector(`.${opts.control_ipt_cls}`);
          
          let checkingValue = () => {
            container_target.classList.add(opts.activeCls);
            if (inputElement.value) {
              container_target.classList.remove('hasValue');
            } 
          }

          inputElement.addEventListener('focusin', checkingValue);

          // FOCUSOUT, BLUR
          let endtour = () => {
            container_target.classList.remove(opts.activeCls);          
            if (inputElement.value) {
              container_target.classList.add('hasValue');
            } else {
              container_target.classList.remove('hasValue');
            }

            inputElement.removeEventListener('focusin', checkingValue);

            opts.groupEvents.forEach(evt => {
              inputElement.removeEventListener(evt, endtour);
            });
          }

          opts.groupEvents.forEach(evt => {
            inputElement.addEventListener(evt, endtour);
          });



          // SET POSITION TRANSFORM
          if( real_target.classList.contains(opts.control_ipt_cls) === true ) {
            let client = <any>this.getClientXY(event);
            let offs = container_target.getBoundingClientRect(),
                x = client.x - offs.left;
            // Stylize @.el_ef_bottom_border
            let el_ef_bottom_border = container_target.querySelector(`.${opts.ef_bottom_border_cls}`);
            el_ef_bottom_border.style.cssText = `transform-origin: ${x}px center 0px;`;
          }
        }
      }, true);
    }, 0);
  }

  restartSwitchStatus() {
    let opts = {
      ariaChecked: 'aria-checked',
      paperRippleEl: 'paper-ripple',
      mouseEvents: [this.eventList.mouseup, this.eventList.mouseleave]  
    }

    setTimeout(() => {
      
      let switchStatus = (el_container) => {
        let status = (el_container.getAttribute(opts.ariaChecked) === 'true') ? 'false' : 'true';
        el_container.setAttribute(opts.ariaChecked, status);
        return status;
      }

      this.d.addEventListener(this.eventList.mousedown, (event) => {
        
        let real_target = event.target;
        let container_target = this.getClosestTargetByAttrName(real_target, opts.ariaChecked);
          
        if ( container_target !== null ) {
          let target = container_target;

          let client = <any>this.getClientXY(event);
          let startX = client.x;
      
          if (real_target.parentNode.hasAttribute(opts.ariaChecked)) {
            // @.toggle-bar clicked
            switchStatus(target);
            console.log('toggle clicked');
            
          } else {
            console.log('circle clicked');
            // @.circle clicked
            let status = target.getAttribute(opts.ariaChecked);
            
            let switchStatusByDragging = (event1) => {
              
              if ( startX !== 'stopped' ) {
                let client = <any>this.getClientXY(event1);
                let distance = startX - client.x;
                // console.log(startX, client.x, status);
                // console.log('distance: ', distance);
                let validDragging = false;
                if ( status === 'true' ) {
                  validDragging = distance > 4 ? true : false;
                } else {
                  validDragging = distance < -4 ? true : false;
                }
                // console.log('validDragging: ', validDragging);
                
                if ( validDragging ) {
                  console.log('dragged');
                  // update
                  startX = client.x;
                  status = switchStatus(target);
                }
              }
              // 
            }

            let removeDragging = () => {
              console.log('remove dragging');
              real_target.removeEventListener(this.eventList.mousemove, switchStatusByDragging); // (1)
              this.d.removeEventListener(this.eventList.mouseup, removeDragging); // (2)
            }
            
            real_target.addEventListener(this.eventList.mousemove, switchStatusByDragging); // (1)
            this.d.addEventListener(this.eventList.mouseup, removeDragging); // (2)
          }

          let myRipple = target.querySelector('.' + opts.paperRippleEl);
          myRipple.style.opacity = 1;
          // SET SCALE BY parentNode
          var myRipple_parent_height = myRipple.parentNode.getBoundingClientRect().height,
              scale_n = 1;
          if( myRipple_parent_height ) {
            scale_n = 2.5; 
          }
          myRipple.style.transform = 'scale(' + scale_n + ')';
      
          let setStransendState = (val = true) => {
            myRipple.setAttribute('istransend', val);
          }
          let getStransendState = () => {
            return myRipple.getAttribute('istransend');            
          }
          
          setStransendState(false);
      
          let removeEffect = () => {
            myRipple.style.opacity = 0;
            myRipple.style.transform = 'scale(0)';
      
            // remove all events
            myRipple.removeEventListener("transitionend", setStransendState); // (1)
            myRipple.removeEventListener("transitionend", removeEffect); // (2)
            opts.mouseEvents.forEach(evt => {
              target.removeEventListener(evt, endtour);
            }); 
            
          }
      
          let endtour = () => {
            if ( getStransendState() !== 'false' ) {
              console.log('happy ending!');
              removeEffect();
              setStransendState(false);
            } else {
              console.log('renew transitionend event then auto-delete!');
              myRipple.removeEventListener("transitionend", setStransendState); // (1)
              myRipple.addEventListener("transitionend", removeEffect); // (2)
            }
          }
      
          myRipple.addEventListener("transitionend", setStransendState); // (1)
          opts.mouseEvents.forEach(evt => {
            target.addEventListener(evt, endtour);
          });

        }
      });
    }, 0);
  }
}