Node.prototype.qs = qs = function (selector) { return this.querySelector?.(selector) }

class DoubleRange extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.value = {
            min: parseInt(this.attributes.min?.value) || 0,
            max: parseInt(this.attributes.max?.value) || 100
        }
        this.step = parseInt(this.attributes.step?.valueAsNumber) || 1;
        this.lower = parseInt(this.attributes.lower?.valueAsNumber) || 0;
        this.upper = parseInt(this.attributes.upper?.valueAsNumber) || 100;

        const shadowRoot = this.attachShadow({ mode: 'open' })
        const root = document.createElement('div')
        root.innerHTML = `
            <input type="range" min="${this.lower}" max="${this.value.max - this.step}" step="${this.step}" value="${this.value.min}" id="lower" />
            <input type="range" min="${this.value.min + this.step}" max="${this.upper}" step="${this.step}" value="${this.value.max}" id="upper" />
        `
        root.qs("#lower").oninput = (e) => {
            this.value.min = e.target.valueAsNumber
            root.qs("#upper").min = this.value.min + this.step
            root.qs("#upper").style.width = `${100 - 100 * this.value.min / (this.upper - this.lower)}%`
            root.qs('#upper').style.marginLeft = `${100 * this.value.min / (this.upper - this.lower)}%`
        }
        root.qs("#upper").oninput = (e) => {
            this.value.max = e.target.valueAsNumber
            root.qs("#lower").max = this.value.max - this.step
            root.qs("#lower").style.width = `${100 * this.value.max / (this.upper - this.lower)}%`
            root.qs('#lower').style.marginRight = `${100 * (1 - this.value.max / (this.upper - this.lower))}%`
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
                pointer-events: none;
            }
            #lower{
                width: ${100 * this.value.max / (this.upper - this.lower)}%;
                margin-right: ${100 * this.value.min / (this.upper - this.lower)}%;
            }
            #upper{
                width: ${100 - 100 * this.value.min / (this.upper - this.lower)}%;
                margin-left: ${100 * this.value.min / (this.upper - this.lower)}%;
            }
            ::-webkit-slider-thumb{
                pointer-events: all;
                position: relative;
                z-index: 1;
            }
            `
        shadowRoot.appendChild(style)
        //this.oninput = () => console.log(this.value.min, this.value.max)
    }
}

customElements.define("double-range", DoubleRange);
