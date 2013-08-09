/********************************************************************************
*                                                                               *
*   Copyright 2013 Martin Peeks (martinp23@gmail.com)                           *
*   http://www.elabftw.net/                                                     *
*                                                                               *
********************************************************************************/

/********************************************************************************
*  This file is part of eLabFTW.                                                *
*                                                                               *
*    eLabFTW is free software: you can redistribute it and/or modify            *
*    it under the terms of the GNU Affero General Public License as             *
*    published by the Free Software Foundation, either version 3 of             *
*    the License, or (at your option) any later version.                        *
*                                                                               *
*    eLabFTW is distributed in the hope that it will be useful,                 *
*    but WITHOUT ANY WARRANTY; without even the implied                         *
*    warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR                    *
*    PURPOSE.  See the GNU Affero General Public License for more details.      *
*                                                                               *
*    You should have received a copy of the GNU Affero General Public           *
*    License along with eLabFTW.  If not, see <http://www.gnu.org/licenses/>.   *
*                                                                               *
********************************************************************************/
var grid;
var visibleColumns = [];

var columns = [
    {id: "del", name: "", field:"del", width:10, formatter:delButtonFormatter, init_visible:true},
    {id: "name", name: "Name", field: "cpd_name", cssClass: "cell-title", init_visible:true, editor:Slick.Editors.Text},
    {id: "formula", name: "Formula", field: "formula", init_visible:true, editor:Slick.Editors.Text},
    {id: "cpd_type", name: "Type", field: "cpd_type", init_visible:true, editor:chemType},
    {id: "mwt", name: "Mol. wt.", field: "mwt", init_visible:true, editor:chemEditor, formatter:mwtFormatter},
    {id: "mass", name: "Mass", field: "mass", init_visible:true, editor:chemEditor, formatter:massFormatter},
    {id: "mol", name: "Moles", field: "mol", init_visible:true, editor:chemEditor, formatter:molFormatter},
    {id: "vol", name: "Volume", field: "vol", init_visible:true, editor:chemEditor, formatter:volFormatter},
    {id: "conc", name: "Conc.", field: "conc", init_visible:false, editor:chemEditor, formatter:concFormatter},
    {id: "solvent", name: "Solvent", field: "solvent", init_visible:false, editor:Slick.Editors.Text},
    {id: "wtpercent", name: "w/w %", field: "wtpercent", init_visible:false, editor:FloatEditor, formatter:wtpercentFormatter},
    {id: "density", name: "Density", field: "density", init_visible:true, editor:chemEditor, formatter:densityFormatter},
    {id: "equiv", name: "Equiv.", field: "equiv", init_visible:true, editor:FloatEditor},
    {id: "limiting", name: "Limiting", field: "limiting", init_visible:true, editor:Slick.Editors.Checkbox, cssClass: "cell-limiting", formatter:Slick.Formatters.Checkmark},
    {id: "cas_number", name: "CAS number", field: "cas_number", init_visible:false, editor:Slick.Editors.Text},
    {id: "supplier", name: "Supplier", field: "supplier", init_visible:false, editor:Slick.Editors.Text},
    {id: "batch_ref", name: "Batch ref", field: "batch_ref", init_visible:false, editor:Slick.Editors.Text},
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
	asyncEditorLoading:false
};



var data = gridData;



$(function() {
    if(visibleColumnsNW.length === 0) {
        // if we have no names\widths for columns from the database, use the defaults
       for (var i = 0; i < columns.length; i++) {
            if(columns[i].init_visible === true) {
                visibleColumns.push(columns[i]);
            }
        }
    } else {
        var found;
        //otherwise, use what the database tells us
        for (var i=0; i<columns.length; i++) {
            found = false;
            for (var j=0; j<visibleColumnsNW.length; j++) {
                if(columns[i].id === visibleColumnsNW[j].id) {
                    found = true;
                    columns[i].width = visibleColumnsNW[j].width;
                }
            }
            if (found) {
                visibleColumns.push(columns[i]);
            }
        }
        
    }


	grid = new Slick.Grid("#stoich-table", data, visibleColumns, options);
	grid.setSelectionModel(new Slick.RowSelectionModel());
	var columnpicker = new Slick.Controls.ColumnPicker(columns, grid, options);
	    // initialize the model after all the events have been hooked up


        grid.onAddNewRow.subscribe(function (e, args) {
            var item = args.item,
                    limitIndex = 0;
            data = grid.getData();
            if(data.length === 0) {
                item.limiting = true;
            } else {
                limitIndex = getLimitIndex(data);
                item.mol = data[limitIndex].mol / data[limitIndex].equiv;
                item.mol_units = getMolUnits(item.mol);
            }
            item.equiv = 1;
            item.cpd_type = 'Reactant';
            data.push(item);
            grid.setData(data);
            grid.render();
        });
        
        grid.onClick.subscribe( function(e,args) {
            if(args.grid.getColumns()[args.cell].field === 'del') {
                var data = grid.getData(0);
                data.splice(args.row, 1);
                grid.setData(data, true);
            }
        });
        
        grid.onBeforeEditCell.subscribe(function(e,args) {
            debugger;
            
            if (args.item && args.item.cpd_type === 'Solvent' && (args.column.id === 'conc' || args.column.id === 'limiting' || args.column.id === 'wtpercent'|| args.column.id === 'solvent')) {
                return false;
          }
        });
        
        grid.onCellChange.subscribe(function (e, args) {
            var allData = grid.getData(),
                limitIndex = getLimitIndex(allData);
            switch (grid.getColumns()[args.cell].id) {
            case "mass":
                // now we need to update the table to reflect changes in entered mass
                // fields to be recalculated are: moles, equivalents, volume
                // now let's update our current row, before seeing what else needs updating in the table
                // so we'll be updating moles and volume.
                allData[args.row].mol = args.item.mass /args.item.mwt;
                allData[args.row].equiv = allData[args.row].mol / allData[limitIndex].mol / allData[limitIndex].equiv;
                volFromMass();
                updateWholeTable();
                if(limitIndex === args.row) {
                    updateProdTable(limitIndex, allData);
                }
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
				allData[args.row].equiv = allData[args.row].mol / allData[limitIndex].mol / allData[limitIndex].equiv;
				updateWholeTable();
				if(limitIndex === args.row) {
                    updateProdTable(limitIndex, allData);
                }
				break;
			case "equiv":
				allData[args.row].mol = allData[args.row].equiv *    allData[limitIndex].mol / allData[limitIndex].equiv;
				massFromMolMwt();
				volFromMass();
				updateWholeTable();
				if(limitIndex === args.row) {
				    updateProdTable(limitIndex, allData);
				}
				break;
			case "vol":
			debugger;
				// vol has been changed. Density/concentration is constant so we need to change mass and then mol, equiv, etc.
				// concentration takes precedance over density
				if ( args.item.conc != undefined ) {
					allData[args.row].mol = args.item.conc * args.item.vol;
					massFromMolMwt();					
				} else {
					allData[args.row].mass = args.item.vol * args.item.density;
					allData[args.row].mol = allData[args.row].mass / allData[args.row].mwt;
				}
				allData[args.row].equiv = allData[args.row].mol / allData[limitIndex].mol / allData[limitIndex].equiv;
				updateWholeTable();	
                if(limitIndex === args.row) {
                    updateProdTable(limitIndex, allData);
                }			
				break;
			case "conc":
				// conc has been changed. We just need to update vol to have same amount (mol)
				allData[args.row].vol = args.item.mol / args.item.conc;
				if(!allData[args.row].vol_units) {
					// if units not already set, make them something sensible
					allData[args.row].vol_units = getVolUnits(allData[args.row].vol);
				}
				break;
			case "density":
				// density has been changed. we want to keep mass constant so we change vol 
				allData[args.row].vol = args.item.mass / args.item.density;
				if(!allData[args.row].vol_units) {
					// if units not already set, make them something sensible
					allData[args.row].vol_units = getVolUnits(allData[args.row].vol);
				}
				break;
			case "limiting":
				// changed limiting reagent. We need to untick the old limiting reagent
				for (var i=0; i<allData.length; i++) {
					if(allData[i].limiting && i !== args.row) {
						allData[i].limiting = false;
					}
				}
				limitIndex = args.row;
				updateProdTable(limitIndex, allData);
				break;
			case "wtpercent":
				// wtpercent changed. We still need some number of moles, so update mass accordingly
				massFromMolMwt();
				break;
            default:
                break;
            }
            
            
        grid.setData(allData);
        grid.render();
		
		function volFromMass() {
			if (args.item.density != undefined) {
				allData[args.row].vol = args.item.mass /args.item.density;
                allData[args.row].vol_units = getVolUnits(allData[args.row].vol);
			}
		}

		function updateWholeTable() {
		    var limitIndex = getLimitIndex(allData);
			for(var i=0; i<allData.length; i++) {
				if(limitIndex !== i) {
					// first update moles
					allData[i].mol = allData[limitIndex].mol * allData[i].equiv / allData[limitIndex].equiv;
					// then mass and vol
					allData[i].mass = allData[i].mol * allData[i].mwt;
					if (allData[i].density != null) {
						allData[i].vol = allData[i].mass / allData[i].density;
						allData[i].vol_units = getVolUnits(allData[i].vol);
					} else if (allData[i].conc != null) {
						allData[i].vol = allData[i].mol / allData[i].conc;
						allData[i].vol_units = getVolUnits(allData[i].vol);
					}
					allData[i].mol_units = getMolUnits(allData[i].mol);
					allData[i].mass_units = getMassUnits(allData[i].mass);	
				} else {
				    allData[i].mol_units = getMolUnits(allData[i].mol);
                    allData[i].mass_units = getMassUnits(allData[i].mass);
                    allData[i].vol_units = getVolUnits(allData[i].vol);
				}
			}			
		}
            
		function massFromMolMwt() {
			if(args.item.wtpercent) {
				allData[args.row].mass = (args.item.mol * args.item.mwt) / (args.item.wtpercent / 100);	
			}
			else {
				allData[args.row].mass = args.item.mol * args.item.mwt;							
			}
			allData[args.row].mass_units = getMassUnits(allData[args.row].mass);	
		}    
		
		function getLimitIndex(gridData) {
		    // let's find the limiting reagent row
            for (var i=0; i<gridData.length; i++) {
                if(gridData[i].limiting) {
                    return i;
                }
            }
		}
		
		function updateProdTable(limitIndex, reactantData) {
		    // this will only work if there's a another slickgrid called prodGrid.
		    if(!prodGrid) {
		        return;
		    }
		    else {
		        for(var i=0; i<dataProducts.length; i++) {
		            dataProducts[i].yield = 100 * dataProducts[i].mol / (reactantData[limitIndex].mol / reactantData[limitIndex].equiv);
		        }
		    }
		    dataViewProducts.beginUpdate();
            dataViewProducts.setItems(dataProducts);
            groupByName();
            dataViewProducts.endUpdate();
            gridProducts.invalidateAllRows();
            gridProducts.render();
            return;
		}
    });
});
