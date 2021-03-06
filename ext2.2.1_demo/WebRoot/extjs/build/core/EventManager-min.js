Ext.EventManager = function() {
	var v, o, k = false;
	var l, u, f, q;
	var n = Ext.lib.Event;
	var p = Ext.lib.Dom;
	var a = "Ext";
	var h = {};
	var m = function(B, x, A, z, y) {
		var D = Ext.id(B);
		if (!h[D]) {
			h[D] = {}
		}
		var C = h[D];
		if (!C[x]) {
			C[x] = []
		}
		var w = C[x];
		w.push({
					id : D,
					ename : x,
					fn : A,
					wrap : z,
					scope : y
				});
		n.on(B, x, z);
		if (x == "mousewheel" && B.addEventListener) {
			B.addEventListener("DOMMouseScroll", z, false);
			n.on(window, "unload", function() {
						B.removeEventListener("DOMMouseScroll", z, false)
					})
		}
		if (x == "mousedown" && B == document) {
			Ext.EventManager.stoppedMouseDownEvent.addListener(z)
		}
	};
	var g = function(y, A, E, G) {
		y = Ext.getDom(y);
		var w = Ext.id(y), F = h[w], x;
		if (F) {
			var C = F[A], z;
			if (C) {
				for (var B = 0, D = C.length; B < D; B++) {
					z = C[B];
					if (z.fn == E && (!G || z.scope == G)) {
						x = z.wrap;
						n.un(y, A, x);
						C.splice(B, 1);
						break
					}
				}
			}
		}
		if (A == "mousewheel" && y.addEventListener && x) {
			y.removeEventListener("DOMMouseScroll", x, false)
		}
		if (A == "mousedown" && y == document && x) {
			Ext.EventManager.stoppedMouseDownEvent.removeListener(x)
		}
	};
	var d = function(A) {
		A = Ext.getDom(A);
		var C = Ext.id(A), B = h[C], x;
		if (B) {
			for (var z in B) {
				if (B.hasOwnProperty(z)) {
					x = B[z];
					for (var y = 0, w = x.length; y < w; y++) {
						n.un(A, z, x[y].wrap);
						x[y] = null
					}
				}
				B[z] = null
			}
			delete h[C]
		}
	};
	var c = function() {
		if (!k) {
			k = true;
			Ext.isReady = true;
			if (o) {
				clearInterval(o)
			}
			if (Ext.isGecko || Ext.isOpera) {
				document.removeEventListener("DOMContentLoaded", c, false)
			}
			if (Ext.isIE) {
				var w = document.getElementById("ie-deferred-loader");
				if (w) {
					w.onreadystatechange = null;
					w.parentNode.removeChild(w)
				}
			}
			if (v) {
				v.fire();
				v.clearListeners()
			}
		}
	};
	var b = function() {
		v = new Ext.util.Event();
		if (Ext.isGecko || Ext.isOpera) {
			document.addEventListener("DOMContentLoaded", c, false)
		} else {
			if (Ext.isIE) {
				document
						.write('<script id="ie-deferred-loader" defer="defer" src="//:"><\/script>');
				var w = document.getElementById("ie-deferred-loader");
				w.onreadystatechange = function() {
					if (this.readyState == "complete") {
						c()
					}
				}
			} else {
				if (Ext.isSafari) {
					o = setInterval(function() {
								var x = document.readyState;
								if (x == "complete") {
									c()
								}
							}, 10)
				}
			}
		}
		n.on(window, "load", c)
	};
	var t = function(x, y) {
		var w = new Ext.util.DelayedTask(x);
		return function(z) {
			z = new Ext.EventObjectImpl(z);
			w.delay(y.buffer, x, null, [z])
		}
	};
	var r = function(A, z, w, y, x) {
		return function(B) {
			Ext.EventManager.removeListener(z, w, y, x);
			A(B)
		}
	};
	var e = function(w, x) {
		return function(y) {
			y = new Ext.EventObjectImpl(y);
			setTimeout(function() {
						w(y)
					}, x.delay || 10)
		}
	};
	var j = function(y, x, w, C, B) {
		var D = (!w || typeof w == "boolean") ? {} : w;
		C = C || D.fn;
		B = B || D.scope;
		var A = Ext.getDom(y);
		if (!A) {
			throw 'Error listening for "' + x + '". Element "' + y
					+ "\" doesn't exist."
		}
		var z = function(F) {
			if (!window[a]) {
				return
			}
			F = Ext.EventObject.setEvent(F);
			var E;
			if (D.delegate) {
				E = F.getTarget(D.delegate, A);
				if (!E) {
					return
				}
			} else {
				E = F.target
			}
			if (D.stopEvent === true) {
				F.stopEvent()
			}
			if (D.preventDefault === true) {
				F.preventDefault()
			}
			if (D.stopPropagation === true) {
				F.stopPropagation()
			}
			if (D.normalized === false) {
				F = F.browserEvent
			}
			C.call(B || A, F, E, D)
		};
		if (D.delay) {
			z = e(z, D)
		}
		if (D.single) {
			z = r(z, A, x, C, B)
		}
		if (D.buffer) {
			z = t(z, D)
		}
		m(A, x, C, z, B);
		return z
	};
	var i = /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate)$/;
	var s = {
		addListener : function(y, w, A, z, x) {
			if (typeof w == "object") {
				var C = w;
				for (var B in C) {
					if (i.test(B)) {
						continue
					}
					if (typeof C[B] == "function") {
						j(y, B, C, C[B], C.scope)
					} else {
						j(y, B, C[B])
					}
				}
				return
			}
			return j(y, w, x, A, z)
		},
		removeListener : function(x, w, z, y) {
			return g(x, w, z, y)
		},
		removeAll : function(w) {
			return d(w)
		},
		onDocumentReady : function(y, x, w) {
			if (k) {
				v.addListener(y, x, w);
				v.fire();
				v.clearListeners();
				return
			}
			if (!v) {
				b()
			}
			w = w || {};
			if (!w.delay) {
				w.delay = 1
			}
			v.addListener(y, x, w)
		},
		doResizeEvent : function() {
			l.fire(p.getViewWidth(), p.getViewHeight())
		},
		onWindowResize : function(y, x, w) {
			if (!l) {
				l = new Ext.util.Event();
				u = new Ext.util.DelayedTask(this.doResizeEvent);
				n.on(window, "resize", this.fireWindowResize, this)
			}
			l.addListener(y, x, w)
		},
		fireWindowResize : function() {
			if (l) {
				if ((Ext.isIE || Ext.isAir) && u) {
					u.delay(50)
				} else {
					l.fire(p.getViewWidth(), p.getViewHeight())
				}
			}
		},
		onTextResize : function(z, y, w) {
			if (!f) {
				f = new Ext.util.Event();
				var x = new Ext.Element(document.createElement("div"));
				x.dom.className = "x-text-resize";
				x.dom.innerHTML = "X";
				x.appendTo(document.body);
				q = x.dom.offsetHeight;
				setInterval(function() {
							if (x.dom.offsetHeight != q) {
								f.fire(q, q = x.dom.offsetHeight)
							}
						}, this.textResizeInterval)
			}
			f.addListener(z, y, w)
		},
		removeResizeListener : function(x, w) {
			if (l) {
				l.removeListener(x, w)
			}
		},
		fireResize : function() {
			if (l) {
				l.fire(p.getViewWidth(), p.getViewHeight())
			}
		},
		ieDeferSrc : false,
		textResizeInterval : 50
	};
	s.on = s.addListener;
	s.un = s.removeListener;
	s.stoppedMouseDownEvent = new Ext.util.Event();
	return s
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
		getTarget : function(e, f, d) {
			return e ? Ext.fly(this.target).findParent(e, f, d) : (d ? Ext
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
			var f = 0;
			if (d.wheelDelta) {
				f = d.wheelDelta / 120
			} else {
				if (d.detail) {
					f = -d.detail / 3
				}
			}
			return f
		},
		hasModifier : function() {
			return ((this.ctrlKey || this.altKey) || this.shiftKey)
					? true
					: false
		},
		within : function(f, g, d) {
			var e = this[g ? "getRelatedTarget" : "getTarget"]();
			return e
					&& ((d ? (e === Ext.getDom(f)) : false) || Ext.fly(f)
							.contains(e))
		},
		getPoint : function() {
			return new Ext.lib.Point(this.xy[0], this.xy[1])
		}
	};
	return new Ext.EventObjectImpl()
}();