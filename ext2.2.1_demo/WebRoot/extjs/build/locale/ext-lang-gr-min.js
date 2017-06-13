Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">Öüñôùóç...</div>';
if (Ext.View) {
	Ext.View.prototype.emptyText = ""
}
if (Ext.grid.GridPanel) {
	Ext.grid.GridPanel.prototype.ddText = "{0} åðéëåãì�?�ç(åò) ãñáììÞ(�?ò)"
}
if (Ext.TabPanelItem) {
	Ext.TabPanelItem.prototype.closeText = "Êëåßóôå áõôÞ ôç� êáñô�?ëá"
}
if (Ext.form.Field) {
	Ext.form.Field.prototype.invalidText = "Ç ôéìÞ óôï ðåäßï äå� åß�áé �?ãêõñç"
}
if (Ext.LoadMask) {
	Ext.LoadMask.prototype.msg = "Öüñôùóç..."
}
Date.monthNames = ["Éá�ïõÜñéïò", "ÖåâñïõÜñéïò", "ÌÜñôéïò", "�?ðñßëéïò",
		"ÌÜéïò", "Éïý�éïò", "Éïýëéïò", "�?ýãïõóôïò", "Óåðô�?ìâñéïò",
		"�?êôþâñéïò", "�?ï�?ìâñéïò", "Äåê�?ìâñéïò"];
Date.dayNames = ["ÊõñéáêÞ", "Äåõô�?ñá", "Ôñßôç", "ÔåôÜñôç", "�?�?ìðôç",
		"�?áñáóêåõÞ", "ÓÜââáôï"];
if (Ext.MessageBox) {
	Ext.MessageBox.buttonText = {
		ok : "Å�ôÜîåé",
		cancel : "�?êýñùóç",
		yes : "�?áé",
		no : "¼÷é"
	}
}
if (Ext.util.Format) {
	Ext.util.Format.date = function(a, b) {
		if (!a) {
			return ""
		}
		if (!(a instanceof Date)) {
			a = new Date(Date.parse(a))
		}
		return a.dateFormat(b || "ì/ç/Å")
	}
}
if (Ext.DatePicker) {
	Ext.apply(Ext.DatePicker.prototype, {
		todayText : "ÓÞìåñá",
		minText : "Ç çìåñïìç�ßá áõôÞ åß�áé ðñé� ôç� ìéêñüôåñç çìåñïìç�ßá",
		maxText : "Ç çìåñïìç�ßá áõôÞ åß�áé ìåôÜ ôç� ìåãáëýôåñç çìåñïìç�ßá",
		disabledDaysText : "",
		disabledDatesText : "",
		monthNames : Date.monthNames,
		dayNames : Date.dayNames,
		nextText : "Åðüìå�ïò ÌÞ�áò (Control+Right)",
		prevText : "�?ñïçãïýìå�ïò ÌÞ�áò (Control+Left)",
		monthYearText : "Åðéë�?îôå ÌÞ�á (Control+Up/Down ãéá ìåôáêß�çóç óôá �?ôç)",
		todayTip : "{0} (Spacebar)",
		format : "ì/ç/Å"
	})
}
if (Ext.PagingToolbar) {
	Ext.apply(Ext.PagingToolbar.prototype, {
				beforePageText : "Óåëßäá",
				afterPageText : "áðü {0}",
				firstText : "�?ñþôç óåëßäá",
				prevText : "�?ñïçãïýìå�ç óåëßäá",
				nextText : "Åðüìå�ç óåëßäá",
				lastText : "Ôåëåõôáßá óåëßäá",
				refreshText : "�?�á��?ùóç",
				displayMsg : "ÅìöÜ�éóç {0} - {1} áðü {2}",
				emptyMsg : "Äå� âñ�?èçêá� åããñáö�?ò ãéá åìöÜ�éóç"
			})
}
if (Ext.form.TextField) {
	Ext.apply(Ext.form.TextField.prototype, {
				minLengthText : "Ôï åëÜ÷éóôï ì�?ãåèïò ãéá áõôü ôï ðåäßï åß�áé {0}",
				maxLengthText : "Ôï ì�?ãéóôï ì�?ãåèïò ãéá áõôü ôï ðåäßï åß�áé {0}",
				blankText : "Ôï ðåäßï áõôü åß�áé õðï÷ñåùôïêü",
				regexText : "",
				emptyText : null
			})
}
if (Ext.form.NumberField) {
	Ext.apply(Ext.form.NumberField.prototype, {
				minText : "Ç åëÜ÷éóôç ôéìÞ ãéá áõôü ôï ðåäßï åß�áé {0}",
				maxText : "Ç ì�?ãéóôç ôéìÞ ãéá áõôü ôï ðåäßï åß�áé {0}",
				nanText : "{0} äå� åß�áé �?ãêõñïò áñéèìüò"
			})
}
if (Ext.form.DateField) {
	Ext.apply(Ext.form.DateField.prototype, {
		disabledDaysText : "�?ðå�åñãïðïéçì�?�ï",
		disabledDatesText : "�?ðå�åñãïðïéçì�?�ï",
		minText : "Ç çìåñïìç�ßá ó' áõôü ôï ðåäßï ðñ�?ðåé �á åß�áé ìåôÜ áðü {0}",
		maxText : "Ç çìåñïìç�ßá ó' áõôü ôï ðåäßï ðñ�?ðåé �á åß�áé ðñé� áðü {0}",
		invalidText : "{0} äå� åß�áé �?ãêõñç çìåñïìç�ßá - ðñ�?ðåé �á åß�áé ôçò ìïñöÞò {1}",
		format : "ì/ç/Å"
	})
}
if (Ext.form.ComboBox) {
	Ext.apply(Ext.form.ComboBox.prototype, {
				loadingText : "Öüñôùóç...",
				valueNotFoundText : undefined
			})
}
if (Ext.form.VTypes) {
	Ext.apply(Ext.form.VTypes, {
		emailText : '�?õôü ôï ðåäßï ðñ�?ðåé �á åß�áé e-mail address ôçò ìïñöÞò "user@domain.com"',
		urlText : '�?õôü ôï ðåäßï ðñ�?ðåé �á åß�áé ìéá äéåýèõ�óç URL ôçò ìïñöÞò "http://www.domain.com"',
		alphaText : "�?õôü ôï ðåäßï ðñ�?ðåé �á ðåñé�?÷åé ãñÜììáôá êáé _",
		alphanumText : "�?õôü ôï ðåäßï ðñ�?ðåé �á ðåñé�?÷åé ãñÜììáôá, áñéèìïýò êáé _"
	})
}
if (Ext.grid.GridView) {
	Ext.apply(Ext.grid.GridView.prototype, {
				sortAscText : "�?ýîïõóá Ôáîé�üìçóç",
				sortDescText : "Öèß�ïõóá Ôáîé�üìçóç",
				lockText : "Êëåßäùìá óôÞëçò",
				unlockText : "Îåêëåßäùìá óôÞëçò",
				columnsText : "ÓôÞëåò"
			})
}
if (Ext.grid.PropertyColumnModel) {
	Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
				nameText : "¼�ïìá",
				valueText : "ÔéìÞ",
				dateFormat : "ì/ç/Å"
			})
}
if (Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion) {
	Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
		splitTip : "Óýñåôå ãéá áëëáãÞ ìåã�?èïõò.",
		collapsibleSplitTip : "Óýñåôå ãéá áëëáãÞ ìåã�?èïõò. Double click ãéá áðüêñõøç."
	})
};