Ext.layout.CardLayout = Ext.extend(Ext.layout.FitLayout, {
			deferredRender : false,
			renderHidden : true,
			setActiveItem : function(a) {
				a = this.container.getComponent(a);
				if (this.activeItem != a) {
					if (this.activeItem) {
						this.activeItem.hide()
					}
					this.activeItem = a;
					a.show();
					this.layout()
				}
			},
			renderAll : function(a, b) {
				if (this.deferredRender) {
					this.renderItem(this.activeItem, undefined, b)
				} else {
					Ext.layout.CardLayout.superclass.renderAll.call(this, a, b)
				}
			}
		});
Ext.Container.LAYOUTS.card = Ext.layout.CardLayout;