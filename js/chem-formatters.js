function mwtFormatter(row, cell, value, columnDef, dataContext) {
	if (dataContext.mwt === undefined) {
		return "";
	};
	var units = dataContext.mwt_units;
	if (units === undefined) {
		units = "g/mol";
	};
	var result = Math.round(100 * fromSI(dataContext.mwt, units)) / 100;	
	return result + "&nbsp;" + units;
};

function massFormatter(row, cell, value, columnDef, dataContext) {
	if (dataContext.mass === undefined) {
		return "";
	};
	var units = dataContext.mass_units;
	if (units === undefined) {
		units = "g";
	};
	var result = Math.round(100 * fromSI(dataContext.mass, units)) / 100;	
	return result + "&nbsp;" + units;
};

function molFormatter(row, cell, value, columnDef, dataContext) {
	
	if (dataContext.mol === undefined) {
		return "";
	};
	var units = dataContext.mol_units;
	if (units === undefined) {
		units = "mol";
	};
	var result = Math.round(100 * fromSI(dataContext.mol, units)) / 100;	
	return result + "&nbsp;" + units;
};

function volFormatter(row, cell, value, columnDef, dataContext) {
	if (dataContext.vol === undefined) {
		return "";
	};
	var units = dataContext.vol_units;
	if (units === undefined) {
		units = "L";
	};
	var result = Math.round(100 * fromSI(dataContext.vol, units)) / 100;		
	return result + "&nbsp;" + units;
};

function concFormatter(row, cell, value, columnDef, dataContext) {
	if (dataContext.conc === undefined) {
		return "";
	};
	var units = dataContext.conc_units;
	if (units === undefined) {
		units = "M";
	};
	var result = Math.round(100 * fromSI(dataContext.conc, units)) / 100;	
	return result + "&nbsp;" + units;
};

function densityFormatter(row, cell, value, columnDef, dataContext) {
	if (dataContext.density === undefined) {
		return "";
	};
	var units = dataContext.density_units;
	if (units === undefined) {
		units = "g/mL";
	};
	var result = Math.round(100 * fromSI(dataContext.density, units)) / 100;	
	return result + "&nbsp;" + units;
};



