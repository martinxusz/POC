Ext.layout.AbsoluteLayout = Ext.extend(Ext.layout.AnchorLayout, {
			extraCls : "x-abs-layout-item",
			isForm : false,
			setContainer : function(a) {
				Ext.layout.AbsoluteLayout.superclass.setContainer.call(this, a);
				if (a.isXType("form")) {
					this.isForm = true
				}
			},
			onLayout : function(a, b) {
				if (this.isForm) {
					a.body.position()
				} else {
					b.position()
				}
				Ext.layout.AbsoluteLayout.superclass.onLayout.call(this, a, b)
			},
			getAnchorViewSize : function(a, b) {
				return this.isForm
						? a.body.getStyleSize()
						: Ext.layout.AbsoluteLayout.superclass.getAnchorViewSize
								.call(this, a, b)
			},
			isValidParent : function(b, a) {
				return this.isForm
						? true
						: Ext.layout.AbsoluteLayout.superclass.isValidParent
								.call(this, b, a)
			},
			adjustWidthAnchor : function(b, a) {
				return b ? b - a.getPosition(true)[0] : b
			},
			adjustHeightAnchor : function(b, a) {
				return b ? b - a.getPosition(true)[1] : b
			}
		});
Ext.Container.LAYOUTS.absolute = Ext.layout.AbsoluteLayout;