function schemeViewer(rxn, height, width) {
    if(!height) {
        height = 200;
    }
    if(!width) {
        width = 600;
    }
    var viewerName = 'viewer' + Math.round(Math.random() * 10000);
    this[viewerName] = new ChemDoodle.ViewerCanvas(viewerName, width, height);
    this[viewerName].specs.atoms_displayTerminalCarbonLabels_2D = true;
    // sets atom labels to be colored by JMol colors, which are easy to recognize
    this[viewerName].specs.atoms_useJMOLColors = true;
    // enables overlap clear widths, so that some depth is introduced to overlapping bonds
    this[viewerName].specs.bonds_clearOverlaps_2D = true;
    // sets the shape color to improve contrast when drawing figures
    this[viewerName].specs.shapes_color = 'c10000';
    
    this[viewerName].emptyMessage = "No reaction defined";
    // because we do not load any content, we need to repaint the sketcher, otherwise we would just see an empty area with the toolbar
    // however, you can instead use one of the Canvas.load... functions to pre-populate the canvas with content, then you don't need to call repaint
    if(rxn !== "") {
        var reaction_cd = ChemDoodle.readRXN(rxn);
        this[viewerName].loadContent(reaction_cd.molecules, reaction_cd.shapes);
    }
}

function moleculeViewer(molecule, height, width) {
    if(!height) {
        height = 200;
    }
    if(!width) {
        width = 200;
    }
    var viewerName = 'viewer' + Math.round(Math.random() * 10000);
    this[viewerName] = new ChemDoodle.ViewerCanvas(viewerName, width, height);
    this[viewerName].specs.atoms_displayTerminalCarbonLabels_2D = true;
    // sets atom labels to be colored by JMol colors, which are easy to recognize
    this[viewerName].specs.atoms_useJMOLColors = true;
    // enables overlap clear widths, so that some depth is introduced to overlapping bonds
    this[viewerName].specs.bonds_clearOverlaps_2D = true;
    // sets the shape color to improve contrast when drawing figures
    this[viewerName].specs.shapes_color = 'c10000';
    
    this[viewerName].emptyMessage = "No molecule defined";

    if(molecule) {
        this[viewerName].loadMolecule(ChemDoodle.readMOL(molecule));
    }
}