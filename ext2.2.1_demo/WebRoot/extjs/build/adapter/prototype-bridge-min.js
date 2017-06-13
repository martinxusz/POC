(function() {
	var b;
	Ext.lib.Dom = {
		getViewWidth : function(d) {
			return d ? this.getDocumentWidth() : this.getViewportWidth()
		},
		getViewHeight : function(d) {
			return d ? this.getDocumentHeight() : this.getViewportHeight()
		},
		getDocumentHeight : function() {
			var d = (document.compatMode != "CSS1Compat")
					? document.body.scrollHeight
					: document.documentElement.scrollHeight;
			return Math.max(d, this.getViewportHeight())
		},
		getDocumentWidth : function() {
			var d = (document.compatMode != "CSS1Compat")
					? document.body.scrollWidth
					: document.documentElement.scrollWidth;
			return Math.max(d, this.getViewportWidth())
		},
		getViewportHeight : function() {
			var d = self.innerHeight;
			var e = document.compatMode;
			if ((e || Ext.isIE) && !Ext.isOpera) {
				d = (e == "CSS1Compat")
						? document.documentElement.clientHeight
						: document.body.clientHeight
			}
			return d
		},
		getViewportWidth : function() {
			var d = self.innerWidth;
			var e = document.compatMode;
			if (e || Ext.isIE) {
				d = (e == "CSS1Compat")
						? document.documentElement.clientWidth
						: document.body.clientWidth
			}
			return d
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
	Ext.lib.Event = {
		getPageX : function(d) {
			return Event.pointerX(d.browserEvent || d)
		},
		getPageY : function(d) {
			return Event.pointerY(d.browserEvent || d)
		},
		getXY : function(d) {
			d = d.browserEvent || d;
			return [Event.pointerX(d), Event.pointerY(d)]
		},
		getTarget : function(d) {
			return Event.element(d.browserEvent || d)
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
		},
		on : function(f, d, e) {
			Event.observe(f, d, e, false)
		},
		un : function(f, d, e) {
			Event.stopObserving(f, d, e, false)
		},
		purgeElement : function(d) {
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
			Event.stop(d.browserEvent || d)
		},
		onAvailable : function(j, e, d) {
			var i = new Date(), h;
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
			h = setInterval(g, 50)
		}
	};
	Ext.lib.Ajax = function() {
		var e = function(f) {
			return f.success ? function(g) {
				f.success.call(f.scope || window, {
							responseText : g.responseText,
							responseXML : g.responseXML,
							argument : f.argument
						})
			} : Ext.emptyFn
		};
		var d = function(f) {
			return f.failure ? function(g) {
				f.failure.call(f.scope || window, {
							responseText : g.responseText,
							responseXML : g.responseXML,
							argument : f.argument
						})
			} : Ext.emptyFn
		};
		return {
			request : function(l, i, f, j, g) {
				var k = {
					method : l,
					parameters : j || "",
					timeout : f.timeout,
					onSuccess : e(f),
					onFailure : d(f)
				};
				if (g) {
					var h = g.headers;
					if (h) {
						k.requestHeaders = h
					}
					if (g.xmlData) {
						l = (l ? l : (g.method ? g.method : "POST"));
						if (!h || !h["Content-Type"]) {
							k.contentType = "text/xml"
						}
						k.postBody = g.xmlData;
						delete k.parameters
					}
					if (g.jsonData) {
						l = (l ? l : (g.method ? g.method : "POST"));
						if (!h || !h["Content-Type"]) {
							k.contentType = "application/json"
						}
						k.postBody = typeof g.jsonData == "object" ? Ext
								.encode(g.jsonData) : g.jsonData;
						delete k.parameters
					}
				}
				new Ajax.Request(i, k)
			},
			formRequest : function(j, i, g, k, f, h) {
				new Ajax.Request(i, {
							method : Ext.getDom(j).method || "POST",
							parameters : Form.serialize(j) + (k ? "&" + k : ""),
							timeout : g.timeout,
							onSuccess : e(g),
							onFailure : d(g)
						})
			},
			isCallInProgress : function(f) {
				return false
			},
			abort : function(f) {
				return false
			},
			serializeForm : function(f) {
				return Form.serialize(f.dom || f)
			}
		}
	}();
	Ext.lib.Anim = function() {
		var d = {
			easeOut : function(f) {
				return 1 - Math.pow(1 - f, 2)
			},
			easeIn : function(f) {
				return 1 - Math.pow(1 - f, 2)
			}
		};
		var e = function(f, g) {
			return {
				stop : function(h) {
					this.effect.cancel()
				},
				isAnimated : function() {
					return this.effect.state == "running"
				},
				proxyCallback : function() {
					Ext.callback(f, g)
				}
			}
		};
		return {
			scroll : function(i, g, k, l, f, h) {
				var j = e(f, h);
				i = Ext.getDom(i);
				if (typeof g.scroll.to[0] == "number") {
					i.scrollLeft = g.scroll.to[0]
				}
				if (typeof g.scroll.to[1] == "number") {
					i.scrollTop = g.scroll.to[1]
				}
				j.proxyCallback();
				return j
			},
			motion : function(i, g, j, k, f, h) {
				return this.run(i, g, j, k, f, h)
			},
			color : function(i, g, j, k, f, h) {
				return this.run(i, g, j, k, f, h)
			},
			run : function(g, q, l, p, h, s, r) {
				var f = {};
				for (var j in q) {
					switch (j) {
						case "points" :
							var n, u, m = Ext.fly(g, "_animrun");
							m.position();
							if (n = q.points.by) {
								var t = m.getXY();
								u = m
										.translatePoints([t[0] + n[0],
												t[1] + n[1]])
							} else {
								u = m.translatePoints(q.points.to)
							}
							f.left = u.left + "px";
							f.top = u.top + "px";
							break;
						case "width" :
							f.width = q.width.to + "px";
							break;
						case "height" :
							f.height = q.height.to + "px";
							break;
						case "opacity" :
							f.opacity = String(q.opacity.to);
							break;
						default :
							f[j] = String(q[j].to);
							break
					}
				}
				var i = e(h, s);
				i.effect = new Effect.Morph(Ext.id(g), {
							duration : l,
							afterFinish : i.proxyCallback,
							transition : d[p] || Effect.Transitions.linear,
							style : f
						});
				return i
			}
		}
	}();
	function c(d) {
		if (!b) {
			b = new Ext.Element.Flyweight()
		}
		b.dom = d;
		return b
	}
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