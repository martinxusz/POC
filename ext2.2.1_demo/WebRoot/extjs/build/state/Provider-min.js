Ext.state.Provider = function() {
	this.addEvents("statechange");
	this.state = {};
	Ext.state.Provider.superclass.constructor.call(this)
};
Ext.extend(Ext.state.Provider, Ext.util.Observable, {
			get : function(b, a) {
				return typeof this.state[b] == "undefined" ? a : this.state[b]
			},
			clear : function(a) {
				delete this.state[a];
				this.fireEvent("statechange", this, a, null)
			},
			set : function(a, b) {
				this.state[a] = b;
				this.fireEvent("statechange", this, a, b)
			},
			decodeValue : function(a) {
				var k = /^(a|n|d|b|s|o)\:(.*)$/;
				var c = k.exec(unescape(a));
				if (!c || !c[1]) {
					return
				}
				var f = c[1];
				var h = c[2];
				switch (f) {
					case "n" :
						return parseFloat(h);
					case "d" :
						return new Date(Date.parse(h));
					case "b" :
						return (h == "1");
					case "a" :
						var g = [];
						var j = h.split("^");
						for (var b = 0, d = j.length; b < d; b++) {
							g.push(this.decodeValue(j[b]))
						}
						return g;
					case "o" :
						var g = {};
						var j = h.split("^");
						for (var b = 0, d = j.length; b < d; b++) {
							var e = j[b].split("=");
							g[e[0]] = this.decodeValue(e[1])
						}
						return g;
					default :
						return h
				}
			},
			encodeValue : function(c) {
				var b;
				if (typeof c == "number") {
					b = "n:" + c
				} else {
					if (typeof c == "boolean") {
						b = "b:" + (c ? "1" : "0")
					} else {
						if (Ext.isDate(c)) {
							b = "d:" + c.toGMTString()
						} else {
							if (Ext.isArray(c)) {
								var f = "";
								for (var e = 0, a = c.length; e < a; e++) {
									f += this.encodeValue(c[e]);
									if (e != a - 1) {
										f += "^"
									}
								}
								b = "a:" + f
							} else {
								if (typeof c == "object") {
									var f = "";
									for (var d in c) {
										if (typeof c[d] != "function"
												&& c[d] !== undefined) {
											f += d + "="
													+ this.encodeValue(c[d])
													+ "^"
										}
									}
									b = "o:" + f.substring(0, f.length - 1)
								} else {
									b = "s:" + c
								}
							}
						}
					}
				}
				return escape(b)
			}
		});