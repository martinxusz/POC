Ext.tree.TreeLoader = function(a) {
	this.baseParams = {};
	Ext.apply(this, a);
	this.addEvents("beforeload", "load", "loadexception");
	Ext.tree.TreeLoader.superclass.constructor.call(this)
};
Ext.extend(Ext.tree.TreeLoader, Ext.util.Observable, {
			uiProviders : {},
			clearOnLoad : true,
			load : function(a, b) {
				if (this.clearOnLoad) {
					while (a.firstChild) {
						a.removeChild(a.firstChild)
					}
				}
				if (this.doPreload(a)) {
					if (typeof b == "function") {
						b()
					}
				} else {
					if (this.dataUrl || this.url) {
						this.requestData(a, b)
					}
				}
			},
			doPreload : function(d) {
				if (d.attributes.children) {
					if (d.childNodes.length < 1) {
						var c = d.attributes.children;
						d.beginUpdate();
						for (var b = 0, a = c.length; b < a; b++) {
							var e = d.appendChild(this.createNode(c[b]));
							if (this.preloadChildren) {
								this.doPreload(e)
							}
						}
						d.endUpdate()
					}
					return true
				} else {
					return false
				}
			},
			getParams : function(d) {
				var a = [], c = this.baseParams;
				for (var b in c) {
					if (typeof c[b] != "function") {
						a.push(encodeURIComponent(b), "=",
								encodeURIComponent(c[b]), "&")
					}
				}
				a.push("node=", encodeURIComponent(d.id));
				return a.join("")
			},
			requestData : function(a, b) {
				if (this.fireEvent("beforeload", this, a, b) !== false) {
					this.transId = Ext.Ajax.request({
								method : this.requestMethod,
								url : this.dataUrl || this.url,
								success : this.handleResponse,
								failure : this.handleFailure,
								scope : this,
								argument : {
									callback : b,
									node : a
								},
								params : this.getParams(a)
							})
				} else {
					if (typeof b == "function") {
						b()
					}
				}
			},
			isLoading : function() {
				return !!this.transId
			},
			abort : function() {
				if (this.isLoading()) {
					Ext.Ajax.abort(this.transId)
				}
			},
			createNode : function(attr) {
				if (this.baseAttrs) {
					Ext.applyIf(attr, this.baseAttrs)
				}
				if (this.applyLoader !== false) {
					attr.loader = this
				}
				if (typeof attr.uiProvider == "string") {
					attr.uiProvider = this.uiProviders[attr.uiProvider]
							|| eval(attr.uiProvider)
				}
				if (attr.nodeType) {
					return new Ext.tree.TreePanel.nodeTypes[attr.nodeType](attr)
				} else {
					return attr.leaf
							? new Ext.tree.TreeNode(attr)
							: new Ext.tree.AsyncTreeNode(attr)
				}
			},
			processResponse : function(response, node, callback) {
				var json = response.responseText;
				try {
					var o = eval("(" + json + ")");
					node.beginUpdate();
					for (var i = 0, len = o.length; i < len; i++) {
						var n = this.createNode(o[i]);
						if (n) {
							node.appendChild(n)
						}
					}
					node.endUpdate();
					if (typeof callback == "function") {
						callback(this, node)
					}
				} catch (e) {
					this.handleFailure(response)
				}
			},
			handleResponse : function(c) {
				this.transId = false;
				var b = c.argument;
				this.processResponse(c, b.node, b.callback);
				this.fireEvent("load", this, b.node, c)
			},
			handleFailure : function(c) {
				this.transId = false;
				var b = c.argument;
				this.fireEvent("loadexception", this, b.node, c);
				if (typeof b.callback == "function") {
					b.callback(this, b.node)
				}
			}
		});