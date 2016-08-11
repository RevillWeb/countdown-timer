"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by Leon Revill on 02/08/2016.
 * Twitter: @RevillWeb
 * Blog: blog.revillweb.com
 * Website: www.revillweb.com
 */

/**
 * Class which represents the main countdown timer element
 */
var CountdownWc = function (_HTMLElement) {
    _inherits(CountdownWc, _HTMLElement);

    /**
     * Construct the timer element with some initial markup and styling
     */
    function CountdownWc() {
        _classCallCheck(this, CountdownWc);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CountdownWc).call(this));

        _this.attachShadow({ mode: 'open' });
        _this.shadowRoot.innerHTML = "\n            <style>\n                @import url(https://fonts.googleapis.com/css?family=Oswald:400,300,700);\n                .countdown-timer-container {\n                    font-family: 'Oswald', sans-serif;\n                }\n                .countdown-timer-container .section {\n                    width: 120px;\n                    height: 150px;\n                    float: left;\n                    margin-right: 10px;\n                    position: relative;\n                }\n                .countdown-timer-container .section .count-container {\n                    height: 120px; \n                }\n                .countdown-timer-container .section .count-label {\n                    height: 30px;\n                    line-height: 30px;\n                    text-align: center;\n                }\n            </style>\n            <div class=\"countdown-timer-container\">\n                <div class=\"section\">\n                    <div class=\"count-container\">\n                        <countdown-wc-number id=\"days\"></countdown-wc-number>\n                    </div>\n                    <div class=\"count-label\">DAYS</div>\n                </div>\n                <div class=\"section\">\n                    <div class=\"count-container\">\n                        <countdown-wc-number id=\"hours\"></countdown-wc-number>\n                    </div>\n                    <div class=\"count-label\">HOURS</div>\n                </div>\n                <div class=\"section\">\n                    <div class=\"count-container\">\n                        <countdown-wc-number id=\"minutes\"></countdown-wc-number>\n                    </div>\n                    <div class=\"count-label\">MINUTES</div>\n                </div>\n                <div class=\"section\">\n                    <div class=\"count-container\">\n                        <countdown-wc-number id=\"seconds\"></countdown-wc-number>\n                    </div>\n                    <div class=\"count-label\">SECONDS</div>\n                </div>\n            </div>\n            \n        ";

        _this.$days = _this.shadowRoot.querySelector("#days");
        _this.$hours = _this.shadowRoot.querySelector("#hours");
        _this.$minutes = _this.shadowRoot.querySelector("#minutes");
        _this.$seconds = _this.shadowRoot.querySelector("#seconds");

        _this._interval = null;
        return _this;
    }

    /**
     * Method to parse the date string to a valid date object
     * @param dateString
     */


    _createClass(CountdownWc, [{
        key: "parseDateString",
        value: function parseDateString(dateString) {
            try {
                this._date = new Date(dateString);
            } catch (e) {
                console.error("Couldn't parse date string:", e);
            }
        }

        /**
         * Method to update the components DOM
         */

    }, {
        key: "render",
        value: function render() {
            var now = new Date();
            var delta = Math.abs(this._date - now) / 1000;
            this._days = Math.floor(delta / 86400);
            delta -= this._days * 86400;
            this._hours = Math.floor(delta / 3600) % 24;
            delta -= this._hours * 3600;
            this._minutes = Math.floor(delta / 60) % 60;
            delta -= this._minutes * 60;
            this._seconds = Math.floor(delta % 60);

            this.$days.setAttribute("value", this._days);
            this.$hours.setAttribute("value", this._hours);
            this.$minutes.setAttribute("value", this._minutes);
            this.$seconds.setAttribute("value", this._seconds);
        }

        /**
         * Method to initiate the interval when the timer is added to the DOM
         */

    }, {
        key: "connectedCallback",
        value: function connectedCallback() {
            var _this2 = this;

            this._interval = setInterval(function () {
                _this2.render();
            }, 1000);
        }

        /**
         * When the timer is removed from the DOM clear the interval
         */

    }, {
        key: "disconnectedCallback",
        value: function disconnectedCallback() {
            clearInterval(this._interval);
        }

        /**
         * Method which specifies which element attributes to observe
         * @returns {string[]}
         */

    }, {
        key: "attributeChangedCallback",


        /**
         * Re-render when the date string is changed
         * @param name
         * @param oldValue
         * @param newValue
         */
        value: function attributeChangedCallback(name, oldValue, newValue) {
            //"name" will only ever be the date attribute because of "observedAttributes"
            if (newValue !== oldValue) {
                this.parseDateString(newValue);
                this.render();
            }
        }
    }], [{
        key: "observedAttributes",
        get: function get() {
            return ["date"];
        }
    }]);

    return CountdownWc;
}(HTMLElement);

/**
 * Define the custom element as countdown-timer using the Custom Elements V1 API
 */


customElements.define("countdown-wc", CountdownWc);

/**
 * Class which represents the timer number element
 */

var CountdownWcNumber = function (_HTMLElement2) {
    _inherits(CountdownWcNumber, _HTMLElement2);

    /**
     * Construct the number eleemnt with some initial HTML markup and styling
     */
    function CountdownWcNumber() {
        _classCallCheck(this, CountdownWcNumber);

        var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(CountdownWcNumber).call(this));

        _this3.current = null;
        _this3.next = null;
        _this3.innerHTML = "\n            <style>\n                .count {        \n                  height: 120px;\n                  line-height: 120px;\n                  -moz-perspective: 320px;\n                  -webkit-perspective: 320px;\n                  perspective: 320px;\n                  position: absolute;\n                  text-align: center;                 \n                  -moz-transform: translateZ(0);\n                  -webkit-transform: translateZ(0);\n                  transform: translateZ(0);\n                  width: 120px;\n                }\n                .count span {\n                  background: #202020;\n                  color: #f8f8f8;\n                  display: block;\n                  font-size: 70px;\n                  left: 0;\n                  position: absolute;\n                  top: 0;                 \n                  -moz-transform-origin: 0 60px 0;\n                  -webkit-transform-origin: 0 60px 0;\n                  transform-origin: 0 60px 0;\n                  width: 100%;\n                }\n                .count.size4 span {\n                    font-size: 55px; \n                }\n                .count.size5 span {\n                    font-size: 45px; \n                }\n                .count.size6 span {\n                    font-size: 35px; \n                }\n                .count span:before {\n                  border-bottom: 2px solid #000;\n                  content: \"\";\n                  left: 0;\n                  position: absolute;\n                  width: 100%;\n                }\n                .count span:after {               \n                  content: \"\";\n                  height: 100%;\n                  left: 0;\n                  position: absolute;\n                  top: 0;\n                  width: 100%;\n                }\n                .count .top {                                   \n                  height: 50%;\n                  overflow: hidden;\n                }\n                .count .top:before {\n                  bottom: 0;\n                }               \n                .count .bottom {                 \n                  height: 100%;\n                }\n                .count .bottom:before {\n                  top: 50%;\n                }                \n                .count .top {\n                  height: 50%;\n                }\n                .count .top.current {\n                  -moz-transform-style: flat;\n                  -webkit-transform-style: flat;\n                  transform-style: flat;\n                  z-index: 3;\n                }\n                .count .top.next {\n                  -moz-transform: rotate3d(1, 0, 0, -90deg);\n                  -ms-transform: rotate3d(1, 0, 0, -90deg);\n                  -webkit-transform: rotate3d(1, 0, 0, -90deg);\n                  transform: rotate3d(1, 0, 0, -90deg);\n                  z-index: 4;\n                }\n                .count .bottom.current {\n                  z-index: 2;\n                }\n                .count .bottom.next {\n                  z-index: 1;\n                }\n                .count.changing .bottom.current {\n                  -moz-transform: rotate3d(1, 0, 0, 90deg);\n                  -ms-transform: rotate3d(1, 0, 0, 90deg);\n                  -webkit-transform: rotate3d(1, 0, 0, 90deg);\n                  transform: rotate3d(1, 0, 0, 90deg);\n                  -moz-transition: -moz-transform 0.35s ease-in;\n                  -o-transition: -o-transform 0.35s ease-in;\n                  -webkit-transition: -webkit-transform 0.35s ease-in;\n                  transition: transform 0.35s ease-in;\n                }\n                .count.changing .top.next, .count.changed .top.next {\n                  -moz-transition: -moz-transform 0.35s ease-out 0.35s;\n                  -o-transition: -o-transform 0.35s ease-out 0.35s;\n                  -webkit-transition: -webkit-transform 0.35s ease-out;\n                  -webkit-transition-delay: 0.35s;\n                  transition: transform 0.35s ease-out 0.35s;\n                  -moz-transform: none;\n                  -ms-transform: none;\n                  -webkit-transform: none;\n                  transform: none;\n                }\n                .count.changed .top.current,\n                .count.changed .bottom.current {\n                  display: none;\n                }\n            </style>\n            <div class=\"count\">           \n                <span class=\"current top\"></span>\n                <span class=\"next top\"></span>\n                <span class=\"current bottom\"></span>\n                <span class=\"next bottom\"></span>\n            </div>\n        ";
        _this3.$count = _this3.querySelector(".count");
        _this3.querySelector(".count .top.next").addEventListener("transitionend", function () {
            //Clean up after the animation has been completed
            _this3.$count.classList.add("changed");
            _this3.$count.classList.remove("changing");
            _this3.current = _this3.next;
        });
        return _this3;
    }

    /**
     * Only observe the value attribute
     * @returns {string[]}
     */


    _createClass(CountdownWcNumber, [{
        key: "setSize",


        /**
         * Methid to determine the size class to be applied to the $count element
         * @param value
         */
        value: function setSize(value) {
            var length = value.toString().length;
            if (length > 3) {
                this.$count.classList.add("size" + length);
            }
        }

        /**
         * Method used to update the number element DOM
         */

    }, {
        key: "render",
        value: function render() {
            var _this4 = this;

            if (this.current !== null) {
                var $currents = this.querySelectorAll(".current");
                [].forEach.call($currents, function (el) {
                    el.innerText = _this4.current;
                });
            }
            if (this.next !== null) {
                this.setSize(this.next);
                var $nexts = this.querySelectorAll(".next");
                [].forEach.call($nexts, function (el) {
                    el.innerText = _this4.next;
                });
            }
        }

        /**
         * When the value attribute changes update the DOM accordingly and initiate the animation
         * @param name
         * @param oldValue
         * @param newValue
         */

    }, {
        key: "attributeChangedCallback",
        value: function attributeChangedCallback(name, oldValue, newValue) {
            var _this5 = this;

            if (oldValue === null) {
                var current = parseInt(newValue);
                if (isNaN(current)) {
                    console.error("Value must be a number.");
                    return;
                }
                this.current = current;
                this.render();
            } else if (oldValue !== null && newValue !== oldValue) {
                var next = parseInt(newValue);
                if (isNaN(next)) {
                    console.error("Value must be a number.");
                    return;
                }
                this.next = next;
                this.render();
                //Initiate the animation
                this.$count.classList.remove("changed");
                this.$count.classList.remove("changing");
                setTimeout(function () {
                    _this5.$count.classList.add("changing");
                }, 20);
            }
        }
    }], [{
        key: "observedAttributes",
        get: function get() {
            return ["value"];
        }
    }]);

    return CountdownWcNumber;
}(HTMLElement);

/**
 * Define the custom element as countdown-timer-number using the Custom Element V1 API
 */


customElements.define("countdown-wc-number", CountdownWcNumber);
