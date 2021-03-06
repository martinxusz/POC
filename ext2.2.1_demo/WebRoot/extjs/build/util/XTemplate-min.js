Ext.XTemplate = function() {
	Ext.XTemplate.superclass.constructor.apply(this, arguments);
	var r = this.html;
	r = ["<tpl>", r, "</tpl>"].join("");
	var q = /<tpl\b[^>]*>((?:(?=([^<]+))\2|<(?!tpl\b[^>]*>))*?)<\/tpl>/;
	var p = /^<tpl\b[^>]*?for="(.*?)"/;
	var n = /^<tpl\b[^>]*?if="(.*?)"/;
	var k = /^<tpl\b[^>]*?exec="(.*?)"/;
	var c, b = 0;
	var g = [];
	while (c = r.match(q)) {
		var o = c[0].match(p);
		var l = c[0].match(n);
		var j = c[0].match(k);
		var e = null, h = null, d = null;
		var a = o && o[1] ? o[1] : "";
		if (l) {
			e = l && l[1] ? l[1] : null;
			if (e) {
				h = new Function("values", "parent", "xindex", "xcount",
						"with(values){ return "
								+ (Ext.util.Format.htmlDecode(e)) + "; }")
			}
		}
		if (j) {
			e = j && j[1] ? j[1] : null;
			if (e) {
				d = new Function("values", "parent", "xindex", "xcount",
						"with(values){ " + (Ext.util.Format.htmlDecode(e))
								+ "; }")
			}
		}
		if (a) {
			switch (a) {
				case "." :
					a = new Function("values", "parent",
							"with(values){ return values; }");
					break;
				case ".." :
					a = new Function("values", "parent",
							"with(values){ return parent; }");
					break;
				default :
					a = new Function("values", "parent",
							"with(values){ return " + a + "; }")
			}
		}
		g.push({
					id : b,
					target : a,
					exec : d,
					test : h,
					body : c[1] || ""
				});
		r = r.replace(c[0], "{xtpl" + b + "}");
		++b
	}
	for (var f = g.length - 1; f >= 0; --f) {
		this.compileTpl(g[f])
	}
	this.master = g[g.length - 1];
	this.tpls = g
};
Ext.extend(Ext.XTemplate, Ext.Template, {
	re : /\{([\w-\.\#]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?(\s?[\+\-\*\\]\s?[\d\.\+\-\*\\\(\)]+)?\}/g,
	codeRe : /\{\[((?:\\\]|.|\n)*?)\]\}/g,
	applySubTemplate : function(a, h, g, d, c) {
		var k = this.tpls[a];
		if (k.test && !k.test.call(this, h, g, d, c)) {
			return ""
		}
		if (k.exec && k.exec.call(this, h, g, d, c)) {
			return ""
		}
		var j = k.target ? k.target.call(this, h, g) : h;
		g = k.target ? h : g;
		if (k.target && Ext.isArray(j)) {
			var b = [];
			for (var e = 0, f = j.length; e < f; e++) {
				b[b.length] = k.compiled.call(this, j[e], g, e + 1, f)
			}
			return b.join("")
		}
		return k.compiled.call(this, j, g, d, c)
	},
	compileTpl : function(tpl) {
		var fm = Ext.util.Format;
		var useF = this.disableFormats !== true;
		var sep = Ext.isGecko ? "+" : ",";
		var fn = function(m, name, format, args, math) {
			if (name.substr(0, 4) == "xtpl") {
				return "'" + sep + "this.applySubTemplate(" + name.substr(4)
						+ ", values, parent, xindex, xcount)" + sep + "'"
			}
			var v;
			if (name === ".") {
				v = "values"
			} else {
				if (name === "#") {
					v = "xindex"
				} else {
					if (name.indexOf(".") != -1) {
						v = name
					} else {
						v = "values['" + name + "']"
					}
				}
			}
			if (math) {
				v = "(" + v + math + ")"
			}
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
				format = "(" + v + " === undefined ? '' : "
			}
			return "'" + sep + format + v + args + ")" + sep + "'"
		};
		var codeFn = function(m, code) {
			return "'" + sep + "(" + code + ")" + sep + "'"
		};
		var body;
		if (Ext.isGecko) {
			body = "tpl.compiled = function(values, parent, xindex, xcount){ return '"
					+ tpl.body.replace(/(\r\n|\n)/g, "\\n")
							.replace(/'/g, "\\'").replace(this.re, fn).replace(
									this.codeRe, codeFn) + "';};"
		} else {
			body = ["tpl.compiled = function(values, parent, xindex, xcount){ return ['"];
			body.push(tpl.body.replace(/(\r\n|\n)/g, "\\n")
					.replace(/'/g, "\\'").replace(this.re, fn).replace(
							this.codeRe, codeFn));
			body.push("'].join('');};");
			body = body.join("")
		}
		eval(body);
		return this
	},
	applyTemplate : function(a) {
		return this.master.compiled.call(this, a, {}, 1, 1)
	},
	compile : function() {
		return this
	}
});
Ext.XTemplate.prototype.apply = Ext.XTemplate.prototype.applyTemplate;
Ext.XTemplate.from = function(a) {
	a = Ext.getDom(a);
	return new Ext.XTemplate(a.value || a.innerHTML)
};