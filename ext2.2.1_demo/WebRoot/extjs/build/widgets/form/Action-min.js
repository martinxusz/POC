Ext.form.Action = function(b, a) {
	this.form = b;
	this.options = a || {}
};
Ext.form.Action.CLIENT_INVALID = "client";
Ext.form.Action.SERVER_INVALID = "server";
Ext.form.Action.CONNECT_FAILURE = "connect";
Ext.form.Action.LOAD_FAILURE = "load";
Ext.form.Action.prototype = {
	type : "default",
	run : function(a) {
	},
	success : function(a) {
	},
	handleResponse : function(a) {
	},
	failure : function(a) {
		this.response = a;
		this.failureType = Ext.form.Action.CONNECT_FAILURE;
		this.form.afterAction(this, false)
	},
	processResponse : function(a) {
		this.response = a;
		if (!a.responseText) {
			return true
		}
		this.result = this.handleResponse(a);
		return this.result
	},
	getUrl : function(c) {
		var a = this.options.url || this.form.url || this.form.el.dom.action;
		if (c) {
			var b = this.getParams();
			if (b) {
				a += (a.indexOf("?") != -1 ? "&" : "?") + b
			}
		}
		return a
	},
	getMethod : function() {
		return (this.options.method || this.form.method
				|| this.form.el.dom.method || "POST").toUpperCase()
	},
	getParams : function() {
		var a = this.form.baseParams;
		var b = this.options.params;
		if (b) {
			if (typeof b == "object") {
				b = Ext.urlEncode(Ext.applyIf(b, a))
			} else {
				if (typeof b == "string" && a) {
					b += "&" + Ext.urlEncode(a)
				}
			}
		} else {
			if (a) {
				b = Ext.urlEncode(a)
			}
		}
		return b
	},
	createCallback : function(a) {
		var a = a || {};
		return {
			success : this.success,
			failure : this.failure,
			scope : this,
			timeout : (a.timeout * 1000) || (this.form.timeout * 1000),
			upload : this.form.fileUpload ? this.success : undefined
		}
	}
};
Ext.form.Action.Submit = function(b, a) {
	Ext.form.Action.Submit.superclass.constructor.call(this, b, a)
};
Ext.extend(Ext.form.Action.Submit, Ext.form.Action, {
			type : "submit",
			run : function() {
				var b = this.options;
				var c = this.getMethod();
				var a = c == "GET";
				if (b.clientValidation === false || this.form.isValid()) {
					Ext.Ajax.request(Ext.apply(this.createCallback(b), {
								form : this.form.el.dom,
								url : this.getUrl(a),
								method : c,
								headers : b.headers,
								params : !a ? this.getParams() : null,
								isUpload : this.form.fileUpload
							}))
				} else {
					if (b.clientValidation !== false) {
						this.failureType = Ext.form.Action.CLIENT_INVALID;
						this.form.afterAction(this, false)
					}
				}
			},
			success : function(b) {
				var a = this.processResponse(b);
				if (a === true || a.success) {
					this.form.afterAction(this, true);
					return
				}
				if (a.errors) {
					this.form.markInvalid(a.errors);
					this.failureType = Ext.form.Action.SERVER_INVALID
				}
				this.form.afterAction(this, false)
			},
			handleResponse : function(c) {
				if (this.form.errorReader) {
					var b = this.form.errorReader.read(c);
					var f = [];
					if (b.records) {
						for (var d = 0, a = b.records.length; d < a; d++) {
							var e = b.records[d];
							f[d] = e.data
						}
					}
					if (f.length < 1) {
						f = null
					}
					return {
						success : b.success,
						errors : f
					}
				}
				return Ext.decode(c.responseText)
			}
		});
Ext.form.Action.Load = function(b, a) {
	Ext.form.Action.Load.superclass.constructor.call(this, b, a);
	this.reader = this.form.reader
};
Ext.extend(Ext.form.Action.Load, Ext.form.Action, {
			type : "load",
			run : function() {
				Ext.Ajax.request(Ext.apply(this.createCallback(this.options), {
							method : this.getMethod(),
							url : this.getUrl(false),
							headers : this.options.headers,
							params : this.getParams()
						}))
			},
			success : function(b) {
				var a = this.processResponse(b);
				if (a === true || !a.success || !a.data) {
					this.failureType = Ext.form.Action.LOAD_FAILURE;
					this.form.afterAction(this, false);
					return
				}
				this.form.clearInvalid();
				this.form.setValues(a.data);
				this.form.afterAction(this, true)
			},
			handleResponse : function(b) {
				if (this.form.reader) {
					var a = this.form.reader.read(b);
					var c = a.records && a.records[0]
							? a.records[0].data
							: null;
					return {
						success : a.success,
						data : c
					}
				}
				return Ext.decode(b.responseText)
			}
		});
Ext.form.Action.ACTION_TYPES = {
	load : Ext.form.Action.Load,
	submit : Ext.form.Action.Submit
};