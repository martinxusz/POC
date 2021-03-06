if (Ext.dd.DropZone) {
	Ext.tree.TreeDropZone = function(a, b) {
		this.allowParentInsert = false;
		this.allowContainerDrop = false;
		this.appendOnly = false;
		Ext.tree.TreeDropZone.superclass.constructor.call(this, a.innerCt, b);
		this.tree = a;
		this.dragOverData = {};
		this.lastInsertClass = "x-tree-no-status"
	};
	Ext.extend(Ext.tree.TreeDropZone, Ext.dd.DropZone, {
				ddGroup : "TreeDD",
				expandDelay : 1000,
				expandNode : function(a) {
					if (a.hasChildNodes() && !a.isExpanded()) {
						a.expand(false, null, this.triggerCacheRefresh
										.createDelegate(this))
					}
				},
				queueExpand : function(a) {
					this.expandProcId = this.expandNode.defer(this.expandDelay,
							this, [a])
				},
				cancelExpand : function() {
					if (this.expandProcId) {
						clearTimeout(this.expandProcId);
						this.expandProcId = false
					}
				},
				isValidDropPoint : function(a, j, h, d, c) {
					if (!a || !c) {
						return false
					}
					var f = a.node;
					var g = c.node;
					if (!(f && f.isTarget && j)) {
						return false
					}
					if (j == "append" && f.allowChildren === false) {
						return false
					}
					if ((j == "above" || j == "below")
							&& (f.parentNode && f.parentNode.allowChildren === false)) {
						return false
					}
					if (g && (f == g || g.contains(f))) {
						return false
					}
					var b = this.dragOverData;
					b.tree = this.tree;
					b.target = f;
					b.data = c;
					b.point = j;
					b.source = h;
					b.rawEvent = d;
					b.dropNode = g;
					b.cancel = false;
					var i = this.tree.fireEvent("nodedragover", b);
					return b.cancel === false && i !== false
				},
				getDropPoint : function(g, f, k) {
					var l = f.node;
					if (l.isRoot) {
						return l.allowChildren !== false ? "append" : false
					}
					var c = f.ddel;
					var m = Ext.lib.Dom.getY(c), i = m + c.offsetHeight;
					var h = Ext.lib.Event.getPageY(g);
					var j = l.allowChildren === false || l.isLeaf();
					if (this.appendOnly || l.parentNode.allowChildren === false) {
						return j ? false : "append"
					}
					var d = false;
					if (!this.allowParentInsert) {
						d = l.hasChildNodes() && l.isExpanded()
					}
					var a = (i - m) / (j ? 2 : 3);
					if (h >= m && h < (m + a)) {
						return "above"
					} else {
						if (!d && (j || h >= i - a && h <= i)) {
							return "below"
						} else {
							return "append"
						}
					}
				},
				onNodeEnter : function(d, a, c, b) {
					this.cancelExpand()
				},
				onNodeOver : function(b, h, g, f) {
					var j = this.getDropPoint(g, b, h);
					var c = b.node;
					if (!this.expandProcId && j == "append"
							&& c.hasChildNodes() && !b.node.isExpanded()) {
						this.queueExpand(c)
					} else {
						if (j != "append") {
							this.cancelExpand()
						}
					}
					var d = this.dropNotAllowed;
					if (this.isValidDropPoint(b, j, h, g, f)) {
						if (j) {
							var a = b.ddel;
							var i;
							if (j == "above") {
								d = b.node.isFirst()
										? "x-tree-drop-ok-above"
										: "x-tree-drop-ok-between";
								i = "x-tree-drag-insert-above"
							} else {
								if (j == "below") {
									d = b.node.isLast()
											? "x-tree-drop-ok-below"
											: "x-tree-drop-ok-between";
									i = "x-tree-drag-insert-below"
								} else {
									d = "x-tree-drop-ok-append";
									i = "x-tree-drag-append"
								}
							}
							if (this.lastInsertClass != i) {
								Ext.fly(a)
										.replaceClass(this.lastInsertClass, i);
								this.lastInsertClass = i
							}
						}
					}
					return d
				},
				onNodeOut : function(d, a, c, b) {
					this.cancelExpand();
					this.removeDropIndicators(d)
				},
				onNodeDrop : function(c, j, f, d) {
					var i = this.getDropPoint(f, c, j);
					var g = c.node;
					g.ui.startDrop();
					if (!this.isValidDropPoint(c, i, j, f, d)) {
						g.ui.endDrop();
						return false
					}
					var h = d.node
							|| (j.getTreeNode
									? j.getTreeNode(d, g, i, f)
									: null);
					var b = {
						tree : this.tree,
						target : g,
						data : d,
						point : i,
						source : j,
						rawEvent : f,
						dropNode : h,
						cancel : !h,
						dropStatus : false
					};
					var a = this.tree.fireEvent("beforenodedrop", b);
					if (a === false || b.cancel === true || !b.dropNode) {
						g.ui.endDrop();
						return b.dropStatus
					}
					g = b.target;
					if (i == "append" && !g.isExpanded()) {
						g.expand(false, null, function() {
									this.completeDrop(b)
								}.createDelegate(this))
					} else {
						this.completeDrop(b)
					}
					return true
				},
				completeDrop : function(g) {
					var d = g.dropNode, e = g.point, c = g.target;
					if (!Ext.isArray(d)) {
						d = [d]
					}
					var f;
					for (var b = 0, a = d.length; b < a; b++) {
						f = d[b];
						if (e == "above") {
							c.parentNode.insertBefore(f, c)
						} else {
							if (e == "below") {
								c.parentNode.insertBefore(f, c.nextSibling)
							} else {
								c.appendChild(f)
							}
						}
					}
					f.ui.focus();
					if (Ext.enableFx && this.tree.hlDrop) {
						f.ui.highlight()
					}
					c.ui.endDrop();
					this.tree.fireEvent("nodedrop", g)
				},
				afterNodeMoved : function(a, c, f, d, b) {
					if (Ext.enableFx && this.tree.hlDrop) {
						b.ui.focus();
						b.ui.highlight()
					}
					this.tree.fireEvent("nodedrop", this.tree, d, c, a, f)
				},
				getTree : function() {
					return this.tree
				},
				removeDropIndicators : function(b) {
					if (b && b.ddel) {
						var a = b.ddel;
						Ext.fly(a).removeClass(["x-tree-drag-insert-above",
								"x-tree-drag-insert-below",
								"x-tree-drag-append"]);
						this.lastInsertClass = "_noclass"
					}
				},
				beforeDragDrop : function(b, a, c) {
					this.cancelExpand();
					return true
				},
				afterRepair : function(a) {
					if (a && Ext.enableFx) {
						a.node.ui.highlight()
					}
					this.hideProxy()
				}
			})
};