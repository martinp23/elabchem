/********************************************************************************
*  This file is part of eLabChem (http://github.com/martinp23/elabchem)         *
*  Copyright (c) 2013 Martin Peeks (martinp23@googlemail.com)                   *
*                                                                               *
*    eLabChem is free software: you can redistribute it and/or modify           *
*    it under the terms of the GNU Affero General Public License as             *
*    published by the Free Software Foundation, either version 3 of             *
*    the License, or (at your option) any later version.                        *
*                                                                               *
*    eLabChem is distributed in the hope that it will be useful,                *
*    but WITHOUT ANY WARRANTY; without even the implied                         *
*    warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR                    *
*    PURPOSE.  See the GNU Affero General Public License for more details.      *
*                                                                               *
*    You should have received a copy of the GNU Affero General Public           *
*    License along with eLabChem.  If not, see <http://www.gnu.org/licenses/>.  *
*                                                                               *
*   eLabChem is a fork of elabFTW.                                              *                                                               
*                                                                               *
********************************************************************************/

function delButtonFormatter(row, cell, value, columnDef, dataContext) {
	var button = "<img class='del' href='#' src='img/trash.png' id='del"+ dataContext.id +"' alt='Delete row' title='Delete' />";
	return button;
}

function copyButtonFormatter(row, cell, value, columnDef, dataContext) {
    var button = "<img class='del' href='#' src='themes/default/img/duplicate.png' id='del"+ dataContext.id +"' alt='Duplicate row' title='Duplicate' />";
    return button;
}

function mwtFormatter(row, cell, value, columnDef, dataContext) {
	if (!dataContext.mwt) {
		return "";
	}
	var units = dataContext.mwt_units || 'g/mol',
        result = Math.round(100 * fromSI(dataContext.mwt, units)) / 100;	
	return result + "&nbsp;" + units;
}

function massFormatter(row, cell, value, columnDef, dataContext) {
	if (isNaN(dataContext.mass)) {
		return "";
	}
	var units = dataContext.mass_units || "g",
        result = Math.round(100 * fromSI(dataContext.mass, units)) / 100;	
	return result + "&nbsp;" + units;
}

function molFormatter(row, cell, value, columnDef, dataContext) {
	
	if (isNaN(dataContext.mol)) {
		return "";
	}
	var units = dataContext.mol_units || 'mol',
	   result = Math.round(100 * fromSI(dataContext.mol, units)) / 100;	
	return result + "&nbsp;" + units;
}

function volFormatter(row, cell, value, columnDef, dataContext) {
	if (isNaN(dataContext.vol)) {
		return "";
	}
	var units = dataContext.vol_units || "L";
        result = Math.round(100 * fromSI(dataContext.vol, units)) / 100;		
	return result + "&nbsp;" + units;
}

function concFormatter(row, cell, value, columnDef, dataContext) {
	if (isNaN(dataContext.conc)) {
		return "";
	}
	if (dataContext.cpd_type === 'Solvent') {
        return "";
    }
	var units = dataContext.conc_units || "M",
        result = Math.round(100 * fromSI(dataContext.conc, units)) / 100;	
	return result + "&nbsp;" + units;
}

function wtpercentFormatter(row, cell, value, columnDef, dataContext) {
	if (isNaN(dataContext.wtpercent) || dataContext.wtpercent === null || dataContext.wtpercent === undefined) {
		return "";
	}
    if (dataContext.cpd_type === 'Solvent') {
        return "";
    }
	return dataContext.wtpercent + "&nbsp;%";
}

function densityFormatter(row, cell, value, columnDef, dataContext) {
	if (isNaN(dataContext.density) || dataContext.density === null || dataContext.density === undefined) {
		return "";
	}
	var units = dataContext.density_units || "g/mL";
        result = Math.round(100 * fromSI(dataContext.density, units)) / 100;	
	return result + "&nbsp;" + units;
}

function percentFormatter(row, cell, value, columnDef, dataContext) {
    if (dataContext.yield === undefined || dataContext.yield === null) {
        return "";
    }
    if (dataContext.cpd_type === 'Solvent') {
        return "";
    }
    var result = Math.round(10 * value) / 10;    
    return result + "%";
}

function equivFormatter(row, cell, value, columnDef, dataContext) {
    if (dataContext.equiv === undefined || dataContext.equiv === null) {
        return "";
    }
    if (dataContext.cpd_type === 'Solvent') {
        return "";
    }
    var result = Math.round(100 * value) / 100;    
    return result;
}

function massTotalsFormatter(totals, columnDef) {
    var val = totals.sum && totals.sum[columnDef.field];
    if (val != null) {
        units = getMassUnits (val);
        val = fromSI(val,units);
        return "total: " + (Math.round(parseFloat(val)*100)/100) + " " + units;
    }
    return "";
}
        
function molTotalsFormatter(totals, columnDef) {
    var val = totals.sum && totals.sum[columnDef.field];
    if (val != null) {
        units = getMolUnits (val);
        val = fromSI(val,units);
        return "total: " + (Math.round(parseFloat(val)*100)/100) + " " + units;
    }
    return "";
}

function yieldTotalsFormatter(totals, columnDef) {
    var val = totals.sum && totals.sum[columnDef.field];
    if (val != null) {
        return "total: " + (Math.round(parseFloat(val)*10)/10) + "%";
    }
    return "";
}
