/* js:下拉框选择移焦处理combo */
/* 重写原keyup方法 */
Ext.override(Ext.form.ComboBox, {
			onKeyUp : function(e) {
				if (this.editable !== false && !e.isSpecialKey()) {
					if (!this.isExpanded()) {
						this.onTriggerClick();
						this.selectText(this.getRawValue().length,this.getRawValue().length);
					}
					var index = this.store.find(this.displayField, this
									.getRawValue());
					if (index !== -1) {
						this.select(this.store.getCount() - 1);
						this.select(index, true);
					} else {
						this.select(0, true);
						//this.setValue("");
					}
				}
			}
		});