Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">Nahrávam...</div>';
if (Ext.View) {
	Ext.View.prototype.emptyText = ""
}
if (Ext.grid.GridPanel) {
	Ext.grid.GridPanel.prototype.ddText = "{0} ozna�?ených riadkov"
}
if (Ext.TabPanelItem) {
	Ext.TabPanelItem.prototype.closeText = "Zavrieť túto záložku"
}
if (Ext.form.Field) {
	Ext.form.Field.prototype.invalidText = "Hodnota v tomto poli je nesprávna"
}
if (Ext.LoadMask) {
	Ext.LoadMask.prototype.msg = "Nahrávam..."
}
Date.monthNames = ["Január", "Február", "Marec", "Apr�l", "Máj", "Jún", "Júl",
		"August", "September", "Október", "November", "December"];
Date.dayNames = ["Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok",
		"Sobota"];
if (Ext.MessageBox) {
	Ext.MessageBox.buttonText = {
		ok : "OK",
		cancel : "Zrušiť",
		yes : "�?no",
		no : "Nie"
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
		return a.dateFormat(b || "d.m.Y")
	}
}
if (Ext.DatePicker) {
	Ext.apply(Ext.DatePicker.prototype, {
				todayText : "Dnes",
				minText : "Tento dátum je menš� ako minimálny možný dátum",
				maxText : "Tento dátum je vä�?š� ako maximálny možný dátum",
				disabledDaysText : "",
				disabledDatesText : "",
				monthNames : Date.monthNames,
				dayNames : Date.dayNames,
				nextText : "Ďalš� Mesiac (Control+Doprava)",
				prevText : "Predch. Mesiac (Control+Doľava)",
				monthYearText : "Vyberte Mesiac (Control+Hore/Dole pre posun rokov)",
				todayTip : "{0} (Medzern�k)",
				format : "d.m.Y"
			})
}
if (Ext.PagingToolbar) {
	Ext.apply(Ext.PagingToolbar.prototype, {
				beforePageText : "Strana",
				afterPageText : "z {0}",
				firstText : "Prvá Strana",
				prevText : "Predch. Strana",
				nextText : "Ďalšia Strana",
				lastText : "Posledná strana",
				refreshText : "Obnoviť",
				displayMsg : "Zobrazujem {0} - {1} z {2}",
				emptyMsg : "iadne dáta"
			})
}
if (Ext.form.TextField) {
	Ext.apply(Ext.form.TextField.prototype, {
				minLengthText : "Minimálna dĺžka pre toto pole je {0}",
				maxLengthText : "Maximálna dĺžka pre toto pole je {0}",
				blankText : "Toto pole je povinné",
				regexText : "",
				emptyText : null
			})
}
if (Ext.form.NumberField) {
	Ext.apply(Ext.form.NumberField.prototype, {
				minText : "Minimálna hodnota pre toto pole je {0}",
				maxText : "Maximálna hodnota pre toto pole je {0}",
				nanText : "{0} je nesprávne �?�slo"
			})
}
if (Ext.form.DateField) {
	Ext.apply(Ext.form.DateField.prototype, {
				disabledDaysText : "Zablokované",
				disabledDatesText : "Zablokované",
				minText : "Dátum v tomto poli mus� byť až po {0}",
				maxText : "Dátum v tomto poli mus� byť pred {0}",
				invalidText : "{0} nie je správny dátum - mus� byť vo formáte {1}",
				format : "d.m.Y"
			})
}
if (Ext.form.ComboBox) {
	Ext.apply(Ext.form.ComboBox.prototype, {
				loadingText : "Nahrávam...",
				valueNotFoundText : undefined
			})
}
if (Ext.form.VTypes) {
	Ext.apply(Ext.form.VTypes, {
		emailText : 'Toto pole mus� byť e-mailová adresa vo formáte "user@domain.com"',
		urlText : 'Toto pole mus� byť URL vo formáte "http://www.domain.com"',
		alphaText : "Toto pole može obsahovať iba p�smená a znak _",
		alphanumText : "Toto pole može obsahovať iba p�smená, �?�sla a znak _"
	})
}
if (Ext.grid.GridView) {
	Ext.apply(Ext.grid.GridView.prototype, {
				sortAscText : "Zoradiť vzostupne",
				sortDescText : "Zoradiť zostupne",
				lockText : "Zamknúť stľpec",
				unlockText : "Odomknúť stľpec",
				columnsText : "Stľpce"
			})
}
if (Ext.grid.PropertyColumnModel) {
	Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
				nameText : "Názov",
				valueText : "Hodnota",
				dateFormat : "d.m.Y"
			})
}
if (Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion) {
	Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
		splitTip : "Potiahnite pre zmenu rozmeru",
		collapsibleSplitTip : "Potiahnite pre zmenu rozmeru. Dvojklikom schováte."
	})
};