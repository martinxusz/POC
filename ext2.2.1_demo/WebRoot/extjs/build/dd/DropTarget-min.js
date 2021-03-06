Ext.dd.DropTarget = function(b, a) {
	this.el = Ext.get(b);
	Ext.apply(this, a);
	if (this.containerScroll) {
		Ext.dd.ScrollManager.register(this.el)
	}
	Ext.dd.DropTarget.superclass.constructor.call(this, this.el.dom,
			this.ddGroup || this.group, {
				isTarget : true
			})
};
Ext.extend(Ext.dd.DropTarget, Ext.dd.DDTarget, {
			dropAllowed : "x-dd-drop-ok",
			dropNotAllowed : "x-dd-drop-nodrop",
			isTarget : true,
			isNotifyTarget : true,
			notifyEnter : function(a, c, b) {
				if (this.overClass) {
					this.el.addClass(this.overClass)
				}
				return this.dropAllowed
			},
			notifyOver : function(a, c, b) {
				return this.dropAllowed
			},
			notifyOut : function(a, c, b) {
				if (this.overClass) {
					this.el.removeClass(this.overClass)
				}
			},
			notifyDrop : function(a, c, b) {
				return false
			}
		});