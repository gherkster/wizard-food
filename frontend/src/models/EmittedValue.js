class EmittedValue {
  /**
   * @param {Object} value - The emitted value
   * @param {Number} index - The index of the emitted value if emitted a collection value
   * @param {String} path - The dot-path of the emitted value
   */
  constructor(value, index = null, path = null) {
    this.value = value;
    this.path = path;
    this.index = index;
  }
}

export default EmittedValue;
