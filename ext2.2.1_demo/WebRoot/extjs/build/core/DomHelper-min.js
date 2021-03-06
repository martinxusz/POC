Ext.DomHelper = function() {
	var l = null;
	var f = /^(?:br|frame|hr|img|input|link|meta|range|spacer|wbr|area|param|col)$/i;
	var b = /^table|tbody|tr|td$/i;
	var a = function(v) {
		if (typeof v == "string") {
			return v
		}
		var p = "";
		if (Ext.isArray(v)) {
			for (var t = 0, q = v.length; t < q; t++) {
				p += a(v[t])
			}
			return p
		}
		if (!v.tag) {
			v.tag = "div"
		}
		p += "<" + v.tag;
		for (var n in v) {
			if (n == "tag" || n == "children" || n == "cn" || n == "html"
					|| typeof v[n] == "function") {
				continue
			}
			if (n == "style") {
				var u = v.style;
				if (typeof u == "function") {
					u = u.call()
				}
				if (typeof u == "string") {
					p += ' style="' + u + '"'
				} else {
					if (typeof u == "object") {
						p += ' style="';
						for (var r in u) {
							if (typeof u[r] != "function") {
								p += r + ":" + u[r] + ";"
							}
						}
						p += '"'
					}
				}
			} else {
				if (n == "cls") {
					p += ' class="' + v.cls + '"'
				} else {
					if (n == "htmlFor") {
						p += ' for="' + v.htmlFor + '"'
					} else {
						p += " " + n + '="' + v[n] + '"'
					}
				}
			}
		}
		if (f.test(v.tag)) {
			p += "/>"
		} else {
			p += ">";
			var w = v.children || v.cn;
			if (w) {
				p += a(w)
			} else {
				if (v.html) {
					p += v.html
				}
			}
			p += "</" + v.tag + ">"
		}
		return p
	};
	var m = function(u, p) {
		var t;
		if (Ext.isArray(u)) {
			t = document.createDocumentFragment();
			for (var s = 0, q = u.length; s < q; s++) {
				m(u[s], t)
			}
		} else {
			if (typeof u == "string") {
				t = document.createTextNode(u)
			} else {
				t = document.createElement(u.tag || "div");
				var r = !!t.setAttribute;
				for (var n in u) {
					if (n == "tag" || n == "children" || n == "cn"
							|| n == "html" || n == "style"
							|| typeof u[n] == "function") {
						continue
					}
					if (n == "cls") {
						t.className = u.cls
					} else {
						if (r) {
							t.setAttribute(n, u[n])
						} else {
							t[n] = u[n]
						}
					}
				}
				Ext.DomHelper.applyStyles(t, u.style);
				var v = u.children || u.cn;
				if (v) {
					m(v, t)
				} else {
					if (u.html) {
						t.innerHTML = u.html
					}
				}
			}
		}
		if (p) {
			p.appendChild(t)
		}
		return t
	};
	var i = function(t, q, p, r) {
		l.innerHTML = [q, p, r].join("");
		var n = -1, o = l;
		while (++n < t) {
			o = o.firstChild
		}
		return o
	};
	var j = "<table>", e = "</table>", c = j + "<tbody>", k = "</tbody>" + e, h = c
			+ "<tr>", d = "</tr>" + k;
	var g = function(n, o, q, p) {
		if (!l) {
			l = document.createElement("div")
		}
		var r;
		var s = null;
		if (n == "td") {
			if (o == "afterbegin" || o == "beforeend") {
				return
			}
			if (o == "beforebegin") {
				s = q;
				q = q.parentNode
			} else {
				s = q.nextSibling;
				q = q.parentNode
			}
			r = i(4, h, p, d)
		} else {
			if (n == "tr") {
				if (o == "beforebegin") {
					s = q;
					q = q.parentNode;
					r = i(3, c, p, k)
				} else {
					if (o == "afterend") {
						s = q.nextSibling;
						q = q.parentNode;
						r = i(3, c, p, k)
					} else {
						if (o == "afterbegin") {
							s = q.firstChild
						}
						r = i(4, h, p, d)
					}
				}
			} else {
				if (n == "tbody") {
					if (o == "beforebegin") {
						s = q;
						q = q.parentNode;
						r = i(2, j, p, e)
					} else {
						if (o == "afterend") {
							s = q.nextSibling;
							q = q.parentNode;
							r = i(2, j, p, e)
						} else {
							if (o == "afterbegin") {
								s = q.firstChild
							}
							r = i(3, c, p, k)
						}
					}
				} else {
					if (o == "beforebegin" || o == "afterend") {
						return
					}
					if (o == "afterbegin") {
						s = q.firstChild
					}
					r = i(2, j, p, e)
				}
			}
		}
		q.insertBefore(r, s);
		return r
	};
	return {
		useDom : false,
		markup : function(n) {
			return a(n)
		},
		applyStyles : function(p, q) {
			if (q) {
				p = Ext.fly(p);
				if (typeof q == "string") {
					var o = /\s?([a-z\-]*)\:\s?([^;]*);?/gi;
					var r;
					while ((r = o.exec(q)) != null) {
						p.setStyle(r[1], r[2])
					}
				} else {
					if (typeof q == "object") {
						for (var n in q) {
							p.setStyle(n, q[n])
						}
					} else {
						if (typeof q == "function") {
							Ext.DomHelper.applyStyles(p, q.call())
						}
					}
				}
			}
		},
		insertHtml : function(p, r, q) {
			p = p.toLowerCase();
			if (r.insertAdjacentHTML) {
				if (b.test(r.tagName)) {
					var o;
					if (o = g(r.tagName.toLowerCase(), p, r, q)) {
						return o
					}
				}
				switch (p) {
					case "beforebegin" :
						r.insertAdjacentHTML("BeforeBegin", q);
						return r.previousSibling;
					case "afterbegin" :
						r.insertAdjacentHTML("AfterBegin", q);
						return r.firstChild;
					case "beforeend" :
						r.insertAdjacentHTML("BeforeEnd", q);
						return r.lastChild;
					case "afterend" :
						r.insertAdjacentHTML("AfterEnd", q);
						return r.nextSibling
				}
				throw 'Illegal insertion point -> "' + p + '"'
			}
			var n = r.ownerDocument.createRange();
			var s;
			switch (p) {
				case "beforebegin" :
					n.setStartBefore(r);
					s = n.createContextualFragment(q);
					r.parentNode.insertBefore(s, r);
					return r.previousSibling;
				case "afterbegin" :
					if (r.firstChild) {
						n.setStartBefore(r.firstChild);
						s = n.createContextualFragment(q);
						r.insertBefore(s, r.firstChild);
						return r.firstChild
					} else {
						r.innerHTML = q;
						return r.firstChild
					}
				case "beforeend" :
					if (r.lastChild) {
						n.setStartAfter(r.lastChild);
						s = n.createContextualFragment(q);
						r.appendChild(s);
						return r.lastChild
					} else {
						r.innerHTML = q;
						return r.lastChild
					}
				case "afterend" :
					n.setStartAfter(r);
					s = n.createContextualFragment(q);
					r.parentNode.insertBefore(s, r.nextSibling);
					return r.nextSibling
			}
			throw 'Illegal insertion point -> "' + p + '"'
		},
		insertBefore : function(n, q, p) {
			return this.doInsert(n, q, p, "beforeBegin")
		},
		insertAfter : function(n, q, p) {
			return this.doInsert(n, q, p, "afterEnd", "nextSibling")
		},
		insertFirst : function(n, q, p) {
			return this.doInsert(n, q, p, "afterBegin", "firstChild")
		},
		doInsert : function(r, t, s, u, q) {
			r = Ext.getDom(r);
			var p;
			if (this.useDom) {
				p = m(t, null);
				(q === "firstChild" ? r : r.parentNode).insertBefore(p, q
								? r[q]
								: r)
			} else {
				var n = a(t);
				p = this.insertHtml(u, r, n)
			}
			return s ? Ext.get(p, true) : p
		},
		append : function(q, s, r) {
			q = Ext.getDom(q);
			var p;
			if (this.useDom) {
				p = m(s, null);
				q.appendChild(p)
			} else {
				var n = a(s);
				p = this.insertHtml("beforeEnd", q, n)
			}
			return r ? Ext.get(p, true) : p
		},
		overwrite : function(n, q, p) {
			n = Ext.getDom(n);
			n.innerHTML = a(q);
			return p ? Ext.get(n.firstChild, true) : n.firstChild
		},
		createTemplate : function(p) {
			var n = a(p);
			return new Ext.Template(n)
		}
	}
}();