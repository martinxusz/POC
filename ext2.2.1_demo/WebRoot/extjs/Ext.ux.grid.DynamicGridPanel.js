Ext.namespace("Ext.ux.grid");

Ext.ux.grid.DynamicGridPanel = Ext.extend(Ext.grid.GridPanel,{
	
	initComponent: function(){
		/**
		 * Default option
		 */
		this.store= new Ext.data.JsonStore({ 
				url: this.storeUrl,
				reader: new Ext.data.JsonReader() 
		});
		var config = {
			viewConfig: {forceFit: false},
			enableColLock: false,
			loadMask: true,
			border: false,
			stripeRows: true,
			ds: this.store,
			columns: []
		};
		 var pagingConfig={       
	        pageSize:20,                       
	        store: this.store,              
	        displayInfo:true,   
	        displayMsg: "当前记录:{0} - {1} 条  总共{2} 条",   
	        emptyMsg: "没有记录"  
   		 };
		Ext.apply(this, config);
		Ext.apply(this.initialConfig, config);
		//this.bbar = new Ext.PagingToolbar(pagingConfig);    
		Ext.ux.grid.DynamicGridPanel.superclass.initComponent.apply(this, arguments);
	},
	
	onRender: function(ct, position){ 
		this.colModel.defaultSortable = true; 
		Ext.ux.grid.DynamicGridPanel.superclass.onRender.call(this, ct, position); 
		
		/** 
		 * Grid is not masked for the first data load;
		 * We are masking it while store is loading data;
		 */
		this.el.mask('Loading...');
		
		/**
		 * Instead of "this.store.on('load', function(){" because it is working perfect now
		 * It is only for JsonReader
		 */
		this.store.on('metachange', function(){
			if(typeof(this.store.reader.jsonData.columns) === 'object') { 
				var columns = []; 
				if(this.rowNumberer) { columns.push(new Ext.grid.RowNumberer()); }
				if(this.checkboxSelModel) { columns.push(new Ext.grid.CheckboxSelectionModel()); }
				
				Ext.each(this.store.reader.jsonData.columns, function(column){
					columns.push(column);
				});
				
				/**
				 * Setting column model configuration 
				 */
				this.getColumnModel().setConfig(columns); 
			}
			
			/**
			 * Unmasking grid
			 */
			this.el.unmask(); 
		},this);
		
		/**
		 * And finally load the data from server! 
		 */
		this.store.load(); 
	 }
});