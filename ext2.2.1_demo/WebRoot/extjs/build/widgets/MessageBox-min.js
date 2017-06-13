Ext.MessageBox = function() {
	var r, b, n, q;
	var g, j, p, a, k, m, h, f;
	var o, s, l, c = "";
	var d = function(u) {
		if (r.isVisible()) {
			r.hide();
			Ext.callback(b.fn, b.scope || window, [u, s.dom.value, b], 1)
		}
	};
	var t = function() {
		if (b && b.cls) {
			r.el.removeClass(b.cls)
		}
		k.reset()
	};
	var e = function(w, u, v) {
		if (b && b.closable !== false) {
			r.hide()
		}
		if (v) {
			v.stopEvent()
		}
	};
	var i = function(u) {
		var w = 0;
		if (!u) {
			o.ok.hide();
			o.cancel.hide();
			o.yes.hide();
			o.no.hide();
			return w
		}
		r.footer.dom.style.display = "";
		for (var v in o) {
			if (typeof o[v] != "function") {
				if (u[v]) {
					o[v].show();
					o[v].setText(typeof u[v] == "string"
							? u[v]
							: Ext.MessageBox.buttonText[v]);
					w += o[v].el.getWidth() + 15
				} else {
					o[v].hide()
				}
			}
		}
		return w
	};
	return {
		getDialog : function(u) {
			if (!r) {
				r = new Ext.Window({
					autoCreate : true,
					title : u,
					resizable : false,
					constrain : true,
					constrainHeader : true,
					minimizable : false,
					maximizable : false,
					stateful : false,
					modal : true,
					shim : true,
					buttonAlign : "center",
					width : 400,
					height : 100,
					minHeight : 80,
					plain : true,
					footer : true,
					closable : true,
					close : function() {
						if (b && b.buttons && b.buttons.no && !b.buttons.cancel) {
							d("no")
						} else {
							d("cancel")
						}
					}
				});
				o = {};
				var v = this.buttonText;
				o.ok = r.addButton(v.ok, d.createCallback("ok"));
				o.yes = r.addButton(v.yes, d.createCallback("yes"));
				o.no = r.addButton(v.no, d.createCallback("no"));
				o.cancel = r.addButton(v.cancel, d.createCallback("cancel"));
				o.ok.hideMode = o.yes.hideMode = o.no.hideMode = o.cancel.hideMode = "offsets";
				r.render(document.body);
				r.getEl().addClass("x-window-dlg");
				n = r.mask;
				g = r.body.createChild({
					html : '<div class="ext-mb-icon"></div><div class="ext-mb-content"><span class="ext-mb-text"></span><br /><div class="ext-mb-fix-cursor"><input type="text" class="ext-mb-input" /><textarea class="ext-mb-textarea"></textarea></div></div>'
				});
				h = Ext.get(g.dom.firstChild);
				var w = g.dom.childNodes[1];
				j = Ext.get(w.firstChild);
				p = Ext.get(w.childNodes[2].firstChild);
				p.enableDisplayMode();
				p.addKeyListener([10, 13], function() {
							if (r.isVisible() && b && b.buttons) {
								if (b.buttons.ok) {
									d("ok")
								} else {
									if (b.buttons.yes) {
										d("yes")
									}
								}
							}
						});
				a = Ext.get(w.childNodes[2].childNodes[1]);
				a.enableDisplayMode();
				k = new Ext.ProgressBar({
							renderTo : g
						});
				g.createChild({
							cls : "x-clear"
						})
			}
			return r
		},
		updateText : function(y) {
			if (!r.isVisible() && !b.width) {
				r.setSize(this.maxWidth, 100)
			}
			j.update(y || "&#160;");
			var v = c != "" ? (h.getWidth() + h.getMargins("lr")) : 0;
			var A = j.getWidth() + j.getMargins("lr");
			var x = r.getFrameWidth("lr");
			var z = r.body.getFrameWidth("lr");
			if (Ext.isIE && v > 0) {
				v += 3
			}
			var u = Math.max(Math.min(b.width || v + A + x + z, this.maxWidth),
					Math.max(b.minWidth || this.minWidth, l || 0));
			if (b.prompt === true) {
				s.setWidth(u - v - x - z)
			}
			if (b.progress === true || b.wait === true) {
				k.setSize(u - v - x - z)
			}
			if (Ext.isIE && u == l) {
				u += 4
			}
			r.setSize(u, "auto").center();
			return this
		},
		updateProgress : function(v, u, w) {
			k.updateProgress(v, u);
			if (w) {
				this.updateText(w)
			}
			return this
		},
		isVisible : function() {
			return r && r.isVisible()
		},
		hide : function() {
			var u = r.activeGhost;
			if (this.isVisible() || u) {
				r.hide();
				t();
				if (u) {
					u.hide()
				}
			}
			return this
		},
		show : function(x) {
			if (this.isVisible()) {
				this.hide()
			}
			b = x;
			var y = this.getDialog(b.title || "&#160;");
			y.setTitle(b.title || "&#160;");
			var u = (b.closable !== false && b.progress !== true && b.wait !== true);
			y.tools.close.setDisplayed(u);
			s = p;
			b.prompt = b.prompt || (b.multiline ? true : false);
			if (b.prompt) {
				if (b.multiline) {
					p.hide();
					a.show();
					a.setHeight(typeof b.multiline == "number"
							? b.multiline
							: this.defaultTextHeight);
					s = a
				} else {
					p.show();
					a.hide()
				}
			} else {
				p.hide();
				a.hide()
			}
			s.dom.value = b.value || "";
			if (b.prompt) {
				y.focusEl = s
			} else {
				var w = b.buttons;
				var v = null;
				if (w && w.ok) {
					v = o.ok
				} else {
					if (w && w.yes) {
						v = o.yes
					}
				}
				if (v) {
					y.focusEl = v
				}
			}
			if (b.iconCls) {
				y.setIconClass(b.iconCls)
			}
			this.setIcon(b.icon);
			l = i(b.buttons);
			k.setVisible(b.progress === true || b.wait === true);
			this.updateProgress(0, b.progressText);
			this.updateText(b.msg);
			if (b.cls) {
				y.el.addClass(b.cls)
			}
			y.proxyDrag = b.proxyDrag === true;
			y.modal = b.modal !== false;
			y.mask = b.modal !== false ? n : false;
			if (!y.isVisible()) {
				document.body.appendChild(r.el.dom);
				y.setAnimateTarget(b.animEl);
				y.show(b.animEl)
			}
			y.on("show", function() {
						if (u === true) {
							y.keyMap.enable()
						} else {
							y.keyMap.disable()
						}
					}, this, {
						single : true
					});
			if (b.wait === true) {
				k.wait(b.waitConfig)
			}
			return this
		},
		setIcon : function(u) {
			if (u && u != "") {
				h.removeClass("x-hidden");
				h.replaceClass(c, u);
				c = u
			} else {
				h.replaceClass(c, "x-hidden");
				c = ""
			}
			return this
		},
		progress : function(w, v, u) {
			this.show({
						title : w,
						msg : v,
						buttons : false,
						progress : true,
						closable : false,
						minWidth : this.minProgressWidth,
						progressText : u
					});
			return this
		},
		wait : function(w, v, u) {
			this.show({
						title : v,
						msg : w,
						buttons : false,
						closable : false,
						wait : true,
						modal : true,
						minWidth : this.minProgressWidth,
						waitConfig : u
					});
			return this
		},
		alert : function(x, w, v, u) {
			this.show({
						title : x,
						msg : w,
						buttons : this.OK,
						fn : v,
						scope : u
					});
			return this
		},
		confirm : function(x, w, v, u) {
			this.show({
						title : x,
						msg : w,
						buttons : this.YESNO,
						fn : v,
						scope : u,
						icon : this.QUESTION
					});
			return this
		},
		prompt : function(z, y, w, v, u, x) {
			this.show({
						title : z,
						msg : y,
						buttons : this.OKCANCEL,
						fn : w,
						minWidth : 250,
						scope : v,
						prompt : true,
						multiline : u,
						value : x
					});
			return this
		},
		OK : {
			ok : true
		},
		CANCEL : {
			cancel : true
		},
		OKCANCEL : {
			ok : true,
			cancel : true
		},
		YESNO : {
			yes : true,
			no : true
		},
		YESNOCANCEL : {
			yes : true,
			no : true,
			cancel : true
		},
		INFO : "ext-mb-info",
		WARNING : "ext-mb-warning",
		QUESTION : "ext-mb-question",
		ERROR : "ext-mb-error",
		defaultTextHeight : 75,
		maxWidth : 600,
		minWidth : 100,
		minProgressWidth : 250,
		buttonText : {
			ok : "OK",
			cancel : "Cancel",
			yes : "Yes",
			no : "No"
		}
	}
}();
Ext.Msg = Ext.MessageBox;