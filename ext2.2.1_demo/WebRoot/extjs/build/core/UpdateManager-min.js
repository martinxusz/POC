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
			update : function(b, f, g, d) {
				if (this.fireEvent("beforeupdate", this.el, b, f) !== false) {
					var a, c;
					if (typeof b == "object") {
						a = b;
						b = a.url;
						f = f || a.params;
						g = g || a.callback;
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
								params : (typeof f == "function" && c) ? f
										.createDelegate(c) : f,
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
									callback : g,
									scope : c || window,
									params : f
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