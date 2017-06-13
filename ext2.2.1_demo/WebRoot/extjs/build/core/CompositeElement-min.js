Ext.CompositeElement = function(a) {
	this.elements = [];
	this.addElements(a)
};
Ext.CompositeElement.prototype = {
	isComposite : true,
	addElements : function(e) {
		if (!e) {
			return this
		}
		if (typeof e == "string") {
			e = Ext.Element.selectorFunction(e)
		}
		var d = this.elements;
		var b = d.length - 1;
		for (var c = 0, a = e.length; c < a; c++) {
			d[++b] = Ext.get(e[c])
		}
		return this
	},
	fill : function(a) {
		this.elements = [];
		this.add(a);
		return this
	},
	filter : function(a) {
		var b = [];
		this.each(function(c) {
					if (c.is(a)) {
						b[b.length] = c.dom
					}
				});
		this.fill(b);
		return this
	},
	invoke : function(e, b) {
		var d = this.elements;
		for (var c = 0, a = d.length; c < a; c++) {
			Ext.Element.prototype[e].apply(d[c], b)
		}
		return this
	},
	add : function(a) {
		if (typeof a == "string") {
			this.addElements(Ext.Element.selectorFunction(a))
		} else {
			if (a.length !== undefined) {
				this.addElements(a)
			} else {
				this.addElements([a])
			}
		}
		return this
	},
	each : function(e, d) {
		var c = this.elements;
		for (var b = 0, a = c.length; b < a; b++) {
			if (e.call(d || c[b], c[b], this, b) === false) {
				break
			}
		}
		return this
	},
	item : function(a) {
		return this.elements[a] || null
	},
	first : function() {
		return this.item(0)
	},
	last : function() {
		return this.item(this.elements.length - 1)
	},
	getCount : function() {
		return this.elements.length
	},
	contains : function(a) {
		return this.indexOf(a) !== -1
	},
	indexOf : function(a) {
		return this.elements.indexOf(Ext.get(a))
	},
	removeElement : function(e, g) {
		if (Ext.isArray(e)) {
			for (var c = 0, a = e.length; c < a; c++) {
				this.removeElement(e[c])
			}
			return this
		}
		var b = typeof e == "number" ? e : this.indexOf(e);
		if (b !== -1 && this.elements[b]) {
			if (g) {
				var f = this.elements[b];
				if (f.dom) {
					f.remove()
				} else {
					Ext.removeNode(f)
				}
			}
			this.elements.splice(b, 1)
		}
		return this
	},
	replaceElement : function(d, c, a) {
		var b = typeof d == "number" ? d : this.indexOf(d);
		if (b !== -1) {
			if (a) {
				this.elements[b].replaceWith(c)
			} else {
				this.elements.splice(b, 1, Ext.get(c))
			}
		}
		return this
	},
	clear : function() {
		this.elements = []
	}
};
(function() {
	Ext.CompositeElement.createCall = function(b, c) {
		if (!b[c]) {
			b[c] = function() {
				return this.invoke(c, arguments)
			}
		}
	};
	for (var a in Ext.Element.prototype) {
		if (typeof Ext.Element.prototype[a] == "function") {
			Ext.CompositeElement.createCall(Ext.CompositeElement.prototype, a)
		}
	}
})();
Ext.CompositeElementLite = function(a) {
	Ext.CompositeElementLite.superclass.constructor.call(this, a);
	this.el = new Ext.Element.Flyweight()
};
Ext.extend(Ext.CompositeElementLite, Ext.CompositeElement, {
			addElements : function(e) {
				if (e) {
					if (Ext.isArray(e)) {
						this.elements = this.elements.concat(e)
					} else {
						var d = this.elements;
						var b = d.length - 1;
						for (var c = 0, a = e.length; c < a; c++) {
							d[++b] = e[c]
						}
					}
				}
				return this
			},
			invoke : function(f, b) {
				var d = this.elements;
				var e = this.el;
				for (var c = 0, a = d.length; c < a; c++) {
					e.dom = d[c];
					Ext.Element.prototype[f].apply(e, b)
				}
				return this
			},
			item : function(a) {
				if (!this.elements[a]) {
					return null
				}
				this.el.dom = this.elements[a];
				return this.el
			},
			addListener : function(b, g, f, e) {
				var d = this.elements;
				for (var c = 0, a = d.length; c < a; c++) {
					Ext.EventManager.on(d[c], b, g, f || d[c], e)
				}
				return this
			},
			each : function(f, e) {
				var c = this.elements;
				var d = this.el;
				for (var b = 0, a = c.length; b < a; b++) {
					d.dom = c[b];
					if (f.call(e || d, d, this, b) === false) {
						break
					}
				}
				return this
			},
			indexOf : function(a) {
				return this.elements.indexOf(Ext.getDom(a))
			},
			replaceElement : function(e, c, a) {
				var b = typeof e == "number" ? e : this.indexOf(e);
				if (b !== -1) {
					c = Ext.getDom(c);
					if (a) {
						var f = this.elements[b];
						f.parentNode.insertBefore(c, f);
						Ext.removeNode(f)
					}
					this.elements.splice(b, 1, c)
				}
				return this
			}
		});
Ext.CompositeElementLite.prototype.on = Ext.CompositeElementLite.prototype.addListener;
if (Ext.DomQuery) {
	Ext.Element.selectorFunction = Ext.DomQuery.select
}
Ext.Element.select = function(a, d, b) {
	var c;
	if (typeof a == "string") {
		c = Ext.Element.selectorFunction(a, b)
	} else {
		if (a.length !== undefined) {
			c = a
		} else {
			throw "Invalid selector"
		}
	}
	if (d === true) {
		return new Ext.CompositeElement(c)
	} else {
		return new Ext.CompositeElementLite(c)
	}
};
Ext.select = Ext.Element.select;