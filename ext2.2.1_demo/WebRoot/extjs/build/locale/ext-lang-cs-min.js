Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">Pros�m �?ekejte...</div>';
if (Ext.View) {
	Ext.View.prototype.emptyText = ""
}
if (Ext.grid.GridPanel) {
	Ext.grid.GridPanel.prototype.ddText = "{0} vybraných řádků"
}
if (Ext.TabPanelItem) {
	Ext.TabPanelItem.prototype.closeText = "Zavř�t záložku"
}
if (Ext.form.Field) {
	Ext.form.Field.prototype.invalidText = "Hodnota v tomto poli je neplatná"
}
if (Ext.LoadMask) {
	Ext.LoadMask.prototype.msg = "Pros�m �?ekejte..."
}
Date.monthNames = ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen",
		"Červenec", "Srpen", "Zář�", "Ř�jen", "Listopad", "Prosinec"];
Date.getShortMonthName = function(a) {
	return Date.monthNames[a].substring(0, 3)
};
Date.monthNumbers = {
	Jan : 0,
	Feb : 1,
	Mar : 2,
	Apr : 3,
	May : 4,
	Jun : 5,
	Jul : 6,
	Aug : 7,
	Sep : 8,
	Oct : 9,
	Nov : 10,
	Dec : 11
};
Date.getMonthNumber = function(a) {
	return Date.monthNumbers[a.substring(0, 1).toUpperCase()
			+ a.substring(1, 3).toLowerCase()]
};
Date.dayNames = ["Neděle", "Ponděl�", "Úterý", "Středa", "Čtvrtek", "Pátek",
		"Sobota"];
Date.getShortDayName = function(a) {
	return Date.dayNames[a].substring(0, 3)
};
if (Ext.MessageBox) {
	Ext.MessageBox.buttonText = {
		ok : "OK",
		cancel : "Storno",
		yes : "Ano",
		no : "Ne"
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
				minText : "Datum nesm� být starš� než je minimáln�",
				maxText : "Datum nesm� být dř�vějš� než je maximáln�",
				disabledDaysText : "",
				disabledDatesText : "",
				monthNames : Date.monthNames,
				dayNames : Date.dayNames,
				nextText : "Následuj�c� měs�c (Control+Right)",
				prevText : "Předcházej�c� měs�c (Control+Left)",
				monthYearText : "Zvolte měs�c (ke změně let použijte Control+Up/Down)",
				todayTip : "{0} (Spacebar)",
				format : "d.m.Y",
				okText : "&#160;OK&#160;",
				cancelText : "Storno",
				startDay : 1
			})
}
if (Ext.PagingToolbar) {
	Ext.apply(Ext.PagingToolbar.prototype, {
				beforePageText : "Strana",
				afterPageText : "z {0}",
				firstText : "Prvn� strana",
				prevText : "Přecházej�c� strana",
				nextText : "Následuj�c� strana",
				lastText : "Posledn� strana",
				refreshText : "Aktualizovat",
				displayMsg : "Zobrazeno {0} - {1} z celkových {2}",
				emptyMsg : "Žádné záznamy nebyly nalezeny"
			})
}
if (Ext.form.TextField) {
	Ext.apply(Ext.form.TextField.prototype, {
				minLengthText : "Pole nesm� m�t méně {0} znaků",
				maxLengthText : "Pole nesm� být delš� než {0} znaků",
				blankText : "This field is required",
				regexText : "",
				emptyText : null
			})
}
if (Ext.form.NumberField) {
	Ext.apply(Ext.form.NumberField.prototype, {
				minText : "Hodnota v tomto poli nesm� být menš� než {0}",
				maxText : "Hodnota v tomto poli nesm� být větš� než {0}",
				nanText : "{0} nen� platné �?�slo"
			})
}
if (Ext.form.DateField) {
	Ext.apply(Ext.form.DateField.prototype, {
		disabledDaysText : "Neaktivn�",
		disabledDatesText : "Neaktivn�",
		minText : "Datum v tomto poli nesm� být starš� než {0}",
		maxText : "Datum v tomto poli nesm� být novějš� než {0}",
		invalidText : "{0} nen� platným datem - zkontrolujte zda-li je ve formátu {1}",
		format : "d.m.Y",
		altFormats : "d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|Y-m-d"
	})
}
if (Ext.form.ComboBox) {
	Ext.apply(Ext.form.ComboBox.prototype, {
				loadingText : "Pros�m �?ekejte...",
				valueNotFoundText : undefined
			})
}
if (Ext.form.VTypes) {
	Ext.apply(Ext.form.VTypes, {
		emailText : 'V tomto poli může být vyplněna pouze emailová adresa ve formátu "uživatel@doména.cz"',
		urlText : 'V tomto poli může být vyplněna pouze URL (adresa internetové stránky) ve formátu "http://www.doména.cz"',
		alphaText : "Toto pole může obsahovat pouze p�smena abecedy a znak _",
		alphanumText : "Toto pole může obsahovat pouze p�smena abecedy, �?�sla a znak _"
	})
}
if (Ext.form.HtmlEditor) {
	Ext.apply(Ext.form.HtmlEditor.prototype, {
		createLinkText : "Zadejte URL adresu odkazu:",
		buttonTips : {
			bold : {
				title : "Tu�?né (Ctrl+B)",
				text : "Ozna�?� vybraný text tu�?ně.",
				cls : "x-html-editor-tip"
			},
			italic : {
				title : "Kurz�va (Ctrl+I)",
				text : "Ozna�?� vybraný text kurz�vou.",
				cls : "x-html-editor-tip"
			},
			underline : {
				title : "Podtržen� (Ctrl+U)",
				text : "Podtrhne vybraný text.",
				cls : "x-html-editor-tip"
			},
			increasefontsize : {
				title : "Zvětšit p�smo",
				text : "Zvětš� velikost p�sma.",
				cls : "x-html-editor-tip"
			},
			decreasefontsize : {
				title : "Zúžit p�smo",
				text : "Zmenš� velikost p�sma.",
				cls : "x-html-editor-tip"
			},
			backcolor : {
				title : "Barva zvýrazněn� textu",
				text : "Ozna�?� vybraný text tak, aby vypadal jako ozna�?ený zvýrazňova�?em.",
				cls : "x-html-editor-tip"
			},
			forecolor : {
				title : "Barva p�sma",
				text : "Změn� barvu textu.",
				cls : "x-html-editor-tip"
			},
			justifyleft : {
				title : "Zarovnat text vlevo",
				text : "Zarovná text doleva.",
				cls : "x-html-editor-tip"
			},
			justifycenter : {
				title : "Zarovnat na střed",
				text : "Zarovná text na střed.",
				cls : "x-html-editor-tip"
			},
			justifyright : {
				title : "Zarovnat text vpravo",
				text : "Zarovná text doprava.",
				cls : "x-html-editor-tip"
			},
			insertunorderedlist : {
				title : "Odrážky",
				text : "Za�?ne seznam s odrážkami.",
				cls : "x-html-editor-tip"
			},
			insertorderedlist : {
				title : "Č�slován�",
				text : "Za�?ne �?�slovaný seznam.",
				cls : "x-html-editor-tip"
			},
			createlink : {
				title : "Internetový odkaz",
				text : "Z vybraného textu vytvoř� internetový odkaz.",
				cls : "x-html-editor-tip"
			},
			sourceedit : {
				title : "Zdrojový kód",
				text : "Přepne do módu úpravy zdrojového kódu.",
				cls : "x-html-editor-tip"
			}
		}
	})
}
if (Ext.grid.GridView) {
	Ext.apply(Ext.grid.GridView.prototype, {
				sortAscText : "Řadit vzestupně",
				sortDescText : "Řadit sestupně",
				lockText : "Ukotvit sloupec",
				unlockText : "Uvolnit sloupec",
				columnsText : "Sloupce"
			})
}
if (Ext.grid.GroupingView) {
	Ext.apply(Ext.grid.GroupingView.prototype, {
				emptyGroupText : "(Žádná data)",
				groupByText : "Seskupit dle tohoto pole",
				showGroupsText : "Zobrazit ve skupině"
			})
}
if (Ext.grid.PropertyColumnModel) {
	Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
				nameText : "Název",
				valueText : "Hodnota",
				dateFormat : "j.m.Y"
			})
}
if (Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion) {
	Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
				splitTip : "Tahem změnit velikost.",
				collapsibleSplitTip : "Tahem změnit velikost. Dvojklikem skrýt."
			})
};