/*!
  * Bootstrap v5.1.3 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@popperjs/core')) :
    typeof define === 'function' && define.amd ? define(['@popperjs/core'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.bootstrap = factory(global.Popper));
  })(this, (function (Popper) { 'use strict';
  
    function _interopNamespace(e) {
      if (e && e.__esModule) return e;
      const n = Object.create(null);
      if (e) {
        for (const k in e) {
          if (k !== 'default') {
            const d = Object.getOwnPropertyDescriptor(e, k);
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: () => e[k]
            });
          }
        }
      }
      n.default = e;
      return Object.freeze(n);
    }
  
    const Popper__namespace = /*#__PURE__*/_interopNamespace(Popper);
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): util/index.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    const MAX_UID = 1000000;
    const MILLISECONDS_MULTIPLIER = 1000;
    const TRANSITION_END = 'transitionend'; // Shoutout AngusCroll (https://goo.gl/pxwQGp)
  
    const toType = obj => {
      if (obj === null || obj === undefined) {
        return `${obj}`;
      }
  
      return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
    };
    /**
     * --------------------------------------------------------------------------
     * Public Util Api
     * --------------------------------------------------------------------------
     */
  
  
    const getUID = prefix => {
      do {
        prefix += Math.floor(Math.random() * MAX_UID);
      } while (document.getElementById(prefix));
  
      return prefix;
    };
  
    const getSelector = element => {
      let selector = element.getAttribute('data-bs-target');
  
      if (!selector || selector === '#') {
        let hrefAttr = element.getAttribute('href'); // The only valid content that could double as a selector are IDs or classes,
        // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
        // `document.querySelector` will rightfully complain it is invalid.
        // See https://github.com/twbs/bootstrap/issues/32273
  
        if (!hrefAttr || !hrefAttr.includes('#') && !hrefAttr.startsWith('.')) {
          return null;
        } // Just in case some CMS puts out a full URL with the anchor appended
  
  
        if (hrefAttr.includes('#') && !hrefAttr.startsWith('#')) {
          hrefAttr = `#${hrefAttr.split('#')[1]}`;
        }
  
        selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null;
      }
  
      return selector;
    };
  
    const getSelectorFromElement = element => {
      const selector = getSelector(element);
  
      if (selector) {
        return document.querySelector(selector) ? selector : null;
      }
  
      return null;
    };
  
    const getElementFromSelector = element => {
      const selector = getSelector(element);
      return selector ? document.querySelector(selector) : null;
    };
  
    const getTransitionDurationFromElement = element => {
      if (!element) {
        return 0;
      } // Get transition-duration of the element
  
  
      let {
        transitionDuration,
        transitionDelay
      } = window.getComputedStyle(element);
      const floatTransitionDuration = Number.parseFloat(transitionDuration);
      const floatTransitionDelay = Number.parseFloat(transitionDelay); // Return 0 if element or transition duration is not found
  
      if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0;
      } // If multiple durations are defined, take the first
  
  
      transitionDuration = transitionDuration.split(',')[0];
      transitionDelay = transitionDelay.split(',')[0];
      return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
    };
  
    const triggerTransitionEnd = element => {
      element.dispatchEvent(new Event(TRANSITION_END));
    };
  
    const isElement = obj => {
      if (!obj || typeof obj !== 'object') {
        return false;
      }
  
      if (typeof obj.jquery !== 'undefined') {
        obj = obj[0];
      }
  
      return typeof obj.nodeType !== 'undefined';
    };
  
    const getElement = obj => {
      if (isElement(obj)) {
        // it's a jQuery object or a node element
        return obj.jquery ? obj[0] : obj;
      }
  
      if (typeof obj === 'string' && obj.length > 0) {
        return document.querySelector(obj);
      }
  
      return null;
    };
  
    const typeCheckConfig = (componentName, config, configTypes) => {
      Object.keys(configTypes).forEach(property => {
        const expectedTypes = configTypes[property];
        const value = config[property];
        const valueType = value && isElement(value) ? 'element' : toType(value);
  
        if (!new RegExp(expectedTypes).test(valueType)) {
          throw new TypeError(`${componentName.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
        }
      });
    };
  
    const isVisible = element => {
      if (!isElement(element) || element.getClientRects().length === 0) {
        return false;
      }
  
      return getComputedStyle(element).getPropertyValue('visibility') === 'visible';
    };
  
    const isDisabled = element => {
      if (!element || element.nodeType !== Node.ELEMENT_NODE) {
        return true;
      }
  
      if (element.classList.contains('disabled')) {
        return true;
      }
  
      if (typeof element.disabled !== 'undefined') {
        return element.disabled;
      }
  
      return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
    };
  
    const findShadowRoot = element => {
      if (!document.documentElement.attachShadow) {
        return null;
      } // Can find the shadow root otherwise it'll return the document
  
  
      if (typeof element.getRootNode === 'function') {
        const root = element.getRootNode();
        return root instanceof ShadowRoot ? root : null;
      }
  
      if (element instanceof ShadowRoot) {
        return element;
      } // when we don't find a shadow root
  
  
      if (!element.parentNode) {
        return null;
      }
  
      return findShadowRoot(element.parentNode);
    };
  
    const noop = () => {};
    /**
     * Trick to restart an element's animation
     *
     * @param {HTMLElement} element
     * @return void
     *
     * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
     */
  
  
    const reflow = element => {
      // eslint-disable-next-line no-unused-expressions
      element.offsetHeight;
    };
  
    const getjQuery = () => {
      const {
        jQuery
      } = window;
  
      if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
        return jQuery;
      }
  
      return null;
    };
  
    const DOMContentLoadedCallbacks = [];
  
    const onDOMContentLoaded = callback => {
      if (document.readyState === 'loading') {
        // add listener on the first call when the document is in loading state
        if (!DOMContentLoadedCallbacks.length) {
          document.addEventListener('DOMContentLoaded', () => {
            DOMContentLoadedCallbacks.forEach(callback => callback());
          });
        }
  
        DOMContentLoadedCallbacks.push(callback);
      } else {
        callback();
      }
    };
  
    const isRTL = () => document.documentElement.dir === 'rtl';
  
    const defineJQueryPlugin = plugin => {
      onDOMContentLoaded(() => {
        const $ = getjQuery();
        /* istanbul ignore if */
  
        if ($) {
          const name = plugin.NAME;
          const JQUERY_NO_CONFLICT = $.fn[name];
          $.fn[name] = plugin.jQueryInterface;
          $.fn[name].Constructor = plugin;
  
          $.fn[name].noConflict = () => {
            $.fn[name] = JQUERY_NO_CONFLICT;
            return plugin.jQueryInterface;
          };
        }
      });
    };
  
    const execute = callback => {
      if (typeof callback === 'function') {
        callback();
      }
    };
  
    const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
      if (!waitForTransition) {
        execute(callback);
        return;
      }
  
      const durationPadding = 5;
      const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
      let called = false;
  
      const handler = ({
        target
      }) => {
        if (target !== transitionElement) {
          return;
        }
  
        called = true;
        transitionElement.removeEventListener(TRANSITION_END, handler);
        execute(callback);
      };
  
      transitionElement.addEventListener(TRANSITION_END, handler);
      setTimeout(() => {
        if (!called) {
          triggerTransitionEnd(transitionElement);
        }
      }, emulatedDuration);
    };
    /**
     * Return the previous/next element of a list.
     *
     * @param {array} list    The list of elements
     * @param activeElement   The active element
     * @param shouldGetNext   Choose to get next or previous element
     * @param isCycleAllowed
     * @return {Element|elem} The proper element
     */
  
  
    const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
      let index = list.indexOf(activeElement); // if the element does not exist in the list return an element depending on the direction and if cycle is allowed
  
      if (index === -1) {
        return list[!shouldGetNext && isCycleAllowed ? list.length - 1 : 0];
      }
  
      const listLength = list.length;
      index += shouldGetNext ? 1 : -1;
  
      if (isCycleAllowed) {
        index = (index + listLength) % listLength;
      }
  
      return list[Math.max(0, Math.min(index, listLength - 1))];
    };
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): dom/event-handler.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
  
    const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
    const stripNameRegex = /\..*/;
    const stripUidRegex = /::\d+$/;
    const eventRegistry = {}; // Events storage
  
    let uidEvent = 1;
    const customEvents = {
      mouseenter: 'mouseover',
      mouseleave: 'mouseout'
    };
    const customEventsRegex = /^(mouseenter|mouseleave)/i;
    const nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);
    /**
     * ------------------------------------------------------------------------
     * Private methods
     * ------------------------------------------------------------------------
     */
  
    function getUidEvent(element, uid) {
      return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
    }
  
    function getEvent(element) {
      const uid = getUidEvent(element);
      element.uidEvent = uid;
      eventRegistry[uid] = eventRegistry[uid] || {};
      return eventRegistry[uid];
    }
  
    function bootstrapHandler(element, fn) {
      return function handler(event) {
        event.delegateTarget = element;
  
        if (handler.oneOff) {
          EventHandler.off(element, event.type, fn);
        }
  
        return fn.apply(element, [event]);
      };
    }
  
    function bootstrapDelegationHandler(element, selector, fn) {
      return function handler(event) {
        const domElements = element.querySelectorAll(selector);
  
        for (let {
          target
        } = event; target && target !== this; target = target.parentNode) {
          for (let i = domElements.length; i--;) {
            if (domElements[i] === target) {
              event.delegateTarget = target;
  
              if (handler.oneOff) {
                EventHandler.off(element, event.type, selector, fn);
              }
  
              return fn.apply(target, [event]);
            }
          }
        } // To please ESLint
  
  
        return null;
      };
    }
  
    function findHandler(events, handler, delegationSelector = null) {
      const uidEventList = Object.keys(events);
  
      for (let i = 0, len = uidEventList.length; i < len; i++) {
        const event = events[uidEventList[i]];
  
        if (event.originalHandler === handler && event.delegationSelector === delegationSelector) {
          return event;
        }
      }
  
      return null;
    }
  
    function normalizeParams(originalTypeEvent, handler, delegationFn) {
      const delegation = typeof handler === 'string';
      const originalHandler = delegation ? delegationFn : handler;
      let typeEvent = getTypeEvent(originalTypeEvent);
      const isNative = nativeEvents.has(typeEvent);
  
      if (!isNative) {
        typeEvent = originalTypeEvent;
      }
  
      return [delegation, originalHandler, typeEvent];
    }
  
    function addHandler(element, originalTypeEvent, handler, delegationFn, oneOff) {
      if (typeof originalTypeEvent !== 'string' || !element) {
        return;
      }
  
      if (!handler) {
        handler = delegationFn;
        delegationFn = null;
      } // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
      // this prevents the handler from being dispatched the same way as mouseover or mouseout does
  
  
      if (customEventsRegex.test(originalTypeEvent)) {
        const wrapFn = fn => {
          return function (event) {
            if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
              return fn.call(this, event);
            }
          };
        };
  
        if (delegationFn) {
          delegationFn = wrapFn(delegationFn);
        } else {
          handler = wrapFn(handler);
        }
      }
  
      const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
      const events = getEvent(element);
      const handlers = events[typeEvent] || (events[typeEvent] = {});
      const previousFn = findHandler(handlers, originalHandler, delegation ? handler : null);
  
      if (previousFn) {
        previousFn.oneOff = previousFn.oneOff && oneOff;
        return;
      }
  
      const uid = getUidEvent(originalHandler, originalTypeEvent.replace(namespaceRegex, ''));
      const fn = delegation ? bootstrapDelegationHandler(element, handler, delegationFn) : bootstrapHandler(element, handler);
      fn.delegationSelector = delegation ? handler : null;
      fn.originalHandler = originalHandler;
      fn.oneOff = oneOff;
      fn.uidEvent = uid;
      handlers[uid] = fn;
      element.addEventListener(typeEvent, fn, delegation);
    }
  
    function removeHandler(element, events, typeEvent, handler, delegationSelector) {
      const fn = findHandler(events[typeEvent], handler, delegationSelector);
  
      if (!fn) {
        return;
      }
  
      element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
      delete events[typeEvent][fn.uidEvent];
    }
  
    function removeNamespacedHandlers(element, events, typeEvent, namespace) {
      const storeElementEvent = events[typeEvent] || {};
      Object.keys(storeElementEvent).forEach(handlerKey => {
        if (handlerKey.includes(namespace)) {
          const event = storeElementEvent[handlerKey];
          removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
        }
      });
    }
  
    function getTypeEvent(event) {
      // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
      event = event.replace(stripNameRegex, '');
      return customEvents[event] || event;
    }
  
    const EventHandler = {
      on(element, event, handler, delegationFn) {
        addHandler(element, event, handler, delegationFn, false);
      },
  
      one(element, event, handler, delegationFn) {
        addHandler(element, event, handler, delegationFn, true);
      },
  
      off(element, originalTypeEvent, handler, delegationFn) {
        if (typeof originalTypeEvent !== 'string' || !element) {
          return;
        }
  
        const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
        const inNamespace = typeEvent !== originalTypeEvent;
        const events = getEvent(element);
        const isNamespace = originalTypeEvent.startsWith('.');
  
        if (typeof originalHandler !== 'undefined') {
          // Simplest case: handler is passed, remove that listener ONLY.
          if (!events || !events[typeEvent]) {
            return;
          }
  
          removeHandler(element, events, typeEvent, originalHandler, delegation ? handler : null);
          return;
        }
  
        if (isNamespace) {
          Object.keys(events).forEach(elementEvent => {
            removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
          });
        }
  
        const storeElementEvent = events[typeEvent] || {};
        Object.keys(storeElementEvent).forEach(keyHandlers => {
          const handlerKey = keyHandlers.replace(stripUidRegex, '');
  
          if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
            const event = storeElementEvent[keyHandlers];
            removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
          }
        });
      },
  
      trigger(element, event, args) {
        if (typeof event !== 'string' || !element) {
          return null;
        }
  
        const $ = getjQuery();
        const typeEvent = getTypeEvent(event);
        const inNamespace = event !== typeEvent;
        const isNative = nativeEvents.has(typeEvent);
        let jQueryEvent;
        let bubbles = true;
        let nativeDispatch = true;
        let defaultPrevented = false;
        let evt = null;
  
        if (inNamespace && $) {
          jQueryEvent = $.Event(event, args);
          $(element).trigger(jQueryEvent);
          bubbles = !jQueryEvent.isPropagationStopped();
          nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
          defaultPrevented = jQueryEvent.isDefaultPrevented();
        }
  
        if (isNative) {
          evt = document.createEvent('HTMLEvents');
          evt.initEvent(typeEvent, bubbles, true);
        } else {
          evt = new CustomEvent(event, {
            bubbles,
            cancelable: true
          });
        } // merge custom information in our event
  
  
        if (typeof args !== 'undefined') {
          Object.keys(args).forEach(key => {
            Object.defineProperty(evt, key, {
              get() {
                return args[key];
              }
  
            });
          });
        }
  
        if (defaultPrevented) {
          evt.preventDefault();
        }
  
        if (nativeDispatch) {
          element.dispatchEvent(evt);
        }
  
        if (evt.defaultPrevented && typeof jQueryEvent !== 'undefined') {
          jQueryEvent.preventDefault();
        }
  
        return evt;
      }
  
    };
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): dom/data.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
  
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    const elementMap = new Map();
    const Data = {
      set(element, key, instance) {
        if (!elementMap.has(element)) {
          elementMap.set(element, new Map());
        }
  
        const instanceMap = elementMap.get(element); // make it clear we only want one instance per element
        // can be removed later when multiple key/instances are fine to be used
  
        if (!instanceMap.has(key) && instanceMap.size !== 0) {
          // eslint-disable-next-line no-console
          console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
          return;
        }
  
        instanceMap.set(key, instance);
      },
  
      get(element, key) {
        if (elementMap.has(element)) {
          return elementMap.get(element).get(key) || null;
        }
  
        return null;
      },
  
      remove(element, key) {
        if (!elementMap.has(element)) {
          return;
        }
  
        const instanceMap = elementMap.get(element);
        instanceMap.delete(key); // free up element references if there are no instances left for an element
  
        if (instanceMap.size === 0) {
          elementMap.delete(element);
        }
      }
  
    };
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): base-component.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
  
    const VERSION = '5.1.3';
  
    class BaseComponent {
      constructor(element) {
        element = getElement(element);
  
        if (!element) {
          return;
        }
  
        this._element = element;
        Data.set(this._element, this.constructor.DATA_KEY, this);
      }
  
      dispose() {
        Data.remove(this._element, this.constructor.DATA_KEY);
        EventHandler.off(this._element, this.constructor.EVENT_KEY);
        Object.getOwnPropertyNames(this).forEach(propertyName => {
          this[propertyName] = null;
        });
      }
  
      _queueCallback(callback, element, isAnimated = true) {
        executeAfterTransition(callback, element, isAnimated);
      }
      /** Static */
  
  
      static getInstance(element) {
        return Data.get(getElement(element), this.DATA_KEY);
      }
  
      static getOrCreateInstance(element, config = {}) {
        return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null);
      }
  
      static get VERSION() {
        return VERSION;
      }
  
      static get NAME() {
        throw new Error('You have to implement the static method "NAME", for each component!');
      }
  
      static get DATA_KEY() {
        return `bs.${this.NAME}`;
      }
  
      static get EVENT_KEY() {
        return `.${this.DATA_KEY}`;
      }
  
    }
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): util/component-functions.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
  
    const enableDismissTrigger = (component, method = 'hide') => {
      const clickEvent = `click.dismiss${component.EVENT_KEY}`;
      const name = component.NAME;
      EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function (event) {
        if (['A', 'AREA'].includes(this.tagName)) {
          event.preventDefault();
        }
  
        if (isDisabled(this)) {
          return;
        }
  
        const target = getElementFromSelector(this) || this.closest(`.${name}`);
        const instance = component.getOrCreateInstance(target); // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method
  
        instance[method]();
      });
    };
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): alert.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
  
    const NAME$d = 'alert';
    const DATA_KEY$c = 'bs.alert';
    const EVENT_KEY$c = `.${DATA_KEY$c}`;
    const EVENT_CLOSE = `close${EVENT_KEY$c}`;
    const EVENT_CLOSED = `closed${EVENT_KEY$c}`;
    const CLASS_NAME_FADE$5 = 'fade';
    const CLASS_NAME_SHOW$8 = 'show';
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
  
    class Alert extends BaseComponent {
      // Getters
      static get NAME() {
        return NAME$d;
      } // Public
  
  
      close() {
        const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE);
  
        if (closeEvent.defaultPrevented) {
          return;
        }
  
        this._element.classList.remove(CLASS_NAME_SHOW$8);
  
        const isAnimated = this._element.classList.contains(CLASS_NAME_FADE$5);
  
        this._queueCallback(() => this._destroyElement(), this._element, isAnimated);
      } // Private
  
  
      _destroyElement() {
        this._element.remove();
  
        EventHandler.trigger(this._element, EVENT_CLOSED);
        this.dispose();
      } // Static
  
  
      static jQueryInterface(config) {
        return this.each(function () {
          const data = Alert.getOrCreateInstance(this);
  
          if (typeof config !== 'string') {
            return;
          }
  
          if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
            throw new TypeError(`No method named "${config}"`);
          }
  
          data[config](this);
        });
      }
  
    }
    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */
  
  
    enableDismissTrigger(Alert, 'close');
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     * add .Alert to jQuery only if jQuery is present
     */
  
    defineJQueryPlugin(Alert);
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): button.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
  
    const NAME$c = 'button';
    const DATA_KEY$b = 'bs.button';
    const EVENT_KEY$b = `.${DATA_KEY$b}`;
    const DATA_API_KEY$7 = '.data-api';
    const CLASS_NAME_ACTIVE$3 = 'active';
    const SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="button"]';
    const EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$b}${DATA_API_KEY$7}`;
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
  
    class Button extends BaseComponent {
      // Getters
      static get NAME() {
        return NAME$c;
      } // Public
  
  
      toggle() {
        // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
        this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE$3));
      } // Static
  
  
      static jQueryInterface(config) {
        return this.each(function () {
          const data = Button.getOrCreateInstance(this);
  
          if (config === 'toggle') {
            data[config]();
          }
        });
      }
  
    }
    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */
  
  
    EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$5, event => {
      event.preventDefault();
      const button = event.target.closest(SELECTOR_DATA_TOGGLE$5);
      const data = Button.getOrCreateInstance(button);
      data.toggle();
    });
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     * add .Button to jQuery only if jQuery is present
     */
  
    defineJQueryPlugin(Button);
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): dom/manipulator.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    function normalizeData(val) {
      if (val === 'true') {
        return true;
      }
  
      if (val === 'false') {
        return false;
      }
  
      if (val === Number(val).toString()) {
        return Number(val);
      }
  
      if (val === '' || val === 'null') {
        return null;
      }
  
      return val;
    }
  
    function normalizeDataKey(key) {
      return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`);
    }
  
    const Manipulator = {
      setDataAttribute(element, key, value) {
        element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
      },
  
      removeDataAttribute(element, key) {
        element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
      },
  
      getDataAttributes(element) {
        if (!element) {
          return {};
        }
  
        const attributes = {};
        Object.keys(element.dataset).filter(key => key.startsWith('bs')).forEach(key => {
          let pureKey = key.replace(/^bs/, '');
          pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
          attributes[pureKey] = normalizeData(element.dataset[key]);
        });
        return attributes;
      },
  
      getDataAttribute(element, key) {
        return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
      },
  
      offset(element) {
        const rect = element.getBoundingClientRect();
        return {
          top: rect.top + window.pageYOffset,
          left: rect.left + window.pageXOffset
        };
      },
  
      position(element) {
        return {
          top: element.offsetTop,
          left: element.offsetLeft
        };
      }
  
    };
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): dom/selector-engine.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    const NODE_TEXT = 3;
    const SelectorEngine = {
      find(selector, element = document.documentElement) {
        return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
      },
  
      findOne(selector, element = document.documentElement) {
        return Element.prototype.querySelector.call(element, selector);
      },
  
      children(element, selector) {
        return [].concat(...element.children).filter(child => child.matches(selector));
      },
  
      parents(element, selector) {
        const parents = [];
        let ancestor = element.parentNode;
  
        while (ancestor && ancestor.nodeType === Node.ELEMENT_NODE && ancestor.nodeType !== NODE_TEXT) {
          if (ancestor.matches(selector)) {
            parents.push(ancestor);
          }
  
          ancestor = ancestor.parentNode;
        }
  
        return parents;
      },
  
      prev(element, selector) {
        let previous = element.previousElementSibling;
  
        while (previous) {
          if (previous.matches(selector)) {
            return [previous];
          }
  
          previous = previous.previousElementSibling;
        }
  
        return [];
      },
  
      next(element, selector) {
        let next = element.nextElementSibling;
  
        while (next) {
          if (next.matches(selector)) {
            return [next];
          }
  
          next = next.nextElementSibling;
        }
  
        return [];
      },
  
      focusableChildren(element) {
        const focusables = ['a', 'button', 'input', 'textarea', 'select', 'details', '[tabindex]', '[contenteditable="true"]'].map(selector => `${selector}:not([tabindex^="-"])`).join(', ');
        return this.find(focusables, element).filter(el => !isDisabled(el) && isVisible(el));
      }
  
    };
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): carousel.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
  
    const NAME$b = 'carousel';
    const DATA_KEY$a = 'bs.carousel';
    const EVENT_KEY$a = `.${DATA_KEY$a}`;
    const DATA_API_KEY$6 = '.data-api';
    const ARROW_LEFT_KEY = 'ArrowLeft';
    const ARROW_RIGHT_KEY = 'ArrowRight';
    const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch
  
    const SWIPE_THRESHOLD = 40;
    const Default$a = {
      interval: 5000,
      keyboard: true,
      slide: false,
      pause: 'hover',
      wrap: true,
      touch: true
    };
    const DefaultType$a = {
      interval: '(number|boolean)',
      keyboard: 'boolean',
      slide: '(boolean|string)',
      pause: '(string|boolean)',
      wrap: 'boolean',
      touch: 'boolean'
    };
    const ORDER_NEXT = 'next';
    const ORDER_PREV = 'prev';
    const DIRECTION_LEFT = 'left';
    const DIRECTION_RIGHT = 'right';
    const KEY_TO_DIRECTION = {
      [ARROW_LEFT_KEY]: DIRECTION_RIGHT,
      [ARROW_RIGHT_KEY]: DIRECTION_LEFT
    };
    const EVENT_SLIDE = `slide${EVENT_KEY$a}`;
    const EVENT_SLID = `slid${EVENT_KEY$a}`;
    const EVENT_KEYDOWN = `keydown${EVENT_KEY$a}`;
    const EVENT_MOUSEENTER = `mouseenter${EVENT_KEY$a}`;
    const EVENT_MOUSELEAVE = `mouseleave${EVENT_KEY$a}`;
    const EVENT_TOUCHSTART = `touchstart${EVENT_KEY$a}`;
    const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$a}`;
    const EVENT_TOUCHEND = `touchend${EVENT_KEY$a}`;
    const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$a}`;
    const EVENT_POINTERUP = `pointerup${EVENT_KEY$a}`;
    const EVENT_DRAG_START = `dragstart${EVENT_KEY$a}`;
    const EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$a}${DATA_API_KEY$6}`;
    const EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$a}${DATA_API_KEY$6}`;
    const CLASS_NAME_CAROUSEL = 'carousel';
    const CLASS_NAME_ACTIVE$2 = 'active';
    const CLASS_NAME_SLIDE = 'slide';
    const CLASS_NAME_END = 'carousel-item-end';
    const CLASS_NAME_START = 'carousel-item-start';
    const CLASS_NAME_NEXT = 'carousel-item-next';
    const CLASS_NAME_PREV = 'carousel-item-prev';
    const CLASS_NAME_POINTER_EVENT = 'pointer-event';
    const SELECTOR_ACTIVE$1 = '.active';
    const SELECTOR_ACTIVE_ITEM = '.active.carousel-item';
    const SELECTOR_ITEM = '.carousel-item';
    const SELECTOR_ITEM_IMG = '.carousel-item img';
    const SELECTOR_NEXT_PREV = '.carousel-item-next, .carousel-item-prev';
    const SELECTOR_INDICATORS = '.carousel-indicators';
    const SELECTOR_INDICATOR = '[data-bs-target]';
    const SELECTOR_DATA_SLIDE = '[data-bs-slide], [data-bs-slide-to]';
    const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
    const POINTER_TYPE_TOUCH = 'touch';
    const POINTER_TYPE_PEN = 'pen';
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
  
    class Carousel extends BaseComponent {
      constructor(element, config) {
        super(element);
        this._items = null;
        this._interval = null;
        this._activeElement = null;
        this._isPaused = false;
        this._isSliding = false;
        this.touchTimeout = null;
        this.touchStartX = 0;
        this.touchDeltaX = 0;
        this._config = this._getConfig(config);
        this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);
        this._touchSupported = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
        this._pointerEvent = Boolean(window.PointerEvent);
  
        this._addEventListeners();
      } // Getters
  
  
      static get Default() {
        return Default$a;
      }
  
      static get NAME() {
        return NAME$b;
      } // Public
  
  
      next() {
        this._slide(ORDER_NEXT);
      }
  
      nextWhenVisible() {
        // Don't call next when the page isn't visible
        // or the carousel or its parent isn't visible
        if (!document.hidden && isVisible(this._element)) {
          this.next();
        }
      }
  
      prev() {
        this._slide(ORDER_PREV);
      }
  
      pause(event) {
        if (!event) {
          this._isPaused = true;
        }
  
        if (SelectorEngine.findOne(SELECTOR_NEXT_PREV, this._element)) {
          triggerTransitionEnd(this._element);
          this.cycle(true);
        }
  
        clearInterval(this._interval);
        this._interval = null;
      }
  
      cycle(event) {
        if (!event) {
          this._isPaused = false;
        }
  
        if (this._interval) {
          clearInterval(this._interval);
          this._interval = null;
        }
  
        if (this._config && this._config.interval && !this._isPaused) {
          this._updateInterval();
  
          this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval);
        }
      }
  
      to(index) {
        this._activeElement = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
  
        const activeIndex = this._getItemIndex(this._activeElement);
  
        if (index > this._items.length - 1 || index < 0) {
          return;
        }
  
        if (this._isSliding) {
          EventHandler.one(this._element, EVENT_SLID, () => this.to(index));
          return;
        }
  
        if (activeIndex === index) {
          this.pause();
          this.cycle();
          return;
        }
  
        const order = index > activeIndex ? ORDER_NEXT : ORDER_PREV;
  
        this._slide(order, this._items[index]);
      } // Private
  
  
      _getConfig(config) {
        config = { ...Default$a,
          ...Manipulator.getDataAttributes(this._element),
          ...(typeof config === 'object' ? config : {})
        };
        typeCheckConfig(NAME$b, config, DefaultType$a);
        return config;
      }
  
      _handleSwipe() {
        const absDeltax = Math.abs(this.touchDeltaX);
  
        if (absDeltax <= SWIPE_THRESHOLD) {
          return;
        }
  
        const direction = absDeltax / this.touchDeltaX;
        this.touchDeltaX = 0;
  
        if (!direction) {
          return;
        }
  
        this._slide(direction > 0 ? DIRECTION_RIGHT : DIRECTION_LEFT);
      }
  
      _addEventListeners() {
        if (this._config.keyboard) {
          EventHandler.on(this._element, EVENT_KEYDOWN, event => this._keydown(event));
        }
  
        if (this._config.pause === 'hover') {
          EventHandler.on(this._element, EVENT_MOUSEENTER, event => this.pause(event));
          EventHandler.on(this._element, EVENT_MOUSELEAVE, event => this.cycle(event));
        }
  
        if (this._config.touch && this._touchSupported) {
          this._addTouchEventListeners();
        }
      }
  
      _addTouchEventListeners() {
        const hasPointerPenTouch = event => {
          return this._pointerEvent && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH);
        };
  
        const start = event => {
          if (hasPointerPenTouch(event)) {
            this.touchStartX = event.clientX;
          } else if (!this._pointerEvent) {
            this.touchStartX = event.touches[0].clientX;
          }
        };
  
        const move = event => {
          // ensure swiping with one touch and not pinching
          this.touchDeltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this.touchStartX;
        };
  
        const end = event => {
          if (hasPointerPenTouch(event)) {
            this.touchDeltaX = event.clientX - this.touchStartX;
          }
  
          this._handleSwipe();
  
          if (this._config.pause === 'hover') {
            // If it's a touch-enabled device, mouseenter/leave are fired as
            // part of the mouse compatibility events on first tap - the carousel
            // would stop cycling until user tapped out of it;
            // here, we listen for touchend, explicitly pause the carousel
            // (as if it's the second time we tap on it, mouseenter compat event
            // is NOT fired) and after a timeout (to allow for mouse compatibility
            // events to fire) we explicitly restart cycling
            this.pause();
  
            if (this.touchTimeout) {
              clearTimeout(this.touchTimeout);
            }
  
            this.touchTimeout = setTimeout(event => this.cycle(event), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
          }
        };
  
        SelectorEngine.find(SELECTOR_ITEM_IMG, this._element).forEach(itemImg => {
          EventHandler.on(itemImg, EVENT_DRAG_START, event => event.preventDefault());
        });
  
        if (this._pointerEvent) {
          EventHandler.on(this._element, EVENT_POINTERDOWN, event => start(event));
          EventHandler.on(this._element, EVENT_POINTERUP, event => end(event));
  
          this._element.classList.add(CLASS_NAME_POINTER_EVENT);
        } else {
          EventHandler.on(this._element, EVENT_TOUCHSTART, event => start(event));
          EventHandler.on(this._element, EVENT_TOUCHMOVE, event => move(event));
          EventHandler.on(this._element, EVENT_TOUCHEND, event => end(event));
        }
      }
  
      _keydown(event) {
        if (/input|textarea/i.test(event.target.tagName)) {
          return;
        }
  
        const direction = KEY_TO_DIRECTION[event.key];
  
        if (direction) {
          event.preventDefault();
  
          this._slide(direction);
        }
      }
  
      _getItemIndex(element) {
        this._items = element && element.parentNode ? SelectorEngine.find(SELECTOR_ITEM, element.parentNode) : [];
        return this._items.indexOf(element);
      }
  
      _getItemByOrder(order, activeElement) {
        const isNext = order === ORDER_NEXT;
        return getNextActiveElement(this._items, activeElement, isNext, this._config.wrap);
      }
  
      _triggerSlideEvent(relatedTarget, eventDirectionName) {
        const targetIndex = this._getItemIndex(relatedTarget);
  
        const fromIndex = this._getItemIndex(SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element));
  
        return EventHandler.trigger(this._element, EVENT_SLIDE, {
          relatedTarget,
          direction: eventDirectionName,
          from: fromIndex,
          to: targetIndex
        });
      }
  
      _setActiveIndicatorElement(element) {
        if (this._indicatorsElement) {
          const activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE$1, this._indicatorsElement);
          activeIndicator.classList.remove(CLASS_NAME_ACTIVE$2);
          activeIndicator.removeAttribute('aria-current');
          const indicators = SelectorEngine.find(SELECTOR_INDICATOR, this._indicatorsElement);
  
          for (let i = 0; i < indicators.length; i++) {
            if (Number.parseInt(indicators[i].getAttribute('data-bs-slide-to'), 10) === this._getItemIndex(element)) {
              indicators[i].classList.add(CLASS_NAME_ACTIVE$2);
              indicators[i].setAttribute('aria-current', 'true');
              break;
            }
          }
        }
      }
  
      _updateInterval() {
        const element = this._activeElement || SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
  
        if (!element) {
          return;
        }
  
        const elementInterval = Number.parseInt(element.getAttribute('data-bs-interval'), 10);
  
        if (elementInterval) {
          this._config.defaultInterval = this._config.defaultInterval || this._config.interval;
          this._config.interval = elementInterval;
        } else {
          this._config.interval = this._config.defaultInterval || this._config.interval;
        }
      }
  
      _slide(directionOrOrder, element) {
        const order = this._directionToOrder(directionOrOrder);
  
        const activeElement = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
  
        const activeElementIndex = this._getItemIndex(activeElement);
  
        const nextElement = element || this._getItemByOrder(order, activeElement);
  
        const nextElementIndex = this._getItemIndex(nextElement);
  
        const isCycling = Boolean(this._interval);
        const isNext = order === ORDER_NEXT;
        const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
        const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;
  
        const eventDirectionName = this._orderToDirection(order);
  
        if (nextElement && nextElement.classList.contains(CLASS_NAME_ACTIVE$2)) {
          this._isSliding = false;
          return;
        }
  
        if (this._isSliding) {
          return;
        }
  
        const slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);
  
        if (slideEvent.defaultPrevented) {
          return;
        }
  
        if (!activeElement || !nextElement) {
          // Some weirdness is happening, so we bail
          return;
        }
  
        this._isSliding = true;
  
        if (isCycling) {
          this.pause();
        }
  
        this._setActiveIndicatorElement(nextElement);
  
        this._activeElement = nextElement;
  
        const triggerSlidEvent = () => {
          EventHandler.trigger(this._element, EVENT_SLID, {
            relatedTarget: nextElement,
            direction: eventDirectionName,
            from: activeElementIndex,
            to: nextElementIndex
          });
        };
  
        if (this._element.classList.contains(CLASS_NAME_SLIDE)) {
          nextElement.classList.add(orderClassName);
          reflow(nextElement);
          activeElement.classList.add(directionalClassName);
          nextElement.classList.add(directionalClassName);
  
          const completeCallBack = () => {
            nextElement.classList.remove(directionalClassName, orderClassName);
            nextElement.classList.add(CLASS_NAME_ACTIVE$2);
            activeElement.classList.remove(CLASS_NAME_ACTIVE$2, orderClassName, directionalClassName);
            this._isSliding = false;
            setTimeout(triggerSlidEvent, 0);
          };
  
          this._queueCallback(completeCallBack, activeElement, true);
        } else {
          activeElement.classList.remove(CLASS_NAME_ACTIVE$2);
          nextElement.classList.add(CLASS_NAME_ACTIVE$2);
          this._isSliding = false;
          triggerSlidEvent();
        }
  
        if (isCycling) {
          this.cycle();
        }
      }
  
      _directionToOrder(direction) {
        if (![DIRECTION_RIGHT, DIRECTION_LEFT].includes(direction)) {
          return direction;
        }
  
        if (isRTL()) {
          return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
        }
  
        return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
      }
  
      _orderToDirection(order) {
        if (![ORDER_NEXT, ORDER_PREV].includes(order)) {
          return order;
        }
  
        if (isRTL()) {
          return order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
        }
  
        return order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
      } // Static
  
  
      static carouselInterface(element, config) {
        const data = Carousel.getOrCreateInstance(element, config);
        let {
          _config
        } = data;
  
        if (typeof config === 'object') {
          _config = { ..._config,
            ...config
          };
        }
  
        const action = typeof config === 'string' ? config : _config.slide;
  
        if (typeof config === 'number') {
          data.to(config);
        } else if (typeof action === 'string') {
          if (typeof data[action] === 'undefined') {
            throw new TypeError(`No method named "${action}"`);
          }
  
          data[action]();
        } else if (_config.interval && _config.ride) {
          data.pause();
          data.cycle();
        }
      }
  
      static jQueryInterface(config) {
        return this.each(function () {
          Carousel.carouselInterface(this, config);
        });
      }
  
      static dataApiClickHandler(event) {
        const target = getElementFromSelector(this);
  
        if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
          return;
        }
  
        const config = { ...Manipulator.getDataAttributes(target),
          ...Manipulator.getDataAttributes(this)
        };
        const slideIndex = this.getAttribute('data-bs-slide-to');
  
        if (slideIndex) {
          config.interval = false;
        }
  
        Carousel.carouselInterface(target, config);
  
        if (slideIndex) {
          Carousel.getInstance(target).to(slideIndex);
        }
  
        event.preventDefault();
      }
  
    }
    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */
  
  
    EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_SLIDE, Carousel.dataApiClickHandler);
    EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
      const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);
  
      for (let i = 0, len = carousels.length; i < len; i++) {
        Carousel.carouselInterface(carousels[i], Carousel.getInstance(carousels[i]));
      }
    });
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     * add .Carousel to jQuery only if jQuery is present
     */
  
    defineJQueryPlugin(Carousel);
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): collapse.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
  
    const NAME$a = 'collapse';
    const DATA_KEY$9 = 'bs.collapse';
    const EVENT_KEY$9 = `.${DATA_KEY$9}`;
    const DATA_API_KEY$5 = '.data-api';
    const Default$9 = {
      toggle: true,
      parent: null
    };
    const DefaultType$9 = {
      toggle: 'boolean',
      parent: '(null|element)'
    };
    const EVENT_SHOW$5 = `show${EVENT_KEY$9}`;
    const EVENT_SHOWN$5 = `shown${EVENT_KEY$9}`;
    const EVENT_HIDE$5 = `hide${EVENT_KEY$9}`;
    const EVENT_HIDDEN$5 = `hidden${EVENT_KEY$9}`;
    const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$9}${DATA_API_KEY$5}`;
    const CLASS_NAME_SHOW$7 = 'show';
    const CLASS_NAME_COLLAPSE = 'collapse';
    const CLASS_NAME_COLLAPSING = 'collapsing';
    const CLASS_NAME_COLLAPSED = 'collapsed';
    const CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;
    const CLASS_NAME_HORIZONTAL = 'collapse-horizontal';
    const WIDTH = 'width';
    const HEIGHT = 'height';
    const SELECTOR_ACTIVES = '.collapse.show, .collapse.collapsing';
    const SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]';
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
  
    class Collapse extends BaseComponent {
      constructor(element, config) {
        super(element);
        this._isTransitioning = false;
        this._config = this._getConfig(config);
        this._triggerArray = [];
        const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);
  
        for (let i = 0, len = toggleList.length; i < len; i++) {
          const elem = toggleList[i];
          const selector = getSelectorFromElement(elem);
          const filterElement = SelectorEngine.find(selector).filter(foundElem => foundElem === this._element);
  
          if (selector !== null && filterElement.length) {
            this._selector = selector;
  
            this._triggerArray.push(elem);
          }
        }
  
        this._initializeChildren();
  
        if (!this._config.parent) {
          this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
        }
  
        if (this._config.toggle) {
          this.toggle();
        }
      } // Getters
  
  
      static get Default() {
        return Default$9;
      }
  
      static get NAME() {
        return NAME$a;
      } // Public
  
  
      toggle() {
        if (this._isShown()) {
          this.hide();
        } else {
          this.show();
        }
      }
  
      show() {
        if (this._isTransitioning || this._isShown()) {
          return;
        }
  
        let actives = [];
        let activesData;
  
        if (this._config.parent) {
          const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
          actives = SelectorEngine.find(SELECTOR_ACTIVES, this._config.parent).filter(elem => !children.includes(elem)); // remove children if greater depth
        }
  
        const container = SelectorEngine.findOne(this._selector);
  
        if (actives.length) {
          const tempActiveData = actives.find(elem => container !== elem);
          activesData = tempActiveData ? Collapse.getInstance(tempActiveData) : null;
  
          if (activesData && activesData._isTransitioning) {
            return;
          }
        }
  
        const startEvent = EventHandler.trigger(this._element, EVENT_SHOW$5);
  
        if (startEvent.defaultPrevented) {
          return;
        }
  
        actives.forEach(elemActive => {
          if (container !== elemActive) {
            Collapse.getOrCreateInstance(elemActive, {
              toggle: false
            }).hide();
          }
  
          if (!activesData) {
            Data.set(elemActive, DATA_KEY$9, null);
          }
        });
  
        const dimension = this._getDimension();
  
        this._element.classList.remove(CLASS_NAME_COLLAPSE);
  
        this._element.classList.add(CLASS_NAME_COLLAPSING);
  
        this._element.style[dimension] = 0;
  
        this._addAriaAndCollapsedClass(this._triggerArray, true);
  
        this._isTransitioning = true;
  
        const complete = () => {
          this._isTransitioning = false;
  
          this._element.classList.remove(CLASS_NAME_COLLAPSING);
  
          this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);
  
          this._element.style[dimension] = '';
          EventHandler.trigger(this._element, EVENT_SHOWN$5);
        };
  
        const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
        const scrollSize = `scroll${capitalizedDimension}`;
  
        this._queueCallback(complete, this._element, true);
  
        this._element.style[dimension] = `${this._element[scrollSize]}px`;
      }
  
      hide() {
        if (this._isTransitioning || !this._isShown()) {
          return;
        }
  
        const startEvent = EventHandler.trigger(this._element, EVENT_HIDE$5);
  
        if (startEvent.defaultPrevented) {
          return;
        }
  
        const dimension = this._getDimension();
  
        this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
        reflow(this._element);
  
        this._element.classList.add(CLASS_NAME_COLLAPSING);
  
        this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);
  
        const triggerArrayLength = this._triggerArray.length;
  
        for (let i = 0; i < triggerArrayLength; i++) {
          const trigger = this._triggerArray[i];
          const elem = getElementFromSelector(trigger);
  
          if (elem && !this._isShown(elem)) {
            this._addAriaAndCollapsedClass([trigger], false);
          }
        }
  
        this._isTransitioning = true;
  
        const complete = () => {
          this._isTransitioning = false;
  
          this._element.classList.remove(CLASS_NAME_COLLAPSING);
  
          this._element.classList.add(CLASS_NAME_COLLAPSE);
  
          EventHandler.trigger(this._element, EVENT_HIDDEN$5);
        };
  
        this._element.style[dimension] = '';
  
        this._queueCallback(complete, this._element, true);
      }
  
      _isShown(element = this._element) {
        return element.classList.contains(CLASS_NAME_SHOW$7);
      } // Private
  
  
      _getConfig(config) {
        config = { ...Default$9,
          ...Manipulator.getDataAttributes(this._element),
          ...config
        };
        config.toggle = Boolean(config.toggle); // Coerce string values
  
        config.parent = getElement(config.parent);
        typeCheckConfig(NAME$a, config, DefaultType$9);
        return config;
      }
  
      _getDimension() {
        return this._element.classList.contains(CLASS_NAME_HORIZONTAL) ? WIDTH : HEIGHT;
      }
  
      _initializeChildren() {
        if (!this._config.parent) {
          return;
        }
  
        const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
        SelectorEngine.find(SELECTOR_DATA_TOGGLE$4, this._config.parent).filter(elem => !children.includes(elem)).forEach(element => {
          const selected = getElementFromSelector(element);
  
          if (selected) {
            this._addAriaAndCollapsedClass([element], this._isShown(selected));
          }
        });
      }
  
      _addAriaAndCollapsedClass(triggerArray, isOpen) {
        if (!triggerArray.length) {
          return;
        }
  
        triggerArray.forEach(elem => {
          if (isOpen) {
            elem.classList.remove(CLASS_NAME_COLLAPSED);
          } else {
            elem.classList.add(CLASS_NAME_COLLAPSED);
          }
  
          elem.setAttribute('aria-expanded', isOpen);
        });
      } // Static
  
  
      static jQueryInterface(config) {
        return this.each(function () {
          const _config = {};
  
          if (typeof config === 'string' && /show|hide/.test(config)) {
            _config.toggle = false;
          }
  
          const data = Collapse.getOrCreateInstance(this, _config);
  
          if (typeof config === 'string') {
            if (typeof data[config] === 'undefined') {
              throw new TypeError(`No method named "${config}"`);
            }
  
            data[config]();
          }
        });
      }
  
    }
    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */
  
  
    EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$4, function (event) {
      // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
      if (event.target.tagName === 'A' || event.delegateTarget && event.delegateTarget.tagName === 'A') {
        event.preventDefault();
      }
  
      const selector = getSelectorFromElement(this);
      const selectorElements = SelectorEngine.find(selector);
      selectorElements.forEach(element => {
        Collapse.getOrCreateInstance(element, {
          toggle: false
        }).toggle();
      });
    });
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     * add .Collapse to jQuery only if jQuery is present
     */
  
    defineJQueryPlugin(Collapse);
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): dropdown.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
  
    const NAME$9 = 'dropdown';
    const DATA_KEY$8 = 'bs.dropdown';
    const EVENT_KEY$8 = `.${DATA_KEY$8}`;
    const DATA_API_KEY$4 = '.data-api';
    const ESCAPE_KEY$2 = 'Escape';
    const SPACE_KEY = 'Space';
    const TAB_KEY$1 = 'Tab';
    const ARROW_UP_KEY = 'ArrowUp';
    const ARROW_DOWN_KEY = 'ArrowDown';
    const RIGHT_MOUSE_BUTTON = 2; // MouseEvent.button value for the secondary button, usually the right button
  
    const REGEXP_KEYDOWN = new RegExp(`${ARROW_UP_KEY}|${ARROW_DOWN_KEY}|${ESCAPE_KEY$2}`);
    const EVENT_HIDE$4 = `hide${EVENT_KEY$8}`;
    const EVENT_HIDDEN$4 = `hidden${EVENT_KEY$8}`;
    const EVENT_SHOW$4 = `show${EVENT_KEY$8}`;
    const EVENT_SHOWN$4 = `shown${EVENT_KEY$8}`;
    const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$8}${DATA_API_KEY$4}`;
    const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$8}${DATA_API_KEY$4}`;
    const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$8}${DATA_API_KEY$4}`;
    const CLASS_NAME_SHOW$6 = 'show';
    const CLASS_NAME_DROPUP = 'dropup';
    const CLASS_NAME_DROPEND = 'dropend';
    const CLASS_NAME_DROPSTART = 'dropstart';
    const CLASS_NAME_NAVBAR = 'navbar';
    const SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]';
    const SELECTOR_MENU = '.dropdown-menu';
    const SELECTOR_NAVBAR_NAV = '.navbar-nav';
    const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
    const PLACEMENT_TOP = isRTL() ? 'top-end' : 'top-start';
    const PLACEMENT_TOPEND = isRTL() ? 'top-start' : 'top-end';
    const PLACEMENT_BOTTOM = isRTL() ? 'bottom-end' : 'bottom-start';
    const PLACEMENT_BOTTOMEND = isRTL() ? 'bottom-start' : 'bottom-end';
    const PLACEMENT_RIGHT = isRTL() ? 'left-start' : 'right-start';
    const PLACEMENT_LEFT = isRTL() ? 'right-start' : 'left-start';
    const Default$8 = {
      offset: [0, 2],
      boundary: 'clippingParents',
      reference: 'toggle',
      display: 'dynamic',
      popperConfig: null,
      autoClose: true
    };
    const DefaultType$8 = {
      offset: '(array|string|function)',
      boundary: '(string|element)',
      reference: '(string|element|object)',
      display: 'string',
      popperConfig: '(null|object|function)',
      autoClose: '(boolean|string)'
    };
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
  
    class Dropdown extends BaseComponent {
      constructor(element, config) {
        super(element);
        this._popper = null;
        this._config = this._getConfig(config);
        this._menu = this._getMenuElement();
        this._inNavbar = this._detectNavbar();
      } // Getters
  
  
      static get Default() {
        return Default$8;
      }
  
      static get DefaultType() {
        return DefaultType$8;
      }
  
      static get NAME() {
        return NAME$9;
      } // Public
  
  
      toggle() {
        return this._isShown() ? this.hide() : this.show();
      }
  
      show() {
        if (isDisabled(this._element) || this._isShown(this._menu)) {
          return;
        }
  
        const relatedTarget = {
          relatedTarget: this._element
        };
        const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$4, relatedTarget);
  
        if (showEvent.defaultPrevented) {
          return;
        }
  
        const parent = Dropdown.getParentFromElement(this._element); // Totally disable Popper for Dropdowns in Navbar
  
        if (this._inNavbar) {
          Manipulator.setDataAttribute(this._menu, 'popper', 'none');
        } else {
          this._createPopper(parent);
        } // If this is a touch-enabled device we add extra
        // empty mouseover listeners to the body's immediate children;
        // only needed because of broken event delegation on iOS
        // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
  
  
        if ('ontouchstart' in document.documentElement && !parent.closest(SELECTOR_NAVBAR_NAV)) {
          [].concat(...document.body.children).forEach(elem => EventHandler.on(elem, 'mouseover', noop));
        }
  
        this._element.focus();
  
        this._element.setAttribute('aria-expanded', true);
  
        this._menu.classList.add(CLASS_NAME_SHOW$6);
  
        this._element.classList.add(CLASS_NAME_SHOW$6);
  
        EventHandler.trigger(this._element, EVENT_SHOWN$4, relatedTarget);
      }
  
      hide() {
        if (isDisabled(this._element) || !this._isShown(this._menu)) {
          return;
        }
  
        const relatedTarget = {
          relatedTarget: this._element
        };
  
        this._completeHide(relatedTarget);
      }
  
      dispose() {
        if (this._popper) {
          this._popper.destroy();
        }
  
        super.dispose();
      }
  
      update() {
        this._inNavbar = this._detectNavbar();
  
        if (this._popper) {
          this._popper.update();
        }
      } // Private
  
  
      _completeHide(relatedTarget) {
        const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$4, relatedTarget);
  
        if (hideEvent.defaultPrevented) {
          return;
        } // If this is a touch-enabled device we remove the extra
        // empty mouseover listeners we added for iOS support
  
  
        if ('ontouchstart' in document.documentElement) {
          [].concat(...document.body.children).forEach(elem => EventHandler.off(elem, 'mouseover', noop));
        }
  
        if (this._popper) {
          this._popper.destroy();
        }
  
        this._menu.classList.remove(CLASS_NAME_SHOW$6);
  
        this._element.classList.remove(CLASS_NAME_SHOW$6);
  
        this._element.setAttribute('aria-expanded', 'false');
  
        Manipulator.removeDataAttribute(this._menu, 'popper');
        EventHandler.trigger(this._element, EVENT_HIDDEN$4, relatedTarget);
      }
  
      _getConfig(config) {
        config = { ...this.constructor.Default,
          ...Manipulator.getDataAttributes(this._element),
          ...config
        };
        typeCheckConfig(NAME$9, config, this.constructor.DefaultType);
  
        if (typeof config.reference === 'object' && !isElement(config.reference) && typeof config.reference.getBoundingClientRect !== 'function') {
          // Popper virtual elements require a getBoundingClientRect method
          throw new TypeError(`${NAME$9.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
        }
  
        return config;
      }
  
      _createPopper(parent) {
        if (typeof Popper__namespace === 'undefined') {
          throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org)');
        }
  
        let referenceElement = this._element;
  
        if (this._config.reference === 'parent') {
          referenceElement = parent;
        } else if (isElement(this._config.reference)) {
          referenceElement = getElement(this._config.reference);
        } else if (typeof this._config.reference === 'object') {
          referenceElement = this._config.reference;
        }
  
        const popperConfig = this._getPopperConfig();
  
        const isDisplayStatic = popperConfig.modifiers.find(modifier => modifier.name === 'applyStyles' && modifier.enabled === false);
        this._popper = Popper__namespace.createPopper(referenceElement, this._menu, popperConfig);
  
        if (isDisplayStatic) {
          Manipulator.setDataAttribute(this._menu, 'popper', 'static');
        }
      }
  
      _isShown(element = this._element) {
        return element.classList.contains(CLASS_NAME_SHOW$6);
      }
  
      _getMenuElement() {
        return SelectorEngine.next(this._element, SELECTOR_MENU)[0];
      }
  
      _getPlacement() {
        const parentDropdown = this._element.parentNode;
  
        if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
          return PLACEMENT_RIGHT;
        }
  
        if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
          return PLACEMENT_LEFT;
        } // We need to trim the value because custom properties can also include spaces
  
  
        const isEnd = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end';
  
        if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
          return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
        }
  
        return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
      }
  
      _detectNavbar() {
        return this._element.closest(`.${CLASS_NAME_NAVBAR}`) !== null;
      }
  
      _getOffset() {
        const {
          offset
        } = this._config;
  
        if (typeof offset === 'string') {
          return offset.split(',').map(val => Number.parseInt(val, 10));
        }
  
        if (typeof offset === 'function') {
          return popperData => offset(popperData, this._element);
        }
  
        return offset;
      }
  
      _getPopperConfig() {
        const defaultBsPopperConfig = {
          placement: this._getPlacement(),
          modifiers: [{
            name: 'preventOverflow',
            options: {
              boundary: this._config.boundary
            }
          }, {
            name: 'offset',
            options: {
              offset: this._getOffset()
            }
          }]
        }; // Disable Popper if we have a static display
  
        if (this._config.display === 'static') {
          defaultBsPopperConfig.modifiers = [{
            name: 'applyStyles',
            enabled: false
          }];
        }
  
        return { ...defaultBsPopperConfig,
          ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
        };
      }
  
      _selectMenuItem({
        key,
        target
      }) {
        const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(isVisible);
  
        if (!items.length) {
          return;
        } // if target isn't included in items (e.g. when expanding the dropdown)
        // allow cycling to get the last item in case key equals ARROW_UP_KEY
  
  
        getNextActiveElement(items, target, key === ARROW_DOWN_KEY, !items.includes(target)).focus();
      } // Static
  
  
      static jQueryInterface(config) {
        return this.each(function () {
          const data = Dropdown.getOrCreateInstance(this, config);
  
          if (typeof config !== 'string') {
            return;
          }
  
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }
  
          data[config]();
        });
      }
  
      static clearMenus(event) {
        if (event && (event.button === RIGHT_MOUSE_BUTTON || event.type === 'keyup' && event.key !== TAB_KEY$1)) {
          return;
        }
  
        const toggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE$3);
  
        for (let i = 0, len = toggles.length; i < len; i++) {
          const context = Dropdown.getInstance(toggles[i]);
  
          if (!context || context._config.autoClose === false) {
            continue;
          }
  
          if (!context._isShown()) {
            continue;
          }
  
          const relatedTarget = {
            relatedTarget: context._element
          };
  
          if (event) {
            const composedPath = event.composedPath();
            const isMenuTarget = composedPath.includes(context._menu);
  
            if (composedPath.includes(context._element) || context._config.autoClose === 'inside' && !isMenuTarget || context._config.autoClose === 'outside' && isMenuTarget) {
              continue;
            } // Tab navigation through the dropdown menu or events from contained inputs shouldn't close the menu
  
  
            if (context._menu.contains(event.target) && (event.type === 'keyup' && event.key === TAB_KEY$1 || /input|select|option|textarea|form/i.test(event.target.tagName))) {
              continue;
            }
  
            if (event.type === 'click') {
              relatedTarget.clickEvent = event;
            }
          }
  
          context._completeHide(relatedTarget);
        }
      }
  
      static getParentFromElement(element) {
        return getElementFromSelector(element) || element.parentNode;
      }
  
      static dataApiKeydownHandler(event) {
        // If not input/textarea:
        //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
        // If input/textarea:
        //  - If space key => not a dropdown command
        //  - If key is other than escape
        //    - If key is not up or down => not a dropdown command
        //    - If trigger inside the menu => not a dropdown command
        if (/input|textarea/i.test(event.target.tagName) ? event.key === SPACE_KEY || event.key !== ESCAPE_KEY$2 && (event.key !== ARROW_DOWN_KEY && event.key !== ARROW_UP_KEY || event.target.closest(SELECTOR_MENU)) : !REGEXP_KEYDOWN.test(event.key)) {
          return;
        }
  
        const isActive = this.classList.contains(CLASS_NAME_SHOW$6);
  
        if (!isActive && event.key === ESCAPE_KEY$2) {
          return;
        }
  
        event.preventDefault();
        event.stopPropagation();
  
        if (isDisabled(this)) {
          return;
        }
  
        const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE$3) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0];
        const instance = Dropdown.getOrCreateInstance(getToggleButton);
  
        if (event.key === ESCAPE_KEY$2) {
          instance.hide();
          return;
        }
  
        if (event.key === ARROW_UP_KEY || event.key === ARROW_DOWN_KEY) {
          if (!isActive) {
            instance.show();
          }
  
          instance._selectMenuItem(event);
  
          return;
        }
  
        if (!isActive || event.key === SPACE_KEY) {
          Dropdown.clearMenus();
        }
      }
  
    }
    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */
  
  
    EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown.dataApiKeydownHandler);
    EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
    EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus);
    EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
    EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function (event) {
      event.preventDefault();
      Dropdown.getOrCreateInstance(this).toggle();
    });
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     * add .Dropdown to jQuery only if jQuery is present
     */
  
    defineJQueryPlugin(Dropdown);
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): util/scrollBar.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
    const SELECTOR_STICKY_CONTENT = '.sticky-top';
  
    class ScrollBarHelper {
      constructor() {
        this._element = document.body;
      }
  
      getWidth() {
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
        const documentWidth = document.documentElement.clientWidth;
        return Math.abs(window.innerWidth - documentWidth);
      }
  
      hide() {
        const width = this.getWidth();
  
        this._disableOverFlow(); // give padding to element to balance the hidden scrollbar width
  
  
        this._setElementAttributes(this._element, 'paddingRight', calculatedValue => calculatedValue + width); // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements to keep showing fullwidth
  
  
        this._setElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight', calculatedValue => calculatedValue + width);
  
        this._setElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight', calculatedValue => calculatedValue - width);
      }
  
      _disableOverFlow() {
        this._saveInitialAttribute(this._element, 'overflow');
  
        this._element.style.overflow = 'hidden';
      }
  
      _setElementAttributes(selector, styleProp, callback) {
        const scrollbarWidth = this.getWidth();
  
        const manipulationCallBack = element => {
          if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
            return;
          }
  
          this._saveInitialAttribute(element, styleProp);
  
          const calculatedValue = window.getComputedStyle(element)[styleProp];
          element.style[styleProp] = `${callback(Number.parseFloat(calculatedValue))}px`;
        };
  
        this._applyManipulationCallback(selector, manipulationCallBack);
      }
  
      reset() {
        this._resetElementAttributes(this._element, 'overflow');
  
        this._resetElementAttributes(this._element, 'paddingRight');
  
        this._resetElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight');
  
        this._resetElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight');
      }
  
      _saveInitialAttribute(element, styleProp) {
        const actualValue = element.style[styleProp];
  
        if (actualValue) {
          Manipulator.setDataAttribute(element, styleProp, actualValue);
        }
      }
  
      _resetElementAttributes(selector, styleProp) {
        const manipulationCallBack = element => {
          const value = Manipulator.getDataAttribute(element, styleProp);
  
          if (typeof value === 'undefined') {
            element.style.removeProperty(styleProp);
          } else {
            Manipulator.removeDataAttribute(element, styleProp);
            element.style[styleProp] = value;
          }
        };
  
        this._applyManipulationCallback(selector, manipulationCallBack);
      }
  
      _applyManipulationCallback(selector, callBack) {
        if (isElement(selector)) {
          callBack(selector);
        } else {
          SelectorEngine.find(selector, this._element).forEach(callBack);
        }
      }
  
      isOverflowing() {
        return this.getWidth() > 0;
      }
  
    }
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): util/backdrop.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    const Default$7 = {
      className: 'modal-backdrop',
      isVisible: true,
      // if false, we use the backdrop helper without adding any element to the dom
      isAnimated: false,
      rootElement: 'body',
      // give the choice to place backdrop under different elements
      clickCallback: null
    };
    const DefaultType$7 = {
      className: 'string',
      isVisible: 'boolean',
      isAnimated: 'boolean',
      rootElement: '(element|string)',
      clickCallback: '(function|null)'
    };
    const NAME$8 = 'backdrop';
    const CLASS_NAME_FADE$4 = 'fade';
    const CLASS_NAME_SHOW$5 = 'show';
    const EVENT_MOUSEDOWN = `mousedown.bs.${NAME$8}`;
  
    class Backdrop {
      constructor(config) {
        this._config = this._getConfig(config);
        this._isAppended = false;
        this._element = null;
      }
  
      show(callback) {
        if (!this._config.isVisible) {
          execute(callback);
          return;
        }
  
        this._append();
  
        if (this._config.isAnimated) {
          reflow(this._getElement());
        }
  
        this._getElement().classList.add(CLASS_NAME_SHOW$5);
  
        this._emulateAnimation(() => {
          execute(callback);
        });
      }
  
      hide(callback) {
        if (!this._config.isVisible) {
          execute(callback);
          return;
        }
  
        this._getElement().classList.remove(CLASS_NAME_SHOW$5);
  
        this._emulateAnimation(() => {
          this.dispose();
          execute(callback);
        });
      } // Private
  
  
      _getElement() {
        if (!this._element) {
          const backdrop = document.createElement('div');
          backdrop.className = this._config.className;
  
          if (this._config.isAnimated) {
            backdrop.classList.add(CLASS_NAME_FADE$4);
          }
  
          this._element = backdrop;
        }
  
        return this._element;
      }
  
      _getConfig(config) {
        config = { ...Default$7,
          ...(typeof config === 'object' ? config : {})
        }; // use getElement() with the default "body" to get a fresh Element on each instantiation
  
        config.rootElement = getElement(config.rootElement);
        typeCheckConfig(NAME$8, config, DefaultType$7);
        return config;
      }
  
      _append() {
        if (this._isAppended) {
          return;
        }
  
        this._config.rootElement.append(this._getElement());
  
        EventHandler.on(this._getElement(), EVENT_MOUSEDOWN, () => {
          execute(this._config.clickCallback);
        });
        this._isAppended = true;
      }
  
      dispose() {
        if (!this._isAppended) {
          return;
        }
  
        EventHandler.off(this._element, EVENT_MOUSEDOWN);
  
        this._element.remove();
  
        this._isAppended = false;
      }
  
      _emulateAnimation(callback) {
        executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
      }
  
    }
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): util/focustrap.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    const Default$6 = {
      trapElement: null,
      // The element to trap focus inside of
      autofocus: true
    };
    const DefaultType$6 = {
      trapElement: 'element',
      autofocus: 'boolean'
    };
    const NAME$7 = 'focustrap';
    const DATA_KEY$7 = 'bs.focustrap';
    const EVENT_KEY$7 = `.${DATA_KEY$7}`;
    const EVENT_FOCUSIN$1 = `focusin${EVENT_KEY$7}`;
    const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY$7}`;
    const TAB_KEY = 'Tab';
    const TAB_NAV_FORWARD = 'forward';
    const TAB_NAV_BACKWARD = 'backward';
  
    class FocusTrap {
      constructor(config) {
        this._config = this._getConfig(config);
        this._isActive = false;
        this._lastTabNavDirection = null;
      }
  
      activate() {
        const {
          trapElement,
          autofocus
        } = this._config;
  
        if (this._isActive) {
          return;
        }
  
        if (autofocus) {
          trapElement.focus();
        }
  
        EventHandler.off(document, EVENT_KEY$7); // guard against infinite focus loop
  
        EventHandler.on(document, EVENT_FOCUSIN$1, event => this._handleFocusin(event));
        EventHandler.on(document, EVENT_KEYDOWN_TAB, event => this._handleKeydown(event));
        this._isActive = true;
      }
  
      deactivate() {
        if (!this._isActive) {
          return;
        }
  
        this._isActive = false;
        EventHandler.off(document, EVENT_KEY$7);
      } // Private
  
  
      _handleFocusin(event) {
        const {
          target
        } = event;
        const {
          trapElement
        } = this._config;
  
        if (target === document || target === trapElement || trapElement.contains(target)) {
          return;
        }
  
        const elements = SelectorEngine.focusableChildren(trapElement);
  
        if (elements.length === 0) {
          trapElement.focus();
        } else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) {
          elements[elements.length - 1].focus();
        } else {
          elements[0].focus();
        }
      }
  
      _handleKeydown(event) {
        if (event.key !== TAB_KEY) {
          return;
        }
  
        this._lastTabNavDirection = event.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD;
      }
  
      _getConfig(config) {
        config = { ...Default$6,
          ...(typeof config === 'object' ? config : {})
        };
        typeCheckConfig(NAME$7, config, DefaultType$6);
        return config;
      }
  
    }
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): modal.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
  
    const NAME$6 = 'modal';
    const DATA_KEY$6 = 'bs.modal';
    const EVENT_KEY$6 = `.${DATA_KEY$6}`;
    const DATA_API_KEY$3 = '.data-api';
    const ESCAPE_KEY$1 = 'Escape';
    const Default$5 = {
      backdrop: true,
      keyboard: true,
      focus: true
    };
    const DefaultType$5 = {
      backdrop: '(boolean|string)',
      keyboard: 'boolean',
      focus: 'boolean'
    };
    const EVENT_HIDE$3 = `hide${EVENT_KEY$6}`;
    const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY$6}`;
    const EVENT_HIDDEN$3 = `hidden${EVENT_KEY$6}`;
    const EVENT_SHOW$3 = `show${EVENT_KEY$6}`;
    const EVENT_SHOWN$3 = `shown${EVENT_KEY$6}`;
    const EVENT_RESIZE = `resize${EVENT_KEY$6}`;
    const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY$6}`;
    const EVENT_KEYDOWN_DISMISS$1 = `keydown.dismiss${EVENT_KEY$6}`;
    const EVENT_MOUSEUP_DISMISS = `mouseup.dismiss${EVENT_KEY$6}`;
    const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY$6}`;
    const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
    const CLASS_NAME_OPEN = 'modal-open';
    const CLASS_NAME_FADE$3 = 'fade';
    const CLASS_NAME_SHOW$4 = 'show';
    const CLASS_NAME_STATIC = 'modal-static';
    const OPEN_SELECTOR$1 = '.modal.show';
    const SELECTOR_DIALOG = '.modal-dialog';
    const SELECTOR_MODAL_BODY = '.modal-body';
    const SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]';
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
  
    class Modal extends BaseComponent {
      constructor(element, config) {
        super(element);
        this._config = this._getConfig(config);
        this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
        this._backdrop = this._initializeBackDrop();
        this._focustrap = this._initializeFocusTrap();
        this._isShown = false;
        this._ignoreBackdropClick = false;
        this._isTransitioning = false;
        this._scrollBar = new ScrollBarHelper();
      } // Getters
  
  
      static get Default() {
        return Default$5;
      }
  
      static get NAME() {
        return NAME$6;
      } // Public
  
  
      toggle(relatedTarget) {
        return this._isShown ? this.hide() : this.show(relatedTarget);
      }
  
      show(relatedTarget) {
        if (this._isShown || this._isTransitioning) {
          return;
        }
  
        const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$3, {
          relatedTarget
        });
  
        if (showEvent.defaultPrevented) {
          return;
        }
  
        this._isShown = true;
  
        if (this._isAnimated()) {
          this._isTransitioning = true;
        }
  
        this._scrollBar.hide();
  
        document.body.classList.add(CLASS_NAME_OPEN);
  
        this._adjustDialog();
  
        this._setEscapeEvent();
  
        this._setResizeEvent();
  
        EventHandler.on(this._dialog, EVENT_MOUSEDOWN_DISMISS, () => {
          EventHandler.one(this._element, EVENT_MOUSEUP_DISMISS, event => {
            if (event.target === this._element) {
              this._ignoreBackdropClick = true;
            }
          });
        });
  
        this._showBackdrop(() => this._showElement(relatedTarget));
      }
  
      hide() {
        if (!this._isShown || this._isTransitioning) {
          return;
        }
  
        const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$3);
  
        if (hideEvent.defaultPrevented) {
          return;
        }
  
        this._isShown = false;
  
        const isAnimated = this._isAnimated();
  
        if (isAnimated) {
          this._isTransitioning = true;
        }
  
        this._setEscapeEvent();
  
        this._setResizeEvent();
  
        this._focustrap.deactivate();
  
        this._element.classList.remove(CLASS_NAME_SHOW$4);
  
        EventHandler.off(this._element, EVENT_CLICK_DISMISS);
        EventHandler.off(this._dialog, EVENT_MOUSEDOWN_DISMISS);
  
        this._queueCallback(() => this._hideModal(), this._element, isAnimated);
      }
  
      dispose() {
        [window, this._dialog].forEach(htmlElement => EventHandler.off(htmlElement, EVENT_KEY$6));
  
        this._backdrop.dispose();
  
        this._focustrap.deactivate();
  
        super.dispose();
      }
  
      handleUpdate() {
        this._adjustDialog();
      } // Private
  
  
      _initializeBackDrop() {
        return new Backdrop({
          isVisible: Boolean(this._config.backdrop),
          // 'static' option will be translated to true, and booleans will keep their value
          isAnimated: this._isAnimated()
        });
      }
  
      _initializeFocusTrap() {
        return new FocusTrap({
          trapElement: this._element
        });
      }
  
      _getConfig(config) {
        config = { ...Default$5,
          ...Manipulator.getDataAttributes(this._element),
          ...(typeof config === 'object' ? config : {})
        };
        typeCheckConfig(NAME$6, config, DefaultType$5);
        return config;
      }
  
      _showElement(relatedTarget) {
        const isAnimated = this._isAnimated();
  
        const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);
  
        if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
          // Don't move modal's DOM position
          document.body.append(this._element);
        }
  
        this._element.style.display = 'block';
  
        this._element.removeAttribute('aria-hidden');
  
        this._element.setAttribute('aria-modal', true);
  
        this._element.setAttribute('role', 'dialog');
  
        this._element.scrollTop = 0;
  
        if (modalBody) {
          modalBody.scrollTop = 0;
        }
  
        if (isAnimated) {
          reflow(this._element);
        }
  
        this._element.classList.add(CLASS_NAME_SHOW$4);
  
        const transitionComplete = () => {
          if (this._config.focus) {
            this._focustrap.activate();
          }
  
          this._isTransitioning = false;
          EventHandler.trigger(this._element, EVENT_SHOWN$3, {
            relatedTarget
          });
        };
  
        this._queueCallback(transitionComplete, this._dialog, isAnimated);
      }
  
      _setEscapeEvent() {
        if (this._isShown) {
          EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS$1, event => {
            if (this._config.keyboard && event.key === ESCAPE_KEY$1) {
              event.preventDefault();
              this.hide();
            } else if (!this._config.keyboard && event.key === ESCAPE_KEY$1) {
              this._triggerBackdropTransition();
            }
          });
        } else {
          EventHandler.off(this._element, EVENT_KEYDOWN_DISMISS$1);
        }
      }
  
      _setResizeEvent() {
        if (this._isShown) {
          EventHandler.on(window, EVENT_RESIZE, () => this._adjustDialog());
        } else {
          EventHandler.off(window, EVENT_RESIZE);
        }
      }
  
      _hideModal() {
        this._element.style.display = 'none';
  
        this._element.setAttribute('aria-hidden', true);
  
        this._element.removeAttribute('aria-modal');
  
        this._element.removeAttribute('role');
  
        this._isTransitioning = false;
  
        this._backdrop.hide(() => {
          document.body.classList.remove(CLASS_NAME_OPEN);
  
          this._resetAdjustments();
  
          this._scrollBar.reset();
  
          EventHandler.trigger(this._element, EVENT_HIDDEN$3);
        });
      }
  
      _showBackdrop(callback) {
        EventHandler.on(this._element, EVENT_CLICK_DISMISS, event => {
          if (this._ignoreBackdropClick) {
            this._ignoreBackdropClick = false;
            return;
          }
  
          if (event.target !== event.currentTarget) {
            return;
          }
  
          if (this._config.backdrop === true) {
            this.hide();
          } else if (this._config.backdrop === 'static') {
            this._triggerBackdropTransition();
          }
        });
  
        this._backdrop.show(callback);
      }
  
      _isAnimated() {
        return this._element.classList.contains(CLASS_NAME_FADE$3);
      }
  
      _triggerBackdropTransition() {
        const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
  
        if (hideEvent.defaultPrevented) {
          return;
        }
  
        const {
          classList,
          scrollHeight,
          style
        } = this._element;
        const isModalOverflowing = scrollHeight > document.documentElement.clientHeight; // return if the following background transition hasn't yet completed
  
        if (!isModalOverflowing && style.overflowY === 'hidden' || classList.contains(CLASS_NAME_STATIC)) {
          return;
        }
  
        if (!isModalOverflowing) {
          style.overflowY = 'hidden';
        }
  
        classList.add(CLASS_NAME_STATIC);
  
        this._queueCallback(() => {
          classList.remove(CLASS_NAME_STATIC);
  
          if (!isModalOverflowing) {
            this._queueCallback(() => {
              style.overflowY = '';
            }, this._dialog);
          }
        }, this._dialog);
  
        this._element.focus();
      } // ----------------------------------------------------------------------
      // the following methods are used to handle overflowing modals
      // ----------------------------------------------------------------------
  
  
      _adjustDialog() {
        const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
  
        const scrollbarWidth = this._scrollBar.getWidth();
  
        const isBodyOverflowing = scrollbarWidth > 0;
  
        if (!isBodyOverflowing && isModalOverflowing && !isRTL() || isBodyOverflowing && !isModalOverflowing && isRTL()) {
          this._element.style.paddingLeft = `${scrollbarWidth}px`;
        }
  
        if (isBodyOverflowing && !isModalOverflowing && !isRTL() || !isBodyOverflowing && isModalOverflowing && isRTL()) {
          this._element.style.paddingRight = `${scrollbarWidth}px`;
        }
      }
  
      _resetAdjustments() {
        this._element.style.paddingLeft = '';
        this._element.style.paddingRight = '';
      } // Static
  
  
      static jQueryInterface(config, relatedTarget) {
        return this.each(function () {
          const data = Modal.getOrCreateInstance(this, config);
  
          if (typeof config !== 'string') {
            return;
          }
  
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }
  
          data[config](relatedTarget);
        });
      }
  
    }
    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */
  
  
    EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function (event) {
      const target = getElementFromSelector(this);
  
      if (['A', 'AREA'].includes(this.tagName)) {
        event.preventDefault();
      }
  
      EventHandler.one(target, EVENT_SHOW$3, showEvent => {
        if (showEvent.defaultPrevented) {
          // only register focus restorer if modal will actually get shown
          return;
        }
  
        EventHandler.one(target, EVENT_HIDDEN$3, () => {
          if (isVisible(this)) {
            this.focus();
          }
        });
      }); // avoid conflict when clicking moddal toggler while another one is open
  
      const allReadyOpen = SelectorEngine.findOne(OPEN_SELECTOR$1);
  
      if (allReadyOpen) {
        Modal.getInstance(allReadyOpen).hide();
      }
  
      const data = Modal.getOrCreateInstance(target);
      data.toggle(this);
    });
    enableDismissTrigger(Modal);
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     * add .Modal to jQuery only if jQuery is present
     */
  
    defineJQueryPlugin(Modal);
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): offcanvas.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
  
    const NAME$5 = 'offcanvas';
    const DATA_KEY$5 = 'bs.offcanvas';
    const EVENT_KEY$5 = `.${DATA_KEY$5}`;
    const DATA_API_KEY$2 = '.data-api';
    const EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$5}${DATA_API_KEY$2}`;
    const ESCAPE_KEY = 'Escape';
    const Default$4 = {
      backdrop: true,
      keyboard: true,
      scroll: false
    };
    const DefaultType$4 = {
      backdrop: 'boolean',
      keyboard: 'boolean',
      scroll: 'boolean'
    };
    const CLASS_NAME_SHOW$3 = 'show';
    const CLASS_NAME_BACKDROP = 'offcanvas-backdrop';
    const OPEN_SELECTOR = '.offcanvas.show';
    const EVENT_SHOW$2 = `show${EVENT_KEY$5}`;
    const EVENT_SHOWN$2 = `shown${EVENT_KEY$5}`;
    const EVENT_HIDE$2 = `hide${EVENT_KEY$5}`;
    const EVENT_HIDDEN$2 = `hidden${EVENT_KEY$5}`;
    const EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$5}${DATA_API_KEY$2}`;
    const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY$5}`;
    const SELECTOR_DATA_TOGGLE$1 = '[data-bs-toggle="offcanvas"]';
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
  
    class Offcanvas extends BaseComponent {
      constructor(element, config) {
        super(element);
        this._config = this._getConfig(config);
        this._isShown = false;
        this._backdrop = this._initializeBackDrop();
        this._focustrap = this._initializeFocusTrap();
  
        this._addEventListeners();
      } // Getters
  
  
      static get NAME() {
        return NAME$5;
      }
  
      static get Default() {
        return Default$4;
      } // Public
  
  
      toggle(relatedTarget) {
        return this._isShown ? this.hide() : this.show(relatedTarget);
      }
  
      show(relatedTarget) {
        if (this._isShown) {
          return;
        }
  
        const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$2, {
          relatedTarget
        });
  
        if (showEvent.defaultPrevented) {
          return;
        }
  
        this._isShown = true;
        this._element.style.visibility = 'visible';
  
        this._backdrop.show();
  
        if (!this._config.scroll) {
          new ScrollBarHelper().hide();
        }
  
        this._element.removeAttribute('aria-hidden');
  
        this._element.setAttribute('aria-modal', true);
  
        this._element.setAttribute('role', 'dialog');
  
        this._element.classList.add(CLASS_NAME_SHOW$3);
  
        const completeCallBack = () => {
          if (!this._config.scroll) {
            this._focustrap.activate();
          }
  
          EventHandler.trigger(this._element, EVENT_SHOWN$2, {
            relatedTarget
          });
        };
  
        this._queueCallback(completeCallBack, this._element, true);
      }
  
      hide() {
        if (!this._isShown) {
          return;
        }
  
        const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$2);
  
        if (hideEvent.defaultPrevented) {
          return;
        }
  
        this._focustrap.deactivate();
  
        this._element.blur();
  
        this._isShown = false;
  
        this._element.classList.remove(CLASS_NAME_SHOW$3);
  
        this._backdrop.hide();
  
        const completeCallback = () => {
          this._element.setAttribute('aria-hidden', true);
  
          this._element.removeAttribute('aria-modal');
  
          this._element.removeAttribute('role');
  
          this._element.style.visibility = 'hidden';
  
          if (!this._config.scroll) {
            new ScrollBarHelper().reset();
          }
  
          EventHandler.trigger(this._element, EVENT_HIDDEN$2);
        };
  
        this._queueCallback(completeCallback, this._element, true);
      }
  
      dispose() {
        this._backdrop.dispose();
  
        this._focustrap.deactivate();
  
        super.dispose();
      } // Private
  
  
      _getConfig(config) {
        config = { ...Default$4,
          ...Manipulator.getDataAttributes(this._element),
          ...(typeof config === 'object' ? config : {})
        };
        typeCheckConfig(NAME$5, config, DefaultType$4);
        return config;
      }
  
      _initializeBackDrop() {
        return new Backdrop({
          className: CLASS_NAME_BACKDROP,
          isVisible: this._config.backdrop,
          isAnimated: true,
          rootElement: this._element.parentNode,
          clickCallback: () => this.hide()
        });
      }
  
      _initializeFocusTrap() {
        return new FocusTrap({
          trapElement: this._element
        });
      }
  
      _addEventListeners() {
        EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, event => {
          if (this._config.keyboard && event.key === ESCAPE_KEY) {
            this.hide();
          }
        });
      } // Static
  
  
      static jQueryInterface(config) {
        return this.each(function () {
          const data = Offcanvas.getOrCreateInstance(this, config);
  
          if (typeof config !== 'string') {
            return;
          }
  
          if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
            throw new TypeError(`No method named "${config}"`);
          }
  
          data[config](this);
        });
      }
  
    }
    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */
  
  
    EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function (event) {
      const target = getElementFromSelector(this);
  
      if (['A', 'AREA'].includes(this.tagName)) {
        event.preventDefault();
      }
  
      if (isDisabled(this)) {
        return;
      }
  
      EventHandler.one(target, EVENT_HIDDEN$2, () => {
        // focus on trigger when it is closed
        if (isVisible(this)) {
          this.focus();
        }
      }); // avoid conflict when clicking a toggler of an offcanvas, while another is open
  
      const allReadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);
  
      if (allReadyOpen && allReadyOpen !== target) {
        Offcanvas.getInstance(allReadyOpen).hide();
      }
  
      const data = Offcanvas.getOrCreateInstance(target);
      data.toggle(this);
    });
    EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => SelectorEngine.find(OPEN_SELECTOR).forEach(el => Offcanvas.getOrCreateInstance(el).show()));
    enableDismissTrigger(Offcanvas);
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */
  
    defineJQueryPlugin(Offcanvas);
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): util/sanitizer.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    const uriAttributes = new Set(['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href']);
    const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
    /**
     * A pattern that recognizes a commonly useful subset of URLs that are safe.
     *
     * Shoutout to Angular https://github.com/angular/angular/blob/12.2.x/packages/core/src/sanitization/url_sanitizer.ts
     */
  
    const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^#&/:?]*(?:[#/?]|$))/i;
    /**
     * A pattern that matches safe data URLs. Only matches image, video and audio types.
     *
     * Shoutout to Angular https://github.com/angular/angular/blob/12.2.x/packages/core/src/sanitization/url_sanitizer.ts
     */
  
    const DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i;
  
    const allowedAttribute = (attribute, allowedAttributeList) => {
      const attributeName = attribute.nodeName.toLowerCase();
  
      if (allowedAttributeList.includes(attributeName)) {
        if (uriAttributes.has(attributeName)) {
          return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue) || DATA_URL_PATTERN.test(attribute.nodeValue));
        }
  
        return true;
      }
  
      const regExp = allowedAttributeList.filter(attributeRegex => attributeRegex instanceof RegExp); // Check if a regular expression validates the attribute.
  
      for (let i = 0, len = regExp.length; i < len; i++) {
        if (regExp[i].test(attributeName)) {
          return true;
        }
      }
  
      return false;
    };
  
    const DefaultAllowlist = {
      // Global attributes allowed on any supplied element below.
      '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
      a: ['target', 'href', 'title', 'rel'],
      area: [],
      b: [],
      br: [],
      col: [],
      code: [],
      div: [],
      em: [],
      hr: [],
      h1: [],
      h2: [],
      h3: [],
      h4: [],
      h5: [],
      h6: [],
      i: [],
      img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
      li: [],
      ol: [],
      p: [],
      pre: [],
      s: [],
      small: [],
      span: [],
      sub: [],
      sup: [],
      strong: [],
      u: [],
      ul: []
    };
    function sanitizeHtml(unsafeHtml, allowList, sanitizeFn) {
      if (!unsafeHtml.length) {
        return unsafeHtml;
      }
  
      if (sanitizeFn && typeof sanitizeFn === 'function') {
        return sanitizeFn(unsafeHtml);
      }
  
      const domParser = new window.DOMParser();
      const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
      const elements = [].concat(...createdDocument.body.querySelectorAll('*'));
  
      for (let i = 0, len = elements.length; i < len; i++) {
        const element = elements[i];
        const elementName = element.nodeName.toLowerCase();
  
        if (!Object.keys(allowList).includes(elementName)) {
          element.remove();
          continue;
        }
  
        const attributeList = [].concat(...element.attributes);
        const allowedAttributes = [].concat(allowList['*'] || [], allowList[elementName] || []);
        attributeList.forEach(attribute => {
          if (!allowedAttribute(attribute, allowedAttributes)) {
            element.removeAttribute(attribute.nodeName);
          }
        });
      }
  
      return createdDocument.body.innerHTML;
    }
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): tooltip.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
  
    const NAME$4 = 'tooltip';
    const DATA_KEY$4 = 'bs.tooltip';
    const EVENT_KEY$4 = `.${DATA_KEY$4}`;
    const CLASS_PREFIX$1 = 'bs-tooltip';
    const DISALLOWED_ATTRIBUTES = new Set(['sanitize', 'allowList', 'sanitizeFn']);
    const DefaultType$3 = {
      animation: 'boolean',
      template: 'string',
      title: '(string|element|function)',
      trigger: 'string',
      delay: '(number|object)',
      html: 'boolean',
      selector: '(string|boolean)',
      placement: '(string|function)',
      offset: '(array|string|function)',
      container: '(string|element|boolean)',
      fallbackPlacements: 'array',
      boundary: '(string|element)',
      customClass: '(string|function)',
      sanitize: 'boolean',
      sanitizeFn: '(null|function)',
      allowList: 'object',
      popperConfig: '(null|object|function)'
    };
    const AttachmentMap = {
      AUTO: 'auto',
      TOP: 'top',
      RIGHT: isRTL() ? 'left' : 'right',
      BOTTOM: 'bottom',
      LEFT: isRTL() ? 'right' : 'left'
    };
    const Default$3 = {
      animation: true,
      template: '<div class="tooltip" role="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-inner"></div>' + '</div>',
      trigger: 'hover focus',
      title: '',
      delay: 0,
      html: false,
      selector: false,
      placement: 'top',
      offset: [0, 0],
      container: false,
      fallbackPlacements: ['top', 'right', 'bottom', 'left'],
      boundary: 'clippingParents',
      customClass: '',
      sanitize: true,
      sanitizeFn: null,
      allowList: DefaultAllowlist,
      popperConfig: null
    };
    const Event$2 = {
      HIDE: `hide${EVENT_KEY$4}`,
      HIDDEN: `hidden${EVENT_KEY$4}`,
      SHOW: `show${EVENT_KEY$4}`,
      SHOWN: `shown${EVENT_KEY$4}`,
      INSERTED: `inserted${EVENT_KEY$4}`,
      CLICK: `click${EVENT_KEY$4}`,
      FOCUSIN: `focusin${EVENT_KEY$4}`,
      FOCUSOUT: `focusout${EVENT_KEY$4}`,
      MOUSEENTER: `mouseenter${EVENT_KEY$4}`,
      MOUSELEAVE: `mouseleave${EVENT_KEY$4}`
    };
    const CLASS_NAME_FADE$2 = 'fade';
    const CLASS_NAME_MODAL = 'modal';
    const CLASS_NAME_SHOW$2 = 'show';
    const HOVER_STATE_SHOW = 'show';
    const HOVER_STATE_OUT = 'out';
    const SELECTOR_TOOLTIP_INNER = '.tooltip-inner';
    const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`;
    const EVENT_MODAL_HIDE = 'hide.bs.modal';
    const TRIGGER_HOVER = 'hover';
    const TRIGGER_FOCUS = 'focus';
    const TRIGGER_CLICK = 'click';
    const TRIGGER_MANUAL = 'manual';
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
  
    class Tooltip extends BaseComponent {
      constructor(element, config) {
        if (typeof Popper__namespace === 'undefined') {
          throw new TypeError('Bootstrap\'s tooltips require Popper (https://popper.js.org)');
        }
  
        super(element); // private
  
        this._isEnabled = true;
        this._timeout = 0;
        this._hoverState = '';
        this._activeTrigger = {};
        this._popper = null; // Protected
  
        this._config = this._getConfig(config);
        this.tip = null;
  
        this._setListeners();
      } // Getters
  
  
      static get Default() {
        return Default$3;
      }
  
      static get NAME() {
        return NAME$4;
      }
  
      static get Event() {
        return Event$2;
      }
  
      static get DefaultType() {
        return DefaultType$3;
      } // Public
  
  
      enable() {
        this._isEnabled = true;
      }
  
      disable() {
        this._isEnabled = false;
      }
  
      toggleEnabled() {
        this._isEnabled = !this._isEnabled;
      }
  
      toggle(event) {
        if (!this._isEnabled) {
          return;
        }
  
        if (event) {
          const context = this._initializeOnDelegatedTarget(event);
  
          context._activeTrigger.click = !context._activeTrigger.click;
  
          if (context._isWithActiveTrigger()) {
            context._enter(null, context);
          } else {
            context._leave(null, context);
          }
        } else {
          if (this.getTipElement().classList.contains(CLASS_NAME_SHOW$2)) {
            this._leave(null, this);
  
            return;
          }
  
          this._enter(null, this);
        }
      }
  
      dispose() {
        clearTimeout(this._timeout);
        EventHandler.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
  
        if (this.tip) {
          this.tip.remove();
        }
  
        this._disposePopper();
  
        super.dispose();
      }
  
      show() {
        if (this._element.style.display === 'none') {
          throw new Error('Please use show on visible elements');
        }
  
        if (!(this.isWithContent() && this._isEnabled)) {
          return;
        }
  
        const showEvent = EventHandler.trigger(this._element, this.constructor.Event.SHOW);
        const shadowRoot = findShadowRoot(this._element);
        const isInTheDom = shadowRoot === null ? this._element.ownerDocument.documentElement.contains(this._element) : shadowRoot.contains(this._element);
  
        if (showEvent.defaultPrevented || !isInTheDom) {
          return;
        } // A trick to recreate a tooltip in case a new title is given by using the NOT documented `data-bs-original-title`
        // This will be removed later in favor of a `setContent` method
  
  
        if (this.constructor.NAME === 'tooltip' && this.tip && this.getTitle() !== this.tip.querySelector(SELECTOR_TOOLTIP_INNER).innerHTML) {
          this._disposePopper();
  
          this.tip.remove();
          this.tip = null;
        }
  
        const tip = this.getTipElement();
        const tipId = getUID(this.constructor.NAME);
        tip.setAttribute('id', tipId);
  
        this._element.setAttribute('aria-describedby', tipId);
  
        if (this._config.animation) {
          tip.classList.add(CLASS_NAME_FADE$2);
        }
  
        const placement = typeof this._config.placement === 'function' ? this._config.placement.call(this, tip, this._element) : this._config.placement;
  
        const attachment = this._getAttachment(placement);
  
        this._addAttachmentClass(attachment);
  
        const {
          container
        } = this._config;
        Data.set(tip, this.constructor.DATA_KEY, this);
  
        if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
          container.append(tip);
          EventHandler.trigger(this._element, this.constructor.Event.INSERTED);
        }
  
        if (this._popper) {
          this._popper.update();
        } else {
          this._popper = Popper__namespace.createPopper(this._element, tip, this._getPopperConfig(attachment));
        }
  
        tip.classList.add(CLASS_NAME_SHOW$2);
  
        const customClass = this._resolvePossibleFunction(this._config.customClass);
  
        if (customClass) {
          tip.classList.add(...customClass.split(' '));
        } // If this is a touch-enabled device we add extra
        // empty mouseover listeners to the body's immediate children;
        // only needed because of broken event delegation on iOS
        // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
  
  
        if ('ontouchstart' in document.documentElement) {
          [].concat(...document.body.children).forEach(element => {
            EventHandler.on(element, 'mouseover', noop);
          });
        }
  
        const complete = () => {
          const prevHoverState = this._hoverState;
          this._hoverState = null;
          EventHandler.trigger(this._element, this.constructor.Event.SHOWN);
  
          if (prevHoverState === HOVER_STATE_OUT) {
            this._leave(null, this);
          }
        };
  
        const isAnimated = this.tip.classList.contains(CLASS_NAME_FADE$2);
  
        this._queueCallback(complete, this.tip, isAnimated);
      }
  
      hide() {
        if (!this._popper) {
          return;
        }
  
        const tip = this.getTipElement();
  
        const complete = () => {
          if (this._isWithActiveTrigger()) {
            return;
          }
  
          if (this._hoverState !== HOVER_STATE_SHOW) {
            tip.remove();
          }
  
          this._cleanTipClass();
  
          this._element.removeAttribute('aria-describedby');
  
          EventHandler.trigger(this._element, this.constructor.Event.HIDDEN);
  
          this._disposePopper();
        };
  
        const hideEvent = EventHandler.trigger(this._element, this.constructor.Event.HIDE);
  
        if (hideEvent.defaultPrevented) {
          return;
        }
  
        tip.classList.remove(CLASS_NAME_SHOW$2); // If this is a touch-enabled device we remove the extra
        // empty mouseover listeners we added for iOS support
  
        if ('ontouchstart' in document.documentElement) {
          [].concat(...document.body.children).forEach(element => EventHandler.off(element, 'mouseover', noop));
        }
  
        this._activeTrigger[TRIGGER_CLICK] = false;
        this._activeTrigger[TRIGGER_FOCUS] = false;
        this._activeTrigger[TRIGGER_HOVER] = false;
        const isAnimated = this.tip.classList.contains(CLASS_NAME_FADE$2);
  
        this._queueCallback(complete, this.tip, isAnimated);
  
        this._hoverState = '';
      }
  
      update() {
        if (this._popper !== null) {
          this._popper.update();
        }
      } // Protected
  
  
      isWithContent() {
        return Boolean(this.getTitle());
      }
  
      getTipElement() {
        if (this.tip) {
          return this.tip;
        }
  
        const element = document.createElement('div');
        element.innerHTML = this._config.template;
        const tip = element.children[0];
        this.setContent(tip);
        tip.classList.remove(CLASS_NAME_FADE$2, CLASS_NAME_SHOW$2);
        this.tip = tip;
        return this.tip;
      }
  
      setContent(tip) {
        this._sanitizeAndSetContent(tip, this.getTitle(), SELECTOR_TOOLTIP_INNER);
      }
  
      _sanitizeAndSetContent(template, content, selector) {
        const templateElement = SelectorEngine.findOne(selector, template);
  
        if (!content && templateElement) {
          templateElement.remove();
          return;
        } // we use append for html objects to maintain js events
  
  
        this.setElementContent(templateElement, content);
      }
  
      setElementContent(element, content) {
        if (element === null) {
          return;
        }
  
        if (isElement(content)) {
          content = getElement(content); // content is a DOM node or a jQuery
  
          if (this._config.html) {
            if (content.parentNode !== element) {
              element.innerHTML = '';
              element.append(content);
            }
          } else {
            element.textContent = content.textContent;
          }
  
          return;
        }
  
        if (this._config.html) {
          if (this._config.sanitize) {
            content = sanitizeHtml(content, this._config.allowList, this._config.sanitizeFn);
          }
  
          element.innerHTML = content;
        } else {
          element.textContent = content;
        }
      }
  
      getTitle() {
        const title = this._element.getAttribute('data-bs-original-title') || this._config.title;
  
        return this._resolvePossibleFunction(title);
      }
  
      updateAttachment(attachment) {
        if (attachment === 'right') {
          return 'end';
        }
  
        if (attachment === 'left') {
          return 'start';
        }
  
        return attachment;
      } // Private
  
  
      _initializeOnDelegatedTarget(event, context) {
        return context || this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig());
      }
  
      _getOffset() {
        const {
          offset
        } = this._config;
  
        if (typeof offset === 'string') {
          return offset.split(',').map(val => Number.parseInt(val, 10));
        }
  
        if (typeof offset === 'function') {
          return popperData => offset(popperData, this._element);
        }
  
        return offset;
      }
  
      _resolvePossibleFunction(content) {
        return typeof content === 'function' ? content.call(this._element) : content;
      }
  
      _getPopperConfig(attachment) {
        const defaultBsPopperConfig = {
          placement: attachment,
          modifiers: [{
            name: 'flip',
            options: {
              fallbackPlacements: this._config.fallbackPlacements
            }
          }, {
            name: 'offset',
            options: {
              offset: this._getOffset()
            }
          }, {
            name: 'preventOverflow',
            options: {
              boundary: this._config.boundary
            }
          }, {
            name: 'arrow',
            options: {
              element: `.${this.constructor.NAME}-arrow`
            }
          }, {
            name: 'onChange',
            enabled: true,
            phase: 'afterWrite',
            fn: data => this._handlePopperPlacementChange(data)
          }],
          onFirstUpdate: data => {
            if (data.options.placement !== data.placement) {
              this._handlePopperPlacementChange(data);
            }
          }
        };
        return { ...defaultBsPopperConfig,
          ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
        };
      }
  
      _addAttachmentClass(attachment) {
        this.getTipElement().classList.add(`${this._getBasicClassPrefix()}-${this.updateAttachment(attachment)}`);
      }
  
      _getAttachment(placement) {
        return AttachmentMap[placement.toUpperCase()];
      }
  
      _setListeners() {
        const triggers = this._config.trigger.split(' ');
  
        triggers.forEach(trigger => {
          if (trigger === 'click') {
            EventHandler.on(this._element, this.constructor.Event.CLICK, this._config.selector, event => this.toggle(event));
          } else if (trigger !== TRIGGER_MANUAL) {
            const eventIn = trigger === TRIGGER_HOVER ? this.constructor.Event.MOUSEENTER : this.constructor.Event.FOCUSIN;
            const eventOut = trigger === TRIGGER_HOVER ? this.constructor.Event.MOUSELEAVE : this.constructor.Event.FOCUSOUT;
            EventHandler.on(this._element, eventIn, this._config.selector, event => this._enter(event));
            EventHandler.on(this._element, eventOut, this._config.selector, event => this._leave(event));
          }
        });
  
        this._hideModalHandler = () => {
          if (this._element) {
            this.hide();
          }
        };
  
        EventHandler.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
  
        if (this._config.selector) {
          this._config = { ...this._config,
            trigger: 'manual',
            selector: ''
          };
        } else {
          this._fixTitle();
        }
      }
  
      _fixTitle() {
        const title = this._element.getAttribute('title');
  
        const originalTitleType = typeof this._element.getAttribute('data-bs-original-title');
  
        if (title || originalTitleType !== 'string') {
          this._element.setAttribute('data-bs-original-title', title || '');
  
          if (title && !this._element.getAttribute('aria-label') && !this._element.textContent) {
            this._element.setAttribute('aria-label', title);
          }
  
          this._element.setAttribute('title', '');
        }
      }
  
      _enter(event, context) {
        context = this._initializeOnDelegatedTarget(event, context);
  
        if (event) {
          context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
        }
  
        if (context.getTipElement().classList.contains(CLASS_NAME_SHOW$2) || context._hoverState === HOVER_STATE_SHOW) {
          context._hoverState = HOVER_STATE_SHOW;
          return;
        }
  
        clearTimeout(context._timeout);
        context._hoverState = HOVER_STATE_SHOW;
  
        if (!context._config.delay || !context._config.delay.show) {
          context.show();
          return;
        }
  
        context._timeout = setTimeout(() => {
          if (context._hoverState === HOVER_STATE_SHOW) {
            context.show();
          }
        }, context._config.delay.show);
      }
  
      _leave(event, context) {
        context = this._initializeOnDelegatedTarget(event, context);
  
        if (event) {
          context._activeTrigger[event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget);
        }
  
        if (context._isWithActiveTrigger()) {
          return;
        }
  
        clearTimeout(context._timeout);
        context._hoverState = HOVER_STATE_OUT;
  
        if (!context._config.delay || !context._config.delay.hide) {
          context.hide();
          return;
        }
  
        context._timeout = setTimeout(() => {
          if (context._hoverState === HOVER_STATE_OUT) {
            context.hide();
          }
        }, context._config.delay.hide);
      }
  
      _isWithActiveTrigger() {
        for (const trigger in this._activeTrigger) {
          if (this._activeTrigger[trigger]) {
            return true;
          }
        }
  
        return false;
      }
  
      _getConfig(config) {
        const dataAttributes = Manipulator.getDataAttributes(this._element);
        Object.keys(dataAttributes).forEach(dataAttr => {
          if (DISALLOWED_ATTRIBUTES.has(dataAttr)) {
            delete dataAttributes[dataAttr];
          }
        });
        config = { ...this.constructor.Default,
          ...dataAttributes,
          ...(typeof config === 'object' && config ? config : {})
        };
        config.container = config.container === false ? document.body : getElement(config.container);
  
        if (typeof config.delay === 'number') {
          config.delay = {
            show: config.delay,
            hide: config.delay
          };
        }
  
        if (typeof config.title === 'number') {
          config.title = config.title.toString();
        }
  
        if (typeof config.content === 'number') {
          config.content = config.content.toString();
        }
  
        typeCheckConfig(NAME$4, config, this.constructor.DefaultType);
  
        if (config.sanitize) {
          config.template = sanitizeHtml(config.template, config.allowList, config.sanitizeFn);
        }
  
        return config;
      }
  
      _getDelegateConfig() {
        const config = {};
  
        for (const key in this._config) {
          if (this.constructor.Default[key] !== this._config[key]) {
            config[key] = this._config[key];
          }
        } // In the future can be replaced with:
        // const keysWithDifferentValues = Object.entries(this._config).filter(entry => this.constructor.Default[entry[0]] !== this._config[entry[0]])
        // `Object.fromEntries(keysWithDifferentValues)`
  
  
        return config;
      }
  
      _cleanTipClass() {
        const tip = this.getTipElement();
        const basicClassPrefixRegex = new RegExp(`(^|\\s)${this._getBasicClassPrefix()}\\S+`, 'g');
        const tabClass = tip.getAttribute('class').match(basicClassPrefixRegex);
  
        if (tabClass !== null && tabClass.length > 0) {
          tabClass.map(token => token.trim()).forEach(tClass => tip.classList.remove(tClass));
        }
      }
  
      _getBasicClassPrefix() {
        return CLASS_PREFIX$1;
      }
  
      _handlePopperPlacementChange(popperData) {
        const {
          state
        } = popperData;
  
        if (!state) {
          return;
        }
  
        this.tip = state.elements.popper;
  
        this._cleanTipClass();
  
        this._addAttachmentClass(this._getAttachment(state.placement));
      }
  
      _disposePopper() {
        if (this._popper) {
          this._popper.destroy();
  
          this._popper = null;
        }
      } // Static
  
  
      static jQueryInterface(config) {
        return this.each(function () {
          const data = Tooltip.getOrCreateInstance(this, config);
  
          if (typeof config === 'string') {
            if (typeof data[config] === 'undefined') {
              throw new TypeError(`No method named "${config}"`);
            }
  
            data[config]();
          }
        });
      }
  
    }
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     * add .Tooltip to jQuery only if jQuery is present
     */
  
  
    defineJQueryPlugin(Tooltip);
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): popover.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
  
    const NAME$3 = 'popover';
    const DATA_KEY$3 = 'bs.popover';
    const EVENT_KEY$3 = `.${DATA_KEY$3}`;
    const CLASS_PREFIX = 'bs-popover';
    const Default$2 = { ...Tooltip.Default,
      placement: 'right',
      offset: [0, 8],
      trigger: 'click',
      content: '',
      template: '<div class="popover" role="tooltip">' + '<div class="popover-arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div>' + '</div>'
    };
    const DefaultType$2 = { ...Tooltip.DefaultType,
      content: '(string|element|function)'
    };
    const Event$1 = {
      HIDE: `hide${EVENT_KEY$3}`,
      HIDDEN: `hidden${EVENT_KEY$3}`,
      SHOW: `show${EVENT_KEY$3}`,
      SHOWN: `shown${EVENT_KEY$3}`,
      INSERTED: `inserted${EVENT_KEY$3}`,
      CLICK: `click${EVENT_KEY$3}`,
      FOCUSIN: `focusin${EVENT_KEY$3}`,
      FOCUSOUT: `focusout${EVENT_KEY$3}`,
      MOUSEENTER: `mouseenter${EVENT_KEY$3}`,
      MOUSELEAVE: `mouseleave${EVENT_KEY$3}`
    };
    const SELECTOR_TITLE = '.popover-header';
    const SELECTOR_CONTENT = '.popover-body';
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
  
    class Popover extends Tooltip {
      // Getters
      static get Default() {
        return Default$2;
      }
  
      static get NAME() {
        return NAME$3;
      }
  
      static get Event() {
        return Event$1;
      }
  
      static get DefaultType() {
        return DefaultType$2;
      } // Overrides
  
  
      isWithContent() {
        return this.getTitle() || this._getContent();
      }
  
      setContent(tip) {
        this._sanitizeAndSetContent(tip, this.getTitle(), SELECTOR_TITLE);
  
        this._sanitizeAndSetContent(tip, this._getContent(), SELECTOR_CONTENT);
      } // Private
  
  
      _getContent() {
        return this._resolvePossibleFunction(this._config.content);
      }
  
      _getBasicClassPrefix() {
        return CLASS_PREFIX;
      } // Static
  
  
      static jQueryInterface(config) {
        return this.each(function () {
          const data = Popover.getOrCreateInstance(this, config);
  
          if (typeof config === 'string') {
            if (typeof data[config] === 'undefined') {
              throw new TypeError(`No method named "${config}"`);
            }
  
            data[config]();
          }
        });
      }
  
    }
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     * add .Popover to jQuery only if jQuery is present
     */
  
  
    defineJQueryPlugin(Popover);
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): scrollspy.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
  
    const NAME$2 = 'scrollspy';
    const DATA_KEY$2 = 'bs.scrollspy';
    const EVENT_KEY$2 = `.${DATA_KEY$2}`;
    const DATA_API_KEY$1 = '.data-api';
    const Default$1 = {
      offset: 10,
      method: 'auto',
      target: ''
    };
    const DefaultType$1 = {
      offset: 'number',
      method: 'string',
      target: '(string|element)'
    };
    const EVENT_ACTIVATE = `activate${EVENT_KEY$2}`;
    const EVENT_SCROLL = `scroll${EVENT_KEY$2}`;
    const EVENT_LOAD_DATA_API = `load${EVENT_KEY$2}${DATA_API_KEY$1}`;
    const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
    const CLASS_NAME_ACTIVE$1 = 'active';
    const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
    const SELECTOR_NAV_LIST_GROUP$1 = '.nav, .list-group';
    const SELECTOR_NAV_LINKS = '.nav-link';
    const SELECTOR_NAV_ITEMS = '.nav-item';
    const SELECTOR_LIST_ITEMS = '.list-group-item';
    const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}, .${CLASS_NAME_DROPDOWN_ITEM}`;
    const SELECTOR_DROPDOWN$1 = '.dropdown';
    const SELECTOR_DROPDOWN_TOGGLE$1 = '.dropdown-toggle';
    const METHOD_OFFSET = 'offset';
    const METHOD_POSITION = 'position';
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
  
    class ScrollSpy extends BaseComponent {
      constructor(element, config) {
        super(element);
        this._scrollElement = this._element.tagName === 'BODY' ? window : this._element;
        this._config = this._getConfig(config);
        this._offsets = [];
        this._targets = [];
        this._activeTarget = null;
        this._scrollHeight = 0;
        EventHandler.on(this._scrollElement, EVENT_SCROLL, () => this._process());
        this.refresh();
  
        this._process();
      } // Getters
  
  
      static get Default() {
        return Default$1;
      }
  
      static get NAME() {
        return NAME$2;
      } // Public
  
  
      refresh() {
        const autoMethod = this._scrollElement === this._scrollElement.window ? METHOD_OFFSET : METHOD_POSITION;
        const offsetMethod = this._config.method === 'auto' ? autoMethod : this._config.method;
        const offsetBase = offsetMethod === METHOD_POSITION ? this._getScrollTop() : 0;
        this._offsets = [];
        this._targets = [];
        this._scrollHeight = this._getScrollHeight();
        const targets = SelectorEngine.find(SELECTOR_LINK_ITEMS, this._config.target);
        targets.map(element => {
          const targetSelector = getSelectorFromElement(element);
          const target = targetSelector ? SelectorEngine.findOne(targetSelector) : null;
  
          if (target) {
            const targetBCR = target.getBoundingClientRect();
  
            if (targetBCR.width || targetBCR.height) {
              return [Manipulator[offsetMethod](target).top + offsetBase, targetSelector];
            }
          }
  
          return null;
        }).filter(item => item).sort((a, b) => a[0] - b[0]).forEach(item => {
          this._offsets.push(item[0]);
  
          this._targets.push(item[1]);
        });
      }
  
      dispose() {
        EventHandler.off(this._scrollElement, EVENT_KEY$2);
        super.dispose();
      } // Private
  
  
      _getConfig(config) {
        config = { ...Default$1,
          ...Manipulator.getDataAttributes(this._element),
          ...(typeof config === 'object' && config ? config : {})
        };
        config.target = getElement(config.target) || document.documentElement;
        typeCheckConfig(NAME$2, config, DefaultType$1);
        return config;
      }
  
      _getScrollTop() {
        return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
      }
  
      _getScrollHeight() {
        return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      }
  
      _getOffsetHeight() {
        return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
      }
  
      _process() {
        const scrollTop = this._getScrollTop() + this._config.offset;
  
        const scrollHeight = this._getScrollHeight();
  
        const maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();
  
        if (this._scrollHeight !== scrollHeight) {
          this.refresh();
        }
  
        if (scrollTop >= maxScroll) {
          const target = this._targets[this._targets.length - 1];
  
          if (this._activeTarget !== target) {
            this._activate(target);
          }
  
          return;
        }
  
        if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
          this._activeTarget = null;
  
          this._clear();
  
          return;
        }
  
        for (let i = this._offsets.length; i--;) {
          const isActiveTarget = this._activeTarget !== this._targets[i] && scrollTop >= this._offsets[i] && (typeof this._offsets[i + 1] === 'undefined' || scrollTop < this._offsets[i + 1]);
  
          if (isActiveTarget) {
            this._activate(this._targets[i]);
          }
        }
      }
  
      _activate(target) {
        this._activeTarget = target;
  
        this._clear();
  
        const queries = SELECTOR_LINK_ITEMS.split(',').map(selector => `${selector}[data-bs-target="${target}"],${selector}[href="${target}"]`);
        const link = SelectorEngine.findOne(queries.join(','), this._config.target);
        link.classList.add(CLASS_NAME_ACTIVE$1);
  
        if (link.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
          SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1, link.closest(SELECTOR_DROPDOWN$1)).classList.add(CLASS_NAME_ACTIVE$1);
        } else {
          SelectorEngine.parents(link, SELECTOR_NAV_LIST_GROUP$1).forEach(listGroup => {
            // Set triggered links parents as active
            // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
            SelectorEngine.prev(listGroup, `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`).forEach(item => item.classList.add(CLASS_NAME_ACTIVE$1)); // Handle special case when .nav-link is inside .nav-item
  
            SelectorEngine.prev(listGroup, SELECTOR_NAV_ITEMS).forEach(navItem => {
              SelectorEngine.children(navItem, SELECTOR_NAV_LINKS).forEach(item => item.classList.add(CLASS_NAME_ACTIVE$1));
            });
          });
        }
  
        EventHandler.trigger(this._scrollElement, EVENT_ACTIVATE, {
          relatedTarget: target
        });
      }
  
      _clear() {
        SelectorEngine.find(SELECTOR_LINK_ITEMS, this._config.target).filter(node => node.classList.contains(CLASS_NAME_ACTIVE$1)).forEach(node => node.classList.remove(CLASS_NAME_ACTIVE$1));
      } // Static
  
  
      static jQueryInterface(config) {
        return this.each(function () {
          const data = ScrollSpy.getOrCreateInstance(this, config);
  
          if (typeof config !== 'string') {
            return;
          }
  
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }
  
          data[config]();
        });
      }
  
    }
    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */
  
  
    EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
      SelectorEngine.find(SELECTOR_DATA_SPY).forEach(spy => new ScrollSpy(spy));
    });
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     * add .ScrollSpy to jQuery only if jQuery is present
     */
  
    defineJQueryPlugin(ScrollSpy);
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): tab.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
  
    const NAME$1 = 'tab';
    const DATA_KEY$1 = 'bs.tab';
    const EVENT_KEY$1 = `.${DATA_KEY$1}`;
    const DATA_API_KEY = '.data-api';
    const EVENT_HIDE$1 = `hide${EVENT_KEY$1}`;
    const EVENT_HIDDEN$1 = `hidden${EVENT_KEY$1}`;
    const EVENT_SHOW$1 = `show${EVENT_KEY$1}`;
    const EVENT_SHOWN$1 = `shown${EVENT_KEY$1}`;
    const EVENT_CLICK_DATA_API = `click${EVENT_KEY$1}${DATA_API_KEY}`;
    const CLASS_NAME_DROPDOWN_MENU = 'dropdown-menu';
    const CLASS_NAME_ACTIVE = 'active';
    const CLASS_NAME_FADE$1 = 'fade';
    const CLASS_NAME_SHOW$1 = 'show';
    const SELECTOR_DROPDOWN = '.dropdown';
    const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
    const SELECTOR_ACTIVE = '.active';
    const SELECTOR_ACTIVE_UL = ':scope > li > .active';
    const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]';
    const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
    const SELECTOR_DROPDOWN_ACTIVE_CHILD = ':scope > .dropdown-menu .active';
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
  
    class Tab extends BaseComponent {
      // Getters
      static get NAME() {
        return NAME$1;
      } // Public
  
  
      show() {
        if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && this._element.classList.contains(CLASS_NAME_ACTIVE)) {
          return;
        }
  
        let previous;
        const target = getElementFromSelector(this._element);
  
        const listElement = this._element.closest(SELECTOR_NAV_LIST_GROUP);
  
        if (listElement) {
          const itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL' ? SELECTOR_ACTIVE_UL : SELECTOR_ACTIVE;
          previous = SelectorEngine.find(itemSelector, listElement);
          previous = previous[previous.length - 1];
        }
  
        const hideEvent = previous ? EventHandler.trigger(previous, EVENT_HIDE$1, {
          relatedTarget: this._element
        }) : null;
        const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$1, {
          relatedTarget: previous
        });
  
        if (showEvent.defaultPrevented || hideEvent !== null && hideEvent.defaultPrevented) {
          return;
        }
  
        this._activate(this._element, listElement);
  
        const complete = () => {
          EventHandler.trigger(previous, EVENT_HIDDEN$1, {
            relatedTarget: this._element
          });
          EventHandler.trigger(this._element, EVENT_SHOWN$1, {
            relatedTarget: previous
          });
        };
  
        if (target) {
          this._activate(target, target.parentNode, complete);
        } else {
          complete();
        }
      } // Private
  
  
      _activate(element, container, callback) {
        const activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL') ? SelectorEngine.find(SELECTOR_ACTIVE_UL, container) : SelectorEngine.children(container, SELECTOR_ACTIVE);
        const active = activeElements[0];
        const isTransitioning = callback && active && active.classList.contains(CLASS_NAME_FADE$1);
  
        const complete = () => this._transitionComplete(element, active, callback);
  
        if (active && isTransitioning) {
          active.classList.remove(CLASS_NAME_SHOW$1);
  
          this._queueCallback(complete, element, true);
        } else {
          complete();
        }
      }
  
      _transitionComplete(element, active, callback) {
        if (active) {
          active.classList.remove(CLASS_NAME_ACTIVE);
          const dropdownChild = SelectorEngine.findOne(SELECTOR_DROPDOWN_ACTIVE_CHILD, active.parentNode);
  
          if (dropdownChild) {
            dropdownChild.classList.remove(CLASS_NAME_ACTIVE);
          }
  
          if (active.getAttribute('role') === 'tab') {
            active.setAttribute('aria-selected', false);
          }
        }
  
        element.classList.add(CLASS_NAME_ACTIVE);
  
        if (element.getAttribute('role') === 'tab') {
          element.setAttribute('aria-selected', true);
        }
  
        reflow(element);
  
        if (element.classList.contains(CLASS_NAME_FADE$1)) {
          element.classList.add(CLASS_NAME_SHOW$1);
        }
  
        let parent = element.parentNode;
  
        if (parent && parent.nodeName === 'LI') {
          parent = parent.parentNode;
        }
  
        if (parent && parent.classList.contains(CLASS_NAME_DROPDOWN_MENU)) {
          const dropdownElement = element.closest(SELECTOR_DROPDOWN);
  
          if (dropdownElement) {
            SelectorEngine.find(SELECTOR_DROPDOWN_TOGGLE, dropdownElement).forEach(dropdown => dropdown.classList.add(CLASS_NAME_ACTIVE));
          }
  
          element.setAttribute('aria-expanded', true);
        }
  
        if (callback) {
          callback();
        }
      } // Static
  
  
      static jQueryInterface(config) {
        return this.each(function () {
          const data = Tab.getOrCreateInstance(this);
  
          if (typeof config === 'string') {
            if (typeof data[config] === 'undefined') {
              throw new TypeError(`No method named "${config}"`);
            }
  
            data[config]();
          }
        });
      }
  
    }
    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */
  
  
    EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
      if (['A', 'AREA'].includes(this.tagName)) {
        event.preventDefault();
      }
  
      if (isDisabled(this)) {
        return;
      }
  
      const data = Tab.getOrCreateInstance(this);
      data.show();
    });
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     * add .Tab to jQuery only if jQuery is present
     */
  
    defineJQueryPlugin(Tab);
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): toast.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
  
    const NAME = 'toast';
    const DATA_KEY = 'bs.toast';
    const EVENT_KEY = `.${DATA_KEY}`;
    const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`;
    const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`;
    const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
    const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
    const EVENT_HIDE = `hide${EVENT_KEY}`;
    const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
    const EVENT_SHOW = `show${EVENT_KEY}`;
    const EVENT_SHOWN = `shown${EVENT_KEY}`;
    const CLASS_NAME_FADE = 'fade';
    const CLASS_NAME_HIDE = 'hide'; // @deprecated - kept here only for backwards compatibility
  
    const CLASS_NAME_SHOW = 'show';
    const CLASS_NAME_SHOWING = 'showing';
    const DefaultType = {
      animation: 'boolean',
      autohide: 'boolean',
      delay: 'number'
    };
    const Default = {
      animation: true,
      autohide: true,
      delay: 5000
    };
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
  
    class Toast extends BaseComponent {
      constructor(element, config) {
        super(element);
        this._config = this._getConfig(config);
        this._timeout = null;
        this._hasMouseInteraction = false;
        this._hasKeyboardInteraction = false;
  
        this._setListeners();
      } // Getters
  
  
      static get DefaultType() {
        return DefaultType;
      }
  
      static get Default() {
        return Default;
      }
  
      static get NAME() {
        return NAME;
      } // Public
  
  
      show() {
        const showEvent = EventHandler.trigger(this._element, EVENT_SHOW);
  
        if (showEvent.defaultPrevented) {
          return;
        }
  
        this._clearTimeout();
  
        if (this._config.animation) {
          this._element.classList.add(CLASS_NAME_FADE);
        }
  
        const complete = () => {
          this._element.classList.remove(CLASS_NAME_SHOWING);
  
          EventHandler.trigger(this._element, EVENT_SHOWN);
  
          this._maybeScheduleHide();
        };
  
        this._element.classList.remove(CLASS_NAME_HIDE); // @deprecated
  
  
        reflow(this._element);
  
        this._element.classList.add(CLASS_NAME_SHOW);
  
        this._element.classList.add(CLASS_NAME_SHOWING);
  
        this._queueCallback(complete, this._element, this._config.animation);
      }
  
      hide() {
        if (!this._element.classList.contains(CLASS_NAME_SHOW)) {
          return;
        }
  
        const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);
  
        if (hideEvent.defaultPrevented) {
          return;
        }
  
        const complete = () => {
          this._element.classList.add(CLASS_NAME_HIDE); // @deprecated
  
  
          this._element.classList.remove(CLASS_NAME_SHOWING);
  
          this._element.classList.remove(CLASS_NAME_SHOW);
  
          EventHandler.trigger(this._element, EVENT_HIDDEN);
        };
  
        this._element.classList.add(CLASS_NAME_SHOWING);
  
        this._queueCallback(complete, this._element, this._config.animation);
      }
  
      dispose() {
        this._clearTimeout();
  
        if (this._element.classList.contains(CLASS_NAME_SHOW)) {
          this._element.classList.remove(CLASS_NAME_SHOW);
        }
  
        super.dispose();
      } // Private
  
  
      _getConfig(config) {
        config = { ...Default,
          ...Manipulator.getDataAttributes(this._element),
          ...(typeof config === 'object' && config ? config : {})
        };
        typeCheckConfig(NAME, config, this.constructor.DefaultType);
        return config;
      }
  
      _maybeScheduleHide() {
        if (!this._config.autohide) {
          return;
        }
  
        if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
          return;
        }
  
        this._timeout = setTimeout(() => {
          this.hide();
        }, this._config.delay);
      }
  
      _onInteraction(event, isInteracting) {
        switch (event.type) {
          case 'mouseover':
          case 'mouseout':
            this._hasMouseInteraction = isInteracting;
            break;
  
          case 'focusin':
          case 'focusout':
            this._hasKeyboardInteraction = isInteracting;
            break;
        }
  
        if (isInteracting) {
          this._clearTimeout();
  
          return;
        }
  
        const nextElement = event.relatedTarget;
  
        if (this._element === nextElement || this._element.contains(nextElement)) {
          return;
        }
  
        this._maybeScheduleHide();
      }
  
      _setListeners() {
        EventHandler.on(this._element, EVENT_MOUSEOVER, event => this._onInteraction(event, true));
        EventHandler.on(this._element, EVENT_MOUSEOUT, event => this._onInteraction(event, false));
        EventHandler.on(this._element, EVENT_FOCUSIN, event => this._onInteraction(event, true));
        EventHandler.on(this._element, EVENT_FOCUSOUT, event => this._onInteraction(event, false));
      }
  
      _clearTimeout() {
        clearTimeout(this._timeout);
        this._timeout = null;
      } // Static
  
  
      static jQueryInterface(config) {
        return this.each(function () {
          const data = Toast.getOrCreateInstance(this, config);
  
          if (typeof config === 'string') {
            if (typeof data[config] === 'undefined') {
              throw new TypeError(`No method named "${config}"`);
            }
  
            data[config](this);
          }
        });
      }
  
    }
  
    enableDismissTrigger(Toast);
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     * add .Toast to jQuery only if jQuery is present
     */
  
    defineJQueryPlugin(Toast);
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): index.umd.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    const index_umd = {
      Alert,
      Button,
      Carousel,
      Collapse,
      Dropdown,
      Modal,
      Offcanvas,
      Popover,
      ScrollSpy,
      Tab,
      Toast,
      Tooltip
    };
  
    return index_umd;
  
  }));
  //# sourceMappingURL=bootstrap.js.map
  
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under the MIT license
 */
if ("undefined" == typeof jQuery) throw new Error("Bootstrap's JavaScript requires jQuery"); + function(a) {
    "use strict";
    var b = a.fn.jquery.split(" ")[0].split(".");
    if (b[0] < 2 && b[1] < 9 || 1 == b[0] && 9 == b[1] && b[2] < 1) throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher")
}(jQuery), + function(a) {
    "use strict";

    function b() {
        var a = document.createElement("bootstrap"),
            b = {
                WebkitTransition: "webkitTransitionEnd",
                MozTransition: "transitionend",
                OTransition: "oTransitionEnd otransitionend",
                transition: "transitionend"
            };
        for (var c in b)
            if (void 0 !== a.style[c]) return {
                end: b[c]
            };
        return !1
    }
    a.fn.emulateTransitionEnd = function(b) {
        var c = !1,
            d = this;
        a(this).one("bsTransitionEnd", function() {
            c = !0
        });
        var e = function() {
            c || a(d).trigger(a.support.transition.end)
        };
        return setTimeout(e, b), this
    }, a(function() {
        a.support.transition = b(), a.support.transition && (a.event.special.bsTransitionEnd = {
            bindType: a.support.transition.end,
            delegateType: a.support.transition.end,
            handle: function(b) {
                return a(b.target).is(this) ? b.handleObj.handler.apply(this, arguments) : void 0
            }
        })
    })/*!
  * Bootstrap v5.1.3 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@popperjs/core')) :
    typeof define === 'function' && define.amd ? define(['@popperjs/core'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.bootstrap = factory(global.Popper));
  })(this, (function (Popper) { 'use strict';
  
    function _interopNamespace(e) {
      if (e && e.__esModule) return e;
      const n = Object.create(null);
      if (e) {
        for (const k in e) {
          if (k !== 'default') {
            const d = Object.getOwnPropertyDescriptor(e, k);
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: () => e[k]
            });
          }
        }
      }
      n.default = e;
      return Object.freeze(n);
    }
  
    const Popper__namespace = /*#__PURE__*/_interopNamespace(Popper);
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): util/index.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    const MAX_UID = 1000000;
    const MILLISECONDS_MULTIPLIER = 1000;
    const TRANSITION_END = 'transitionend'; // Shoutout AngusCroll (https://goo.gl/pxwQGp)
  
    const toType = obj => {
      if (obj === null || obj === undefined) {
        return `${obj}`;
      }
  
      return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
    };
    /**
     * --------------------------------------------------------------------------
     * Public Util Api
     * --------------------------------------------------------------------------
     */
  
  
    const getUID = prefix => {
      do {
        prefix += Math.floor(Math.random() * MAX_UID);
      } while (document.getElementById(prefix));
  
      return prefix;
    };
  
    const getSelector = element => {
      let selector = element.getAttribute('data-bs-target');
  
      if (!selector || selector === '#') {
        let hrefAttr = element.getAttribute('href'); // The only valid content that could double as a selector are IDs or classes,
        // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
        // `document.querySelector` will rightfully complain it is invalid.
        // See https://github.com/twbs/bootstrap/issues/32273
  
        if (!hrefAttr || !hrefAttr.includes('#') && !hrefAttr.startsWith('.')) {
          return null;
        } // Just in case some CMS puts out a full URL with the anchor appended
  
  
        if (hrefAttr.includes('#') && !hrefAttr.startsWith('#')) {
          hrefAttr = `#${hrefAttr.split('#')[1]}`;
        }
  
        selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null;
      }
  
      return selector;
    };
  
    const getSelectorFromElement = element => {
      const selector = getSelector(element);
  
      if (selector) {
        return document.querySelector(selector) ? selector : null;
      }
  
      return null;
    };
  
    const getElementFromSelector = element => {
      const selector = getSelector(element);
      return selector ? document.querySelector(selector) : null;
    };
  
    const getTransitionDurationFromElement = element => {
      if (!element) {
        return 0;
      } // Get transition-duration of the element
  
  
      let {
        transitionDuration,
        transitionDelay
      } = window.getComputedStyle(element);
      const floatTransitionDuration = Number.parseFloat(transitionDuration);
      const floatTransitionDelay = Number.parseFloat(transitionDelay); // Return 0 if element or transition duration is not found
  
      if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0;
      } // If multiple durations are defined, take the first
  
  
      transitionDuration = transitionDuration.split(',')[0];
      transitionDelay = transitionDelay.split(',')[0];
      return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
    };
  
    const triggerTransitionEnd = element => {
      element.dispatchEvent(new Event(TRANSITION_END));
    };
  
    const isElement = obj => {
      if (!obj || typeof obj !== 'object') {
        return false;
      }
  
      if (typeof obj.jquery !== 'undefined') {
        obj = obj[0];
      }
  
      return typeof obj.nodeType !== 'undefined';
    };
  
    const getElement = obj => {
      if (isElement(obj)) {
        // it's a jQuery object or a node element
        return obj.jquery ? obj[0] : obj;
      }
  
      if (typeof obj === 'string' && obj.length > 0) {
        return document.querySelector(obj);
      }
  
      return null;
    };
  
    const typeCheckConfig = (componentName, config, configTypes) => {
      Object.keys(configTypes).forEach(property => {
        const expectedTypes = configTypes[property];
        const value = config[property];
        const valueType = value && isElement(value) ? 'element' : toType(value);
  
        if (!new RegExp(expectedTypes).test(valueType)) {
          throw new TypeError(`${componentName.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
        }
      });
    };
  
    const isVisible = element => {
      if (!isElement(element) || element.getClientRects().length === 0) {
        return false;
      }
  
      return getComputedStyle(element).getPropertyValue('visibility') === 'visible';
    };
  
    const isDisabled = element => {
      if (!element || element.nodeType !== Node.ELEMENT_NODE) {
        return true;
      }
  
      if (element.classList.contains('disabled')) {
        return true;
      }
  
      if (typeof element.disabled !== 'undefined') {
        return element.disabled;
      }
  
      return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
    };
  
    const findShadowRoot = element => {
      if (!document.documentElement.attachShadow) {
        return null;
      } // Can find the shadow root otherwise it'll return the document
  
  
      if (typeof element.getRootNode === 'function') {
        const root = element.getRootNode();
        return root instanceof ShadowRoot ? root : null;
      }
  
      if (element instanceof ShadowRoot) {
        return element;
      } // when we don't find a shadow root
  
  
      if (!element.parentNode) {
        return null;
      }
  
      return findShadowRoot(element.parentNode);
    };
  
    const noop = () => {};
    /**
     * Trick to restart an element's animation
     *
     * @param {HTMLElement} element
     * @return void
     *
     * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
     */
  
  
    const reflow = element => {
      // eslint-disable-next-line no-unused-expressions
      element.offsetHeight;
    };
  
    const getjQuery = () => {
      const {
        jQuery
      } = window;
  
      if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
        return jQuery;
      }
  
      return null;
    };
  
    const DOMContentLoadedCallbacks = [];
  
    const onDOMContentLoaded = callback => {
      if (document.readyState === 'loading') {
        // add listener on the first call when the document is in loading state
        if (!DOMContentLoadedCallbacks.length) {
          document.addEventListener('DOMContentLoaded', () => {
            DOMContentLoadedCallbacks.forEach(callback => callback());
          });
        }
  
        DOMContentLoadedCallbacks.push(callback);
      } else {
        callback();
      }
    };
  
    const isRTL = () => document.documentElement.dir === 'rtl';
  
    const defineJQueryPlugin = plugin => {
      onDOMContentLoaded(() => {
        const $ = getjQuery();
        /* istanbul ignore if */
  
        if ($) {
          const name = plugin.NAME;
          const JQUERY_NO_CONFLICT = $.fn[name];
          $.fn[name] = plugin.jQueryInterface;
          $.fn[name].Constructor = plugin;
  
          $.fn[name].noConflict = () => {
            $.fn[name] = JQUERY_NO_CONFLICT;
            return plugin.jQueryInterface;
          };
        }
      });
    };
  
    const execute = callback => {
      if (typeof callback === 'function') {
        callback();
      }
    };
  
    const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
      if (!waitForTransition) {
        execute(callback);
        return;
      }
  
      const durationPadding = 5;
      const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
      let called = false;
  
      const handler = ({
        target
      }) => {
        if (target !== transitionElement) {
          return;
        }
  
        called = true;
        transitionElement.removeEventListener(TRANSITION_END, handler);
        execute(callback);
      };
  
      transitionElement.addEventListener(TRANSITION_END, handler);
      setTimeout(() => {
        if (!called) {
          triggerTransitionEnd(transitionElement);
        }
      }, emulatedDuration);
    };
    /**
     * Return the previous/next element of a list.
     *
     * @param {array} list    The list of elements
     * @param activeElement   The active element
     * @param shouldGetNext   Choose to get next or previous element
     * @param isCycleAllowed
     * @return {Element|elem} The proper element
     */
  
  
    const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
      let index = list.indexOf(activeElement); // if the element does not exist in the list return an element depending on the direction and if cycle is allowed
  
      if (index === -1) {
        return list[!shouldGetNext && isCycleAllowed ? list.length - 1 : 0];
      }
  
      const listLength = list.length;
      index += shouldGetNext ? 1 : -1;
  
      if (isCycleAllowed) {
        index = (index + listLength) % listLength;
      }
  
      return list[Math.max(0, Math.min(index, listLength - 1))];
    };
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): dom/event-handler.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
  
    const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
    const stripNameRegex = /\..*/;
    const stripUidRegex = /::\d+$/;
    const eventRegistry = {}; // Events storage
  
    let uidEvent = 1;
    const customEvents = {
      mouseenter: 'mouseover',
      mouseleave: 'mouseout'
    };
    const customEventsRegex = /^(mouseenter|mouseleave)/i;
    const nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);
    /**
     * ------------------------------------------------------------------------
     * Private methods
     * ------------------------------------------------------------------------
     */
  
    function getUidEvent(element, uid) {
      return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
    }
  
    function getEvent(element) {
      const uid = getUidEvent(element);
      element.uidEvent = uid;
      eventRegistry[uid] = eventRegistry[uid] || {};
      return eventRegistry[uid];
    }
  
    function bootstrapHandler(element, fn) {
      return function handler(event) {
        event.delegateTarget = element;
  
        if (handler.oneOff) {
          EventHandler.off(element, event.type, fn);
        }
  
        return fn.apply(element, [event]);
      };
    }
  
    function bootstrapDelegationHandler(element, selector, fn) {
      return function handler(event) {
        const domElements = element.querySelectorAll(selector);
  
        for (let {
          target
        } = event; target && target !== this; target = target.parentNode) {
          for (let i = domElements.length; i--;) {
            if (domElements[i] === target) {
              event.delegateTarget = target;
  
              if (handler.oneOff) {
                EventHandler.off(element, event.type, selector, fn);
              }
  
              return fn.apply(target, [event]);
            }
          }
        } // To please ESLint
  
  
        return null;
      };
    }
  
    function findHandler(events, handler, delegationSelector = null) {
      const uidEventList = Object.keys(events);
  
      for (let i = 0, len = uidEventList.length; i < len; i++) {
        const event = events[uidEventList[i]];
  
        if (event.originalHandler === handler && event.delegationSelector === delegationSelector) {
          return event;
        }
      }
  
      return null;
    }
  
    function normalizeParams(originalTypeEvent, handler, delegationFn) {
      const delegation = typeof handler === 'string';
      const originalHandler = delegation ? delegationFn : handler;
      let typeEvent = getTypeEvent(originalTypeEvent);
      const isNative = nativeEvents.has(typeEvent);
  
      if (!isNative) {
        typeEvent = originalTypeEvent;
      }
  
      return [delegation, originalHandler, typeEvent];
    }
  
    function addHandler(element, originalTypeEvent, handler, delegationFn, oneOff) {
      if (typeof originalTypeEvent !== 'string' || !element) {
        return;
      }
  
      if (!handler) {
        handler = delegationFn;
        delegationFn = null;
      } // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
      // this prevents the handler from being dispatched the same way as mouseover or mouseout does
  
  
      if (customEventsRegex.test(originalTypeEvent)) {
        const wrapFn = fn => {
          return function (event) {
            if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
              return fn.call(this, event);
            }
          };
        };
  
        if (delegationFn) {
          delegationFn = wrapFn(delegationFn);
        } else {
          handler = wrapFn(handler);
        }
      }
  
      const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
      const events = getEvent(element);
      const handlers = events[typeEvent] || (events[typeEvent] = {});
      const previousFn = findHandler(handlers, originalHandler, delegation ? handler : null);
  
      if (previousFn) {
        previousFn.oneOff = previousFn.oneOff && oneOff;
        return;
      }
  
      const uid = getUidEvent(originalHandler, originalTypeEvent.replace(namespaceRegex, ''));
      const fn = delegation ? bootstrapDelegationHandler(element, handler, delegationFn) : bootstrapHandler(element, handler);
      fn.delegationSelector = delegation ? handler : null;
      fn.originalHandler = originalHandler;
      fn.oneOff = oneOff;
      fn.uidEvent = uid;
      handlers[uid] = fn;
      element.addEventListener(typeEvent, fn, delegation);
    }
  
    function removeHandler(element, events, typeEvent, handler, delegationSelector) {
      const fn = findHandler(events[typeEvent], handler, delegationSelector);
  
      if (!fn) {
        return;
      }
  
      element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
      delete events[typeEvent][fn.uidEvent];
    }
  
    function removeNamespacedHandlers(element, events, typeEvent, namespace) {
      const storeElementEvent = events[typeEvent] || {};
      Object.keys(storeElementEvent).forEach(handlerKey => {
        if (handlerKey.includes(namespace)) {
          const event = storeElementEvent[handlerKey];
          removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
        }
      });
    }
  
    function getTypeEvent(event) {
      // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
      event = event.replace(stripNameRegex, '');
      return customEvents[event] || event;
    }
  
    const EventHandler = {
      on(element, event, handler, delegationFn) {
        addHandler(element, event, handler, delegationFn, false);
      },
  
      one(element, event, handler, delegationFn) {
        addHandler(element, event, handler, delegationFn, true);
      },
  
      off(element, originalTypeEvent, handler, delegationFn) {
        if (typeof originalTypeEvent !== 'string' || !element) {
          return;
        }
  
        const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
        const inNamespace = typeEvent !== originalTypeEvent;
        const events = getEvent(element);
        const isNamespace = originalTypeEvent.startsWith('.');
  
        if (typeof originalHandler !== 'undefined') {
          // Simplest case: handler is passed, remove that listener ONLY.
          if (!events || !events[typeEvent]) {
            return;
          }
  
          removeHandler(element, events, typeEvent, originalHandler, delegation ? handler : null);
          return;
        }
  
        if (isNamespace) {
          Object.keys(events).forEach(elementEvent => {
            removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
          });
        }
  
        const storeElementEvent = events[typeEvent] || {};
        Object.keys(storeElementEvent).forEach(keyHandlers => {
          const handlerKey = keyHandlers.replace(stripUidRegex, '');
  
          if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
            const event = storeElementEvent[keyHandlers];
            removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
          }
        });
      },
  
      trigger(element, event, args) {
        if (typeof event !== 'string' || !element) {
          return null;
        }
  
        const $ = getjQuery();
        const typeEvent = getTypeEvent(event);
        const inNamespace = event !== typeEvent;
        const isNative = nativeEvents.has(typeEvent);
        let jQueryEvent;
        let bubbles = true;
        let nativeDispatch = true;
        let defaultPrevented = false;
        let evt = null;
  
        if (inNamespace && $) {
          jQueryEvent = $.Event(event, args);
          $(element).trigger(jQueryEvent);
          bubbles = !jQueryEvent.isPropagationStopped();
          nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
          defaultPrevented = jQueryEvent.isDefaultPrevented();
        }
  
        if (isNative) {
          evt = document.createEvent('HTMLEvents');
          evt.initEvent(typeEvent, bubbles, true);
        } else {
          evt = new CustomEvent(event, {
            bubbles,
            cancelable: true
          });
        } // merge custom information in our event
  
  
        if (typeof args !== 'undefined') {
          Object.keys(args).forEach(key => {
            Object.defineProperty(evt, key, {
              get() {
                return args[key];
              }
  
            });
          });
        }
  
        if (defaultPrevented) {
          evt.preventDefault();
        }
  
        if (nativeDispatch) {
          element.dispatchEvent(evt);
        }
  
        if (evt.defaultPrevented && typeof jQueryEvent !== 'undefined') {
          jQueryEvent.preventDefault();
        }
  
        return evt;
      }
  
    };
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): dom/data.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
  
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    const elementMap = new Map();
    const Data = {
      set(element, key, instance) {
        if (!elementMap.has(element)) {
          elementMap.set(element, new Map());
        }
  
        const instanceMap = elementMap.get(element); // make it clear we only want one instance per element
        // can be removed later when multiple key/instances are fine to be used
  
        if (!instanceMap.has(key) && instanceMap.size !== 0) {
          // eslint-disable-next-line no-console
          console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
          return;
        }
  
        instanceMap.set(key, instance);
      },
  
      get(element, key) {
        if (elementMap.has(element)) {
          return elementMap.get(element).get(key) || null;
        }
  
        return null;
      },
  
      remove(element, key) {
        if (!elementMap.has(element)) {
          return;
        }
  
        const instanceMap = elementMap.get(element);
        instanceMap.delete(key); // free up element references if there are no instances left for an element
  
        if (instanceMap.size === 0) {
          elementMap.delete(element);
        }
      }
  
    };
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): base-component.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
  
    const VERSION = '5.1.3';
  
    class BaseComponent {
      constructor(element) {
        element = getElement(element);
  
        if (!element) {
          return;
        }
  
        this._element = element;
        Data.set(this._element, this.constructor.DATA_KEY, this);
      }
  
      dispose() {
        Data.remove(this._element, this.constructor.DATA_KEY);
        EventHandler.off(this._element, this.constructor.EVENT_KEY);
        Object.getOwnPropertyNames(this).forEach(propertyName => {
          this[propertyName] = null;
        });
      }
  
      _queueCallback(callback, element, isAnimated = true) {
        executeAfterTransition(callback, element, isAnimated);
      }
      /** Static */
  
  
      static getInstance(element) {
        return Data.get(getElement(element), this.DATA_KEY);
      }
  
      static getOrCreateInstance(element, config = {}) {
        return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null);
      }
  
      static get VERSION() {
        return VERSION;
      }
  
      static get NAME() {
        throw new Error('You have to implement the static method "NAME", for each component!');
      }
  
      static get DATA_KEY() {
        return `bs.${this.NAME}`;
      }
  
      static get EVENT_KEY() {
        return `.${this.DATA_KEY}`;
      }
  
    }
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): util/component-functions.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
  
    const enableDismissTrigger = (component, method = 'hide') => {
      const clickEvent = `click.dismiss${component.EVENT_KEY}`;
      const name = component.NAME;
      EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function (event) {
        if (['A', 'AREA'].includes(this.tagName)) {
          event.preventDefault();
        }
  
        if (isDisabled(this)) {
          return;
        }
  
        const target = getElementFromSelector(this) || this.closest(`.${name}`);
        const instance = component.getOrCreateInstance(target); // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method
  
        instance[method]();
      });
    };
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): alert.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
  
    const NAME$d = 'alert';
    const DATA_KEY$c = 'bs.alert';
    const EVENT_KEY$c = `.${DATA_KEY$c}`;
    const EVENT_CLOSE = `close${EVENT_KEY$c}`;
    const EVENT_CLOSED = `closed${EVENT_KEY$c}`;
    const CLASS_NAME_FADE$5 = 'fade';
    const CLASS_NAME_SHOW$8 = 'show';
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
  
    class Alert extends BaseComponent {
      // Getters
      static get NAME() {
        return NAME$d;
      } // Public
  
  
      close() {
        const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE);
  
        if (closeEvent.defaultPrevented) {
          return;
        }
  
        this._element.classList.remove(CLASS_NAME_SHOW$8);
  
        const isAnimated = this._element.classList.contains(CLASS_NAME_FADE$5);
  
        this._queueCallback(() => this._destroyElement(), this._element, isAnimated);
      } // Private
  
  
      _destroyElement() {
        this._element.remove();
  
        EventHandler.trigger(this._element, EVENT_CLOSED);
        this.dispose();
      } // Static
  
  
      static jQueryInterface(config) {
        return this.each(function () {
          const data = Alert.getOrCreateInstance(this);
  
          if (typeof config !== 'string') {
            return;
          }
  
          if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
            throw new TypeError(`No method named "${config}"`);
          }
  
          data[config](this);
        });
      }
  
    }
    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */
  
  
    enableDismissTrigger(Alert, 'close');
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     * add .Alert to jQuery only if jQuery is present
     */
  
    defineJQueryPlugin(Alert);
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): button.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
  
    const NAME$c = 'button';
    const DATA_KEY$b = 'bs.button';
    const EVENT_KEY$b = `.${DATA_KEY$b}`;
    const DATA_API_KEY$7 = '.data-api';
    const CLASS_NAME_ACTIVE$3 = 'active';
    const SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="button"]';
    const EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$b}${DATA_API_KEY$7}`;
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
  
    class Button extends BaseComponent {
      // Getters
      static get NAME() {
        return NAME$c;
      } // Public
  
  
      toggle() {
        // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
        this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE$3));
      } // Static
  
  
      static jQueryInterface(config) {
        return this.each(function () {
          const data = Button.getOrCreateInstance(this);
  
          if (config === 'toggle') {
            data[config]();
          }
        });
      }
  
    }
    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */
  
  
    EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$5, event => {
      event.preventDefault();
      const button = event.target.closest(SELECTOR_DATA_TOGGLE$5);
      const data = Button.getOrCreateInstance(button);
      data.toggle();
    });
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     * add .Button to jQuery only if jQuery is present
     */
  
    defineJQueryPlugin(Button);
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): dom/manipulator.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    function normalizeData(val) {
      if (val === 'true') {
        return true;
      }
  
      if (val === 'false') {
        return false;
      }
  
      if (val === Number(val).toString()) {
        return Number(val);
      }
  
      if (val === '' || val === 'null') {
        return null;
      }
  
      return val;
    }
  
    function normalizeDataKey(key) {
      return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`);
    }
  
    const Manipulator = {
      setDataAttribute(element, key, value) {
        element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
      },
  
      removeDataAttribute(element, key) {
        element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
      },
  
      getDataAttributes(element) {
        if (!element) {
          return {};
        }
  
        const attributes = {};
        Object.keys(element.dataset).filter(key => key.startsWith('bs')).forEach(key => {
          let pureKey = key.replace(/^bs/, '');
          pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
          attributes[pureKey] = normalizeData(element.dataset[key]);
        });
        return attributes;
      },
  
      getDataAttribute(element, key) {
        return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
      },
  
      offset(element) {
        const rect = element.getBoundingClientRect();
        return {
          top: rect.top + window.pageYOffset,
          left: rect.left + window.pageXOffset
        };
      },
  
      position(element) {
        return {
          top: element.offsetTop,
          left: element.offsetLeft
        };
      }
  
    };
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): dom/selector-engine.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    const NODE_TEXT = 3;
    const SelectorEngine = {
      find(selector, element = document.documentElement) {
        return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
      },
  
      findOne(selector, element = document.documentElement) {
        return Element.prototype.querySelector.call(element, selector);
      },
  
      children(element, selector) {
        return [].concat(...element.children).filter(child => child.matches(selector));
      },
  
      parents(element, selector) {
        const parents = [];
        let ancestor = element.parentNode;
  
        while (ancestor && ancestor.nodeType === Node.ELEMENT_NODE && ancestor.nodeType !== NODE_TEXT) {
          if (ancestor.matches(selector)) {
            parents.push(ancestor);
          }
  
          ancestor = ancestor.parentNode;
        }
  
        return parents;
      },
  
      prev(element, selector) {
        let previous = element.previousElementSibling;
  
        while (previous) {
          if (previous.matches(selector)) {
            return [previous];
          }
  
          previous = previous.previousElementSibling;
        }
  
        return [];
      },
  
      next(element, selector) {
        let next = element.nextElementSibling;
  
        while (next) {
          if (next.matches(selector)) {
            return [next];
          }
  
          next = next.nextElementSibling;
        }
  
        return [];
      },
  
      focusableChildren(element) {
        const focusables = ['a', 'button', 'input', 'textarea', 'select', 'details', '[tabindex]', '[contenteditable="true"]'].map(selector => `${selector}:not([tabindex^="-"])`).join(', ');
        return this.find(focusables, element).filter(el => !isDisabled(el) && isVisible(el));
      }
  
    };
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): carousel.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
  
    const NAME$b = 'carousel';
    const DATA_KEY$a = 'bs.carousel';
    const EVENT_KEY$a = `.${DATA_KEY$a}`;
    const DATA_API_KEY$6 = '.data-api';
    const ARROW_LEFT_KEY = 'ArrowLeft';
    const ARROW_RIGHT_KEY = 'ArrowRight';
    const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch
  
    const SWIPE_THRESHOLD = 40;
    const Default$a = {
      interval: 5000,
      keyboard: true,
      slide: false,
      pause: 'hover',
      wrap: true,
      touch: true
    };
    const DefaultType$a = {
      interval: '(number|boolean)',
      keyboard: 'boolean',
      slide: '(boolean|string)',
      pause: '(string|boolean)',
      wrap: 'boolean',
      touch: 'boolean'
    };
    const ORDER_NEXT = 'next';
    const ORDER_PREV = 'prev';
    const DIRECTION_LEFT = 'left';
    const DIRECTION_RIGHT = 'right';
    const KEY_TO_DIRECTION = {
      [ARROW_LEFT_KEY]: DIRECTION_RIGHT,
      [ARROW_RIGHT_KEY]: DIRECTION_LEFT
    };
    const EVENT_SLIDE = `slide${EVENT_KEY$a}`;
    const EVENT_SLID = `slid${EVENT_KEY$a}`;
    const EVENT_KEYDOWN = `keydown${EVENT_KEY$a}`;
    const EVENT_MOUSEENTER = `mouseenter${EVENT_KEY$a}`;
    const EVENT_MOUSELEAVE = `mouseleave${EVENT_KEY$a}`;
    const EVENT_TOUCHSTART = `touchstart${EVENT_KEY$a}`;
    const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$a}`;
    const EVENT_TOUCHEND = `touchend${EVENT_KEY$a}`;
    const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$a}`;
    const EVENT_POINTERUP = `pointerup${EVENT_KEY$a}`;
    const EVENT_DRAG_START = `dragstart${EVENT_KEY$a}`;
    const EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$a}${DATA_API_KEY$6}`;
    const EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$a}${DATA_API_KEY$6}`;
    const CLASS_NAME_CAROUSEL = 'carousel';
    const CLASS_NAME_ACTIVE$2 = 'active';
    const CLASS_NAME_SLIDE = 'slide';
    const CLASS_NAME_END = 'carousel-item-end';
    const CLASS_NAME_START = 'carousel-item-start';
    const CLASS_NAME_NEXT = 'carousel-item-next';
    const CLASS_NAME_PREV = 'carousel-item-prev';
    const CLASS_NAME_POINTER_EVENT = 'pointer-event';
    const SELECTOR_ACTIVE$1 = '.active';
    const SELECTOR_ACTIVE_ITEM = '.active.carousel-item';
    const SELECTOR_ITEM = '.carousel-item';
    const SELECTOR_ITEM_IMG = '.carousel-item img';
    const SELECTOR_NEXT_PREV = '.carousel-item-next, .carousel-item-prev';
    const SELECTOR_INDICATORS = '.carousel-indicators';
    const SELECTOR_INDICATOR = '[data-bs-target]';
    const SELECTOR_DATA_SLIDE = '[data-bs-slide], [data-bs-slide-to]';
    const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
    const POINTER_TYPE_TOUCH = 'touch';
    const POINTER_TYPE_PEN = 'pen';
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
  
    class Carousel extends BaseComponent {
      constructor(element, config) {
        super(element);
        this._items = null;
        this._interval = null;
        this._activeElement = null;
        this._isPaused = false;
        this._isSliding = false;
        this.touchTimeout = null;
        this.touchStartX = 0;
        this.touchDeltaX = 0;
        this._config = this._getConfig(config);
        this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);
        this._touchSupported = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
        this._pointerEvent = Boolean(window.PointerEvent);
  
        this._addEventListeners();
      } // Getters
  
  
      static get Default() {
        return Default$a;
      }
  
      static get NAME() {
        return NAME$b;
      } // Public
  
  
      next() {
        this._slide(ORDER_NEXT);
      }
  
      nextWhenVisible() {
        // Don't call next when the page isn't visible
        // or the carousel or its parent isn't visible
        if (!document.hidden && isVisible(this._element)) {
          this.next();
        }
      }
  
      prev() {
        this._slide(ORDER_PREV);
      }
  
      pause(event) {
        if (!event) {
          this._isPaused = true;
        }
  
        if (SelectorEngine.findOne(SELECTOR_NEXT_PREV, this._element)) {
          triggerTransitionEnd(this._element);
          this.cycle(true);
        }
  
        clearInterval(this._interval);
        this._interval = null;
      }
  
      cycle(event) {
        if (!event) {
          this._isPaused = false;
        }
  
        if (this._interval) {
          clearInterval(this._interval);
          this._interval = null;
        }
  
        if (this._config && this._config.interval && !this._isPaused) {
          this._updateInterval();
  
          this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval);
        }
      }
  
      to(index) {
        this._activeElement = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
  
        const activeIndex = this._getItemIndex(this._activeElement);
  
        if (index > this._items.length - 1 || index < 0) {
          return;
        }
  
        if (this._isSliding) {
          EventHandler.one(this._element, EVENT_SLID, () => this.to(index));
          return;
        }
  
        if (activeIndex === index) {
          this.pause();
          this.cycle();
          return;
        }
  
        const order = index > activeIndex ? ORDER_NEXT : ORDER_PREV;
  
        this._slide(order, this._items[index]);
      } // Private
  
  
      _getConfig(config) {
        config = { ...Default$a,
          ...Manipulator.getDataAttributes(this._element),
          ...(typeof config === 'object' ? config : {})
        };
        typeCheckConfig(NAME$b, config, DefaultType$a);
        return config;
      }
  
      _handleSwipe() {
        const absDeltax = Math.abs(this.touchDeltaX);
  
        if (absDeltax <= SWIPE_THRESHOLD) {
          return;
        }
  
        const direction = absDeltax / this.touchDeltaX;
        this.touchDeltaX = 0;
  
        if (!direction) {
          return;
        }
  
        this._slide(direction > 0 ? DIRECTION_RIGHT : DIRECTION_LEFT);
      }
  
      _addEventListeners() {
        if (this._config.keyboard) {
          EventHandler.on(this._element, EVENT_KEYDOWN, event => this._keydown(event));
        }
  
        if (this._config.pause === 'hover') {
          EventHandler.on(this._element, EVENT_MOUSEENTER, event => this.pause(event));
          EventHandler.on(this._element, EVENT_MOUSELEAVE, event => this.cycle(event));
        }
  
        if (this._config.touch && this._touchSupported) {
          this._addTouchEventListeners();
        }
      }
  
      _addTouchEventListeners() {
        const hasPointerPenTouch = event => {
          return this._pointerEvent && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH);
        };
  
        const start = event => {
          if (hasPointerPenTouch(event)) {
            this.touchStartX = event.clientX;
          } else if (!this._pointerEvent) {
            this.touchStartX = event.touches[0].clientX;
          }
        };
  
        const move = event => {
          // ensure swiping with one touch and not pinching
          this.touchDeltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this.touchStartX;
        };
  
        const end = event => {
          if (hasPointerPenTouch(event)) {
            this.touchDeltaX = event.clientX - this.touchStartX;
          }
  
          this._handleSwipe();
  
          if (this._config.pause === 'hover') {
            // If it's a touch-enabled device, mouseenter/leave are fired as
            // part of the mouse compatibility events on first tap - the carousel
            // would stop cycling until user tapped out of it;
            // here, we listen for touchend, explicitly pause the carousel
            // (as if it's the second time we tap on it, mouseenter compat event
            // is NOT fired) and after a timeout (to allow for mouse compatibility
            // events to fire) we explicitly restart cycling
            this.pause();
  
            if (this.touchTimeout) {
              clearTimeout(this.touchTimeout);
            }
  
            this.touchTimeout = setTimeout(event => this.cycle(event), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
          }
        };
  
        SelectorEngine.find(SELECTOR_ITEM_IMG, this._element).forEach(itemImg => {
          EventHandler.on(itemImg, EVENT_DRAG_START, event => event.preventDefault());
        });
  
        if (this._pointerEvent) {
          EventHandler.on(this._element, EVENT_POINTERDOWN, event => start(event));
          EventHandler.on(this._element, EVENT_POINTERUP, event => end(event));
  
          this._element.classList.add(CLASS_NAME_POINTER_EVENT);
        } else {
          EventHandler.on(this._element, EVENT_TOUCHSTART, event => start(event));
          EventHandler.on(this._element, EVENT_TOUCHMOVE, event => move(event));
          EventHandler.on(this._element, EVENT_TOUCHEND, event => end(event));
        }
      }
  
      _keydown(event) {
        if (/input|textarea/i.test(event.target.tagName)) {
          return;
        }
  
        const direction = KEY_TO_DIRECTION[event.key];
  
        if (direction) {
          event.preventDefault();
  
          this._slide(direction);
        }
      }
  
      _getItemIndex(element) {
        this._items = element && element.parentNode ? SelectorEngine.find(SELECTOR_ITEM, element.parentNode) : [];
        return this._items.indexOf(element);
      }
  
      _getItemByOrder(order, activeElement) {
        const isNext = order === ORDER_NEXT;
        return getNextActiveElement(this._items, activeElement, isNext, this._config.wrap);
      }
  
      _triggerSlideEvent(relatedTarget, eventDirectionName) {
        const targetIndex = this._getItemIndex(relatedTarget);
  
        const fromIndex = this._getItemIndex(SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element));
  
        return EventHandler.trigger(this._element, EVENT_SLIDE, {
          relatedTarget,
          direction: eventDirectionName,
          from: fromIndex,
          to: targetIndex
        });
      }
  
      _setActiveIndicatorElement(element) {
        if (this._indicatorsElement) {
          const activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE$1, this._indicatorsElement);
          activeIndicator.classList.remove(CLASS_NAME_ACTIVE$2);
          activeIndicator.removeAttribute('aria-current');
          const indicators = SelectorEngine.find(SELECTOR_INDICATOR, this._indicatorsElement);
  
          for (let i = 0; i < indicators.length; i++) {
            if (Number.parseInt(indicators[i].getAttribute('data-bs-slide-to'), 10) === this._getItemIndex(element)) {
              indicators[i].classList.add(CLASS_NAME_ACTIVE$2);
              indicators[i].setAttribute('aria-current', 'true');
              break;
            }
          }
        }
      }
  
      _updateInterval() {
        const element = this._activeElement || SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
  
        if (!element) {
          return;
        }
  
        const elementInterval = Number.parseInt(element.getAttribute('data-bs-interval'), 10);
  
        if (elementInterval) {
          this._config.defaultInterval = this._config.defaultInterval || this._config.interval;
          this._config.interval = elementInterval;
        } else {
          this._config.interval = this._config.defaultInterval || this._config.interval;
        }
      }
  
      _slide(directionOrOrder, element) {
        const order = this._directionToOrder(directionOrOrder);
  
        const activeElement = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
  
        const activeElementIndex = this._getItemIndex(activeElement);
  
        const nextElement = element || this._getItemByOrder(order, activeElement);
  
        const nextElementIndex = this._getItemIndex(nextElement);
  
        const isCycling = Boolean(this._interval);
        const isNext = order === ORDER_NEXT;
        const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
        const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;
  
        const eventDirectionName = this._orderToDirection(order);
  
        if (nextElement && nextElement.classList.contains(CLASS_NAME_ACTIVE$2)) {
          this._isSliding = false;
          return;
        }
  
        if (this._isSliding) {
          return;
        }
  
        const slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);
  
        if (slideEvent.defaultPrevented) {
          return;
        }
  
        if (!activeElement || !nextElement) {
          // Some weirdness is happening, so we bail
          return;
        }
  
        this._isSliding = true;
  
        if (isCycling) {
          this.pause();
        }
  
        this._setActiveIndicatorElement(nextElement);
  
        this._activeElement = nextElement;
  
        const triggerSlidEvent = () => {
          EventHandler.trigger(this._element, EVENT_SLID, {
            relatedTarget: nextElement,
            direction: eventDirectionName,
            from: activeElementIndex,
            to: nextElementIndex
          });
        };
  
        if (this._element.classList.contains(CLASS_NAME_SLIDE)) {
          nextElement.classList.add(orderClassName);
          reflow(nextElement);
          activeElement.classList.add(directionalClassName);
          nextElement.classList.add(directionalClassName);
  
          const completeCallBack = () => {
            nextElement.classList.remove(directionalClassName, orderClassName);
            nextElement.classList.add(CLASS_NAME_ACTIVE$2);
            activeElement.classList.remove(CLASS_NAME_ACTIVE$2, orderClassName, directionalClassName);
            this._isSliding = false;
            setTimeout(triggerSlidEvent, 0);
          };
  
          this._queueCallback(completeCallBack, activeElement, true);
        } else {
          activeElement.classList.remove(CLASS_NAME_ACTIVE$2);
          nextElement.classList.add(CLASS_NAME_ACTIVE$2);
          this._isSliding = false;
          triggerSlidEvent();
        }
  
        if (isCycling) {
          this.cycle();
        }
      }
  
      _directionToOrder(direction) {
        if (![DIRECTION_RIGHT, DIRECTION_LEFT].includes(direction)) {
          return direction;
        }
  
        if (isRTL()) {
          return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
        }
  
        return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
      }
  
      _orderToDirection(order) {
        if (![ORDER_NEXT, ORDER_PREV].includes(order)) {
          return order;
        }
  
        if (isRTL()) {
          return order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
        }
  
        return order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
      } // Static
  
  
      static carouselInterface(element, config) {
        const data = Carousel.getOrCreateInstance(element, config);
        let {
          _config
        } = data;
  
        if (typeof config === 'object') {
          _config = { ..._config,
            ...config
          };
        }
  
        const action = typeof config === 'string' ? config : _config.slide;
  
        if (typeof config === 'number') {
          data.to(config);
        } else if (typeof action === 'string') {
          if (typeof data[action] === 'undefined') {
            throw new TypeError(`No method named "${action}"`);
          }
  
          data[action]();
        } else if (_config.interval && _config.ride) {
          data.pause();
          data.cycle();
        }
      }
  
      static jQueryInterface(config) {
        return this.each(function () {
          Carousel.carouselInterface(this, config);
        });
      }
  
      static dataApiClickHandler(event) {
        const target = getElementFromSelector(this);
  
        if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
          return;
        }
  
        const config = { ...Manipulator.getDataAttributes(target),
          ...Manipulator.getDataAttributes(this)
        };
        const slideIndex = this.getAttribute('data-bs-slide-to');
  
        if (slideIndex) {
          config.interval = false;
        }
  
        Carousel.carouselInterface(target, config);
  
        if (slideIndex) {
          Carousel.getInstance(target).to(slideIndex);
        }
  
        event.preventDefault();
      }
  
    }
    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */
  
  
    EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_SLIDE, Carousel.dataApiClickHandler);
    EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
      const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);
  
      for (let i = 0, len = carousels.length; i < len; i++) {
        Carousel.carouselInterface(carousels[i], Carousel.getInstance(carousels[i]));
      }
    });
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     * add .Carousel to jQuery only if jQuery is present
     */
  
    defineJQueryPlugin(Carousel);
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): collapse.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
  
    const NAME$a = 'collapse';
    const DATA_KEY$9 = 'bs.collapse';
    const EVENT_KEY$9 = `.${DATA_KEY$9}`;
    const DATA_API_KEY$5 = '.data-api';
    const Default$9 = {
      toggle: true,
      parent: null
    };
    const DefaultType$9 = {
      toggle: 'boolean',
      parent: '(null|element)'
    };
    const EVENT_SHOW$5 = `show${EVENT_KEY$9}`;
    const EVENT_SHOWN$5 = `shown${EVENT_KEY$9}`;
    const EVENT_HIDE$5 = `hide${EVENT_KEY$9}`;
    const EVENT_HIDDEN$5 = `hidden${EVENT_KEY$9}`;
    const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$9}${DATA_API_KEY$5}`;
    const CLASS_NAME_SHOW$7 = 'show';
    const CLASS_NAME_COLLAPSE = 'collapse';
    const CLASS_NAME_COLLAPSING = 'collapsing';
    const CLASS_NAME_COLLAPSED = 'collapsed';
    const CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;
    const CLASS_NAME_HORIZONTAL = 'collapse-horizontal';
    const WIDTH = 'width';
    const HEIGHT = 'height';
    const SELECTOR_ACTIVES = '.collapse.show, .collapse.collapsing';
    const SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]';
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
  
    class Collapse extends BaseComponent {
      constructor(element, config) {
        super(element);
        this._isTransitioning = false;
        this._config = this._getConfig(config);
        this._triggerArray = [];
        const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);
  
        for (let i = 0, len = toggleList.length; i < len; i++) {
          const elem = toggleList[i];
          const selector = getSelectorFromElement(elem);
          const filterElement = SelectorEngine.find(selector).filter(foundElem => foundElem === this._element);
  
          if (selector !== null && filterElement.length) {
            this._selector = selector;
  
            this._triggerArray.push(elem);
          }
        }
  
        this._initializeChildren();
  
        if (!this._config.parent) {
          this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
        }
  
        if (this._config.toggle) {
          this.toggle();
        }
      } // Getters
  
  
      static get Default() {
        return Default$9;
      }
  
      static get NAME() {
        return NAME$a;
      } // Public
  
  
      toggle() {
        if (this._isShown()) {
          this.hide();
        } else {
          this.show();
        }
      }
  
      show() {
        if (this._isTransitioning || this._isShown()) {
          return;
        }
  
        let actives = [];
        let activesData;
  
        if (this._config.parent) {
          const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
          actives = SelectorEngine.find(SELECTOR_ACTIVES, this._config.parent).filter(elem => !children.includes(elem)); // remove children if greater depth
        }
  
        const container = SelectorEngine.findOne(this._selector);
  
        if (actives.length) {
          const tempActiveData = actives.find(elem => container !== elem);
          activesData = tempActiveData ? Collapse.getInstance(tempActiveData) : null;
  
          if (activesData && activesData._isTransitioning) {
            return;
          }
        }
  
        const startEvent = EventHandler.trigger(this._element, EVENT_SHOW$5);
  
        if (startEvent.defaultPrevented) {
          return;
        }
  
        actives.forEach(elemActive => {
          if (container !== elemActive) {
            Collapse.getOrCreateInstance(elemActive, {
              toggle: false
            }).hide();
          }
  
          if (!activesData) {
            Data.set(elemActive, DATA_KEY$9, null);
          }
        });
  
        const dimension = this._getDimension();
  
        this._element.classList.remove(CLASS_NAME_COLLAPSE);
  
        this._element.classList.add(CLASS_NAME_COLLAPSING);
  
        this._element.style[dimension] = 0;
  
        this._addAriaAndCollapsedClass(this._triggerArray, true);
  
        this._isTransitioning = true;
  
        const complete = () => {
          this._isTransitioning = false;
  
          this._element.classList.remove(CLASS_NAME_COLLAPSING);
  
          this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);
  
          this._element.style[dimension] = '';
          EventHandler.trigger(this._element, EVENT_SHOWN$5);
        };
  
        const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
        const scrollSize = `scroll${capitalizedDimension}`;
  
        this._queueCallback(complete, this._element, true);
  
        this._element.style[dimension] = `${this._element[scrollSize]}px`;
      }
  
      hide() {
        if (this._isTransitioning || !this._isShown()) {
          return;
        }
  
        const startEvent = EventHandler.trigger(this._element, EVENT_HIDE$5);
  
        if (startEvent.defaultPrevented) {
          return;
        }
  
        const dimension = this._getDimension();
  
        this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
        reflow(this._element);
  
        this._element.classList.add(CLASS_NAME_COLLAPSING);
  
        this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);
  
        const triggerArrayLength = this._triggerArray.length;
  
        for (let i = 0; i < triggerArrayLength; i++) {
          const trigger = this._triggerArray[i];
          const elem = getElementFromSelector(trigger);
  
          if (elem && !this._isShown(elem)) {
            this._addAriaAndCollapsedClass([trigger], false);
          }
        }
  
        this._isTransitioning = true;
  
        const complete = () => {
          this._isTransitioning = false;
  
          this._element.classList.remove(CLASS_NAME_COLLAPSING);
  
          this._element.classList.add(CLASS_NAME_COLLAPSE);
  
          EventHandler.trigger(this._element, EVENT_HIDDEN$5);
        };
  
        this._element.style[dimension] = '';
  
        this._queueCallback(complete, this._element, true);
      }
  
      _isShown(element = this._element) {
        return element.classList.contains(CLASS_NAME_SHOW$7);
      } // Private
  
  
      _getConfig(config) {
        config = { ...Default$9,
          ...Manipulator.getDataAttributes(this._element),
          ...config
        };
        config.toggle = Boolean(config.toggle); // Coerce string values
  
        config.parent = getElement(config.parent);
        typeCheckConfig(NAME$a, config, DefaultType$9);
        return config;
      }
  
      _getDimension() {
        return this._element.classList.contains(CLASS_NAME_HORIZONTAL) ? WIDTH : HEIGHT;
      }
  
      _initializeChildren() {
        if (!this._config.parent) {
          return;
        }
  
        const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
        SelectorEngine.find(SELECTOR_DATA_TOGGLE$4, this._config.parent).filter(elem => !children.includes(elem)).forEach(element => {
          const selected = getElementFromSelector(element);
  
          if (selected) {
            this._addAriaAndCollapsedClass([element], this._isShown(selected));
          }
        });
      }
  
      _addAriaAndCollapsedClass(triggerArray, isOpen) {
        if (!triggerArray.length) {
          return;
        }
  
        triggerArray.forEach(elem => {
          if (isOpen) {
            elem.classList.remove(CLASS_NAME_COLLAPSED);
          } else {
            elem.classList.add(CLASS_NAME_COLLAPSED);
          }
  
          elem.setAttribute('aria-expanded', isOpen);
        });
      } // Static
  
  
      static jQueryInterface(config) {
        return this.each(function () {
          const _config = {};
  
          if (typeof config === 'string' && /show|hide/.test(config)) {
            _config.toggle = false;
          }
  
          const data = Collapse.getOrCreateInstance(this, _config);
  
          if (typeof config === 'string') {
            if (typeof data[config] === 'undefined') {
              throw new TypeError(`No method named "${config}"`);
            }
  
            data[config]();
          }
        });
      }
  
    }
    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */
  
  
    EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$4, function (event) {
      // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
      if (event.target.tagName === 'A' || event.delegateTarget && event.delegateTarget.tagName === 'A') {
        event.preventDefault();
      }
  
      const selector = getSelectorFromElement(this);
      const selectorElements = SelectorEngine.find(selector);
      selectorElements.forEach(element => {
        Collapse.getOrCreateInstance(element, {
          toggle: false
        }).toggle();
      });
    });
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     * add .Collapse to jQuery only if jQuery is present
     */
  
    defineJQueryPlugin(Collapse);
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): dropdown.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
  
    const NAME$9 = 'dropdown';
    const DATA_KEY$8 = 'bs.dropdown';
    const EVENT_KEY$8 = `.${DATA_KEY$8}`;
    const DATA_API_KEY$4 = '.data-api';
    const ESCAPE_KEY$2 = 'Escape';
    const SPACE_KEY = 'Space';
    const TAB_KEY$1 = 'Tab';
    const ARROW_UP_KEY = 'ArrowUp';
    const ARROW_DOWN_KEY = 'ArrowDown';
    const RIGHT_MOUSE_BUTTON = 2; // MouseEvent.button value for the secondary button, usually the right button
  
    const REGEXP_KEYDOWN = new RegExp(`${ARROW_UP_KEY}|${ARROW_DOWN_KEY}|${ESCAPE_KEY$2}`);
    const EVENT_HIDE$4 = `hide${EVENT_KEY$8}`;
    const EVENT_HIDDEN$4 = `hidden${EVENT_KEY$8}`;
    const EVENT_SHOW$4 = `show${EVENT_KEY$8}`;
    const EVENT_SHOWN$4 = `shown${EVENT_KEY$8}`;
    const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$8}${DATA_API_KEY$4}`;
    const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$8}${DATA_API_KEY$4}`;
    const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$8}${DATA_API_KEY$4}`;
    const CLASS_NAME_SHOW$6 = 'show';
    const CLASS_NAME_DROPUP = 'dropup';
    const CLASS_NAME_DROPEND = 'dropend';
    const CLASS_NAME_DROPSTART = 'dropstart';
    const CLASS_NAME_NAVBAR = 'navbar';
    const SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]';
    const SELECTOR_MENU = '.dropdown-menu';
    const SELECTOR_NAVBAR_NAV = '.navbar-nav';
    const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
    const PLACEMENT_TOP = isRTL() ? 'top-end' : 'top-start';
    const PLACEMENT_TOPEND = isRTL() ? 'top-start' : 'top-end';
    const PLACEMENT_BOTTOM = isRTL() ? 'bottom-end' : 'bottom-start';
    const PLACEMENT_BOTTOMEND = isRTL() ? 'bottom-start' : 'bottom-end';
    const PLACEMENT_RIGHT = isRTL() ? 'left-start' : 'right-start';
    const PLACEMENT_LEFT = isRTL() ? 'right-start' : 'left-start';
    const Default$8 = {
      offset: [0, 2],
      boundary: 'clippingParents',
      reference: 'toggle',
      display: 'dynamic',
      popperConfig: null,
      autoClose: true
    };
    const DefaultType$8 = {
      offset: '(array|string|function)',
      boundary: '(string|element)',
      reference: '(string|element|object)',
      display: 'string',
      popperConfig: '(null|object|function)',
      autoClose: '(boolean|string)'
    };
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
  
    class Dropdown extends BaseComponent {
      constructor(element, config) {
        super(element);
        this._popper = null;
        this._config = this._getConfig(config);
        this._menu = this._getMenuElement();
        this._inNavbar = this._detectNavbar();
      } // Getters
  
  
      static get Default() {
        return Default$8;
      }
  
      static get DefaultType() {
        return DefaultType$8;
      }
  
      static get NAME() {
        return NAME$9;
      } // Public
  
  
      toggle() {
        return this._isShown() ? this.hide() : this.show();
      }
  
      show() {
        if (isDisabled(this._element) || this._isShown(this._menu)) {
          return;
        }
  
        const relatedTarget = {
          relatedTarget: this._element
        };
        const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$4, relatedTarget);
  
        if (showEvent.defaultPrevented) {
          return;
        }
  
        const parent = Dropdown.getParentFromElement(this._element); // Totally disable Popper for Dropdowns in Navbar
  
        if (this._inNavbar) {
          Manipulator.setDataAttribute(this._menu, 'popper', 'none');
        } else {
          this._createPopper(parent);
        } // If this is a touch-enabled device we add extra
        // empty mouseover listeners to the body's immediate children;
        // only needed because of broken event delegation on iOS
        // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
  
  
        if ('ontouchstart' in document.documentElement && !parent.closest(SELECTOR_NAVBAR_NAV)) {
          [].concat(...document.body.children).forEach(elem => EventHandler.on(elem, 'mouseover', noop));
        }
  
        this._element.focus();
  
        this._element.setAttribute('aria-expanded', true);
  
        this._menu.classList.add(CLASS_NAME_SHOW$6);
  
        this._element.classList.add(CLASS_NAME_SHOW$6);
  
        EventHandler.trigger(this._element, EVENT_SHOWN$4, relatedTarget);
      }
  
      hide() {
        if (isDisabled(this._element) || !this._isShown(this._menu)) {
          return;
        }
  
        const relatedTarget = {
          relatedTarget: this._element
        };
  
        this._completeHide(relatedTarget);
      }
  
      dispose() {
        if (this._popper) {
          this._popper.destroy();
        }
  
        super.dispose();
      }
  
      update() {
        this._inNavbar = this._detectNavbar();
  
        if (this._popper) {
          this._popper.update();
        }
      } // Private
  
  
      _completeHide(relatedTarget) {
        const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$4, relatedTarget);
  
        if (hideEvent.defaultPrevented) {
          return;
        } // If this is a touch-enabled device we remove the extra
        // empty mouseover listeners we added for iOS support
  
  
        if ('ontouchstart' in document.documentElement) {
          [].concat(...document.body.children).forEach(elem => EventHandler.off(elem, 'mouseover', noop));
        }
  
        if (this._popper) {
          this._popper.destroy();
        }
  
        this._menu.classList.remove(CLASS_NAME_SHOW$6);
  
        this._element.classList.remove(CLASS_NAME_SHOW$6);
  
        this._element.setAttribute('aria-expanded', 'false');
  
        Manipulator.removeDataAttribute(this._menu, 'popper');
        EventHandler.trigger(this._element, EVENT_HIDDEN$4, relatedTarget);
      }
  
      _getConfig(config) {
        config = { ...this.constructor.Default,
          ...Manipulator.getDataAttributes(this._element),
          ...config
        };
        typeCheckConfig(NAME$9, config, this.constructor.DefaultType);
  
        if (typeof config.reference === 'object' && !isElement(config.reference) && typeof config.reference.getBoundingClientRect !== 'function') {
          // Popper virtual elements require a getBoundingClientRect method
          throw new TypeError(`${NAME$9.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
        }
  
        return config;
      }
  
      _createPopper(parent) {
        if (typeof Popper__namespace === 'undefined') {
          throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org)');
        }
  
        let referenceElement = this._element;
  
        if (this._config.reference === 'parent') {
          referenceElement = parent;
        } else if (isElement(this._config.reference)) {
          referenceElement = getElement(this._config.reference);
        } else if (typeof this._config.reference === 'object') {
          referenceElement = this._config.reference;
        }
  
        const popperConfig = this._getPopperConfig();
  
        const isDisplayStatic = popperConfig.modifiers.find(modifier => modifier.name === 'applyStyles' && modifier.enabled === false);
        this._popper = Popper__namespace.createPopper(referenceElement, this._menu, popperConfig);
  
        if (isDisplayStatic) {
          Manipulator.setDataAttribute(this._menu, 'popper', 'static');
        }
      }
  
      _isShown(element = this._element) {
        return element.classList.contains(CLASS_NAME_SHOW$6);
      }
  
      _getMenuElement() {
        return SelectorEngine.next(this._element, SELECTOR_MENU)[0];
      }
  
      _getPlacement() {
        const parentDropdown = this._element.parentNode;
  
        if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
          return PLACEMENT_RIGHT;
        }
  
        if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
          return PLACEMENT_LEFT;
        } // We need to trim the value because custom properties can also include spaces
  
  
        const isEnd = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end';
  
        if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
          return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
        }
  
        return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
      }
  
      _detectNavbar() {
        return this._element.closest(`.${CLASS_NAME_NAVBAR}`) !== null;
      }
  
      _getOffset() {
        const {
          offset
        } = this._config;
  
        if (typeof offset === 'string') {
          return offset.split(',').map(val => Number.parseInt(val, 10));
        }
  
        if (typeof offset === 'function') {
          return popperData => offset(popperData, this._element);
        }
  
        return offset;
      }
  
      _getPopperConfig() {
        const defaultBsPopperConfig = {
          placement: this._getPlacement(),
          modifiers: [{
            name: 'preventOverflow',
            options: {
              boundary: this._config.boundary
            }
          }, {
            name: 'offset',
            options: {
              offset: this._getOffset()
            }
          }]
        }; // Disable Popper if we have a static display
  
        if (this._config.display === 'static') {
          defaultBsPopperConfig.modifiers = [{
            name: 'applyStyles',
            enabled: false
          }];
        }
  
        return { ...defaultBsPopperConfig,
          ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
        };
      }
  
      _selectMenuItem({
        key,
        target
      }) {
        const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(isVisible);
  
        if (!items.length) {
          return;
        } // if target isn't included in items (e.g. when expanding the dropdown)
        // allow cycling to get the last item in case key equals ARROW_UP_KEY
  
  
        getNextActiveElement(items, target, key === ARROW_DOWN_KEY, !items.includes(target)).focus();
      } // Static
  
  
      static jQueryInterface(config) {
        return this.each(function () {
          const data = Dropdown.getOrCreateInstance(this, config);
  
          if (typeof config !== 'string') {
            return;
          }
  
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }
  
          data[config]();
        });
      }
  
      static clearMenus(event) {
        if (event && (event.button === RIGHT_MOUSE_BUTTON || event.type === 'keyup' && event.key !== TAB_KEY$1)) {
          return;
        }
  
        const toggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE$3);
  
        for (let i = 0, len = toggles.length; i < len; i++) {
          const context = Dropdown.getInstance(toggles[i]);
  
          if (!context || context._config.autoClose === false) {
            continue;
          }
  
          if (!context._isShown()) {
            continue;
          }
  
          const relatedTarget = {
            relatedTarget: context._element
          };
  
          if (event) {
            const composedPath = event.composedPath();
            const isMenuTarget = composedPath.includes(context._menu);
  
            if (composedPath.includes(context._element) || context._config.autoClose === 'inside' && !isMenuTarget || context._config.autoClose === 'outside' && isMenuTarget) {
              continue;
            } // Tab navigation through the dropdown menu or events from contained inputs shouldn't close the menu
  
  
            if (context._menu.contains(event.target) && (event.type === 'keyup' && event.key === TAB_KEY$1 || /input|select|option|textarea|form/i.test(event.target.tagName))) {
              continue;
            }
  
            if (event.type === 'click') {
              relatedTarget.clickEvent = event;
            }
          }
  
          context._completeHide(relatedTarget);
        }
      }
  
      static getParentFromElement(element) {
        return getElementFromSelector(element) || element.parentNode;
      }
  
      static dataApiKeydownHandler(event) {
        // If not input/textarea:
        //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
        // If input/textarea:
        //  - If space key => not a dropdown command
        //  - If key is other than escape
        //    - If key is not up or down => not a dropdown command
        //    - If trigger inside the menu => not a dropdown command
        if (/input|textarea/i.test(event.target.tagName) ? event.key === SPACE_KEY || event.key !== ESCAPE_KEY$2 && (event.key !== ARROW_DOWN_KEY && event.key !== ARROW_UP_KEY || event.target.closest(SELECTOR_MENU)) : !REGEXP_KEYDOWN.test(event.key)) {
          return;
        }
  
        const isActive = this.classList.contains(CLASS_NAME_SHOW$6);
  
        if (!isActive && event.key === ESCAPE_KEY$2) {
          return;
        }
  
        event.preventDefault();
        event.stopPropagation();
  
        if (isDisabled(this)) {
          return;
        }
  
        const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE$3) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0];
        const instance = Dropdown.getOrCreateInstance(getToggleButton);
  
        if (event.key === ESCAPE_KEY$2) {
          instance.hide();
          return;
        }
  
        if (event.key === ARROW_UP_KEY || event.key === ARROW_DOWN_KEY) {
          if (!isActive) {
            instance.show();
          }
  
          instance._selectMenuItem(event);
  
          return;
        }
  
        if (!isActive || event.key === SPACE_KEY) {
          Dropdown.clearMenus();
        }
      }
  
    }
    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */
  
  
    EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown.dataApiKeydownHandler);
    EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
    EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus);
    EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
    EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function (event) {
      event.preventDefault();
      Dropdown.getOrCreateInstance(this).toggle();
    });
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     * add .Dropdown to jQuery only if jQuery is present
     */
  
    defineJQueryPlugin(Dropdown);
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): util/scrollBar.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
    const SELECTOR_STICKY_CONTENT = '.sticky-top';
  
    class ScrollBarHelper {
      constructor() {
        this._element = document.body;
      }
  
      getWidth() {
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
        const documentWidth = document.documentElement.clientWidth;
        return Math.abs(window.innerWidth - documentWidth);
      }
  
      hide() {
        const width = this.getWidth();
  
        this._disableOverFlow(); // give padding to element to balance the hidden scrollbar width
  
  
        this._setElementAttributes(this._element, 'paddingRight', calculatedValue => calculatedValue + width); // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements to keep showing fullwidth
  
  
        this._setElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight', calculatedValue => calculatedValue + width);
  
        this._setElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight', calculatedValue => calculatedValue - width);
      }
  
      _disableOverFlow() {
        this._saveInitialAttribute(this._element, 'overflow');
  
        this._element.style.overflow = 'hidden';
      }
  
      _setElementAttributes(selector, styleProp, callback) {
        const scrollbarWidth = this.getWidth();
  
        const manipulationCallBack = element => {
          if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
            return;
          }
  
          this._saveInitialAttribute(element, styleProp);
  
          const calculatedValue = window.getComputedStyle(element)[styleProp];
          element.style[styleProp] = `${callback(Number.parseFloat(calculatedValue))}px`;
        };
  
        this._applyManipulationCallback(selector, manipulationCallBack);
      }
  
      reset() {
        this._resetElementAttributes(this._element, 'overflow');
  
        this._resetElementAttributes(this._element, 'paddingRight');
  
        this._resetElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight');
  
        this._resetElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight');
      }
  
      _saveInitialAttribute(element, styleProp) {
        const actualValue = element.style[styleProp];
  
        if (actualValue) {
          Manipulator.setDataAttribute(element, styleProp, actualValue);
        }
      }
  
      _resetElementAttributes(selector, styleProp) {
        const manipulationCallBack = element => {
          const value = Manipulator.getDataAttribute(element, styleProp);
  
          if (typeof value === 'undefined') {
            element.style.removeProperty(styleProp);
          } else {
            Manipulator.removeDataAttribute(element, styleProp);
            element.style[styleProp] = value;
          }
        };
  
        this._applyManipulationCallback(selector, manipulationCallBack);
      }
  
      _applyManipulationCallback(selector, callBack) {
        if (isElement(selector)) {
          callBack(selector);
        } else {
          SelectorEngine.find(selector, this._element).forEach(callBack);
        }
      }
  
      isOverflowing() {
        return this.getWidth() > 0;
      }
  
    }
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): util/backdrop.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    const Default$7 = {
      className: 'modal-backdrop',
      isVisible: true,
      // if false, we use the backdrop helper without adding any element to the dom
      isAnimated: false,
      rootElement: 'body',
      // give the choice to place backdrop under different elements
      clickCallback: null
    };
    const DefaultType$7 = {
      className: 'string',
      isVisible: 'boolean',
      isAnimated: 'boolean',
      rootElement: '(element|string)',
      clickCallback: '(function|null)'
    };
    const NAME$8 = 'backdrop';
    const CLASS_NAME_FADE$4 = 'fade';
    const CLASS_NAME_SHOW$5 = 'show';
    const EVENT_MOUSEDOWN = `mousedown.bs.${NAME$8}`;
  
    class Backdrop {
      constructor(config) {
        this._config = this._getConfig(config);
        this._isAppended = false;
        this._element = null;
      }
  
      show(callback) {
        if (!this._config.isVisible) {
          execute(callback);
          return;
        }
  
        this._append();
  
        if (this._config.isAnimated) {
          reflow(this._getElement());
        }
  
        this._getElement().classList.add(CLASS_NAME_SHOW$5);
  
        this._emulateAnimation(() => {
          execute(callback);
        });
      }
  
      hide(callback) {
        if (!this._config.isVisible) {
          execute(callback);
          return;
        }
  
        this._getElement().classList.remove(CLASS_NAME_SHOW$5);
  
        this._emulateAnimation(() => {
          this.dispose();
          execute(callback);
        });
      } // Private
  
  
      _getElement() {
        if (!this._element) {
          const backdrop = document.createElement('div');
          backdrop.className = this._config.className;
  
          if (this._config.isAnimated) {
            backdrop.classList.add(CLASS_NAME_FADE$4);
          }
  
          this._element = backdrop;
        }
  
        return this._element;
      }
  
      _getConfig(config) {
        config = { ...Default$7,
          ...(typeof config === 'object' ? config : {})
        }; // use getElement() with the default "body" to get a fresh Element on each instantiation
  
        config.rootElement = getElement(config.rootElement);
        typeCheckConfig(NAME$8, config, DefaultType$7);
        return config;
      }
  
      _append() {
        if (this._isAppended) {
          return;
        }
  
        this._config.rootElement.append(this._getElement());
  
        EventHandler.on(this._getElement(), EVENT_MOUSEDOWN, () => {
          execute(this._config.clickCallback);
        });
        this._isAppended = true;
      }
  
      dispose() {
        if (!this._isAppended) {
          return;
        }
  
        EventHandler.off(this._element, EVENT_MOUSEDOWN);
  
        this._element.remove();
  
        this._isAppended = false;
      }
  
      _emulateAnimation(callback) {
        executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
      }
  
    }
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): util/focustrap.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    const Default$6 = {
      trapElement: null,
      // The element to trap focus inside of
      autofocus: true
    };
    const DefaultType$6 = {
      trapElement: 'element',
      autofocus: 'boolean'
    };
    const NAME$7 = 'focustrap';
    const DATA_KEY$7 = 'bs.focustrap';
    const EVENT_KEY$7 = `.${DATA_KEY$7}`;
    const EVENT_FOCUSIN$1 = `focusin${EVENT_KEY$7}`;
    const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY$7}`;
    const TAB_KEY = 'Tab';
    const TAB_NAV_FORWARD = 'forward';
    const TAB_NAV_BACKWARD = 'backward';
  
    class FocusTrap {
      constructor(config) {
        this._config = this._getConfig(config);
        this._isActive = false;
        this._lastTabNavDirection = null;
      }
  
      activate() {
        const {
          trapElement,
          autofocus
        } = this._config;
  
        if (this._isActive) {
          return;
        }
  
        if (autofocus) {
          trapElement.focus();
        }
  
        EventHandler.off(document, EVENT_KEY$7); // guard against infinite focus loop
  
        EventHandler.on(document, EVENT_FOCUSIN$1, event => this._handleFocusin(event));
        EventHandler.on(document, EVENT_KEYDOWN_TAB, event => this._handleKeydown(event));
        this._isActive = true;
      }
  
      deactivate() {
        if (!this._isActive) {
          return;
        }
  
        this._isActive = false;
        EventHandler.off(document, EVENT_KEY$7);
      } // Private
  
  
      _handleFocusin(event) {
        const {
          target
        } = event;
        const {
          trapElement
        } = this._config;
  
        if (target === document || target === trapElement || trapElement.contains(target)) {
          return;
        }
  
        const elements = SelectorEngine.focusableChildren(trapElement);
  
        if (elements.length === 0) {
          trapElement.focus();
        } else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) {
          elements[elements.length - 1].focus();
        } else {
          elements[0].focus();
        }
      }
  
      _handleKeydown(event) {
        if (event.key !== TAB_KEY) {
          return;
        }
  
        this._lastTabNavDirection = event.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD;
      }
  
      _getConfig(config) {
        config = { ...Default$6,
          ...(typeof config === 'object' ? config : {})
        };
        typeCheckConfig(NAME$7, config, DefaultType$6);
        return config;
      }
  
    }
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): modal.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
  
    const NAME$6 = 'modal';
    const DATA_KEY$6 = 'bs.modal';
    const EVENT_KEY$6 = `.${DATA_KEY$6}`;
    const DATA_API_KEY$3 = '.data-api';
    const ESCAPE_KEY$1 = 'Escape';
    const Default$5 = {
      backdrop: true,
      keyboard: true,
      focus: true
    };
    const DefaultType$5 = {
      backdrop: '(boolean|string)',
      keyboard: 'boolean',
      focus: 'boolean'
    };
    const EVENT_HIDE$3 = `hide${EVENT_KEY$6}`;
    const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY$6}`;
    const EVENT_HIDDEN$3 = `hidden${EVENT_KEY$6}`;
    const EVENT_SHOW$3 = `show${EVENT_KEY$6}`;
    const EVENT_SHOWN$3 = `shown${EVENT_KEY$6}`;
    const EVENT_RESIZE = `resize${EVENT_KEY$6}`;
    const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY$6}`;
    const EVENT_KEYDOWN_DISMISS$1 = `keydown.dismiss${EVENT_KEY$6}`;
    const EVENT_MOUSEUP_DISMISS = `mouseup.dismiss${EVENT_KEY$6}`;
    const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY$6}`;
    const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
    const CLASS_NAME_OPEN = 'modal-open';
    const CLASS_NAME_FADE$3 = 'fade';
    const CLASS_NAME_SHOW$4 = 'show';
    const CLASS_NAME_STATIC = 'modal-static';
    const OPEN_SELECTOR$1 = '.modal.show';
    const SELECTOR_DIALOG = '.modal-dialog';
    const SELECTOR_MODAL_BODY = '.modal-body';
    const SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]';
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
  
    class Modal extends BaseComponent {
      constructor(element, config) {
        super(element);
        this._config = this._getConfig(config);
        this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
        this._backdrop = this._initializeBackDrop();
        this._focustrap = this._initializeFocusTrap();
        this._isShown = false;
        this._ignoreBackdropClick = false;
        this._isTransitioning = false;
        this._scrollBar = new ScrollBarHelper();
      } // Getters
  
  
      static get Default() {
        return Default$5;
      }
  
      static get NAME() {
        return NAME$6;
      } // Public
  
  
      toggle(relatedTarget) {
        return this._isShown ? this.hide() : this.show(relatedTarget);
      }
  
      show(relatedTarget) {
        if (this._isShown || this._isTransitioning) {
          return;
        }
  
        const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$3, {
          relatedTarget
        });
  
        if (showEvent.defaultPrevented) {
          return;
        }
  
        this._isShown = true;
  
        if (this._isAnimated()) {
          this._isTransitioning = true;
        }
  
        this._scrollBar.hide();
  
        document.body.classList.add(CLASS_NAME_OPEN);
  
        this._adjustDialog();
  
        this._setEscapeEvent();
  
        this._setResizeEvent();
  
        EventHandler.on(this._dialog, EVENT_MOUSEDOWN_DISMISS, () => {
          EventHandler.one(this._element, EVENT_MOUSEUP_DISMISS, event => {
            if (event.target === this._element) {
              this._ignoreBackdropClick = true;
            }
          });
        });
  
        this._showBackdrop(() => this._showElement(relatedTarget));
      }
  
      hide() {
        if (!this._isShown || this._isTransitioning) {
          return;
        }
  
        const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$3);
  
        if (hideEvent.defaultPrevented) {
          return;
        }
  
        this._isShown = false;
  
        const isAnimated = this._isAnimated();
  
        if (isAnimated) {
          this._isTransitioning = true;
        }
  
        this._setEscapeEvent();
  
        this._setResizeEvent();
  
        this._focustrap.deactivate();
  
        this._element.classList.remove(CLASS_NAME_SHOW$4);
  
        EventHandler.off(this._element, EVENT_CLICK_DISMISS);
        EventHandler.off(this._dialog, EVENT_MOUSEDOWN_DISMISS);
  
        this._queueCallback(() => this._hideModal(), this._element, isAnimated);
      }
  
      dispose() {
        [window, this._dialog].forEach(htmlElement => EventHandler.off(htmlElement, EVENT_KEY$6));
  
        this._backdrop.dispose();
  
        this._focustrap.deactivate();
  
        super.dispose();
      }
  
      handleUpdate() {
        this._adjustDialog();
      } // Private
  
  
      _initializeBackDrop() {
        return new Backdrop({
          isVisible: Boolean(this._config.backdrop),
          // 'static' option will be translated to true, and booleans will keep their value
          isAnimated: this._isAnimated()
        });
      }
  
      _initializeFocusTrap() {
        return new FocusTrap({
          trapElement: this._element
        });
      }
  
      _getConfig(config) {
        config = { ...Default$5,
          ...Manipulator.getDataAttributes(this._element),
          ...(typeof config === 'object' ? config : {})
        };
        typeCheckConfig(NAME$6, config, DefaultType$5);
        return config;
      }
  
      _showElement(relatedTarget) {
        const isAnimated = this._isAnimated();
  
        const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);
  
        if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
          // Don't move modal's DOM position
          document.body.append(this._element);
        }
  
        this._element.style.display = 'block';
  
        this._element.removeAttribute('aria-hidden');
  
        this._element.setAttribute('aria-modal', true);
  
        this._element.setAttribute('role', 'dialog');
  
        this._element.scrollTop = 0;
  
        if (modalBody) {
          modalBody.scrollTop = 0;
        }
  
        if (isAnimated) {
          reflow(this._element);
        }
  
        this._element.classList.add(CLASS_NAME_SHOW$4);
  
        const transitionComplete = () => {
          if (this._config.focus) {
            this._focustrap.activate();
          }
  
          this._isTransitioning = false;
          EventHandler.trigger(this._element, EVENT_SHOWN$3, {
            relatedTarget
          });
        };
  
        this._queueCallback(transitionComplete, this._dialog, isAnimated);
      }
  
      _setEscapeEvent() {
        if (this._isShown) {
          EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS$1, event => {
            if (this._config.keyboard && event.key === ESCAPE_KEY$1) {
              event.preventDefault();
              this.hide();
            } else if (!this._config.keyboard && event.key === ESCAPE_KEY$1) {
              this._triggerBackdropTransition();
            }
          });
        } else {
          EventHandler.off(this._element, EVENT_KEYDOWN_DISMISS$1);
        }
      }
  
      _setResizeEvent() {
        if (this._isShown) {
          EventHandler.on(window, EVENT_RESIZE, () => this._adjustDialog());
        } else {
          EventHandler.off(window, EVENT_RESIZE);
        }
      }
  
      _hideModal() {
        this._element.style.display = 'none';
  
        this._element.setAttribute('aria-hidden', true);
  
        this._element.removeAttribute('aria-modal');
  
        this._element.removeAttribute('role');
  
        this._isTransitioning = false;
  
        this._backdrop.hide(() => {
          document.body.classList.remove(CLASS_NAME_OPEN);
  
          this._resetAdjustments();
  
          this._scrollBar.reset();
  
          EventHandler.trigger(this._element, EVENT_HIDDEN$3);
        });
      }
  
      _showBackdrop(callback) {
        EventHandler.on(this._element, EVENT_CLICK_DISMISS, event => {
          if (this._ignoreBackdropClick) {
            this._ignoreBackdropClick = false;
            return;
          }
  
          if (event.target !== event.currentTarget) {
            return;
          }
  
          if (this._config.backdrop === true) {
            this.hide();
          } else if (this._config.backdrop === 'static') {
            this._triggerBackdropTransition();
          }
        });
  
        this._backdrop.show(callback);
      }
  
      _isAnimated() {
        return this._element.classList.contains(CLASS_NAME_FADE$3);
      }
  
      _triggerBackdropTransition() {
        const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
  
        if (hideEvent.defaultPrevented) {
          return;
        }
  
        const {
          classList,
          scrollHeight,
          style
        } = this._element;
        const isModalOverflowing = scrollHeight > document.documentElement.clientHeight; // return if the following background transition hasn't yet completed
  
        if (!isModalOverflowing && style.overflowY === 'hidden' || classList.contains(CLASS_NAME_STATIC)) {
          return;
        }
  
        if (!isModalOverflowing) {
          style.overflowY = 'hidden';
        }
  
        classList.add(CLASS_NAME_STATIC);
  
        this._queueCallback(() => {
          classList.remove(CLASS_NAME_STATIC);
  
          if (!isModalOverflowing) {
            this._queueCallback(() => {
              style.overflowY = '';
            }, this._dialog);
          }
        }, this._dialog);
  
        this._element.focus();
      } // ----------------------------------------------------------------------
      // the following methods are used to handle overflowing modals
      // ----------------------------------------------------------------------
  
  
      _adjustDialog() {
        const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
  
        const scrollbarWidth = this._scrollBar.getWidth();
  
        const isBodyOverflowing = scrollbarWidth > 0;
  
        if (!isBodyOverflowing && isModalOverflowing && !isRTL() || isBodyOverflowing && !isModalOverflowing && isRTL()) {
          this._element.style.paddingLeft = `${scrollbarWidth}px`;
        }
  
        if (isBodyOverflowing && !isModalOverflowing && !isRTL() || !isBodyOverflowing && isModalOverflowing && isRTL()) {
          this._element.style.paddingRight = `${scrollbarWidth}px`;
        }
      }
  
      _resetAdjustments() {
        this._element.style.paddingLeft = '';
        this._element.style.paddingRight = '';
      } // Static
  
  
      static jQueryInterface(config, relatedTarget) {
        return this.each(function () {
          const data = Modal.getOrCreateInstance(this, config);
  
          if (typeof config !== 'string') {
            return;
          }
  
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }
  
          data[config](relatedTarget);
        });
      }
  
    }
    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */
  
  
    EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function (event) {
      const target = getElementFromSelector(this);
  
      if (['A', 'AREA'].includes(this.tagName)) {
        event.preventDefault();
      }
  
      EventHandler.one(target, EVENT_SHOW$3, showEvent => {
        if (showEvent.defaultPrevented) {
          // only register focus restorer if modal will actually get shown
          return;
        }
  
        EventHandler.one(target, EVENT_HIDDEN$3, () => {
          if (isVisible(this)) {
            this.focus();
          }
        });
      }); // avoid conflict when clicking moddal toggler while another one is open
  
      const allReadyOpen = SelectorEngine.findOne(OPEN_SELECTOR$1);
  
      if (allReadyOpen) {
        Modal.getInstance(allReadyOpen).hide();
      }
  
      const data = Modal.getOrCreateInstance(target);
      data.toggle(this);
    });
    enableDismissTrigger(Modal);
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     * add .Modal to jQuery only if jQuery is present
     */
  
    defineJQueryPlugin(Modal);
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): offcanvas.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
  
    const NAME$5 = 'offcanvas';
    const DATA_KEY$5 = 'bs.offcanvas';
    const EVENT_KEY$5 = `.${DATA_KEY$5}`;
    const DATA_API_KEY$2 = '.data-api';
    const EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$5}${DATA_API_KEY$2}`;
    const ESCAPE_KEY = 'Escape';
    const Default$4 = {
      backdrop: true,
      keyboard: true,
      scroll: false
    };
    const DefaultType$4 = {
      backdrop: 'boolean',
      keyboard: 'boolean',
      scroll: 'boolean'
    };
    const CLASS_NAME_SHOW$3 = 'show';
    const CLASS_NAME_BACKDROP = 'offcanvas-backdrop';
    const OPEN_SELECTOR = '.offcanvas.show';
    const EVENT_SHOW$2 = `show${EVENT_KEY$5}`;
    const EVENT_SHOWN$2 = `shown${EVENT_KEY$5}`;
    const EVENT_HIDE$2 = `hide${EVENT_KEY$5}`;
    const EVENT_HIDDEN$2 = `hidden${EVENT_KEY$5}`;
    const EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$5}${DATA_API_KEY$2}`;
    const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY$5}`;
    const SELECTOR_DATA_TOGGLE$1 = '[data-bs-toggle="offcanvas"]';
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
  
    class Offcanvas extends BaseComponent {
      constructor(element, config) {
        super(element);
        this._config = this._getConfig(config);
        this._isShown = false;
        this._backdrop = this._initializeBackDrop();
        this._focustrap = this._initializeFocusTrap();
  
        this._addEventListeners();
      } // Getters
  
  
      static get NAME() {
        return NAME$5;
      }
  
      static get Default() {
        return Default$4;
      } // Public
  
  
      toggle(relatedTarget) {
        return this._isShown ? this.hide() : this.show(relatedTarget);
      }
  
      show(relatedTarget) {
        if (this._isShown) {
          return;
        }
  
        const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$2, {
          relatedTarget
        });
  
        if (showEvent.defaultPrevented) {
          return;
        }
  
        this._isShown = true;
        this._element.style.visibility = 'visible';
  
        this._backdrop.show();
  
        if (!this._config.scroll) {
          new ScrollBarHelper().hide();
        }
  
        this._element.removeAttribute('aria-hidden');
  
        this._element.setAttribute('aria-modal', true);
  
        this._element.setAttribute('role', 'dialog');
  
        this._element.classList.add(CLASS_NAME_SHOW$3);
  
        const completeCallBack = () => {
          if (!this._config.scroll) {
            this._focustrap.activate();
          }
  
          EventHandler.trigger(this._element, EVENT_SHOWN$2, {
            relatedTarget
          });
        };
  
        this._queueCallback(completeCallBack, this._element, true);
      }
  
      hide() {
        if (!this._isShown) {
          return;
        }
  
        const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$2);
  
        if (hideEvent.defaultPrevented) {
          return;
        }
  
        this._focustrap.deactivate();
  
        this._element.blur();
  
        this._isShown = false;
  
        this._element.classList.remove(CLASS_NAME_SHOW$3);
  
        this._backdrop.hide();
  
        const completeCallback = () => {
          this._element.setAttribute('aria-hidden', true);
  
          this._element.removeAttribute('aria-modal');
  
          this._element.removeAttribute('role');
  
          this._element.style.visibility = 'hidden';
  
          if (!this._config.scroll) {
            new ScrollBarHelper().reset();
          }
  
          EventHandler.trigger(this._element, EVENT_HIDDEN$2);
        };
  
        this._queueCallback(completeCallback, this._element, true);
      }
  
      dispose() {
        this._backdrop.dispose();
  
        this._focustrap.deactivate();
  
        super.dispose();
      } // Private
  
  
      _getConfig(config) {
        config = { ...Default$4,
          ...Manipulator.getDataAttributes(this._element),
          ...(typeof config === 'object' ? config : {})
        };
        typeCheckConfig(NAME$5, config, DefaultType$4);
        return config;
      }
  
      _initializeBackDrop() {
        return new Backdrop({
          className: CLASS_NAME_BACKDROP,
          isVisible: this._config.backdrop,
          isAnimated: true,
          rootElement: this._element.parentNode,
          clickCallback: () => this.hide()
        });
      }
  
      _initializeFocusTrap() {
        return new FocusTrap({
          trapElement: this._element
        });
      }
  
      _addEventListeners() {
        EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, event => {
          if (this._config.keyboard && event.key === ESCAPE_KEY) {
            this.hide();
          }
        });
      } // Static
  
  
      static jQueryInterface(config) {
        return this.each(function () {
          const data = Offcanvas.getOrCreateInstance(this, config);
  
          if (typeof config !== 'string') {
            return;
          }
  
          if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
            throw new TypeError(`No method named "${config}"`);
          }
  
          data[config](this);
        });
      }
  
    }
    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */
  
  
    EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function (event) {
      const target = getElementFromSelector(this);
  
      if (['A', 'AREA'].includes(this.tagName)) {
        event.preventDefault();
      }
  
      if (isDisabled(this)) {
        return;
      }
  
      EventHandler.one(target, EVENT_HIDDEN$2, () => {
        // focus on trigger when it is closed
        if (isVisible(this)) {
          this.focus();
        }
      }); // avoid conflict when clicking a toggler of an offcanvas, while another is open
  
      const allReadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);
  
      if (allReadyOpen && allReadyOpen !== target) {
        Offcanvas.getInstance(allReadyOpen).hide();
      }
  
      const data = Offcanvas.getOrCreateInstance(target);
      data.toggle(this);
    });
    EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => SelectorEngine.find(OPEN_SELECTOR).forEach(el => Offcanvas.getOrCreateInstance(el).show()));
    enableDismissTrigger(Offcanvas);
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */
  
    defineJQueryPlugin(Offcanvas);
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): util/sanitizer.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    const uriAttributes = new Set(['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href']);
    const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
    /**
     * A pattern that recognizes a commonly useful subset of URLs that are safe.
     *
     * Shoutout to Angular https://github.com/angular/angular/blob/12.2.x/packages/core/src/sanitization/url_sanitizer.ts
     */
  
    const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^#&/:?]*(?:[#/?]|$))/i;
    /**
     * A pattern that matches safe data URLs. Only matches image, video and audio types.
     *
     * Shoutout to Angular https://github.com/angular/angular/blob/12.2.x/packages/core/src/sanitization/url_sanitizer.ts
     */
  
    const DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i;
  
    const allowedAttribute = (attribute, allowedAttributeList) => {
      const attributeName = attribute.nodeName.toLowerCase();
  
      if (allowedAttributeList.includes(attributeName)) {
        if (uriAttributes.has(attributeName)) {
          return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue) || DATA_URL_PATTERN.test(attribute.nodeValue));
        }
  
        return true;
      }
  
      const regExp = allowedAttributeList.filter(attributeRegex => attributeRegex instanceof RegExp); // Check if a regular expression validates the attribute.
  
      for (let i = 0, len = regExp.length; i < len; i++) {
        if (regExp[i].test(attributeName)) {
          return true;
        }
      }
  
      return false;
    };
  
    const DefaultAllowlist = {
      // Global attributes allowed on any supplied element below.
      '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
      a: ['target', 'href', 'title', 'rel'],
      area: [],
      b: [],
      br: [],
      col: [],
      code: [],
      div: [],
      em: [],
      hr: [],
      h1: [],
      h2: [],
      h3: [],
      h4: [],
      h5: [],
      h6: [],
      i: [],
      img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
      li: [],
      ol: [],
      p: [],
      pre: [],
      s: [],
      small: [],
      span: [],
      sub: [],
      sup: [],
      strong: [],
      u: [],
      ul: []
    };
    function sanitizeHtml(unsafeHtml, allowList, sanitizeFn) {
      if (!unsafeHtml.length) {
        return unsafeHtml;
      }
  
      if (sanitizeFn && typeof sanitizeFn === 'function') {
        return sanitizeFn(unsafeHtml);
      }
  
      const domParser = new window.DOMParser();
      const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
      const elements = [].concat(...createdDocument.body.querySelectorAll('*'));
  
      for (let i = 0, len = elements.length; i < len; i++) {
        const element = elements[i];
        const elementName = element.nodeName.toLowerCase();
  
        if (!Object.keys(allowList).includes(elementName)) {
          element.remove();
          continue;
        }
  
        const attributeList = [].concat(...element.attributes);
        const allowedAttributes = [].concat(allowList['*'] || [], allowList[elementName] || []);
        attributeList.forEach(attribute => {
          if (!allowedAttribute(attribute, allowedAttributes)) {
            element.removeAttribute(attribute.nodeName);
          }
        });
      }
  
      return createdDocument.body.innerHTML;
    }
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): tooltip.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
  
    const NAME$4 = 'tooltip';
    const DATA_KEY$4 = 'bs.tooltip';
    const EVENT_KEY$4 = `.${DATA_KEY$4}`;
    const CLASS_PREFIX$1 = 'bs-tooltip';
    const DISALLOWED_ATTRIBUTES = new Set(['sanitize', 'allowList', 'sanitizeFn']);
    const DefaultType$3 = {
      animation: 'boolean',
      template: 'string',
      title: '(string|element|function)',
      trigger: 'string',
      delay: '(number|object)',
      html: 'boolean',
      selector: '(string|boolean)',
      placement: '(string|function)',
      offset: '(array|string|function)',
      container: '(string|element|boolean)',
      fallbackPlacements: 'array',
      boundary: '(string|element)',
      customClass: '(string|function)',
      sanitize: 'boolean',
      sanitizeFn: '(null|function)',
      allowList: 'object',
      popperConfig: '(null|object|function)'
    };
    const AttachmentMap = {
      AUTO: 'auto',
      TOP: 'top',
      RIGHT: isRTL() ? 'left' : 'right',
      BOTTOM: 'bottom',
      LEFT: isRTL() ? 'right' : 'left'
    };
    const Default$3 = {
      animation: true,
      template: '<div class="tooltip" role="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-inner"></div>' + '</div>',
      trigger: 'hover focus',
      title: '',
      delay: 0,
      html: false,
      selector: false,
      placement: 'top',
      offset: [0, 0],
      container: false,
      fallbackPlacements: ['top', 'right', 'bottom', 'left'],
      boundary: 'clippingParents',
      customClass: '',
      sanitize: true,
      sanitizeFn: null,
      allowList: DefaultAllowlist,
      popperConfig: null
    };
    const Event$2 = {
      HIDE: `hide${EVENT_KEY$4}`,
      HIDDEN: `hidden${EVENT_KEY$4}`,
      SHOW: `show${EVENT_KEY$4}`,
      SHOWN: `shown${EVENT_KEY$4}`,
      INSERTED: `inserted${EVENT_KEY$4}`,
      CLICK: `click${EVENT_KEY$4}`,
      FOCUSIN: `focusin${EVENT_KEY$4}`,
      FOCUSOUT: `focusout${EVENT_KEY$4}`,
      MOUSEENTER: `mouseenter${EVENT_KEY$4}`,
      MOUSELEAVE: `mouseleave${EVENT_KEY$4}`
    };
    const CLASS_NAME_FADE$2 = 'fade';
    const CLASS_NAME_MODAL = 'modal';
    const CLASS_NAME_SHOW$2 = 'show';
    const HOVER_STATE_SHOW = 'show';
    const HOVER_STATE_OUT = 'out';
    const SELECTOR_TOOLTIP_INNER = '.tooltip-inner';
    const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`;
    const EVENT_MODAL_HIDE = 'hide.bs.modal';
    const TRIGGER_HOVER = 'hover';
    const TRIGGER_FOCUS = 'focus';
    const TRIGGER_CLICK = 'click';
    const TRIGGER_MANUAL = 'manual';
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
  
    class Tooltip extends BaseComponent {
      constructor(element, config) {
        if (typeof Popper__namespace === 'undefined') {
          throw new TypeError('Bootstrap\'s tooltips require Popper (https://popper.js.org)');
        }
  
        super(element); // private
  
        this._isEnabled = true;
        this._timeout = 0;
        this._hoverState = '';
        this._activeTrigger = {};
        this._popper = null; // Protected
  
        this._config = this._getConfig(config);
        this.tip = null;
  
        this._setListeners();
      } // Getters
  
  
      static get Default() {
        return Default$3;
      }
  
      static get NAME() {
        return NAME$4;
      }
  
      static get Event() {
        return Event$2;
      }
  
      static get DefaultType() {
        return DefaultType$3;
      } // Public
  
  
      enable() {
        this._isEnabled = true;
      }
  
      disable() {
        this._isEnabled = false;
      }
  
      toggleEnabled() {
        this._isEnabled = !this._isEnabled;
      }
  
      toggle(event) {
        if (!this._isEnabled) {
          return;
        }
  
        if (event) {
          const context = this._initializeOnDelegatedTarget(event);
  
          context._activeTrigger.click = !context._activeTrigger.click;
  
          if (context._isWithActiveTrigger()) {
            context._enter(null, context);
          } else {
            context._leave(null, context);
          }
        } else {
          if (this.getTipElement().classList.contains(CLASS_NAME_SHOW$2)) {
            this._leave(null, this);
  
            return;
          }
  
          this._enter(null, this);
        }
      }
  
      dispose() {
        clearTimeout(this._timeout);
        EventHandler.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
  
        if (this.tip) {
          this.tip.remove();
        }
  
        this._disposePopper();
  
        super.dispose();
      }
  
      show() {
        if (this._element.style.display === 'none') {
          throw new Error('Please use show on visible elements');
        }
  
        if (!(this.isWithContent() && this._isEnabled)) {
          return;
        }
  
        const showEvent = EventHandler.trigger(this._element, this.constructor.Event.SHOW);
        const shadowRoot = findShadowRoot(this._element);
        const isInTheDom = shadowRoot === null ? this._element.ownerDocument.documentElement.contains(this._element) : shadowRoot.contains(this._element);
  
        if (showEvent.defaultPrevented || !isInTheDom) {
          return;
        } // A trick to recreate a tooltip in case a new title is given by using the NOT documented `data-bs-original-title`
        // This will be removed later in favor of a `setContent` method
  
  
        if (this.constructor.NAME === 'tooltip' && this.tip && this.getTitle() !== this.tip.querySelector(SELECTOR_TOOLTIP_INNER).innerHTML) {
          this._disposePopper();
  
          this.tip.remove();
          this.tip = null;
        }
  
        const tip = this.getTipElement();
        const tipId = getUID(this.constructor.NAME);
        tip.setAttribute('id', tipId);
  
        this._element.setAttribute('aria-describedby', tipId);
  
        if (this._config.animation) {
          tip.classList.add(CLASS_NAME_FADE$2);
        }
  
        const placement = typeof this._config.placement === 'function' ? this._config.placement.call(this, tip, this._element) : this._config.placement;
  
        const attachment = this._getAttachment(placement);
  
        this._addAttachmentClass(attachment);
  
        const {
          container
        } = this._config;
        Data.set(tip, this.constructor.DATA_KEY, this);
  
        if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
          container.append(tip);
          EventHandler.trigger(this._element, this.constructor.Event.INSERTED);
        }
  
        if (this._popper) {
          this._popper.update();
        } else {
          this._popper = Popper__namespace.createPopper(this._element, tip, this._getPopperConfig(attachment));
        }
  
        tip.classList.add(CLASS_NAME_SHOW$2);
  
        const customClass = this._resolvePossibleFunction(this._config.customClass);
  
        if (customClass) {
          tip.classList.add(...customClass.split(' '));
        } // If this is a touch-enabled device we add extra
        // empty mouseover listeners to the body's immediate children;
        // only needed because of broken event delegation on iOS
        // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
  
  
        if ('ontouchstart' in document.documentElement) {
          [].concat(...document.body.children).forEach(element => {
            EventHandler.on(element, 'mouseover', noop);
          });
        }
  
        const complete = () => {
          const prevHoverState = this._hoverState;
          this._hoverState = null;
          EventHandler.trigger(this._element, this.constructor.Event.SHOWN);
  
          if (prevHoverState === HOVER_STATE_OUT) {
            this._leave(null, this);
          }
        };
  
        const isAnimated = this.tip.classList.contains(CLASS_NAME_FADE$2);
  
        this._queueCallback(complete, this.tip, isAnimated);
      }
  
      hide() {
        if (!this._popper) {
          return;
        }
  
        const tip = this.getTipElement();
  
        const complete = () => {
          if (this._isWithActiveTrigger()) {
            return;
          }
  
          if (this._hoverState !== HOVER_STATE_SHOW) {
            tip.remove();
          }
  
          this._cleanTipClass();
  
          this._element.removeAttribute('aria-describedby');
  
          EventHandler.trigger(this._element, this.constructor.Event.HIDDEN);
  
          this._disposePopper();
        };
  
        const hideEvent = EventHandler.trigger(this._element, this.constructor.Event.HIDE);
  
        if (hideEvent.defaultPrevented) {
          return;
        }
  
        tip.classList.remove(CLASS_NAME_SHOW$2); // If this is a touch-enabled device we remove the extra
        // empty mouseover listeners we added for iOS support
  
        if ('ontouchstart' in document.documentElement) {
          [].concat(...document.body.children).forEach(element => EventHandler.off(element, 'mouseover', noop));
        }
  
        this._activeTrigger[TRIGGER_CLICK] = false;
        this._activeTrigger[TRIGGER_FOCUS] = false;
        this._activeTrigger[TRIGGER_HOVER] = false;
        const isAnimated = this.tip.classList.contains(CLASS_NAME_FADE$2);
  
        this._queueCallback(complete, this.tip, isAnimated);
  
        this._hoverState = '';
      }
  
      update() {
        if (this._popper !== null) {
          this._popper.update();
        }
      } // Protected
  
  
      isWithContent() {
        return Boolean(this.getTitle());
      }
  
      getTipElement() {
        if (this.tip) {
          return this.tip;
        }
  
        const element = document.createElement('div');
        element.innerHTML = this._config.template;
        const tip = element.children[0];
        this.setContent(tip);
        tip.classList.remove(CLASS_NAME_FADE$2, CLASS_NAME_SHOW$2);
        this.tip = tip;
        return this.tip;
      }
  
      setContent(tip) {
        this._sanitizeAndSetContent(tip, this.getTitle(), SELECTOR_TOOLTIP_INNER);
      }
  
      _sanitizeAndSetContent(template, content, selector) {
        const templateElement = SelectorEngine.findOne(selector, template);
  
        if (!content && templateElement) {
          templateElement.remove();
          return;
        } // we use append for html objects to maintain js events
  
  
        this.setElementContent(templateElement, content);
      }
  
      setElementContent(element, content) {
        if (element === null) {
          return;
        }
  
        if (isElement(content)) {
          content = getElement(content); // content is a DOM node or a jQuery
  
          if (this._config.html) {
            if (content.parentNode !== element) {
              element.innerHTML = '';
              element.append(content);
            }
          } else {
            element.textContent = content.textContent;
          }
  
          return;
        }
  
        if (this._config.html) {
          if (this._config.sanitize) {
            content = sanitizeHtml(content, this._config.allowList, this._config.sanitizeFn);
          }
  
          element.innerHTML = content;
        } else {
          element.textContent = content;
        }
      }
  
      getTitle() {
        const title = this._element.getAttribute('data-bs-original-title') || this._config.title;
  
        return this._resolvePossibleFunction(title);
      }
  
      updateAttachment(attachment) {
        if (attachment === 'right') {
          return 'end';
        }
  
        if (attachment === 'left') {
          return 'start';
        }
  
        return attachment;
      } // Private
  
  
      _initializeOnDelegatedTarget(event, context) {
        return context || this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig());
      }
  
      _getOffset() {
        const {
          offset
        } = this._config;
  
        if (typeof offset === 'string') {
          return offset.split(',').map(val => Number.parseInt(val, 10));
        }
  
        if (typeof offset === 'function') {
          return popperData => offset(popperData, this._element);
        }
  
        return offset;
      }
  
      _resolvePossibleFunction(content) {
        return typeof content === 'function' ? content.call(this._element) : content;
      }
  
      _getPopperConfig(attachment) {
        const defaultBsPopperConfig = {
          placement: attachment,
          modifiers: [{
            name: 'flip',
            options: {
              fallbackPlacements: this._config.fallbackPlacements
            }
          }, {
            name: 'offset',
            options: {
              offset: this._getOffset()
            }
          }, {
            name: 'preventOverflow',
            options: {
              boundary: this._config.boundary
            }
          }, {
            name: 'arrow',
            options: {
              element: `.${this.constructor.NAME}-arrow`
            }
          }, {
            name: 'onChange',
            enabled: true,
            phase: 'afterWrite',
            fn: data => this._handlePopperPlacementChange(data)
          }],
          onFirstUpdate: data => {
            if (data.options.placement !== data.placement) {
              this._handlePopperPlacementChange(data);
            }
          }
        };
        return { ...defaultBsPopperConfig,
          ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
        };
      }
  
      _addAttachmentClass(attachment) {
        this.getTipElement().classList.add(`${this._getBasicClassPrefix()}-${this.updateAttachment(attachment)}`);
      }
  
      _getAttachment(placement) {
        return AttachmentMap[placement.toUpperCase()];
      }
  
      _setListeners() {
        const triggers = this._config.trigger.split(' ');
  
        triggers.forEach(trigger => {
          if (trigger === 'click') {
            EventHandler.on(this._element, this.constructor.Event.CLICK, this._config.selector, event => this.toggle(event));
          } else if (trigger !== TRIGGER_MANUAL) {
            const eventIn = trigger === TRIGGER_HOVER ? this.constructor.Event.MOUSEENTER : this.constructor.Event.FOCUSIN;
            const eventOut = trigger === TRIGGER_HOVER ? this.constructor.Event.MOUSELEAVE : this.constructor.Event.FOCUSOUT;
            EventHandler.on(this._element, eventIn, this._config.selector, event => this._enter(event));
            EventHandler.on(this._element, eventOut, this._config.selector, event => this._leave(event));
          }
        });
  
        this._hideModalHandler = () => {
          if (this._element) {
            this.hide();
          }
        };
  
        EventHandler.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
  
        if (this._config.selector) {
          this._config = { ...this._config,
            trigger: 'manual',
            selector: ''
          };
        } else {
          this._fixTitle();
        }
      }
  
      _fixTitle() {
        const title = this._element.getAttribute('title');
  
        const originalTitleType = typeof this._element.getAttribute('data-bs-original-title');
  
        if (title || originalTitleType !== 'string') {
          this._element.setAttribute('data-bs-original-title', title || '');
  
          if (title && !this._element.getAttribute('aria-label') && !this._element.textContent) {
            this._element.setAttribute('aria-label', title);
          }
  
          this._element.setAttribute('title', '');
        }
      }
  
      _enter(event, context) {
        context = this._initializeOnDelegatedTarget(event, context);
  
        if (event) {
          context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
        }
  
        if (context.getTipElement().classList.contains(CLASS_NAME_SHOW$2) || context._hoverState === HOVER_STATE_SHOW) {
          context._hoverState = HOVER_STATE_SHOW;
          return;
        }
  
        clearTimeout(context._timeout);
        context._hoverState = HOVER_STATE_SHOW;
  
        if (!context._config.delay || !context._config.delay.show) {
          context.show();
          return;
        }
  
        context._timeout = setTimeout(() => {
          if (context._hoverState === HOVER_STATE_SHOW) {
            context.show();
          }
        }, context._config.delay.show);
      }
  
      _leave(event, context) {
        context = this._initializeOnDelegatedTarget(event, context);
  
        if (event) {
          context._activeTrigger[event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget);
        }
  
        if (context._isWithActiveTrigger()) {
          return;
        }
  
        clearTimeout(context._timeout);
        context._hoverState = HOVER_STATE_OUT;
  
        if (!context._config.delay || !context._config.delay.hide) {
          context.hide();
          return;
        }
  
        context._timeout = setTimeout(() => {
          if (context._hoverState === HOVER_STATE_OUT) {
            context.hide();
          }
        }, context._config.delay.hide);
      }
  
      _isWithActiveTrigger() {
        for (const trigger in this._activeTrigger) {
          if (this._activeTrigger[trigger]) {
            return true;
          }
        }
  
        return false;
      }
  
      _getConfig(config) {
        const dataAttributes = Manipulator.getDataAttributes(this._element);
        Object.keys(dataAttributes).forEach(dataAttr => {
          if (DISALLOWED_ATTRIBUTES.has(dataAttr)) {
            delete dataAttributes[dataAttr];
          }
        });
        config = { ...this.constructor.Default,
          ...dataAttributes,
          ...(typeof config === 'object' && config ? config : {})
        };
        config.container = config.container === false ? document.body : getElement(config.container);
  
        if (typeof config.delay === 'number') {
          config.delay = {
            show: config.delay,
            hide: config.delay
          };
        }
  
        if (typeof config.title === 'number') {
          config.title = config.title.toString();
        }
  
        if (typeof config.content === 'number') {
          config.content = config.content.toString();
        }
  
        typeCheckConfig(NAME$4, config, this.constructor.DefaultType);
  
        if (config.sanitize) {
          config.template = sanitizeHtml(config.template, config.allowList, config.sanitizeFn);
        }
  
        return config;
      }
  
      _getDelegateConfig() {
        const config = {};
  
        for (const key in this._config) {
          if (this.constructor.Default[key] !== this._config[key]) {
            config[key] = this._config[key];
          }
        } // In the future can be replaced with:
        // const keysWithDifferentValues = Object.entries(this._config).filter(entry => this.constructor.Default[entry[0]] !== this._config[entry[0]])
        // `Object.fromEntries(keysWithDifferentValues)`
  
  
        return config;
      }
  
      _cleanTipClass() {
        const tip = this.getTipElement();
        const basicClassPrefixRegex = new RegExp(`(^|\\s)${this._getBasicClassPrefix()}\\S+`, 'g');
        const tabClass = tip.getAttribute('class').match(basicClassPrefixRegex);
  
        if (tabClass !== null && tabClass.length > 0) {
          tabClass.map(token => token.trim()).forEach(tClass => tip.classList.remove(tClass));
        }
      }
  
      _getBasicClassPrefix() {
        return CLASS_PREFIX$1;
      }
  
      _handlePopperPlacementChange(popperData) {
        const {
          state
        } = popperData;
  
        if (!state) {
          return;
        }
  
        this.tip = state.elements.popper;
  
        this._cleanTipClass();
  
        this._addAttachmentClass(this._getAttachment(state.placement));
      }
  
      _disposePopper() {
        if (this._popper) {
          this._popper.destroy();
  
          this._popper = null;
        }
      } // Static
  
  
      static jQueryInterface(config) {
        return this.each(function () {
          const data = Tooltip.getOrCreateInstance(this, config);
  
          if (typeof config === 'string') {
            if (typeof data[config] === 'undefined') {
              throw new TypeError(`No method named "${config}"`);
            }
  
            data[config]();
          }
        });
      }
  
    }
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     * add .Tooltip to jQuery only if jQuery is present
     */
  
  
    defineJQueryPlugin(Tooltip);
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): popover.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
  
    const NAME$3 = 'popover';
    const DATA_KEY$3 = 'bs.popover';
    const EVENT_KEY$3 = `.${DATA_KEY$3}`;
    const CLASS_PREFIX = 'bs-popover';
    const Default$2 = { ...Tooltip.Default,
      placement: 'right',
      offset: [0, 8],
      trigger: 'click',
      content: '',
      template: '<div class="popover" role="tooltip">' + '<div class="popover-arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div>' + '</div>'
    };
    const DefaultType$2 = { ...Tooltip.DefaultType,
      content: '(string|element|function)'
    };
    const Event$1 = {
      HIDE: `hide${EVENT_KEY$3}`,
      HIDDEN: `hidden${EVENT_KEY$3}`,
      SHOW: `show${EVENT_KEY$3}`,
      SHOWN: `shown${EVENT_KEY$3}`,
      INSERTED: `inserted${EVENT_KEY$3}`,
      CLICK: `click${EVENT_KEY$3}`,
      FOCUSIN: `focusin${EVENT_KEY$3}`,
      FOCUSOUT: `focusout${EVENT_KEY$3}`,
      MOUSEENTER: `mouseenter${EVENT_KEY$3}`,
      MOUSELEAVE: `mouseleave${EVENT_KEY$3}`
    };
    const SELECTOR_TITLE = '.popover-header';
    const SELECTOR_CONTENT = '.popover-body';
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
  
    class Popover extends Tooltip {
      // Getters
      static get Default() {
        return Default$2;
      }
  
      static get NAME() {
        return NAME$3;
      }
  
      static get Event() {
        return Event$1;
      }
  
      static get DefaultType() {
        return DefaultType$2;
      } // Overrides
  
  
      isWithContent() {
        return this.getTitle() || this._getContent();
      }
  
      setContent(tip) {
        this._sanitizeAndSetContent(tip, this.getTitle(), SELECTOR_TITLE);
  
        this._sanitizeAndSetContent(tip, this._getContent(), SELECTOR_CONTENT);
      } // Private
  
  
      _getContent() {
        return this._resolvePossibleFunction(this._config.content);
      }
  
      _getBasicClassPrefix() {
        return CLASS_PREFIX;
      } // Static
  
  
      static jQueryInterface(config) {
        return this.each(function () {
          const data = Popover.getOrCreateInstance(this, config);
  
          if (typeof config === 'string') {
            if (typeof data[config] === 'undefined') {
              throw new TypeError(`No method named "${config}"`);
            }
  
            data[config]();
          }
        });
      }
  
    }
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     * add .Popover to jQuery only if jQuery is present
     */
  
  
    defineJQueryPlugin(Popover);
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): scrollspy.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
  
    const NAME$2 = 'scrollspy';
    const DATA_KEY$2 = 'bs.scrollspy';
    const EVENT_KEY$2 = `.${DATA_KEY$2}`;
    const DATA_API_KEY$1 = '.data-api';
    const Default$1 = {
      offset: 10,
      method: 'auto',
      target: ''
    };
    const DefaultType$1 = {
      offset: 'number',
      method: 'string',
      target: '(string|element)'
    };
    const EVENT_ACTIVATE = `activate${EVENT_KEY$2}`;
    const EVENT_SCROLL = `scroll${EVENT_KEY$2}`;
    const EVENT_LOAD_DATA_API = `load${EVENT_KEY$2}${DATA_API_KEY$1}`;
    const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
    const CLASS_NAME_ACTIVE$1 = 'active';
    const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
    const SELECTOR_NAV_LIST_GROUP$1 = '.nav, .list-group';
    const SELECTOR_NAV_LINKS = '.nav-link';
    const SELECTOR_NAV_ITEMS = '.nav-item';
    const SELECTOR_LIST_ITEMS = '.list-group-item';
    const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}, .${CLASS_NAME_DROPDOWN_ITEM}`;
    const SELECTOR_DROPDOWN$1 = '.dropdown';
    const SELECTOR_DROPDOWN_TOGGLE$1 = '.dropdown-toggle';
    const METHOD_OFFSET = 'offset';
    const METHOD_POSITION = 'position';
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
  
    class ScrollSpy extends BaseComponent {
      constructor(element, config) {
        super(element);
        this._scrollElement = this._element.tagName === 'BODY' ? window : this._element;
        this._config = this._getConfig(config);
        this._offsets = [];
        this._targets = [];
        this._activeTarget = null;
        this._scrollHeight = 0;
        EventHandler.on(this._scrollElement, EVENT_SCROLL, () => this._process());
        this.refresh();
  
        this._process();
      } // Getters
  
  
      static get Default() {
        return Default$1;
      }
  
      static get NAME() {
        return NAME$2;
      } // Public
  
  
      refresh() {
        const autoMethod = this._scrollElement === this._scrollElement.window ? METHOD_OFFSET : METHOD_POSITION;
        const offsetMethod = this._config.method === 'auto' ? autoMethod : this._config.method;
        const offsetBase = offsetMethod === METHOD_POSITION ? this._getScrollTop() : 0;
        this._offsets = [];
        this._targets = [];
        this._scrollHeight = this._getScrollHeight();
        const targets = SelectorEngine.find(SELECTOR_LINK_ITEMS, this._config.target);
        targets.map(element => {
          const targetSelector = getSelectorFromElement(element);
          const target = targetSelector ? SelectorEngine.findOne(targetSelector) : null;
  
          if (target) {
            const targetBCR = target.getBoundingClientRect();
  
            if (targetBCR.width || targetBCR.height) {
              return [Manipulator[offsetMethod](target).top + offsetBase, targetSelector];
            }
          }
  
          return null;
        }).filter(item => item).sort((a, b) => a[0] - b[0]).forEach(item => {
          this._offsets.push(item[0]);
  
          this._targets.push(item[1]);
        });
      }
  
      dispose() {
        EventHandler.off(this._scrollElement, EVENT_KEY$2);
        super.dispose();
      } // Private
  
  
      _getConfig(config) {
        config = { ...Default$1,
          ...Manipulator.getDataAttributes(this._element),
          ...(typeof config === 'object' && config ? config : {})
        };
        config.target = getElement(config.target) || document.documentElement;
        typeCheckConfig(NAME$2, config, DefaultType$1);
        return config;
      }
  
      _getScrollTop() {
        return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
      }
  
      _getScrollHeight() {
        return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      }
  
      _getOffsetHeight() {
        return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
      }
  
      _process() {
        const scrollTop = this._getScrollTop() + this._config.offset;
  
        const scrollHeight = this._getScrollHeight();
  
        const maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();
  
        if (this._scrollHeight !== scrollHeight) {
          this.refresh();
        }
  
        if (scrollTop >= maxScroll) {
          const target = this._targets[this._targets.length - 1];
  
          if (this._activeTarget !== target) {
            this._activate(target);
          }
  
          return;
        }
  
        if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
          this._activeTarget = null;
  
          this._clear();
  
          return;
        }
  
        for (let i = this._offsets.length; i--;) {
          const isActiveTarget = this._activeTarget !== this._targets[i] && scrollTop >= this._offsets[i] && (typeof this._offsets[i + 1] === 'undefined' || scrollTop < this._offsets[i + 1]);
  
          if (isActiveTarget) {
            this._activate(this._targets[i]);
          }
        }
      }
  
      _activate(target) {
        this._activeTarget = target;
  
        this._clear();
  
        const queries = SELECTOR_LINK_ITEMS.split(',').map(selector => `${selector}[data-bs-target="${target}"],${selector}[href="${target}"]`);
        const link = SelectorEngine.findOne(queries.join(','), this._config.target);
        link.classList.add(CLASS_NAME_ACTIVE$1);
  
        if (link.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
          SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1, link.closest(SELECTOR_DROPDOWN$1)).classList.add(CLASS_NAME_ACTIVE$1);
        } else {
          SelectorEngine.parents(link, SELECTOR_NAV_LIST_GROUP$1).forEach(listGroup => {
            // Set triggered links parents as active
            // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
            SelectorEngine.prev(listGroup, `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`).forEach(item => item.classList.add(CLASS_NAME_ACTIVE$1)); // Handle special case when .nav-link is inside .nav-item
  
            SelectorEngine.prev(listGroup, SELECTOR_NAV_ITEMS).forEach(navItem => {
              SelectorEngine.children(navItem, SELECTOR_NAV_LINKS).forEach(item => item.classList.add(CLASS_NAME_ACTIVE$1));
            });
          });
        }
  
        EventHandler.trigger(this._scrollElement, EVENT_ACTIVATE, {
          relatedTarget: target
        });
      }
  
      _clear() {
        SelectorEngine.find(SELECTOR_LINK_ITEMS, this._config.target).filter(node => node.classList.contains(CLASS_NAME_ACTIVE$1)).forEach(node => node.classList.remove(CLASS_NAME_ACTIVE$1));
      } // Static
  
  
      static jQueryInterface(config) {
        return this.each(function () {
          const data = ScrollSpy.getOrCreateInstance(this, config);
  
          if (typeof config !== 'string') {
            return;
          }
  
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }
  
          data[config]();
        });
      }
  
    }
    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */
  
  
    EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
      SelectorEngine.find(SELECTOR_DATA_SPY).forEach(spy => new ScrollSpy(spy));
    });
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     * add .ScrollSpy to jQuery only if jQuery is present
     */
  
    defineJQueryPlugin(ScrollSpy);
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): tab.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
  
    const NAME$1 = 'tab';
    const DATA_KEY$1 = 'bs.tab';
    const EVENT_KEY$1 = `.${DATA_KEY$1}`;
    const DATA_API_KEY = '.data-api';
    const EVENT_HIDE$1 = `hide${EVENT_KEY$1}`;
    const EVENT_HIDDEN$1 = `hidden${EVENT_KEY$1}`;
    const EVENT_SHOW$1 = `show${EVENT_KEY$1}`;
    const EVENT_SHOWN$1 = `shown${EVENT_KEY$1}`;
    const EVENT_CLICK_DATA_API = `click${EVENT_KEY$1}${DATA_API_KEY}`;
    const CLASS_NAME_DROPDOWN_MENU = 'dropdown-menu';
    const CLASS_NAME_ACTIVE = 'active';
    const CLASS_NAME_FADE$1 = 'fade';
    const CLASS_NAME_SHOW$1 = 'show';
    const SELECTOR_DROPDOWN = '.dropdown';
    const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
    const SELECTOR_ACTIVE = '.active';
    const SELECTOR_ACTIVE_UL = ':scope > li > .active';
    const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]';
    const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
    const SELECTOR_DROPDOWN_ACTIVE_CHILD = ':scope > .dropdown-menu .active';
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
  
    class Tab extends BaseComponent {
      // Getters
      static get NAME() {
        return NAME$1;
      } // Public
  
  
      show() {
        if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && this._element.classList.contains(CLASS_NAME_ACTIVE)) {
          return;
        }
  
        let previous;
        const target = getElementFromSelector(this._element);
  
        const listElement = this._element.closest(SELECTOR_NAV_LIST_GROUP);
  
        if (listElement) {
          const itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL' ? SELECTOR_ACTIVE_UL : SELECTOR_ACTIVE;
          previous = SelectorEngine.find(itemSelector, listElement);
          previous = previous[previous.length - 1];
        }
  
        const hideEvent = previous ? EventHandler.trigger(previous, EVENT_HIDE$1, {
          relatedTarget: this._element
        }) : null;
        const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$1, {
          relatedTarget: previous
        });
  
        if (showEvent.defaultPrevented || hideEvent !== null && hideEvent.defaultPrevented) {
          return;
        }
  
        this._activate(this._element, listElement);
  
        const complete = () => {
          EventHandler.trigger(previous, EVENT_HIDDEN$1, {
            relatedTarget: this._element
          });
          EventHandler.trigger(this._element, EVENT_SHOWN$1, {
            relatedTarget: previous
          });
        };
  
        if (target) {
          this._activate(target, target.parentNode, complete);
        } else {
          complete();
        }
      } // Private
  
  
      _activate(element, container, callback) {
        const activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL') ? SelectorEngine.find(SELECTOR_ACTIVE_UL, container) : SelectorEngine.children(container, SELECTOR_ACTIVE);
        const active = activeElements[0];
        const isTransitioning = callback && active && active.classList.contains(CLASS_NAME_FADE$1);
  
        const complete = () => this._transitionComplete(element, active, callback);
  
        if (active && isTransitioning) {
          active.classList.remove(CLASS_NAME_SHOW$1);
  
          this._queueCallback(complete, element, true);
        } else {
          complete();
        }
      }
  
      _transitionComplete(element, active, callback) {
        if (active) {
          active.classList.remove(CLASS_NAME_ACTIVE);
          const dropdownChild = SelectorEngine.findOne(SELECTOR_DROPDOWN_ACTIVE_CHILD, active.parentNode);
  
          if (dropdownChild) {
            dropdownChild.classList.remove(CLASS_NAME_ACTIVE);
          }
  
          if (active.getAttribute('role') === 'tab') {
            active.setAttribute('aria-selected', false);
          }
        }
  
        element.classList.add(CLASS_NAME_ACTIVE);
  
        if (element.getAttribute('role') === 'tab') {
          element.setAttribute('aria-selected', true);
        }
  
        reflow(element);
  
        if (element.classList.contains(CLASS_NAME_FADE$1)) {
          element.classList.add(CLASS_NAME_SHOW$1);
        }
  
        let parent = element.parentNode;
  
        if (parent && parent.nodeName === 'LI') {
          parent = parent.parentNode;
        }
  
        if (parent && parent.classList.contains(CLASS_NAME_DROPDOWN_MENU)) {
          const dropdownElement = element.closest(SELECTOR_DROPDOWN);
  
          if (dropdownElement) {
            SelectorEngine.find(SELECTOR_DROPDOWN_TOGGLE, dropdownElement).forEach(dropdown => dropdown.classList.add(CLASS_NAME_ACTIVE));
          }
  
          element.setAttribute('aria-expanded', true);
        }
  
        if (callback) {
          callback();
        }
      } // Static
  
  
      static jQueryInterface(config) {
        return this.each(function () {
          const data = Tab.getOrCreateInstance(this);
  
          if (typeof config === 'string') {
            if (typeof data[config] === 'undefined') {
              throw new TypeError(`No method named "${config}"`);
            }
  
            data[config]();
          }
        });
      }
  
    }
    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */
  
  
    EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
      if (['A', 'AREA'].includes(this.tagName)) {
        event.preventDefault();
      }
  
      if (isDisabled(this)) {
        return;
      }
  
      const data = Tab.getOrCreateInstance(this);
      data.show();
    });
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     * add .Tab to jQuery only if jQuery is present
     */
  
    defineJQueryPlugin(Tab);
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): toast.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
  
    const NAME = 'toast';
    const DATA_KEY = 'bs.toast';
    const EVENT_KEY = `.${DATA_KEY}`;
    const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`;
    const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`;
    const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
    const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
    const EVENT_HIDE = `hide${EVENT_KEY}`;
    const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
    const EVENT_SHOW = `show${EVENT_KEY}`;
    const EVENT_SHOWN = `shown${EVENT_KEY}`;
    const CLASS_NAME_FADE = 'fade';
    const CLASS_NAME_HIDE = 'hide'; // @deprecated - kept here only for backwards compatibility
  
    const CLASS_NAME_SHOW = 'show';
    const CLASS_NAME_SHOWING = 'showing';
    const DefaultType = {
      animation: 'boolean',
      autohide: 'boolean',
      delay: 'number'
    };
    const Default = {
      animation: true,
      autohide: true,
      delay: 5000
    };
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */
  
    class Toast extends BaseComponent {
      constructor(element, config) {
        super(element);
        this._config = this._getConfig(config);
        this._timeout = null;
        this._hasMouseInteraction = false;
        this._hasKeyboardInteraction = false;
  
        this._setListeners();
      } // Getters
  
  
      static get DefaultType() {
        return DefaultType;
      }
  
      static get Default() {
        return Default;
      }
  
      static get NAME() {
        return NAME;
      } // Public
  
  
      show() {
        const showEvent = EventHandler.trigger(this._element, EVENT_SHOW);
  
        if (showEvent.defaultPrevented) {
          return;
        }
  
        this._clearTimeout();
  
        if (this._config.animation) {
          this._element.classList.add(CLASS_NAME_FADE);
        }
  
        const complete = () => {
          this._element.classList.remove(CLASS_NAME_SHOWING);
  
          EventHandler.trigger(this._element, EVENT_SHOWN);
  
          this._maybeScheduleHide();
        };
  
        this._element.classList.remove(CLASS_NAME_HIDE); // @deprecated
  
  
        reflow(this._element);
  
        this._element.classList.add(CLASS_NAME_SHOW);
  
        this._element.classList.add(CLASS_NAME_SHOWING);
  
        this._queueCallback(complete, this._element, this._config.animation);
      }
  
      hide() {
        if (!this._element.classList.contains(CLASS_NAME_SHOW)) {
          return;
        }
  
        const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);
  
        if (hideEvent.defaultPrevented) {
          return;
        }
  
        const complete = () => {
          this._element.classList.add(CLASS_NAME_HIDE); // @deprecated
  
  
          this._element.classList.remove(CLASS_NAME_SHOWING);
  
          this._element.classList.remove(CLASS_NAME_SHOW);
  
          EventHandler.trigger(this._element, EVENT_HIDDEN);
        };
  
        this._element.classList.add(CLASS_NAME_SHOWING);
  
        this._queueCallback(complete, this._element, this._config.animation);
      }
  
      dispose() {
        this._clearTimeout();
  
        if (this._element.classList.contains(CLASS_NAME_SHOW)) {
          this._element.classList.remove(CLASS_NAME_SHOW);
        }
  
        super.dispose();
      } // Private
  
  
      _getConfig(config) {
        config = { ...Default,
          ...Manipulator.getDataAttributes(this._element),
          ...(typeof config === 'object' && config ? config : {})
        };
        typeCheckConfig(NAME, config, this.constructor.DefaultType);
        return config;
      }
  
      _maybeScheduleHide() {
        if (!this._config.autohide) {
          return;
        }
  
        if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
          return;
        }
  
        this._timeout = setTimeout(() => {
          this.hide();
        }, this._config.delay);
      }
  
      _onInteraction(event, isInteracting) {
        switch (event.type) {
          case 'mouseover':
          case 'mouseout':
            this._hasMouseInteraction = isInteracting;
            break;
  
          case 'focusin':
          case 'focusout':
            this._hasKeyboardInteraction = isInteracting;
            break;
        }
  
        if (isInteracting) {
          this._clearTimeout();
  
          return;
        }
  
        const nextElement = event.relatedTarget;
  
        if (this._element === nextElement || this._element.contains(nextElement)) {
          return;
        }
  
        this._maybeScheduleHide();
      }
  
      _setListeners() {
        EventHandler.on(this._element, EVENT_MOUSEOVER, event => this._onInteraction(event, true));
        EventHandler.on(this._element, EVENT_MOUSEOUT, event => this._onInteraction(event, false));
        EventHandler.on(this._element, EVENT_FOCUSIN, event => this._onInteraction(event, true));
        EventHandler.on(this._element, EVENT_FOCUSOUT, event => this._onInteraction(event, false));
      }
  
      _clearTimeout() {
        clearTimeout(this._timeout);
        this._timeout = null;
      } // Static
  
  
      static jQueryInterface(config) {
        return this.each(function () {
          const data = Toast.getOrCreateInstance(this, config);
  
          if (typeof config === 'string') {
            if (typeof data[config] === 'undefined') {
              throw new TypeError(`No method named "${config}"`);
            }
  
            data[config](this);
          }
        });
      }
  
    }
  
    enableDismissTrigger(Toast);
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     * add .Toast to jQuery only if jQuery is present
     */
  
    defineJQueryPlugin(Toast);
  
    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.1.3): index.umd.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    const index_umd = {
      Alert,
      Button,
      Carousel,
      Collapse,
      Dropdown,
      Modal,
      Offcanvas,
      Popover,
      ScrollSpy,
      Tab,
      Toast,
      Tooltip
    };
  
    return index_umd;
  
  }));
  //# sourceMappingURL=bootstrap.js.map
  
}(jQuery), + function(a) {
    "use strict";

    function b(b) {
        return this.each(function() {
            var c = a(this),
                e = c.data("bs.alert");
            e || c.data("bs.alert", e = new d(this)), "string" == typeof b && e[b].call(c)
        })
    }
    var c = '[data-dismiss="alert"]',
        d = function(b) {
            a(b).on("click", c, this.close)
        };
    d.VERSION = "3.3.5", d.TRANSITION_DURATION = 150, d.prototype.close = function(b) {
        function c() {
            g.detach().trigger("closed.bs.alert").remove()
        }
        var e = a(this),
            f = e.attr("data-target");
        f || (f = e.attr("href"), f = f && f.replace(/.*(?=#[^\s]*$)/, ""));
        var g = a(f);
        b && b.preventDefault(), g.length || (g = e.closest(".alert")), g.trigger(b = a.Event("close.bs.alert")), b.isDefaultPrevented() || (g.removeClass("in"), a.support.transition && g.hasClass("fade") ? g.one("bsTransitionEnd", c).emulateTransitionEnd(d.TRANSITION_DURATION) : c())
    };
    var e = a.fn.alert;
    a.fn.alert = b, a.fn.alert.Constructor = d, a.fn.alert.noConflict = function() {
        return a.fn.alert = e, this
    }, a(document).on("click.bs.alert.data-api", c, d.prototype.close)
}(jQuery), + function(a) {
    "use strict";

    function b(b) {
        return this.each(function() {
            var d = a(this),
                e = d.data("bs.button"),
                f = "object" == typeof b && b;
            e || d.data("bs.button", e = new c(this, f)), "toggle" == b ? e.toggle() : b && e.setState(b)
        })
    }
    var c = function(b, d) {
        this.$element = a(b), this.options = a.extend({}, c.DEFAULTS, d), this.isLoading = !1
    };
    c.VERSION = "3.3.5", c.DEFAULTS = {
        loadingText: "loading..."
    }, c.prototype.setState = function(b) {
        var c = "disabled",
            d = this.$element,
            e = d.is("input") ? "val" : "html",
            f = d.data();
        b += "Text", null == f.resetText && d.data("resetText", d[e]()), setTimeout(a.proxy(function() {
            d[e](null == f[b] ? this.options[b] : f[b]), "loadingText" == b ? (this.isLoading = !0, d.addClass(c).attr(c, c)) : this.isLoading && (this.isLoading = !1, d.removeClass(c).removeAttr(c))
        }, this), 0)
    }, c.prototype.toggle = function() {
        var a = !0,
            b = this.$element.closest('[data-toggle="buttons"]');
        if (b.length) {
            var c = this.$element.find("input");
            "radio" == c.prop("type") ? (c.prop("checked") && (a = !1), b.find(".active").removeClass("active"), this.$element.addClass("active")) : "checkbox" == c.prop("type") && (c.prop("checked") !== this.$element.hasClass("active") && (a = !1), this.$element.toggleClass("active")), c.prop("checked", this.$element.hasClass("active")), a && c.trigger("change")
        } else this.$element.attr("aria-pressed", !this.$element.hasClass("active")), this.$element.toggleClass("active")
    };
    var d = a.fn.button;
    a.fn.button = b, a.fn.button.Constructor = c, a.fn.button.noConflict = function() {
        return a.fn.button = d, this
    }, a(document).on("click.bs.button.data-api", '[data-toggle^="button"]', function(c) {
        var d = a(c.target);
        d.hasClass("btn") || (d = d.closest(".btn")), b.call(d, "toggle"), a(c.target).is('input[type="radio"]') || a(c.target).is('input[type="checkbox"]') || c.preventDefault()
    }).on("focus.bs.button.data-api blur.bs.button.data-api", '[data-toggle^="button"]', function(b) {
        a(b.target).closest(".btn").toggleClass("focus", /^focus(in)?$/.test(b.type))
    })
}(jQuery), + function(a) {
    "use strict";

    function b(b) {
        return this.each(function() {
            var d = a(this),
                e = d.data("bs.carousel"),
                f = a.extend({}, c.DEFAULTS, d.data(), "object" == typeof b && b),
                g = "string" == typeof b ? b : f.slide;
            e || d.data("bs.carousel", e = new c(this, f)), "number" == typeof b ? e.to(b) : g ? e[g]() : f.interval && e.pause().cycle()
        })
    }
    var c = function(b, c) {
        this.$element = a(b), this.$indicators = this.$element.find(".carousel-indicators"), this.options = c, this.paused = null, this.sliding = null, this.interval = null, this.$active = null, this.$items = null, this.options.keyboard && this.$element.on("keydown.bs.carousel", a.proxy(this.keydown, this)), "hover" == this.options.pause && !("ontouchstart" in document.documentElement) && this.$element.on("mouseenter.bs.carousel", a.proxy(this.pause, this)).on("mouseleave.bs.carousel", a.proxy(this.cycle, this))
    };
    c.VERSION = "3.3.5", c.TRANSITION_DURATION = 600, c.DEFAULTS = {
        interval: 5e3,
        pause: "hover",
        wrap: !0,
        keyboard: !0
    }, c.prototype.keydown = function(a) {
        if (!/input|textarea/i.test(a.target.tagName)) {
            switch (a.which) {
                case 37:
                    this.prev();
                    break;
                case 39:
                    this.next();
                    break;
                default:
                    return
            }
            a.preventDefault()
        }
    }, c.prototype.cycle = function(b) {
        return b || (this.paused = !1), this.interval && clearInterval(this.interval), this.options.interval && !this.paused && (this.interval = setInterval(a.proxy(this.next, this), this.options.interval)), this
    }, c.prototype.getItemIndex = function(a) {
        return this.$items = a.parent().children(".item"), this.$items.index(a || this.$active)
    }, c.prototype.getItemForDirection = function(a, b) {
        var c = this.getItemIndex(b),
            d = "prev" == a && 0 === c || "next" == a && c == this.$items.length - 1;
        if (d && !this.options.wrap) return b;
        var e = "prev" == a ? -1 : 1,
            f = (c + e) % this.$items.length;
        return this.$items.eq(f)
    }, c.prototype.to = function(a) {
        var b = this,
            c = this.getItemIndex(this.$active = this.$element.find(".item.active"));
        return a > this.$items.length - 1 || 0 > a ? void 0 : this.sliding ? this.$element.one("slid.bs.carousel", function() {
            b.to(a)
        }) : c == a ? this.pause().cycle() : this.slide(a > c ? "next" : "prev", this.$items.eq(a))
    }, c.prototype.pause = function(b) {
        return b || (this.paused = !0), this.$element.find(".next, .prev").length && a.support.transition && (this.$element.trigger(a.support.transition.end), this.cycle(!0)), this.interval = clearInterval(this.interval), this
    }, c.prototype.next = function() {
        return this.sliding ? void 0 : this.slide("next")
    }, c.prototype.prev = function() {
        return this.sliding ? void 0 : this.slide("prev")
    }, c.prototype.slide = function(b, d) {
        var e = this.$element.find(".item.active"),
            f = d || this.getItemForDirection(b, e),
            g = this.interval,
            h = "next" == b ? "left" : "right",
            i = this;
        if (f.hasClass("active")) return this.sliding = !1;
        var j = f[0],
            k = a.Event("slide.bs.carousel", {
                relatedTarget: j,
                direction: h
            });
        if (this.$element.trigger(k), !k.isDefaultPrevented()) {
            if (this.sliding = !0, g && this.pause(), this.$indicators.length) {
                this.$indicators.find(".active").removeClass("active");
                var l = a(this.$indicators.children()[this.getItemIndex(f)]);
                l && l.addClass("active")
            }
            var m = a.Event("slid.bs.carousel", {
                relatedTarget: j,
                direction: h
            });
            return a.support.transition && this.$element.hasClass("slide") ? (f.addClass(b), f[0].offsetWidth, e.addClass(h), f.addClass(h), e.one("bsTransitionEnd", function() {
                f.removeClass([b, h].join(" ")).addClass("active"), e.removeClass(["active", h].join(" ")), i.sliding = !1, setTimeout(function() {
                    i.$element.trigger(m)
                }, 0)
            }).emulateTransitionEnd(c.TRANSITION_DURATION)) : (e.removeClass("active"), f.addClass("active"), this.sliding = !1, this.$element.trigger(m)), g && this.cycle(), this
        }
    };
    var d = a.fn.carousel;
    a.fn.carousel = b, a.fn.carousel.Constructor = c, a.fn.carousel.noConflict = function() {
        return a.fn.carousel = d, this
    };
    var e = function(c) {
        var d, e = a(this),
            f = a(e.attr("data-target") || (d = e.attr("href")) && d.replace(/.*(?=#[^\s]+$)/, ""));
        if (f.hasClass("carousel")) {
            var g = a.extend({}, f.data(), e.data()),
                h = e.attr("data-slide-to");
            h && (g.interval = !1), b.call(f, g), h && f.data("bs.carousel").to(h), c.preventDefault()
        }
    };
    a(document).on("click.bs.carousel.data-api", "[data-slide]", e).on("click.bs.carousel.data-api", "[data-slide-to]", e), a(window).on("load", function() {
        a('[data-ride="carousel"]').each(function() {
            var c = a(this);
            b.call(c, c.data())
        })
    })
}(jQuery), + function(a) {
    "use strict";

    function b(b) {
        var c, d = b.attr("data-target") || (c = b.attr("href")) && c.replace(/.*(?=#[^\s]+$)/, "");
        return a(d)
    }

    function c(b) {
        return this.each(function() {
            var c = a(this),
                e = c.data("bs.collapse"),
                f = a.extend({}, d.DEFAULTS, c.data(), "object" == typeof b && b);
            !e && f.toggle && /show|hide/.test(b) && (f.toggle = !1), e || c.data("bs.collapse", e = new d(this, f)), "string" == typeof b && e[b]()
        })
    }
    var d = function(b, c) {
        this.$element = a(b), this.options = a.extend({}, d.DEFAULTS, c), this.$trigger = a('[data-toggle="collapse"][href="#' + b.id + '"],[data-toggle="collapse"][data-target="#' + b.id + '"]'), this.transitioning = null, this.options.parent ? this.$parent = this.getParent() : this.addAriaAndCollapsedClass(this.$element, this.$trigger), this.options.toggle && this.toggle()
    };
    d.VERSION = "3.3.5", d.TRANSITION_DURATION = 350, d.DEFAULTS = {
        toggle: !0
    }, d.prototype.dimension = function() {
        var a = this.$element.hasClass("width");
        return a ? "width" : "height"
    }, d.prototype.show = function() {
        if (!this.transitioning && !this.$element.hasClass("in")) {
            var b, e = this.$parent && this.$parent.children(".panel").children(".in, .collapsing");
            if (!(e && e.length && (b = e.data("bs.collapse"), b && b.transitioning))) {
                var f = a.Event("show.bs.collapse");
                if (this.$element.trigger(f), !f.isDefaultPrevented()) {
                    e && e.length && (c.call(e, "hide"), b || e.data("bs.collapse", null));
                    var g = this.dimension();
                    this.$element.removeClass("collapse").addClass("collapsing")[g](0).attr("aria-expanded", !0), this.$trigger.removeClass("collapsed").attr("aria-expanded", !0), this.transitioning = 1;
                    var h = function() {
                        this.$element.removeClass("collapsing").addClass("collapse in")[g](""), this.transitioning = 0, this.$element.trigger("shown.bs.collapse")
                    };
                    if (!a.support.transition) return h.call(this);
                    var i = a.camelCase(["scroll", g].join("-"));
                    this.$element.one("bsTransitionEnd", a.proxy(h, this)).emulateTransitionEnd(d.TRANSITION_DURATION)[g](this.$element[0][i])
                }
            }
        }
    }, d.prototype.hide = function() {
        if (!this.transitioning && this.$element.hasClass("in")) {
            var b = a.Event("hide.bs.collapse");
            if (this.$element.trigger(b), !b.isDefaultPrevented()) {
                var c = this.dimension();
                this.$element[c](this.$element[c]())[0].offsetHeight, this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded", !1), this.$trigger.addClass("collapsed").attr("aria-expanded", !1), this.transitioning = 1;
                var e = function() {
                    this.transitioning = 0, this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")
                };
                return a.support.transition ? void this.$element[c](0).one("bsTransitionEnd", a.proxy(e, this)).emulateTransitionEnd(d.TRANSITION_DURATION) : e.call(this)
            }
        }
    }, d.prototype.toggle = function() {
        this[this.$element.hasClass("in") ? "hide" : "show"]()
    }, d.prototype.getParent = function() {
        return a(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each(a.proxy(function(c, d) {
            var e = a(d);
            this.addAriaAndCollapsedClass(b(e), e)
        }, this)).end()
    }, d.prototype.addAriaAndCollapsedClass = function(a, b) {
        var c = a.hasClass("in");
        a.attr("aria-expanded", c), b.toggleClass("collapsed", !c).attr("aria-expanded", c)
    };
    var e = a.fn.collapse;
    a.fn.collapse = c, a.fn.collapse.Constructor = d, a.fn.collapse.noConflict = function() {
        return a.fn.collapse = e, this
    }, a(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]', function(d) {
        var e = a(this);
        e.attr("data-target") || d.preventDefault();
        var f = b(e),
            g = f.data("bs.collapse"),
            h = g ? "toggle" : e.data();
        c.call(f, h)
    })
}(jQuery), + function(a) {
    "use strict";

    function b(b) {
        var c = b.attr("data-target");
        c || (c = b.attr("href"), c = c && /#[A-Za-z]/.test(c) && c.replace(/.*(?=#[^\s]*$)/, ""));
        var d = c && a(c);
        return d && d.length ? d : b.parent()
    }

    function c(c) {
        c && 3 === c.which || (a(e).remove(), a(f).each(function() {
            var d = a(this),
                e = b(d),
                f = {
                    relatedTarget: this
                };
            e.hasClass("open") && (c && "click" == c.type && /input|textarea/i.test(c.target.tagName) && a.contains(e[0], c.target) || (e.trigger(c = a.Event("hide.bs.dropdown", f)), c.isDefaultPrevented() || (d.attr("aria-expanded", "false"), e.removeClass("open").trigger("hidden.bs.dropdown", f))))
        }))
    }

    function d(b) {
        return this.each(function() {
            var c = a(this),
                d = c.data("bs.dropdown");
            d || c.data("bs.dropdown", d = new g(this)), "string" == typeof b && d[b].call(c)
        })
    }
    var e = ".dropdown-backdrop",
        f = '[data-toggle="dropdown"]',
        g = function(b) {
            a(b).on("click.bs.dropdown", this.toggle)
        };
    g.VERSION = "3.3.5", g.prototype.toggle = function(d) {
        var e = a(this);
        if (!e.is(".disabled, :disabled")) {
            var f = b(e),
                g = f.hasClass("open");
            if (c(), !g) {
                "ontouchstart" in document.documentElement && !f.closest(".navbar-nav").length && a(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(a(this)).on("click", c);
                var h = {
                    relatedTarget: this
                };
                if (f.trigger(d = a.Event("show.bs.dropdown", h)), d.isDefaultPrevented()) return;
                e.trigger("focus").attr("aria-expanded", "true"), f.toggleClass("open").trigger("shown.bs.dropdown", h)
            }
            return !1
        }
    }, g.prototype.keydown = function(c) {
        if (/(38|40|27|32)/.test(c.which) && !/input|textarea/i.test(c.target.tagName)) {
            var d = a(this);
            if (c.preventDefault(), c.stopPropagation(), !d.is(".disabled, :disabled")) {
                var e = b(d),
                    g = e.hasClass("open");
                if (!g && 27 != c.which || g && 27 == c.which) return 27 == c.which && e.find(f).trigger("focus"), d.trigger("click");
                var h = " li:not(.disabled):visible a",
                    i = e.find(".dropdown-menu" + h);
                if (i.length) {
                    var j = i.index(c.target);
                    38 == c.which && j > 0 && j--, 40 == c.which && j < i.length - 1 && j++, ~j || (j = 0), i.eq(j).trigger("focus")
                }
            }
        }
    };
    var h = a.fn.dropdown;
    a.fn.dropdown = d, a.fn.dropdown.Constructor = g, a.fn.dropdown.noConflict = function() {
        return a.fn.dropdown = h, this
    }, a(document).on("click.bs.dropdown.data-api", c).on("click.bs.dropdown.data-api", ".dropdown form", function(a) {
        a.stopPropagation()
    }).on("click.bs.dropdown.data-api", f, g.prototype.toggle).on("keydown.bs.dropdown.data-api", f, g.prototype.keydown).on("keydown.bs.dropdown.data-api", ".dropdown-menu", g.prototype.keydown)
}(jQuery), + function(a) {
    "use strict";

    function b(b, d) {
        return this.each(function() {
            var e = a(this),
                f = e.data("bs.modal"),
                g = a.extend({}, c.DEFAULTS, e.data(), "object" == typeof b && b);
            f || e.data("bs.modal", f = new c(this, g)), "string" == typeof b ? f[b](d) : g.show && f.show(d)
        })
    }
    var c = function(b, c) {
        this.options = c, this.$body = a(document.body), this.$element = a(b), this.$dialog = this.$element.find(".modal-dialog"), this.$backdrop = null, this.isShown = null, this.originalBodyPad = null, this.scrollbarWidth = 0, this.ignoreBackdropClick = !1, this.options.remote && this.$element.find(".modal-content").load(this.options.remote, a.proxy(function() {
            this.$element.trigger("loaded.bs.modal")
        }, this))
    };
    c.VERSION = "3.3.5", c.TRANSITION_DURATION = 300, c.BACKDROP_TRANSITION_DURATION = 150, c.DEFAULTS = {
        backdrop: !0,
        keyboard: !0,
        show: !0
    }, c.prototype.toggle = function(a) {
        return this.isShown ? this.hide() : this.show(a)
    }, c.prototype.show = function(b) {
        var d = this,
            e = a.Event("show.bs.modal", {
                relatedTarget: b
            });
        this.$element.trigger(e), this.isShown || e.isDefaultPrevented() || (this.isShown = !0, this.checkScrollbar(), this.setScrollbar(), this.$body.addClass("modal-open"), this.escape(), this.resize(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', a.proxy(this.hide, this)), this.$dialog.on("mousedown.dismiss.bs.modal", function() {
            d.$element.one("mouseup.dismiss.bs.modal", function(b) {
                a(b.target).is(d.$element) && (d.ignoreBackdropClick = !0)
            })
        }), this.backdrop(function() {
            var e = a.support.transition && d.$element.hasClass("fade");
            d.$element.parent().length || d.$element.appendTo(d.$body), d.$element.show().scrollTop(0), d.adjustDialog(), e && d.$element[0].offsetWidth, d.$element.addClass("in"), d.enforceFocus();
            var f = a.Event("shown.bs.modal", {
                relatedTarget: b
            });
            e ? d.$dialog.one("bsTransitionEnd", function() {
                d.$element.trigger("focus").trigger(f)
            }).emulateTransitionEnd(c.TRANSITION_DURATION) : d.$element.trigger("focus").trigger(f)
        }))
    }, c.prototype.hide = function(b) {
        b && b.preventDefault(), b = a.Event("hide.bs.modal"), this.$element.trigger(b), this.isShown && !b.isDefaultPrevented() && (this.isShown = !1, this.escape(), this.resize(), a(document).off("focusin.bs.modal"), this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"), this.$dialog.off("mousedown.dismiss.bs.modal"), a.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", a.proxy(this.hideModal, this)).emulateTransitionEnd(c.TRANSITION_DURATION) : this.hideModal())
    }, c.prototype.enforceFocus = function() {
        a(document).off("focusin.bs.modal").on("focusin.bs.modal", a.proxy(function(a) {
            this.$element[0] === a.target || this.$element.has(a.target).length || this.$element.trigger("focus")
        }, this))
    }, c.prototype.escape = function() {
        this.isShown && this.options.keyboard ? this.$element.on("keydown.dismiss.bs.modal", a.proxy(function(a) {
            27 == a.which && this.hide()
        }, this)) : this.isShown || this.$element.off("keydown.dismiss.bs.modal")
    }, c.prototype.resize = function() {
        this.isShown ? a(window).on("resize.bs.modal", a.proxy(this.handleUpdate, this)) : a(window).off("resize.bs.modal")
    }, c.prototype.hideModal = function() {
        var a = this;
        this.$element.hide(), this.backdrop(function() {
            a.$body.removeClass("modal-open"), a.resetAdjustments(), a.resetScrollbar(), a.$element.trigger("hidden.bs.modal")
        })
    }, c.prototype.removeBackdrop = function() {
        this.$backdrop && this.$backdrop.remove(), this.$backdrop = null
    }, c.prototype.backdrop = function(b) {
        var d = this,
            e = this.$element.hasClass("fade") ? "fade" : "";
        if (this.isShown && this.options.backdrop) {
            var f = a.support.transition && e;
            if (this.$backdrop = a(document.createElement("div")).addClass("modal-backdrop " + e).appendTo(this.$body), this.$element.on("click.dismiss.bs.modal", a.proxy(function(a) {
                    return this.ignoreBackdropClick ? void(this.ignoreBackdropClick = !1) : void(a.target === a.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus() : this.hide()))
                }, this)), f && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !b) return;
            f ? this.$backdrop.one("bsTransitionEnd", b).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION) : b()
        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass("in");
            var g = function() {
                d.removeBackdrop(), b && b()
            };
            a.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", g).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION) : g()
        } else b && b()
    }, c.prototype.handleUpdate = function() {
        this.adjustDialog()
    }, c.prototype.adjustDialog = function() {
        var a = this.$element[0].scrollHeight > document.documentElement.clientHeight;
        this.$element.css({
            paddingLeft: !this.bodyIsOverflowing && a ? this.scrollbarWidth : "",
            paddingRight: this.bodyIsOverflowing && !a ? this.scrollbarWidth : ""
        })
    }, c.prototype.resetAdjustments = function() {
        this.$element.css({
            paddingLeft: "",
            paddingRight: ""
        })
    }, c.prototype.checkScrollbar = function() {
        var a = window.innerWidth;
        if (!a) {
            var b = document.documentElement.getBoundingClientRect();
            a = b.right - Math.abs(b.left)
        }
        this.bodyIsOverflowing = document.body.clientWidth < a, this.scrollbarWidth = this.measureScrollbar()
    }, c.prototype.setScrollbar = function() {
        var a = parseInt(this.$body.css("padding-right") || 0, 10);
        this.originalBodyPad = document.body.style.paddingRight || "", this.bodyIsOverflowing && this.$body.css("padding-right", a + this.scrollbarWidth)
    }, c.prototype.resetScrollbar = function() {
        this.$body.css("padding-right", this.originalBodyPad)
    }, c.prototype.measureScrollbar = function() {
        var a = document.createElement("div");
        a.className = "modal-scrollbar-measure", this.$body.append(a);
        var b = a.offsetWidth - a.clientWidth;
        return this.$body[0].removeChild(a), b
    };
    var d = a.fn.modal;
    a.fn.modal = b, a.fn.modal.Constructor = c, a.fn.modal.noConflict = function() {
        return a.fn.modal = d, this
    }, a(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function(c) {
        var d = a(this),
            e = d.attr("href"),
            f = a(d.attr("data-target") || e && e.replace(/.*(?=#[^\s]+$)/, "")),
            g = f.data("bs.modal") ? "toggle" : a.extend({
                remote: !/#/.test(e) && e
            }, f.data(), d.data());
        d.is("a") && c.preventDefault(), f.one("show.bs.modal", function(a) {
            a.isDefaultPrevented() || f.one("hidden.bs.modal", function() {
                d.is(":visible") && d.trigger("focus")
            })
        }), b.call(f, g, this)
    })
}(jQuery), + function(a) {
    "use strict";

    function b(b) {
        return this.each(function() {
            var d = a(this),
                e = d.data("bs.tooltip"),
                f = "object" == typeof b && b;
            (e || !/destroy|hide/.test(b)) && (e || d.data("bs.tooltip", e = new c(this, f)), "string" == typeof b && e[b]())
        })
    }
    var c = function(a, b) {
        this.type = null, this.options = null, this.enabled = null, this.timeout = null, this.hoverState = null, this.$element = null, this.inState = null, this.init("tooltip", a, b)
    };
    c.VERSION = "3.3.5", c.TRANSITION_DURATION = 150, c.DEFAULTS = {
        animation: !0,
        placement: "top",
        selector: !1,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        html: !1,
        container: !1,
        viewport: {
            selector: "body",
            padding: 0
        }
    }, c.prototype.init = function(b, c, d) {
        if (this.enabled = !0, this.type = b, this.$element = a(c), this.options = this.getOptions(d), this.$viewport = this.options.viewport && a(a.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport), this.inState = {
                click: !1,
                hover: !1,
                focus: !1
            }, this.$element[0] instanceof document.constructor && !this.options.selector) throw new Error("`selector` option must be specified when initializing " + this.type + " on the window.document object!");
        for (var e = this.options.trigger.split(" "), f = e.length; f--;) {
            var g = e[f];
            if ("click" == g) this.$element.on("click." + this.type, this.options.selector, a.proxy(this.toggle, this));
            else if ("manual" != g) {
                var h = "hover" == g ? "mouseenter" : "focusin",
                    i = "hover" == g ? "mouseleave" : "focusout";
                this.$element.on(h + "." + this.type, this.options.selector, a.proxy(this.enter, this)), this.$element.on(i + "." + this.type, this.options.selector, a.proxy(this.leave, this))
            }
        }
        this.options.selector ? this._options = a.extend({}, this.options, {
            trigger: "manual",
            selector: ""
        }) : this.fixTitle()
    }, c.prototype.getDefaults = function() {
        return c.DEFAULTS
    }, c.prototype.getOptions = function(b) {
        return b = a.extend({}, this.getDefaults(), this.$element.data(), b), b.delay && "number" == typeof b.delay && (b.delay = {
            show: b.delay,
            hide: b.delay
        }), b
    }, c.prototype.getDelegateOptions = function() {
        var b = {},
            c = this.getDefaults();
        return this._options && a.each(this._options, function(a, d) {
            c[a] != d && (b[a] = d)
        }), b
    }, c.prototype.enter = function(b) {
        var c = b instanceof this.constructor ? b : a(b.currentTarget).data("bs." + this.type);
        return c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c)), b instanceof a.Event && (c.inState["focusin" == b.type ? "focus" : "hover"] = !0), c.tip().hasClass("in") || "in" == c.hoverState ? void(c.hoverState = "in") : (clearTimeout(c.timeout), c.hoverState = "in", c.options.delay && c.options.delay.show ? void(c.timeout = setTimeout(function() {
            "in" == c.hoverState && c.show()
        }, c.options.delay.show)) : c.show())
    }, c.prototype.isInStateTrue = function() {
        for (var a in this.inState)
            if (this.inState[a]) return !0;
        return !1
    }, c.prototype.leave = function(b) {
        var c = b instanceof this.constructor ? b : a(b.currentTarget).data("bs." + this.type);
        return c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c)), b instanceof a.Event && (c.inState["focusout" == b.type ? "focus" : "hover"] = !1), c.isInStateTrue() ? void 0 : (clearTimeout(c.timeout), c.hoverState = "out", c.options.delay && c.options.delay.hide ? void(c.timeout = setTimeout(function() {
            "out" == c.hoverState && c.hide()
        }, c.options.delay.hide)) : c.hide())
    }, c.prototype.show = function() {
        var b = a.Event("show.bs." + this.type);
        if (this.hasContent() && this.enabled) {
            this.$element.trigger(b);
            var d = a.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
            if (b.isDefaultPrevented() || !d) return;
            var e = this,
                f = this.tip(),
                g = this.getUID(this.type);
            this.setContent(), f.attr("id", g), this.$element.attr("aria-describedby", g), this.options.animation && f.addClass("fade");
            var h = "function" == typeof this.options.placement ? this.options.placement.call(this, f[0], this.$element[0]) : this.options.placement,
                i = /\s?auto?\s?/i,
                j = i.test(h);
            j && (h = h.replace(i, "") || "top"), f.detach().css({
                top: 0,
                left: 0,
                display: "block"
            }).addClass(h).data("bs." + this.type, this), this.options.container ? f.appendTo(this.options.container) : f.insertAfter(this.$element), this.$element.trigger("inserted.bs." + this.type);
            var k = this.getPosition(),
                l = f[0].offsetWidth,
                m = f[0].offsetHeight;
            if (j) {
                var n = h,
                    o = this.getPosition(this.$viewport);
                h = "bottom" == h && k.bottom + m > o.bottom ? "top" : "top" == h && k.top - m < o.top ? "bottom" : "right" == h && k.right + l > o.width ? "left" : "left" == h && k.left - l < o.left ? "right" : h, f.removeClass(n).addClass(h)
            }
            var p = this.getCalculatedOffset(h, k, l, m);
            this.applyPlacement(p, h);
            var q = function() {
                var a = e.hoverState;
                e.$element.trigger("shown.bs." + e.type), e.hoverState = null, "out" == a && e.leave(e)
            };
            a.support.transition && this.$tip.hasClass("fade") ? f.one("bsTransitionEnd", q).emulateTransitionEnd(c.TRANSITION_DURATION) : q()
        }
    }, c.prototype.applyPlacement = function(b, c) {
        var d = this.tip(),
            e = d[0].offsetWidth,
            f = d[0].offsetHeight,
            g = parseInt(d.css("margin-top"), 10),
            h = parseInt(d.css("margin-left"), 10);
        isNaN(g) && (g = 0), isNaN(h) && (h = 0), b.top += g, b.left += h, a.offset.setOffset(d[0], a.extend({
            using: function(a) {
                d.css({
                    top: Math.round(a.top),
                    left: Math.round(a.left)
                })
            }
        }, b), 0), d.addClass("in");
        var i = d[0].offsetWidth,
            j = d[0].offsetHeight;
        "top" == c && j != f && (b.top = b.top + f - j);
        var k = this.getViewportAdjustedDelta(c, b, i, j);
        k.left ? b.left += k.left : b.top += k.top;
        var l = /top|bottom/.test(c),
            m = l ? 2 * k.left - e + i : 2 * k.top - f + j,
            n = l ? "offsetWidth" : "offsetHeight";
        d.offset(b), this.replaceArrow(m, d[0][n], l)
    }, c.prototype.replaceArrow = function(a, b, c) {
        this.arrow().css(c ? "left" : "top", 50 * (1 - a / b) + "%").css(c ? "top" : "left", "")
    }, c.prototype.setContent = function() {
        var a = this.tip(),
            b = this.getTitle();
        a.find(".tooltip-inner")[this.options.html ? "html" : "text"](b), a.removeClass("fade in top bottom left right")
    }, c.prototype.hide = function(b) {
        function d() {
            "in" != e.hoverState && f.detach(), e.$element.removeAttr("aria-describedby").trigger("hidden.bs." + e.type), b && b()
        }
        var e = this,
            f = a(this.$tip),
            g = a.Event("hide.bs." + this.type);
        return this.$element.trigger(g), g.isDefaultPrevented() ? void 0 : (f.removeClass("in"), a.support.transition && f.hasClass("fade") ? f.one("bsTransitionEnd", d).emulateTransitionEnd(c.TRANSITION_DURATION) : d(), this.hoverState = null, this)
    }, c.prototype.fixTitle = function() {
        var a = this.$element;
        (a.attr("title") || "string" != typeof a.attr("data-original-title")) && a.attr("data-original-title", a.attr("title") || "").attr("title", "")
    }, c.prototype.hasContent = function() {
        return this.getTitle()
    }, c.prototype.getPosition = function(b) {
        b = b || this.$element;
        var c = b[0],
            d = "BODY" == c.tagName,
            e = c.getBoundingClientRect();
        null == e.width && (e = a.extend({}, e, {
            width: e.right - e.left,
            height: e.bottom - e.top
        }));
        var f = d ? {
                top: 0,
                left: 0
            } : b.offset(),
            g = {
                scroll: d ? document.documentElement.scrollTop || document.body.scrollTop : b.scrollTop()
            },
            h = d ? {
                width: a(window).width(),
                height: a(window).height()
            } : null;
        return a.extend({}, e, g, h, f)
    }, c.prototype.getCalculatedOffset = function(a, b, c, d) {
        return "bottom" == a ? {
            top: b.top + b.height,
            left: b.left + b.width / 2 - c / 2
        } : "top" == a ? {
            top: b.top - d,
            left: b.left + b.width / 2 - c / 2
        } : "left" == a ? {
            top: b.top + b.height / 2 - d / 2,
            left: b.left - c
        } : {
            top: b.top + b.height / 2 - d / 2,
            left: b.left + b.width
        }
    }, c.prototype.getViewportAdjustedDelta = function(a, b, c, d) {
        var e = {
            top: 0,
            left: 0
        };
        if (!this.$viewport) return e;
        var f = this.options.viewport && this.options.viewport.padding || 0,
            g = this.getPosition(this.$viewport);
        if (/right|left/.test(a)) {
            var h = b.top - f - g.scroll,
                i = b.top + f - g.scroll + d;
            h < g.top ? e.top = g.top - h : i > g.top + g.height && (e.top = g.top + g.height - i)
        } else {
            var j = b.left - f,
                k = b.left + f + c;
            j < g.left ? e.left = g.left - j : k > g.right && (e.left = g.left + g.width - k)
        }
        return e
    }, c.prototype.getTitle = function() {
        var a, b = this.$element,
            c = this.options;
        return a = b.attr("data-original-title") || ("function" == typeof c.title ? c.title.call(b[0]) : c.title)
    }, c.prototype.getUID = function(a) {
        do a += ~~(1e6 * Math.random()); while (document.getElementById(a));
        return a
    }, c.prototype.tip = function() {
        if (!this.$tip && (this.$tip = a(this.options.template), 1 != this.$tip.length)) throw new Error(this.type + " `template` option must consist of exactly 1 top-level element!");
        return this.$tip
    }, c.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }, c.prototype.enable = function() {
        this.enabled = !0
    }, c.prototype.disable = function() {
        this.enabled = !1
    }, c.prototype.toggleEnabled = function() {
        this.enabled = !this.enabled
    }, c.prototype.toggle = function(b) {
        var c = this;
        b && (c = a(b.currentTarget).data("bs." + this.type), c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c))), b ? (c.inState.click = !c.inState.click, c.isInStateTrue() ? c.enter(c) : c.leave(c)) : c.tip().hasClass("in") ? c.leave(c) : c.enter(c)
    }, c.prototype.destroy = function() {
        var a = this;
        clearTimeout(this.timeout), this.hide(function() {
            a.$element.off("." + a.type).removeData("bs." + a.type), a.$tip && a.$tip.detach(), a.$tip = null, a.$arrow = null, a.$viewport = null
        })
    };
    var d = a.fn.tooltip;
    a.fn.tooltip = b, a.fn.tooltip.Constructor = c, a.fn.tooltip.noConflict = function() {
        return a.fn.tooltip = d, this
    }
}(jQuery), + function(a) {
    "use strict";

    function b(b) {
        return this.each(function() {
            var d = a(this),
                e = d.data("bs.popover"),
                f = "object" == typeof b && b;
            (e || !/destroy|hide/.test(b)) && (e || d.data("bs.popover", e = new c(this, f)), "string" == typeof b && e[b]())
        })
    }
    var c = function(a, b) {
        this.init("popover", a, b)
    };
    if (!a.fn.tooltip) throw new Error("Popover requires tooltip.js");
    c.VERSION = "3.3.5", c.DEFAULTS = a.extend({}, a.fn.tooltip.Constructor.DEFAULTS, {
        placement: "right",
        trigger: "click",
        content: "",
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    }), c.prototype = a.extend({}, a.fn.tooltip.Constructor.prototype), c.prototype.constructor = c, c.prototype.getDefaults = function() {
        return c.DEFAULTS
    }, c.prototype.setContent = function() {
        var a = this.tip(),
            b = this.getTitle(),
            c = this.getContent();
        a.find(".popover-title")[this.options.html ? "html" : "text"](b), a.find(".popover-content").children().detach().end()[this.options.html ? "string" == typeof c ? "html" : "append" : "text"](c), a.removeClass("fade top bottom left right in"), a.find(".popover-title").html() || a.find(".popover-title").hide()
    }, c.prototype.hasContent = function() {
        return this.getTitle() || this.getContent()
    }, c.prototype.getContent = function() {
        var a = this.$element,
            b = this.options;
        return a.attr("data-content") || ("function" == typeof b.content ? b.content.call(a[0]) : b.content)
    }, c.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".arrow")
    };
    var d = a.fn.popover;
    a.fn.popover = b, a.fn.popover.Constructor = c, a.fn.popover.noConflict = function() {
        return a.fn.popover = d, this
    }
}(jQuery), + function(a) {
    "use strict";

    function b(c, d) {
        this.$body = a(document.body), this.$scrollElement = a(a(c).is(document.body) ? window : c), this.options = a.extend({}, b.DEFAULTS, d), this.selector = (this.options.target || "") + " .nav li > a", this.offsets = [], this.targets = [], this.activeTarget = null, this.scrollHeight = 0, this.$scrollElement.on("scroll.bs.scrollspy", a.proxy(this.process, this)), this.refresh(), this.process()
    }

    function c(c) {
        return this.each(function() {
            var d = a(this),
                e = d.data("bs.scrollspy"),
                f = "object" == typeof c && c;
            e || d.data("bs.scrollspy", e = new b(this, f)), "string" == typeof c && e[c]()
        })
    }
    b.VERSION = "3.3.5", b.DEFAULTS = {
        offset: 10
    }, b.prototype.getScrollHeight = function() {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
    }, b.prototype.refresh = function() {
        var b = this,
            c = "offset",
            d = 0;
        this.offsets = [], this.targets = [], this.scrollHeight = this.getScrollHeight(), a.isWindow(this.$scrollElement[0]) || (c = "position", d = this.$scrollElement.scrollTop()), this.$body.find(this.selector).map(function() {
            var b = a(this),
                e = b.data("target") || b.attr("href"),
                f = /^#./.test(e) && a(e);
            return f && f.length && f.is(":visible") && [
                [f[c]().top + d, e]
            ] || null
        }).sort(function(a, b) {
            return a[0] - b[0]
        }).each(function() {
            b.offsets.push(this[0]), b.targets.push(this[1])
        })
    }, b.prototype.process = function() {
        var a, b = this.$scrollElement.scrollTop() + this.options.offset,
            c = this.getScrollHeight(),
            d = this.options.offset + c - this.$scrollElement.height(),
            e = this.offsets,
            f = this.targets,
            g = this.activeTarget;
        if (this.scrollHeight != c && this.refresh(), b >= d) return g != (a = f[f.length - 1]) && this.activate(a);
        if (g && b < e[0]) return this.activeTarget = null, this.clear();
        for (a = e.length; a--;) g != f[a] && b >= e[a] && (void 0 === e[a + 1] || b < e[a + 1]) && this.activate(f[a])
    }, b.prototype.activate = function(b) {
        this.activeTarget = b, this.clear();
        var c = this.selector + '[data-target="' + b + '"],' + this.selector + '[href="' + b + '"]',
            d = a(c).parents("li").addClass("active");
        d.parent(".dropdown-menu").length && (d = d.closest("li.dropdown").addClass("active")),
            d.trigger("activate.bs.scrollspy")
    }, b.prototype.clear = function() {
        a(this.selector).parentsUntil(this.options.target, ".active").removeClass("active")
    };
    var d = a.fn.scrollspy;
    a.fn.scrollspy = c, a.fn.scrollspy.Constructor = b, a.fn.scrollspy.noConflict = function() {
        return a.fn.scrollspy = d, this
    }, a(window).on("load.bs.scrollspy.data-api", function() {
        a('[data-spy="scroll"]').each(function() {
            var b = a(this);
            c.call(b, b.data())
        })
    })
}(jQuery), + function(a) {
    "use strict";

    function b(b) {
        return this.each(function() {
            var d = a(this),
                e = d.data("bs.tab");
            e || d.data("bs.tab", e = new c(this)), "string" == typeof b && e[b]()
        })
    }
    var c = function(b) {
        this.element = a(b)
    };
    c.VERSION = "3.3.5", c.TRANSITION_DURATION = 150, c.prototype.show = function() {
        var b = this.element,
            c = b.closest("ul:not(.dropdown-menu)"),
            d = b.data("target");
        if (d || (d = b.attr("href"), d = d && d.replace(/.*(?=#[^\s]*$)/, "")), !b.parent("li").hasClass("active")) {
            var e = c.find(".active:last a"),
                f = a.Event("hide.bs.tab", {
                    relatedTarget: b[0]
                }),
                g = a.Event("show.bs.tab", {
                    relatedTarget: e[0]
                });
            if (e.trigger(f), b.trigger(g), !g.isDefaultPrevented() && !f.isDefaultPrevented()) {
                var h = a(d);
                this.activate(b.closest("li"), c), this.activate(h, h.parent(), function() {
                    e.trigger({
                        type: "hidden.bs.tab",
                        relatedTarget: b[0]
                    }), b.trigger({
                        type: "shown.bs.tab",
                        relatedTarget: e[0]
                    })
                })
            }
        }
    }, c.prototype.activate = function(b, d, e) {
        function f() {
            g.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !1), b.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded", !0), h ? (b[0].offsetWidth, b.addClass("in")) : b.removeClass("fade"), b.parent(".dropdown-menu").length && b.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !0), e && e()
        }
        var g = d.find("> .active"),
            h = e && a.support.transition && (g.length && g.hasClass("fade") || !!d.find("> .fade").length);
        g.length && h ? g.one("bsTransitionEnd", f).emulateTransitionEnd(c.TRANSITION_DURATION) : f(), g.removeClass("in")
    };
    var d = a.fn.tab;
    a.fn.tab = b, a.fn.tab.Constructor = c, a.fn.tab.noConflict = function() {
        return a.fn.tab = d, this
    };
    var e = function(c) {
        c.preventDefault(), b.call(a(this), "show")
    };
    a(document).on("click.bs.tab.data-api", '[data-toggle="tab"]', e).on("click.bs.tab.data-api", '[data-toggle="pill"]', e)
}(jQuery), + function(a) {
    "use strict";

    function b(b) {
        return this.each(function() {
            var d = a(this),
                e = d.data("bs.affix"),
                f = "object" == typeof b && b;
            e || d.data("bs.affix", e = new c(this, f)), "string" == typeof b && e[b]()
        })
    }
    var c = function(b, d) {
        this.options = a.extend({}, c.DEFAULTS, d), this.$target = a(this.options.target).on("scroll.bs.affix.data-api", a.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", a.proxy(this.checkPositionWithEventLoop, this)), this.$element = a(b), this.affixed = null, this.unpin = null, this.pinnedOffset = null, this.checkPosition()
    };
    c.VERSION = "3.3.5", c.RESET = "affix affix-top affix-bottom", c.DEFAULTS = {
        offset: 0,
        target: window
    }, c.prototype.getState = function(a, b, c, d) {
        var e = this.$target.scrollTop(),
            f = this.$element.offset(),
            g = this.$target.height();
        if (null != c && "top" == this.affixed) return c > e ? "top" : !1;
        if ("bottom" == this.affixed) return null != c ? e + this.unpin <= f.top ? !1 : "bottom" : a - d >= e + g ? !1 : "bottom";
        var h = null == this.affixed,
            i = h ? e : f.top,
            j = h ? g : b;
        return null != c && c >= e ? "top" : null != d && i + j >= a - d ? "bottom" : !1
    }, c.prototype.getPinnedOffset = function() {
        if (this.pinnedOffset) return this.pinnedOffset;
        this.$element.removeClass(c.RESET).addClass("affix");
        var a = this.$target.scrollTop(),
            b = this.$element.offset();
        return this.pinnedOffset = b.top - a
    }, c.prototype.checkPositionWithEventLoop = function() {
        setTimeout(a.proxy(this.checkPosition, this), 1)
    }, c.prototype.checkPosition = function() {
        if (this.$element.is(":visible")) {
            var b = this.$element.height(),
                d = this.options.offset,
                e = d.top,
                f = d.bottom,
                g = Math.max(a(document).height(), a(document.body).height());
            "object" != typeof d && (f = e = d), "function" == typeof e && (e = d.top(this.$element)), "function" == typeof f && (f = d.bottom(this.$element));
            var h = this.getState(g, b, e, f);
            if (this.affixed != h) {
                null != this.unpin && this.$element.css("top", "");
                var i = "affix" + (h ? "-" + h : ""),
                    j = a.Event(i + ".bs.affix");
                if (this.$element.trigger(j), j.isDefaultPrevented()) return;
                this.affixed = h, this.unpin = "bottom" == h ? this.getPinnedOffset() : null, this.$element.removeClass(c.RESET).addClass(i).trigger(i.replace("affix", "affixed") + ".bs.affix")
            }
            "bottom" == h && this.$element.offset({
                top: g - b - f
            })
        }
    };
    var d = a.fn.affix;
    a.fn.affix = b, a.fn.affix.Constructor = c, a.fn.affix.noConflict = function() {
        return a.fn.affix = d, this
    }, a(window).on("load", function() {
        a('[data-spy="affix"]').each(function() {
            var c = a(this),
                d = c.data();
            d.offset = d.offset || {}, null != d.offsetBottom && (d.offset.bottom = d.offsetBottom), null != d.offsetTop && (d.offset.top = d.offsetTop), b.call(c, d)
        })
    })
}(jQuery);
