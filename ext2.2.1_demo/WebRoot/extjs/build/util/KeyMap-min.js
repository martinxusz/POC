Ext.KeyMap = function(c, b, a) {
	this.el = Ext.get(c);
	this.eventName = a || "keydown";
	this.bindings = [];
	if (b) {
		this.addBinding(b)
	}
	this.enable()
};
Ext.KeyMap.prototype = {
	stopEvent : false,
	addBinding : function(d) {
		if (Ext.isArray(d)) {
			for (var f = 0, h = d.length; f < h; f++) {
				this.addBinding(d[f])
			}
			return
		}
		var p = d.key, c = d.shift, a = d.ctrl, g = d.alt, l = d.fn
				|| d.handler, o = d.scope;
		if (d.stopEvent) {
			this.stopEvent = d.stopEvent
		}
		if (typeof p == "string") {
			var m = [];
			var k = p.toUpperCase();
			for (var e = 0, h = k.length; e < h; e++) {
				m.push(k.charCodeAt(e))
			}
			p = m
		}
		var b = Ext.isArray(p);
		var n = function(s) {
			if ((!c || s.shiftKey) && (!a || s.ctrlKey) && (!g || s.altKey)) {
				var q = s.getKey();
				if (b) {
					for (var r = 0, j = p.length; r < j; r++) {
						if (p[r] == q) {
							if (this.stopEvent) {
								s.stopEvent()
							}
							l.call(o || window, q, s);
							return
						}
					}
				} else {
					if (q == p) {
						if (this.stopEvent) {
							s.stopEvent()
						}
						l.call(o || window, q, s)
					}
				}
			}
		};
		this.bindings.push(n)
	},
	on : function(b, d, c) {
		var g, a, e, f;
		if (typeof b == "object" && !Ext.isArray(b)) {
			g = b.key;
			a = b.shift;
			e = b.ctrl;
			f = b.alt
		} else {
			g = b
		}
		this.addBinding({
					key : g,
					shift : a,
					ctrl : e,
					alt : f,
					fn : d,
					scope : c
				})
	},
	handleKeyDown : function(f) {
		if (this.enabled) {
			var c = this.bindings;
			for (var d = 0, a = c.length; d < a; d++) {
				c[d].call(this, f)
			}
		}
	},
	isEnabled : function() {
		return this.enabled
	},
	enable : function() {
		if (!this.enabled) {
			this.el.on(this.eventName, this.handleKeyDown, this);
			this.enabled = true
		}
	},
	disable : function() {
		if (this.enabled) {
			this.el.removeListener(this.eventName, this.handleKeyDown, this);
			this.enabled = false
		}
	}
};