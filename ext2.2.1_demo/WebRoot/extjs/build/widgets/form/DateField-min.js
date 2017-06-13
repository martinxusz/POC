Ext.form.DateField = Ext.extend(Ext.form.TriggerField, {
	format : "m/d/Y",
	altFormats : "m/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d",
	disabledDaysText : "Disabled",
	disabledDatesText : "Disabled",
	minText : "The date in this field must be equal to or after {0}",
	maxText : "The date in this field must be equal to or before {0}",
	invalidText : "{0} is not a valid date - it must be in the format {1}",
	triggerClass : "x-form-date-trigger",
	showToday : true,
	defaultAutoCreate : {
		tag : "input",
		type : "text",
		size : "10",
		autocomplete : "off"
	},
	initComponent : function() {
		Ext.form.DateField.superclass.initComponent.call(this);
		this.addEvents("select");
		if (typeof this.minValue == "string") {
			this.minValue = this.parseDate(this.minValue)
		}
		if (typeof this.maxValue == "string") {
			this.maxValue = this.parseDate(this.maxValue)
		}
		this.disabledDatesRE = null;
		this.initDisabledDays()
	},
	initDisabledDays : function() {
		if (this.disabledDates) {
			var a = this.disabledDates;
			var c = "(?:";
			for (var b = 0; b < a.length; b++) {
				c += a[b];
				if (b != a.length - 1) {
					c += "|"
				}
			}
			this.disabledDatesRE = new RegExp(c + ")")
		}
	},
	setDisabledDates : function(a) {
		this.disabledDates = a;
		this.initDisabledDays();
		if (this.menu) {
			this.menu.picker.setDisabledDates(this.disabledDatesRE)
		}
	},
	setDisabledDays : function(a) {
		this.disabledDays = a;
		if (this.menu) {
			this.menu.picker.setDisabledDays(a)
		}
	},
	setMinValue : function(a) {
		this.minValue = (typeof a == "string" ? this.parseDate(a) : a);
		if (this.menu) {
			this.menu.picker.setMinDate(this.minValue)
		}
	},
	setMaxValue : function(a) {
		this.maxValue = (typeof a == "string" ? this.parseDate(a) : a);
		if (this.menu) {
			this.menu.picker.setMaxDate(this.maxValue)
		}
	},
	validateValue : function(e) {
		e = this.formatDate(e);
		if (!Ext.form.DateField.superclass.validateValue.call(this, e)) {
			return false
		}
		if (e.length < 1) {
			return true
		}
		var c = e;
		e = this.parseDate(e);
		if (!e) {
			this.markInvalid(String.format(this.invalidText, c, this.format));
			return false
		}
		var f = e.getTime();
		if (this.minValue && f < this.minValue.getTime()) {
			this.markInvalid(String.format(this.minText, this
							.formatDate(this.minValue)));
			return false
		}
		if (this.maxValue && f > this.maxValue.getTime()) {
			this.markInvalid(String.format(this.maxText, this
							.formatDate(this.maxValue)));
			return false
		}
		if (this.disabledDays) {
			var a = e.getDay();
			for (var b = 0; b < this.disabledDays.length; b++) {
				if (a === this.disabledDays[b]) {
					this.markInvalid(this.disabledDaysText);
					return false
				}
			}
		}
		var d = this.formatDate(e);
		if (this.disabledDatesRE && this.disabledDatesRE.test(d)) {
			this.markInvalid(String.format(this.disabledDatesText, d));
			return false
		}
		return true
	},
	validateBlur : function() {
		return !this.menu || !this.menu.isVisible()
	},
	getValue : function() {
		return this
				.parseDate(Ext.form.DateField.superclass.getValue.call(this))
				|| ""
	},
	setValue : function(a) {
		Ext.form.DateField.superclass.setValue.call(this, this.formatDate(this
						.parseDate(a)))
	},
	parseDate : function(d) {
		if (!d || Ext.isDate(d)) {
			return d
		}
		var b = Date.parseDate(d, this.format);
		if (!b && this.altFormats) {
			if (!this.altFormatsArray) {
				this.altFormatsArray = this.altFormats.split("|")
			}
			for (var c = 0, a = this.altFormatsArray.length; c < a && !b; c++) {
				b = Date.parseDate(d, this.altFormatsArray[c])
			}
		}
		return b
	},
	onDestroy : function() {
		if (this.menu) {
			this.menu.destroy()
		}
		if (this.wrap) {
			this.wrap.remove()
		}
		Ext.form.DateField.superclass.onDestroy.call(this)
	},
	formatDate : function(a) {
		return Ext.isDate(a) ? a.dateFormat(this.format) : a
	},
	menuListeners : {
		select : function(a, b) {
			this.setValue(b);
			this.fireEvent("select", this, b)
		},
		show : function() {
			this.onFocus()
		},
		hide : function() {
			this.focus.defer(10, this);
			var a = this.menuListeners;
			this.menu.un("select", a.select, this);
			this.menu.un("show", a.show, this);
			this.menu.un("hide", a.hide, this)
		}
	},
	onTriggerClick : function() {
		if (this.disabled) {
			return
		}
		if (this.menu == null) {
			this.menu = new Ext.menu.DateMenu()
		}
		Ext.apply(this.menu.picker, {
					minDate : this.minValue,
					maxDate : this.maxValue,
					disabledDatesRE : this.disabledDatesRE,
					disabledDatesText : this.disabledDatesText,
					disabledDays : this.disabledDays,
					disabledDaysText : this.disabledDaysText,
					format : this.format,
					showToday : this.showToday,
					minText : String.format(this.minText, this
									.formatDate(this.minValue)),
					maxText : String.format(this.maxText, this
									.formatDate(this.maxValue))
				});
		this.menu.on(Ext.apply({}, this.menuListeners, {
					scope : this
				}));
		this.menu.picker.setValue(this.getValue() || new Date());
		this.menu.show(this.el, "tl-bl?")
	},
	beforeBlur : function() {
		var a = this.parseDate(this.getRawValue());
		if (a) {
			this.setValue(a)
		}
	}
});
Ext.reg("datefield", Ext.form.DateField);