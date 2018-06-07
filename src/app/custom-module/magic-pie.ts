import { Injectable } from "@angular/core";

@Injectable()
export class MagicPie {
  a;
  d;

  constructor() {
    this.a = window;
    this.d = this.a.document;
  }

  addClass(el, className) {
    if (el.classList) {
      el.classList.add(className);
    } else {
      el.className += ' ' + className;
    }
  }

  removeClass(el, className) {
    if (el.classList) {
      el.classList.remove(className);
    } else {
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }

  getClosestTarget(path) {
    path = path.slice(0, -3);
    let target, check = false;
    for ( let x of path ) {
      if ( x.hasAttribute('data-ripple') === true ) {
        target = x;
        break;
      }
    }
    return target;
  }

  getBoundControlClosestTarget(path) {
    path = path.slice(0, -3);
    let target, check = false;
    for ( let x of path ) {
      if ( x.hasAttribute('data-bound-control') === true ) {
        target = x;
        break;
      }
    }
    return target;
  }

  restartRippleWave() {
    let opts = {
      data_ripple: "data-ripple",
      rippleCls: "ripple",
      activeCls: "activeRipple",
      mouseEvents: ['mouseup', 'mouseleave'],
      delayBeforeEndTour: 100,
      cheatKeys: {
        happyEnding: 'happy-ending'
      }
    }
    // create DOM for each data-ripple
    // DOCs: https://eager.io/blog/how-to-decide-when-your-code-should-run/
    setTimeout(() => {
      let ripples = this.d.querySelectorAll(`[${opts.data_ripple}]`);
      ripples.forEach(ele => {
        let rippleDiv = this.d.createElement('div');
            rippleDiv.setAttribute('class', opts.rippleCls); 
        ele.prepend(rippleDiv);
      });
    }, 0);

    this.d.addEventListener('mousedown', (event) => {
      let isRipple = false,
          target = event.target;
      if ( target.hasAttribute(opts.data_ripple) === true ) {
        isRipple = true;
      } else {
        let realTarget = this.getClosestTarget(event.path);
        if ( realTarget !== undefined ) {
          target = realTarget;
          isRipple = true;
        }
      }

      if( isRipple === true ) {
        // AVOID DUPLICATE CLICK ON @.ripple
        let old_el_ripple = target.querySelector('.' + opts.rippleCls);
        console.log("old_el_ripple:" + old_el_ripple);

        if ( old_el_ripple !== null ) {
          // ASSIGN LEXICAL @this
          let _self = target;
          this.addClass(_self, opts.activeCls);
          /*
            FIND POSITION OF @this
            Note: clientX, clientY: get position with screen-captured as what you see on
          */
          let offs = _self.getBoundingClientRect(),
            x = event.clientX - offs.left,
            y = event.clientY - offs.top,
            elWidth = offs.width;
          // Stylize @.ripple
          let el_ripple = _self.querySelector('.' + opts.rippleCls);
          el_ripple.style.cssText = 'width: ' + elWidth + 'px;height: ' + elWidth + 'px;top: ' + y + 'px;left: ' + x + 'px;';

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
              this.removeClass(_self, opts.activeCls);
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
  }

  restartFormControl() {
    let opts = {
      gg_bound_control_cls: "gg-bound-control",
      activeCls: "active-ggBoundControl",
      control_ipt_cls: "control-ipt",
      ef_bottom_border_cls: "ef-bottom-border"
    }

    this.d.addEventListener('mousedown', (event) => {
      let target = event.target;
      let _self = this.getBoundControlClosestTarget(event.path);

      if( target.classList.contains(opts.control_ipt_cls) === true ) {
        /*
          FIND POSITION OF @this
          Note: clientX, clientY: get position with screen-captured as what you see on
        */
        let offs = _self.getBoundingClientRect(),
            x = event.clientX - offs.left;
       // Stylize @.ripple
       let el_ef_bottom_border = _self.querySelector('.' + opts.ef_bottom_border_cls);
       el_ef_bottom_border.style.cssText = `transform-origin: ${x}px center 0px;`;

        // FOCUS
        target.addEventListener('focus', (event) => {
          _self.classList.add(opts.activeCls);
          if (target.value) {
            _self.classList.remove('error');
            _self.classList.remove('valued');
          }
        });
        // FOCUSOUT
        target.addEventListener('focusout', (event) => {
          _self.classList.remove(opts.activeCls);          
          if (target.value) {
            _self.classList.remove('error');
            _self.classList.add('valued');
          } else {
            _self.classList.remove('valued');
          }
        });
      }
    });
  }
}