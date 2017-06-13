Ext.state.CookieProvider = function(a) {
	Ext.state.CookieProvider.superclass.constructor.call(this);
	this.path = "/";
	this.expires = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 7));
	this.domain = null;
	this.secure = false;
	Ext.apply(this, a);
	this.state = this.readCookies()
};
Ext.extend(Ext.state.CookieProvider, Ext.state.Provider, {
			set : function(a, b) {
				if (typeof b == "undefined" || b === null) {
					this.clear(a);
					return
				}
				this.setCookie(a, b);
				Ext.state.CookieProvider.superclass.set.call(this, a, b)
			},
			clear : function(a) {
				this.clearCookie(a);
				Ext.state.CookieProvider.superclass.clear.call(this, a)
			},
			readCookies : function() {
				var d = {};
				var g = document.cookie + ";";
				var b = /\s?(.*?)=(.*?);/g;
				var f;
				while ((f = b.exec(g)) != null) {
					var a = f[1];
					var e = f[2];
					if (a && a.substring(0, 3) == "ys-") {
						d[a.substr(3)] = this.decodeValue(e)
					}
				}
				return d
			},
			setCookie : function(a, b) {
				document.cookie = "ys-"
						+ a
						+ "="
						+ this.encodeValue(b)
						+ ((this.expires == null)
								? ""
								: ("; expires=" + this.expires.toGMTString()))
						+ ((this.path == null) ? "" : ("; path=" + this.path))
						+ ((this.domain == null)
								? ""
								: ("; domain=" + this.domain))
						+ ((this.secure == true) ? "; secure" : "")
			},
			clearCookie : function(a) {
				document.cookie = "ys-"
						+ a
						+ "=null; expires=Thu, 01-Jan-70 00:00:01 GMT"
						+ ((this.path == null) ? "" : ("; path=" + this.path))
						+ ((this.domain == null)
								? ""
								: ("; domain=" + this.domain))
						+ ((this.secure == true) ? "; secure" : "")
			}
		});