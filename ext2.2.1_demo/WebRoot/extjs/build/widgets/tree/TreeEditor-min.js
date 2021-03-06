Ext.tree.TreeEditor = function(a, c, b) {
	c = c || {};
	var d = c.events ? c : new Ext.form.TextField(c);
	Ext.tree.TreeEditor.superclass.constructor.call(this, d, b);
	this.tree = a;
	if (!a.rendered) {
		a.on("render", this.initEditor, this)
	} else {
		this.initEditor(a)
	}
};
Ext.extend(Ext.tree.TreeEditor, Ext.Editor, {
			alignment : "l-l",
			autoSize : false,
			hideEl : false,
			cls : "x-small-editor x-tree-editor",
			shim : false,
			shadow : "frame",
			maxWidth : 250,
			editDelay : 350,
			initEditor : function(a) {
				a.on("beforeclick", this.beforeNodeClick, this);
				a.on("dblclick", this.onNodeDblClick, this);
				this.on("complete", this.updateNode, this);
				this.on("beforestartedit", this.fitToTree, this);
				this.on("startedit", this.bindScroll, this, {
							delay : 10
						});
				this.on("specialkey", this.onSpecialKey, this)
			},
			fitToTree : function(b, c) {
				var e = this.tree.getTreeEl().dom, d = c.dom;
				if (e.scrollLeft > d.offsetLeft) {
					e.scrollLeft = d.offsetLeft
				}
				var a = Math.min(this.maxWidth, (e.clientWidth > 20
								? e.clientWidth
								: e.offsetWidth)
								- Math.max(0, d.offsetLeft - e.scrollLeft) - 5);
				this.setSize(a, "")
			},
			triggerEdit : function(a, b) {
				this.completeEdit();
				if (a.attributes.editable !== false) {
					this.editNode = a;
					if (this.tree.autoScroll) {
						a.ui.getEl().scrollIntoView(this.tree.body)
					}
					this.autoEditTimer = this.startEdit.defer(this.editDelay,
							this, [a.ui.textNode, a.text]);
					return false
				}
			},
			bindScroll : function() {
				this.tree.getTreeEl().on("scroll", this.cancelEdit, this)
			},
			beforeNodeClick : function(a, b) {
				clearTimeout(this.autoEditTimer);
				if (this.tree.getSelectionModel().isSelected(a)) {
					b.stopEvent();
					return this.triggerEdit(a)
				}
			},
			onNodeDblClick : function(a, b) {
				clearTimeout(this.autoEditTimer)
			},
			updateNode : function(a, b) {
				this.tree.getTreeEl().un("scroll", this.cancelEdit, this);
				this.editNode.setText(b)
			},
			onHide : function() {
				Ext.tree.TreeEditor.superclass.onHide.call(this);
				if (this.editNode) {
					this.editNode.ui.focus.defer(50, this.editNode.ui)
				}
			},
			onSpecialKey : function(c, b) {
				var a = b.getKey();
				if (a == b.ESC) {
					b.stopEvent();
					this.cancelEdit()
				} else {
					if (a == b.ENTER && !b.hasModifier()) {
						b.stopEvent();
						this.completeEdit()
					}
				}
			}
		});