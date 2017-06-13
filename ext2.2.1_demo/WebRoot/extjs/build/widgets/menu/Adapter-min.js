Ext.menu.Adapter = function(b, a) {
	Ext.menu.Adapter.superclass.constructor.call(this, a);
	this.component = b
};
Ext.extend(Ext.menu.Adapter, Ext.menu.BaseItem, {
			canActivate : true,
			onRender : function(b, a) {
				this.component.render(b);
				this.el = this.component.getEl()
			},
			activate : function() {
				if (this.disabled) {
					return false
				}
				this.component.focus();
				this.fireEvent("activate", this);
				return true
			},
			deactivate : function() {
				this.fireEvent("deactivate", this)
			},
			disable : function() {
				this.component.disable();
				Ext.menu.Adapter.superclass.disable.call(this)
			},
			enable : function() {
				this.component.enable();
				Ext.menu.Adapter.superclass.enable.call(this)
			}
		});