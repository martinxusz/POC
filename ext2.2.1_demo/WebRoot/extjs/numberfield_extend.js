Ext.override(Ext.form.NumberField, {
			setValue : function(v) {
				v = typeof v == 'number' ? v : parseFloat(String(v).replace(
						this.decimalSeparator, "."));
				v = isNaN(v) ? '' : v.toFixed(this.decimalPrecision).replace(
						".", this.decimalSeparator);
				return Ext.form.NumberField.superclass.setValue.call(this, v);
			}
		});