Ext.layout.FitLayout = Ext.extend(Ext.layout.ContainerLayout, {
			monitorResize : true,
			onLayout : function(a, b) {
				Ext.layout.FitLayout.superclass.onLayout.call(this, a, b);
				if (!this.container.collapsed) {
					this.setItemSize(this.activeItem || a.items.itemAt(0), b
									.getStyleSize())
				}
			},
			setItemSize : function(b, a) {
				if (b && a.height > 0) {
					b.setSize(a)
				}
			}
		});
Ext.Container.LAYOUTS.fit = Ext.layout.FitLayout;