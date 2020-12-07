'use strict';

var fontPicker = require('font-picker');

//

    /**
     * Vue interface for the font picker
     * @prop {string} apiKey (required) - Google API key
     * @prop {string} activeFont - Font that should be selected in the font picker and applied to the
     * text (default: 'Open Sans'). Must be stored in component state, and be updated using an onChange
     * listener. See README.md for an example.
     * @prop {Object} options - Object with additional (optional) parameters:
     *   @prop {string} name - If you have multiple font pickers on your site, you need to give them
     *   unique names (which may only consist of letters and digits). These names must also be appended
     *   to the font picker's ID and the .apply-font class name.
     *   Example: If { name: 'main' }, use #font-picker-main and .apply-font-main
     *   @prop {string[]} families - If only specific fonts shall appear in the list, specify their
     *   names in an array
     *   @prop {string[]} categories - Array of font categories
     *   Possible values: 'sans-serif', 'serif', 'display', 'handwriting', 'monospace' (default: all
     *   categories)
     *   @prop {string[]} variants - Array of variants which the fonts must include and which will be
     *   downloaded; the first variant in the array will become the default variant (and will be used
     *   in the font picker and the .apply-font class)
     *   Example: ['regular', 'italic', '700', '700italic'] (default: ['regular'])
     *   @prop {number} limit - Maximum number of fonts to be displayed in the list (the least popular
     *   fonts will be omitted; default: 100)
     *   @prop {string} sort - Sorting attribute for the font list
     *   Possible values: 'alphabetical' (default), 'popularity'
     * @prop {function} onChange - Function which is executed whenever the user changes the active font
     * and its stylesheet finishes downloading
     */
    var script = {
        props: ['activeFont', 'apiKey', 'options'],

        data() {
            return {
                state: {
                    activeFont: this.activeFont,
                    errorText: '',
                    expanded: false,
                    loadingStatus: 'loading' // possible values: 'loading', 'finished', 'error'
                },
                pickerSuffix: '',
                fontManager: null,
            };
        },

        mounted() {
            // Determine selector suffix from font picker's name
            if (this.options && this.options.name) {
                this.pickerSuffix = `-${this.options.name}`;
            } else {
                this.pickerSuffix = '';
            }

            // Initialize FontManager object and generate the font list
            this.fontManager = new fontPicker.FontManager(
                this.apiKey,
                this.activeFont,
                this.options
            );

            this.fontManager.init()
                .then(() => {
                    // font list has finished loading
                    this.setState({
                        errorText: '',
                        loadingStatus: 'finished'
                    });
										this.setActiveFont(this.activeFont);
                })
                .catch((err) => {
                    // error while loading font list
                    this.setState({
                        errorText: 'Error trying to fetch the list of available fonts',
                        loadingStatus: 'error'
                    });
                    console.error(this.state.errorText);
                    console.error(err);
                });
        },

        watch: {
            activeFont() {
                if (this.state.activeFont !== this.activeFont) {
                    this.setActiveFont(this.activeFont);
                }
            },
        },

        methods: {
            /**
             * Set state object
             */
            setState(state) {
                this.state = Object.assign(this.state, state);
            },

            /**
             * EventListener for closing the font picker when clicking anywhere outside it
             */
            onClose(e) {
                let targetElement = e.target; // clicked element

                do {
                    if (targetElement === document.getElementById('font-picker')) {
                        // click inside font picker
                        return;
                    }
                    // move up the DOM
                    targetElement = targetElement.parentNode;
                } while (targetElement);

                // click outside font picker
                this.toggleExpanded();
            },

            /**
             * Download the font previews for all visible font entries and the five after them
             */
            onScroll(e) {
                const elementHeight = e.target.scrollHeight / this.fontManager.fonts.length;
                const downloadIndex = Math.ceil((e.target.scrollTop + e.target.clientHeight) / elementHeight);
                this.fontManager.downloadPreviews(downloadIndex + 5);
            },

            /**
             * Set the font with the given font list index as the active one
             */
            setActiveFont(fontFamily) {
                const activeFontIndex = this.fontManager.setActiveFont(fontFamily);
                if (activeFontIndex === -1) {
                    // error trying to change font
                    this.setState({
                        activeFont: fontFamily,
                        errorText: `Cannot update activeFont: The font "${fontFamily}" is not in the font list`,
                        loadingStatus: 'error'
                    });
                    console.error(this.state.errorText);
                } else {
                    // font change successful
                    this.setState({
                        activeFont: fontFamily,
                        errorText: '',
                        loadingStatus: 'finished'
                    });
                }
            },

            /**
             * Expand/collapse the picker's font list
             */
            toggleExpanded() {
                this.setState({
                    expanded: !this.state.expanded
                });
            },

			snakeCase(text) {
                return text.replace(/\s+/g, '-').toLowerCase();
			},

            itemClick(font) {
                this.toggleExpanded();
                this.$emit('change', font);
            }
        },
    };

/* script */
            const __vue_script__ = script;
            
/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      staticClass: "font-picker",
      attrs: {
        id: "font-picker" + _vm.pickerSuffix,
        title: _vm.state.errorText
      }
    },
    [
      _c(
        "button",
        {
          staticClass: "dropdown-button",
          class: { expanded: _vm.state.expanded },
          attrs: { type: "button" },
          on: { click: _vm.toggleExpanded, keypress: _vm.toggleExpanded }
        },
        [
          _c("p", { staticClass: "dropdown-font-name" }, [
            _vm._v(_vm._s(_vm.state.activeFont))
          ]),
          _vm._v(" "),
          _c("p", {
            staticClass: "dropdown-icon",
            class: _vm.state.loadingStatus
          })
        ]
      ),
      _vm._v(" "),
      _vm.state.loadingStatus === "finished" && _vm.fontManager.fonts
        ? _c(
            "ul",
            {
              class: { expanded: _vm.state.expanded },
              on: { scroll: _vm.onScroll }
            },
            _vm._l(_vm.fontManager.fonts, function(font) {
              return _c("li", { key: font.family }, [
                _c(
                  "button",
                  {
                    staticClass: "font-abeezee",
                    class:
                      "font-" +
                      _vm.snakeCase(font.family) +
                      _vm.pickerSuffix +
                      " " +
                      (font.family === _vm.state.activeFont
                        ? "active-font"
                        : ""),
                    attrs: { type: "button" },
                    on: {
                      click: function($event) {
                        _vm.itemClick(font);
                      },
                      keypress: function($event) {
                        _vm.itemClick(font);
                      }
                    }
                  },
                  [_vm._v(_vm._s(font.family))]
                )
              ])
            })
          )
        : _vm._e()
    ]
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-04857da1_0", { source: "\n@charset \"UTF-8\";\n.font-picker {\n  position: relative;\n  display: inline-block;\n  width: 200px;\n  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);\n}\n.font-picker * {\n    box-sizing: border-box;\n}\n.font-picker p {\n    margin: 0;\n    padding: 0;\n}\n.font-picker button {\n    background: none;\n    border: 0;\n    color: inherit;\n    cursor: pointer;\n    font-size: inherit;\n    outline: none;\n}\n.font-picker .dropdown-button {\n    height: 35px;\n    width: 100%;\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 0 10px;\n    background: #CBCBCB;\n}\n.font-picker .dropdown-button:hover, .font-picker .dropdown-button.expanded, .font-picker .dropdown-button:focus {\n      background: #bebebe;\n}\n.font-picker .dropdown-button .dropdown-font-name {\n      overflow: hidden;\n      white-space: nowrap;\n}\n.font-picker .dropdown-button.expanded .dropdown-icon.finished:before {\n      -webkit-transform: rotate(-180deg);\n      transform: rotate(-180deg);\n}\n.font-picker .dropdown-icon {\n    margin-left: 10px;\n}\n.font-picker .dropdown-icon.loading:before {\n      content: '';\n      display: block;\n      height: 10px;\n      width: 10px;\n      border-radius: 50%;\n      border: 2px solid #b2b2b2;\n      border-top-color: black;\n      -webkit-animation: spinner 0.6s linear infinite;\n      animation: spinner 0.6s linear infinite;\n}\n.font-picker .dropdown-icon.finished:before {\n      content: '';\n      display: block;\n      height: 0;\n      width: 0;\n      border-left: 5px solid transparent;\n      border-right: 5px solid transparent;\n      border-top: 6px solid black;\n      transition: -webkit-transform 0.3s;\n      transition: transform 0.3s, -webkit-transform 0.3s;\n      margin: 0 2px;\n}\n.font-picker .dropdown-icon.error:before {\n      content: '⚠';\n}\n.font-picker ul {\n    position: absolute;\n    z-index: 1;\n    max-height: 0;\n    width: 100%;\n    overflow-x: hidden;\n    overflow-y: auto;\n    -webkit-overflow-scrolling: touch;\n    margin: 0;\n    padding: 0;\n    background: #EAEAEA;\n    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);\n    transition: 0.3s;\n}\n.font-picker ul.expanded {\n      max-height: 200px;\n}\n.font-picker ul li {\n      height: 35px;\n      list-style: none;\n}\n.font-picker ul li button {\n        height: 100%;\n        width: 100%;\n        display: flex;\n        align-items: center;\n        padding: 0 10px;\n        white-space: nowrap;\n}\n.font-picker ul li button:hover, .font-picker ul li button:focus {\n          background: #dddddd;\n}\n.font-picker ul li button.active-font {\n          background: #d1d1d1;\n}\n@-webkit-keyframes spinner {\nto {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n}\n}\n@keyframes spinner {\nto {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n}\n}\n\n/*# sourceMappingURL=FontPicker.vue.map */", map: {"version":3,"sources":["FontPicker.vue","/home/guillaume/project/font-picker-vue/src/FontPicker.vue"],"names":[],"mappings":";AAAA,iBAAiB;ACgMjB;EACA,mBAAA;EACA,sBAAA;EACA,aAAA;EACA,2CAAA;CAqHA;AAzHA;IAOA,uBAAA;CACA;AARA;IAWA,UAAA;IACA,WAAA;CACA;AAbA;IAgBA,iBAAA;IACA,UAAA;IACA,eAAA;IACA,gBAAA;IACA,mBAAA;IACA,cAAA;CACA;AAtBA;IAyBA,aAAA;IACA,YAAA;IACA,cAAA;IACA,oBAAA;IACA,+BAAA;IACA,gBAAA;IACA,oBAAA;CAeA;AA9CA;MAkCA,oBAAA;CACA;AAnCA;MAsCA,iBAAA;MACA,oBAAA;CACA;AAxCA;MA2CA,mCAAA;MACA,2BAAA;CACA;AA7CA;IAiDA,kBAAA;CA8BA;AA/EA;MAoDA,YAAA;MACA,eAAA;MACA,aAAA;MACA,YAAA;MACA,mBAAA;MACA,0BAAA;MACA,wBAAA;MACA,gDAAA;MACA,wCAAA;CACA;AA7DA;MAgEA,YAAA;MACA,eAAA;MACA,UAAA;MACA,SAAA;MACA,mCAAA;MACA,oCAAA;MACA,4BAAA;MACA,mCAAA;MACA,mDAAA;MACA,cAAA;CACA;AA1EA;MA6EA,aAAA;CAAA;AA7EA;IAkFA,mBAAA;IACA,WAAA;IACA,cAAA;IACA,YAAA;IACA,mBAAA;IACA,iBAAA;IACA,kCAAA;IACA,UAAA;IACA,WAAA;IACA,oBAAA;IACA,2CAAA;IACA,iBAAA;CA2BA;AAxHA;MAgGA,kBAAA;CACA;AAjGA;MAoGA,aAAA;MACA,iBAAA;CAkBA;AAvHA;QAwGA,aAAA;QACA,YAAA;QACA,cAAA;QACA,oBAAA;QACA,gBAAA;QACA,oBAAA;CASA;AAtHA;UAgHA,oBAAA;CACA;AAjHA;UAoHA,oBAAA;CACA;AAMA;AACA;IACA,kCAAA;IACA,0BAAA;CAAA;CAAA;AAIA;AACA;IACA,kCAAA;IACA,0BAAA;CAAA;CAAA;;ADlOA,0CAA0C","file":"FontPicker.vue","sourcesContent":["@charset \"UTF-8\";\n.font-picker {\n  position: relative;\n  display: inline-block;\n  width: 200px;\n  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2); }\n  .font-picker * {\n    box-sizing: border-box; }\n  .font-picker p {\n    margin: 0;\n    padding: 0; }\n  .font-picker button {\n    background: none;\n    border: 0;\n    color: inherit;\n    cursor: pointer;\n    font-size: inherit;\n    outline: none; }\n  .font-picker .dropdown-button {\n    height: 35px;\n    width: 100%;\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 0 10px;\n    background: #CBCBCB; }\n    .font-picker .dropdown-button:hover, .font-picker .dropdown-button.expanded, .font-picker .dropdown-button:focus {\n      background: #bebebe; }\n    .font-picker .dropdown-button .dropdown-font-name {\n      overflow: hidden;\n      white-space: nowrap; }\n    .font-picker .dropdown-button.expanded .dropdown-icon.finished:before {\n      -webkit-transform: rotate(-180deg);\n      transform: rotate(-180deg); }\n  .font-picker .dropdown-icon {\n    margin-left: 10px; }\n    .font-picker .dropdown-icon.loading:before {\n      content: '';\n      display: block;\n      height: 10px;\n      width: 10px;\n      border-radius: 50%;\n      border: 2px solid #b2b2b2;\n      border-top-color: black;\n      -webkit-animation: spinner 0.6s linear infinite;\n      animation: spinner 0.6s linear infinite; }\n    .font-picker .dropdown-icon.finished:before {\n      content: '';\n      display: block;\n      height: 0;\n      width: 0;\n      border-left: 5px solid transparent;\n      border-right: 5px solid transparent;\n      border-top: 6px solid black;\n      transition: -webkit-transform 0.3s;\n      transition: transform 0.3s, -webkit-transform 0.3s;\n      margin: 0 2px; }\n    .font-picker .dropdown-icon.error:before {\n      content: '⚠'; }\n  .font-picker ul {\n    position: absolute;\n    z-index: 1;\n    max-height: 0;\n    width: 100%;\n    overflow-x: hidden;\n    overflow-y: auto;\n    -webkit-overflow-scrolling: touch;\n    margin: 0;\n    padding: 0;\n    background: #EAEAEA;\n    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);\n    transition: 0.3s; }\n    .font-picker ul.expanded {\n      max-height: 200px; }\n    .font-picker ul li {\n      height: 35px;\n      list-style: none; }\n      .font-picker ul li button {\n        height: 100%;\n        width: 100%;\n        display: flex;\n        align-items: center;\n        padding: 0 10px;\n        white-space: nowrap; }\n        .font-picker ul li button:hover, .font-picker ul li button:focus {\n          background: #dddddd; }\n        .font-picker ul li button.active-font {\n          background: #d1d1d1; }\n\n@-webkit-keyframes spinner {\n  to {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg); } }\n\n@keyframes spinner {\n  to {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg); } }\n\n/*# sourceMappingURL=FontPicker.vue.map */",null]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* component normalizer */
  function __vue_normalize__(
    template, style, script$$1,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script$$1 === 'function' ? script$$1.options : script$$1) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "/home/guillaume/project/font-picker-vue/src/FontPicker.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    {
      let hook;
      if (style) {
        hook = function(context) {
          style.call(this, createInjector(context));
        };
      }

      if (hook !== undefined) {
        if (component.functional) {
          // register for functional component in vue file
          const originalRender = component.render;
          component.render = function renderWithStyleInjection(h, context) {
            hook.call(context);
            return originalRender(h, context)
          };
        } else {
          // inject component registration as beforeCreate hook
          const existing = component.beforeCreate;
          component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
      }
    }

    return component
  }
  /* style inject */
  function __vue_create_injector__() {
    const head = document.head || document.getElementsByTagName('head')[0];
    const styles = __vue_create_injector__.styles || (__vue_create_injector__.styles = {});
    const isOldIE =
      typeof navigator !== 'undefined' &&
      /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

    return function addStyle(id, css) {
      if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return // SSR styles are present.

      const group = isOldIE ? css.media || 'default' : id;
      const style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

      if (!style.ids.includes(id)) {
        let code = css.source;
        let index = style.ids.length;

        style.ids.push(id);

        if (isOldIE) {
          style.element = style.element || document.querySelector('style[data-group=' + group + ']');
        }

        if (!style.element) {
          const el = style.element = document.createElement('style');
          el.type = 'text/css';

          if (css.media) el.setAttribute('media', css.media);
          if (isOldIE) {
            el.setAttribute('data-group', group);
            el.setAttribute('data-next-index', '0');
          }

          head.appendChild(el);
        }

        if (isOldIE) {
          index = parseInt(style.element.getAttribute('data-next-index'));
          style.element.setAttribute('data-next-index', index + 1);
        }

        if (style.element.styleSheet) {
          style.parts.push(code);
          style.element.styleSheet.cssText = style.parts
            .filter(Boolean)
            .join('\n');
        } else {
          const textNode = document.createTextNode(code);
          const nodes = style.element.childNodes;
          if (nodes[index]) style.element.removeChild(nodes[index]);
          if (nodes.length) style.element.insertBefore(textNode, nodes[index]);
          else style.element.appendChild(textNode);
        }
      }
    }
  }
  /* style inject SSR */
  

  
  var FontPicker = __vue_normalize__(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    __vue_create_injector__,
    undefined
  );

module.exports = FontPicker;
