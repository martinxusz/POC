Ext.KeyNav = function(b, a) {
	this.el = Ext.get(b);
	Ext.apply(this, a);
	if (!this.disabled) {
		this.disabled = true;
		this.enable()
	}
};
Ext.KeyNav.prototype = {
	disabled : false,
	defaultEventAction : "stopEvent",
	forceKeyDown : false,
	prepareEvent : function(c) {
		var a = c.getKey();
		var b = this.keyToHandler[a];
		if (Ext.isSafari2 && b && a >= 37 && a <= 40) {
			c.stopEvent()
		}
	},
	relay : function(c) {
		var a = c.getKey();
		var b = this.keyToHandler[a];
		if (b && this[b]) {
			if (this.doRelay(c, this[b], b) !== true) {
				c[this.defaultEventAction]()
			}
		}
	},
	doRelay : function(c, b, a) {
		return b.call(this.scope || this, c)
	},
	enter : false,
	left : false,
	right : false,
	up : false,
	down : false,
	tab : false,
	esc : false,
	pageUp : false,
	pageDown : false,
	del : false,
	home : false,
	end : false,
	keyToHandler : {
		37 : "left",
		39 : "right",
		38 : "up",
		40 : "down",
		33 : "pageUp",
		34 : "pageDown",
		46 : "del",
		36 : "home",
		35 : "end",
		13 : "enter",
		27 : "esc",
		9 : "tab"
	},
	enable : function() {
		if (this.disabled) {
			if (this.forceKeyDown || Ext.isIE || Ext.isSafari3 || Ext.isAir) {
				this.el.on("keydown", this.relay, this)
			} else {
				this.el.on("keydown", this.prepareEvent, this);
				this.el.on("keypress", this.relay, this)
			}
			this.disabled = false
		}
	},
	disable : function() {
		if (!this.disabled) {
			if (this.forceKeyDown || Ext.isIE || Ext.isSafari3 || Ext.isAir) {
				this.el.un("keydown", this.relay, this)
			} else {
				this.el.un("keydown", this.prepareEvent, this);
				this.el.un("keypress", this.relay, this)
			}
			this.disabled = true
		}
	}
};