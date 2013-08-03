// input value must be in common base units (g, L, mol)
function fromSI (value, units) {
    debugger;
	switch (units) {
	// mass (base: g)
	case 'kg':
		return value / 1000;
	case 'mg':
		return value * 1000;
	case 'µg':
		return value * 1000000;
	case 'ng':
		return value * 1000000000;
	// amount (base: mol)
	case 'mmol':
		return value * 1000;
	case 'µmol':
		return value * 1000000;
	case 'nmol':
		return value * 1000000000;
	// mol weight (base: g/mol)
	case 'kg/mol':
		return value / 1000;
	case 'mg/mol':
		return value * 1000;
	// Volume (base: L)
	case 'm3':
		return value / 1000;
	case 'dL':
		return value * 10;
	case 'mL':
		return value * 1000;
	case 'µL':
		return value * 1000000;
	case 'nL':
		return value * 1000000000;
	// Concentration (SI: mol/L or M)
	case 'mol/m3':
		return value * 1000;
	case 'mM':
		return value * 1000;
	case 'µM':
		return value * 1000000;
	case 'nM':
		return value * 1000000000;
	// Density (SI: g/L)
	case 'kg/L':
		return value / 1000;
	case 'g/mL':
		return value / 1000;
	default:
		return value; // in SI unit
	}
}


function toSI (value, units) {
	switch (units) {
	// mass (base: g)
	case 'kg':
		return value * 1000;
	case 'mg':
		return value / 1000;
	case 'µg':
		return value / 1000000;
	case 'ng':
		return value / 1000000000;
	// mol weight (base: g/mol)
	case 'kg/mol':
		return value * 1000;
	case 'mg/mol':
		return value / 1000;
	// amount (base: mol)
	case 'mmol':
		return value / 1000;
	case 'µmol':
		return value / 1000000;
	case 'nmol':
		return value / 1000000000;
	// Volume (base: L)
	case 'm3':
		return value * 1000;
	case 'dL':
		return value / 10;
	case 'mL':
		return value / 1000;
	case 'µL':
		return value / 1000000;
	case 'nL':
		return value / 1000000000;
	// Concentration (SI: mol/L or M)
	case 'mol/m3':
		return value / 1000;
	case 'mM':
		return value / 1000;
	case 'µM':
		return value / 1000000;
	case 'nM':
		return value / 1000000000;
	// Density (SI: g/L)
	case 'kg/L':
		return value * 1000;
	case 'g/mL':
		return value * 1000;
	default:
		return value; // in SI unit
	}
}

function getMassUnits(value) {
	// We want to determine optimal units (kg, g, mg, ug, ng) for a given value in g.
	var order = Math.log(value) / Math.LN10;
	if(order >= 3) {
		return 'kg';
	} else if (order >= 0) {
		return 'g';
	} else if (order >= -3) {
		return 'mg';
	} else if (order >= -6) {
		return 'µg';
	} else if (order >= -9) {
		return 'ng';
	} else {
		return 'g';
	}
}

function getMolUnits(value) {
	// We want to determine optimal units (mol, mmol, umol, nmol) for a given value in mol.
	var order = Math.log(value) / Math.LN10;
	if (order >= 0) {
		return 'mol';
	} else if (order >= -3) {
		return 'mmol';
	} else if (order >= -6) {
		return 'µmol';
	} else if (order >= -9) {
		return 'nmol';
	} else {
		return 'mol';
	}
}

function getVolUnits(value) {
	// We want to determine optimal units (L, mL, uL, nL) for a given value in L (never return dL, because it's unconventional)
	var order = Math.log(value) / Math.LN10;
	if (order >= 0) {
		return 'L';
	} else if (order >= -3) {
		return 'mL';
	} else if (order >= -6) {
		return 'µL';
	} else if (order >= -9) {
		return 'nL';
	} else {
		return 'L';
	}
}

function getConcUnits(value) {
	// We want to determine optimal units (M, mM, uM, nM) for a given value in M (never return mol/m3, because it's unconventional)
	var order = Math.log(value) / Math.LN10;
	if (order >= 0) {
		return 'M';
	} else if (order >= -3) {
		return 'mM';
	} else if (order >= -6) {
		return 'µM';
	} else if (order >= -9) {
		return 'nM';
	} else {
		return 'M';
	}
}

