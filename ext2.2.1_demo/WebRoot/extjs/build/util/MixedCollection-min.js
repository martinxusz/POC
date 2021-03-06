Ext.util.MixedCollection = function(b, a) {
	this.items = [];
	this.map = {};
	this.keys = [];
	this.length = 0;
	this.addEvents("clear", "add", "replace", "remove", "sort");
	this.allowFunctions = b === true;
	if (a) {
		this.getKey = a
	}
	Ext.util.MixedCollection.superclass.constructor.call(this)
};
Ext.extend(Ext.util.MixedCollection, Ext.util.Observable, {
	allowFunctions : false,
	add : function(b, c) {
		if (arguments.length == 1) {
			c = arguments[0];
			b = this.getKey(c)
		}
		if (typeof b == "undefined" || b === null) {
			this.length++;
			this.items.push(c);
			this.keys.push(null)
		} else {
			var a = this.map[b];
			if (a) {
				return this.replace(b, c)
			}
			this.length++;
			this.items.push(c);
			this.map[b] = c;
			this.keys.push(b)
		}
		this.fireEvent("add", this.length - 1, c, b);
		return c
	},
	getKey : function(a) {
		return a.id
	},
	replace : function(c, d) {
		if (arguments.length == 1) {
			d = arguments[0];
			c = this.getKey(d)
		}
		var a = this.item(c);
		if (typeof c == "undefined" || c === null || typeof a == "undefined") {
			return this.add(c, d)
		}
		var b = this.indexOfKey(c);
		this.items[b] = d;
		this.map[c] = d;
		this.fireEvent("replace", c, a, d);
		return d
	},
	addAll : function(e) {
		if (arguments.length > 1 || Ext.isArray(e)) {
			var b = arguments.length > 1 ? arguments : e;
			for (var d = 0, a = b.length; d < a; d++) {
				this.add(b[d])
			}
		} else {
			for (var c in e) {
				if (this.allowFunctions || typeof e[c] != "function") {
					this.add(c, e[c])
				}
			}
		}
	},
	each : function(e, d) {
		var b = [].concat(this.items);
		for (var c = 0, a = b.length; c < a; c++) {
			if (e.call(d || b[c], b[c], c, a) === false) {
				break
			}
		}
	},
	eachKey : function(d, c) {
		for (var b = 0, a = this.keys.length; b < a; b++) {
			d.call(c || window, this.keys[b], this.items[b], b, a)
		}
	},
	find : function(d, c) {
		for (var b = 0, a = this.items.length; b < a; b++) {
			if (d.call(c || window, this.items[b], this.keys[b])) {
				return this.items[b]
			}
		}
		return null
	},
	insert : function(a, b, c) {
		if (arguments.length == 2) {
			c = arguments[1];
			b = this.getKey(c)
		}
		if (a >= this.length) {
			return this.add(b, c)
		}
		this.length++;
		this.items.splice(a, 0, c);
		if (typeof b != "undefined" && b != null) {
			this.map[b] = c
		}
		this.keys.splice(a, 0, b);
		this.fireEvent("add", a, c, b);
		return c
	},
	remove : function(a) {
		return this.removeAt(this.indexOf(a))
	},
	removeAt : function(a) {
		if (a < this.length && a >= 0) {
			this.length--;
			var c = this.items[a];
			this.items.splice(a, 1);
			var b = this.keys[a];
			if (typeof b != "undefined") {
				delete this.map[b]
			}
			this.keys.splice(a, 1);
			this.fireEvent("remove", c, b);
			return c
		}
		return false
	},
	removeKey : function(a) {
		return this.removeAt(this.indexOfKey(a))
	},
	getCount : function() {
		return this.length
	},
	indexOf : function(a) {
		return this.items.indexOf(a)
	},
	indexOfKey : function(a) {
		return this.keys.indexOf(a)
	},
	item : function(a) {
		var b = typeof this.map[a] != "undefined" ? this.map[a] : this.items[a];
		return typeof b != "function" || this.allowFunctions ? b : null
	},
	itemAt : function(a) {
		return this.items[a]
	},
	key : function(a) {
		return this.map[a]
	},
	contains : function(a) {
		return this.indexOf(a) != -1
	},
	containsKey : function(a) {
		return typeof this.map[a] != "undefined"
	},
	clear : function() {
		this.length = 0;
		this.items = [];
		this.keys = [];
		this.map = {};
		this.fireEvent("clear")
	},
	first : function() {
		return this.items[0]
	},
	last : function() {
		return this.items[this.length - 1]
	},
	_sort : function(l, a, j) {
		var d = String(a).toUpperCase() == "DESC" ? -1 : 1;
		j = j || function(i, c) {
			return i - c
		};
		var h = [], b = this.keys, g = this.items;
		for (var e = 0, f = g.length; e < f; e++) {
			h[h.length] = {
				key : b[e],
				value : g[e],
				index : e
			}
		}
		h.sort(function(i, c) {
					var k = j(i[l], c[l]) * d;
					if (k == 0) {
						k = (i.index < c.index ? -1 : 1)
					}
					return k
				});
		for (var e = 0, f = h.length; e < f; e++) {
			g[e] = h[e].value;
			b[e] = h[e].key
		}
		this.fireEvent("sort", this)
	},
	sort : function(a, b) {
		this._sort("value", a, b)
	},
	keySort : function(a, b) {
		this._sort("key", a, b || function(d, c) {
					var f = String(d).toUpperCase(), e = String(c)
							.toUpperCase();
					return f > e ? 1 : (f < e ? -1 : 0)
				})
	},
	getRange : function(e, a) {
		var b = this.items;
		if (b.length < 1) {
			return []
		}
		e = e || 0;
		a = Math.min(typeof a == "undefined" ? this.length - 1 : a, this.length
						- 1);
		var d = [];
		if (e <= a) {
			for (var c = e; c <= a; c++) {
				d[d.length] = b[c]
			}
		} else {
			for (var c = e; c >= a; c--) {
				d[d.length] = b[c]
			}
		}
		return d
	},
	filter : function(c, b, d, a) {
		if (Ext.isEmpty(b, false)) {
			return this.clone()
		}
		b = this.createValueMatcher(b, d, a);
		return this.filterBy(function(e) {
					return e && b.test(e[c])
				})
	},
	filterBy : function(f, e) {
		var g = new Ext.util.MixedCollection();
		g.getKey = this.getKey;
		var b = this.keys, d = this.items;
		for (var c = 0, a = d.length; c < a; c++) {
			if (f.call(e || this, d[c], b[c])) {
				g.add(b[c], d[c])
			}
		}
		return g
	},
	findIndex : function(c, b, e, d, a) {
		if (Ext.isEmpty(b, false)) {
			return -1
		}
		b = this.createValueMatcher(b, d, a);
		return this.findIndexBy(function(f) {
					return f && b.test(f[c])
				}, null, e)
	},
	findIndexBy : function(f, e, g) {
		var b = this.keys, d = this.items;
		for (var c = (g || 0), a = d.length; c < a; c++) {
			if (f.call(e || this, d[c], b[c])) {
				return c
			}
		}
		if (typeof g == "number" && g > 0) {
			for (var c = 0; c < g; c++) {
				if (f.call(e || this, d[c], b[c])) {
					return c
				}
			}
		}
		return -1
	},
	createValueMatcher : function(b, c, a) {
		if (!b.exec) {
			b = String(b);
			b = new RegExp((c === true ? "" : "^") + Ext.escapeRe(b), a
							? ""
							: "i")
		}
		return b
	},
	clone : function() {
		var e = new Ext.util.MixedCollection();
		var b = this.keys, d = this.items;
		for (var c = 0, a = d.length; c < a; c++) {
			e.add(b[c], d[c])
		}
		e.getKey = this.getKey;
		return e
	}
});
Ext.util.MixedCollection.prototype.get = Ext.util.MixedCollection.prototype.item;