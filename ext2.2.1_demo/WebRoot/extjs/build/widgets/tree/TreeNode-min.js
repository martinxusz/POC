Ext.tree.TreeNode = function(a) {
	a = a || {};
	if (typeof a == "string") {
		a = {
			text : a
		}
	}
	this.childrenRendered = false;
	this.rendered = false;
	Ext.tree.TreeNode.superclass.constructor.call(this, a);
	this.expanded = a.expanded === true;
	this.isTarget = a.isTarget !== false;
	this.draggable = a.draggable !== false && a.allowDrag !== false;
	this.allowChildren = a.allowChildren !== false && a.allowDrop !== false;
	this.text = a.text;
	this.disabled = a.disabled === true;
	this.addEvents("textchange", "beforeexpand", "beforecollapse", "expand",
			"disabledchange", "collapse", "beforeclick", "click",
			"checkchange", "dblclick", "contextmenu", "beforechildrenrendered");
	var b = this.attributes.uiProvider || this.defaultUI || Ext.tree.TreeNodeUI;
	this.ui = new b(this)
};
Ext.extend(Ext.tree.TreeNode, Ext.data.Node, {
			preventHScroll : true,
			isExpanded : function() {
				return this.expanded
			},
			getUI : function() {
				return this.ui
			},
			getLoader : function() {
				var a;
				return this.loader
						|| ((a = this.getOwnerTree()) && a.loader
								? a.loader
								: new Ext.tree.TreeLoader())
			},
			setFirstChild : function(a) {
				var b = this.firstChild;
				Ext.tree.TreeNode.superclass.setFirstChild.call(this, a);
				if (this.childrenRendered && b && a != b) {
					b.renderIndent(true, true)
				}
				if (this.rendered) {
					this.renderIndent(true, true)
				}
			},
			setLastChild : function(b) {
				var a = this.lastChild;
				Ext.tree.TreeNode.superclass.setLastChild.call(this, b);
				if (this.childrenRendered && a && b != a) {
					a.renderIndent(true, true)
				}
				if (this.rendered) {
					this.renderIndent(true, true)
				}
			},
			appendChild : function(b) {
				if (!b.render && !Ext.isArray(b)) {
					b = this.getLoader().createNode(b)
				}
				var a = Ext.tree.TreeNode.superclass.appendChild.call(this, b);
				if (a && this.childrenRendered) {
					a.render()
				}
				this.ui.updateExpandIcon();
				return a
			},
			removeChild : function(a) {
				this.ownerTree.getSelectionModel().unselect(a);
				Ext.tree.TreeNode.superclass.removeChild.apply(this, arguments);
				if (this.childrenRendered) {
					a.ui.remove()
				}
				if (this.childNodes.length < 1) {
					this.collapse(false, false)
				} else {
					this.ui.updateExpandIcon()
				}
				if (!this.firstChild && !this.isHiddenRoot()) {
					this.childrenRendered = false
				}
				return a
			},
			insertBefore : function(c, a) {
				if (!c.render) {
					c = this.getLoader().createNode(c)
				}
				var b = Ext.tree.TreeNode.superclass.insertBefore.apply(this,
						arguments);
				if (b && a && this.childrenRendered) {
					c.render()
				}
				this.ui.updateExpandIcon();
				return b
			},
			setText : function(b) {
				var a = this.text;
				this.text = b;
				this.attributes.text = b;
				if (this.rendered) {
					this.ui.onTextChange(this, b, a)
				}
				this.fireEvent("textchange", this, b, a)
			},
			select : function() {
				this.getOwnerTree().getSelectionModel().select(this)
			},
			unselect : function() {
				this.getOwnerTree().getSelectionModel().unselect(this)
			},
			isSelected : function() {
				return this.getOwnerTree().getSelectionModel().isSelected(this)
			},
			expand : function(a, b, c) {
				if (!this.expanded) {
					if (this.fireEvent("beforeexpand", this, a, b) === false) {
						return
					}
					if (!this.childrenRendered) {
						this.renderChildren()
					}
					this.expanded = true;
					if (!this.isHiddenRoot()
							&& (this.getOwnerTree().animate && b !== false)
							|| b) {
						this.ui.animExpand(function() {
									this.fireEvent("expand", this);
									if (typeof c == "function") {
										c(this)
									}
									if (a === true) {
										this.expandChildNodes(true)
									}
								}.createDelegate(this));
						return
					} else {
						this.ui.expand();
						this.fireEvent("expand", this);
						if (typeof c == "function") {
							c(this)
						}
					}
				} else {
					if (typeof c == "function") {
						c(this)
					}
				}
				if (a === true) {
					this.expandChildNodes(true)
				}
			},
			isHiddenRoot : function() {
				return this.isRoot && !this.getOwnerTree().rootVisible
			},
			collapse : function(b, e) {
				if (this.expanded && !this.isHiddenRoot()) {
					if (this.fireEvent("beforecollapse", this, b, e) === false) {
						return
					}
					this.expanded = false;
					if ((this.getOwnerTree().animate && e !== false) || e) {
						this.ui.animCollapse(function() {
									this.fireEvent("collapse", this);
									if (b === true) {
										this.collapseChildNodes(true)
									}
								}.createDelegate(this));
						return
					} else {
						this.ui.collapse();
						this.fireEvent("collapse", this)
					}
				}
				if (b === true) {
					var d = this.childNodes;
					for (var c = 0, a = d.length; c < a; c++) {
						d[c].collapse(true, false)
					}
				}
			},
			delayedExpand : function(a) {
				if (!this.expandProcId) {
					this.expandProcId = this.expand.defer(a, this)
				}
			},
			cancelExpand : function() {
				if (this.expandProcId) {
					clearTimeout(this.expandProcId)
				}
				this.expandProcId = false
			},
			toggle : function() {
				if (this.expanded) {
					this.collapse()
				} else {
					this.expand()
				}
			},
			ensureVisible : function(b) {
				var a = this.getOwnerTree();
				a.expandPath(this.parentNode ? this.parentNode.getPath() : this
								.getPath(), false, function() {
							var c = a.getNodeById(this.id);
							a.getTreeEl().scrollChildIntoView(c.ui.anchor);
							Ext.callback(b)
						}.createDelegate(this))
			},
			expandChildNodes : function(b) {
				var d = this.childNodes;
				for (var c = 0, a = d.length; c < a; c++) {
					d[c].expand(b)
				}
			},
			collapseChildNodes : function(b) {
				var d = this.childNodes;
				for (var c = 0, a = d.length; c < a; c++) {
					d[c].collapse(b)
				}
			},
			disable : function() {
				this.disabled = true;
				this.unselect();
				if (this.rendered && this.ui.onDisableChange) {
					this.ui.onDisableChange(this, true)
				}
				this.fireEvent("disabledchange", this, true)
			},
			enable : function() {
				this.disabled = false;
				if (this.rendered && this.ui.onDisableChange) {
					this.ui.onDisableChange(this, false)
				}
				this.fireEvent("disabledchange", this, false)
			},
			renderChildren : function(b) {
				if (b !== false) {
					this.fireEvent("beforechildrenrendered", this)
				}
				var d = this.childNodes;
				for (var c = 0, a = d.length; c < a; c++) {
					d[c].render(true)
				}
				this.childrenRendered = true
			},
			sort : function(e, d) {
				Ext.tree.TreeNode.superclass.sort.apply(this, arguments);
				if (this.childrenRendered) {
					var c = this.childNodes;
					for (var b = 0, a = c.length; b < a; b++) {
						c[b].render(true)
					}
				}
			},
			render : function(a) {
				this.ui.render(a);
				if (!this.rendered) {
					this.getOwnerTree().registerNode(this);
					this.rendered = true;
					if (this.expanded) {
						this.expanded = false;
						this.expand(false, false)
					}
				}
			},
			renderIndent : function(b, e) {
				if (e) {
					this.ui.childIndent = null
				}
				this.ui.renderIndent();
				if (b === true && this.childrenRendered) {
					var d = this.childNodes;
					for (var c = 0, a = d.length; c < a; c++) {
						d[c].renderIndent(true, e)
					}
				}
			},
			beginUpdate : function() {
				this.childrenRendered = false
			},
			endUpdate : function() {
				if (this.expanded && this.rendered) {
					this.renderChildren()
				}
			},
			destroy : function() {
				if (this.childNodes) {
					for (var b = 0, a = this.childNodes.length; b < a; b++) {
						this.childNodes[b].destroy()
					}
					this.childNodes = null
				}
				if (this.ui.destroy) {
					this.ui.destroy()
				}
			}
		});
Ext.tree.TreePanel.nodeTypes.node = Ext.tree.TreeNode;