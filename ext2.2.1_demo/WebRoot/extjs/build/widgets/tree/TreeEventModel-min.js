Ext.tree.TreeEventModel = function(a) {
	this.tree = a;
	this.tree.on("render", this.initEvents, this)
};
Ext.tree.TreeEventModel.prototype = {
	initEvents : function() {
		var a = this.tree.getTreeEl();
		a.on("click", this.delegateClick, this);
		if (this.tree.trackMouseOver !== false) {
			a.on("mouseover", this.delegateOver, this);
			a.on("mouseout", this.delegateOut, this)
		}
		a.on("dblclick", this.delegateDblClick, this);
		a.on("contextmenu", this.delegateContextMenu, this)
	},
	getNode : function(b) {
		var a;
		if (a = b.getTarget(".x-tree-node-el", 10)) {
			var c = Ext.fly(a, "_treeEvents").getAttributeNS("ext",
					"tree-node-id");
			if (c) {
				return this.tree.getNodeById(c)
			}
		}
		return null
	},
	getNodeTarget : function(b) {
		var a = b.getTarget(".x-tree-node-icon", 1);
		if (!a) {
			a = b.getTarget(".x-tree-node-el", 6)
		}
		return a
	},
	delegateOut : function(b, a) {
		if (!this.beforeEvent(b)) {
			return
		}
		if (b.getTarget(".x-tree-ec-icon", 1)) {
			var c = this.getNode(b);
			this.onIconOut(b, c);
			if (c == this.lastEcOver) {
				delete this.lastEcOver
			}
		}
		if ((a = this.getNodeTarget(b)) && !b.within(a, true)) {
			this.onNodeOut(b, this.getNode(b))
		}
	},
	delegateOver : function(b, a) {
		if (!this.beforeEvent(b)) {
			return
		}
		if (this.lastEcOver) {
			this.onIconOut(b, this.lastEcOver);
			delete this.lastEcOver
		}
		if (b.getTarget(".x-tree-ec-icon", 1)) {
			this.lastEcOver = this.getNode(b);
			this.onIconOver(b, this.lastEcOver)
		}
		if (a = this.getNodeTarget(b)) {
			this.onNodeOver(b, this.getNode(b))
		}
	},
	delegateClick : function(b, a) {
		if (!this.beforeEvent(b)) {
			return
		}
		if (b.getTarget("input[type=checkbox]", 1)) {
			this.onCheckboxClick(b, this.getNode(b))
		} else {
			if (b.getTarget(".x-tree-ec-icon", 1)) {
				this.onIconClick(b, this.getNode(b))
			} else {
				if (this.getNodeTarget(b)) {
					this.onNodeClick(b, this.getNode(b))
				}
			}
		}
	},
	delegateDblClick : function(b, a) {
		if (this.beforeEvent(b) && this.getNodeTarget(b)) {
			this.onNodeDblClick(b, this.getNode(b))
		}
	},
	delegateContextMenu : function(b, a) {
		if (this.beforeEvent(b) && this.getNodeTarget(b)) {
			this.onNodeContextMenu(b, this.getNode(b))
		}
	},
	onNodeClick : function(b, a) {
		a.ui.onClick(b)
	},
	onNodeOver : function(b, a) {
		a.ui.onOver(b)
	},
	onNodeOut : function(b, a) {
		a.ui.onOut(b)
	},
	onIconOver : function(b, a) {
		a.ui.addClass("x-tree-ec-over")
	},
	onIconOut : function(b, a) {
		a.ui.removeClass("x-tree-ec-over")
	},
	onIconClick : function(b, a) {
		a.ui.ecClick(b)
	},
	onCheckboxClick : function(b, a) {
		a.ui.onCheckChange(b)
	},
	onNodeDblClick : function(b, a) {
		a.ui.onDblClick(b)
	},
	onNodeContextMenu : function(b, a) {
		a.ui.onContextMenu(b)
	},
	beforeEvent : function(a) {
		if (this.disabled) {
			a.stopEvent();
			return false
		}
		return true
	},
	disable : function() {
		this.disabled = true
	},
	enable : function() {
		this.disabled = false
	}
};