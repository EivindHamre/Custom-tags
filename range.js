Node.prototype.qs = qs = function (selector) { return this.querySelector?.(selector) }

class DoubleRange extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.min = parseInt(this.attributes.min?.value) || 0;
        this.max = parseInt(this.attributes.max?.value) || 100;
        this.step = parseInt(this.attributes.step?.valueAsNumber) || 1;
        this.lower = parseInt(this.attributes.lower?.valueAsNumber) || 0;
        this.upper = parseInt(this.attributes.upper?.valueAsNumber) || 100;

        const shadowRoot = this.attachShadow({ mode: 'open' })
        const root = document.createElement('div')
        root.innerHTML = `
            <input type="range" min="${this.lower}" max="${this.max - this.step}" step="${this.step}" value="${this.min}" id="lower" />
            <input type="range" min="${this.min + this.step}" max="${this.upper}" step="${this.step}" value="${this.max}" id="upper" />
        `
        root.qs("#lower").oninput = (e) => {
            this.min = e.target.valueAsNumber
            root.qs("#upper").min = this.min + this.step
            root.qs("#upper").style.width = `${100 - 100 * this.min / (this.upper - this.lower)}%`
            root.qs('#upper').style.marginLeft = `${100 * this.min / (this.upper - this.lower)}%`
        }
        root.qs("#upper").oninput = (e) => {
            this.max = e.target.valueAsNumber
            root.qs("#lower").max = this.max - this.step
            root.qs("#lower").style.width = `${100 * this.max / (this.upper - this.lower)}%`
        }
        shadowRoot.appendChild(root)

        const style = document.createElement('style')
        style.innerHTML = `
            *{
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
            :host{
                position: relative;
                display: inline-block;
                width: 130px;
            }
            input{
                position: absolute;
            }
            #lower{
                width: ${100 * this.max / (this.upper - this.lower)}%;
                margin-left: 0;
            }
            #upper{
                width: ${100 - 100 * this.min / (this.upper - this.lower)}%;
                margin-left: ${100 * this.min / (this.upper - this.lower)}%;
            }
            ::-webkit-slider-container{
                pointer-events: none;
            }
            ::-webkit-slider-runnable-track{
                pointer-events: none;
            }
            ::-webkit-slider-thumb{
                pointer-events: all;
            }
            `
        shadowRoot.appendChild(style)
        // this.oninput = () => console.log(this.min, this.max)
    }
}

customElements.define("double-range", DoubleRange);
