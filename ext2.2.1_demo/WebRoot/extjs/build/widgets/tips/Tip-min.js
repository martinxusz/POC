Ext.Tip = Ext.extend(Ext.Panel, {
	minWidth : 40,
	maxWidth : 300,
	shadow : "sides",
	defaultAlign : "tl-bl?",
	autoRender : true,
	quickShowInterval : 250,
	frame : true,
	hidden : true,
	baseCls : "x-tip",
	floating : {
		shadow : true,
		shim : true,
		useDisplay : true,
		constrain : false
	},
	autoHeight : true,
	initComponent : function() {
		Ext.Tip.superclass.initComponent.call(this);
		if (this.closable && !this.title) {
			this.elements += ",header"
		}
	},
	afterRender : function() {
		Ext.Tip.superclass.afterRender.call(this);
		if (this.closable) {
			this.addTool({
						id : "close",
						handler : this.hide,
						scope : this
					})
		}
	},
	showAt : function(a) {
		Ext.Tip.superclass.show.call(this);
		if (this.measureWidth !== false
				&& (!this.initialConfig || typeof this.initialConfig.width != "number")) {
			this.doAutoWidth()
		}
		if (this.constrainPosition) {
			a = this.el.adjustForConstraints(a)
		}
		this.setPagePosition(a[0], a[1])
	},
	doAutoWidth : function() {
		var a = this.body.getTextWidth();
		if (this.title) {
			a = Math.max(a, this.header.child("span").getTextWidth(this.title))
		}
		a += this.getFrameWidth() + (this.closable ? 20 : 0)
				+ this.body.getPadding("lr");
		this.setWidth(a.constrain(this.minWidth, this.maxWidth));
		if (Ext.isIE7 && !this.repainted) {
			this.el.repaint();
			this.repainted = true
		}
	},
	showBy : function(a, b) {
		if (!this.rendered) {
			this.render(Ext.getBody())
		}
		this.showAt(this.el.getAlignToXY(a, b || this.defaultAlign))
	},
	initDraggable : function() {
		this.dd = new Ext.Tip.DD(this, typeof this.draggable == "boolean"
						? null
						: this.draggable);
		this.header.addClass("x-tip-draggable")
	}
});
Ext.Tip.DD = function(b, a) {
	Ext.apply(this, a);
	this.tip = b;
	Ext.Tip.DD.superclass.constructor.call(this, b.el.id, "WindowDD-" + b.id);
	this.setHandleElId(b.header.id);
	this.scroll = false
};
Ext.extend(Ext.Tip.DD, Ext.dd.DD, {
			moveOnly : true,
			scroll : false,
			headerOffsets : [100, 25],
			startDrag : function() {
				this.tip.el.disableShadow()
			},
			endDrag : function(a) {
				this.tip.el.enableShadow(true)
			}
		});