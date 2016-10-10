/**
 * Created by Leon Revill on 02/08/2016.
 * Twitter: @RevillWeb
 * Blog: blog.revillweb.com
 * Website: www.revillweb.com
 */

/**
 * Class which represents the main countdown timer element
 */
class CountdownWc extends HTMLElement {
    /**
     * Construct the timer element with some initial markup and styling
     */
    constructor(self) {
        self = super(self);
        self.attachShadow({ mode: 'open' });
        self.shadowRoot.innerHTML = `
            <style>
                @import url(https://fonts.googleapis.com/css?family=Oswald:400,300,700);
                .countdown-timer-container {
                    font-family: 'Oswald', sans-serif;
                }
                .countdown-timer-container .section {
                    width: 120px;
                    height: 150px;
                    float: left;
                    margin-right: 10px;
                    position: relative;
                }
                .countdown-timer-container .section .count-container {
                    height: 120px; 
                }
                .countdown-timer-container .section .count-label {
                    height: 30px;
                    line-height: 30px;
                    text-align: center;
                }
            </style>
            <div class="countdown-timer-container">
                <div class="section">
                    <div class="count-container">
                        <countdown-wc-number id="days"></countdown-wc-number>
                    </div>
                    <div class="count-label">DAYS</div>
                </div>
                <div class="section">
                    <div class="count-container">
                        <countdown-wc-number id="hours"></countdown-wc-number>
                    </div>
                    <div class="count-label">HOURS</div>
                </div>
                <div class="section">
                    <div class="count-container">
                        <countdown-wc-number id="minutes"></countdown-wc-number>
                    </div>
                    <div class="count-label">MINUTES</div>
                </div>
                <div class="section">
                    <div class="count-container">
                        <countdown-wc-number id="seconds"></countdown-wc-number>
                    </div>
                    <div class="count-label">SECONDS</div>
                </div>
            </div>
            
        `;
        self._interval = null;
        return self;
    }

    /**
     * Method to parse the date string to a valid date object
     * @param dateString
     */
    parseDateString(dateString) {
        try {
            this._date = new Date(dateString);
        } catch (e) {
            console.error("Couldn't parse date string:", e);
        }
    }

    /**
     * Method to update the components DOM
     */
    render() {
        const now = new Date();
        let delta = Math.abs(this._date - now) / 1000;
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
    connectedCallback() {
        this.$days = this.shadowRoot.querySelector("#days");
        this.$hours = this.shadowRoot.querySelector("#hours");
        this.$minutes = this.shadowRoot.querySelector("#minutes");
        this.$seconds = this.shadowRoot.querySelector("#seconds");
        this.render();
        this._interval = setInterval(() => {
            this.render();
        }, 1000);
    }

    /**
     * When the timer is removed from the DOM clear the interval
     */
    disconnectedCallback() {
        clearInterval(this._interval);
    }

    /**
     * Method which specifies which element attributes to observe
     * @returns {string[]}
     */
    static get observedAttributes() { return ["date"]; }

    /**
     * Re-render when the date string is changed
     * @param name
     * @param oldValue
     * @param newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
        //"name" will only ever be the date attribute because of "observedAttributes"
        if (newValue !== null && newValue !== oldValue) {
            this.parseDateString(newValue);
        }
    }

}

/**
 * Define the custom element as countdown-timer using the Custom Elements V1 API
 */
customElements.define("countdown-wc", CountdownWc);


/**
 * Class which represents the timer number element
 */
class CountdownWcNumber extends HTMLElement {
    /**
     * Construct the number eleemnt with some initial HTML markup and styling
     */
    constructor(self) {
        self = super(self);
        self.current = null;
        self.next = null;
        self.innerHTML = `
            <style>
                .count {        
                  height: 120px;
                  line-height: 120px;
                  -moz-perspective: 320px;
                  -webkit-perspective: 320px;
                  perspective: 320px;
                  position: absolute;
                  text-align: center;                 
                  -moz-transform: translateZ(0);
                  -webkit-transform: translateZ(0);
                  transform: translateZ(0);
                  width: 120px;
                }
                .count span {
                  background: #202020;
                  color: #f8f8f8;
                  display: block;
                  font-size: 70px;
                  left: 0;
                  position: absolute;
                  top: 0;                 
                  -moz-transform-origin: 0 60px 0;
                  -webkit-transform-origin: 0 60px 0;
                  transform-origin: 0 60px 0;
                  width: 100%;
                }
                .count.size4 span {
                    font-size: 55px; 
                }
                .count.size5 span {
                    font-size: 45px; 
                }
                .count.size6 span {
                    font-size: 35px; 
                }
                .count span:before {
                  border-bottom: 2px solid #000;
                  content: "";
                  left: 0;
                  position: absolute;
                  width: 100%;
                }
                .count span:after {               
                  content: "";
                  height: 100%;
                  left: 0;
                  position: absolute;
                  top: 0;
                  width: 100%;
                }
                .count .top {                                   
                  height: 50%;
                  overflow: hidden;
                }
                .count .top:before {
                  bottom: 0;
                }               
                .count .bottom {                 
                  height: 100%;
                }
                .count .bottom:before {
                  top: 50%;
                }                
                .count .top {
                  height: 50%;
                }
                .count .top.current {
                  -moz-transform-style: flat;
                  -webkit-transform-style: flat;
                  transform-style: flat;
                  z-index: 3;
                }
                .count .top.next {
                  -moz-transform: rotate3d(1, 0, 0, -90deg);
                  -ms-transform: rotate3d(1, 0, 0, -90deg);
                  -webkit-transform: rotate3d(1, 0, 0, -90deg);
                  transform: rotate3d(1, 0, 0, -90deg);
                  z-index: 4;
                }
                .count .bottom.current {
                  z-index: 2;
                }
                .count .bottom.next {
                  z-index: 1;
                }
                .count.changing .bottom.current {
                  -moz-transform: rotate3d(1, 0, 0, 90deg);
                  -ms-transform: rotate3d(1, 0, 0, 90deg);
                  -webkit-transform: rotate3d(1, 0, 0, 90deg);
                  transform: rotate3d(1, 0, 0, 90deg);
                  -moz-transition: -moz-transform 0.35s ease-in;
                  -o-transition: -o-transform 0.35s ease-in;
                  -webkit-transition: -webkit-transform 0.35s ease-in;
                  transition: transform 0.35s ease-in;
                }
                .count.changing .top.next, .count.changed .top.next {
                  -moz-transition: -moz-transform 0.35s ease-out 0.35s;
                  -o-transition: -o-transform 0.35s ease-out 0.35s;
                  -webkit-transition: -webkit-transform 0.35s ease-out;
                  -webkit-transition-delay: 0.35s;
                  transition: transform 0.35s ease-out 0.35s;
                  -moz-transform: none;
                  -ms-transform: none;
                  -webkit-transform: none;
                  transform: none;
                }
                .count.changed .top.current,
                .count.changed .bottom.current {
                  display: none;
                }
            </style>
            <div class="count">           
                <span class="current top"></span>
                <span class="next top"></span>
                <span class="current bottom"></span>
                <span class="next bottom"></span>
            </div>
        `;
        return self;
    }

    connectedCallback() {
        this.$count = this.querySelector(".count");
        this.querySelector(".count .top.next").addEventListener("transitionend", () => {
            //Clean up after the animation has been completed
            this.$count.classList.add("changed");
            this.$count.classList.remove("changing");
            this.current = this.next;
        });
    }

    /**
     * Only observe the value attribute
     * @returns {string[]}
     */
    static get observedAttributes() {
        return ["value"];
    }

    /**
     * Methid to determine the size class to be applied to the $count element
     * @param value
     */
    setSize(value) {
        const length = value.toString().length;
        if (length > 3) {
            this.$count.classList.add("size" + length);
        }
    }

    /**
     * Method used to update the number element DOM
     */
    render() {
        if (this.current !== null) {
            const $currents = this.querySelectorAll(".current");
            [].forEach.call($currents, (el) => {
                el.innerText = this.current;
            });
        }
        if (this.next !== null) {
            this.setSize(this.next);
            const $nexts = this.querySelectorAll(".next");
           [].forEach.call($nexts, (el) => {
                el.innerText = this.next;
            });
        }
    }

    /**
     * When the value attribute changes update the DOM accordingly and initiate the animation
     * @param name
     * @param oldValue
     * @param newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === null) {
            const current = parseInt(newValue);
            if (isNaN(current)) {
                console.error("Value must be a number.");
                return;
            }
            this.current = current;
            this.render();
        } else if (oldValue !== null && newValue !== oldValue) {
            const next = parseInt(newValue);
            if (isNaN(next)) {
                console.error("Value must be a number.");
                return;
            }
            this.next = next;
            this.render();
            //Initiate the animation
            this.$count.classList.remove("changed");
            this.$count.classList.remove("changing");
            setTimeout(() => {
                this.$count.classList.add("changing");
            }, 20);
        }
    }
}

/**
 * Define the custom element as countdown-timer-number using the Custom Element V1 API
 */
customElements.define("countdown-wc-number", CountdownWcNumber);
