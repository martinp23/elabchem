function buttonFormatter(row, cell, value, columnDef, dataContext) {
	var button = "<input class='del' type='image' src='img/trash.png' id='"+ dataContext.id +"' />";
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
	var units = dataContext.conc_units || "M",
        result = Math.round(100 * fromSI(dataContext.conc, units)) / 100;	
	return result + "&nbsp;" + units;
}

function wtpercentFormatter(row, cell, value, columnDef, dataContext) {
	if (dataContext.wtpercent === undefined) {
		return "";
	}
	return dataContext.wtpercent + "&nbsp;%";
}

function densityFormatter(row, cell, value, columnDef, dataContext) {
	if (dataContext.density === undefined) {
		return "";
	}
	var units = dataContext.density_units || "g/mL";
        result = Math.round(100 * fromSI(dataContext.density, units)) / 100;	
	return result + "&nbsp;" + units;
}



