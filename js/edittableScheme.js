document.write("<input name='rxn_input' type='hidden' value='"+rxn+"' />");
document.write("<input name='grid_input' type='hidden' value='' />");

// changes the default JMol color of hydrogen to black so it appears on white backgrounds
ChemDoodle.ELEMENT['H'].jmolColor = 'black';
// darkens the default JMol color of sulfur so it appears on white backgrounds
ChemDoodle.ELEMENT['S'].jmolColor = '#B9A130';

var reactionCanvas = new ChemDoodle.SketcherCanvas('reaction', 600, 200, {useServices:false});
reactionCanvas.specs.atoms_displayTerminalCarbonLabels_2D = true;
// sets atom labels to be colored by JMol colors, which are easy to recognize
reactionCanvas.specs.atoms_useJMOLColors = true;
// enables overlap clear widths, so that some depth is introduced to overlapping bonds
reactionCanvas.specs.bonds_clearOverlaps_2D = true;
// sets the shape color to improve contrast when drawing figures
reactionCanvas.specs.shapes_color = 'c10000';
// because we do not load any content, we need to repaint the sketcher, otherwise we would just see an empty area with the toolbar
// however, you can instead use one of the Canvas.load... functions to pre-populate the canvas with content, then you don't need to call repaint
if(rxn !== "") {
    var reaction_cd = ChemDoodle.readRXN(rxn);
    reactionCanvas.loadContent(reaction_cd.molecules, reaction_cd.shapes);
}
reactionCanvas.repaint();


function updateScheme() 
{
    var rxnnew = ChemDoodle.writeRXN(reactionCanvas.getMolecules(), reactionCanvas.getShapes());
    if (rxnnew !== rxn)
    {
        rxn = rxnnew;
    }   
}

function updateStoichTable()
{
    updateScheme();
    var allMolecules = rxn.split('$MOL\n'),
            counts = rxn.split('\n')[4],
            numReact = parseInt(counts.substring(0,3), 10),
            numProd = parseInt(counts.substring(3,6), 10),     
            reactants = [],
            products = [];
            
    for (var i = 1; i <= numReact; i++) {
        reactants.push(allMolecules[i]);
    }
    for (var i = numReact + 1; i <= numReact + numProd; i++) {
        products.push(allMolecules[i]);
    }
    $.ajax(
        {
            url: 'getcompounddata.php',
            data:{reactants:reactants, products:products},
            dataType: "json",
            
            success: function(dbdata)
            {
                var reactantGridData = grid.getData(),
                    missingRows = [],
                    numCompoundsInTable = 0;
                // now iterate through all rows of stoichiometry grid. if inchi present, check against dbdata.
                // if inchi is in both, do nothing. if inchi is missing, make a note in missingRows
                for (var j = 0; j < reactantGridData.length; j++) {
                    var foundRow = false;
                    if (reactantGridData[j].inchi) {
                        numCompoundsInTable++;
                        for (var i = 0; i < numReact; i++) {
                            if(reactantGridData[j].inchi == dbdata.reactants[i].inchi) {
                                foundRow = true;
                            }
                        }
                        if (!foundRow) {
                            missingRows.push(j);
                        }
                    }
                }
                        
                var newCompounds = [];
                for (var i = 0; i < numReact; i++) {
                    // for each reactant's data, check whether reactant is in stoichiometry grid. 
                    // if it isn't, store the id from dbdata
                    var foundRow = false;
                    
                    for (var j = 0; j < reactantGridData.length; j++) {
                        if (reactantGridData[j].inchi === dbdata.reactants[i].inchi) {
                            foundRow = j;
                        }
                    }
                    if (foundRow === false) {
                        newCompounds.push(dbdata.reactants[i]);
                    }
                }
                
                
                // if we have the same number of "missing matches" as we do new compounds, the user has probably edited 
                // (an) existing compound(s). So we should update what we can and recalculate the grid.
                if( newCompounds.length == missingRows.length && numCompoundsInTable === numReact) {
                    for(i=0; i<missingRows.length; i++)
                    {   
                        // put dbdata[i] into reactantGridData[i];
                        // then do the updating stuff based on change to mwt and to density.
                        reactantGridData[missingRows[i]].mwt = newCompounds[i].mwt;
                        reactantGridData[missingRows[i]].formula = newCompounds[i].formula;
                        reactantGridData[missingRows[i]].inchi = newCompounds[i].inchi;
                        reactantGridData[missingRows[i]].cpd_name = newCompounds[i].cpd_name || "";
                        reactantGridData[missingRows[i]].cas_number = newCompounds[i].cas_number || "";
                        if(newCompounds[i].density) {
                            reactantGridData[missingRows[i]].density = newCompounds[i].density;
                        }
                        reactantGridData[missingRows[i]].cpd_type = "Reactant";
                        
                        // update row calculations
                        reactantGridData = recalcOwnRow(reactantGridData, missingRows[i]);                              
                        
                    }
                } else if ( newCompounds.length > missingRows.length) {
                    // we can guess that the user has added compounds and changed missingRows.length number of cpds.
                    // the added compounds are probably last in newCompounds, changed ones coming last
                    var numAddedCompounds = newCompounds.length - missingRows.length;
                    
                    //first we will add our compounds. New compounds come last in the newCompounds array.
                    for(i=numAddedCompounds-1; i >= 0; i--) {
                        reactantGridData.unshift(newCompounds[newCompounds.length-1-i]);
                        limitIndex = getLimitIndex(reactantGridData);
                        if(limitIndex === undefined) {
                            reactantGridData[0].limiting = true;
                            reactantGridData[0].mol = 0.001;
                            limitIndex = 0;
                        } else {
                            reactantGridData[0].limiting = false;
                        }
                        reactantGridData[0].cpd_type = "Reactant";
                        reactantGridData[0].equiv = 1;
                        reactantGridData[0].mol = reactantGridData[limitIndex].mol;
                        reactantGridData[0].mass = reactantGridData[0].mol * reactantGridData[0].mwt;
                        if(reactantGridData[0].density) {
                            reactantGridData[0].vol = reactantGridData[0].mass / reactantGridData[0].density;
                        } else if (reactantGridData[0].conc) {
                            reactantGridData[0].vol = reactantGridData[0].mol / reactantGridData[0].conc;
                        }
                    }
                    // now we will update our existing rows
                    
                    for (i=0; i<missingRows.length; i++) {
                        var gridRowIndex = missingRows[i]+numAddedCompounds;
                        reactantGridData[gridRowIndex].mwt = newCompounds[i].mwt;
                        reactantGridData[gridRowIndex].formula = newCompounds[i].formula;
                        reactantGridData[gridRowIndex].inchi = newCompounds[i].inchi;
                        reactantGridData[gridRowIndex].cpd_name = newCompounds[i].cpd_name;
                        reactantGridData[gridRowIndex].cas_number = newCompounds[i].cas_number;
                        if(newCompouds[i].density) {
                            reactantGridData[gridRowIndex].density = newCompounds[i].density;
                        }
                        reactantGridData[gridRowIndex].cpd_type = "Reactant";
                        //update row calculations                           
                        reactantGridData = recalcOwnRow(reactantGridData, gridRowIndex);                            
                    }
                } else { // missingRows > newCompounds 
                    // delete missing rows then add newcompounds as new rows.

                    for (i=missingRows.length-1; i>=0; i--) {
                        reactantGridData.splice(reactantGridData.indexOf(reactantGridData[missingRows[i]]),1);
                    }
                    for (i=0; i<newCompounds.length; i++) {
                        reactantGridData.unshift(newCompounds[newCompounds.length-1-i]);
                        limitIndex = getLimitIndex(reactantGridData);
                        if(limitIndex === undefined) {
                            reactantGridData[0].limiting = true;
                        } else {
                            reactantGridData[0].limiting = false;
                        }
                        reactantGridData[0].equiv = 1;
                        reactantGridData = recalcOwnRow(reactantGridData, 0);
                    }
                }
                grid.setData(reactantGridData);
                grid.render();  
            }
        });
}

$("canvas").on("mouseout", function() {
    updateScheme();
});

function getLimitIndex(gridData) {
    var limitIndex;
    for (var i=0; i<gridData.length; i++) {
        if(gridData[i].limiting) {
            limitIndex = i;
        }
    }
    return limitIndex;
}

function recalcOwnRow(gridData, gridRowIndex) {
    var limitIndex = getLimitIndex(gridData);
    gridData[gridRowIndex].mol = gridData[limitIndex].mol * gridData[gridRowIndex].equiv;
    gridData[gridRowIndex].mass = gridData[gridRowIndex].mol * gridData[gridRowIndex].mwt;
    if(gridData[gridRowIndex].density) {
        gridData[gridRowIndex].vol = gridData[gridRowIndex].mass / gridData[gridRowIndex].density;
    } else if (gridData[gridRowIndex].conc) {
        gridData[gridRowIndex].vol = gridData[gridRowIndex].mol / gridData[gridRowIndex].conc;
    }
    gridData[gridRowIndex].mol_units = getMolUnits(gridData[gridRowIndex].mol);
    gridData[gridRowIndex].mass_units = getMassUnits(gridData[gridRowIndex].mass);
    gridData[gridRowIndex].vol_units = getVolUnits(gridData[gridRowIndex].vol);
    gridData[gridRowIndex].conc_units = getConcUnits(gridData[gridRowIndex].conc);
    gridData[gridRowIndex].density_units = 'g/mL';
    return gridData;
}

function preSubmit() {
    document.editXP.rxn_input.value = rxn;
    document.editXP.grid_input.value = JSON.stringify(grid.getData());
}