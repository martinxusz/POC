Ext.Viewport = Ext.extend(Ext.Container, {
			initComponent : function() {
				Ext.Viewport.superclass.initComponent.call(this);
				document.getElementsByTagName("html")[0].className += " x-viewport";
				this.el = Ext.getBody();
				this.el.setHeight = Ext.emptyFn;
				this.el.setWidth = Ext.emptyFn;
				this.el.setSize = Ext.emptyFn;
				this.el.dom.scroll = "no";
				this.allowDomMove = false;
				this.autoWidth = true;
				this.autoHeight = true;
				Ext.EventManager.onWindowResize(this.fireResize, this);
				this.renderTo = this.el
			},
			fireResize : function(a, b) {
				this.fireEvent("resize", this, a, b, a, b)
			}
		});
Ext.reg("viewport", Ext.Viewport);