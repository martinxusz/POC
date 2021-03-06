Ext.util.Observable = function() {
	if (this.listeners) {
		this.on(this.listeners);
		delete this.listeners
	}
};
Ext.util.Observable.prototype = {
	fireEvent : function() {
		if (this.eventsSuspended !== true) {
			var a = this.events[arguments[0].toLowerCase()];
			if (typeof a == "object") {
				return a.fire
						.apply(a, Array.prototype.slice.call(arguments, 1))
			}
		}
		return true
	},
	filterOptRe : /^(?:scope|delay|buffer|single)$/,
	addListener : function(a, c, b, g) {
		if (typeof a == "object") {
			g = a;
			for (var f in g) {
				if (this.filterOptRe.test(f)) {
					continue
				}
				if (typeof g[f] == "function") {
					this.addListener(f, g[f], g.scope, g)
				} else {
					this.addListener(f, g[f].fn, g[f].scope, g[f])
				}
			}
			return
		}
		g = (!g || typeof g == "boolean") ? {} : g;
		a = a.toLowerCase();
		var d = this.events[a] || true;
		if (typeof d == "boolean") {
			d = new Ext.util.Event(this, a);
			this.events[a] = d
		}
		d.addListener(c, b, g)
	},
	removeListener : function(a, c, b) {
		var d = this.events[a.toLowerCase()];
		if (typeof d == "object") {
			d.removeListener(c, b)
		}
	},
	purgeListeners : function() {
		for (var a in this.events) {
			if (typeof this.events[a] == "object") {
				this.events[a].clearListeners()
			}
		}
	},
	relayEvents : function(f, d) {
		var e = function(g) {
			return function() {
				return this.fireEvent.apply(this, Ext.combine(g,
								Array.prototype.slice.call(arguments, 0)))
			}
		};
		for (var c = 0, a = d.length; c < a; c++) {
			var b = d[c];
			if (!this.events[b]) {
				this.events[b] = true
			}
			f.on(b, e(b), this)
		}
	},
	addEvents : function(e) {
		if (!this.events) {
			this.events = {}
		}
		if (typeof e == "string") {
			for (var d = 0, b = arguments, c; c = b[d]; d++) {
				if (!this.events[b[d]]) {
					this.events[b[d]] = true
				}
			}
		} else {
			Ext.applyIf(this.events, e)
		}
	},
	hasListener : function(a) {
		var b = this.events[a];
		return typeof b == "object" && b.listeners.length > 0
	},
	suspendEvents : function() {
		this.eventsSuspended = true
	},
	resumeEvents : function() {
		this.eventsSuspended = false
	},
	getMethodEvent : function(h) {
		if (!this.methodEvents) {
			this.methodEvents = {}
		}
		var g = this.methodEvents[h];
		if (!g) {
			g = {};
			this.methodEvents[h] = g;
			g.originalFn = this[h];
			g.methodName = h;
			g.before = [];
			g.after = [];
			var c, b, d;
			var f = this;
			var a = function(j, i, e) {
				if ((b = j.apply(i || f, e)) !== undefined) {
					if (typeof b === "object") {
						if (b.returnValue !== undefined) {
							c = b.returnValue
						} else {
							c = b
						}
						if (b.cancel === true) {
							d = true
						}
					} else {
						if (b === false) {
							d = true
						} else {
							c = b
						}
					}
				}
			};
			this[h] = function() {
				c = b = undefined;
				d = false;
				var j = Array.prototype.slice.call(arguments, 0);
				for (var k = 0, e = g.before.length; k < e; k++) {
					a(g.before[k].fn, g.before[k].scope, j);
					if (d) {
						return c
					}
				}
				if ((b = g.originalFn.apply(f, j)) !== undefined) {
					c = b
				}
				for (var k = 0, e = g.after.length; k < e; k++) {
					a(g.after[k].fn, g.after[k].scope, j);
					if (d) {
						return c
					}
				}
				return c
			}
		}
		return g
	},
	beforeMethod : function(d, b, a) {
		var c = this.getMethodEvent(d);
		c.before.push({
					fn : b,
					scope : a
				})
	},
	afterMethod : function(d, b, a) {
		var c = this.getMethodEvent(d);
		c.after.push({
					fn : b,
					scope : a
				})
	},
	removeMethodListener : function(g, d, c) {
		var f = this.getMethodEvent(g);
		for (var b = 0, a = f.before.length; b < a; b++) {
			if (f.before[b].fn == d && f.before[b].scope == c) {
				f.before.splice(b, 1);
				return
			}
		}
		for (var b = 0, a = f.after.length; b < a; b++) {
			if (f.after[b].fn == d && f.after[b].scope == c) {
				f.after.splice(b, 1);
				return
			}
		}
	}
};
Ext.util.Observable.prototype.on = Ext.util.Observable.prototype.addListener;
Ext.util.Observable.prototype.un = Ext.util.Observable.prototype.removeListener;
Ext.util.Observable.capture = function(c, b, a) {
	c.fireEvent = c.fireEvent.createInterceptor(b, a)
};
Ext.util.Observable.releaseCapture = function(a) {
	a.fireEvent = Ext.util.Observable.prototype.fireEvent
};
(function() {
	var b = function(f, g, e) {
		var d = new Ext.util.DelayedTask();
		return function() {
			d.delay(g.buffer, f, e, Array.prototype.slice.call(arguments, 0))
		}
	};
	var c = function(g, i, f, d) {
		return function() {
			i.removeListener(f, d);
			return g.apply(d, arguments)
		}
	};
	var a = function(e, f, d) {
		return function() {
			var g = Array.prototype.slice.call(arguments, 0);
			setTimeout(function() {
						e.apply(d, g)
					}, f.delay || 10)
		}
	};
	Ext.util.Event = function(e, d) {
		this.name = d;
		this.obj = e;
		this.listeners = []
	};
	Ext.util.Event.prototype = {
		addListener : function(g, f, e) {
			f = f || this.obj;
			if (!this.isListening(g, f)) {
				var d = this.createListener(g, f, e);
				if (!this.firing) {
					this.listeners.push(d)
				} else {
					this.listeners = this.listeners.slice(0);
					this.listeners.push(d)
				}
			}
		},
		createListener : function(g, f, i) {
			i = i || {};
			f = f || this.obj;
			var d = {
				fn : g,
				scope : f,
				options : i
			};
			var e = g;
			if (i.delay) {
				e = a(e, i, f)
			}
			if (i.single) {
				e = c(e, this, g, f)
			}
			if (i.buffer) {
				e = b(e, i, f)
			}
			d.fireFn = e;
			return d
		},
		findListener : function(j, h) {
			h = h || this.obj;
			var f = this.listeners;
			for (var g = 0, d = f.length; g < d; g++) {
				var e = f[g];
				if (e.fn == j && e.scope == h) {
					return g
				}
			}
			return -1
		},
		isListening : function(e, d) {
			return this.findListener(e, d) != -1
		},
		removeListener : function(f, e) {
			var d;
			if ((d = this.findListener(f, e)) != -1) {
				if (!this.firing) {
					this.listeners.splice(d, 1)
				} else {
					this.listeners = this.listeners.slice(0);
					this.listeners.splice(d, 1)
				}
				return true
			}
			return false
		},
		clearListeners : function() {
			this.listeners = []
		},
		fire : function() {
			var f = this.listeners, j, d = f.length;
			if (d > 0) {
				this.firing = true;
				var g = Array.prototype.slice.call(arguments, 0);
				for (var h = 0; h < d; h++) {
					var e = f[h];
					if (e.fireFn
							.apply(e.scope || this.obj || window, arguments) === false) {
						this.firing = false;
						return false
					}
				}
				this.firing = false
			}
			return true
		}
	}
})();