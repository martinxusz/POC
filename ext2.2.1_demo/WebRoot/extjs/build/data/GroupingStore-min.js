Ext.data.GroupingStore = Ext.extend(Ext.data.Store, {
			remoteGroup : false,
			groupOnSort : false,
			clearGrouping : function() {
				this.groupField = false;
				if (this.remoteGroup) {
					if (this.baseParams) {
						delete this.baseParams.groupBy
					}
					this.reload()
				} else {
					this.applySort();
					this.fireEvent("datachanged", this)
				}
			},
			groupBy : function(c, b) {
				if (this.groupField == c && !b) {
					return
				}
				this.groupField = c;
				if (this.remoteGroup) {
					if (!this.baseParams) {
						this.baseParams = {}
					}
					this.baseParams.groupBy = c
				}
				if (this.groupOnSort) {
					this.sort(c);
					return
				}
				if (this.remoteGroup) {
					this.reload()
				} else {
					var a = this.sortInfo || {};
					if (a.field != c) {
						this.applySort()
					} else {
						this.sortData(c)
					}
					this.fireEvent("datachanged", this)
				}
			},
			applySort : function() {
				Ext.data.GroupingStore.superclass.applySort.call(this);
				if (!this.groupOnSort && !this.remoteGroup) {
					var a = this.getGroupState();
					if (a && a != this.sortInfo.field) {
						this.sortData(this.groupField)
					}
				}
			},
			applyGrouping : function(a) {
				if (this.groupField !== false) {
					this.groupBy(this.groupField, true);
					return true
				} else {
					if (a === true) {
						this.fireEvent("datachanged", this)
					}
					return false
				}
			},
			getGroupState : function() {
				return this.groupOnSort && this.groupField !== false
						? (this.sortInfo ? this.sortInfo.field : undefined)
						: this.groupField
			}
		});