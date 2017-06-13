Ext.debug = {};
(function() {
	var b;
	function a() {
		var e = new Ext.debug.ScriptsPanel();
		var g = new Ext.debug.LogPanel();
		var c = new Ext.debug.DomTree();
		var d = new Ext.TabPanel({
					activeTab : 0,
					border : false,
					tabPosition : "bottom",
					items : [{
								title : "Debug Console",
								layout : "border",
								items : [g, e]
							}, {
								title : "DOM Inspector",
								layout : "border",
								items : [c]
							}]
				});
		b = new Ext.Panel({
					id : "x-debug-browser",
					title : "Console",
					collapsible : true,
					animCollapse : false,
					style : "position:absolute;left:0;bottom:0;",
					height : 200,
					logView : g,
					layout : "fit",
					tools : [{
								id : "close",
								handler : function() {
									b.destroy();
									b = null;
									Ext.EventManager.removeResizeListener(f)
								}
							}],
					items : d
				});
		b.render(document.body);
		b.resizer = new Ext.Resizable(b.el, {
					minHeight : 50,
					handles : "n",
					pinned : true,
					transparent : true,
					resizeElement : function() {
						var h = this.proxy.getBox();
						this.proxy.hide();
						b.setHeight(h.height);
						return h
					}
				});
		function f() {
			b.setWidth(Ext.getBody().getViewSize().width)
		}
		Ext.EventManager.onWindowResize(f);
		f()
	}
	Ext.apply(Ext, {
				log : function() {
					if (!b) {
						a()
					}
					b.logView.log.apply(b.logView, arguments)
				},
				logf : function(f, e, c, d) {
					Ext.log(String.format.apply(String, arguments))
				},
				dump : function(f) {
					if (typeof f == "string" || typeof f == "number"
							|| typeof f == "undefined" || Ext.isDate(f)) {
						Ext.log(f)
					} else {
						if (!f) {
							Ext.log("null")
						} else {
							if (typeof f != "object") {
								Ext.log("Unknown return type")
							} else {
								if (Ext.isArray(f)) {
									Ext.log("[" + f.join(",") + "]")
								} else {
									var c = ["{\n"];
									for (var d in f) {
										var g = typeof f[d];
										if (g != "function" && g != "object") {
											c.push(String.format(
													"  {0}: {1},\n", d, f[d]))
										}
									}
									var e = c.join("");
									if (e.length > 3) {
										e = e.substr(0, e.length - 2)
									}
									Ext.log(e + "\n}")
								}
							}
						}
					}
				},
				_timers : {},
				time : function(c) {
					c = c || "def";
					Ext._timers[c] = new Date().getTime()
				},
				timeEnd : function(d, f) {
					var e = new Date().getTime();
					d = d || "def";
					var c = String.format("{0} ms", e - Ext._timers[d]);
					Ext._timers[d] = new Date().getTime();
					if (f !== false) {
						Ext.log("Timer " + (d == "def" ? c : d + ": " + c))
					}
					return c
				}
			})
})();
Ext.debug.ScriptsPanel = Ext.extend(Ext.Panel, {
			id : "x-debug-scripts",
			region : "east",
			minWidth : 200,
			split : true,
			width : 350,
			border : false,
			layout : "anchor",
			style : "border-width:0 0 0 1px;",
			initComponent : function() {
				this.scriptField = new Ext.form.TextArea({
							anchor : "100% -26",
							style : "border-width:0;"
						});
				this.trapBox = new Ext.form.Checkbox({
							id : "console-trap",
							boxLabel : "Trap Errors",
							checked : true
						});
				this.toolbar = new Ext.Toolbar([{
							text : "Run",
							scope : this,
							handler : this.evalScript
						}, {
							text : "Clear",
							scope : this,
							handler : this.clear
						}, "->", this.trapBox, " ", " "]);
				this.items = [this.toolbar, this.scriptField];
				Ext.debug.ScriptsPanel.superclass.initComponent.call(this)
			},
			evalScript : function() {
				var s = this.scriptField.getValue();
				if (this.trapBox.getValue()) {
					try {
						var rt = eval(s);
						Ext.dump(rt === undefined ? "(no return)" : rt)
					} catch (e) {
						Ext.log(e.message || e.descript)
					}
				} else {
					var rt = eval(s);
					Ext.dump(rt === undefined ? "(no return)" : rt)
				}
			},
			clear : function() {
				this.scriptField.setValue("");
				this.scriptField.focus()
			}
		});
Ext.debug.LogPanel = Ext.extend(Ext.Panel, {
	autoScroll : true,
	region : "center",
	border : false,
	style : "border-width:0 1px 0 0",
	log : function() {
		var a = [
				'<div style="padding:5px !important;border-bottom:1px solid #ccc;">',
				Ext.util.Format.htmlEncode(Array.prototype.join.call(arguments,
						", ")).replace(/\n/g, "<br />")
						.replace(/\s/g, "&#160;"), "</div>"].join("");
		this.body.insertHtml("beforeend", a);
		this.body.scrollTo("top", 100000)
	},
	clear : function() {
		this.body.update("");
		this.body.dom.scrollTop = 0
	}
});
Ext.debug.DomTree = Ext.extend(Ext.tree.TreePanel, {
			enableDD : false,
			lines : false,
			rootVisible : false,
			animate : false,
			hlColor : "ffff9c",
			autoScroll : true,
			region : "center",
			border : false,
			initComponent : function() {
				Ext.debug.DomTree.superclass.initComponent.call(this);
				var h = false, a;
				var i = /^\s*$/;
				var e = Ext.util.Format.htmlEncode;
				var g = Ext.util.Format.ellipsis;
				var d = /\s?([a-z\-]*)\:([^;]*)(?:[;\s\n\r]*)/gi;
				function b(r) {
					if (!r || r.nodeType != 1 || r == document.body
							|| r == document) {
						return false
					}
					var l = [r], o = r;
					while ((o = o.parentNode) && o.nodeType == 1
							&& o.tagName.toUpperCase() != "HTML") {
						l.unshift(o)
					}
					var q = a;
					for (var m = 0, j = l.length; m < j; m++) {
						q.expand();
						q = q.findChild("htmlNode", l[m]);
						if (!q) {
							return false
						}
					}
					q.select();
					var k = q.ui.anchor;
					treeEl.dom.scrollTop = Math.max(0, k.offsetTop - 10);
					q.highlight();
					return true
				}
				function f(k) {
					var j = k.tagName;
					if (k.id) {
						j += "#" + k.id
					} else {
						if (k.className) {
							j += "." + k.className
						}
					}
					return j
				}
				function c(A, j, x) {
					return;
					if (x && x.unframe) {
						x.unframe()
					}
					var r = {};
					if (j && j.htmlNode) {
						if (frameEl.pressed) {
							j.frame()
						}
						if (inspecting) {
							return
						}
						addStyle.enable();
						reload.setDisabled(j.leaf);
						var o = j.htmlNode;
						stylePanel.setTitle(f(o));
						if (h && !showAll.pressed) {
							var B = o.style ? o.style.cssText : "";
							if (B) {
								var k;
								while ((k = d.exec(B)) != null) {
									r[k[1].toLowerCase()] = k[2]
								}
							}
						} else {
							if (h) {
								var y = Ext.debug.cssList;
								var B = o.style, l = Ext.fly(o);
								if (B) {
									for (var p = 0, q = y.length; p < q; p++) {
										var z = y[p];
										var w = B[z] || l.getStyle(z);
										if (w != undefined && w !== null
												&& w !== "") {
											r[z] = w
										}
									}
								}
							} else {
								for (var u in o) {
									var w = o[u];
									if ((isNaN(u + 10))
											&& w != undefined
											&& w !== null
											&& w !== ""
											&& !(Ext.isGecko && u[0] == u[0]
													.toUpperCase())) {
										r[u] = w
									}
								}
							}
						}
					} else {
						if (inspecting) {
							return
						}
						addStyle.disable();
						reload.disabled()
					}
					stylesGrid.setSource(r);
					stylesGrid.treeNode = j;
					stylesGrid.view.fitColumns()
				}
				this.loader = new Ext.tree.TreeLoader();
				this.loader.load = function(p, j) {
					var k = p.htmlNode == document.body;
					var o = p.htmlNode.childNodes;
					for (var l = 0, m; m = o[l]; l++) {
						if (k && m.id == "x-debug-browser") {
							continue
						}
						if (m.nodeType == 1) {
							p.appendChild(new Ext.debug.HtmlNode(m))
						} else {
							if (m.nodeType == 3 && !i.test(m.nodeValue)) {
								p.appendChild(new Ext.tree.TreeNode({
											text : "<em>"
													+ g(e(String(m.nodeValue)),
															35) + "</em>",
											cls : "x-tree-noicon"
										}))
							}
						}
					}
					j()
				};
				this.root = this.setRootNode(new Ext.tree.TreeNode("Ext"));
				a = this.root.appendChild(new Ext.debug.HtmlNode(document
						.getElementsByTagName("html")[0]))
			}
		});
Ext.debug.HtmlNode = function() {
	var d = Ext.util.Format.htmlEncode;
	var b = Ext.util.Format.ellipsis;
	var a = /^\s*$/;
	var c = [{
				n : "id",
				v : "id"
			}, {
				n : "className",
				v : "class"
			}, {
				n : "name",
				v : "name"
			}, {
				n : "type",
				v : "type"
			}, {
				n : "src",
				v : "src"
			}, {
				n : "href",
				v : "href"
			}];
	function f(k) {
		for (var h = 0, j; j = k.childNodes[h]; h++) {
			if (j.nodeType == 1) {
				return true
			}
		}
		return false
	}
	function e(j, m) {
		var r = j.tagName.toLowerCase();
		var q = "&lt;" + r;
		for (var k = 0, l = c.length; k < l; k++) {
			var o = c[k];
			var p = j[o.n];
			if (p && !a.test(p)) {
				q += " " + o.v + "=&quot;<i>" + d(p) + "</i>&quot;"
			}
		}
		var h = j.style ? j.style.cssText : "";
		if (h) {
			q += " style=&quot;<i>" + d(h.toLowerCase()) + "</i>&quot;"
		}
		if (m && j.childNodes.length > 0) {
			q += "&gt;<em>" + b(d(String(j.innerHTML)), 35) + "</em>&lt;/" + r
					+ "&gt;"
		} else {
			if (m) {
				q += " /&gt;"
			} else {
				q += "&gt;"
			}
		}
		return q
	}
	var g = function(j) {
		var i = !f(j);
		this.htmlNode = j;
		this.tagName = j.tagName.toLowerCase();
		var h = {
			text : e(j, i),
			leaf : i,
			cls : "x-tree-noicon"
		};
		g.superclass.constructor.call(this, h);
		this.attributes.htmlNode = j;
		if (!i) {
			this.on("expand", this.onExpand, this);
			this.on("collapse", this.onCollapse, this)
		}
	};
	Ext.extend(g, Ext.tree.AsyncTreeNode, {
				cls : "x-tree-noicon",
				preventHScroll : true,
				refresh : function(i) {
					var h = !f(this.htmlNode);
					this.setText(e(this.htmlNode, h));
					if (i) {
						Ext.fly(this.ui.textNode).highlight()
					}
				},
				onExpand : function() {
					if (!this.closeNode && this.parentNode) {
						this.closeNode = this.parentNode.insertBefore(
								new Ext.tree.TreeNode({
											text : "&lt;/" + this.tagName
													+ "&gt;",
											cls : "x-tree-noicon"
										}), this.nextSibling)
					} else {
						if (this.closeNode) {
							this.closeNode.ui.show()
						}
					}
				},
				onCollapse : function() {
					if (this.closeNode) {
						this.closeNode.ui.hide()
					}
				},
				render : function(h) {
					g.superclass.render.call(this, h)
				},
				highlightNode : function() {
				},
				highlight : function() {
				},
				frame : function() {
					this.htmlNode.style.border = "1px solid #0000ff"
				},
				unframe : function() {
					this.htmlNode.style.border = ""
				}
			});
	return g
}();