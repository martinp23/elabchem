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

function chemEditor(args) {
	var $value, $units,
          scope = this,
          siValue;
	
	this.init = function() {
		$value = $("<input type=text style='width:40px' />")
			.appendTo(args.container)
			.bind("keydown", scope.handleKeyDown)
			.bind('change', scope.handleValueChange);
		
		$(args.container).append("&nbsp;");
		
		switch(args.column.id) {
			case "mwt":
				$units = $("<select><option value='g/mol'>g/mol</option><option value='kg/mol'>kg/mol</option><option value='mg/mol'>mg/mol</option><option value='g/mmol'>g/mmol</option></select>");			
				break;
			case "mass":
				$units = $("<select><option value='kg'>kg</option><option value='g'>g</option><option value='mg'>mg</option><option value='µg'>µg</option><option value='ng'>ng</option></select>");			
				break;
			case "mol":
				$units = $("<select><option value='mol'>mol</option><option value='mmol'>mmol</option><option value='µmol'>µmol</option>option value='nmol'>nmol</option></select>");			
				break;
			case "vol":
				$units = $("<select><option value='L'>L</option><option value='dL'>dL</option><option value='mL'>mL</option><option value='µL'>µL</option><option value='nL'>nL</option></select>");			
				break;
			case "conc":
				$units = $("<select><option value='mol/m3'>mol/m3</option><option value='M'>M</option><option value='mM'>mM</option><option value='µM'>µM</option><option value='nM'>nM</option></select>");			
				break;
			case "density":
				$units = $("<select><option value='g/mL'>g/mL</option><option value='kg/m3'>kg/m3</option><option value='kg/L'>kg/L</option><option value='g/L'>g/L</option><option value='mg/mL'>mg/mL</option></select>");			
				break;
			default:
				break;
		}
					$units.appendTo(args.container)
					.bind('click change', scope.handleUnitChange);
		
		scope.focus();
	};
	
	this.handleKeyDown = function(e) {
          if (e.keyCode == $.ui.keyCode.LEFT || e.keyCode == $.ui.keyCode.RIGHT || e.keyCode == $.ui.keyCode.TAB) {
                e.stopImmediatePropagation();
          }
    };
    
    this.handleValueChange = function(e) {
          siValue = toSI($value.val(), $units.val());
    };
    
    this.handleUnitChange = function(e) {
      //    $value.val(fromSI(siValue, $units.val()));
    };
    
    this.destroy = function () {
        $(args.container).empty();
    };
    
    this.focus = function () {
        $value.focus();
    };
    
    this.serializeValue = function () {
		switch(args.column.id) {
			case "mwt":
				return {mwt: toSI(parseFloat($value.val(), 10), $units.val()), mwt_units: $units.val()};
			case "mass":
				return {mass: toSI(parseFloat($value.val(), 10), $units.val()), mass_units: $units.val()};
			case "mol":
				return {mol: toSI(parseFloat($value.val(), 10), $units.val()), mol_units: $units.val()};
			case "vol":
				return {vol: toSI(parseFloat($value.val(), 10), $units.val()), vol_units: $units.val()};
			case "conc":
				return {conc: toSI(parseFloat($value.val(), 10), $units.val()), conc_units: $units.val()};
			case "density":
				return {density: toSI(parseFloat($value.val(), 10), $units.val()), density_units: $units.val()};
			default:
				break;
		}			        
    };
    
    this.applyValue = function (item, state) {
		switch(args.column.id) {
			case "mwt":
					item.mwt = state.mwt;
					item.mwt_units = state.mwt_units;
					break;
			case "mass":
					item.mass = state.mass;
					item.mass_units = state.mass_units;
					break;
			case "mol":
					item.mol = state.mol;
					item.mol_units = state.mol_units;
					break;
			case "vol":
					item.vol = state.vol;
					item.vol_units = state.vol_units;
					break;
			case "conc":
					item.conc = state.conc;
					item.conc_units = state.conc_units;
					break;
			case "density":
					item.density = state.density;
					item.density_units = state.density_units;
					break;
			default:
				break;
		}
    };

    this.loadValue = function (item) {
		switch(args.column.id) {
			case "mwt":
				$value.val(fromSI(item.mwt, item.mwt_units));
				if(item.mwt_units !== undefined) {
				    $units.val(item.mwt_units);
				}			
				siValue = item.mwt;
				break;
			case "mass":
				$value.val(fromSI(item.mass, item.mass_units));
				if(item.mass_units !== undefined) {
				    $units.val(item.mass_units);
				}
				siValue = item.mass;
				break;
			case "mol":
				$value.val(fromSI(item.mol, item.mol_units));
				if(item.mol_units !== undefined) {
				    $units.val(item.mol_units);
				}
				siValue = item.mol;
				break;
			case "vol":
				$value.val(fromSI(item.vol, item.vol_units));
				if(item.vol_units !== undefined) {
				    $units.val(item.vol_units);
				}
				siValue = item.vol;
				break;
			case "conc":
				$value.val(fromSI(item.conc, item.conc_units));
				if(item.conc_units !== undefined) {
				    $units.val(item.conc_units);    
				}
				siValue = item.conc;
				break;
			case "density":
				$value.val(fromSI(item.density, item.density_units));
				if(item.density_units !== undefined) {
				    $units.val(item.density_units);
				}
				siValue = item.density;
				break;
			default:
				break;
		}
    };

    this.isValueChanged = function () {
		switch(args.column.id) {
			case "mwt":
				return args.item.mwt != toSI(parseFloat($value.val()), 10) || args.item.mwt_units !== $units.val();
			case "mass":
				return args.item.mass != toSI(parseFloat($value.val()), 10) || args.item.mass_units !== $units.val();
			case "mol":
				return args.item.mol != toSI(parseFloat($value.val()), 10) || args.item.mol_units !== $units.val();
			case "vol":
				return args.item.vol != toSI(parseFloat($value.val()), 10) || args.item.vol_units !== $units.val();
			case "conc":
				return args.item.conc != toSI(parseFloat($value.val()), 10) || args.item.conc_units !== $units.val();
			case "density":
				return args.item.density != toSI(parseFloat($value.val()), 10) || args.item.density_units !== $units.val();
			default:
				break;
		}
    };

    this.validate = function () {
        if (isNaN(parseInt($value.val(), 10)) || parseInt($value.val(), 10) < 0) {
          return {valid: false, msg: "Please type in a valid value."};
        }
        return {valid: true, msg: null};
    };
    
    this.init();
}

function FloatEditor(args) {
    var $input,
          defaultValue,
          scope = this;

    this.init = function () {
        $input = $("<INPUT type=text class='editor-text' />");

        $input.bind("keydown.nav", function (e) {
          if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
            e.stopImmediatePropagation();
          }
        });

        $input.appendTo(args.container);
        $input.focus().select();
    };

    this.destroy = function () {
        $input.remove();
    };

    this.focus = function () {
        $input.focus();
    };

    this.loadValue = function (item) {
        defaultValue = item[args.column.field];
        $input.val(defaultValue);
        $input[0].defaultValue = defaultValue;
        $input.select();
    };

    this.serializeValue = function () {
        return parseFloat($input.val(), 10) || 0;
    };

    this.applyValue = function (item, state) {
        item[args.column.field] = state;
    };

    this.isValueChanged = function () {
        return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
    };

    this.validate = function () {
        if (isNaN($input.val())) {
          return {
            valid: false,
            msg: "Please enter a valid value"
          };
        }

        return {
          valid: true,
          msg: null
        };
    };

    this.init();
  }
  
  
function chemType(args) {
    var $input,
          defaultValue = 'reactant',
          scope = this;

    this.init = function () {
          $input = $("<select><option value='Reactant'>Reactant</option><option value='Reagent'>Reagent</option><option value='Solvent'>Solvent</option></select>");				

          $input.bind("keydown.nav", function (e) {
                if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
                    e.stopImmediatePropagation();
                }
          });
          
          $input.appendTo(args.container);
          $input.focus().select();
    };

    this.destroy = function () {
        $input.remove();
    };

    this.focus = function () {
        $input.focus();
    };

    this.loadValue = function (item) {
        defaultValue = item[args.column.field];
        $input.val(defaultValue);
        $input[0].defaultValue = defaultValue;
        $input.select();
    };

    this.serializeValue = function () {
        return $input.val();
    };

    this.applyValue = function (item, state) {
        item[args.column.field] = state;
    };

    this.isValueChanged = function () {
        return (!($input.val() == "" && defaultValue === null)) && ($input.val() != defaultValue);
    };

    this.validate = function () {
	// no validation needed.
        return {
          valid: true,
          msg: null
        };
    };

    this.init();
  }
