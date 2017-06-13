Ext.layout.Accordion = Ext.extend(Ext.layout.FitLayout, {
			fill : true,
			autoWidth : true,
			titleCollapse : true,
			hideCollapseTool : false,
			collapseFirst : false,
			animate : false,
			sequence : false,
			activeOnTop : false,
			renderItem : function(a) {
				if (this.animate === false) {
					a.animCollapse = false
				}
				a.collapsible = true;
				if (this.autoWidth) {
					a.autoWidth = true
				}
				if (this.titleCollapse) {
					a.titleCollapse = true
				}
				if (this.hideCollapseTool) {
					a.hideCollapseTool = true
				}
				if (this.collapseFirst !== undefined) {
					a.collapseFirst = this.collapseFirst
				}
				if (!this.activeItem && !a.collapsed) {
					this.activeItem = a
				} else {
					if (this.activeItem) {
						a.collapsed = true
					}
				}
				Ext.layout.Accordion.superclass.renderItem.apply(this,
						arguments);
				a.header.addClass("x-accordion-hd");
				a.on("beforeexpand", this.beforeExpand, this)
			},
			beforeExpand : function(c, b) {
				var a = this.activeItem;
				if (a) {
					if (this.sequence) {
						delete this.activeItem;
						if (!a.collapsed) {
							a.collapse({
										callback : function() {
											c.expand(b || true)
										},
										scope : this
									});
							return false
						}
					} else {
						a.collapse(this.animate)
					}
				}
				this.activeItem = c;
				if (this.activeOnTop) {
					c.el.dom.parentNode.insertBefore(c.el.dom,
							c.el.dom.parentNode.firstChild)
				}
				this.layout()
			},
			setItemSize : function(f, e) {
				if (this.fill && f) {
					var b = this.container.items.items;
					var d = 0;
					for (var c = 0, a = b.length; c < a; c++) {
						var g = b[c];
						if (g != f) {
							d += (g.getSize().height - g.bwrap.getHeight())
						}
					}
					e.height -= d;
					f.setSize(e)
				}
			}
		});
Ext.Container.LAYOUTS.accordion = Ext.layout.Accordion;