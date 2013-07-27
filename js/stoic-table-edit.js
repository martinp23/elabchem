function updateStoichiometry() {
	
	
	
}

function loadData() {
	
	
	
}


var grid;

var columns = [
	{id: "cpd_name", name: "Name", field: "cpd_name", cssClass: "cell-title", init_visible:true, editor:Slick.Editors.Text},
	{id: "cpd_type", name: "Type", field: "cpd_type", init_visible:true, editor:Slick.Editors.Text},
	{id: "mwt", name: "Mol. wt.", field: "mwt", init_visible:true, editor:chemEditor, formatter:mwtFormatter},
	{id: "mass", name: "Mass", field: "mass", init_visible:true, editor:chemEditor, formatter:massFormatter},
	{id: "mol", name: "Moles", field: "mol", init_visible:true, editor:chemEditor, formatter:molFormatter},
	{id: "vol", name: "Volume", field: "vol", init_visible:true, editor:chemEditor, formatter:volFormatter},
	{id: "conc", name: "Volume", field: "conc", init_visible:false, editor:chemEditor, formatter:concFormatter},
	{id: "solvent", name: "Solvent", field: "solvent", init_visible:false, editor:Slick.Editors.Text},
	{id: "density", name: "Density", field: "density", init_visible:true, editor:chemEditor, formatter:densityFormatter},
	{id: "equiv", name: "Equiv.", field: "equiv", init_visible:true, editor:Slick.Editors.Text},
	{id: "limiting", name: "Limiting", field: "limiting", init_visible:true, editor:Slick.Editors.Checkbox, cssClass: "cell-limiting", formatter:Slick.Formatters.Checkmark},
	{id: "cas_number", name: "CAS number", field: "cas_number", init_visible:true, editor:Slick.Editors.Text},
	{id: "supplier", name: "Supplier", field: "supplier", init_visible:true, editor:Slick.Editors.Text},
	{id: "batch_ref", name: "Batch ref", field: "batch_ref", init_visible:true, editor:Slick.Editors.Text},
	{id: "notes", name: "Notes", field: "notes", init_visible:true, editor:Slick.Editors.LongText}
	];

var options = {
	enableCellNavigation: true,
	enableColumnReorder: true,
	autoHeight: true,
	editable:true,
	enableAddRow:true,
	leaveSpaceForNewRows:true,
	syncColumnCellResize:true,
	autoEdit:false,
	asyncEditorLoading:false,
	topPanelHeight:25
};


var data = [];




$(function() {
	data[0] = {
		id: 0,
		cpd_name: "Benzene",
		cpd_type: "Solvent",
		mwt: 78,
		mwt_units: "g/mol",
		mass: 0.100,
		mass_units: "mg",
		limiting: 1,
		equiv: 1
	};
	data[1] = {
		id: 1,
		cpd_name: "Benzene",
		cpd_type: "Solvent",
		mwt: 78,
		mwt_units: "g/mol",
		mass: 0.200,
		mass_units: "mg",
		equiv: 2
	};

	var visibleColumns = [];
	for (i = 0; i < columns.length; i++) {
		if(columns[i].init_visible === true) {
			visibleColumns.push(columns[i]);
		}
	}
	grid = new Slick.Grid("#stoich-table", data, visibleColumns, options);
	grid.setSelectionModel(new Slick.RowSelectionModel());
	var columnpicker = new Slick.Controls.ColumnPicker(columns, grid, options);
	  // initialize the model after all the events have been hooked up


    grid.onAddNewRow.subscribe(function (e, args) {
      var item = args.item;
      grid.invalidateRow(data.length);
      data.push(item);
      grid.updateRowCount();
      grid.render();
    });
    
    grid.onCellChange.subscribe(function (e, args) {
    	
		var allData = grid.getData();
		var limitIndex;
		// let's find the limiting reagent row
		for (var i=0; i<allData.length; i++) {
			if(allData[i].limiting) {
				limitIndex = i;
			};
		};
    	switch (grid.getColumns()[args.cell].id) {
    		case "mass":
				// now we need to update the table to reflect changes in entered mass
				// fields to be recalculated are: moles, equivalents, volume
				// now let's update our current row, before seeing what else needs updating in the table
				// so we'll be updating moles and volume.
				allData[args.item.id].mol = args.item.mass /args.item.mwt;
				volFromMass();
				updateWholeTable()

    			break;
    		case "mwt":
    			// mwt has been changed. This means we need to update mass, and possibly vol. 
				// However, we don't need to update other rows because we're not touching mol or equiv.
				massFromMolMwt();
				volFromMass();
    			break;
    		case "mol":
    			// Now mol has been changed. This means we need to update mass, vol, equiv (if not limiting) and other rows (if limiting)
				massFromMolMwt();
				volFromMass();
				updateWholeTable();
				break;
			case "vol":
				// vol has been changed. Density/concentration is constant so we need to change mass and then mol, equiv, etc.
				// concentration takes precedance over density
				if ( args.item.concentration !== undefined ) {
					allData[args.item.id].mol = args.item.conc * args.item.vol;
					massFromMolMwt();					
				} else {
					allData[args.item.id].mass = args.item.vol * args.item.density;
					allData[args.item.id].mol = allData[args.item.id].mass / allData[args.item.id].mwt;
				};
				updateWholeTable();				
				break;
			case "conc":
				// conc has been changed. We just need to update vol to have same amount (mol)
				allData[args.item.id].vol = args.item.mol / args.item.vol;
				break;
			case "density":
				// density has been changed. we want to keep mass constant so we change vol 
				allData[args.item.id].vol = args.item.mass / args.item.density;
    		default:
    			break;
    	};
		
		function volFromMass() {
			if (args.item.density !== undefined) {
				allData[args.item.id].vol = args.item.mass /args.item.density;
			};
		};

		function updateWholeTable() {
			if (args.item.id == limitIndex) {
  			// we have changed the amount of limiting reagent so we need to update other reagents
  				for(i=0; i<allData.length; i++) {
  					if(limitIndex != i) {
  						// first update moles
  						allData[i].mol = allData[args.item.id].mol * allData[i].equiv / allData[args.item.id].equiv;
  						// then mass and vol
  						allData[i].mass = allData[i].mol * allData[i].mwt;
  						if (allData[i].density != null) {
  							allData[i].vol = allData[i].mass / allData[i].density;
  						};	
  					};
  				};
  			} else {
  				// we have changed the mass of a non-limiting reagent - only need to update our equivalents now
  				allData[args.item.id].equiv = allData[args.item.id].mol / allData[limitIndex].mol;
  			};
			
		};
      
		function massFromMolMwt() {
			allData[args.item.id].mass = args.item.mol * args.item.mwt;
		}
            
      
      
      	grid.setData(allData);
      	grid.render();
 
    	
    	
    });
});
