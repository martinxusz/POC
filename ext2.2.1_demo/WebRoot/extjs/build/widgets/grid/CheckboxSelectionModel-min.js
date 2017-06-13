Ext.grid.CheckboxSelectionModel = Ext.extend(Ext.grid.RowSelectionModel, {
			header : '<div class="x-grid3-hd-checker">&#160;</div>',
			width : 20,
			sortable : false,
			menuDisabled : true,
			fixed : true,
			dataIndex : "",
			id : "checker",
			initEvents : function() {
				Ext.grid.CheckboxSelectionModel.superclass.initEvents
						.call(this);
				this.grid.on("render", function() {
							var a = this.grid.getView();
							a.mainBody.on("mousedown", this.onMouseDown, this);
							Ext.fly(a.innerHd).on("mousedown",
									this.onHdMouseDown, this)
						}, this)
			},
			onMouseDown : function(c, b) {
				if (c.button === 0 && b.className == "x-grid3-row-checker") {
					c.stopEvent();
					var d = c.getTarget(".x-grid3-row");
					if (d) {
						var a = d.rowIndex;
						if (this.isSelected(a)) {
							this.deselectRow(a)
						} else {
							this.selectRow(a, true)
						}
					}
				}
			},
			onHdMouseDown : function(c, a) {
				if (a.className == "x-grid3-hd-checker") {
					c.stopEvent();
					var b = Ext.fly(a.parentNode);
					var d = b.hasClass("x-grid3-hd-checker-on");
					if (d) {
						b.removeClass("x-grid3-hd-checker-on");
						this.clearSelections()
					} else {
						b.addClass("x-grid3-hd-checker-on");
						this.selectAll()
					}
				}
			},
			renderer : function(b, c, a) {
				return '<div class="x-grid3-row-checker">&#160;</div>'
			}
		});