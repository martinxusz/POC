Ext.form.TimeField = Ext.extend(Ext.form.ComboBox, {
	minValue : null,
	maxValue : null,
	minText : "The time in this field must be equal to or after {0}",
	maxText : "The time in this field must be equal to or before {0}",
	invalidText : "{0} is not a valid time",
	format : "g:i A",
	altFormats : "g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|ha|gA|h a|g a|g A|gi|hi|gia|hia|g|H",
	increment : 15,
	mode : "local",
	triggerAction : "all",
	typeAhead : false,
	initDate : "1/1/2008",
	initComponent : function() {
		Ext.form.TimeField.superclass.initComponent.call(this);
		if (typeof this.minValue == "string") {
			this.minValue = this.parseDate(this.minValue)
		}
		if (typeof this.maxValue == "string") {
			this.maxValue = this.parseDate(this.maxValue)
		}
		if (!this.store) {
			var b = this.parseDate(this.minValue);
			if (!b) {
				b = new Date(this.initDate).clearTime()
			}
			var a = this.parseDate(this.maxValue);
			if (!a) {
				a = new Date(this.initDate).clearTime()
						.add("mi", (24 * 60) - 1)
			}
			var c = [];
			while (b <= a) {
				c.push([b.dateFormat(this.format)]);
				b = b.add("mi", this.increment)
			}
			this.store = new Ext.data.SimpleStore({
						fields : ["text"],
						data : c
					});
			this.displayField = "text"
		}
	},
	getValue : function() {
		var a = Ext.form.TimeField.superclass.getValue.call(this);
		return this.formatDate(this.parseDate(a)) || ""
	},
	setValue : function(a) {
		Ext.form.TimeField.superclass.setValue.call(this, this.formatDate(this
						.parseDate(a)))
	},
	validateValue : Ext.form.DateField.prototype.validateValue,
	parseDate : Ext.form.DateField.prototype.parseDate,
	formatDate : Ext.form.DateField.prototype.formatDate,
	beforeBlur : function() {
		var a = this.parseDate(this.getRawValue());
		if (a) {
			this.setValue(a.dateFormat(this.format))
		}
	}
});
Ext.reg("timefield", Ext.form.TimeField);