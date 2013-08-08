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