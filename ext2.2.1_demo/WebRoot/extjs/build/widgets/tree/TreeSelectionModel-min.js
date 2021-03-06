Ext.tree.DefaultSelectionModel = function(a) {
	this.selNode = null;
	this.addEvents("selectionchange", "beforeselect");
	Ext.apply(this, a);
	Ext.tree.DefaultSelectionModel.superclass.constructor.call(this)
};
Ext.extend(Ext.tree.DefaultSelectionModel, Ext.util.Observable, {
	init : function(a) {
		this.tree = a;
		a.getTreeEl().on("keydown", this.onKeyDown, this);
		a.on("click", this.onNodeClick, this)
	},
	onNodeClick : function(a, b) {
		this.select(a)
	},
	select : function(b) {
		var a = this.selNode;
		if (a != b && this.fireEvent("beforeselect", this, b, a) !== false) {
			if (a) {
				a.ui.onSelectedChange(false)
			}
			this.selNode = b;
			b.ui.onSelectedChange(true);
			this.fireEvent("selectionchange", this, b, a)
		}
		return b
	},
	unselect : function(a) {
		if (this.selNode == a) {
			this.clearSelections()
		}
	},
	clearSelections : function() {
		var a = this.selNode;
		if (a) {
			a.ui.onSelectedChange(false);
			this.selNode = null;
			this.fireEvent("selectionchange", this, null)
		}
		return a
	},
	getSelectedNode : function() {
		return this.selNode
	},
	isSelected : function(a) {
		return this.selNode == a
	},
	selectPrevious : function() {
		var a = this.selNode || this.lastSelNode;
		if (!a) {
			return null
		}
		var c = a.previousSibling;
		if (c) {
			if (!c.isExpanded() || c.childNodes.length < 1) {
				return this.select(c)
			} else {
				var b = c.lastChild;
				while (b && b.isExpanded() && b.childNodes.length > 0) {
					b = b.lastChild
				}
				return this.select(b)
			}
		} else {
			if (a.parentNode && (this.tree.rootVisible || !a.parentNode.isRoot)) {
				return this.select(a.parentNode)
			}
		}
		return null
	},
	selectNext : function() {
		var b = this.selNode || this.lastSelNode;
		if (!b) {
			return null
		}
		if (b.firstChild && b.isExpanded()) {
			return this.select(b.firstChild)
		} else {
			if (b.nextSibling) {
				return this.select(b.nextSibling)
			} else {
				if (b.parentNode) {
					var a = null;
					b.parentNode.bubble(function() {
								if (this.nextSibling) {
									a = this.getOwnerTree().selModel
											.select(this.nextSibling);
									return false
								}
							});
					return a
				}
			}
		}
		return null
	},
	onKeyDown : function(c) {
		var b = this.selNode || this.lastSelNode;
		var d = this;
		if (!b) {
			return
		}
		var a = c.getKey();
		switch (a) {
			case c.DOWN :
				c.stopEvent();
				this.selectNext();
				break;
			case c.UP :
				c.stopEvent();
				this.selectPrevious();
				break;
			case c.RIGHT :
				c.preventDefault();
				if (b.hasChildNodes()) {
					if (!b.isExpanded()) {
						b.expand()
					} else {
						if (b.firstChild) {
							this.select(b.firstChild, c)
						}
					}
				}
				break;
			case c.LEFT :
				c.preventDefault();
				if (b.hasChildNodes() && b.isExpanded()) {
					b.collapse()
				} else {
					if (b.parentNode
							&& (this.tree.rootVisible || b.parentNode != this.tree
									.getRootNode())) {
						this.select(b.parentNode, c)
					}
				}
				break
		}
	}
});
Ext.tree.MultiSelectionModel = function(a) {
	this.selNodes = [];
	this.selMap = {};
	this.addEvents("selectionchange");
	Ext.apply(this, a);
	Ext.tree.MultiSelectionModel.superclass.constructor.call(this)
};
Ext.extend(Ext.tree.MultiSelectionModel, Ext.util.Observable, {
			init : function(a) {
				this.tree = a;
				a.getTreeEl().on("keydown", this.onKeyDown, this);
				a.on("click", this.onNodeClick, this)
			},
			onNodeClick : function(a, b) {
				this.select(a, b, b.ctrlKey)
			},
			select : function(a, c, b) {
				if (b !== true) {
					this.clearSelections(true)
				}
				if (this.isSelected(a)) {
					this.lastSelNode = a;
					return a
				}
				this.selNodes.push(a);
				this.selMap[a.id] = a;
				this.lastSelNode = a;
				a.ui.onSelectedChange(true);
				this.fireEvent("selectionchange", this, this.selNodes);
				return a
			},
			unselect : function(b) {
				if (this.selMap[b.id]) {
					b.ui.onSelectedChange(false);
					var c = this.selNodes;
					var a = c.indexOf(b);
					if (a != -1) {
						this.selNodes.splice(a, 1)
					}
					delete this.selMap[b.id];
					this.fireEvent("selectionchange", this, this.selNodes)
				}
			},
			clearSelections : function(b) {
				var d = this.selNodes;
				if (d.length > 0) {
					for (var c = 0, a = d.length; c < a; c++) {
						d[c].ui.onSelectedChange(false)
					}
					this.selNodes = [];
					this.selMap = {};
					if (b !== true) {
						this.fireEvent("selectionchange", this, this.selNodes)
					}
				}
			},
			isSelected : function(a) {
				return this.selMap[a.id] ? true : false
			},
			getSelectedNodes : function() {
				return this.selNodes
			},
			onKeyDown : Ext.tree.DefaultSelectionModel.prototype.onKeyDown,
			selectNext : Ext.tree.DefaultSelectionModel.prototype.selectNext,
			selectPrevious : Ext.tree.DefaultSelectionModel.prototype.selectPrevious
		});