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
	{id: "name", name: "Name", field: "cpd_name", width:175, cssClass: "cell-title", init_visible:true, editor:Slick.Editors.Text},
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
	enableColumnReorder: false,
	autoHeight: true,
	editable:false,
	enableAddRow:false,
	leaveSpaceForNewRows:false,
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
});
