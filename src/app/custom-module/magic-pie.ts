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

  restartRippleWave() {
    let opts = {
      "ripple": ".ripple",
      "rippleWave": ".rippleWave",
      "active": ".active",
      "opacityTime": 100
    };
    let transitionendState = false;
    let setState = () => {
      transitionendState = true;
    };

    this.d.addEventListener('mousedown', (event) => {
      let isRipple = false,
          target = event.target;
      if ( target.hasAttribute('data-ripple') === true ) {
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
        let old_el_ripple = target.querySelector(opts.ripple);
        console.log("old_el_ripple:" + old_el_ripple);
        if ( old_el_ripple === null ) {
          // ASSIGN LEXICAL @this
          let _self = target;
          this.addClass(_self, opts.active.substr(1));
          /*
            FIND POSITION OF @this
            Note: clientX, clientY: get position with screen-captured as what you see on
          */
          let offs = _self.getBoundingClientRect(),
            x = event.clientX - offs.left,
            y = event.clientY - offs.top,
            adjacent_side = (offs.width - x > offs.width / 2) ? offs.width - x : x,
            opposite_side = (offs.height - y > offs.height / 2) ? offs.height - y : y,
            hypothenuse_side = Math.sqrt(Math.pow(adjacent_side, 2) + Math.pow(opposite_side, 2)) + 1;
          // CREATE @.ripple WRAPPER
          let el_ripple = this.d.createElement('div');
          el_ripple.setAttribute('class', opts.ripple.substr(1));
          _self.prepend(el_ripple);
          // Wrapped @.ripple inside @this
          _self.style.position = "relative";
          // CREATE @.rippleWave inside @.ripple
          let el_rippleWave = this.d.createElement('div');
          el_rippleWave.setAttribute('class', opts.rippleWave.substr(1));
          // MAKING STYLE FOR ANIMATION
          let cssString = 'background: ' + _self.getAttribute('data-ripple') + ';width: ' + hypothenuse_side + 'px;height: ' + hypothenuse_side + 'px;left: ' + (x - (hypothenuse_side / 2)) + 'px;top: ' + (y - (hypothenuse_side / 2)) + 'px;transform: scale(2.2);';
          el_ripple.appendChild(el_rippleWave);
          // ANIMATION NOW!
          setTimeout(() => {
            // REWRITE ALL PROPERTY: STYLE INLINE
            el_rippleWave.style.cssText = cssString;
          }, 0);

          el_rippleWave.addEventListener("transitionend", setState);

          _self.addEventListener("mouseup", (event) => {
            let removeEffect = () => {
              // FADE OUT RIPPLE BEFORE REMOVE
              el_ripple.style.opacity = 0;
              el_ripple.style.transition = `opacity ${opts.opacityTime}ms linear`;
              // REMOVE AFTER DELAY TO SEE EFFECT
              setTimeout(() => {
                // RE-SELECTOR TO AVOID ERROR REMOVE ON DIFFERENT NODE
                let el_ripple_has_appended = _self.querySelector(opts.ripple);
                if (el_ripple_has_appended) {
                  _self.removeChild(el_ripple_has_appended);
                }
                this.removeClass(_self, opts.active.substr(1));      
              }, opts.opacityTime);
            }
            // REMOVE RIPPLE WHEN RIPPLEWAVE EFFECTIVE DONE!
            if ( transitionendState ) {
              removeEffect();
              transitionendState = false;
            } else {
              el_rippleWave.removeEventListener("transitionend", setState);
              el_rippleWave.addEventListener("transitionend", () => {
                removeEffect();
              });
            }
          });
        }
      }
    });
  }

  restartFormControl() {
  
    this.d.addEventListener('mousedown', (event) => {
      let target = event.target;

      if( target.classList.contains('form-control') === true ) {
        // FOCUS
        target.addEventListener('focus', (event) => {
          if (target.value) {
            target.classList.remove('error');
            target.classList.remove('valued');
          }
        });
        // FOCUSOUT
        target.addEventListener('focusout', (event) => {
          if (target.value) {
            target.classList.remove('error');
            target.classList.add('valued');
          } else {
            target.classList.remove('valued');
          }
        });
      }
    });
  }
}