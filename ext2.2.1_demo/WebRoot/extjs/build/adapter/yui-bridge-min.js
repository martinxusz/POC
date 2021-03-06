if (typeof YAHOO == "undefined") {
	throw "Unable to load Ext, core YUI utilities (yahoo, dom, event) not found."
}
(function() {
	var f = YAHOO.util.Event;
	var g = YAHOO.util.Dom;
	var b = YAHOO.util.Connect;
	var h = YAHOO.util.Easing;
	var a = YAHOO.util.Anim;
	var d;
	Ext.lib.Dom = {
		getViewWidth : function(i) {
			return i ? g.getDocumentWidth() : g.getViewportWidth()
		},
		getViewHeight : function(i) {
			return i ? g.getDocumentHeight() : g.getViewportHeight()
		},
		isAncestor : function(i, j) {
			return g.isAncestor(i, j)
		},
		getRegion : function(i) {
			return g.getRegion(i)
		},
		getY : function(i) {
			return this.getXY(i)[1]
		},
		getX : function(i) {
			return this.getXY(i)[0]
		},
		getXY : function(k) {
			var j, o, r, s, n = (document.body || document.documentElement);
			k = Ext.getDom(k);
			if (k == n) {
				return [0, 0]
			}
			if (k.getBoundingClientRect) {
				r = k.getBoundingClientRect();
				s = e(document).getScroll();
				return [r.left + s.left, r.top + s.top]
			}
			var t = 0, q = 0;
			j = k;
			var i = e(k).getStyle("position") == "absolute";
			while (j) {
				t += j.offsetLeft;
				q += j.offsetTop;
				if (!i && e(j).getStyle("position") == "absolute") {
					i = true
				}
				if (Ext.isGecko) {
					o = e(j);
					var u = parseInt(o.getStyle("borderTopWidth"), 10) || 0;
					var l = parseInt(o.getStyle("borderLeftWidth"), 10) || 0;
					t += l;
					q += u;
					if (j != k && o.getStyle("overflow") != "visible") {
						t += l;
						q += u
					}
				}
				j = j.offsetParent
			}
			if (Ext.isSafari && i) {
				t -= n.offsetLeft;
				q -= n.offsetTop
			}
			if (Ext.isGecko && !i) {
				var m = e(n);
				t += parseInt(m.getStyle("borderLeftWidth"), 10) || 0;
				q += parseInt(m.getStyle("borderTopWidth"), 10) || 0
			}
			j = k.parentNode;
			while (j && j != n) {
				if (!Ext.isOpera
						|| (j.tagName != "TR" && e(j).getStyle("display") != "inline")) {
					t -= j.scrollLeft;
					q -= j.scrollTop
				}
				j = j.parentNode
			}
			return [t, q]
		},
		setXY : function(i, j) {
			i = Ext.fly(i, "_setXY");
			i.position();
			var k = i.translatePoints(j);
			if (j[0] !== false) {
				i.dom.style.left = k.left + "px"
			}
			if (j[1] !== false) {
				i.dom.style.top = k.top + "px"
			}
		},
		setX : function(j, i) {
			this.setXY(j, [i, false])
		},
		setY : function(i, j) {
			this.setXY(i, [false, j])
		}
	};
	Ext.lib.Event = {
		getPageX : function(i) {
			return f.getPageX(i.browserEvent || i)
		},
		getPageY : function(i) {
			return f.getPageY(i.browserEvent || i)
		},
		getXY : function(i) {
			return f.getXY(i.browserEvent || i)
		},
		getTarget : function(i) {
			return f.getTarget(i.browserEvent || i)
		},
		getRelatedTarget : function(i) {
			return f.getRelatedTarget(i.browserEvent || i)
		},
		on : function(m, i, l, k, j) {
			f.on(m, i, l, k, j)
		},
		un : function(k, i, j) {
			f.removeListener(k, i, j)
		},
		purgeElement : function(i) {
			f.purgeElement(i)
		},
		preventDefault : function(i) {
			f.preventDefault(i.browserEvent || i)
		},
		stopPropagation : function(i) {
			f.stopPropagation(i.browserEvent || i)
		},
		stopEvent : function(i) {
			f.stopEvent(i.browserEvent || i)
		},
		onAvailable : function(l, k, j, i) {
			return f.onAvailable(l, k, j, i)
		}
	};
	Ext.lib.Ajax = {
		request : function(o, m, i, n, j) {
			if (j) {
				var k = j.headers;
				if (k) {
					for (var l in k) {
						if (k.hasOwnProperty(l)) {
							b.initHeader(l, k[l], false)
						}
					}
				}
				if (j.xmlData) {
					if (!k || !k["Content-Type"]) {
						b.initHeader("Content-Type", "text/xml", false)
					}
					o = (o ? o : (j.method ? j.method : "POST"));
					n = j.xmlData
				} else {
					if (j.jsonData) {
						if (!k || !k["Content-Type"]) {
							b.initHeader("Content-Type", "application/json",
									false)
						}
						o = (o ? o : (j.method ? j.method : "POST"));
						n = typeof j.jsonData == "object" ? Ext
								.encode(j.jsonData) : j.jsonData
					}
				}
			}
			return b.asyncRequest(o, m, i, n)
		},
		formRequest : function(m, l, j, n, i, k) {
			b.setForm(m, i, k);
			return b.asyncRequest(Ext.getDom(m).method || "POST", l, j, n)
		},
		isCallInProgress : function(i) {
			return b.isCallInProgress(i)
		},
		abort : function(i) {
			return b.abort(i)
		},
		serializeForm : function(i) {
			var j = b.setForm(i.dom || i);
			b.resetFormState();
			return j
		}
	};
	Ext.lib.Region = YAHOO.util.Region;
	Ext.lib.Point = YAHOO.util.Point;
	Ext.lib.Anim = {
		scroll : function(l, j, m, n, i, k) {
			this.run(l, j, m, n, i, k, YAHOO.util.Scroll)
		},
		motion : function(l, j, m, n, i, k) {
			this.run(l, j, m, n, i, k, YAHOO.util.Motion)
		},
		color : function(l, j, m, n, i, k) {
			this.run(l, j, m, n, i, k, YAHOO.util.ColorAnim)
		},
		run : function(m, j, o, p, i, l, k) {
			k = k || YAHOO.util.Anim;
			if (typeof p == "string") {
				p = YAHOO.util.Easing[p]
			}
			var n = new k(m, j, o, p);
			n.animateX(function() {
						Ext.callback(i, l)
					});
			return n
		}
	};
	function e(i) {
		if (!d) {
			d = new Ext.Element.Flyweight()
		}
		d.dom = i;
		return d
	}
	if (Ext.isIE) {
		function c() {
			var i = Function.prototype;
			delete i.createSequence;
			delete i.defer;
			delete i.createDelegate;
			delete i.createCallback;
			delete i.createInterceptor;
			window.detachEvent("onunload", c)
		}
		window.attachEvent("onunload", c)
	}
	if (YAHOO.util.Anim) {
		YAHOO.util.Anim.prototype.animateX = function(k, i) {
			var j = function() {
				this.onComplete.unsubscribe(j);
				if (typeof k == "function") {
					k.call(i || this, this)
				}
			};
			this.onComplete.subscribe(j, this, true);
			this.animate()
		}
	}
	if (YAHOO.util.DragDrop && Ext.dd.DragDrop) {
		YAHOO.util.DragDrop.defaultPadding = Ext.dd.DragDrop.defaultPadding;
		YAHOO.util.DragDrop.constrainTo = Ext.dd.DragDrop.constrainTo
	}
	YAHOO.util.Dom.getXY = function(i) {
		var j = function(k) {
			return Ext.lib.Dom.getXY(k)
		};
		return YAHOO.util.Dom.batch(i, j, YAHOO.util.Dom, true)
	};
	if (YAHOO.util.AnimMgr) {
		YAHOO.util.AnimMgr.fps = 1000
	}
	YAHOO.util.Region.prototype.adjust = function(k, j, i, m) {
		this.top += k;
		this.left += j;
		this.right += m;
		this.bottom += i;
		return this
	};
	YAHOO.util.Region.prototype.constrainTo = function(i) {
		this.top = this.top.constrain(i.top, i.bottom);
		this.bottom = this.bottom.constrain(i.top, i.bottom);
		this.left = this.left.constrain(i.left, i.right);
		this.right = this.right.constrain(i.left, i.right);
		return this
	}
})();