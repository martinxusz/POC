Ext.form.NumberField = Ext.extend(Ext.form.TextField, {
	fieldClass : "x-form-field x-form-num-field",
	allowDecimals : true,
	decimalSeparator : ".",
	decimalPrecision : 2,
	allowNegative : true,
	minValue : Number.NEGATIVE_INFINITY,
	maxValue : Number.MAX_VALUE,
	minText : "The minimum value for this field is {0}",
	maxText : "The maximum value for this field is {0}",
	nanText : "{0} is not a valid number",
	baseChars : "0123456789",
	initEvents : function() {
		Ext.form.NumberField.superclass.initEvents.call(this);
		var b = this.baseChars + "";
		if (this.allowDecimals) {
			b += this.decimalSeparator
		}
		if (this.allowNegative) {
			b += "-"
		}
		this.stripCharsRe = new RegExp("[^" + b + "]", "gi");
		var a = function(f) {
			var d = f.getKey();
			if (!Ext.isIE
					&& (f.isSpecialKey() || d == f.BACKSPACE || d == f.DELETE)) {
				return
			}
			var g = f.getCharCode();
			if (b.indexOf(String.fromCharCode(g)) === -1) {
				f.stopEvent()
			}
		};
		this.el.on("keypress", a, this)
	},
	validateValue : function(b) {
		if (!Ext.form.NumberField.superclass.validateValue.call(this, b)) {
			return false
		}
		if (b.length < 1) {
			return true
		}
		b = String(b).replace(this.decimalSeparator, ".");
		if (isNaN(b)) {
			this.markInvalid(String.format(this.nanText, b));
			return false
		}
		var a = this.parseValue(b);
		if (a < this.minValue) {
			this.markInvalid(String.format(this.minText, this.minValue));
			return false
		}
		if (a > this.maxValue) {
			this.markInvalid(String.format(this.maxText, this.maxValue));
			return false
		}
		return true
	},
	getValue : function() {
		return this
				.fixPrecision(this
						.parseValue(Ext.form.NumberField.superclass.getValue
								.call(this)))
	},
	setValue : function(a) {
		a = typeof a == "number" ? a : parseFloat(String(a).replace(
				this.decimalSeparator, "."));
		a = isNaN(a) ? "" : String(a).replace(".", this.decimalSeparator);
		Ext.form.NumberField.superclass.setValue.call(this, a)
	},
	parseValue : function(a) {
		a = parseFloat(String(a).replace(this.decimalSeparator, "."));
		return isNaN(a) ? "" : a
	},
	fixPrecision : function(b) {
		var a = isNaN(b);
		if (!this.allowDecimals || this.decimalPrecision == -1 || a || !b) {
			return a ? "" : b
		}
		return parseFloat(parseFloat(b).toFixed(this.decimalPrecision))
	},
	beforeBlur : function() {
		var a = this.parseValue(this.getRawValue());
		if (a || a === 0) {
			this.setValue(this.fixPrecision(a))
		}
	}
});
Ext.reg("numberfield", Ext.form.NumberField);