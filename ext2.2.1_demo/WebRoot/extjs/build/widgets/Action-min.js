Ext.Action = function(a) {
	this.initialConfig = a;
	this.items = []
};
Ext.Action.prototype = {
	isAction : true,
	setText : function(a) {
		this.initialConfig.text = a;
		this.callEach("setText", [a])
	},
	getText : function() {
		return this.initialConfig.text
	},
	setIconClass : function(a) {
		this.initialConfig.iconCls = a;
		this.callEach("setIconClass", [a])
	},
	getIconClass : function() {
		return this.initialConfig.iconCls
	},
	setDisabled : function(a) {
		this.initialConfig.disabled = a;
		this.callEach("setDisabled", [a])
	},
	enable : function() {
		this.setDisabled(false)
	},
	disable : function() {
		this.setDisabled(true)
	},
	isDisabled : function() {
		return this.initialConfig.disabled
	},
	setHidden : function(a) {
		this.initialConfig.hidden = a;
		this.callEach("setVisible", [!a])
	},
	show : function() {
		this.setHidden(false)
	},
	hide : function() {
		this.setHidden(true)
	},
	isHidden : function() {
		return this.initialConfig.hidden
	},
	setHandler : function(b, a) {
		this.initialConfig.handler = b;
		this.initialConfig.scope = a;
		this.callEach("setHandler", [b, a])
	},
	each : function(b, a) {
		Ext.each(this.items, b, a)
	},
	callEach : function(e, b) {
		var d = this.items;
		for (var c = 0, a = d.length; c < a; c++) {
			d[c][e].apply(d[c], b)
		}
	},
	addComponent : function(a) {
		this.items.push(a);
		a.on("destroy", this.removeComponent, this)
	},
	removeComponent : function(a) {
		this.items.remove(a)
	},
	execute : function() {
		this.initialConfig.handler.apply(this.initialConfig.scope || window,
				arguments)
	}
};