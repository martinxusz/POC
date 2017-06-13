Ext.data.ScriptTagProxy = function(a) {
	Ext.data.ScriptTagProxy.superclass.constructor.call(this);
	Ext.apply(this, a);
	this.head = document.getElementsByTagName("head")[0]
};
Ext.data.ScriptTagProxy.TRANS_ID = 1000;
Ext.extend(Ext.data.ScriptTagProxy, Ext.data.DataProxy, {
			timeout : 30000,
			callbackParam : "callback",
			nocache : true,
			load : function(e, f, h, i, j) {
				if (this.fireEvent("beforeload", this, e) !== false) {
					var c = Ext.urlEncode(Ext.apply(e, this.extraParams));
					var b = this.url;
					b += (b.indexOf("?") != -1 ? "&" : "?") + c;
					if (this.nocache) {
						b += "&_dc=" + (new Date().getTime())
					}
					var a = ++Ext.data.ScriptTagProxy.TRANS_ID;
					var k = {
						id : a,
						cb : "stcCallback" + a,
						scriptId : "stcScript" + a,
						params : e,
						arg : j,
						url : b,
						callback : h,
						scope : i,
						reader : f
					};
					var d = this;
					window[k.cb] = function(l) {
						d.handleResponse(l, k)
					};
					b += String.format("&{0}={1}", this.callbackParam, k.cb);
					if (this.autoAbort !== false) {
						this.abort()
					}
					k.timeoutId = this.handleFailure.defer(this.timeout, this,
							[k]);
					var g = document.createElement("script");
					g.setAttribute("src", b);
					g.setAttribute("type", "text/javascript");
					g.setAttribute("id", k.scriptId);
					this.head.appendChild(g);
					this.trans = k
				} else {
					h.call(i || this, null, j, false)
				}
			},
			isLoading : function() {
				return this.trans ? true : false
			},
			abort : function() {
				if (this.isLoading()) {
					this.destroyTrans(this.trans)
				}
			},
			destroyTrans : function(b, a) {
				this.head.removeChild(document.getElementById(b.scriptId));
				clearTimeout(b.timeoutId);
				if (a) {
					window[b.cb] = undefined;
					try {
						delete window[b.cb]
					} catch (c) {
					}
				} else {
					window[b.cb] = function() {
						window[b.cb] = undefined;
						try {
							delete window[b.cb]
						} catch (d) {
						}
					}
				}
			},
			handleResponse : function(d, b) {
				this.trans = false;
				this.destroyTrans(b, true);
				var a;
				try {
					a = b.reader.readRecords(d)
				} catch (c) {
					this.fireEvent("loadexception", this, d, b.arg, c);
					b.callback.call(b.scope || window, null, b.arg, false);
					return
				}
				this.fireEvent("load", this, d, b.arg);
				b.callback.call(b.scope || window, a, b.arg, true)
			},
			handleFailure : function(a) {
				this.trans = false;
				this.destroyTrans(a, false);
				this.fireEvent("loadexception", this, null, a.arg);
				a.callback.call(a.scope || window, null, a.arg, false)
			}
		});