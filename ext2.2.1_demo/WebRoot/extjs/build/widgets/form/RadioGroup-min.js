Ext.form.RadioGroup = Ext.extend(Ext.form.CheckboxGroup, {
			allowBlank : true,
			blankText : "You must select one item in this group",
			defaultType : "radio",
			groupCls : "x-form-radio-group"
		});
Ext.reg("radiogroup", Ext.form.RadioGroup);