// input value must be in common base units (g, L, mol)
function fromSI (value, units) {
	switch (units) {
		// mass (base: g)
	case 'kg':
		return value / 1000;
		break;
	case 'mg':
		return value * 1000;
		break;
	case 'ug':
		return value * 1000000;
		break;
	case 'ng':
		return value * 1000000000;
		break;
		// amount (base: mol)
	case 'mmol':
		return value * 1000;
		break;
	case 'umol':
		return value * 1000000;
		break;
	case 'nmol':
		return value * 1000000000;
		break;
		// mol weight (base: g/mol)
	case 'kg/mol':
		return value / 1000;
		break;
	case 'mg/mol':
		return value * 1000;
		break;
		// Volume (base: L)
	case 'm3':
		return value / 1000;
		break;
	case 'dL':
		return value * 10;
		break;
	case 'mL':
		return value * 1000;
		break;
	case 'uL':
		return value * 1000000;
		break;
	case 'nL':
		return value * 1000000000;
		break;
		// Concentration (SI: mol/L or M)
	case 'mol/m3':
		return value * 1000;
		break;
	case 'mM':
		return value * 1000;
		break;
	case 'uM':
		return value * 1000000;
		break;
	case 'nM':
		return value * 1000000000;
		break; 
		// Density (SI: g/L)
	case 'kg/L':
		return value / 1000;
		break;
	case 'g/mL':
		return value / 1000;
		break;
	default:
		return value; // in SI unit
	};
};


function toSI (value, units) {
	switch (units) {
		// mass (base: g)
	case 'kg':
		return value * 1000;
		break;
	case 'mg':
		return value / 1000;
		break;
	case 'ug':
		return value / 1000000;
		break;
	case 'ng':
		return value / 1000000000;
		break;
		// mol weight (base: g/mol)
	case 'kg/mol':
		return value * 1000;
		break;
	case 'mg/mol':
		return value / 1000;
		break;
		// amount (base: mol)
	case 'mmol':
		return value / 1000;
		break;
	case 'umol':
		return value / 1000000;
		break;
	case 'nmol':
		return value / 1000000000;
		break;
		// Volume (base: L)
	case 'm3':
		return value * 1000;
		break;
	case 'dL':
		return value / 10;
		break;
	case 'mL':
		return value / 1000;
		break;
	case 'uL':
		return value / 1000000;
		break;
	case 'nL':
		return value / 1000000000;
		break;
		// Concentration (SI: mol/L or M)
	case 'mol/m3':
		return value / 1000;
		break;
	case 'mM':
		return value / 1000;
		break;
	case 'uM':
		return value / 1000000;
		break;
	case 'nM':
		return value / 1000000000;
		break; 
		// Density (SI: g/L)
	case 'kg/L':
		return value * 1000;
		break;
	case 'g/mL':
		return value * 1000;
		break;
	default:
		return value; // in SI unit
	};
};

