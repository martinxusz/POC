if (typeof jQuery == "undefined") {
	throw "Unable to load Ext, jQuery not found."
}
(function() {
	var b;
	Ext.lib.Dom = {
		getViewWidth : function(d) {
			return d ? Math.max(jQuery(document).width(), jQuery(window)
							.width()) : jQuery(window).width()
		},
		getViewHeight : function(d) {
			return d ? Math.max(jQuery(document).height(), jQuery(window)
							.height()) : jQuery(window).height()
		},
		isAncestor : function(e, f) {
			e = Ext.getDom(e);
			f = Ext.getDom(f);
			if (!e || !f) {
				return false
			}
			if (e.contains && !Ext.isSafari) {
				return e.contains(f)
			} else {
				if (e.compareDocumentPosition) {
					return !!(e.compareDocumentPosition(f) & 16)
				} else {
					var d = f.parentNode;
					while (d) {
						if (d == e) {
							return true
						} else {
							if (!d.tagName || d.tagName.toUpperCase() == "HTML") {
								return false
							}
						}
						d = d.parentNode
					}
					return false
				}
			}
		},
		getRegion : function(d) {
			return Ext.lib.Region.getRegion(d)
		},
		getY : function(d) {
			return this.getXY(d)[1]
		},
		getX : function(d) {
			return this.getXY(d)[0]
		},
		getXY : function(f) {
			var e, j, l, m, i = (document.body || document.documentElement);
			f = Ext.getDom(f);
			if (f == i) {
				return [0, 0]
			}
			if (f.getBoundingClientRect) {
				l = f.getBoundingClientRect();
				m = c(document).getScroll();
				return [l.left + m.left, l.top + m.top]
			}
			var n = 0, k = 0;
			e = f;
			var d = c(f).getStyle("position") == "absolute";
			while (e) {
				n += e.offsetLeft;
				k += e.offsetTop;
				if (!d && c(e).getStyle("position") == "absolute") {
					d = true
				}
				if (Ext.isGecko) {
					j = c(e);
					var o = parseInt(j.getStyle("borderTopWidth"), 10) || 0;
					var g = parseInt(j.getStyle("borderLeftWidth"), 10) || 0;
					n += g;
					k += o;
					if (e != f && j.getStyle("overflow") != "visible") {
						n += g;
						k += o
					}
				}
				e = e.offsetParent
			}
			if (Ext.isSafari && d) {
				n -= i.offsetLeft;
				k -= i.offsetTop
			}
			if (Ext.isGecko && !d) {
				var h = c(i);
				n += parseInt(h.getStyle("borderLeftWidth"), 10) || 0;
				k += parseInt(h.getStyle("borderTopWidth"), 10) || 0
			}
			e = f.parentNode;
			while (e && e != i) {
				if (!Ext.isOpera
						|| (e.tagName != "TR" && c(e).getStyle("display") != "inline")) {
					n -= e.scrollLeft;
					k -= e.scrollTop
				}
				e = e.parentNode
			}
			return [n, k]
		},
		setXY : function(d, e) {
			d = Ext.fly(d, "_setXY");
			d.position();
			var f = d.translatePoints(e);
			if (e[0] !== false) {
				d.dom.style.left = f.left + "px"
			}
			if (e[1] !== false) {
				d.dom.style.top = f.top + "px"
			}
		},
		setX : function(e, d) {
			this.setXY(e, [d, false])
		},
		setY : function(d, e) {
			this.setXY(d, [false, e])
		}
	};
	function c(d) {
		if (!b) {
			b = new Ext.Element.Flyweight()
		}
		b.dom = d;
		return b
	}
	Ext.lib.Event = {
		getPageX : function(d) {
			d = d.browserEvent || d;
			return d.pageX
		},
		getPageY : function(d) {
			d = d.browserEvent || d;
			return d.pageY
		},
		getXY : function(d) {
			d = d.browserEvent || d;
			return [d.pageX, d.pageY]
		},
		getTarget : function(d) {
			return d.target
		},
		on : function(h, d, g, f, e) {
			jQuery(h).bind(d, g)
		},
		un : function(f, d, e) {
			jQuery(f).unbind(d, e)
		},
		purgeElement : function(d) {
			jQuery(d).unbind()
		},
		preventDefault : function(d) {
			d = d.browserEvent || d;
			if (d.preventDefault) {
				d.preventDefault()
			} else {
				d.returnValue = false
			}
		},
		stopPropagation : function(d) {
			d = d.browserEvent || d;
			if (d.stopPropagation) {
				d.stopPropagation()
			} else {
				d.cancelBubble = true
			}
		},
		stopEvent : function(d) {
			this.preventDefault(d);
			this.stopPropagation(d)
		},
		onAvailable : function(j, e, d) {
			var i = new Date();
			var g = function() {
				if (i.getElapsed() > 10000) {
					clearInterval(h)
				}
				var f = document.getElementById(j);
				if (f) {
					clearInterval(h);
					e.call(d || window, f)
				}
			};
			var h = setInterval(g, 50)
		},
		resolveTextNode : function(d) {
			if (d && 3 == d.nodeType) {
				return d.parentNode
			} else {
				return d
			}
		},
		getRelatedTarget : function(e) {
			e = e.browserEvent || e;
			var d = e.relatedTarget;
			if (!d) {
				if (e.type == "mouseout") {
					d = e.toElement
				} else {
					if (e.type == "mouseover") {
						d = e.fromElement
					}
				}
			}
			return this.resolveTextNode(d)
		}
	};
	Ext.lib.Ajax = function() {
		var d = function(e) {
			return function(g, f) {
				if ((f == "error" || f == "timeout") && e.failure) {
					e.failure.call(e.scope || window, {
								responseText : g.responseText,
								responseXML : g.responseXML,
								argument : e.argument
							})
				} else {
					if (e.success) {
						e.success.call(e.scope || window, {
									responseText : g.responseText,
									responseXML : g.responseXML,
									argument : e.argument
								})
					}
				}
			}
		};
		return {
			request : function(k, h, e, i, f) {
				var j = {
					type : k,
					url : h,
					data : i,
					timeout : e.timeout,
					complete : d(e)
				};
				if (f) {
					var g = f.headers;
					if (f.xmlData) {
						j.data = f.xmlData;
						j.processData = false;
						j.type = (k ? k : (f.method ? f.method : "POST"));
						if (!g || !g["Content-Type"]) {
							j.contentType = "text/xml"
						}
					} else {
						if (f.jsonData) {
							j.data = typeof f.jsonData == "object" ? Ext
									.encode(f.jsonData) : f.jsonData;
							j.processData = false;
							j.type = (k ? k : (f.method ? f.method : "POST"));
							if (!g || !g["Content-Type"]) {
								j.contentType = "application/json"
							}
						}
					}
					if (g) {
						j.beforeSend = function(m) {
							for (var l in g) {
								if (g.hasOwnProperty(l)) {
									m.setRequestHeader(l, g[l])
								}
							}
						}
					}
				}
				jQuery.ajax(j)
			},
			formRequest : function(i, h, f, j, e, g) {
				jQuery.ajax({
							type : Ext.getDom(i).method || "POST",
							url : h,
							data : jQuery(i).serialize() + (j ? "&" + j : ""),
							timeout : f.timeout,
							complete : d(f)
						})
			},
			isCallInProgress : function(e) {
				return false
			},
			abort : function(e) {
				return false
			},
			serializeForm : function(e) {
				return jQuery(e.dom || e).serialize()
			}
		}
	}();
	Ext.lib.Anim = function() {
		var d = function(e, f) {
			var g = true;
			return {
				stop : function(h) {
				},
				isAnimated : function() {
					return g
				},
				proxyCallback : function() {
					g = false;
					Ext.callback(e, f)
				}
			}
		};
		return {
			scroll : function(h, f, j, k, e, g) {
				var i = d(e, g);
				h = Ext.getDom(h);
				if (typeof f.scroll.to[0] == "number") {
					h.scrollLeft = f.scroll.to[0]
				}
				if (typeof f.scroll.to[1] == "number") {
					h.scrollTop = f.scroll.to[1]
				}
				i.proxyCallback();
				return i
			},
			motion : function(h, f, i, j, e, g) {
				return this.run(h, f, i, j, e, g)
			},
			color : function(h, f, j, k, e, g) {
				var i = d(e, g);
				i.proxyCallback();
				return i
			},
			run : function(g, q, j, p, h, s, r) {
				var l = d(h, s), m = Ext.fly(g, "_animrun");
				var f = {};
				for (var i in q) {
					if (q[i].from) {
						if (i != "points") {
							m.setStyle(i, q[i].from)
						}
					}
					switch (i) {
						case "points" :
							var n, u;
							m.position();
							if (n = q.points.by) {
								var t = m.getXY();
								u = m
										.translatePoints([t[0] + n[0],
												t[1] + n[1]])
							} else {
								u = m.translatePoints(q.points.to)
							}
							f.left = u.left;
							f.top = u.top;
							if (!parseInt(m.getStyle("left"), 10)) {
								m.setLeft(0)
							}
							if (!parseInt(m.getStyle("top"), 10)) {
								m.setTop(0)
							}
							if (q.points.from) {
								m.setXY(q.points.from)
							}
							break;
						case "width" :
							f.width = q.width.to;
							break;
						case "height" :
							f.height = q.height.to;
							break;
						case "opacity" :
							f.opacity = q.opacity.to;
							break;
						case "left" :
							f.left = q.left.to;
							break;
						case "top" :
							f.top = q.top.to;
							break;
						default :
							f[i] = q[i].to;
							break
					}
				}
				jQuery(g).animate(f, j * 1000, undefined, l.proxyCallback);
				return l
			}
		}
	}();
	Ext.lib.Region = function(f, g, d, e) {
		this.top = f;
		this[1] = f;
		this.right = g;
		this.bottom = d;
		this.left = e;
		this[0] = e
	};
	Ext.lib.Region.prototype = {
		contains : function(d) {
			return (d.left >= this.left && d.right <= this.right
					&& d.top >= this.top && d.bottom <= this.bottom)
		},
		getArea : function() {
			return ((this.bottom - this.top) * (this.right - this.left))
		},
		intersect : function(h) {
			var f = Math.max(this.top, h.top);
			var g = Math.min(this.right, h.right);
			var d = Math.min(this.bottom, h.bottom);
			var e = Math.max(this.left, h.left);
			if (d >= f && g >= e) {
				return new Ext.lib.Region(f, g, d, e)
			} else {
				return null
			}
		},
		union : function(h) {
			var f = Math.min(this.top, h.top);
			var g = Math.max(this.right, h.right);
			var d = Math.max(this.bottom, h.bottom);
			var e = Math.min(this.left, h.left);
			return new Ext.lib.Region(f, g, d, e)
		},
		constrainTo : function(d) {
			this.top = this.top.constrain(d.top, d.bottom);
			this.bottom = this.bottom.constrain(d.top, d.bottom);
			this.left = this.left.constrain(d.left, d.right);
			this.right = this.right.constrain(d.left, d.right);
			return this
		},
		adjust : function(f, e, d, g) {
			this.top += f;
			this.left += e;
			this.right += g;
			this.bottom += d;
			return this
		}
	};
	Ext.lib.Region.getRegion = function(g) {
		var i = Ext.lib.Dom.getXY(g);
		var f = i[1];
		var h = i[0] + g.offsetWidth;
		var d = i[1] + g.offsetHeight;
		var e = i[0];
		return new Ext.lib.Region(f, h, d, e)
	};
	Ext.lib.Point = function(d, e) {
		if (Ext.isArray(d)) {
			e = d[1];
			d = d[0]
		}
		this.x = this.right = this.left = this[0] = d;
		this.y = this.top = this.bottom = this[1] = e
	};
	Ext.lib.Point.prototype = new Ext.lib.Region();
	if (Ext.isIE) {
		function a() {
			var d = Function.prototype;
			delete d.createSequence;
			delete d.defer;
			delete d.createDelegate;
			delete d.createCallback;
			delete d.createInterceptor;
			window.detachEvent("onunload", a)
		}
		window.attachEvent("onunload", a)
	}
})();