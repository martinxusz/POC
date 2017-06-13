/*
 * Ext JS Library 2.2.1 Copyright(c) 2006-2009, Ext JS, LLC. licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.DomHelper = function() {
	var m = null;
	var g = /^(?:br|frame|hr|img|input|link|meta|range|spacer|wbr|area|param|col)$/i;
	var b = /^table|tbody|tr|td$/i;
	var a = function(w) {
		if (typeof w == "string") {
			return w
		}
		var q = "";
		if (Ext.isArray(w)) {
			for (var u = 0, r = w.length; u < r; u++) {
				q += a(w[u])
			}
			return q
		}
		if (!w.tag) {
			w.tag = "div"
		}
		q += "<" + w.tag;
		for (var p in w) {
			if (p == "tag" || p == "children" || p == "cn" || p == "html"
					|| typeof w[p] == "function") {
				continue
			}
			if (p == "style") {
				var v = w.style;
				if (typeof v == "function") {
					v = v.call()
				}
				if (typeof v == "string") {
					q += ' style="' + v + '"'
				} else {
					if (typeof v == "object") {
						q += ' style="';
						for (var t in v) {
							if (typeof v[t] != "function") {
								q += t + ":" + v[t] + ";"
							}
						}
						q += '"'
					}
				}
			} else {
				if (p == "cls") {
					q += ' class="' + w.cls + '"'
				} else {
					if (p == "htmlFor") {
						q += ' for="' + w.htmlFor + '"'
					} else {
						q += " " + p + '="' + w[p] + '"'
					}
				}
			}
		}
		if (g.test(w.tag)) {
			q += "/>"
		} else {
			q += ">";
			var x = w.children || w.cn;
			if (x) {
				q += a(x)
			} else {
				if (w.html) {
					q += w.html
				}
			}
			q += "</" + w.tag + ">"
		}
		return q
	};
	var n = function(v, q) {
		var u;
		if (Ext.isArray(v)) {
			u = document.createDocumentFragment();
			for (var t = 0, r = v.length; t < r; t++) {
				n(v[t], u)
			}
		} else {
			if (typeof v == "string") {
				u = document.createTextNode(v)
			} else {
				u = document.createElement(v.tag || "div");
				var s = !!u.setAttribute;
				for (var p in v) {
					if (p == "tag" || p == "children" || p == "cn"
							|| p == "html" || p == "style"
							|| typeof v[p] == "function") {
						continue
					}
					if (p == "cls") {
						u.className = v.cls
					} else {
						if (s) {
							u.setAttribute(p, v[p])
						} else {
							u[p] = v[p]
						}
					}
				}
				Ext.DomHelper.applyStyles(u, v.style);
				var w = v.children || v.cn;
				if (w) {
					n(w, u)
				} else {
					if (v.html) {
						u.innerHTML = v.html
					}
				}
			}
		}
		if (q) {
			q.appendChild(u)
		}
		return u
	};
	var j = function(u, r, q, t) {
		m.innerHTML = [r, q, t].join("");
		var o = -1, p = m;
		while (++o < u) {
			p = p.firstChild
		}
		return p
	};
	var k = "<table>", e = "</table>", c = k + "<tbody>", l = "</tbody>" + e, i = c
			+ "<tr>", d = "</tr>" + l;
	var h = function(o, p, r, q) {
		if (!m) {
			m = document.createElement("div")
		}
		var s;
		var t = null;
		if (o == "td") {
			if (p == "afterbegin" || p == "beforeend") {
				return
			}
			if (p == "beforebegin") {
				t = r;
				r = r.parentNode
			} else {
				t = r.nextSibling;
				r = r.parentNode
			}
			s = j(4, i, q, d)
		} else {
			if (o == "tr") {
				if (p == "beforebegin") {
					t = r;
					r = r.parentNode;
					s = j(3, c, q, l)
				} else {
					if (p == "afterend") {
						t = r.nextSibling;
						r = r.parentNode;
						s = j(3, c, q, l)
					} else {
						if (p == "afterbegin") {
							t = r.firstChild
						}
						s = j(4, i, q, d)
					}
				}
			} else {
				if (o == "tbody") {
					if (p == "beforebegin") {
						t = r;
						r = r.parentNode;
						s = j(2, k, q, e)
					} else {
						if (p == "afterend") {
							t = r.nextSibling;
							r = r.parentNode;
							s = j(2, k, q, e)
						} else {
							if (p == "afterbegin") {
								t = r.firstChild
							}
							s = j(3, c, q, l)
						}
					}
				} else {
					if (p == "beforebegin" || p == "afterend") {
						return
					}
					if (p == "afterbegin") {
						t = r.firstChild
					}
					s = j(2, k, q, e)
				}
			}
		}
		r.insertBefore(s, t);
		return s
	};
	return {
		useDom : false,
		markup : function(p) {
			return a(p)
		},
		applyStyles : function(q, r) {
			if (r) {
				q = Ext.fly(q);
				if (typeof r == "string") {
					var p = /\s?([a-z\-]*)\:\s?([^;]*);?/gi;
					var s;
					while ((s = p.exec(r)) != null) {
						q.setStyle(s[1], s[2])
					}
				} else {
					if (typeof r == "object") {
						for (var o in r) {
							q.setStyle(o, r[o])
						}
					} else {
						if (typeof r == "function") {
							Ext.DomHelper.applyStyles(q, r.call())
						}
					}
				}
			}
		},
		insertHtml : function(q, s, r) {
			q = q.toLowerCase();
			if (s.insertAdjacentHTML) {
				if (b.test(s.tagName)) {
					var p;
					if (p = h(s.tagName.toLowerCase(), q, s, r)) {
						return p
					}
				}
				switch (q) {
					case "beforebegin" :
						s.insertAdjacentHTML("BeforeBegin", r);
						return s.previousSibling;
					case "afterbegin" :
						s.insertAdjacentHTML("AfterBegin", r);
						return s.firstChild;
					case "beforeend" :
						s.insertAdjacentHTML("BeforeEnd", r);
						return s.lastChild;
					case "afterend" :
						s.insertAdjacentHTML("AfterEnd", r);
						return s.nextSibling
				}
				throw 'Illegal insertion point -> "' + q + '"'
			}
			var o = s.ownerDocument.createRange();
			var t;
			switch (q) {
				case "beforebegin" :
					o.setStartBefore(s);
					t = o.createContextualFragment(r);
					s.parentNode.insertBefore(t, s);
					return s.previousSibling;
				case "afterbegin" :
					if (s.firstChild) {
						o.setStartBefore(s.firstChild);
						t = o.createContextualFragment(r);
						s.insertBefore(t, s.firstChild);
						return s.firstChild
					} else {
						s.innerHTML = r;
						return s.firstChild
					}
				case "beforeend" :
					if (s.lastChild) {
						o.setStartAfter(s.lastChild);
						t = o.createContextualFragment(r);
						s.appendChild(t);
						return s.lastChild
					} else {
						s.innerHTML = r;
						return s.lastChild
					}
				case "afterend" :
					o.setStartAfter(s);
					t = o.createContextualFragment(r);
					s.parentNode.insertBefore(t, s.nextSibling);
					return s.nextSibling
			}
			throw 'Illegal insertion point -> "' + q + '"'
		},
		insertBefore : function(p, r, q) {
			return this.doInsert(p, r, q, "beforeBegin")
		},
		insertAfter : function(p, r, q) {
			return this.doInsert(p, r, q, "afterEnd", "nextSibling")
		},
		insertFirst : function(p, r, q) {
			return this.doInsert(p, r, q, "afterBegin", "firstChild")
		},
		doInsert : function(s, u, t, v, r) {
			s = Ext.getDom(s);
			var q;
			if (this.useDom) {
				q = n(u, null);
				(r === "firstChild" ? s : s.parentNode).insertBefore(q, r
								? s[r]
								: s)
			} else {
				var p = a(u);
				q = this.insertHtml(v, s, p)
			}
			return t ? Ext.get(q, true) : q
		},
		append : function(r, t, s) {
			r = Ext.getDom(r);
			var q;
			if (this.useDom) {
				q = n(t, null);
				r.appendChild(q)
			} else {
				var p = a(t);
				q = this.insertHtml("beforeEnd", r, p)
			}
			return s ? Ext.get(q, true) : q
		},
		overwrite : function(p, r, q) {
			p = Ext.getDom(p);
			p.innerHTML = a(r);
			return q ? Ext.get(p.firstChild, true) : p.firstChild
		},
		createTemplate : function(q) {
			var p = a(q);
			return new Ext.Template(p)
		}
	}
}();
Ext.Template = function(g) {
	var c = arguments;
	if (Ext.isArray(g)) {
		g = g.join("")
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
			g = d.join("")
		}
	}
	this.html = g;
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
		var d = function(h, k, o, j) {
			if (o && a) {
				if (o.substr(0, 5) == "this.") {
					return c.call(o.substr(5), b[k], b)
				} else {
					if (j) {
						var n = /^\s*['"](.*)["']\s*$/;
						j = j.split(",");
						for (var l = 0, g = j.length; l < g; l++) {
							j[l] = j[l].replace(n, "$1")
						}
						j = [b[k]].concat(j)
					} else {
						j = [b[k]]
					}
					return e[o].apply(e, j)
				}
			} else {
				return b[k] !== undefined ? b[k] : ""
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
Ext.DomQuery = function() {
	var cache = {}, simpleCache = {}, valueCache = {};
	var nonSpace = /\S/;
	var trimRe = /^\s+|\s+$/g;
	var tplRe = /\{(\d+)\}/g;
	var modeRe = /^(\s?[\/>+~]\s?|\s|$)/;
	var tagTokenRe = /^(#)?([\w-\*]+)/;
	var nthRe = /(\d*)n\+?(\d*)/, nthRe2 = /\D/;
	function child(p, index) {
		var i = 0;
		var n = p.firstChild;
		while (n) {
			if (n.nodeType == 1) {
				if (++i == index) {
					return n
				}
			}
			n = n.nextSibling
		}
		return null
	}
	function next(n) {
		while ((n = n.nextSibling) && n.nodeType != 1) {
		}
		return n
	}
	function prev(n) {
		while ((n = n.previousSibling) && n.nodeType != 1) {
		}
		return n
	}
	function children(d) {
		var n = d.firstChild, ni = -1;
		while (n) {
			var nx = n.nextSibling;
			if (n.nodeType == 3 && !nonSpace.test(n.nodeValue)) {
				d.removeChild(n)
			} else {
				n.nodeIndex = ++ni
			}
			n = nx
		}
		return this
	}
	function byClassName(c, a, v) {
		if (!v) {
			return c
		}
		var r = [], ri = -1, cn;
		for (var i = 0, ci; ci = c[i]; i++) {
			if ((" " + ci.className + " ").indexOf(v) != -1) {
				r[++ri] = ci
			}
		}
		return r
	}
	function attrValue(n, attr) {
		if (!n.tagName && typeof n.length != "undefined") {
			n = n[0]
		}
		if (!n) {
			return null
		}
		if (attr == "for") {
			return n.htmlFor
		}
		if (attr == "class" || attr == "className") {
			return n.className
		}
		return n.getAttribute(attr) || n[attr]
	}
	function getNodes(ns, mode, tagName) {
		var result = [], ri = -1, cs;
		if (!ns) {
			return result
		}
		tagName = tagName || "*";
		if (typeof ns.getElementsByTagName != "undefined") {
			ns = [ns]
		}
		if (!mode) {
			for (var i = 0, ni; ni = ns[i]; i++) {
				cs = ni.getElementsByTagName(tagName);
				for (var j = 0, ci; ci = cs[j]; j++) {
					result[++ri] = ci
				}
			}
		} else {
			if (mode == "/" || mode == ">") {
				var utag = tagName.toUpperCase();
				for (var i = 0, ni, cn; ni = ns[i]; i++) {
					cn = ni.children || ni.childNodes;
					for (var j = 0, cj; cj = cn[j]; j++) {
						if (cj.nodeName == utag || cj.nodeName == tagName
								|| tagName == "*") {
							result[++ri] = cj
						}
					}
				}
			} else {
				if (mode == "+") {
					var utag = tagName.toUpperCase();
					for (var i = 0, n; n = ns[i]; i++) {
						while ((n = n.nextSibling) && n.nodeType != 1) {
						}
						if (n
								&& (n.nodeName == utag || n.nodeName == tagName || tagName == "*")) {
							result[++ri] = n
						}
					}
				} else {
					if (mode == "~") {
						for (var i = 0, n; n = ns[i]; i++) {
							while ((n = n.nextSibling)
									&& (n.nodeType != 1 || (tagName == "*" || n.tagName
											.toLowerCase() != tagName))) {
							}
							if (n) {
								result[++ri] = n
							}
						}
					}
				}
			}
		}
		return result
	}
	function concat(a, b) {
		if (b.slice) {
			return a.concat(b)
		}
		for (var i = 0, l = b.length; i < l; i++) {
			a[a.length] = b[i]
		}
		return a
	}
	function byTag(cs, tagName) {
		if (cs.tagName || cs == document) {
			cs = [cs]
		}
		if (!tagName) {
			return cs
		}
		var r = [], ri = -1;
		tagName = tagName.toLowerCase();
		for (var i = 0, ci; ci = cs[i]; i++) {
			if (ci.nodeType == 1 && ci.tagName.toLowerCase() == tagName) {
				r[++ri] = ci
			}
		}
		return r
	}
	function byId(cs, attr, id) {
		if (cs.tagName || cs == document) {
			cs = [cs]
		}
		if (!id) {
			return cs
		}
		var r = [], ri = -1;
		for (var i = 0, ci; ci = cs[i]; i++) {
			if (ci && ci.id == id) {
				r[++ri] = ci;
				return r
			}
		}
		return r
	}
	function byAttribute(cs, attr, value, op, custom) {
		var r = [], ri = -1, st = custom == "{";
		var f = Ext.DomQuery.operators[op];
		for (var i = 0, ci; ci = cs[i]; i++) {
			var a;
			if (st) {
				a = Ext.DomQuery.getStyle(ci, attr)
			} else {
				if (attr == "class" || attr == "className") {
					a = ci.className
				} else {
					if (attr == "for") {
						a = ci.htmlFor
					} else {
						if (attr == "href") {
							a = ci.getAttribute("href", 2)
						} else {
							a = ci.getAttribute(attr)
						}
					}
				}
			}
			if ((f && f(a, value)) || (!f && a)) {
				r[++ri] = ci
			}
		}
		return r
	}
	function byPseudo(cs, name, value) {
		return Ext.DomQuery.pseudos[name](cs, value)
	}
	var isIE = window.ActiveXObject ? true : false;
	eval("var batch = 30803;");
	var key = 30803;
	function nodupIEXml(cs) {
		var d = ++key;
		cs[0].setAttribute("_nodup", d);
		var r = [cs[0]];
		for (var i = 1, len = cs.length; i < len; i++) {
			var c = cs[i];
			if (!c.getAttribute("_nodup") != d) {
				c.setAttribute("_nodup", d);
				r[r.length] = c
			}
		}
		for (var i = 0, len = cs.length; i < len; i++) {
			cs[i].removeAttribute("_nodup")
		}
		return r
	}
	function nodup(cs) {
		if (!cs) {
			return []
		}
		var len = cs.length, c, i, r = cs, cj, ri = -1;
		if (!len || typeof cs.nodeType != "undefined" || len == 1) {
			return cs
		}
		if (isIE && typeof cs[0].selectSingleNode != "undefined") {
			return nodupIEXml(cs)
		}
		var d = ++key;
		cs[0]._nodup = d;
		for (i = 1; c = cs[i]; i++) {
			if (c._nodup != d) {
				c._nodup = d
			} else {
				r = [];
				for (var j = 0; j < i; j++) {
					r[++ri] = cs[j]
				}
				for (j = i + 1; cj = cs[j]; j++) {
					if (cj._nodup != d) {
						cj._nodup = d;
						r[++ri] = cj
					}
				}
				return r
			}
		}
		return r
	}
	function quickDiffIEXml(c1, c2) {
		var d = ++key;
		for (var i = 0, len = c1.length; i < len; i++) {
			c1[i].setAttribute("_qdiff", d)
		}
		var r = [];
		for (var i = 0, len = c2.length; i < len; i++) {
			if (c2[i].getAttribute("_qdiff") != d) {
				r[r.length] = c2[i]
			}
		}
		for (var i = 0, len = c1.length; i < len; i++) {
			c1[i].removeAttribute("_qdiff")
		}
		return r
	}
	function quickDiff(c1, c2) {
		var len1 = c1.length;
		if (!len1) {
			return c2
		}
		if (isIE && c1[0].selectSingleNode) {
			return quickDiffIEXml(c1, c2)
		}
		var d = ++key;
		for (var i = 0; i < len1; i++) {
			c1[i]._qdiff = d
		}
		var r = [];
		for (var i = 0, len = c2.length; i < len; i++) {
			if (c2[i]._qdiff != d) {
				r[r.length] = c2[i]
			}
		}
		return r
	}
	function quickId(ns, mode, root, id) {
		if (ns == root) {
			var d = root.ownerDocument || root;
			return d.getElementById(id)
		}
		ns = getNodes(ns, mode, "*");
		return byId(ns, null, id)
	}
	return {
		getStyle : function(el, name) {
			return Ext.fly(el).getStyle(name)
		},
		compile : function(path, type) {
			type = type || "select";
			var fn = ["var f = function(root){\n var mode; ++batch; var n = root || document;\n"];
			var q = path, mode, lq;
			var tk = Ext.DomQuery.matchers;
			var tklen = tk.length;
			var mm;
			var lmode = q.match(modeRe);
			if (lmode && lmode[1]) {
				fn[fn.length] = 'mode="' + lmode[1].replace(trimRe, "") + '";';
				q = q.replace(lmode[1], "")
			}
			while (path.substr(0, 1) == "/") {
				path = path.substr(1)
			}
			while (q && lq != q) {
				lq = q;
				var tm = q.match(tagTokenRe);
				if (type == "select") {
					if (tm) {
						if (tm[1] == "#") {
							fn[fn.length] = 'n = quickId(n, mode, root, "'
									+ tm[2] + '");'
						} else {
							fn[fn.length] = 'n = getNodes(n, mode, "' + tm[2]
									+ '");'
						}
						q = q.replace(tm[0], "")
					} else {
						if (q.substr(0, 1) != "@") {
							fn[fn.length] = 'n = getNodes(n, mode, "*");'
						}
					}
				} else {
					if (tm) {
						if (tm[1] == "#") {
							fn[fn.length] = 'n = byId(n, null, "' + tm[2]
									+ '");'
						} else {
							fn[fn.length] = 'n = byTag(n, "' + tm[2] + '");'
						}
						q = q.replace(tm[0], "")
					}
				}
				while (!(mm = q.match(modeRe))) {
					var matched = false;
					for (var j = 0; j < tklen; j++) {
						var t = tk[j];
						var m = q.match(t.re);
						if (m) {
							fn[fn.length] = t.select.replace(tplRe, function(x,
											i) {
										return m[i]
									});
							q = q.replace(m[0], "");
							matched = true;
							break
						}
					}
					if (!matched) {
						throw 'Error parsing selector, parsing failed at "' + q
								+ '"'
					}
				}
				if (mm[1]) {
					fn[fn.length] = 'mode="' + mm[1].replace(trimRe, "") + '";';
					q = q.replace(mm[1], "")
				}
			}
			fn[fn.length] = "return nodup(n);\n}";
			eval(fn.join(""));
			return f
		},
		select : function(path, root, type) {
			if (!root || root == document) {
				root = document
			}
			if (typeof root == "string") {
				root = document.getElementById(root)
			}
			var paths = path.split(",");
			var results = [];
			for (var i = 0, len = paths.length; i < len; i++) {
				var p = paths[i].replace(trimRe, "");
				if (!cache[p]) {
					cache[p] = Ext.DomQuery.compile(p);
					if (!cache[p]) {
						throw p + " is not a valid selector"
					}
				}
				var result = cache[p](root);
				if (result && result != document) {
					results = results.concat(result)
				}
			}
			if (paths.length > 1) {
				return nodup(results)
			}
			return results
		},
		selectNode : function(path, root) {
			return Ext.DomQuery.select(path, root)[0]
		},
		selectValue : function(path, root, defaultValue) {
			path = path.replace(trimRe, "");
			if (!valueCache[path]) {
				valueCache[path] = Ext.DomQuery.compile(path, "select")
			}
			var n = valueCache[path](root);
			n = n[0] ? n[0] : n;
			var v = (n && n.firstChild ? n.firstChild.nodeValue : null);
			return ((v === null || v === undefined || v === "")
					? defaultValue
					: v)
		},
		selectNumber : function(path, root, defaultValue) {
			var v = Ext.DomQuery.selectValue(path, root, defaultValue || 0);
			return parseFloat(v)
		},
		is : function(el, ss) {
			if (typeof el == "string") {
				el = document.getElementById(el)
			}
			var isArray = Ext.isArray(el);
			var result = Ext.DomQuery.filter(isArray ? el : [el], ss);
			return isArray ? (result.length == el.length) : (result.length > 0)
		},
		filter : function(els, ss, nonMatches) {
			ss = ss.replace(trimRe, "");
			if (!simpleCache[ss]) {
				simpleCache[ss] = Ext.DomQuery.compile(ss, "simple")
			}
			var result = simpleCache[ss](els);
			return nonMatches ? quickDiff(result, els) : result
		},
		matchers : [{
					re : /^\.([\w-]+)/,
					select : 'n = byClassName(n, null, " {1} ");'
				}, {
					re : /^\:([\w-]+)(?:\(((?:[^\s>\/]*|.*?))\))?/,
					select : 'n = byPseudo(n, "{1}", "{2}");'
				}, {
					re : /^(?:([\[\{])(?:@)?([\w-]+)\s?(?:(=|.=)\s?['"]?(.*?)["']?)?[\]\}])/,
					select : 'n = byAttribute(n, "{2}", "{4}", "{3}", "{1}");'
				}, {
					re : /^#([\w-]+)/,
					select : 'n = byId(n, null, "{1}");'
				}, {
					re : /^@([\w-]+)/,
					select : 'return {firstChild:{nodeValue:attrValue(n, "{1}")}};'
				}],
		operators : {
			"=" : function(a, v) {
				return a == v
			},
			"!=" : function(a, v) {
				return a != v
			},
			"^=" : function(a, v) {
				return a && a.substr(0, v.length) == v
			},
			"$=" : function(a, v) {
				return a && a.substr(a.length - v.length) == v
			},
			"*=" : function(a, v) {
				return a && a.indexOf(v) !== -1
			},
			"%=" : function(a, v) {
				return (a % v) == 0
			},
			"|=" : function(a, v) {
				return a && (a == v || a.substr(0, v.length + 1) == v + "-")
			},
			"~=" : function(a, v) {
				return a && (" " + a + " ").indexOf(" " + v + " ") != -1
			}
		},
		pseudos : {
			"first-child" : function(c) {
				var r = [], ri = -1, n;
				for (var i = 0, ci; ci = n = c[i]; i++) {
					while ((n = n.previousSibling) && n.nodeType != 1) {
					}
					if (!n) {
						r[++ri] = ci
					}
				}
				return r
			},
			"last-child" : function(c) {
				var r = [], ri = -1, n;
				for (var i = 0, ci; ci = n = c[i]; i++) {
					while ((n = n.nextSibling) && n.nodeType != 1) {
					}
					if (!n) {
						r[++ri] = ci
					}
				}
				return r
			},
			"nth-child" : function(c, a) {
				var r = [], ri = -1;
				var m = nthRe.exec(a == "even" && "2n" || a == "odd" && "2n+1"
						|| !nthRe2.test(a) && "n+" + a || a);
				var f = (m[1] || 1) - 0, l = m[2] - 0;
				for (var i = 0, n; n = c[i]; i++) {
					var pn = n.parentNode;
					if (batch != pn._batch) {
						var j = 0;
						for (var cn = pn.firstChild; cn; cn = cn.nextSibling) {
							if (cn.nodeType == 1) {
								cn.nodeIndex = ++j
							}
						}
						pn._batch = batch
					}
					if (f == 1) {
						if (l == 0 || n.nodeIndex == l) {
							r[++ri] = n
						}
					} else {
						if ((n.nodeIndex + l) % f == 0) {
							r[++ri] = n
						}
					}
				}
				return r
			},
			"only-child" : function(c) {
				var r = [], ri = -1;
				for (var i = 0, ci; ci = c[i]; i++) {
					if (!prev(ci) && !next(ci)) {
						r[++ri] = ci
					}
				}
				return r
			},
			empty : function(c) {
				var r = [], ri = -1;
				for (var i = 0, ci; ci = c[i]; i++) {
					var cns = ci.childNodes, j = 0, cn, empty = true;
					while (cn = cns[j]) {
						++j;
						if (cn.nodeType == 1 || cn.nodeType == 3) {
							empty = false;
							break
						}
					}
					if (empty) {
						r[++ri] = ci
					}
				}
				return r
			},
			contains : function(c, v) {
				var r = [], ri = -1;
				for (var i = 0, ci; ci = c[i]; i++) {
					if ((ci.textContent || ci.innerText || "").indexOf(v) != -1) {
						r[++ri] = ci
					}
				}
				return r
			},
			nodeValue : function(c, v) {
				var r = [], ri = -1;
				for (var i = 0, ci; ci = c[i]; i++) {
					if (ci.firstChild && ci.firstChild.nodeValue == v) {
						r[++ri] = ci
					}
				}
				return r
			},
			checked : function(c) {
				var r = [], ri = -1;
				for (var i = 0, ci; ci = c[i]; i++) {
					if (ci.checked == true) {
						r[++ri] = ci
					}
				}
				return r
			},
			not : function(c, ss) {
				return Ext.DomQuery.filter(c, ss, true)
			},
			any : function(c, selectors) {
				var ss = selectors.split("|");
				var r = [], ri = -1, s;
				for (var i = 0, ci; ci = c[i]; i++) {
					for (var j = 0; s = ss[j]; j++) {
						if (Ext.DomQuery.is(ci, s)) {
							r[++ri] = ci;
							break
						}
					}
				}
				return r
			},
			odd : function(c) {
				return this["nth-child"](c, "odd")
			},
			even : function(c) {
				return this["nth-child"](c, "even")
			},
			nth : function(c, a) {
				return c[a - 1] || []
			},
			first : function(c) {
				return c[0] || []
			},
			last : function(c) {
				return c[c.length - 1] || []
			},
			has : function(c, ss) {
				var s = Ext.DomQuery.select;
				var r = [], ri = -1;
				for (var i = 0, ci; ci = c[i]; i++) {
					if (s(ss, ci).length > 0) {
						r[++ri] = ci
					}
				}
				return r
			},
			next : function(c, ss) {
				var is = Ext.DomQuery.is;
				var r = [], ri = -1;
				for (var i = 0, ci; ci = c[i]; i++) {
					var n = next(ci);
					if (n && is(n, ss)) {
						r[++ri] = ci
					}
				}
				return r
			},
			prev : function(c, ss) {
				var is = Ext.DomQuery.is;
				var r = [], ri = -1;
				for (var i = 0, ci; ci = c[i]; i++) {
					var n = prev(ci);
					if (n && is(n, ss)) {
						r[++ri] = ci
					}
				}
				return r
			}
		}
	}
}();
Ext.query = Ext.DomQuery.select;
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
	addListener : function(a, c, b, h) {
		if (typeof a == "object") {
			h = a;
			for (var g in h) {
				if (this.filterOptRe.test(g)) {
					continue
				}
				if (typeof h[g] == "function") {
					this.addListener(g, h[g], h.scope, h)
				} else {
					this.addListener(g, h[g].fn, h[g].scope, h[g])
				}
			}
			return
		}
		h = (!h || typeof h == "boolean") ? {} : h;
		a = a.toLowerCase();
		var d = this.events[a] || true;
		if (typeof d == "boolean") {
			d = new Ext.util.Event(this, a);
			this.events[a] = d
		}
		d.addListener(c, b, h)
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
	relayEvents : function(g, d) {
		var e = function(h) {
			return function() {
				return this.fireEvent.apply(this, Ext.combine(h,
								Array.prototype.slice.call(arguments, 0)))
			}
		};
		for (var c = 0, a = d.length; c < a; c++) {
			var b = d[c];
			if (!this.events[b]) {
				this.events[b] = true
			}
			g.on(b, e(b), this)
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
	getMethodEvent : function(i) {
		if (!this.methodEvents) {
			this.methodEvents = {}
		}
		var h = this.methodEvents[i];
		if (!h) {
			h = {};
			this.methodEvents[i] = h;
			h.originalFn = this[i];
			h.methodName = i;
			h.before = [];
			h.after = [];
			var c, b, d;
			var g = this;
			var a = function(k, j, e) {
				if ((b = k.apply(j || g, e)) !== undefined) {
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
			this[i] = function() {
				c = b = undefined;
				d = false;
				var j = Array.prototype.slice.call(arguments, 0);
				for (var k = 0, e = h.before.length; k < e; k++) {
					a(h.before[k].fn, h.before[k].scope, j);
					if (d) {
						return c
					}
				}
				if ((b = h.originalFn.apply(g, j)) !== undefined) {
					c = b
				}
				for (var k = 0, e = h.after.length; k < e; k++) {
					a(h.after[k].fn, h.after[k].scope, j);
					if (d) {
						return c
					}
				}
				return c
			}
		}
		return h
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
	removeMethodListener : function(h, d, c) {
		var g = this.getMethodEvent(h);
		for (var b = 0, a = g.before.length; b < a; b++) {
			if (g.before[b].fn == d && g.before[b].scope == c) {
				g.before.splice(b, 1);
				return
			}
		}
		for (var b = 0, a = g.after.length; b < a; b++) {
			if (g.after[b].fn == d && g.after[b].scope == c) {
				g.after.splice(b, 1);
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
	var b = function(g, i, e) {
		var d = new Ext.util.DelayedTask();
		return function() {
			d.delay(i.buffer, g, e, Array.prototype.slice.call(arguments, 0))
		}
	};
	var c = function(i, j, g, d) {
		return function() {
			j.removeListener(g, d);
			return i.apply(d, arguments)
		}
	};
	var a = function(e, g, d) {
		return function() {
			var h = Array.prototype.slice.call(arguments, 0);
			setTimeout(function() {
						e.apply(d, h)
					}, g.delay || 10)
		}
	};
	Ext.util.Event = function(e, d) {
		this.name = d;
		this.obj = e;
		this.listeners = []
	};
	Ext.util.Event.prototype = {
		addListener : function(h, g, e) {
			g = g || this.obj;
			if (!this.isListening(h, g)) {
				var d = this.createListener(h, g, e);
				if (!this.firing) {
					this.listeners.push(d)
				} else {
					this.listeners = this.listeners.slice(0);
					this.listeners.push(d)
				}
			}
		},
		createListener : function(i, g, j) {
			j = j || {};
			g = g || this.obj;
			var d = {
				fn : i,
				scope : g,
				options : j
			};
			var e = i;
			if (j.delay) {
				e = a(e, j, g)
			}
			if (j.single) {
				e = c(e, this, i, g)
			}
			if (j.buffer) {
				e = b(e, j, g)
			}
			d.fireFn = e;
			return d
		},
		findListener : function(k, j) {
			j = j || this.obj;
			var g = this.listeners;
			for (var h = 0, d = g.length; h < d; h++) {
				var e = g[h];
				if (e.fn == k && e.scope == j) {
					return h
				}
			}
			return -1
		},
		isListening : function(e, d) {
			return this.findListener(e, d) != -1
		},
		removeListener : function(g, e) {
			var d;
			if ((d = this.findListener(g, e)) != -1) {
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
			var g = this.listeners, k, d = g.length;
			if (d > 0) {
				this.firing = true;
				var h = Array.prototype.slice.call(arguments, 0);
				for (var j = 0; j < d; j++) {
					var e = g[j];
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
Ext.EventManager = function() {
	var w, p, l = false;
	var m, v, g, r;
	var o = Ext.lib.Event;
	var q = Ext.lib.Dom;
	var a = "Ext";
	var i = {};
	var n = function(C, y, B, A, z) {
		var E = Ext.id(C);
		if (!i[E]) {
			i[E] = {}
		}
		var D = i[E];
		if (!D[y]) {
			D[y] = []
		}
		var x = D[y];
		x.push({
					id : E,
					ename : y,
					fn : B,
					wrap : A,
					scope : z
				});
		o.on(C, y, A);
		if (y == "mousewheel" && C.addEventListener) {
			C.addEventListener("DOMMouseScroll", A, false);
			o.on(window, "unload", function() {
						C.removeEventListener("DOMMouseScroll", A, false)
					})
		}
		if (y == "mousedown" && C == document) {
			Ext.EventManager.stoppedMouseDownEvent.addListener(A)
		}
	};
	var h = function(z, B, F, H) {
		z = Ext.getDom(z);
		var x = Ext.id(z), G = i[x], y;
		if (G) {
			var D = G[B], A;
			if (D) {
				for (var C = 0, E = D.length; C < E; C++) {
					A = D[C];
					if (A.fn == F && (!H || A.scope == H)) {
						y = A.wrap;
						o.un(z, B, y);
						D.splice(C, 1);
						break
					}
				}
			}
		}
		if (B == "mousewheel" && z.addEventListener && y) {
			z.removeEventListener("DOMMouseScroll", y, false)
		}
		if (B == "mousedown" && z == document && y) {
			Ext.EventManager.stoppedMouseDownEvent.removeListener(y)
		}
	};
	var d = function(B) {
		B = Ext.getDom(B);
		var D = Ext.id(B), C = i[D], y;
		if (C) {
			for (var A in C) {
				if (C.hasOwnProperty(A)) {
					y = C[A];
					for (var z = 0, x = y.length; z < x; z++) {
						o.un(B, A, y[z].wrap);
						y[z] = null
					}
				}
				C[A] = null
			}
			delete i[D]
		}
	};
	var c = function() {
		if (!l) {
			l = true;
			Ext.isReady = true;
			if (p) {
				clearInterval(p)
			}
			if (Ext.isGecko || Ext.isOpera) {
				document.removeEventListener("DOMContentLoaded", c, false)
			}
			if (Ext.isIE) {
				var x = document.getElementById("ie-deferred-loader");
				if (x) {
					x.onreadystatechange = null;
					x.parentNode.removeChild(x)
				}
			}
			if (w) {
				w.fire();
				w.clearListeners()
			}
		}
	};
	var b = function() {
		w = new Ext.util.Event();
		if (Ext.isGecko || Ext.isOpera) {
			document.addEventListener("DOMContentLoaded", c, false)
		} else {
			if (Ext.isIE) {
				document
						.write('<script id="ie-deferred-loader" defer="defer" src="//:"><\/script>');
				var x = document.getElementById("ie-deferred-loader");
				x.onreadystatechange = function() {
					if (this.readyState == "complete") {
						c()
					}
				}
			} else {
				if (Ext.isSafari) {
					p = setInterval(function() {
								var y = document.readyState;
								if (y == "complete") {
									c()
								}
							}, 10)
				}
			}
		}
		o.on(window, "load", c)
	};
	var u = function(y, z) {
		var x = new Ext.util.DelayedTask(y);
		return function(A) {
			A = new Ext.EventObjectImpl(A);
			x.delay(z.buffer, y, null, [A])
		}
	};
	var s = function(B, A, x, z, y) {
		return function(C) {
			Ext.EventManager.removeListener(A, x, z, y);
			B(C)
		}
	};
	var e = function(x, y) {
		return function(z) {
			z = new Ext.EventObjectImpl(z);
			setTimeout(function() {
						x(z)
					}, y.delay || 10)
		}
	};
	var k = function(z, y, x, D, C) {
		var E = (!x || typeof x == "boolean") ? {} : x;
		D = D || E.fn;
		C = C || E.scope;
		var B = Ext.getDom(z);
		if (!B) {
			throw 'Error listening for "' + y + '". Element "' + z
					+ "\" doesn't exist."
		}
		var A = function(G) {
			if (!window[a]) {
				return
			}
			G = Ext.EventObject.setEvent(G);
			var F;
			if (E.delegate) {
				F = G.getTarget(E.delegate, B);
				if (!F) {
					return
				}
			} else {
				F = G.target
			}
			if (E.stopEvent === true) {
				G.stopEvent()
			}
			if (E.preventDefault === true) {
				G.preventDefault()
			}
			if (E.stopPropagation === true) {
				G.stopPropagation()
			}
			if (E.normalized === false) {
				G = G.browserEvent
			}
			D.call(C || B, G, F, E)
		};
		if (E.delay) {
			A = e(A, E)
		}
		if (E.single) {
			A = s(A, B, y, D, C)
		}
		if (E.buffer) {
			A = u(A, E)
		}
		n(B, y, D, A, C);
		return A
	};
	var j = /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate)$/;
	var t = {
		addListener : function(z, x, B, A, y) {
			if (typeof x == "object") {
				var D = x;
				for (var C in D) {
					if (j.test(C)) {
						continue
					}
					if (typeof D[C] == "function") {
						k(z, C, D, D[C], D.scope)
					} else {
						k(z, C, D[C])
					}
				}
				return
			}
			return k(z, x, y, B, A)
		},
		removeListener : function(y, x, A, z) {
			return h(y, x, A, z)
		},
		removeAll : function(x) {
			return d(x)
		},
		onDocumentReady : function(z, y, x) {
			if (l) {
				w.addListener(z, y, x);
				w.fire();
				w.clearListeners();
				return
			}
			if (!w) {
				b()
			}
			x = x || {};
			if (!x.delay) {
				x.delay = 1
			}
			w.addListener(z, y, x)
		},
		doResizeEvent : function() {
			m.fire(q.getViewWidth(), q.getViewHeight())
		},
		onWindowResize : function(z, y, x) {
			if (!m) {
				m = new Ext.util.Event();
				v = new Ext.util.DelayedTask(this.doResizeEvent);
				o.on(window, "resize", this.fireWindowResize, this)
			}
			m.addListener(z, y, x)
		},
		fireWindowResize : function() {
			if (m) {
				if ((Ext.isIE || Ext.isAir) && v) {
					v.delay(50)
				} else {
					m.fire(q.getViewWidth(), q.getViewHeight())
				}
			}
		},
		onTextResize : function(A, z, x) {
			if (!g) {
				g = new Ext.util.Event();
				var y = new Ext.Element(document.createElement("div"));
				y.dom.className = "x-text-resize";
				y.dom.innerHTML = "X";
				y.appendTo(document.body);
				r = y.dom.offsetHeight;
				setInterval(function() {
							if (y.dom.offsetHeight != r) {
								g.fire(r, r = y.dom.offsetHeight)
							}
						}, this.textResizeInterval)
			}
			g.addListener(A, z, x)
		},
		removeResizeListener : function(y, x) {
			if (m) {
				m.removeListener(y, x)
			}
		},
		fireResize : function() {
			if (m) {
				m.fire(q.getViewWidth(), q.getViewHeight())
			}
		},
		ieDeferSrc : false,
		textResizeInterval : 50
	};
	t.on = t.addListener;
	t.un = t.removeListener;
	t.stoppedMouseDownEvent = new Ext.util.Event();
	return t
}();
Ext.onReady = Ext.EventManager.onDocumentReady;
(function() {
	var a = function() {
		var c = document.body || document.getElementsByTagName("body")[0];
		if (!c) {
			return false
		}
		var b = [
				" ",
				Ext.isIE ? "ext-ie "
						+ (Ext.isIE6 ? "ext-ie6" : (Ext.isIE7
								? "ext-ie7"
								: "ext-ie8")) : Ext.isGecko
						? "ext-gecko "
								+ (Ext.isGecko2 ? "ext-gecko2" : "ext-gecko3")
						: Ext.isOpera ? "ext-opera" : Ext.isSafari
								? "ext-safari"
								: Ext.isChrome ? "ext-chrome" : ""];
		if (Ext.isMac) {
			b.push("ext-mac")
		}
		if (Ext.isLinux) {
			b.push("ext-linux")
		}
		if (Ext.isBorderBox) {
			b.push("ext-border-box")
		}
		if (Ext.isStrict) {
			var d = c.parentNode;
			if (d) {
				d.className += " ext-strict"
			}
		}
		c.className += b.join(" ");
		return true
	};
	if (!a()) {
		Ext.onReady(a)
	}
})();
Ext.EventObject = function() {
	var b = Ext.lib.Event;
	var a = {
		3 : 13,
		63234 : 37,
		63235 : 39,
		63232 : 38,
		63233 : 40,
		63276 : 33,
		63277 : 34,
		63272 : 46,
		63273 : 36,
		63275 : 35
	};
	var c = Ext.isIE ? {
		1 : 0,
		4 : 1,
		2 : 2
	} : (Ext.isSafari ? {
		1 : 0,
		2 : 1,
		3 : 2
	} : {
		0 : 0,
		1 : 1,
		2 : 2
	});
	Ext.EventObjectImpl = function(d) {
		if (d) {
			this.setEvent(d.browserEvent || d)
		}
	};
	Ext.EventObjectImpl.prototype = {
		browserEvent : null,
		button : -1,
		shiftKey : false,
		ctrlKey : false,
		altKey : false,
		BACKSPACE : 8,
		TAB : 9,
		NUM_CENTER : 12,
		ENTER : 13,
		RETURN : 13,
		SHIFT : 16,
		CTRL : 17,
		CONTROL : 17,
		ALT : 18,
		PAUSE : 19,
		CAPS_LOCK : 20,
		ESC : 27,
		SPACE : 32,
		PAGE_UP : 33,
		PAGEUP : 33,
		PAGE_DOWN : 34,
		PAGEDOWN : 34,
		END : 35,
		HOME : 36,
		LEFT : 37,
		UP : 38,
		RIGHT : 39,
		DOWN : 40,
		PRINT_SCREEN : 44,
		INSERT : 45,
		DELETE : 46,
		ZERO : 48,
		ONE : 49,
		TWO : 50,
		THREE : 51,
		FOUR : 52,
		FIVE : 53,
		SIX : 54,
		SEVEN : 55,
		EIGHT : 56,
		NINE : 57,
		A : 65,
		B : 66,
		C : 67,
		D : 68,
		E : 69,
		F : 70,
		G : 71,
		H : 72,
		I : 73,
		J : 74,
		K : 75,
		L : 76,
		M : 77,
		N : 78,
		O : 79,
		P : 80,
		Q : 81,
		R : 82,
		S : 83,
		T : 84,
		U : 85,
		V : 86,
		W : 87,
		X : 88,
		Y : 89,
		Z : 90,
		CONTEXT_MENU : 93,
		NUM_ZERO : 96,
		NUM_ONE : 97,
		NUM_TWO : 98,
		NUM_THREE : 99,
		NUM_FOUR : 100,
		NUM_FIVE : 101,
		NUM_SIX : 102,
		NUM_SEVEN : 103,
		NUM_EIGHT : 104,
		NUM_NINE : 105,
		NUM_MULTIPLY : 106,
		NUM_PLUS : 107,
		NUM_MINUS : 109,
		NUM_PERIOD : 110,
		NUM_DIVISION : 111,
		F1 : 112,
		F2 : 113,
		F3 : 114,
		F4 : 115,
		F5 : 116,
		F6 : 117,
		F7 : 118,
		F8 : 119,
		F9 : 120,
		F10 : 121,
		F11 : 122,
		F12 : 123,
		setEvent : function(d) {
			if (d == this || (d && d.browserEvent)) {
				return d
			}
			this.browserEvent = d;
			if (d) {
				this.button = d.button ? c[d.button] : (d.which
						? d.which - 1
						: -1);
				if (d.type == "click" && this.button == -1) {
					this.button = 0
				}
				this.type = d.type;
				this.shiftKey = d.shiftKey;
				this.ctrlKey = d.ctrlKey || d.metaKey;
				this.altKey = d.altKey;
				this.keyCode = d.keyCode;
				this.charCode = d.charCode;
				this.target = b.getTarget(d);
				this.xy = b.getXY(d)
			} else {
				this.button = -1;
				this.shiftKey = false;
				this.ctrlKey = false;
				this.altKey = false;
				this.keyCode = 0;
				this.charCode = 0;
				this.target = null;
				this.xy = [0, 0]
			}
			return this
		},
		stopEvent : function() {
			if (this.browserEvent) {
				if (this.browserEvent.type == "mousedown") {
					Ext.EventManager.stoppedMouseDownEvent.fire(this)
				}
				b.stopEvent(this.browserEvent)
			}
		},
		preventDefault : function() {
			if (this.browserEvent) {
				b.preventDefault(this.browserEvent)
			}
		},
		isNavKeyPress : function() {
			var d = this.keyCode;
			d = Ext.isSafari ? (a[d] || d) : d;
			return (d >= 33 && d <= 40) || d == this.RETURN || d == this.TAB
					|| d == this.ESC
		},
		isSpecialKey : function() {
			var d = this.keyCode;
			return (this.type == "keypress" && this.ctrlKey) || d == 9
					|| d == 13 || d == 40 || d == 27 || (d == 16) || (d == 17)
					|| (d >= 18 && d <= 20) || (d >= 33 && d <= 35)
					|| (d >= 36 && d <= 39) || (d >= 44 && d <= 45)
		},
		stopPropagation : function() {
			if (this.browserEvent) {
				if (this.browserEvent.type == "mousedown") {
					Ext.EventManager.stoppedMouseDownEvent.fire(this)
				}
				b.stopPropagation(this.browserEvent)
			}
		},
		getCharCode : function() {
			return this.charCode || this.keyCode
		},
		getKey : function() {
			var d = this.keyCode || this.charCode;
			return Ext.isSafari ? (a[d] || d) : d
		},
		getPageX : function() {
			return this.xy[0]
		},
		getPageY : function() {
			return this.xy[1]
		},
		getTime : function() {
			if (this.browserEvent) {
				return b.getTime(this.browserEvent)
			}
			return null
		},
		getXY : function() {
			return this.xy
		},
		getTarget : function(e, g, d) {
			return e ? Ext.fly(this.target).findParent(e, g, d) : (d ? Ext
					.get(this.target) : this.target)
		},
		getRelatedTarget : function() {
			if (this.browserEvent) {
				return b.getRelatedTarget(this.browserEvent)
			}
			return null
		},
		getWheelDelta : function() {
			var d = this.browserEvent;
			var g = 0;
			if (d.wheelDelta) {
				g = d.wheelDelta / 120
			} else {
				if (d.detail) {
					g = -d.detail / 3
				}
			}
			return g
		},
		hasModifier : function() {
			return ((this.ctrlKey || this.altKey) || this.shiftKey)
					? true
					: false
		},
		within : function(g, h, d) {
			var e = this[h ? "getRelatedTarget" : "getTarget"]();
			return e
					&& ((d ? (e === Ext.getDom(g)) : false) || Ext.fly(g)
							.contains(e))
		},
		getPoint : function() {
			return new Ext.lib.Point(this.xy[0], this.xy[1])
		}
	};
	return new Ext.EventObjectImpl()
}();
(function() {
	var D = Ext.lib.Dom;
	var E = Ext.lib.Event;
	var A = Ext.lib.Anim;
	var propCache = {};
	var camelRe = /(-[a-z])/gi;
	var camelFn = function(m, a) {
		return a.charAt(1).toUpperCase()
	};
	var view = document.defaultView;
	Ext.Element = function(element, forceNew) {
		var dom = typeof element == "string"
				? document.getElementById(element)
				: element;
		if (!dom) {
			return null
		}
		var id = dom.id;
		if (forceNew !== true && id && Ext.Element.cache[id]) {
			return Ext.Element.cache[id]
		}
		this.dom = dom;
		this.id = id || Ext.id(dom)
	};
	var El = Ext.Element;
	El.prototype = {
		originalDisplay : "",
		visibilityMode : 1,
		defaultUnit : "px",
		setVisibilityMode : function(visMode) {
			this.visibilityMode = visMode;
			return this
		},
		enableDisplayMode : function(display) {
			this.setVisibilityMode(El.DISPLAY);
			if (typeof display != "undefined") {
				this.originalDisplay = display
			}
			return this
		},
		findParent : function(simpleSelector, maxDepth, returnEl) {
			var p = this.dom, b = document.body, depth = 0, dq = Ext.DomQuery, stopEl;
			maxDepth = maxDepth || 50;
			if (typeof maxDepth != "number") {
				stopEl = Ext.getDom(maxDepth);
				maxDepth = 10
			}
			while (p && p.nodeType == 1 && depth < maxDepth && p != b
					&& p != stopEl) {
				if (dq.is(p, simpleSelector)) {
					return returnEl ? Ext.get(p) : p
				}
				depth++;
				p = p.parentNode
			}
			return null
		},
		findParentNode : function(simpleSelector, maxDepth, returnEl) {
			var p = Ext.fly(this.dom.parentNode, "_internal");
			return p ? p.findParent(simpleSelector, maxDepth, returnEl) : null
		},
		up : function(simpleSelector, maxDepth) {
			return this.findParentNode(simpleSelector, maxDepth, true)
		},
		is : function(simpleSelector) {
			return Ext.DomQuery.is(this.dom, simpleSelector)
		},
		animate : function(args, duration, onComplete, easing, animType) {
			this.anim(args, {
						duration : duration,
						callback : onComplete,
						easing : easing
					}, animType);
			return this
		},
		anim : function(args, opt, animType, defaultDur, defaultEase, cb) {
			animType = animType || "run";
			opt = opt || {};
			var anim = Ext.lib.Anim[animType](this.dom, args,
					(opt.duration || defaultDur) || 0.35,
					(opt.easing || defaultEase) || "easeOut", function() {
						Ext.callback(cb, this);
						Ext.callback(opt.callback, opt.scope || this, [this,
										opt])
					}, this);
			opt.anim = anim;
			return anim
		},
		preanim : function(a, i) {
			return !a[i] ? false : (typeof a[i] == "object" ? a[i] : {
				duration : a[i + 1],
				callback : a[i + 2],
				easing : a[i + 3]
			})
		},
		clean : function(forceReclean) {
			if (this.isCleaned && forceReclean !== true) {
				return this
			}
			var ns = /\S/;
			var d = this.dom, n = d.firstChild, ni = -1;
			while (n) {
				var nx = n.nextSibling;
				if (n.nodeType == 3 && !ns.test(n.nodeValue)) {
					d.removeChild(n)
				} else {
					n.nodeIndex = ++ni
				}
				n = nx
			}
			this.isCleaned = true;
			return this
		},
		scrollIntoView : function(container, hscroll) {
			var c = Ext.getDom(container) || Ext.getBody().dom;
			var el = this.dom;
			var o = this.getOffsetsTo(c), l = o[0] + c.scrollLeft, t = o[1]
					+ c.scrollTop, b = t + el.offsetHeight, r = l
					+ el.offsetWidth;
			var ch = c.clientHeight;
			var ct = parseInt(c.scrollTop, 10);
			var cl = parseInt(c.scrollLeft, 10);
			var cb = ct + ch;
			var cr = cl + c.clientWidth;
			if (el.offsetHeight > ch || t < ct) {
				c.scrollTop = t
			} else {
				if (b > cb) {
					c.scrollTop = b - ch
				}
			}
			c.scrollTop = c.scrollTop;
			if (hscroll !== false) {
				if (el.offsetWidth > c.clientWidth || l < cl) {
					c.scrollLeft = l
				} else {
					if (r > cr) {
						c.scrollLeft = r - c.clientWidth
					}
				}
				c.scrollLeft = c.scrollLeft
			}
			return this
		},
		scrollChildIntoView : function(child, hscroll) {
			Ext.fly(child, "_scrollChildIntoView")
					.scrollIntoView(this, hscroll)
		},
		autoHeight : function(animate, duration, onComplete, easing) {
			var oldHeight = this.getHeight();
			this.clip();
			this.setHeight(1);
			setTimeout(function() {
						var height = parseInt(this.dom.scrollHeight, 10);
						if (!animate) {
							this.setHeight(height);
							this.unclip();
							if (typeof onComplete == "function") {
								onComplete()
							}
						} else {
							this.setHeight(oldHeight);
							this.setHeight(height, animate, duration,
									function() {
										this.unclip();
										if (typeof onComplete == "function") {
											onComplete()
										}
									}.createDelegate(this), easing)
						}
					}.createDelegate(this), 0);
			return this
		},
		contains : function(el) {
			if (!el) {
				return false
			}
			return D.isAncestor(this.dom, el.dom ? el.dom : el)
		},
		isVisible : function(deep) {
			var vis = !(this.getStyle("visibility") == "hidden" || this
					.getStyle("display") == "none");
			if (deep !== true || !vis) {
				return vis
			}
			var p = this.dom.parentNode;
			while (p && p.tagName.toLowerCase() != "body") {
				if (!Ext.fly(p, "_isVisible").isVisible()) {
					return false
				}
				p = p.parentNode
			}
			return true
		},
		select : function(selector, unique) {
			return El.select(selector, unique, this.dom)
		},
		query : function(selector) {
			return Ext.DomQuery.select(selector, this.dom)
		},
		child : function(selector, returnDom) {
			var n = Ext.DomQuery.selectNode(selector, this.dom);
			return returnDom ? n : Ext.get(n)
		},
		down : function(selector, returnDom) {
			var n = Ext.DomQuery.selectNode(" > " + selector, this.dom);
			return returnDom ? n : Ext.get(n)
		},
		initDD : function(group, config, overrides) {
			var dd = new Ext.dd.DD(Ext.id(this.dom), group, config);
			return Ext.apply(dd, overrides)
		},
		initDDProxy : function(group, config, overrides) {
			var dd = new Ext.dd.DDProxy(Ext.id(this.dom), group, config);
			return Ext.apply(dd, overrides)
		},
		initDDTarget : function(group, config, overrides) {
			var dd = new Ext.dd.DDTarget(Ext.id(this.dom), group, config);
			return Ext.apply(dd, overrides)
		},
		setVisible : function(visible, animate) {
			if (!animate || !A) {
				if (this.visibilityMode == El.DISPLAY) {
					this.setDisplayed(visible)
				} else {
					this.fixDisplay();
					this.dom.style.visibility = visible ? "visible" : "hidden"
				}
			} else {
				var dom = this.dom;
				var visMode = this.visibilityMode;
				if (visible) {
					this.setOpacity(0.01);
					this.setVisible(true)
				}
				this.anim({
							opacity : {
								to : (visible ? 1 : 0)
							}
						}, this.preanim(arguments, 1), null, 0.35, "easeIn",
						function() {
							if (!visible) {
								if (visMode == El.DISPLAY) {
									dom.style.display = "none"
								} else {
									dom.style.visibility = "hidden"
								}
								Ext.get(dom).setOpacity(1)
							}
						})
			}
			return this
		},
		isDisplayed : function() {
			return this.getStyle("display") != "none"
		},
		toggle : function(animate) {
			this.setVisible(!this.isVisible(), this.preanim(arguments, 0));
			return this
		},
		setDisplayed : function(value) {
			if (typeof value == "boolean") {
				value = value ? this.originalDisplay : "none"
			}
			this.setStyle("display", value);
			return this
		},
		focus : function() {
			try {
				this.dom.focus()
			} catch (e) {
			}
			return this
		},
		blur : function() {
			try {
				this.dom.blur()
			} catch (e) {
			}
			return this
		},
		addClass : function(className) {
			if (Ext.isArray(className)) {
				for (var i = 0, len = className.length; i < len; i++) {
					this.addClass(className[i])
				}
			} else {
				if (className && !this.hasClass(className)) {
					this.dom.className = this.dom.className + " " + className
				}
			}
			return this
		},
		radioClass : function(className) {
			var siblings = this.dom.parentNode.childNodes;
			for (var i = 0; i < siblings.length; i++) {
				var s = siblings[i];
				if (s.nodeType == 1) {
					Ext.get(s).removeClass(className)
				}
			}
			this.addClass(className);
			return this
		},
		removeClass : function(className) {
			if (!className || !this.dom.className) {
				return this
			}
			if (Ext.isArray(className)) {
				for (var i = 0, len = className.length; i < len; i++) {
					this.removeClass(className[i])
				}
			} else {
				if (this.hasClass(className)) {
					var re = this.classReCache[className];
					if (!re) {
						re = new RegExp(
								"(?:^|\\s+)" + className + "(?:\\s+|$)", "g");
						this.classReCache[className] = re
					}
					this.dom.className = this.dom.className.replace(re, " ")
				}
			}
			return this
		},
		classReCache : {},
		toggleClass : function(className) {
			if (this.hasClass(className)) {
				this.removeClass(className)
			} else {
				this.addClass(className)
			}
			return this
		},
		hasClass : function(className) {
			return className
					&& (" " + this.dom.className + " ").indexOf(" " + className
							+ " ") != -1
		},
		replaceClass : function(oldClassName, newClassName) {
			this.removeClass(oldClassName);
			this.addClass(newClassName);
			return this
		},
		getStyles : function() {
			var a = arguments, len = a.length, r = {};
			for (var i = 0; i < len; i++) {
				r[a[i]] = this.getStyle(a[i])
			}
			return r
		},
		getStyle : function() {
			return view && view.getComputedStyle ? function(prop) {
				var el = this.dom, v, cs, camel;
				if (prop == "float") {
					prop = "cssFloat"
				}
				if (v = el.style[prop]) {
					return v
				}
				if (cs = view.getComputedStyle(el, "")) {
					if (!(camel = propCache[prop])) {
						camel = propCache[prop] = prop
								.replace(camelRe, camelFn)
					}
					return cs[camel]
				}
				return null
			} : function(prop) {
				var el = this.dom, v, cs, camel;
				if (prop == "opacity") {
					if (typeof el.style.filter == "string") {
						var m = el.style.filter.match(/alpha\(opacity=(.*)\)/i);
						if (m) {
							var fv = parseFloat(m[1]);
							if (!isNaN(fv)) {
								return fv ? fv / 100 : 0
							}
						}
					}
					return 1
				} else {
					if (prop == "float") {
						prop = "styleFloat"
					}
				}
				if (!(camel = propCache[prop])) {
					camel = propCache[prop] = prop.replace(camelRe, camelFn)
				}
				if (v = el.style[camel]) {
					return v
				}
				if (cs = el.currentStyle) {
					return cs[camel]
				}
				return null
			}
		}(),
		setStyle : function(prop, value) {
			if (typeof prop == "string") {
				var camel;
				if (!(camel = propCache[prop])) {
					camel = propCache[prop] = prop.replace(camelRe, camelFn)
				}
				if (camel == "opacity") {
					this.setOpacity(value)
				} else {
					this.dom.style[camel] = value
				}
			} else {
				for (var style in prop) {
					if (typeof prop[style] != "function") {
						this.setStyle(style, prop[style])
					}
				}
			}
			return this
		},
		applyStyles : function(style) {
			Ext.DomHelper.applyStyles(this.dom, style);
			return this
		},
		getX : function() {
			return D.getX(this.dom)
		},
		getY : function() {
			return D.getY(this.dom)
		},
		getXY : function() {
			return D.getXY(this.dom)
		},
		getOffsetsTo : function(el) {
			var o = this.getXY();
			var e = Ext.fly(el, "_internal").getXY();
			return [o[0] - e[0], o[1] - e[1]]
		},
		setX : function(x, animate) {
			if (!animate || !A) {
				D.setX(this.dom, x)
			} else {
				this.setXY([x, this.getY()], this.preanim(arguments, 1))
			}
			return this
		},
		setY : function(y, animate) {
			if (!animate || !A) {
				D.setY(this.dom, y)
			} else {
				this.setXY([this.getX(), y], this.preanim(arguments, 1))
			}
			return this
		},
		setLeft : function(left) {
			this.setStyle("left", this.addUnits(left));
			return this
		},
		setTop : function(top) {
			this.setStyle("top", this.addUnits(top));
			return this
		},
		setRight : function(right) {
			this.setStyle("right", this.addUnits(right));
			return this
		},
		setBottom : function(bottom) {
			this.setStyle("bottom", this.addUnits(bottom));
			return this
		},
		setXY : function(pos, animate) {
			if (!animate || !A) {
				D.setXY(this.dom, pos)
			} else {
				this.anim({
							points : {
								to : pos
							}
						}, this.preanim(arguments, 1), "motion")
			}
			return this
		},
		setLocation : function(x, y, animate) {
			this.setXY([x, y], this.preanim(arguments, 2));
			return this
		},
		moveTo : function(x, y, animate) {
			this.setXY([x, y], this.preanim(arguments, 2));
			return this
		},
		getRegion : function() {
			return D.getRegion(this.dom)
		},
		getHeight : function(contentHeight) {
			var h = this.dom.offsetHeight || 0;
			h = contentHeight !== true ? h : h - this.getBorderWidth("tb")
					- this.getPadding("tb");
			return h < 0 ? 0 : h
		},
		getWidth : function(contentWidth) {
			var w = this.dom.offsetWidth || 0;
			w = contentWidth !== true ? w : w - this.getBorderWidth("lr")
					- this.getPadding("lr");
			return w < 0 ? 0 : w
		},
		getComputedHeight : function() {
			var h = Math.max(this.dom.offsetHeight, this.dom.clientHeight);
			if (!h) {
				h = parseInt(this.getStyle("height"), 10) || 0;
				if (!this.isBorderBox()) {
					h += this.getFrameWidth("tb")
				}
			}
			return h
		},
		getComputedWidth : function() {
			var w = Math.max(this.dom.offsetWidth, this.dom.clientWidth);
			if (!w) {
				w = parseInt(this.getStyle("width"), 10) || 0;
				if (!this.isBorderBox()) {
					w += this.getFrameWidth("lr")
				}
			}
			return w
		},
		getSize : function(contentSize) {
			return {
				width : this.getWidth(contentSize),
				height : this.getHeight(contentSize)
			}
		},
		getStyleSize : function() {
			var w, h, d = this.dom, s = d.style;
			if (s.width && s.width != "auto") {
				w = parseInt(s.width, 10);
				if (Ext.isBorderBox) {
					w -= this.getFrameWidth("lr")
				}
			}
			if (s.height && s.height != "auto") {
				h = parseInt(s.height, 10);
				if (Ext.isBorderBox) {
					h -= this.getFrameWidth("tb")
				}
			}
			return {
				width : w || this.getWidth(true),
				height : h || this.getHeight(true)
			}
		},
		getViewSize : function() {
			var d = this.dom, doc = document, aw = 0, ah = 0;
			if (d == doc || d == doc.body) {
				return {
					width : D.getViewWidth(),
					height : D.getViewHeight()
				}
			} else {
				return {
					width : d.clientWidth,
					height : d.clientHeight
				}
			}
		},
		getValue : function(asNumber) {
			return asNumber ? parseInt(this.dom.value, 10) : this.dom.value
		},
		adjustWidth : function(width) {
			if (typeof width == "number") {
				if (this.autoBoxAdjust && !this.isBorderBox()) {
					width -= (this.getBorderWidth("lr") + this.getPadding("lr"))
				}
				if (width < 0) {
					width = 0
				}
			}
			return width
		},
		adjustHeight : function(height) {
			if (typeof height == "number") {
				if (this.autoBoxAdjust && !this.isBorderBox()) {
					height -= (this.getBorderWidth("tb") + this
							.getPadding("tb"))
				}
				if (height < 0) {
					height = 0
				}
			}
			return height
		},
		setWidth : function(width, animate) {
			width = this.adjustWidth(width);
			if (!animate || !A) {
				this.dom.style.width = this.addUnits(width)
			} else {
				this.anim({
							width : {
								to : width
							}
						}, this.preanim(arguments, 1))
			}
			return this
		},
		setHeight : function(height, animate) {
			height = this.adjustHeight(height);
			if (!animate || !A) {
				this.dom.style.height = this.addUnits(height)
			} else {
				this.anim({
							height : {
								to : height
							}
						}, this.preanim(arguments, 1))
			}
			return this
		},
		setSize : function(width, height, animate) {
			if (typeof width == "object") {
				height = width.height;
				width = width.width
			}
			width = this.adjustWidth(width);
			height = this.adjustHeight(height);
			if (!animate || !A) {
				this.dom.style.width = this.addUnits(width);
				this.dom.style.height = this.addUnits(height)
			} else {
				this.anim({
							width : {
								to : width
							},
							height : {
								to : height
							}
						}, this.preanim(arguments, 2))
			}
			return this
		},
		setBounds : function(x, y, width, height, animate) {
			if (!animate || !A) {
				this.setSize(width, height);
				this.setLocation(x, y)
			} else {
				width = this.adjustWidth(width);
				height = this.adjustHeight(height);
				this.anim({
							points : {
								to : [x, y]
							},
							width : {
								to : width
							},
							height : {
								to : height
							}
						}, this.preanim(arguments, 4), "motion")
			}
			return this
		},
		setRegion : function(region, animate) {
			this.setBounds(region.left, region.top, region.right - region.left,
					region.bottom - region.top, this.preanim(arguments, 1));
			return this
		},
		addListener : function(eventName, fn, scope, options) {
			Ext.EventManager
					.on(this.dom, eventName, fn, scope || this, options)
		},
		removeListener : function(eventName, fn, scope) {
			Ext.EventManager.removeListener(this.dom, eventName, fn, scope
							|| this);
			return this
		},
		removeAllListeners : function() {
			Ext.EventManager.removeAll(this.dom);
			return this
		},
		relayEvent : function(eventName, observable) {
			this.on(eventName, function(e) {
						observable.fireEvent(eventName, e)
					})
		},
		setOpacity : function(opacity, animate) {
			if (!animate || !A) {
				var s = this.dom.style;
				if (Ext.isIE) {
					s.zoom = 1;
					s.filter = (s.filter || "")
							.replace(/alpha\([^\)]*\)/gi, "")
							+ (opacity == 1 ? "" : " alpha(opacity=" + opacity
									* 100 + ")")
				} else {
					s.opacity = opacity
				}
			} else {
				this.anim({
							opacity : {
								to : opacity
							}
						}, this.preanim(arguments, 1), null, 0.35, "easeIn")
			}
			return this
		},
		getLeft : function(local) {
			if (!local) {
				return this.getX()
			} else {
				return parseInt(this.getStyle("left"), 10) || 0
			}
		},
		getRight : function(local) {
			if (!local) {
				return this.getX() + this.getWidth()
			} else {
				return (this.getLeft(true) + this.getWidth()) || 0
			}
		},
		getTop : function(local) {
			if (!local) {
				return this.getY()
			} else {
				return parseInt(this.getStyle("top"), 10) || 0
			}
		},
		getBottom : function(local) {
			if (!local) {
				return this.getY() + this.getHeight()
			} else {
				return (this.getTop(true) + this.getHeight()) || 0
			}
		},
		position : function(pos, zIndex, x, y) {
			if (!pos) {
				if (this.getStyle("position") == "static") {
					this.setStyle("position", "relative")
				}
			} else {
				this.setStyle("position", pos)
			}
			if (zIndex) {
				this.setStyle("z-index", zIndex)
			}
			if (x !== undefined && y !== undefined) {
				this.setXY([x, y])
			} else {
				if (x !== undefined) {
					this.setX(x)
				} else {
					if (y !== undefined) {
						this.setY(y)
					}
				}
			}
		},
		clearPositioning : function(value) {
			value = value || "";
			this.setStyle({
						left : value,
						right : value,
						top : value,
						bottom : value,
						"z-index" : "",
						position : "static"
					});
			return this
		},
		getPositioning : function() {
			var l = this.getStyle("left");
			var t = this.getStyle("top");
			return {
				position : this.getStyle("position"),
				left : l,
				right : l ? "" : this.getStyle("right"),
				top : t,
				bottom : t ? "" : this.getStyle("bottom"),
				"z-index" : this.getStyle("z-index")
			}
		},
		getBorderWidth : function(side) {
			return this.addStyles(side, El.borders)
		},
		getPadding : function(side) {
			return this.addStyles(side, El.paddings)
		},
		setPositioning : function(pc) {
			this.applyStyles(pc);
			if (pc.right == "auto") {
				this.dom.style.right = ""
			}
			if (pc.bottom == "auto") {
				this.dom.style.bottom = ""
			}
			return this
		},
		fixDisplay : function() {
			if (this.getStyle("display") == "none") {
				this.setStyle("visibility", "hidden");
				this.setStyle("display", this.originalDisplay);
				if (this.getStyle("display") == "none") {
					this.setStyle("display", "block")
				}
			}
		},
		setOverflow : function(v) {
			if (v == "auto" && Ext.isMac && Ext.isGecko2) {
				this.dom.style.overflow = "hidden";
				(function() {
					this.dom.style.overflow = "auto"
				}).defer(1, this)
			} else {
				this.dom.style.overflow = v
			}
		},
		setLeftTop : function(left, top) {
			this.dom.style.left = this.addUnits(left);
			this.dom.style.top = this.addUnits(top);
			return this
		},
		move : function(direction, distance, animate) {
			var xy = this.getXY();
			direction = direction.toLowerCase();
			switch (direction) {
				case "l" :
				case "left" :
					this.moveTo(xy[0] - distance, xy[1], this.preanim(
									arguments, 2));
					break;
				case "r" :
				case "right" :
					this.moveTo(xy[0] + distance, xy[1], this.preanim(
									arguments, 2));
					break;
				case "t" :
				case "top" :
				case "up" :
					this.moveTo(xy[0], xy[1] - distance, this.preanim(
									arguments, 2));
					break;
				case "b" :
				case "bottom" :
				case "down" :
					this.moveTo(xy[0], xy[1] + distance, this.preanim(
									arguments, 2));
					break
			}
			return this
		},
		clip : function() {
			if (!this.isClipped) {
				this.isClipped = true;
				this.originalClip = {
					o : this.getStyle("overflow"),
					x : this.getStyle("overflow-x"),
					y : this.getStyle("overflow-y")
				};
				this.setStyle("overflow", "hidden");
				this.setStyle("overflow-x", "hidden");
				this.setStyle("overflow-y", "hidden")
			}
			return this
		},
		unclip : function() {
			if (this.isClipped) {
				this.isClipped = false;
				var o = this.originalClip;
				if (o.o) {
					this.setStyle("overflow", o.o)
				}
				if (o.x) {
					this.setStyle("overflow-x", o.x)
				}
				if (o.y) {
					this.setStyle("overflow-y", o.y)
				}
			}
			return this
		},
		getAnchorXY : function(anchor, local, s) {
			var w, h, vp = false;
			if (!s) {
				var d = this.dom;
				if (d == document.body || d == document) {
					vp = true;
					w = D.getViewWidth();
					h = D.getViewHeight()
				} else {
					w = this.getWidth();
					h = this.getHeight()
				}
			} else {
				w = s.width;
				h = s.height
			}
			var x = 0, y = 0, r = Math.round;
			switch ((anchor || "tl").toLowerCase()) {
				case "c" :
					x = r(w * 0.5);
					y = r(h * 0.5);
					break;
				case "t" :
					x = r(w * 0.5);
					y = 0;
					break;
				case "l" :
					x = 0;
					y = r(h * 0.5);
					break;
				case "r" :
					x = w;
					y = r(h * 0.5);
					break;
				case "b" :
					x = r(w * 0.5);
					y = h;
					break;
				case "tl" :
					x = 0;
					y = 0;
					break;
				case "bl" :
					x = 0;
					y = h;
					break;
				case "br" :
					x = w;
					y = h;
					break;
				case "tr" :
					x = w;
					y = 0;
					break
			}
			if (local === true) {
				return [x, y]
			}
			if (vp) {
				var sc = this.getScroll();
				return [x + sc.left, y + sc.top]
			}
			var o = this.getXY();
			return [x + o[0], y + o[1]]
		},
		getAlignToXY : function(el, p, o) {
			el = Ext.get(el);
			if (!el || !el.dom) {
				throw "Element.alignToXY with an element that doesn't exist"
			}
			var d = this.dom;
			var c = false;
			var p1 = "", p2 = "";
			o = o || [0, 0];
			if (!p) {
				p = "tl-bl"
			} else {
				if (p == "?") {
					p = "tl-bl?"
				} else {
					if (p.indexOf("-") == -1) {
						p = "tl-" + p
					}
				}
			}
			p = p.toLowerCase();
			var m = p.match(/^([a-z]+)-([a-z]+)(\?)?$/);
			if (!m) {
				throw "Element.alignTo with an invalid alignment " + p
			}
			p1 = m[1];
			p2 = m[2];
			c = !!m[3];
			var a1 = this.getAnchorXY(p1, true);
			var a2 = el.getAnchorXY(p2, false);
			var x = a2[0] - a1[0] + o[0];
			var y = a2[1] - a1[1] + o[1];
			if (c) {
				var w = this.getWidth(), h = this.getHeight(), r = el
						.getRegion();
				var dw = D.getViewWidth() - 5, dh = D.getViewHeight() - 5;
				var p1y = p1.charAt(0), p1x = p1.charAt(p1.length - 1);
				var p2y = p2.charAt(0), p2x = p2.charAt(p2.length - 1);
				var swapY = ((p1y == "t" && p2y == "b") || (p1y == "b" && p2y == "t"));
				var swapX = ((p1x == "r" && p2x == "l") || (p1x == "l" && p2x == "r"));
				var doc = document;
				var scrollX = (doc.documentElement.scrollLeft
						|| doc.body.scrollLeft || 0)
						+ 5;
				var scrollY = (doc.documentElement.scrollTop
						|| doc.body.scrollTop || 0)
						+ 5;
				if ((x + w) > dw + scrollX) {
					x = swapX ? r.left - w : dw + scrollX - w
				}
				if (x < scrollX) {
					x = swapX ? r.right : scrollX
				}
				if ((y + h) > dh + scrollY) {
					y = swapY ? r.top - h : dh + scrollY - h
				}
				if (y < scrollY) {
					y = swapY ? r.bottom : scrollY
				}
			}
			return [x, y]
		},
		getConstrainToXY : function() {
			var os = {
				top : 0,
				left : 0,
				bottom : 0,
				right : 0
			};
			return function(el, local, offsets, proposedXY) {
				el = Ext.get(el);
				offsets = offsets ? Ext.applyIf(offsets, os) : os;
				var vw, vh, vx = 0, vy = 0;
				if (el.dom == document.body || el.dom == document) {
					vw = Ext.lib.Dom.getViewWidth();
					vh = Ext.lib.Dom.getViewHeight()
				} else {
					vw = el.dom.clientWidth;
					vh = el.dom.clientHeight;
					if (!local) {
						var vxy = el.getXY();
						vx = vxy[0];
						vy = vxy[1]
					}
				}
				var s = el.getScroll();
				vx += offsets.left + s.left;
				vy += offsets.top + s.top;
				vw -= offsets.right;
				vh -= offsets.bottom;
				var vr = vx + vw;
				var vb = vy + vh;
				var xy = proposedXY
						|| (!local ? this.getXY() : [this.getLeft(true),
								this.getTop(true)]);
				var x = xy[0], y = xy[1];
				var w = this.dom.offsetWidth, h = this.dom.offsetHeight;
				var moved = false;
				if ((x + w) > vr) {
					x = vr - w;
					moved = true
				}
				if ((y + h) > vb) {
					y = vb - h;
					moved = true
				}
				if (x < vx) {
					x = vx;
					moved = true
				}
				if (y < vy) {
					y = vy;
					moved = true
				}
				return moved ? [x, y] : false
			}
		}(),
		adjustForConstraints : function(xy, parent, offsets) {
			return this
					.getConstrainToXY(parent || document, false, offsets, xy)
					|| xy
		},
		alignTo : function(element, position, offsets, animate) {
			var xy = this.getAlignToXY(element, position, offsets);
			this.setXY(xy, this.preanim(arguments, 3));
			return this
		},
		anchorTo : function(el, alignment, offsets, animate, monitorScroll,
				callback) {
			var action = function() {
				this.alignTo(el, alignment, offsets, animate);
				Ext.callback(callback, this)
			};
			Ext.EventManager.onWindowResize(action, this);
			var tm = typeof monitorScroll;
			if (tm != "undefined") {
				Ext.EventManager.on(window, "scroll", action, this, {
							buffer : tm == "number" ? monitorScroll : 50
						})
			}
			action.call(this);
			return this
		},
		clearOpacity : function() {
			if (window.ActiveXObject) {
				if (typeof this.dom.style.filter == "string"
						&& (/alpha/i).test(this.dom.style.filter)) {
					this.dom.style.filter = ""
				}
			} else {
				this.dom.style.opacity = "";
				this.dom.style["-moz-opacity"] = "";
				this.dom.style["-khtml-opacity"] = ""
			}
			return this
		},
		hide : function(animate) {
			this.setVisible(false, this.preanim(arguments, 0));
			return this
		},
		show : function(animate) {
			this.setVisible(true, this.preanim(arguments, 0));
			return this
		},
		addUnits : function(size) {
			return Ext.Element.addUnits(size, this.defaultUnit)
		},
		update : function(html, loadScripts, callback) {
			if (typeof html == "undefined") {
				html = ""
			}
			if (loadScripts !== true) {
				this.dom.innerHTML = html;
				if (typeof callback == "function") {
					callback()
				}
				return this
			}
			var id = Ext.id();
			var dom = this.dom;
			html += '<span id="' + id + '"></span>';
			E.onAvailable(id, function() {
						var hd = document.getElementsByTagName("head")[0];
						var re = /(?:<script([^>]*)?>)((\n|\r|.)*?)(?:<\/script>)/ig;
						var srcRe = /\ssrc=([\'\"])(.*?)\1/i;
						var typeRe = /\stype=([\'\"])(.*?)\1/i;
						var match;
						while (match = re.exec(html)) {
							var attrs = match[1];
							var srcMatch = attrs ? attrs.match(srcRe) : false;
							if (srcMatch && srcMatch[2]) {
								var s = document.createElement("script");
								s.src = srcMatch[2];
								var typeMatch = attrs.match(typeRe);
								if (typeMatch && typeMatch[2]) {
									s.type = typeMatch[2]
								}
								hd.appendChild(s)
							} else {
								if (match[2] && match[2].length > 0) {
									if (window.execScript) {
										window.execScript(match[2])
									} else {
										window.eval(match[2])
									}
								}
							}
						}
						var el = document.getElementById(id);
						if (el) {
							Ext.removeNode(el)
						}
						if (typeof callback == "function") {
							callback()
						}
					});
			dom.innerHTML = html.replace(
					/(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/ig, "");
			return this
		},
		load : function() {
			var um = this.getUpdater();
			um.update.apply(um, arguments);
			return this
		},
		getUpdater : function() {
			if (!this.updateManager) {
				this.updateManager = new Ext.Updater(this)
			}
			return this.updateManager
		},
		unselectable : function() {
			this.dom.unselectable = "on";
			this.swallowEvent("selectstart", true);
			this.applyStyles("-moz-user-select:none;-khtml-user-select:none;");
			this.addClass("x-unselectable");
			return this
		},
		getCenterXY : function() {
			return this.getAlignToXY(document, "c-c")
		},
		center : function(centerIn) {
			this.alignTo(centerIn || document, "c-c");
			return this
		},
		isBorderBox : function() {
			return noBoxAdjust[this.dom.tagName.toLowerCase()]
					|| Ext.isBorderBox
		},
		getBox : function(contentBox, local) {
			var xy;
			if (!local) {
				xy = this.getXY()
			} else {
				var left = parseInt(this.getStyle("left"), 10) || 0;
				var top = parseInt(this.getStyle("top"), 10) || 0;
				xy = [left, top]
			}
			var el = this.dom, w = el.offsetWidth, h = el.offsetHeight, bx;
			if (!contentBox) {
				bx = {
					x : xy[0],
					y : xy[1],
					0 : xy[0],
					1 : xy[1],
					width : w,
					height : h
				}
			} else {
				var l = this.getBorderWidth("l") + this.getPadding("l");
				var r = this.getBorderWidth("r") + this.getPadding("r");
				var t = this.getBorderWidth("t") + this.getPadding("t");
				var b = this.getBorderWidth("b") + this.getPadding("b");
				bx = {
					x : xy[0] + l,
					y : xy[1] + t,
					0 : xy[0] + l,
					1 : xy[1] + t,
					width : w - (l + r),
					height : h - (t + b)
				}
			}
			bx.right = bx.x + bx.width;
			bx.bottom = bx.y + bx.height;
			return bx
		},
		getFrameWidth : function(sides, onlyContentBox) {
			return onlyContentBox && Ext.isBorderBox ? 0 : (this
					.getPadding(sides) + this.getBorderWidth(sides))
		},
		setBox : function(box, adjust, animate) {
			var w = box.width, h = box.height;
			if ((adjust && !this.autoBoxAdjust) && !this.isBorderBox()) {
				w -= (this.getBorderWidth("lr") + this.getPadding("lr"));
				h -= (this.getBorderWidth("tb") + this.getPadding("tb"))
			}
			this.setBounds(box.x, box.y, w, h, this.preanim(arguments, 2));
			return this
		},
		repaint : function() {
			var dom = this.dom;
			this.addClass("x-repaint");
			setTimeout(function() {
						Ext.get(dom).removeClass("x-repaint")
					}, 1);
			return this
		},
		getMargins : function(side) {
			if (!side) {
				return {
					top : parseInt(this.getStyle("margin-top"), 10) || 0,
					left : parseInt(this.getStyle("margin-left"), 10) || 0,
					bottom : parseInt(this.getStyle("margin-bottom"), 10) || 0,
					right : parseInt(this.getStyle("margin-right"), 10) || 0
				}
			} else {
				return this.addStyles(side, El.margins)
			}
		},
		addStyles : function(sides, styles) {
			var val = 0, v, w;
			for (var i = 0, len = sides.length; i < len; i++) {
				v = this.getStyle(styles[sides.charAt(i)]);
				if (v) {
					w = parseInt(v, 10);
					if (w) {
						val += (w >= 0 ? w : -1 * w)
					}
				}
			}
			return val
		},
		createProxy : function(config, renderTo, matchBox) {
			config = typeof config == "object" ? config : {
				tag : "div",
				cls : config
			};
			var proxy;
			if (renderTo) {
				proxy = Ext.DomHelper.append(renderTo, config, true)
			} else {
				proxy = Ext.DomHelper.insertBefore(this.dom, config, true)
			}
			if (matchBox) {
				proxy.setBox(this.getBox())
			}
			return proxy
		},
		mask : function(msg, msgCls) {
			if (this.getStyle("position") == "static") {
				this.addClass("x-masked-relative")
			}
			if (this._maskMsg) {
				this._maskMsg.remove()
			}
			if (this._mask) {
				this._mask.remove()
			}
			this._mask = Ext.DomHelper.append(this.dom, {
						cls : "ext-el-mask"
					}, true);
			this.addClass("x-masked");
			this._mask.setDisplayed(true);
			if (typeof msg == "string") {
				this._maskMsg = Ext.DomHelper.append(this.dom, {
							cls : "ext-el-mask-msg",
							cn : {
								tag : "div"
							}
						}, true);
				var mm = this._maskMsg;
				mm.dom.className = msgCls
						? "ext-el-mask-msg " + msgCls
						: "ext-el-mask-msg";
				mm.dom.firstChild.innerHTML = msg;
				mm.setDisplayed(true);
				mm.center(this)
			}
			if (Ext.isIE && !(Ext.isIE7 && Ext.isStrict)
					&& this.getStyle("height") == "auto") {
				this._mask.setSize(this.getWidth(), this.getHeight())
			}
			return this._mask
		},
		unmask : function() {
			if (this._mask) {
				if (this._maskMsg) {
					this._maskMsg.remove();
					delete this._maskMsg
				}
				this._mask.remove();
				delete this._mask
			}
			this.removeClass(["x-masked", "x-masked-relative"])
		},
		isMasked : function() {
			return this._mask && this._mask.isVisible()
		},
		createShim : function() {
			var el = document.createElement("iframe");
			el.frameBorder = "0";
			el.className = "ext-shim";
			if (Ext.isIE && Ext.isSecure) {
				el.src = Ext.SSL_SECURE_URL
			}
			var shim = Ext.get(this.dom.parentNode.insertBefore(el, this.dom));
			shim.autoBoxAdjust = false;
			return shim
		},
		remove : function() {
			Ext.removeNode(this.dom);
			delete El.cache[this.dom.id]
		},
		hover : function(overFn, outFn, scope) {
			var preOverFn = function(e) {
				if (!e.within(this, true)) {
					overFn.apply(scope || this, arguments)
				}
			};
			var preOutFn = function(e) {
				if (!e.within(this, true)) {
					outFn.apply(scope || this, arguments)
				}
			};
			this.on("mouseover", preOverFn, this.dom);
			this.on("mouseout", preOutFn, this.dom);
			return this
		},
		addClassOnOver : function(className) {
			this.hover(function() {
						Ext.fly(this, "_internal").addClass(className)
					}, function() {
						Ext.fly(this, "_internal").removeClass(className)
					});
			return this
		},
		addClassOnFocus : function(className) {
			this.on("focus", function() {
						Ext.fly(this, "_internal").addClass(className)
					}, this.dom);
			this.on("blur", function() {
						Ext.fly(this, "_internal").removeClass(className)
					}, this.dom);
			return this
		},
		addClassOnClick : function(className) {
			var dom = this.dom;
			this.on("mousedown", function() {
						Ext.fly(dom, "_internal").addClass(className);
						var d = Ext.getDoc();
						var fn = function() {
							Ext.fly(dom, "_internal").removeClass(className);
							d.removeListener("mouseup", fn)
						};
						d.on("mouseup", fn)
					});
			return this
		},
		swallowEvent : function(eventName, preventDefault) {
			var fn = function(e) {
				e.stopPropagation();
				if (preventDefault) {
					e.preventDefault()
				}
			};
			if (Ext.isArray(eventName)) {
				for (var i = 0, len = eventName.length; i < len; i++) {
					this.on(eventName[i], fn)
				}
				return this
			}
			this.on(eventName, fn);
			return this
		},
		parent : function(selector, returnDom) {
			return this.matchNode("parentNode", "parentNode", selector,
					returnDom)
		},
		next : function(selector, returnDom) {
			return this.matchNode("nextSibling", "nextSibling", selector,
					returnDom)
		},
		prev : function(selector, returnDom) {
			return this.matchNode("previousSibling", "previousSibling",
					selector, returnDom)
		},
		first : function(selector, returnDom) {
			return this.matchNode("nextSibling", "firstChild", selector,
					returnDom)
		},
		last : function(selector, returnDom) {
			return this.matchNode("previousSibling", "lastChild", selector,
					returnDom)
		},
		matchNode : function(dir, start, selector, returnDom) {
			var n = this.dom[start];
			while (n) {
				if (n.nodeType == 1
						&& (!selector || Ext.DomQuery.is(n, selector))) {
					return !returnDom ? Ext.get(n) : n
				}
				n = n[dir]
			}
			return null
		},
		appendChild : function(el) {
			el = Ext.get(el);
			el.appendTo(this);
			return this
		},
		createChild : function(config, insertBefore, returnDom) {
			config = config || {
				tag : "div"
			};
			if (insertBefore) {
				return Ext.DomHelper.insertBefore(insertBefore, config,
						returnDom !== true)
			}
			return Ext.DomHelper[!this.dom.firstChild ? "overwrite" : "append"](
					this.dom, config, returnDom !== true)
		},
		appendTo : function(el) {
			el = Ext.getDom(el);
			el.appendChild(this.dom);
			return this
		},
		insertBefore : function(el) {
			el = Ext.getDom(el);
			el.parentNode.insertBefore(this.dom, el);
			return this
		},
		insertAfter : function(el) {
			el = Ext.getDom(el);
			el.parentNode.insertBefore(this.dom, el.nextSibling);
			return this
		},
		insertFirst : function(el, returnDom) {
			el = el || {};
			if (typeof el == "object" && !el.nodeType && !el.dom) {
				return this.createChild(el, this.dom.firstChild, returnDom)
			} else {
				el = Ext.getDom(el);
				this.dom.insertBefore(el, this.dom.firstChild);
				return !returnDom ? Ext.get(el) : el
			}
		},
		insertSibling : function(el, where, returnDom) {
			var rt;
			if (Ext.isArray(el)) {
				for (var i = 0, len = el.length; i < len; i++) {
					rt = this.insertSibling(el[i], where, returnDom)
				}
				return rt
			}
			where = where ? where.toLowerCase() : "before";
			el = el || {};
			var refNode = where == "before" ? this.dom : this.dom.nextSibling;
			if (typeof el == "object" && !el.nodeType && !el.dom) {
				if (where == "after" && !this.dom.nextSibling) {
					rt = Ext.DomHelper.append(this.dom.parentNode, el,
							!returnDom)
				} else {
					rt = Ext.DomHelper[where == "after"
							? "insertAfter"
							: "insertBefore"](this.dom, el, !returnDom)
				}
			} else {
				rt = this.dom.parentNode.insertBefore(Ext.getDom(el), refNode);
				if (!returnDom) {
					rt = Ext.get(rt)
				}
			}
			return rt
		},
		wrap : function(config, returnDom) {
			if (!config) {
				config = {
					tag : "div"
				}
			}
			var newEl = Ext.DomHelper
					.insertBefore(this.dom, config, !returnDom);
			newEl.dom ? newEl.dom.appendChild(this.dom) : newEl
					.appendChild(this.dom);
			return newEl
		},
		replace : function(el) {
			el = Ext.get(el);
			this.insertBefore(el);
			el.remove();
			return this
		},
		replaceWith : function(el) {
			if (typeof el == "object" && !el.nodeType && !el.dom) {
				el = this.insertSibling(el, "before")
			} else {
				el = Ext.getDom(el);
				this.dom.parentNode.insertBefore(el, this.dom)
			}
			El.uncache(this.id);
			Ext.removeNode(this.dom);
			this.dom = el;
			this.id = Ext.id(el);
			El.cache[this.id] = this;
			return this
		},
		insertHtml : function(where, html, returnEl) {
			var el = Ext.DomHelper.insertHtml(where, this.dom, html);
			return returnEl ? Ext.get(el) : el
		},
		set : function(o, useSet) {
			var el = this.dom;
			useSet = typeof useSet == "undefined" ? (el.setAttribute
					? true
					: false) : useSet;
			for (var attr in o) {
				if (attr == "style" || typeof o[attr] == "function") {
					continue
				}
				if (attr == "cls") {
					el.className = o.cls
				} else {
					if (o.hasOwnProperty(attr)) {
						if (useSet) {
							el.setAttribute(attr, o[attr])
						} else {
							el[attr] = o[attr]
						}
					}
				}
			}
			if (o.style) {
				Ext.DomHelper.applyStyles(el, o.style)
			}
			return this
		},
		addKeyListener : function(key, fn, scope) {
			var config;
			if (typeof key != "object" || Ext.isArray(key)) {
				config = {
					key : key,
					fn : fn,
					scope : scope
				}
			} else {
				config = {
					key : key.key,
					shift : key.shift,
					ctrl : key.ctrl,
					alt : key.alt,
					fn : fn,
					scope : scope
				}
			}
			return new Ext.KeyMap(this, config)
		},
		addKeyMap : function(config) {
			return new Ext.KeyMap(this, config)
		},
		isScrollable : function() {
			var dom = this.dom;
			return dom.scrollHeight > dom.clientHeight
					|| dom.scrollWidth > dom.clientWidth
		},
		scrollTo : function(side, value, animate) {
			var prop = side.toLowerCase() == "left"
					? "scrollLeft"
					: "scrollTop";
			if (!animate || !A) {
				this.dom[prop] = value
			} else {
				var to = prop == "scrollLeft" ? [value, this.dom.scrollTop] : [
						this.dom.scrollLeft, value];
				this.anim({
							scroll : {
								to : to
							}
						}, this.preanim(arguments, 2), "scroll")
			}
			return this
		},
		scroll : function(direction, distance, animate) {
			if (!this.isScrollable()) {
				return
			}
			var el = this.dom;
			var l = el.scrollLeft, t = el.scrollTop;
			var w = el.scrollWidth, h = el.scrollHeight;
			var cw = el.clientWidth, ch = el.clientHeight;
			direction = direction.toLowerCase();
			var scrolled = false;
			var a = this.preanim(arguments, 2);
			switch (direction) {
				case "l" :
				case "left" :
					if (w - l > cw) {
						var v = Math.min(l + distance, w - cw);
						this.scrollTo("left", v, a);
						scrolled = true
					}
					break;
				case "r" :
				case "right" :
					if (l > 0) {
						var v = Math.max(l - distance, 0);
						this.scrollTo("left", v, a);
						scrolled = true
					}
					break;
				case "t" :
				case "top" :
				case "up" :
					if (t > 0) {
						var v = Math.max(t - distance, 0);
						this.scrollTo("top", v, a);
						scrolled = true
					}
					break;
				case "b" :
				case "bottom" :
				case "down" :
					if (h - t > ch) {
						var v = Math.min(t + distance, h - ch);
						this.scrollTo("top", v, a);
						scrolled = true
					}
					break
			}
			return scrolled
		},
		translatePoints : function(x, y) {
			if (typeof x == "object" || Ext.isArray(x)) {
				y = x[1];
				x = x[0]
			}
			var p = this.getStyle("position");
			var o = this.getXY();
			var l = parseInt(this.getStyle("left"), 10);
			var t = parseInt(this.getStyle("top"), 10);
			if (isNaN(l)) {
				l = (p == "relative") ? 0 : this.dom.offsetLeft
			}
			if (isNaN(t)) {
				t = (p == "relative") ? 0 : this.dom.offsetTop
			}
			return {
				left : (x - o[0] + l),
				top : (y - o[1] + t)
			}
		},
		getScroll : function() {
			var d = this.dom, doc = document;
			if (d == doc || d == doc.body) {
				var l, t;
				if (Ext.isIE && Ext.isStrict) {
					l = doc.documentElement.scrollLeft
							|| (doc.body.scrollLeft || 0);
					t = doc.documentElement.scrollTop
							|| (doc.body.scrollTop || 0)
				} else {
					l = window.pageXOffset || (doc.body.scrollLeft || 0);
					t = window.pageYOffset || (doc.body.scrollTop || 0)
				}
				return {
					left : l,
					top : t
				}
			} else {
				return {
					left : d.scrollLeft,
					top : d.scrollTop
				}
			}
		},
		getColor : function(attr, defaultValue, prefix) {
			var v = this.getStyle(attr);
			if (!v || v == "transparent" || v == "inherit") {
				return defaultValue
			}
			var color = typeof prefix == "undefined" ? "#" : prefix;
			if (v.substr(0, 4) == "rgb(") {
				var rvs = v.slice(4, v.length - 1).split(",");
				for (var i = 0; i < 3; i++) {
					var h = parseInt(rvs[i]);
					var s = h.toString(16);
					if (h < 16) {
						s = "0" + s
					}
					color += s
				}
			} else {
				if (v.substr(0, 1) == "#") {
					if (v.length == 4) {
						for (var i = 1; i < 4; i++) {
							var c = v.charAt(i);
							color += c + c
						}
					} else {
						if (v.length == 7) {
							color += v.substr(1)
						}
					}
				}
			}
			return (color.length > 5 ? color.toLowerCase() : defaultValue)
		},
		boxWrap : function(cls) {
			cls = cls || "x-box";
			var el = Ext.get(this
					.insertHtml("beforeBegin", String.format(
									'<div class="{0}">' + El.boxMarkup
											+ "</div>", cls)));
			el.child("." + cls + "-mc").dom.appendChild(this.dom);
			return el
		},
		getAttributeNS : Ext.isIE ? function(ns, name) {
			var d = this.dom;
			var type = typeof d[ns + ":" + name];
			if (type != "undefined" && type != "unknown") {
				return d[ns + ":" + name]
			}
			return d[name]
		} : function(ns, name) {
			var d = this.dom;
			return d.getAttributeNS(ns, name)
					|| d.getAttribute(ns + ":" + name) || d.getAttribute(name)
					|| d[name]
		},
		getTextWidth : function(text, min, max) {
			return (Ext.util.TextMetrics.measure(this.dom, Ext.value(text,
							this.dom.innerHTML, true)).width).constrain(min
							|| 0, max || 1000000)
		}
	};
	var ep = El.prototype;
	ep.on = ep.addListener;
	ep.mon = ep.addListener;
	ep.getUpdateManager = ep.getUpdater;
	ep.un = ep.removeListener;
	ep.autoBoxAdjust = true;
	El.unitPattern = /\d+(px|em|%|en|ex|pt|in|cm|mm|pc)$/i;
	El.addUnits = function(v, defaultUnit) {
		if (v === "" || v == "auto") {
			return v
		}
		if (v === undefined) {
			return ""
		}
		if (typeof v == "number" || !El.unitPattern.test(v)) {
			return v + (defaultUnit || "px")
		}
		return v
	};
	El.boxMarkup = '<div class="{0}-tl"><div class="{0}-tr"><div class="{0}-tc"></div></div></div><div class="{0}-ml"><div class="{0}-mr"><div class="{0}-mc"></div></div></div><div class="{0}-bl"><div class="{0}-br"><div class="{0}-bc"></div></div></div>';
	El.VISIBILITY = 1;
	El.DISPLAY = 2;
	El.borders = {
		l : "border-left-width",
		r : "border-right-width",
		t : "border-top-width",
		b : "border-bottom-width"
	};
	El.paddings = {
		l : "padding-left",
		r : "padding-right",
		t : "padding-top",
		b : "padding-bottom"
	};
	El.margins = {
		l : "margin-left",
		r : "margin-right",
		t : "margin-top",
		b : "margin-bottom"
	};
	El.cache = {};
	var docEl;
	El.get = function(el) {
		var ex, elm, id;
		if (!el) {
			return null
		}
		if (typeof el == "string") {
			if (!(elm = document.getElementById(el))) {
				return null
			}
			if (ex = El.cache[el]) {
				ex.dom = elm
			} else {
				ex = El.cache[el] = new El(elm)
			}
			return ex
		} else {
			if (el.tagName) {
				if (!(id = el.id)) {
					id = Ext.id(el)
				}
				if (ex = El.cache[id]) {
					ex.dom = el
				} else {
					ex = El.cache[id] = new El(el)
				}
				return ex
			} else {
				if (el instanceof El) {
					if (el != docEl) {
						el.dom = document.getElementById(el.id) || el.dom;
						El.cache[el.id] = el
					}
					return el
				} else {
					if (el.isComposite) {
						return el
					} else {
						if (Ext.isArray(el)) {
							return El.select(el)
						} else {
							if (el == document) {
								if (!docEl) {
									var f = function() {
									};
									f.prototype = El.prototype;
									docEl = new f();
									docEl.dom = document
								}
								return docEl
							}
						}
					}
				}
			}
		}
		return null
	};
	El.uncache = function(el) {
		for (var i = 0, a = arguments, len = a.length; i < len; i++) {
			if (a[i]) {
				delete El.cache[a[i].id || a[i]]
			}
		}
	};
	El.garbageCollect = function() {
		if (!Ext.enableGarbageCollector) {
			clearInterval(El.collectorThread);
			return
		}
		for (var eid in El.cache) {
			var el = El.cache[eid], d = el.dom;
			if (!d || !d.parentNode
					|| (!d.offsetParent && !document.getElementById(eid))) {
				delete El.cache[eid];
				if (d && Ext.enableListenerCollection) {
					Ext.EventManager.removeAll(d)
				}
			}
		}
	};
	El.collectorThreadId = setInterval(El.garbageCollect, 30000);
	var flyFn = function() {
	};
	flyFn.prototype = El.prototype;
	var _cls = new flyFn();
	El.Flyweight = function(dom) {
		this.dom = dom
	};
	El.Flyweight.prototype = _cls;
	El.Flyweight.prototype.isFlyweight = true;
	El._flyweights = {};
	El.fly = function(el, named) {
		named = named || "_global";
		el = Ext.getDom(el);
		if (!el) {
			return null
		}
		if (!El._flyweights[named]) {
			El._flyweights[named] = new El.Flyweight()
		}
		El._flyweights[named].dom = el;
		return El._flyweights[named]
	};
	Ext.get = El.get;
	Ext.fly = El.fly;
	var noBoxAdjust = Ext.isStrict ? {
		select : 1
	} : {
		input : 1,
		select : 1,
		textarea : 1
	};
	if (Ext.isIE || Ext.isGecko) {
		noBoxAdjust.button = 1
	}
	Ext.EventManager.on(window, "unload", function() {
				delete El.cache;
				delete El._flyweights
			})
})();
Ext.enableFx = true;
Ext.Fx = {
	slideIn : function(a, c) {
		var b = this.getFxEl();
		c = c || {};
		b.queueFx(c, function() {
					a = a || "t";
					this.fixDisplay();
					var d = this.getFxRestore();
					var j = this.getBox();
					this.setSize(j);
					var g = this.fxWrap(d.pos, c, "hidden");
					var l = this.dom.style;
					l.visibility = "visible";
					l.position = "absolute";
					var e = function() {
						b.fxUnwrap(g, d.pos, c);
						l.width = d.width;
						l.height = d.height;
						b.afterFx(c)
					};
					var k, m = {
						to : [j.x, j.y]
					}, i = {
						to : j.width
					}, h = {
						to : j.height
					};
					switch (a.toLowerCase()) {
						case "t" :
							g.setSize(j.width, 0);
							l.left = l.bottom = "0";
							k = {
								height : h
							};
							break;
						case "l" :
							g.setSize(0, j.height);
							l.right = l.top = "0";
							k = {
								width : i
							};
							break;
						case "r" :
							g.setSize(0, j.height);
							g.setX(j.right);
							l.left = l.top = "0";
							k = {
								width : i,
								points : m
							};
							break;
						case "b" :
							g.setSize(j.width, 0);
							g.setY(j.bottom);
							l.left = l.top = "0";
							k = {
								height : h,
								points : m
							};
							break;
						case "tl" :
							g.setSize(0, 0);
							l.right = l.bottom = "0";
							k = {
								width : i,
								height : h
							};
							break;
						case "bl" :
							g.setSize(0, 0);
							g.setY(j.y + j.height);
							l.right = l.top = "0";
							k = {
								width : i,
								height : h,
								points : m
							};
							break;
						case "br" :
							g.setSize(0, 0);
							g.setXY([j.right, j.bottom]);
							l.left = l.top = "0";
							k = {
								width : i,
								height : h,
								points : m
							};
							break;
						case "tr" :
							g.setSize(0, 0);
							g.setX(j.x + j.width);
							l.left = l.bottom = "0";
							k = {
								width : i,
								height : h,
								points : m
							};
							break
					}
					this.dom.style.visibility = "visible";
					g.show();
					arguments.callee.anim = g.fxanim(k, c, "motion", 0.5,
							"easeOut", e)
				});
		return this
	},
	slideOut : function(a, c) {
		var b = this.getFxEl();
		c = c || {};
		b.queueFx(c, function() {
					a = a || "t";
					var j = this.getFxRestore();
					var d = this.getBox();
					this.setSize(d);
					var h = this.fxWrap(j.pos, c, "visible");
					var g = this.dom.style;
					g.visibility = "visible";
					g.position = "absolute";
					h.setSize(d);
					var k = function() {
						if (c.useDisplay) {
							b.setDisplayed(false)
						} else {
							b.hide()
						}
						b.fxUnwrap(h, j.pos, c);
						g.width = j.width;
						g.height = j.height;
						b.afterFx(c)
					};
					var e, i = {
						to : 0
					};
					switch (a.toLowerCase()) {
						case "t" :
							g.left = g.bottom = "0";
							e = {
								height : i
							};
							break;
						case "l" :
							g.right = g.top = "0";
							e = {
								width : i
							};
							break;
						case "r" :
							g.left = g.top = "0";
							e = {
								width : i,
								points : {
									to : [d.right, d.y]
								}
							};
							break;
						case "b" :
							g.left = g.top = "0";
							e = {
								height : i,
								points : {
									to : [d.x, d.bottom]
								}
							};
							break;
						case "tl" :
							g.right = g.bottom = "0";
							e = {
								width : i,
								height : i
							};
							break;
						case "bl" :
							g.right = g.top = "0";
							e = {
								width : i,
								height : i,
								points : {
									to : [d.x, d.bottom]
								}
							};
							break;
						case "br" :
							g.left = g.top = "0";
							e = {
								width : i,
								height : i,
								points : {
									to : [d.x + d.width, d.bottom]
								}
							};
							break;
						case "tr" :
							g.left = g.bottom = "0";
							e = {
								width : i,
								height : i,
								points : {
									to : [d.right, d.y]
								}
							};
							break
					}
					arguments.callee.anim = h.fxanim(e, c, "motion", 0.5,
							"easeOut", k)
				});
		return this
	},
	puff : function(b) {
		var a = this.getFxEl();
		b = b || {};
		a.queueFx(b, function() {
					this.clearOpacity();
					this.show();
					var g = this.getFxRestore();
					var d = this.dom.style;
					var h = function() {
						if (b.useDisplay) {
							a.setDisplayed(false)
						} else {
							a.hide()
						}
						a.clearOpacity();
						a.setPositioning(g.pos);
						d.width = g.width;
						d.height = g.height;
						d.fontSize = "";
						a.afterFx(b)
					};
					var e = this.getWidth();
					var c = this.getHeight();
					arguments.callee.anim = this.fxanim({
								width : {
									to : this.adjustWidth(e * 2)
								},
								height : {
									to : this.adjustHeight(c * 2)
								},
								points : {
									by : [-(e * 0.5), -(c * 0.5)]
								},
								opacity : {
									to : 0
								},
								fontSize : {
									to : 200,
									unit : "%"
								}
							}, b, "motion", 0.5, "easeOut", h)
				});
		return this
	},
	switchOff : function(b) {
		var a = this.getFxEl();
		b = b || {};
		a.queueFx(b, function() {
					this.clearOpacity();
					this.clip();
					var d = this.getFxRestore();
					var c = this.dom.style;
					var e = function() {
						if (b.useDisplay) {
							a.setDisplayed(false)
						} else {
							a.hide()
						}
						a.clearOpacity();
						a.setPositioning(d.pos);
						c.width = d.width;
						c.height = d.height;
						a.afterFx(b)
					};
					this.fxanim({
								opacity : {
									to : 0.3
								}
							}, null, null, 0.1, null, function() {
								this.clearOpacity();
								(function() {
									this.fxanim({
												height : {
													to : 1
												},
												points : {
													by : [
															0,
															this.getHeight()
																	* 0.5]
												}
											}, b, "motion", 0.3, "easeIn", e)
								}).defer(100, this)
							})
				});
		return this
	},
	highlight : function(a, c) {
		var b = this.getFxEl();
		c = c || {};
		b.queueFx(c, function() {
					a = a || "ffff9c";
					var d = c.attr || "backgroundColor";
					this.clearOpacity();
					this.show();
					var h = this.getColor(d);
					var i = this.dom.style[d];
					var g = (c.endColor || h) || "ffffff";
					var j = function() {
						b.dom.style[d] = i;
						b.afterFx(c)
					};
					var e = {};
					e[d] = {
						from : a,
						to : g
					};
					arguments.callee.anim = this.fxanim(e, c, "color", 1,
							"easeIn", j)
				});
		return this
	},
	frame : function(a, c, d) {
		var b = this.getFxEl();
		d = d || {};
		b.queueFx(d, function() {
					a = a || "#C3DAF9";
					if (a.length == 6) {
						a = "#" + a
					}
					c = c || 1;
					var h = d.duration || 1;
					this.show();
					var e = this.getBox();
					var g = function() {
						var i = Ext.getBody().createChild({
									style : {
										visbility : "hidden",
										position : "absolute",
										"z-index" : "35000",
										border : "0px solid " + a
									}
								});
						var j = Ext.isBorderBox ? 2 : 1;
						i.animate({
									top : {
										from : e.y,
										to : e.y - 20
									},
									left : {
										from : e.x,
										to : e.x - 20
									},
									borderWidth : {
										from : 0,
										to : 10
									},
									opacity : {
										from : 1,
										to : 0
									},
									height : {
										from : e.height,
										to : (e.height + (20 * j))
									},
									width : {
										from : e.width,
										to : (e.width + (20 * j))
									}
								}, h, function() {
									i.remove();
									if (--c > 0) {
										g()
									} else {
										b.afterFx(d)
									}
								})
					};
					g.call(this)
				});
		return this
	},
	pause : function(c) {
		var a = this.getFxEl();
		var b = {};
		a.queueFx(b, function() {
					setTimeout(function() {
								a.afterFx(b)
							}, c * 1000)
				});
		return this
	},
	fadeIn : function(b) {
		var a = this.getFxEl();
		b = b || {};
		a.queueFx(b, function() {
					this.setOpacity(0);
					this.fixDisplay();
					this.dom.style.visibility = "visible";
					var c = b.endOpacity || 1;
					arguments.callee.anim = this.fxanim({
								opacity : {
									to : c
								}
							}, b, null, 0.5, "easeOut", function() {
								if (c == 1) {
									this.clearOpacity()
								}
								a.afterFx(b)
							})
				});
		return this
	},
	fadeOut : function(b) {
		var a = this.getFxEl();
		b = b || {};
		a.queueFx(b, function() {
					var c = b.endOpacity || 0;
					arguments.callee.anim = this.fxanim({
								opacity : {
									to : c
								}
							}, b, null, 0.5, "easeOut", function() {
								if (c === 0) {
									if (this.visibilityMode == Ext.Element.DISPLAY
											|| b.useDisplay) {
										this.dom.style.display = "none"
									} else {
										this.dom.style.visibility = "hidden"
									}
									this.clearOpacity()
								}
								a.afterFx(b)
							})
				});
		return this
	},
	scale : function(a, b, c) {
		this.shift(Ext.apply({}, c, {
					width : a,
					height : b
				}));
		return this
	},
	shift : function(b) {
		var a = this.getFxEl();
		b = b || {};
		a.queueFx(b, function() {
			var e = {}, d = b.width, g = b.height, c = b.x, j = b.y, i = b.opacity;
			if (d !== undefined) {
				e.width = {
					to : this.adjustWidth(d)
				}
			}
			if (g !== undefined) {
				e.height = {
					to : this.adjustHeight(g)
				}
			}
			if (b.left !== undefined) {
				e.left = {
					to : b.left
				}
			}
			if (b.top !== undefined) {
				e.top = {
					to : b.top
				}
			}
			if (b.right !== undefined) {
				e.right = {
					to : b.right
				}
			}
			if (b.bottom !== undefined) {
				e.bottom = {
					to : b.bottom
				}
			}
			if (c !== undefined || j !== undefined) {
				e.points = {
					to : [c !== undefined ? c : this.getX(),
							j !== undefined ? j : this.getY()]
				}
			}
			if (i !== undefined) {
				e.opacity = {
					to : i
				}
			}
			if (b.xy !== undefined) {
				e.points = {
					to : b.xy
				}
			}
			arguments.callee.anim = this.fxanim(e, b, "motion", 0.35,
					"easeOut", function() {
						a.afterFx(b)
					})
		});
		return this
	},
	ghost : function(a, c) {
		var b = this.getFxEl();
		c = c || {};
		b.queueFx(c, function() {
					a = a || "b";
					var j = this.getFxRestore();
					var e = this.getWidth(), i = this.getHeight();
					var g = this.dom.style;
					var l = function() {
						if (c.useDisplay) {
							b.setDisplayed(false)
						} else {
							b.hide()
						}
						b.clearOpacity();
						b.setPositioning(j.pos);
						g.width = j.width;
						g.height = j.height;
						b.afterFx(c)
					};
					var d = {
						opacity : {
							to : 0
						},
						points : {}
					}, k = d.points;
					switch (a.toLowerCase()) {
						case "t" :
							k.by = [0, -i];
							break;
						case "l" :
							k.by = [-e, 0];
							break;
						case "r" :
							k.by = [e, 0];
							break;
						case "b" :
							k.by = [0, i];
							break;
						case "tl" :
							k.by = [-e, -i];
							break;
						case "bl" :
							k.by = [-e, i];
							break;
						case "br" :
							k.by = [e, i];
							break;
						case "tr" :
							k.by = [e, -i];
							break
					}
					arguments.callee.anim = this.fxanim(d, c, "motion", 0.5,
							"easeOut", l)
				});
		return this
	},
	syncFx : function() {
		this.fxDefaults = Ext.apply(this.fxDefaults || {}, {
					block : false,
					concurrent : true,
					stopFx : false
				});
		return this
	},
	sequenceFx : function() {
		this.fxDefaults = Ext.apply(this.fxDefaults || {}, {
					block : false,
					concurrent : false,
					stopFx : false
				});
		return this
	},
	nextFx : function() {
		var a = this.fxQueue[0];
		if (a) {
			a.call(this)
		}
	},
	hasActiveFx : function() {
		return this.fxQueue && this.fxQueue[0]
	},
	stopFx : function() {
		if (this.hasActiveFx()) {
			var a = this.fxQueue[0];
			if (a && a.anim && a.anim.isAnimated()) {
				this.fxQueue = [a];
				a.anim.stop(true)
			}
		}
		return this
	},
	beforeFx : function(a) {
		if (this.hasActiveFx() && !a.concurrent) {
			if (a.stopFx) {
				this.stopFx();
				return true
			}
			return false
		}
		return true
	},
	hasFxBlock : function() {
		var a = this.fxQueue;
		return a && a[0] && a[0].block
	},
	queueFx : function(c, a) {
		if (!this.fxQueue) {
			this.fxQueue = []
		}
		if (!this.hasFxBlock()) {
			Ext.applyIf(c, this.fxDefaults);
			if (!c.concurrent) {
				var b = this.beforeFx(c);
				a.block = c.block;
				this.fxQueue.push(a);
				if (b) {
					this.nextFx()
				}
			} else {
				a.call(this)
			}
		}
		return this
	},
	fxWrap : function(g, d, c) {
		var b;
		if (!d.wrap || !(b = Ext.get(d.wrap))) {
			var a;
			if (d.fixPosition) {
				a = this.getXY()
			}
			var e = document.createElement("div");
			e.style.visibility = c;
			b = Ext.get(this.dom.parentNode.insertBefore(e, this.dom));
			b.setPositioning(g);
			if (b.getStyle("position") == "static") {
				b.position("relative")
			}
			this.clearPositioning("auto");
			b.clip();
			b.dom.appendChild(this.dom);
			if (a) {
				b.setXY(a)
			}
		}
		return b
	},
	fxUnwrap : function(a, c, b) {
		this.clearPositioning();
		this.setPositioning(c);
		if (!b.wrap) {
			a.dom.parentNode.insertBefore(this.dom, a.dom);
			a.remove()
		}
	},
	getFxRestore : function() {
		var a = this.dom.style;
		return {
			pos : this.getPositioning(),
			width : a.width,
			height : a.height
		}
	},
	afterFx : function(a) {
		if (a.afterStyle) {
			this.applyStyles(a.afterStyle)
		}
		if (a.afterCls) {
			this.addClass(a.afterCls)
		}
		if (a.remove === true) {
			this.remove()
		}
		Ext.callback(a.callback, a.scope, [this]);
		if (!a.concurrent) {
			this.fxQueue.shift();
			this.nextFx()
		}
	},
	getFxEl : function() {
		return Ext.get(this.dom)
	},
	fxanim : function(d, e, b, g, c, a) {
		b = b || "run";
		e = e || {};
		var h = Ext.lib.Anim[b](this.dom, d, (e.duration || g) || 0.35,
				(e.easing || c) || "easeOut", function() {
					Ext.callback(a, this)
				}, this);
		e.anim = h;
		return h
	}
};
Ext.Fx.resize = Ext.Fx.scale;
Ext.apply(Ext.Element.prototype, Ext.Fx);
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
	removeElement : function(e, h) {
		if (Ext.isArray(e)) {
			for (var c = 0, a = e.length; c < a; c++) {
				this.removeElement(e[c])
			}
			return this
		}
		var b = typeof e == "number" ? e : this.indexOf(e);
		if (b !== -1 && this.elements[b]) {
			if (h) {
				var g = this.elements[b];
				if (g.dom) {
					g.remove()
				} else {
					Ext.removeNode(g)
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
			invoke : function(g, b) {
				var d = this.elements;
				var e = this.el;
				for (var c = 0, a = d.length; c < a; c++) {
					e.dom = d[c];
					Ext.Element.prototype[g].apply(e, b)
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
			addListener : function(b, h, g, e) {
				var d = this.elements;
				for (var c = 0, a = d.length; c < a; c++) {
					Ext.EventManager.on(d[c], b, h, g || d[c], e)
				}
				return this
			},
			each : function(g, e) {
				var c = this.elements;
				var d = this.el;
				for (var b = 0, a = c.length; b < a; b++) {
					d.dom = c[b];
					if (g.call(e || d, d, this, b) === false) {
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
						var g = this.elements[b];
						g.parentNode.insertBefore(c, g);
						Ext.removeNode(g)
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
Ext.data.Connection = function(a) {
	Ext.apply(this, a);
	this.addEvents("beforerequest", "requestcomplete", "requestexception");
	Ext.data.Connection.superclass.constructor.call(this)
};
Ext.extend(Ext.data.Connection, Ext.util.Observable, {
			timeout : 30000,
			autoAbort : false,
			disableCaching : true,
			disableCachingParam : "_dc",
			request : function(e) {
				if (this.fireEvent("beforerequest", this, e) !== false) {
					var c = e.params;
					if (typeof c == "function") {
						c = c.call(e.scope || window, e)
					}
					if (typeof c == "object") {
						c = Ext.urlEncode(c)
					}
					if (this.extraParams) {
						var h = Ext.urlEncode(this.extraParams);
						c = c ? (c + "&" + h) : h
					}
					var b = e.url || this.url;
					if (typeof b == "function") {
						b = b.call(e.scope || window, e)
					}
					if (e.form) {
						var d = Ext.getDom(e.form);
						b = b || d.action;
						var k = d.getAttribute("enctype");
						if (e.isUpload
								|| (k && k.toLowerCase() == "multipart/form-data")) {
							return this.doFormUpload(e, c, b)
						}
						var j = Ext.lib.Ajax.serializeForm(d);
						c = c ? (c + "&" + j) : j
					}
					var l = e.headers;
					if (this.defaultHeaders) {
						l = Ext.apply(l || {}, this.defaultHeaders);
						if (!e.headers) {
							e.headers = l
						}
					}
					var g = {
						success : this.handleResponse,
						failure : this.handleFailure,
						scope : this,
						argument : {
							options : e
						},
						timeout : e.timeout || this.timeout
					};
					var a = e.method
							|| this.method
							|| ((c || e.xmlData || e.jsonData) ? "POST" : "GET");
					if (a == "GET"
							&& (this.disableCaching && e.disableCaching !== false)
							|| e.disableCaching === true) {
						var i = e.disableCachingParam
								|| this.disableCachingParam;
						b += (b.indexOf("?") != -1 ? "&" : "?") + i + "="
								+ (new Date().getTime())
					}
					if (typeof e.autoAbort == "boolean") {
						if (e.autoAbort) {
							this.abort()
						}
					} else {
						if (this.autoAbort !== false) {
							this.abort()
						}
					}
					if ((a == "GET" || e.xmlData || e.jsonData) && c) {
						b += (b.indexOf("?") != -1 ? "&" : "?") + c;
						c = ""
					}
					this.transId = Ext.lib.Ajax.request(a, b, g, c, e);
					return this.transId
				} else {
					Ext.callback(e.callback, e.scope, [e, null, null]);
					return null
				}
			},
			isLoading : function(a) {
				if (a) {
					return Ext.lib.Ajax.isCallInProgress(a)
				} else {
					return this.transId ? true : false
				}
			},
			abort : function(a) {
				if (a || this.isLoading()) {
					Ext.lib.Ajax.abort(a || this.transId)
				}
			},
			handleResponse : function(a) {
				this.transId = false;
				var b = a.argument.options;
				a.argument = b ? b.argument : null;
				this.fireEvent("requestcomplete", this, a, b);
				Ext.callback(b.success, b.scope, [a, b]);
				Ext.callback(b.callback, b.scope, [b, true, a])
			},
			handleFailure : function(a, c) {
				this.transId = false;
				var b = a.argument.options;
				a.argument = b ? b.argument : null;
				this.fireEvent("requestexception", this, a, b, c);
				Ext.callback(b.failure, b.scope, [a, b]);
				Ext.callback(b.callback, b.scope, [b, false, a])
			},
			doFormUpload : function(e, a, b) {
				var c = Ext.id();
				var g = document.createElement("iframe");
				g.id = c;
				g.name = c;
				g.className = "x-hidden";
				if (Ext.isIE) {
					g.src = Ext.SSL_SECURE_URL
				}
				document.body.appendChild(g);
				if (Ext.isIE) {
					document.frames[c].name = c
				}
				var d = Ext.getDom(e.form);
				d.target = c;
				d.method = "POST";
				d.enctype = d.encoding = "multipart/form-data";
				if (b) {
					d.action = b
				}
				var p, m;
				if (a) {
					p = [];
					a = Ext.urlDecode(a, false);
					for (var j in a) {
						if (a.hasOwnProperty(j)) {
							m = document.createElement("input");
							m.type = "hidden";
							m.name = j;
							m.value = a[j];
							d.appendChild(m);
							p.push(m)
						}
					}
				}
				function h() {
					var i = {
						responseText : "",
						responseXML : null
					};
					i.argument = e ? e.argument : null;
					try {
						var o;
						if (Ext.isIE) {
							o = g.contentWindow.document
						} else {
							o = (g.contentDocument || window.frames[c].document)
						}
						if (o && o.body) {
							i.responseText = o.body.innerHTML
						}
						if (o && o.XMLDocument) {
							i.responseXML = o.XMLDocument
						} else {
							i.responseXML = o
						}
					} catch (k) {
					}
					Ext.EventManager.removeListener(g, "load", h, this);
					this.fireEvent("requestcomplete", this, i, e);
					Ext.callback(e.success, e.scope, [i, e]);
					Ext.callback(e.callback, e.scope, [e, true, i]);
					setTimeout(function() {
								Ext.removeNode(g)
							}, 100)
				}
				Ext.EventManager.on(g, "load", h, this);
				d.submit();
				if (p) {
					for (var l = 0, n = p.length; l < n; l++) {
						Ext.removeNode(p[l])
					}
				}
			}
		});
Ext.Ajax = new Ext.data.Connection({
			autoAbort : false,
			serializeForm : function(a) {
				return Ext.lib.Ajax.serializeForm(a)
			}
		});
Ext.Updater = Ext.extend(Ext.util.Observable, {
			constructor : function(b, a) {
				b = Ext.get(b);
				if (!a && b.updateManager) {
					return b.updateManager
				}
				this.el = b;
				this.defaultUrl = null;
				this.addEvents("beforeupdate", "update", "failure");
				var c = Ext.Updater.defaults;
				this.sslBlankUrl = c.sslBlankUrl;
				this.disableCaching = c.disableCaching;
				this.indicatorText = c.indicatorText;
				this.showLoadIndicator = c.showLoadIndicator;
				this.timeout = c.timeout;
				this.loadScripts = c.loadScripts;
				this.transaction = null;
				this.refreshDelegate = this.refresh.createDelegate(this);
				this.updateDelegate = this.update.createDelegate(this);
				this.formUpdateDelegate = this.formUpdate.createDelegate(this);
				if (!this.renderer) {
					this.renderer = this.getDefaultRenderer()
				}
				Ext.Updater.superclass.constructor.call(this)
			},
			getDefaultRenderer : function() {
				return new Ext.Updater.BasicRenderer()
			},
			getEl : function() {
				return this.el
			},
			update : function(b, g, h, d) {
				if (this.fireEvent("beforeupdate", this.el, b, g) !== false) {
					var a, c;
					if (typeof b == "object") {
						a = b;
						b = a.url;
						g = g || a.params;
						h = h || a.callback;
						d = d || a.discardUrl;
						c = a.scope;
						if (typeof a.nocache != "undefined") {
							this.disableCaching = a.nocache
						}
						if (typeof a.text != "undefined") {
							this.indicatorText = '<div class="loading-indicator">'
									+ a.text + "</div>"
						}
						if (typeof a.scripts != "undefined") {
							this.loadScripts = a.scripts
						}
						if (typeof a.timeout != "undefined") {
							this.timeout = a.timeout
						}
					}
					this.showLoading();
					if (!d) {
						this.defaultUrl = b
					}
					if (typeof b == "function") {
						b = b.call(this)
					}
					var e = Ext.apply({}, {
								url : b,
								params : (typeof g == "function" && c) ? g
										.createDelegate(c) : g,
								success : this.processSuccess,
								failure : this.processFailure,
								scope : this,
								callback : undefined,
								timeout : (this.timeout * 1000),
								disableCaching : this.disableCaching,
								argument : {
									options : a,
									url : b,
									form : null,
									callback : h,
									scope : c || window,
									params : g
								}
							}, a);
					this.transaction = Ext.Ajax.request(e)
				}
			},
			formUpdate : function(c, a, b, d) {
				if (this.fireEvent("beforeupdate", this.el, c, a) !== false) {
					if (typeof a == "function") {
						a = a.call(this)
					}
					c = Ext.getDom(c);
					this.transaction = Ext.Ajax.request({
								form : c,
								url : a,
								success : this.processSuccess,
								failure : this.processFailure,
								scope : this,
								timeout : (this.timeout * 1000),
								argument : {
									url : a,
									form : c,
									callback : d,
									reset : b
								}
							});
					this.showLoading.defer(1, this)
				}
			},
			refresh : function(a) {
				if (this.defaultUrl == null) {
					return
				}
				this.update(this.defaultUrl, null, a, true)
			},
			startAutoRefresh : function(b, c, d, e, a) {
				if (a) {
					this.update(c || this.defaultUrl, d, e, true)
				}
				if (this.autoRefreshProcId) {
					clearInterval(this.autoRefreshProcId)
				}
				this.autoRefreshProcId = setInterval(this.update
								.createDelegate(this, [c || this.defaultUrl, d,
												e, true]), b * 1000)
			},
			stopAutoRefresh : function() {
				if (this.autoRefreshProcId) {
					clearInterval(this.autoRefreshProcId);
					delete this.autoRefreshProcId
				}
			},
			isAutoRefreshing : function() {
				return this.autoRefreshProcId ? true : false
			},
			showLoading : function() {
				if (this.showLoadIndicator) {
					this.el.update(this.indicatorText)
				}
			},
			processSuccess : function(a) {
				this.transaction = null;
				if (a.argument.form && a.argument.reset) {
					try {
						a.argument.form.reset()
					} catch (b) {
					}
				}
				if (this.loadScripts) {
					this.renderer.render(this.el, a, this, this.updateComplete
									.createDelegate(this, [a]))
				} else {
					this.renderer.render(this.el, a, this);
					this.updateComplete(a)
				}
			},
			updateComplete : function(a) {
				this.fireEvent("update", this.el, a);
				if (typeof a.argument.callback == "function") {
					a.argument.callback.call(a.argument.scope, this.el, true,
							a, a.argument.options)
				}
			},
			processFailure : function(a) {
				this.transaction = null;
				this.fireEvent("failure", this.el, a);
				if (typeof a.argument.callback == "function") {
					a.argument.callback.call(a.argument.scope, this.el, false,
							a, a.argument.options)
				}
			},
			setRenderer : function(a) {
				this.renderer = a
			},
			getRenderer : function() {
				return this.renderer
			},
			setDefaultUrl : function(a) {
				this.defaultUrl = a
			},
			abort : function() {
				if (this.transaction) {
					Ext.Ajax.abort(this.transaction)
				}
			},
			isUpdating : function() {
				if (this.transaction) {
					return Ext.Ajax.isLoading(this.transaction)
				}
				return false
			}
		});
Ext.Updater.defaults = {
	timeout : 30,
	loadScripts : false,
	sslBlankUrl : (Ext.SSL_SECURE_URL || "javascript:false"),
	disableCaching : false,
	showLoadIndicator : true,
	indicatorText : '<div class="loading-indicator">Loading...</div>'
};
Ext.Updater.updateElement = function(d, c, e, b) {
	var a = Ext.get(d).getUpdater();
	Ext.apply(a, b);
	a.update(c, e, b ? b.callback : null)
};
Ext.Updater.BasicRenderer = function() {
};
Ext.Updater.BasicRenderer.prototype = {
	render : function(c, a, b, d) {
		c.update(a.responseText, b.loadScripts, d)
	}
};
Ext.UpdateManager = Ext.Updater;
Ext.util.DelayedTask = function(g, e, a) {
	var i = null, h, b;
	var c = function() {
		var d = new Date().getTime();
		if (d - b >= h) {
			clearInterval(i);
			i = null;
			g.apply(e, a || [])
		}
	};
	this.delay = function(j, l, k, d) {
		if (i && j != h) {
			this.cancel()
		}
		h = j;
		b = new Date().getTime();
		g = l || g;
		e = k || e;
		a = d || a;
		if (!i) {
			i = setInterval(c, h)
		}
	};
	this.cancel = function() {
		if (i) {
			clearInterval(i);
			i = null
		}
	}
};