Ext.data.HttpProxy = function(a) {
	Ext.data.HttpProxy.superclass.constructor.call(this);
	this.conn = a;
	this.useAjax = !a || !a.events
};
Ext.extend(Ext.data.HttpProxy, Ext.data.DataProxy, {
			getConnection : function() {
				return this.useAjax ? Ext.Ajax : this.conn
			},
			load : function(e, b, f, c, a) {
				if (this.fireEvent("beforeload", this, e) !== false) {
					var d = {
						params : e || {},
						request : {
							callback : f,
							scope : c,
							arg : a
						},
						reader : b,
						callback : this.loadResponse,
						scope : this
					};
					if (this.useAjax) {
						Ext.applyIf(d, this.conn);
						if (this.activeRequest) {
							Ext.Ajax.abort(this.activeRequest)
						}
						this.activeRequest = Ext.Ajax.request(d)
					} else {
						this.conn.request(d)
					}
				} else {
					f.call(c || this, null, a, false)
				}
			},
			loadResponse : function(f, d, b) {
				delete this.activeRequest;
				if (!d) {
					this.fireEvent("loadexception", this, f, b);
					f.request.callback.call(f.request.scope, null,
							f.request.arg, false);
					return
				}
				var a;
				try {
					a = f.reader.read(b)
				} catch (c) {
					this.fireEvent("loadexception", this, f, b, c);
					f.request.callback.call(f.request.scope, null,
							f.request.arg, false);
					return
				}
				this.fireEvent("load", this, f, f.request.arg);
				f.request.callback
						.call(f.request.scope, a, f.request.arg, true)
			},
			update : function(a) {
			},
			updateResponse : function(a) {
			}
		});