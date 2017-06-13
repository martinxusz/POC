Ext = {
	version : "2.2.1"
};
window["undefined"] = window["undefined"];
Ext.apply = function(d, e, b) {
	if (b) {
		Ext.apply(d, b)
	}
	if (d && e && typeof e == "object") {
		for (var a in e) {
			d[a] = e[a]
		}
	}
	return d
};
(function() {
	var idSeed = 0;
	var ua = navigator.userAgent.toLowerCase();
	var isStrict = document.compatMode == "CSS1Compat", isOpera = ua
			.indexOf("opera") > -1, isChrome = ua.indexOf("chrome") > -1, isSafari = !isChrome
			&& (/webkit|khtml/).test(ua), isSafari3 = isSafari
			&& ua.indexOf("webkit/5") != -1, isIE = !isOpera
			&& ua.indexOf("msie") > -1, isIE7 = !isOpera
			&& ua.indexOf("msie 7") > -1, isIE8 = !isOpera
			&& ua.indexOf("msie 8") > -1, isGecko = !isSafari && !isChrome
			&& ua.indexOf("gecko") > -1, isGecko3 = isGecko
			&& ua.indexOf("rv:1.9") > -1, isBorderBox = isIE && !isStrict, isWindows = (ua
			.indexOf("windows") != -1 || ua.indexOf("win32") != -1), isMac = (ua
			.indexOf("macintosh") != -1 || ua.indexOf("mac os x") != -1), isAir = (ua
			.indexOf("adobeair") != -1), isLinux = (ua.indexOf("linux") != -1), isSecure = window.location.href
			.toLowerCase().indexOf("https") === 0;
	if (isIE && !isIE7) {
		try {
			document.execCommand("BackgroundImageCache", false, true)
		} catch (e) {
		}
	}
	Ext.apply(Ext, {
		isStrict : isStrict,
		isSecure : isSecure,
		isReady : false,
		enableGarbageCollector : true,
		enableListenerCollection : false,
		SSL_SECURE_URL : "javascript:false",
		BLANK_IMAGE_URL : "extjs/resources/images/default/s.gif",
		emptyFn : function() {
		},
		applyIf : function(o, c) {
			if (o && c) {
				for (var p in c) {
					if (typeof o[p] == "undefined") {
						o[p] = c[p]
					}
				}
			}
			return o
		},
		addBehaviors : function(o) {
			if (!Ext.isReady) {
				Ext.onReady(function() {
							Ext.addBehaviors(o)
						});
				return
			}
			var cache = {};
			for (var b in o) {
				var parts = b.split("@");
				if (parts[1]) {
					var s = parts[0];
					if (!cache[s]) {
						cache[s] = Ext.select(s)
					}
					cache[s].on(parts[1], o[b])
				}
			}
			cache = null
		},
		id : function(el, prefix) {
			prefix = prefix || "ext-gen";
			el = Ext.getDom(el);
			var id = prefix + (++idSeed);
			return el ? (el.id ? el.id : (el.id = id)) : id
		},
		extend : function() {
			var io = function(o) {
				for (var m in o) {
					this[m] = o[m]
				}
			};
			var oc = Object.prototype.constructor;
			return function(sb, sp, overrides) {
				if (typeof sp == "object") {
					overrides = sp;
					sp = sb;
					sb = overrides.constructor != oc
							? overrides.constructor
							: function() {
								sp.apply(this, arguments)
							}
				}
				var F = function() {
				}, sbp, spp = sp.prototype;
				F.prototype = spp;
				sbp = sb.prototype = new F();
				sbp.constructor = sb;
				sb.superclass = spp;
				if (spp.constructor == oc) {
					spp.constructor = sp
				}
				sb.override = function(o) {
					Ext.override(sb, o)
				};
				sbp.override = io;
				Ext.override(sb, overrides);
				sb.extend = function(o) {
					Ext.extend(sb, o)
				};
				return sb
			}
		}(),
		override : function(origclass, overrides) {
			if (overrides) {
				var p = origclass.prototype;
				for (var method in overrides) {
					p[method] = overrides[method]
				}
				if (Ext.isIE && overrides.toString != origclass.toString) {
					p.toString = overrides.toString
				}
			}
		},
		namespace : function() {
			var a = arguments, o = null, i, j, d, rt;
			for (i = 0; i < a.length; ++i) {
				d = a[i].split(".");
				rt = d[0];
				eval("if (typeof " + rt + ' == "undefined"){' + rt
						+ " = {};} o = " + rt + ";");
				for (j = 1; j < d.length; ++j) {
					o[d[j]] = o[d[j]] || {};
					o = o[d[j]]
				}
			}
		},
		urlEncode : function(o) {
			if (!o) {
				return ""
			}
			var buf = [];
			for (var key in o) {
				var ov = o[key], k = encodeURIComponent(key);
				var type = typeof ov;
				if (type == "undefined") {
					buf.push(k, "=&")
				} else {
					if (type != "function" && type != "object") {
						buf.push(k, "=", encodeURIComponent(ov), "&")
					} else {
						if (Ext.isDate(ov)) {
							var s = Ext.encode(ov).replace(/"/g, "");
							buf.push(k, "=", s, "&")
						} else {
							if (Ext.isArray(ov)) {
								if (ov.length) {
									for (var i = 0, len = ov.length; i < len; i++) {
										buf
												.push(
														k,
														"=",
														encodeURIComponent(ov[i] === undefined
																? ""
																: ov[i]), "&")
									}
								} else {
									buf.push(k, "=&")
								}
							}
						}
					}
				}
			}
			buf.pop();
			return buf.join("")
		},
		urlDecode : function(string, overwrite) {
			if (!string || !string.length) {
				return {}
			}
			var obj = {};
			var pairs = string.split("&");
			var pair, name, value;
			for (var i = 0, len = pairs.length; i < len; i++) {
				pair = pairs[i].split("=");
				name = decodeURIComponent(pair[0]);
				value = decodeURIComponent(pair[1]);
				if (overwrite !== true) {
					if (typeof obj[name] == "undefined") {
						obj[name] = value
					} else {
						if (typeof obj[name] == "string") {
							obj[name] = [obj[name]];
							obj[name].push(value)
						} else {
							obj[name].push(value)
						}
					}
				} else {
					obj[name] = value
				}
			}
			return obj
		},
		each : function(array, fn, scope) {
			if (typeof array.length == "undefined" || typeof array == "string") {
				array = [array]
			}
			for (var i = 0, len = array.length; i < len; i++) {
				if (fn.call(scope || array[i], array[i], i, array) === false) {
					return i
				}
			}
		},
		combine : function() {
			var as = arguments, l = as.length, r = [];
			for (var i = 0; i < l; i++) {
				var a = as[i];
				if (Ext.isArray(a)) {
					r = r.concat(a)
				} else {
					if (a.length !== undefined && !a.substr) {
						r = r.concat(Array.prototype.slice.call(a, 0))
					} else {
						r.push(a)
					}
				}
			}
			return r
		},
		escapeRe : function(s) {
			return s.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1")
		},
		callback : function(cb, scope, args, delay) {
			if (typeof cb == "function") {
				if (delay) {
					cb.defer(delay, scope, args || [])
				} else {
					cb.apply(scope, args || [])
				}
			}
		},
		getDom : function(el) {
			if (!el || !document) {
				return null
			}
			return el.dom ? el.dom : (typeof el == "string" ? document
					.getElementById(el) : el)
		},
		getDoc : function() {
			return Ext.get(document)
		},
		getBody : function() {
			return Ext.get(document.body || document.documentElement)
		},
		getCmp : function(id) {
			return Ext.ComponentMgr.get(id)
		},
		num : function(v, defaultValue) {
			if (typeof v != "number" || isNaN(v)) {
				return defaultValue
			}
			return v
		},
		destroy : function() {
			for (var i = 0, a = arguments, len = a.length; i < len; i++) {
				var as = a[i];
				if (as) {
					if (typeof as.destroy == "function") {
						as.destroy()
					} else {
						if (as.dom) {
							as.removeAllListeners();
							as.remove()
						}
					}
				}
			}
		},
		removeNode : isIE ? function() {
			var d;
			return function(n) {
				if (n && n.tagName != "BODY") {
					d = d || document.createElement("div");
					d.appendChild(n);
					d.innerHTML = ""
				}
			}
		}() : function(n) {
			if (n && n.parentNode && n.tagName != "BODY") {
				n.parentNode.removeChild(n)
			}
		},
		type : function(o) {
			if (o === undefined || o === null) {
				return false
			}
			if (o.htmlElement) {
				return "element"
			}
			var t = typeof o;
			if (t == "object" && o.nodeName) {
				switch (o.nodeType) {
					case 1 :
						return "element";
					case 3 :
						return (/\S/).test(o.nodeValue)
								? "textnode"
								: "whitespace"
				}
			}
			if (t == "object" || t == "function") {
				switch (o.constructor) {
					case Array :
						return "array";
					case RegExp :
						return "regexp";
					case Date :
						return "date"
				}
				if (typeof o.length == "number" && typeof o.item == "function") {
					return "nodelist"
				}
			}
			return t
		},
		isEmpty : function(v, allowBlank) {
			return v === null || v === undefined
					|| (!allowBlank ? v === "" : false)
		},
		value : function(v, defaultValue, allowBlank) {
			return Ext.isEmpty(v, allowBlank) ? defaultValue : v
		},
		isArray : function(v) {
			return v && typeof v.length == "number"
					&& typeof v.splice == "function"
		},
		isDate : function(v) {
			return v && typeof v.getFullYear == "function"
		},
		isOpera : isOpera,
		isChrome : isChrome,
		isSafari : isSafari,
		isSafari3 : isSafari3,
		isSafari2 : isSafari && !isSafari3,
		isIE : isIE,
		isIE6 : isIE && !isIE7 && !isIE8,
		isIE7 : isIE7,
		isIE8 : isIE8,
		isGecko : isGecko,
		isGecko2 : isGecko && !isGecko3,
		isGecko3 : isGecko3,
		isBorderBox : isBorderBox,
		isLinux : isLinux,
		isWindows : isWindows,
		isMac : isMac,
		isAir : isAir,
		useShims : ((isIE && !isIE7) || (isMac && isGecko && !isGecko3))
	});
	Ext.ns = Ext.namespace
})();
Ext.ns("Ext", "Ext.util", "Ext.grid", "Ext.dd", "Ext.tree", "Ext.data",
		"Ext.form", "Ext.menu", "Ext.state", "Ext.lib", "Ext.layout",
		"Ext.app", "Ext.ux");
Ext.apply(Function.prototype, {
			createCallback : function() {
				var a = arguments;
				var b = this;
				return function() {
					return b.apply(window, a)
				}
			},
			createDelegate : function(c, b, a) {
				var d = this;
				return function() {
					var f = b || arguments;
					if (a === true) {
						f = Array.prototype.slice.call(arguments, 0);
						f = f.concat(b)
					} else {
						if (typeof a == "number") {
							f = Array.prototype.slice.call(arguments, 0);
							var e = [a, 0].concat(b);
							Array.prototype.splice.apply(f, e)
						}
					}
					return d.apply(c || window, f)
				}
			},
			defer : function(c, e, b, a) {
				var d = this.createDelegate(e, b, a);
				if (c) {
					return setTimeout(d, c)
				}
				d();
				return 0
			},
			createSequence : function(b, a) {
				if (typeof b != "function") {
					return this
				}
				var c = this;
				return function() {
					var d = c.apply(this || window, arguments);
					b.apply(a || this || window, arguments);
					return d
				}
			},
			createInterceptor : function(b, a) {
				if (typeof b != "function") {
					return this
				}
				var c = this;
				return function() {
					b.target = this;
					b.method = c;
					if (b.apply(a || this || window, arguments) === false) {
						return
					}
					return c.apply(this || window, arguments)
				}
			}
		});
Ext.applyIf(String, {
			escape : function(a) {
				return a.replace(/('|\\)/g, "\\$1")
			},
			leftPad : function(d, b, c) {
				var a = new String(d);
				if (!c) {
					c = " "
				}
				while (a.length < b) {
					a = c + a
				}
				return a.toString()
			},
			format : function(b) {
				var a = Array.prototype.slice.call(arguments, 1);
				return b.replace(/\{(\d+)\}/g, function(c, d) {
							return a[d]
						})
			}
		});
String.prototype.toggle = function(b, a) {
	return this == b ? a : b
};
String.prototype.trim = function() {
	var a = /^\s+|\s+$/g;
	return function() {
		return this.replace(a, "")
	}
}();
Ext.applyIf(Number.prototype, {
			constrain : function(b, a) {
				return Math.min(Math.max(this, b), a)
			}
		});
Ext.applyIf(Array.prototype, {
			indexOf : function(c) {
				for (var b = 0, a = this.length; b < a; b++) {
					if (this[b] == c) {
						return b
					}
				}
				return -1
			},
			remove : function(b) {
				var a = this.indexOf(b);
				if (a != -1) {
					this.splice(a, 1)
				}
				return this
			}
		});
Date.prototype.getElapsed = function(a) {
	return Math.abs((a || new Date()).getTime() - this.getTime())
};