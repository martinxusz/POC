Ext.form.HtmlEditor = Ext.extend(Ext.form.Field, {
	enableFormat : true,
	enableFontSize : true,
	enableColors : true,
	enableAlignments : true,
	enableLists : true,
	enableSourceEdit : true,
	enableLinks : true,
	enableFont : true,
	createLinkText : "Please enter the URL for the link:",
	defaultLinkValue : "http://",
	fontFamilies : ["Arial", "Courier New", "Tahoma", "Times New Roman",
			"Verdana"],
	defaultFont : "tahoma",
	validationEvent : false,
	deferHeight : true,
	initialized : false,
	activated : false,
	sourceEditMode : false,
	onFocus : Ext.emptyFn,
	iframePad : 3,
	hideMode : "offsets",
	defaultAutoCreate : {
		tag : "textarea",
		style : "width:500px;height:300px;",
		autocomplete : "off"
	},
	initComponent : function() {
		this.addEvents("initialize", "activate", "beforesync", "beforepush",
				"sync", "push", "editmodechange")
	},
	createFontOptions : function() {
		var d = [], b = this.fontFamilies, c, f;
		for (var e = 0, a = b.length; e < a; e++) {
			c = b[e];
			f = c.toLowerCase();
			d.push('<option value="', f, '" style="font-family:', c, ';"',
					(this.defaultFont == f ? ' selected="true">' : ">"), c,
					"</option>")
		}
		return d.join("")
	},
	createToolbar : function(d) {
		var a = Ext.QuickTips && Ext.QuickTips.isEnabled();
		function c(g, e, f) {
			return {
				itemId : g,
				cls : "x-btn-icon x-edit-" + g,
				enableToggle : e !== false,
				scope : d,
				handler : f || d.relayBtnCmd,
				clickEvent : "mousedown",
				tooltip : a ? d.buttonTips[g] || undefined : undefined,
				tabIndex : -1
			}
		}
		var b = new Ext.Toolbar({
					renderTo : this.wrap.dom.firstChild
				});
		b.el.on("click", function(f) {
					f.preventDefault()
				});
		if (this.enableFont && !Ext.isSafari2) {
			this.fontSelect = b.el.createChild({
						tag : "select",
						cls : "x-font-select",
						html : this.createFontOptions()
					});
			this.fontSelect.on("change", function() {
						var e = this.fontSelect.dom.value;
						this.relayCmd("fontname", e);
						this.deferFocus()
					}, this);
			b.add(this.fontSelect.dom, "-")
		}
		if (this.enableFormat) {
			b.add(c("bold"), c("italic"), c("underline"))
		}
		if (this.enableFontSize) {
			b.add("-", c("increasefontsize", false, this.adjustFont), c(
							"decreasefontsize", false, this.adjustFont))
		}
		if (this.enableColors) {
			b.add("-", {
						itemId : "forecolor",
						cls : "x-btn-icon x-edit-forecolor",
						clickEvent : "mousedown",
						tooltip : a
								? d.buttonTips.forecolor || undefined
								: undefined,
						tabIndex : -1,
						menu : new Ext.menu.ColorMenu({
									allowReselect : true,
									focus : Ext.emptyFn,
									value : "000000",
									plain : true,
									selectHandler : function(f, e) {
										this.execCmd("forecolor", Ext.isSafari
														|| Ext.isIE
														? "#" + e
														: e);
										this.deferFocus()
									},
									scope : this,
									clickEvent : "mousedown"
								})
					}, {
						itemId : "backcolor",
						cls : "x-btn-icon x-edit-backcolor",
						clickEvent : "mousedown",
						tooltip : a
								? d.buttonTips.backcolor || undefined
								: undefined,
						tabIndex : -1,
						menu : new Ext.menu.ColorMenu({
									focus : Ext.emptyFn,
									value : "FFFFFF",
									plain : true,
									allowReselect : true,
									selectHandler : function(f, e) {
										if (Ext.isGecko) {
											this.execCmd("useCSS", false);
											this.execCmd("hilitecolor", e);
											this.execCmd("useCSS", true);
											this.deferFocus()
										} else {
											this.execCmd(Ext.isOpera
															? "hilitecolor"
															: "backcolor",
													Ext.isSafari || Ext.isIE
															? "#" + e
															: e);
											this.deferFocus()
										}
									},
									scope : this,
									clickEvent : "mousedown"
								})
					})
		}
		if (this.enableAlignments) {
			b.add("-", c("justifyleft"), c("justifycenter"), c("justifyright"))
		}
		if (!Ext.isSafari2) {
			if (this.enableLinks) {
				b.add("-", c("createlink", false, this.createLink))
			}
			if (this.enableLists) {
				b.add("-", c("insertorderedlist"), c("insertunorderedlist"))
			}
			if (this.enableSourceEdit) {
				b.add("-", c("sourceedit", true, function(e) {
									this.toggleSourceEdit(e.pressed)
								}))
			}
		}
		this.tb = b
	},
	getDocMarkup : function() {
		return '<html><head><style type="text/css">body{border:0;margin:0;padding:3px;height:98%;cursor:text;}</style></head><body></body></html>'
	},
	getEditorBody : function() {
		return this.doc.body || this.doc.documentElement
	},
	getDoc : function() {
		return Ext.isIE
				? this.getWin().document
				: (this.iframe.contentDocument || this.getWin().document)
	},
	getWin : function() {
		return Ext.isIE
				? this.iframe.contentWindow
				: window.frames[this.iframe.name]
	},
	onRender : function(b, a) {
		Ext.form.HtmlEditor.superclass.onRender.call(this, b, a);
		this.el.dom.style.border = "0 none";
		this.el.dom.setAttribute("tabIndex", -1);
		this.el.addClass("x-hidden");
		if (Ext.isIE) {
			this.el.applyStyles("margin-top:-1px;margin-bottom:-1px;")
		}
		this.wrap = this.el.wrap({
					cls : "x-html-editor-wrap",
					cn : {
						cls : "x-html-editor-tb"
					}
				});
		this.createToolbar(this);
		this.tb.items.each(function(e) {
					if (e.itemId != "sourceedit") {
						e.disable()
					}
				});
		var c = document.createElement("iframe");
		c.name = Ext.id();
		c.frameBorder = "0";
		c.src = Ext.isIE ? Ext.SSL_SECURE_URL : "javascript:;";
		this.wrap.dom.appendChild(c);
		this.iframe = c;
		this.initFrame();
		if (this.autoMonitorDesignMode !== false) {
			this.monitorTask = Ext.TaskMgr.start({
						run : this.checkDesignMode,
						scope : this,
						interval : 100
					})
		}
		if (!this.width) {
			var d = this.el.getSize();
			this.setSize(d.width, this.height || d.height)
		}
	},
	initFrame : function() {
		this.doc = this.getDoc();
		this.win = this.getWin();
		this.doc.open();
		this.doc.write(this.getDocMarkup());
		this.doc.close();
		var a = {
			run : function() {
				if (this.doc.body || this.doc.readyState == "complete") {
					Ext.TaskMgr.stop(a);
					this.doc.designMode = "on";
					this.initEditor.defer(10, this)
				}
			},
			interval : 10,
			duration : 10000,
			scope : this
		};
		Ext.TaskMgr.start(a)
	},
	checkDesignMode : function() {
		if (this.wrap && this.wrap.dom.offsetWidth) {
			var a = this.getDoc();
			if (!a) {
				return
			}
			if (!a.editorInitialized
					|| String(a.designMode).toLowerCase() != "on") {
				this.initFrame()
			}
		}
	},
	onResize : function(b, c) {
		Ext.form.HtmlEditor.superclass.onResize.apply(this, arguments);
		if (this.el && this.iframe) {
			if (typeof b == "number") {
				var d = b - this.wrap.getFrameWidth("lr");
				this.el.setWidth(this.adjustWidth("textarea", d));
				this.iframe.style.width = Math.max(d, 0) + "px"
			}
			if (typeof c == "number") {
				var a = c - this.wrap.getFrameWidth("tb")
						- this.tb.el.getHeight();
				this.el.setHeight(this.adjustWidth("textarea", a));
				this.iframe.style.height = Math.max(a, 0) + "px";
				if (this.doc) {
					this.getEditorBody().style.height = Math.max(
							(a - (this.iframePad * 2)), 0)
							+ "px"
				}
			}
		}
	},
	toggleSourceEdit : function(a) {
		if (a === undefined) {
			a = !this.sourceEditMode
		}
		this.sourceEditMode = a === true;
		var c = this.tb.items.get("sourceedit");
		if (c.pressed !== this.sourceEditMode) {
			c.toggle(this.sourceEditMode);
			return
		}
		if (this.sourceEditMode) {
			this.tb.items.each(function(d) {
						if (d.itemId != "sourceedit") {
							d.disable()
						}
					});
			this.syncValue();
			this.iframe.className = "x-hidden";
			this.el.removeClass("x-hidden");
			this.el.dom.removeAttribute("tabIndex");
			this.el.focus()
		} else {
			if (this.initialized) {
				this.tb.items.each(function(d) {
							d.enable()
						})
			}
			this.pushValue();
			this.iframe.className = "";
			this.el.addClass("x-hidden");
			this.el.dom.setAttribute("tabIndex", -1);
			this.deferFocus()
		}
		var b = this.lastSize;
		if (b) {
			delete this.lastSize;
			this.setSize(b)
		}
		this.fireEvent("editmodechange", this, this.sourceEditMode)
	},
	createLink : function() {
		var a = prompt(this.createLinkText, this.defaultLinkValue);
		if (a && a != "http://") {
			this.relayCmd("createlink", a)
		}
	},
	adjustSize : Ext.BoxComponent.prototype.adjustSize,
	getResizeEl : function() {
		return this.wrap
	},
	getPositionEl : function() {
		return this.wrap
	},
	initEvents : function() {
		this.originalValue = this.getValue()
	},
	markInvalid : Ext.emptyFn,
	clearInvalid : Ext.emptyFn,
	setValue : function(a) {
		Ext.form.HtmlEditor.superclass.setValue.call(this, a);
		this.pushValue()
	},
	cleanHtml : function(a) {
		a = String(a);
		if (a.length > 5) {
			if (Ext.isSafari) {
				a = a
						.replace(
								/\sclass="(?:Apple-style-span|khtml-block-placeholder)"/gi,
								"")
			}
		}
		if (a == "&nbsp;") {
			a = ""
		}
		return a
	},
	syncValue : function() {
		if (this.initialized) {
			var d = this.getEditorBody();
			var c = d.innerHTML;
			if (Ext.isSafari) {
				var b = d.getAttribute("style");
				var a = b.match(/text-align:(.*?);/i);
				if (a && a[1]) {
					c = '<div style="' + a[0] + '">' + c + "</div>"
				}
			}
			c = this.cleanHtml(c);
			if (this.fireEvent("beforesync", this, c) !== false) {
				this.el.dom.value = c;
				this.fireEvent("sync", this, c)
			}
		}
	},
	getValue : function() {
		this.syncValue();
		return Ext.form.HtmlEditor.superclass.getValue.call(this)
	},
	pushValue : function() {
		if (this.initialized) {
			var a = this.el.dom.value;
			if (!this.activated && a.length < 1) {
				a = "&nbsp;"
			}
			if (this.fireEvent("beforepush", this, a) !== false) {
				this.getEditorBody().innerHTML = a;
				this.fireEvent("push", this, a)
			}
		}
	},
	deferFocus : function() {
		this.focus.defer(10, this)
	},
	focus : function() {
		if (this.win && !this.sourceEditMode) {
			this.win.focus()
		} else {
			this.el.focus()
		}
	},
	initEditor : function() {
		var b = this.getEditorBody();
		var a = this.el.getStyles("font-size", "font-family",
				"background-image", "background-repeat");
		a["background-attachment"] = "fixed";
		b.bgProperties = "fixed";
		Ext.DomHelper.applyStyles(b, a);
		if (this.doc) {
			try {
				Ext.EventManager.removeAll(this.doc)
			} catch (c) {
			}
		}
		this.doc = this.getDoc();
		Ext.EventManager.on(this.doc, {
					mousedown : this.onEditorEvent,
					dblclick : this.onEditorEvent,
					click : this.onEditorEvent,
					keyup : this.onEditorEvent,
					buffer : 100,
					scope : this
				});
		if (Ext.isGecko) {
			Ext.EventManager.on(this.doc, "keypress", this.applyCommand, this)
		}
		if (Ext.isIE || Ext.isSafari || Ext.isOpera) {
			Ext.EventManager.on(this.doc, "keydown", this.fixKeys, this)
		}
		this.initialized = true;
		this.fireEvent("initialize", this);
		this.doc.editorInitialized = true;
		this.pushValue()
	},
	onDestroy : function() {
		if (this.monitorTask) {
			Ext.TaskMgr.stop(this.monitorTask)
		}
		if (this.rendered) {
			this.tb.items.each(function(a) {
						if (a.menu) {
							a.menu.removeAll();
							if (a.menu.el) {
								a.menu.el.destroy()
							}
						}
						a.destroy()
					});
			this.wrap.dom.innerHTML = "";
			this.wrap.remove()
		}
	},
	onFirstFocus : function() {
		this.activated = true;
		this.tb.items.each(function(d) {
					d.enable()
				});
		if (Ext.isGecko) {
			this.win.focus();
			var a = this.win.getSelection();
			if (!a.focusNode || a.focusNode.nodeType != 3) {
				var b = a.getRangeAt(0);
				b.selectNodeContents(this.getEditorBody());
				b.collapse(true);
				this.deferFocus()
			}
			try {
				this.execCmd("useCSS", true);
				this.execCmd("styleWithCSS", false)
			} catch (c) {
			}
		}
		this.fireEvent("activate", this)
	},
	adjustFont : function(b) {
		var c = b.itemId == "increasefontsize" ? 1 : -1;
		var a = parseInt(this.doc.queryCommandValue("FontSize") || 2, 10);
		if (Ext.isSafari3 || Ext.isAir) {
			if (a <= 10) {
				a = 1 + c
			} else {
				if (a <= 13) {
					a = 2 + c
				} else {
					if (a <= 16) {
						a = 3 + c
					} else {
						if (a <= 18) {
							a = 4 + c
						} else {
							if (a <= 24) {
								a = 5 + c
							} else {
								a = 6 + c
							}
						}
					}
				}
			}
			a = a.constrain(1, 6)
		} else {
			if (Ext.isSafari) {
				c *= 2
			}
			a = Math.max(1, a + c) + (Ext.isSafari ? "px" : 0)
		}
		this.execCmd("FontSize", a)
	},
	onEditorEvent : function(a) {
		this.updateToolbar()
	},
	updateToolbar : function() {
		if (!this.activated) {
			this.onFirstFocus();
			return
		}
		var b = this.tb.items.map, c = this.doc;
		if (this.enableFont && !Ext.isSafari2) {
			var a = (this.doc.queryCommandValue("FontName") || this.defaultFont)
					.toLowerCase();
			if (a != this.fontSelect.dom.value) {
				this.fontSelect.dom.value = a
			}
		}
		if (this.enableFormat) {
			b.bold.toggle(c.queryCommandState("bold"));
			b.italic.toggle(c.queryCommandState("italic"));
			b.underline.toggle(c.queryCommandState("underline"))
		}
		if (this.enableAlignments) {
			b.justifyleft.toggle(c.queryCommandState("justifyleft"));
			b.justifycenter.toggle(c.queryCommandState("justifycenter"));
			b.justifyright.toggle(c.queryCommandState("justifyright"))
		}
		if (!Ext.isSafari2 && this.enableLists) {
			b.insertorderedlist
					.toggle(c.queryCommandState("insertorderedlist"));
			b.insertunorderedlist.toggle(c
					.queryCommandState("insertunorderedlist"))
		}
		Ext.menu.MenuMgr.hideAll();
		this.syncValue()
	},
	relayBtnCmd : function(a) {
		this.relayCmd(a.itemId)
	},
	relayCmd : function(b, a) {
(function() {
			this.focus();
			this.execCmd(b, a);
			this.updateToolbar()
		}).defer(10, this)
	},
	execCmd : function(b, a) {
		this.doc.execCommand(b, false, a === undefined ? null : a);
		this.syncValue()
	},
	applyCommand : function(b) {
		if (b.ctrlKey) {
			var d = b.getCharCode(), a;
			if (d > 0) {
				d = String.fromCharCode(d);
				switch (d) {
					case "b" :
						a = "bold";
						break;
					case "i" :
						a = "italic";
						break;
					case "u" :
						a = "underline";
						break
				}
				if (a) {
					this.win.focus();
					this.execCmd(a);
					this.deferFocus();
					b.preventDefault()
				}
			}
		}
	},
	insertAtCursor : function(b) {
		if (!this.activated) {
			return
		}
		if (Ext.isIE) {
			this.win.focus();
			var a = this.doc.selection.createRange();
			if (a) {
				a.collapse(true);
				a.pasteHTML(b);
				this.syncValue();
				this.deferFocus()
			}
		} else {
			if (Ext.isGecko || Ext.isOpera) {
				this.win.focus();
				this.execCmd("InsertHTML", b);
				this.deferFocus()
			} else {
				if (Ext.isSafari) {
					this.execCmd("InsertText", b);
					this.deferFocus()
				}
			}
		}
	},
	fixKeys : function() {
		if (Ext.isIE) {
			return function(d) {
				var a = d.getKey(), b;
				if (a == d.TAB) {
					d.stopEvent();
					b = this.doc.selection.createRange();
					if (b) {
						b.collapse(true);
						b.pasteHTML("&nbsp;&nbsp;&nbsp;&nbsp;");
						this.deferFocus()
					}
				} else {
					if (a == d.ENTER) {
						b = this.doc.selection.createRange();
						if (b) {
							var c = b.parentElement();
							if (!c || c.tagName.toLowerCase() != "li") {
								d.stopEvent();
								b.pasteHTML("<br />");
								b.collapse(false);
								b.select()
							}
						}
					}
				}
			}
		} else {
			if (Ext.isOpera) {
				return function(b) {
					var a = b.getKey();
					if (a == b.TAB) {
						b.stopEvent();
						this.win.focus();
						this.execCmd("InsertHTML", "&nbsp;&nbsp;&nbsp;&nbsp;");
						this.deferFocus()
					}
				}
			} else {
				if (Ext.isSafari) {
					return function(b) {
						var a = b.getKey();
						if (a == b.TAB) {
							b.stopEvent();
							this.execCmd("InsertText", "\t");
							this.deferFocus()
						}
					}
				}
			}
		}
	}(),
	getToolbar : function() {
		return this.tb
	},
	buttonTips : {
		bold : {
			title : "Bold (Ctrl+B)",
			text : "Make the selected text bold.",
			cls : "x-html-editor-tip"
		},
		italic : {
			title : "Italic (Ctrl+I)",
			text : "Make the selected text italic.",
			cls : "x-html-editor-tip"
		},
		underline : {
			title : "Underline (Ctrl+U)",
			text : "Underline the selected text.",
			cls : "x-html-editor-tip"
		},
		increasefontsize : {
			title : "Grow Text",
			text : "Increase the font size.",
			cls : "x-html-editor-tip"
		},
		decreasefontsize : {
			title : "Shrink Text",
			text : "Decrease the font size.",
			cls : "x-html-editor-tip"
		},
		backcolor : {
			title : "Text Highlight Color",
			text : "Change the background color of the selected text.",
			cls : "x-html-editor-tip"
		},
		forecolor : {
			title : "Font Color",
			text : "Change the color of the selected text.",
			cls : "x-html-editor-tip"
		},
		justifyleft : {
			title : "Align Text Left",
			text : "Align text to the left.",
			cls : "x-html-editor-tip"
		},
		justifycenter : {
			title : "Center Text",
			text : "Center text in the editor.",
			cls : "x-html-editor-tip"
		},
		justifyright : {
			title : "Align Text Right",
			text : "Align text to the right.",
			cls : "x-html-editor-tip"
		},
		insertunorderedlist : {
			title : "Bullet List",
			text : "Start a bulleted list.",
			cls : "x-html-editor-tip"
		},
		insertorderedlist : {
			title : "Numbered List",
			text : "Start a numbered list.",
			cls : "x-html-editor-tip"
		},
		createlink : {
			title : "Hyperlink",
			text : "Make the selected text a hyperlink.",
			cls : "x-html-editor-tip"
		},
		sourceedit : {
			title : "Source Edit",
			text : "Switch to source editing mode.",
			cls : "x-html-editor-tip"
		}
	}
});
Ext.reg("htmleditor", Ext.form.HtmlEditor);