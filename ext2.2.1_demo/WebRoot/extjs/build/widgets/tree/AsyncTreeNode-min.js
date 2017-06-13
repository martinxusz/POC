Ext.tree.AsyncTreeNode = function(a) {
	this.loaded = a && a.loaded === true;
	this.loading = false;
	Ext.tree.AsyncTreeNode.superclass.constructor.apply(this, arguments);
	this.addEvents("beforeload", "load")
};
Ext.extend(Ext.tree.AsyncTreeNode, Ext.tree.TreeNode, {
	expand : function(b, d, g) {
		if (this.loading) {
			var e;
			var c = function() {
				if (!this.loading) {
					clearInterval(e);
					this.expand(b, d, g)
				}
			}.createDelegate(this);
			e = setInterval(c, 200);
			return
		}
		if (!this.loaded) {
			if (this.fireEvent("beforeload", this) === false) {
				return
			}
			this.loading = true;
			this.ui.beforeLoad(this);
			var a = this.loader || this.attributes.loader
					|| this.getOwnerTree().getLoader();
			if (a) {
				a.load(this, this.loadComplete.createDelegate(this, [b, d, g]));
				return
			}
		}
		Ext.tree.AsyncTreeNode.superclass.expand.call(this, b, d, g)
	},
	isLoading : function() {
		return this.loading
	},
	loadComplete : function(a, b, c) {
		this.loading = false;
		this.loaded = true;
		this.ui.afterLoad(this);
		this.fireEvent("load", this);
		this.expand(a, b, c)
	},
	isLoaded : function() {
		return this.loaded
	},
	hasChildNodes : function() {
		if (!this.isLeaf() && !this.loaded) {
			return true
		} else {
			return Ext.tree.AsyncTreeNode.superclass.hasChildNodes.call(this)
		}
	},
	reload : function(a) {
		this.collapse(false, false);
		while (this.firstChild) {
			this.removeChild(this.firstChild).destroy()
		}
		this.childrenRendered = false;
		this.loaded = false;
		if (this.isHiddenRoot()) {
			this.expanded = false
		}
		this.expand(false, false, a)
	}
});
Ext.tree.TreePanel.nodeTypes.async = Ext.tree.AsyncTreeNode;