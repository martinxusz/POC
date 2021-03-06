Ext.StoreMgr = Ext.apply(new Ext.util.MixedCollection(), {
			register : function() {
				for (var a = 0, b; b = arguments[a]; a++) {
					this.add(b)
				}
			},
			unregister : function() {
				for (var a = 0, b; b = arguments[a]; a++) {
					this.remove(this.lookup(b))
				}
			},
			lookup : function(a) {
				return typeof a == "object" ? a : this.get(a)
			},
			getKey : function(a) {
				return a.storeId || a.id
			}
		});