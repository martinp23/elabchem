<?php
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
?>
<script src="js/tinymce/tinymce.min.js"></script>
        <!-- stylesheets extra -->
                <meta http-equiv="X-UA-Compatible" content="chrome=1">
                <link rel="stylesheet" href="js/chemdoodleweb/ChemDoodleWeb.css" type="text/css">
                <link rel="stylesheet" href="js/chemdoodleweb/sketcher/jquery-ui-1.9.2.custom.css" type="text/css">
        <!-- these are required by the ChemDoodle Web Components library -->
                <script type="text/javascript" src="js/chemdoodleweb/ChemDoodleWeb-libs.js"></script>
                <script type="text/javascript" src="js/chemdoodleweb/ChemDoodleWeb.js"></script>
                    
    <!-- these are required by the SketcherCanvas plugin -->
                <script type="text/javascript" src="js/chemdoodleweb/sketcher/jquery-ui-1.9.2.custom.min.js"></script>
                <script type="text/javascript" src="js/chemdoodleweb/sketcher/ChemDoodleWeb-sketcher.js"></script>

    <!-- now all the slickgrid stuff-->


                <script type="text/javascript" src="js/chem-editors.js"></script>    
                <script type="text/javascript" src="js/chem-formatters.js"></script>     
                <script type="text/javascript" src="js/chemistry-functions.js"></script> 
<?php
// ID
if(isset($_GET['regid']) && !empty($_GET['regid']) && is_pos_int($_GET['regid'])){
    $id = $_GET['regid'];
} else if (isset($_REQUEST['mode']) && ($_REQUEST['mode'] === 'create')){
    $id = 0;
} else {
    die("The id parameter in the URL isn't a valid registration ID.");
}

$parentregno = '';

if($id > 0) {
    $sql = "SELECT reg.cpd_id, reg.regno, reg.no_structure, reg.validated, reg.userid_entrant, reg.userid_registrar, reg.is_salt, 
    reg.parent_regid, cpd.name, cpd.cas_number, cpd.pubchem_id,
    cpd.chemspider_id, cpd.notes, cpd.iupac_name, prop.mwt, prop.exact_mass, prop.formula, prop.is_chiral, prop.density, 1d.inchi
     FROM compound_registry AS reg JOIN compounds AS cpd ON reg.cpd_id = cpd.id JOIN compound_properties AS prop
            ON reg.cpd_id = prop.compound_id JOIN 1D_structures AS 1d ON reg.cpd_id = 1d.compound_id WHERE reg.id = :id";
    $req = $bdd->prepare($sql);
    $req->execute(array('id' => $id));
    $reg_data = $req->fetch();
    
    $cpdid = $reg_data['cpd_id'];
    
    if($reg_data['no_structure'] === '0') {
        $sql = "SELECT 3d.molfile FROM 3D_structures AS 3d JOIN compound_registry AS reg ON reg.cpd_id = 3d.compound_id WHERE reg.id = :id";
        $req = $bdd->prepare($sql);
        $req->execute(array('id' => $id));
        $mol_data = $req->fetch();
        $mol = $mol_data[0];
    }
    
    if($reg_data['validated'] === '0') {
        $status = 'pending';
    } else {
        $status = 'validated';
    }
    
    
    if($reg_data['is_salt']) {
        $sql = "SELECT regno FROM compound_registry WHERE id = :parentid";
        $req = $bdd->prepare($sql);
        $result = $req->execute(array('parentid'    =>  $reg_data['parent_regid']));
        $nums = $req->fetch();
            if (count($nums) === 2) {
                $parentregno = $nums[0];
            } else {
                die("Something bad happened. The requested compound is marked as a salt, but its parent compound is not stored. This shouldn't happen. Report this to your database administrator and ask them to manually fix the registry id $id.");
            }
    }
} else {
    $cpdid = '';
    $status = 'pending';
    $reg_data = array();
}


// BEGIN CONTENT
?>
<section id='view_chemreg_item' class='item <?php echo $status;?>'>
<?php if($_REQUEST['mode'] !== 'create') { ?>
    <a class='align_right' href='delete_item.php?id=<?php echo $id;?>&type=regcpd' onClick="return confirm('Delete this entry?');"><img src='themes/<?php echo $_SESSION['prefs']['theme'];?>/img/trash.png' title='delete' alt='delete' /></a>
<?php } ?>
<!-- BEGIN EDITChemReg FORM -->
<form id="editChemReg" name="editChemReg" method="post" action="editChemReg-exec.php" onsubmit='return preSubmit();' enctype='multipart/form-data'>
<input name='regid' type='hidden' value='<?php echo $id;?>' />
<input name='cpdid' type='hidden' value='<?php echo $cpdid;?>' />

<p class='inline'><strong>Registration number: </strong><input type='hidden' id='regno' name='regno' value='<?php if(!empty($reg_data['regno']) && ($_REQUEST['mode'] !== 'create')) {
         echo $reg_data['regno'] . "'></input>" . $reg_data['regno']; 
         } else { echo "unassigned'></input>unassigned"; }?></p><br />
<br />
    <div id='cpd_display' style='float:right;overflow:auto;position:relative;margin-right:150px;'>  <canvas id='viewer_display' onClick='showEditStructureDialog();return false;'></canvas>
        
        <p><input type="button" class='button' value='Edit structure' onClick='showEditStructureDialog();return false;'></p>

        
    </div>
    <script type='text/javascript'>
         var viewer_display = new ChemDoodle.ViewerCanvas('viewer_display', 150, 150);
         viewer_display.emptyMessage = 'No structure';
         var mol = '';
         <?php if($mol) {  ?> 
             mol = <?php echo json_encode($mol); ?>;    
             viewer_display.loadMolecule(ChemDoodle.readMOL(mol));
         <?php } ?>
         viewer_display.repaint();
   
        </script>
            </div>

<h4>Name</h4><br />
      <textarea id='name_txt' name='name' rows="1" cols="40"><?php if(empty($_SESSION['errors']) && ($_REQUEST['mode'] !== 'create')){
          echo stripslashes($reg_data['name']);
      }  ?></textarea>
      <input type='image' src='img/loupe-15px.png' class='cpdEditLoupe' title='Get name from structure using PubChem' alt='Try to get name from structure using PubChem' onClick="getNameFromInchi(document.getElementById('name_txt'), document.getElementById('inchi').value, 'iupac_name');return false;">

<br /><br />
<h4>IUPAC Name</h4><br />
      <textarea id='iupacname_txt' name='iupac_name' rows="1" cols="40"><?php if(empty($_SESSION['errors']) && ($_REQUEST['mode'] !== 'create')){
          echo stripslashes($reg_data['iupac_name']);
      }  ?></textarea>
      <input type='image' src='img/loupe-15px.png' class='cpdEditLoupe' title='Get name from structure using PubChem' alt='Try to get name from structure using PubChem' onClick="getNameFromInchi(document.getElementById('iupacname_txt'), document.getElementById('inchi').value, 'iupac_name'); return false;">
<br /><br />
<h4>CAS Number</h4><br />
      <textarea id='cas_txt' name='cas_number' rows="1" cols="10"><?php if(empty($_SESSION['errors']) && ($_REQUEST['mode'] !== 'create')){
          echo stripslashes($reg_data['cas_number']);
      }  ?></textarea>
      <input type='image' src='img/loupe-15px.png' class='cpdEditLoupe' title='Get name from structure using PubChem' alt='Try to get name from structure using PubChem' onClick="getNameFromInchi(document.getElementById('cas_txt'), document.getElementById('inchi').value, 'cas'); return false;">

<br /><br />

<h4>PubChem ID</h4><br />
      <textarea id='pubchem_txt' name='pubchem_id' rows="1" cols="10"><?php if(empty($_SESSION['errors']) && ($_REQUEST['mode'] !== 'create')){
          echo stripslashes($reg_data['pubchem_id']);
      }  ?></textarea>

<br /><br />

<h4>Chemspider ID</h4><br />
      <textarea id='chemspider_txt' name='chemspider_id' rows="1" cols="10"><?php if(empty($_SESSION['errors']) && ($_REQUEST['mode'] !== 'create')){
          echo stripslashes($reg_data['chemspider_id']);
      }  ?></textarea>
      <input type='image' src='img/loupe-15px.png' class='cpdEditLoupe' title='Get name from structure using PubChem' alt='Try to get name from structure using PubChem' onClick="getNameFromInchi(document.getElementById('chemspider_txt'), document.getElementById('inchi').value, 'chemspider'); return false;">

<br /><br />

<h4>Mol. wt.</h4><br />
      <textarea id='mwt_txt' name='mwt' rows="1" cols="10" <?php if ($mol) {
          echo 'disabled';
      } 
        echo '>';
      if(empty($_SESSION['errors']) && ($_REQUEST['mode'] !== 'create')){
          echo stripslashes($reg_data['mwt']);
      }  ?></textarea>

<br /><br />
<h4>Exact mass</h4><br />
      <textarea id='exact_mass_txt' name='exact_mass' rows="1" cols="10" <?php if ($mol) {
          echo 'disabled';
      } 
        echo '>';
      if(empty($_SESSION['errors']) && ($_REQUEST['mode'] !== 'create')){
          echo stripslashes($reg_data['mwt']);
      }  ?></textarea>

<br /><br />

<h4>Formula</h4><br />
      <textarea id='formula_txt' name='formula' rows="1" cols="15" <?php if($mol) {
          echo 'disabled';
          } 
          echo '>';
          if(empty($_SESSION['errors']) && ($_REQUEST['mode'] !== 'create')){
          echo stripslashes($reg_data['formula']);
      }  ?></textarea>

<br /><br />

<h4>Density</h4><br />
      <textarea id='density_txt' name='density' rows="1" cols="10"><?php if(empty($_SESSION['errors']) && ($_REQUEST['mode'] !== 'create')){
          echo stripslashes($reg_data['density']);
      }  ?></textarea>

<br /><br />

<label><input type='checkbox' id='saltCheck' name='saltCheck' value="true" <?php if(empty($_SESSION['errors']) && ($_REQUEST['mode'] !== 'create')){
    if($reg_data['is_salt']) {
        echo 'checked';
    }
}
?>></input>Compound is a salt</label>
<br />
            <p id='parentRegNumMain' style='display:<?php
            if(empty($_SESSION['errors']) && ($_REQUEST['mode'] !== 'create')){
                if($reg_data['is_salt']) {
                    echo 'block';
                } else {
                    echo 'none';
                }
            } else {
                echo 'none';
            }
            ?>;'>Parent compound reg. num.<input type='text' id='cpdParentRegNum' name='cpdParentRegNum' value='<?php
                echo $parentregno;
            
            ?>'></input> <br /></p>
<br />

<h4>Notes</h4><br />
      <textarea id='notes_txt' name='notes' rows="1" cols="10"><?php if(empty($_SESSION['errors']) && ($_REQUEST['mode'] !== 'create')){
          echo stripslashes($reg_data['notes']);
      }  ?></textarea>

<br /><br /><br />
<label><input name="validated" value="true" type="checkbox"  <?php
                // keep the box checked if it was checked
                if($status === 'validated'){
                    echo "checked=checked";
                }?>>Validated&nbsp;&nbsp;</label><br /><br />
<input type='hidden' name='inchi' id='inchi' value='<?php if(empty($_SESSION['errors']) && ($_REQUEST['mode'] !== 'create')){ echo $reg_data['inchi']; } ?>'>
  </div>
  
	<div id='editStructureDialog' title='Edit structure'>        
	     <section><div class=''><div align=center style='width:450px'>
         <canvas id='structEdit'></canvas>
        <!-- <input type='image' href='#' src='img/loupe-15px.png' class='prodDialogLoupe' title='Get name from structure using PubChem' alt='Try to get name from structure using PubChem' onClick=\"getNameFromInchi(document.getElementById('prodName"+i+ "'), '" + productsResults[i]['inchi']+ "');\"/></div> -->        
     <script type='text/javascript'>
            structEditCWC = new ChemDoodle.SketcherCanvas('structEdit', 300, 200, {useServices:false, allowShapes:false});
            structEditCWC.specs.atoms_displayTerminalCarbonLabels_2D = true;
            // sets atom labels to be colored by JMol colors, which are easy to recognize
            structEditCWC.specs.atoms_useJMOLColors = true;
            // enables overlap clear widths, so that some depth is introduced to overlapping bonds
            structEditCWC.specs.bonds_clearOverlaps_2D = true;
            // sets the shape color to improve contrast when drawing figures
            structEditCWC.specs.shapes_color = 'c10000';
               </script>  
            </div>
           
   
            <div class='structEditInputContainer'>
            <label><input type='checkbox' id='cpdSaltCheck' value="true"></input>Compound is a salt</label>
<br />
            <p id='parentRegNumBox' style='display:none;'>Parent compound reg. num.<input type='text' id='editCpdParentRegNum' value=''></input></p>
            <!-- <p class='center'><input type='button' href='#' name='Add batch' onClick="addBatch(document.getElementById('prodName').value, document.getElementById('prodMwt').value, document.getElementById('prodMass').value, document.getElementById('massUnits').value,'');" class='button' value='Add Batch'/></p> -->
            
            <p class="center">
                    <input type="button" href="#" name="Save changes" onclick="closeEditCpdDialog();return false;" class="button" value="Save changes" />
                </p>
            </div></div></section>      
		</div>
	
<script>
	    var editSaltCheckBox = document.getElementById('cpdSaltCheck');
	    
	    editSaltCheckBox.onchange = function() {
	        if(this.checked) {
	            document.getElementById('parentRegNumBox').style.display = 'block';
	        } else {
	            document.getElementById('parentRegNumBox').style.display = 'none';
	        }
	    }
	    
	    var saltCheckBox = document.getElementById('saltCheck');
        
        saltCheckBox.onchange = function() {
            if(this.checked) {
                document.getElementById('parentRegNumMain').style.display = 'block';
            } else {
                document.getElementById('parentRegNumMain').style.display = 'none';
            }
        }
	
	  	$('#editStructureDialog').dialog({ 
	  			modal: true,
		  		autoOpen: false,
		  		width: 'auto',
		  		height: 'auto',
		  		resizable:false});
		  		
  		function showEditStructureDialog() {

            structEditCWC.clear();
            if(viewer_display.getMolecule()) {
                structEditCWC.loadMolecule(ChemDoodle.readMOL(ChemDoodle.writeMOL(viewer_display.getMolecule())));
            }
            structEditCWC.repaint();
            
  			$('#editStructureDialog').dialog('open');
  			return;
	     
  		}
  		function closeEditCpdDialog() {
  		    var molObj = structEditCWC.getMolecule();
            var molChanged = false;
            if(!molObj) {
                this['mol'] = '';
                viewer_display.clear();
                viewer_display.repaint();
                editChemReg.mwt.disabled = false;
                editChemReg.exact_mass.disabled = false;
                editChemReg.formula.disabled = false;
                if(document.getElementById('cpdSaltCheck').checked) {
                    if (document.getElementById('editCpdParentRegNum').value !== '') {
                        editChemReg.saltCheck.checked = true;
                        editChemReg.cpdParentRegNum.value = document.getElementById('editCpdParentRegNum').value;
                        document.getElementById('saltCheck').onchange();
                    } else {
                        alert("You must provide a parent registration number for the product salt.");
                        return false;
                    }
                } else {
                    editChemReg.saltCheck.checked = false;
                    editChemReg.cpdParentRegNum.value = '';
                    document.getElementById('saltCheck').onchange();
                }
                
                $('#editStructureDialog').dialog('close');
                return;     
            }
            
            if(this['mol'] !== ChemDoodle.writeMOL(molObj)) {    
                $.ajax({
                    url: 'getdatafromMOL.php?q=all',
                    data: {'mol': this['mol']},
                    dataType: 'json',
                    type: 'POST',
                    async: false,
                    success: function(cpddata) {
                        if(typeof cpddata['regno'] !== 'undefined') {
                            alert("The specified compound is already registered with registration number " + cpddata['regno']);
                            return false;
                        }
                        if(typeof cpddata['regid'] !== 'undefined') {
                            alert("The specified compound is already pending in the registration database");
                            return false;
                        }
                        if(typeof cpddata['cpd_name'] !== 'undefined') {
                            editChemReg.name.value = cpddata['cpd_name'];
                        } else { editChemReg.name.value = ''; }
                        if(typeof cpddata['iupac_name'] !== 'undefined') {
                            editChemReg.iupac_name.value = cpddata['iupac_name'];
                        } else { editChemReg.iupac_name.value = '';}
                        if(typeof cpddata['cas_number'] !== 'undefined') {
                            editChemReg.cas_number.value = cpddata['cas_number'];
                        } else { editChemReg.cas_number.value = ''; }
                        if(typeof cpddata['pubchem_id'] !== 'undefined') {
                            editChemReg.pubchem_id.value = cpddata['pubchem_id'];
                        } else {editChemReg.pubchem_id.value = ''; }
                        if(typeof cpddata['chemspider_id'] !== 'undefined') {
                            editChemReg.chemspider_id.value = cpddata['chemspider_id'];
                        } else { editChemReg.chemspider_id.value = ''; }
                        if(typeof cpddata['density'] !== 'undefined') {
                            editChemReg.density.value = cpddata['density'];       
                        } else { editChemReg.density.value = ''; }          
                        if(typeof cpddata['mwt'] !== 'undefined') {
                            editChemReg.mwt.value = cpddata['mwt'];
                            editChemReg.mwt.disabled = true;
                        } else {
                            editChemReg.mwt.disabled = false;
                            editChemReg.mwt.value = '';
                        }
                        if(typeof cpddata['exact_mass'] !== 'undefined') {
                            editChemReg.exact_mass.value = cpddata['exact_mass'];
                            editChemReg.exact_mass.disabled = true;
                        } else {
                            editChemReg.exact_mass.disabled = false;
                            editChemReg.exact_mass.value = '';
                        }
                        if(typeof cpddata['formula'] !== 'undefined') {
                            editChemReg.formula.value = cpddata['formula'];
                            editChemReg.formula.disabled = true;
                        } else {
                            editChemReg.formula.disabled = false;
                            editChemReg.formula.value = '';
                        }
                        if(typeof cpddata['id'] !== 'undefined') {
                            editChemReg.cpdid.value = cpddata['id'];
                        } else {
                            editChemReg.cpdid.value = '';
                        }
                        if(typeof cpddata['notes'] !== 'undefined') {
                            editChemReg.notes.value = cpddata['notes'];
                        } else { editChemReg.notes.value = ''; }
                        if(typeof cpddata['inchi'] !== 'undefined') {
                            editChemReg.inchi.value = cpddata['inchi'];
                        } else {
                            editChemReg.inchi.value = '';
                        }
                        
                        if(document.getElementById('cpdSaltCheck').checked) {
                            if (document.getElementById('editCpdParentRegNum').value !== '') {
                                editChemReg.saltCheck.checked = true;
                                editChemReg.cpdParentRegNum.value = document.getElementById('editCpdParentRegNum').value;
                                document.getElementById('saltCheck').onchange();
                            } else {
                                alert("You must provide a parent registration number for the product salt.");
                                return false;
                            }
                        } else {
                            editChemReg.saltCheck.checked = false;
                            editChemReg.cpdParentRegNum.value = '';
                            document.getElementById('saltCheck').onchange();
                        }
           
                        $('#editStructureDialog').dialog('close');
                }});
                             
                this['mol'] = ChemDoodle.writeMOL(molObj);
                viewer_display.loadMolecule(ChemDoodle.readMOL(ChemDoodle.writeMOL(structEditCWC.getMolecule())));
            }
            $('#editStructureDialog').dialog('close');

  			return;  			
  		}
  		
  		function getNameFromInchi(el, inchi, representation) {
	  		$.ajax({
		        url: 'chemIdResolv.php',
		        data:{structId:inchi, representation:representation},
		        
		        success: function(out) {
		            if(out) {
		            	el.value = out;
		            } else {
		            	alert("Unable to find unambiguous value in PubChem/ChemSpider.");
		            }
		        }
	    	});
  		}
  		  		
  		
</script>
<input name='mol' type='hidden' value='' />

<hr class='flourishes'>





<!-- SUBMIT BUTTON -->


<div class='center' id='saveButton'>
      <p class='center'><input type="submit" href="Submit" name="Verify entry" class='button' value='Save and reload'></input></p>
</div>
</form><!-- end editXP form -->

<script>		
function preSubmit() {
	editChemReg.mol.value = mol;
	if(mol == '') {
	    if(editChemReg.mwt.value == '' || isNaN(parseFloat(editChemReg.mwt.value)) ) {
	        alert("Valid value for 'mol. wt.' required.");
	        return false;
	    }
	    if (editChemReg.exact_mass.value == '' || isNaN(parseFloat(editChemReg.exact_mass.value))) {
	        alert("Valid value for 'exact mass' required.");
	        return false;
	    } 
        if (editChemReg.formula.value == '') {
            alert("Valid value for 'formula' required.");
            return false;
        }
	}
	if(editChemReg.name.value == '') {
	    alert("You must provide a name for the compound.");
	    return false;
	}
    return;
}

</script>

</section>

