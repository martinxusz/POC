Ext.dd.DropZone = function(b, a) {
	Ext.dd.DropZone.superclass.constructor.call(this, b, a)
};
Ext.extend(Ext.dd.DropZone, Ext.dd.DropTarget, {
			getTargetFromEvent : function(a) {
				return Ext.dd.Registry.getTargetFromEvent(a)
			},
			onNodeEnter : function(d, a, c, b) {
			},
			onNodeOver : function(d, a, c, b) {
				return this.dropAllowed
			},
			onNodeOut : function(d, a, c, b) {
			},
			onNodeDrop : function(d, a, c, b) {
				return false
			},
			onContainerOver : function(a, c, b) {
				return this.dropNotAllowed
			},
			onContainerDrop : function(a, c, b) {
				return false
			},
			notifyEnter : function(a, c, b) {
				return this.dropNotAllowed
			},
			notifyOver : function(a, c, b) {
				var d = this.getTargetFromEvent(c);
				if (!d) {
					if (this.lastOverNode) {
						this.onNodeOut(this.lastOverNode, a, c, b);
						this.lastOverNode = null
					}
					return this.onContainerOver(a, c, b)
				}
				if (this.lastOverNode != d) {
					if (this.lastOverNode) {
						this.onNodeOut(this.lastOverNode, a, c, b)
					}
					this.onNodeEnter(d, a, c, b);
					this.lastOverNode = d
				}
				return this.onNodeOver(d, a, c, b)
			},
			notifyOut : function(a, c, b) {
				if (this.lastOverNode) {
					this.onNodeOut(this.lastOverNode, a, c, b);
					this.lastOverNode = null
				}
			},
			notifyDrop : function(a, c, b) {
				if (this.lastOverNode) {
					this.onNodeOut(this.lastOverNode, a, c, b);
					this.lastOverNode = null
				}
				var d = this.getTargetFromEvent(c);
				return d ? this.onNodeDrop(d, a, c, b) : this.onContainerDrop(
						a, c, b)
			},
			triggerCacheRefresh : function() {
				Ext.dd.DDM.refreshCache(this.groups)
			}
		});