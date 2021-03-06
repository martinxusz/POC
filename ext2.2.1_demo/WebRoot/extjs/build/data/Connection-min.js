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
				var f = document.createElement("iframe");
				f.id = c;
				f.name = c;
				f.className = "x-hidden";
				if (Ext.isIE) {
					f.src = Ext.SSL_SECURE_URL
				}
				document.body.appendChild(f);
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
				var n, l;
				if (a) {
					n = [];
					a = Ext.urlDecode(a, false);
					for (var h in a) {
						if (a.hasOwnProperty(h)) {
							l = document.createElement("input");
							l.type = "hidden";
							l.name = h;
							l.value = a[h];
							d.appendChild(l);
							n.push(l)
						}
					}
				}
				function g() {
					var i = {
						responseText : "",
						responseXML : null
					};
					i.argument = e ? e.argument : null;
					try {
						var o;
						if (Ext.isIE) {
							o = f.contentWindow.document
						} else {
							o = (f.contentDocument || window.frames[c].document)
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
					Ext.EventManager.removeListener(f, "load", g, this);
					this.fireEvent("requestcomplete", this, i, e);
					Ext.callback(e.success, e.scope, [i, e]);
					Ext.callback(e.callback, e.scope, [e, true, i]);
					setTimeout(function() {
								Ext.removeNode(f)
							}, 100)
				}
				Ext.EventManager.on(f, "load", g, this);
				d.submit();
				if (n) {
					for (var j = 0, m = n.length; j < m; j++) {
						Ext.removeNode(n[j])
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