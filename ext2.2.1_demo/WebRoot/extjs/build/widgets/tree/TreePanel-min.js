Ext.tree.TreePanel = Ext.extend(Ext.Panel, {
			rootVisible : true,
			animate : Ext.enableFx,
			lines : true,
			enableDD : false,
			hlDrop : Ext.enableFx,
			pathSeparator : "/",
			initComponent : function() {
				Ext.tree.TreePanel.superclass.initComponent.call(this);
				if (!this.eventModel) {
					this.eventModel = new Ext.tree.TreeEventModel(this)
				}
				var a = this.loader;
				if (!a) {
					a = new Ext.tree.TreeLoader({
								dataUrl : this.dataUrl
							})
				} else {
					if (typeof a == "object" && !a.load) {
						a = new Ext.tree.TreeLoader(a)
					}
				}
				this.loader = a;
				this.nodeHash = {};
				if (this.root) {
					this.setRootNode(this.root)
				}
				this.addEvents("append", "remove", "movenode", "insert",
						"beforeappend", "beforeremove", "beforemovenode",
						"beforeinsert", "beforeload", "load", "textchange",
						"beforeexpandnode", "beforecollapsenode", "expandnode",
						"disabledchange", "collapsenode", "beforeclick",
						"click", "checkchange", "dblclick", "contextmenu",
						"beforechildrenrendered", "startdrag", "enddrag",
						"dragdrop", "beforenodedrop", "nodedrop",
						"nodedragover");
				if (this.singleExpand) {
					this.on("beforeexpandnode", this.restrictExpand, this)
				}
			},
			proxyNodeEvent : function(c, b, a, g, f, e, d) {
				if (c == "collapse" || c == "expand" || c == "beforecollapse"
						|| c == "beforeexpand" || c == "move"
						|| c == "beforemove") {
					c = c + "node"
				}
				return this.fireEvent(c, b, a, g, f, e, d)
			},
			getRootNode : function() {
				return this.root
			},
			setRootNode : function(b) {
				if (!b.render) {
					b = this.loader.createNode(b)
				}
				this.root = b;
				b.ownerTree = this;
				b.isRoot = true;
				this.registerNode(b);
				if (!this.rootVisible) {
					var a = b.attributes.uiProvider;
					b.ui = a ? new a(b) : new Ext.tree.RootTreeNodeUI(b)
				}
				return b
			},
			getNodeById : function(a) {
				return this.nodeHash[a]
			},
			registerNode : function(a) {
				this.nodeHash[a.id] = a
			},
			unregisterNode : function(a) {
				delete this.nodeHash[a.id]
			},
			toString : function() {
				return "[Tree" + (this.id ? " " + this.id : "") + "]"
			},
			restrictExpand : function(a) {
				var b = a.parentNode;
				if (b) {
					if (b.expandedChild && b.expandedChild.parentNode == b) {
						b.expandedChild.collapse()
					}
					b.expandedChild = a
				}
			},
			getChecked : function(b, c) {
				c = c || this.root;
				var d = [];
				var e = function() {
					if (this.attributes.checked) {
						d.push(!b ? this : (b == "id"
								? this.id
								: this.attributes[b]))
					}
				};
				c.cascade(e);
				return d
			},
			getEl : function() {
				return this.el
			},
			getLoader : function() {
				return this.loader
			},
			expandAll : function() {
				this.root.expand(true)
			},
			collapseAll : function() {
				this.root.collapse(true)
			},
			getSelectionModel : function() {
				if (!this.selModel) {
					this.selModel = new Ext.tree.DefaultSelectionModel()
				}
				return this.selModel
			},
			expandPath : function(g, a, h) {
				a = a || "id";
				var d = g.split(this.pathSeparator);
				var c = this.root;
				if (c.attributes[a] != d[1]) {
					if (h) {
						h(false, null)
					}
					return
				}
				var b = 1;
				var e = function() {
					if (++b == d.length) {
						if (h) {
							h(true, c)
						}
						return
					}
					var f = c.findChild(a, d[b]);
					if (!f) {
						if (h) {
							h(false, c)
						}
						return
					}
					c = f;
					f.expand(false, false, e)
				};
				c.expand(false, false, e)
			},
			selectPath : function(e, a, g) {
				a = a || "id";
				var c = e.split(this.pathSeparator);
				var b = c.pop();
				if (c.length > 0) {
					var d = function(h, f) {
						if (h && f) {
							var i = f.findChild(a, b);
							if (i) {
								i.select();
								if (g) {
									g(true, i)
								}
							} else {
								if (g) {
									g(false, i)
								}
							}
						} else {
							if (g) {
								g(false, i)
							}
						}
					};
					this.expandPath(c.join(this.pathSeparator), a, d)
				} else {
					this.root.select();
					if (g) {
						g(true, this.root)
					}
				}
			},
			getTreeEl : function() {
				return this.body
			},
			onRender : function(b, a) {
				Ext.tree.TreePanel.superclass.onRender.call(this, b, a);
				this.el.addClass("x-tree");
				this.innerCt = this.body.createChild({
							tag : "ul",
							cls : "x-tree-root-ct "
									+ (this.useArrows
											? "x-tree-arrows"
											: this.lines
													? "x-tree-lines"
													: "x-tree-no-lines")
						})
			},
			initEvents : function() {
				Ext.tree.TreePanel.superclass.initEvents.call(this);
				if (this.containerScroll) {
					Ext.dd.ScrollManager.register(this.body)
				}
				if ((this.enableDD || this.enableDrop) && !this.dropZone) {
					this.dropZone = new Ext.tree.TreeDropZone(this,
							this.dropConfig || {
								ddGroup : this.ddGroup || "TreeDD",
								appendOnly : this.ddAppendOnly === true
							})
				}
				if ((this.enableDD || this.enableDrag) && !this.dragZone) {
					this.dragZone = new Ext.tree.TreeDragZone(this,
							this.dragConfig || {
								ddGroup : this.ddGroup || "TreeDD",
								scroll : this.ddScroll
							})
				}
				this.getSelectionModel().init(this)
			},
			afterRender : function() {
				Ext.tree.TreePanel.superclass.afterRender.call(this);
				this.root.render();
				if (!this.rootVisible) {
					this.root.renderChildren()
				}
			},
			onDestroy : function() {
				if (this.rendered) {
					this.body.removeAllListeners();
					Ext.dd.ScrollManager.unregister(this.body);
					if (this.dropZone) {
						this.dropZone.unreg()
					}
					if (this.dragZone) {
						this.dragZone.unreg()
					}
				}
				this.root.destroy();
				this.nodeHash = null;
				Ext.tree.TreePanel.superclass.onDestroy.call(this)
			}
		});
Ext.tree.TreePanel.nodeTypes = {};
Ext.reg("treepanel", Ext.tree.TreePanel);