Ext.Template = function(f) {
	var c = arguments;
	if (Ext.isArray(f)) {
		f = f.join("")
	} else {
		if (c.length > 1) {
			var d = [];
			for (var e = 0, b = c.length; e < b; e++) {
				if (typeof c[e] == "object") {
					Ext.apply(this, c[e])
				} else {
					d[d.length] = c[e]
				}
			}
			f = d.join("")
		}
	}
	this.html = f;
	if (this.compiled) {
		this.compile()
	}
};
Ext.Template.prototype = {
	applyTemplate : function(b) {
		if (this.compiled) {
			return this.compiled(b)
		}
		var a = this.disableFormats !== true;
		var e = Ext.util.Format, c = this;
		var d = function(g, j, n, h) {
			if (n && a) {
				if (n.substr(0, 5) == "this.") {
					return c.call(n.substr(5), b[j], b)
				} else {
					if (h) {
						var l = /^\s*['"](.*)["']\s*$/;
						h = h.split(",");
						for (var k = 0, f = h.length; k < f; k++) {
							h[k] = h[k].replace(l, "$1")
						}
						h = [b[j]].concat(h)
					} else {
						h = [b[j]]
					}
					return e[n].apply(e, h)
				}
			} else {
				return b[j] !== undefined ? b[j] : ""
			}
		};
		return this.html.replace(this.re, d)
	},
	set : function(a, b) {
		this.html = a;
		this.compiled = null;
		if (b) {
			this.compile()
		}
		return this
	},
	disableFormats : false,
	re : /\{([\w-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g,
	compile : function() {
		var fm = Ext.util.Format;
		var useF = this.disableFormats !== true;
		var sep = Ext.isGecko ? "+" : ",";
		var fn = function(m, name, format, args) {
			if (format && useF) {
				args = args ? "," + args : "";
				if (format.substr(0, 5) != "this.") {
					format = "fm." + format + "("
				} else {
					format = 'this.call("' + format.substr(5) + '", ';
					args = ", values"
				}
			} else {
				args = "";
				format = "(values['" + name + "'] == undefined ? '' : "
			}
			return "'" + sep + format + "values['" + name + "']" + args + ")"
					+ sep + "'"
		};
		var body;
		if (Ext.isGecko) {
			body = "this.compiled = function(values){ return '"
					+ this.html.replace(/\\/g, "\\\\").replace(/(\r\n|\n)/g,
							"\\n").replace(/'/g, "\\'").replace(this.re, fn)
					+ "';};"
		} else {
			body = ["this.compiled = function(values){ return ['"];
			body.push(this.html.replace(/\\/g, "\\\\").replace(/(\r\n|\n)/g,
					"\\n").replace(/'/g, "\\'").replace(this.re, fn));
			body.push("'].join('');};");
			body = body.join("")
		}
		eval(body);
		return this
	},
	call : function(c, b, a) {
		return this[c](b, a)
	},
	insertFirst : function(b, a, c) {
		return this.doInsert("afterBegin", b, a, c)
	},
	insertBefore : function(b, a, c) {
		return this.doInsert("beforeBegin", b, a, c)
	},
	insertAfter : function(b, a, c) {
		return this.doInsert("afterEnd", b, a, c)
	},
	append : function(b, a, c) {
		return this.doInsert("beforeEnd", b, a, c)
	},
	doInsert : function(c, e, b, a) {
		e = Ext.getDom(e);
		var d = Ext.DomHelper.insertHtml(c, e, this.applyTemplate(b));
		return a ? Ext.get(d, true) : d
	},
	overwrite : function(b, a, c) {
		b = Ext.getDom(b);
		b.innerHTML = this.applyTemplate(a);
		return c ? Ext.get(b.firstChild, true) : b.firstChild
	}
};
Ext.Template.prototype.apply = Ext.Template.prototype.applyTemplate;
Ext.DomHelper.Template = Ext.Template;
Ext.Template.from = function(b, a) {
	b = Ext.getDom(b);
	return new Ext.Template(b.value || b.innerHTML, a || "")
};