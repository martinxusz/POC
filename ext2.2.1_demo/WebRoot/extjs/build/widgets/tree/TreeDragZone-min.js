if (Ext.dd.DragZone) {
	Ext.tree.TreeDragZone = function(a, b) {
		Ext.tree.TreeDragZone.superclass.constructor.call(this, a.getTreeEl(),
				b);
		this.tree = a
	};
	Ext.extend(Ext.tree.TreeDragZone, Ext.dd.DragZone, {
		ddGroup : "TreeDD",
		onBeforeDrag : function(a, b) {
			var c = a.node;
			return c && c.draggable && !c.disabled
		},
		onInitDrag : function(b) {
			var a = this.dragData;
			this.tree.getSelectionModel().select(a.node);
			this.tree.eventModel.disable();
			this.proxy.update("");
			a.node.ui.appendDDGhost(this.proxy.ghost.dom);
			this.tree.fireEvent("startdrag", this.tree, a.node, b)
		},
		getRepairXY : function(b, a) {
			return a.node.ui.getDDRepairXY()
		},
		onEndDrag : function(a, b) {
			this.tree.eventModel.enable.defer(100, this.tree.eventModel);
			this.tree.fireEvent("enddrag", this.tree, a.node, b)
		},
		onValidDrop : function(a, b, c) {
			this.tree
					.fireEvent("dragdrop", this.tree, this.dragData.node, a, b);
			this.hideProxy()
		},
		beforeInvalidDrop : function(a, c) {
			var b = this.tree.getSelectionModel();
			b.clearSelections();
			b.select(this.dragData.node)
		},
		afterRepair : function() {
			if (Ext.enableFx && this.tree.hlDrop) {
				Ext.Element.fly(this.dragData.ddel).highlight(this.hlColor
						|| "c3daf9")
			}
			this.dragging = false
		}
	})
};