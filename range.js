const doubleRangeProto = Object.create(HTMLElement.prototype);

doubleRangeProto.createdCallback = function () {
    this.innerHTML = "<input type='range' min='0' max='100' value='50' step='1'><br>";
}

const doubleRange = document.registerElement("double-range", {
    prototype: doubleRangeProto
});