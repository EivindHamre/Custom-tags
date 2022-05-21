const doubleRangeProto = Object.create(HTMLElement.prototype);

doubleRangeProto.createdCallback = function () {
    this.innerHTML = "<b>Double Range</b>";
}

const doubleRange = document.registerElement("double-range", {
    prototype: doubleRangeProto
});