Ext.grid.GridDragZone = function(b, a) {
	this.view = b.getView();
	Ext.grid.GridDragZone.superclass.constructor.call(this,
			this.view.mainBody.dom, a);
	if (this.view.lockedBody) {
		this.setHandleElId(Ext.id(this.view.mainBody.dom));
		this.setOuterHandleElId(Ext.id(this.view.lockedBody.dom))
	}
	this.scroll = false;
	this.grid = b;
	this.ddel = document.createElement("div");
	this.ddel.className = "x-grid-dd-wrap"
};
Ext.extend(Ext.grid.GridDragZone, Ext.dd.DragZone, {
			ddGroup : "GridDD",
			getDragData : function(b) {
				var a = Ext.lib.Event.getTarget(b);
				var d = this.view.findRowIndex(a);
				if (d !== false) {
					var c = this.grid.selModel;
					if (!c.isSelected(d) || b.hasModifier()) {
						c.handleMouseDown(this.grid, d, b)
					}
					return {
						grid : this.grid,
						ddel : this.ddel,
						rowIndex : d,
						selections : c.getSelections()
					}
				}
				return false
			},
			onInitDrag : function(b) {
				var a = this.dragData;
				this.ddel.innerHTML = this.grid.getDragDropText();
				this.proxy.update(this.ddel)
			},
			afterRepair : function() {
				this.dragging = false
			},
			getRepairXY : function(b, a) {
				return false
			},
			onEndDrag : function(a, b) {
			},
			onValidDrop : function(a, b, c) {
				this.hideProxy()
			},
			beforeInvalidDrop : function(a, b) {
			}
		});