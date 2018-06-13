import { Injectable } from "@angular/core";

@Injectable()
export class MagicPie {
  a;
  d;

  constructor() {
    this.a = window;
    this.d = this.a.document;
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
      mouseEvents: ['mouseup', 'mouseleave'],
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

      this.d.addEventListener('mousedown', (event) => {
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
            let offs = _self.getBoundingClientRect(),
              x = event.clientX - offs.left,
              y = event.clientY - offs.top,
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
          console.log('it cused');
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
      this.d.addEventListener('mousedown', (event) => {
        let target = event.target;
        let _self = this.getClosestTargetByAttrName(event.path, opts.data_container);
  
        if( target.classList.contains(opts.control_ipt_cls) === true ) {
          let offs = _self.getBoundingClientRect(),
              x = event.clientX - offs.left;
         // Stylize @.el_ef_bottom_border
         let el_ef_bottom_border = _self.querySelector(`.${opts.ef_bottom_border_cls}`);
         el_ef_bottom_border.style.cssText = `transform-origin: ${x}px center 0px;`;
        }
      }, true);
    });
  }

  showPaperRipple(el_container, status, eventType) {
    let opts = {
      paperRippleEl: 'paper-ripple'
    }
    let myRipple = el_container.querySelector('.' + opts.paperRippleEl), timer;
    // CHECK EVENT TO SHOW OR HIDE
    if ( eventType == 'mousedown' ) {
      clearTimeout(timer);
      timer = 0;
      myRipple.style.opacity = 1;
      // SET SCALE BY parentNode
      var myRipple_parent_height = myRipple.parentNode.getBoundingClientRect().height,
          scale_n = 1;
      if( myRipple_parent_height == 16 ) {
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
      let el_checkbox_container = this.d.querySelectorAll(options.strSelector);

      for (let index in el_checkbox_container) {
        // CHECK HAS PROP
        if (el_checkbox_container.hasOwnProperty(index)) {
          // MOUSEDOWN ON
          el_checkbox_container[index].addEventListener('mousedown', (event) => {
            event.preventDefault();
            let target = event.target;
            // @.toggle-container
            let el_container = target.parentNode;
            // WITH @status: 0 -> false, 1 -> true
            let status = 0;

            if (el_container.getAttribute(opts.ariaChecked) == 'true') {
              status = 0;
              el_container.setAttribute(opts.ariaChecked, 'false');
            } else {
              status = 1;
              el_container.setAttribute(opts.ariaChecked, 'true');
            }
            // GATHER BY MAP DATA
            let streamDATA = {
              "data-value": status
            };
            for (let k in options.mapDATA) {
              streamDATA[options.mapDATA[k]] = el_container.getAttribute(options.mapDATA[k]);
            }

            // SHOW EFFECT RIPPLE
            this.showPaperRipple(el_container, status, event.type);
            // INVOKE CALLBACK
            if (options.callback) {
              // TRANSFER : el_container, status TO CALLBACK
              options.callback(el_container, streamDATA);
            }
          });
          // MOUSEUP ON
          el_checkbox_container[index].addEventListener('mouseup', (event) => {
            let target = event.target;          
            this.showPaperRipple(target.parentNode, status, event.type);
          });
          // MOUSELEAVE ON
          el_checkbox_container[index].addEventListener('mouseleave', (event) => {
            let target = event.target;          
            this.showPaperRipple(target.parentNode, status, event.type);
          });
        }
      }
    }
  }
}