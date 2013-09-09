<?php
/********************************************************************************
*                                                                               *
*   Copyright 2012-2013 Nicolas CARPi (nicolas.carpi@gmail.com),				*
*  				   Martin Peeks (martinp23@gmail.com)                           *
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
require_once('inc/common.php');

//Array to store validation errors
$msg_arr = array();
//Validation error flag
$errflag = false;

// CHECKS
// ID
if(is_pos_int($_POST['item_id'])){
    $id = $_POST['item_id'];
} else {
    $id='';
    $msg_arr[] = 'The id parameter is not valid !';
    $errflag = true;
}
$title = check_title($_POST['title']);
$date = check_date($_POST['date']);
$body = check_body($_POST['body']);
$status = check_status($_POST['status']);
$bodyChanged = check_bool($_POST['body_changed']);
$titleChanged = check_bool($_POST['title_changed']);
$oldid = $_POST['oldid'];
// not sanitised! This is not committed to the db.
$type = $_POST['type'];

if($type === 'chemsingle') {
    $rxn = check_rxn($_POST['rxn_input']);
    $grid = $_POST['grid_input'];
    $prodGrid = $_POST['prodGrid_input'];
    $gridColumns = $_POST['grid_columns'];
    $prodGridColumns = $_POST['prodGrid_columns'];
    
    $rxnChanged = check_bool($_POST['rxn_changed']);
    $gridChanged = check_bool($_POST['grid_changed']);
    $prodGridChanged = check_bool($_POST['prodGrid_changed']);
    $gridColumnsChanged = check_bool($_POST['gridColumns_changed']);
    $prodGridColumnsChanged = check_bool($_POST['prodGridColumns_changed']);
    $rxn_png = $_POST['rxn_png'];
} else {
    $rxnChanged = false;
    $gridChanged = false;
    $prodGridChanged = false;
    $gridColumnsChanged = false;
    $prodGridColumnsChanged = false;
}

// Store stuff in Session to get it back if error input
$_SESSION['new_title'] = $title;
$_SESSION['new_date'] = $date;
$_SESSION['new_status'] = $status;

// If input errors, redirect back to the experiment form
if($errflag) {
    $_SESSION['errors'] = $msg_arr;
    session_write_close();
    header("location: experiments.php?mode=show&id=$id");
    exit();
}

// if nothing is changed, we can just return.
if(!$rxnChanged && !$gridChanged && !$prodGridChanged && !$bodyChanged && !$titleChanged && !$gridColumnsChanged && !$prodGridColumnsChanged) {
	unset($_SESSION['new_title']);
    unset($_SESSION['new_date']);
    unset($_SESSION['status']);
    unset($_SESSION['errors']);
    header("location: experiments.php?mode=view&id=$id");
    return;
}

// SQL for editXP
//first we want to get the oldid rev info
$sql = "SELECT * from revisions WHERE rev_id = :revid";
$req = $bdd->prepare($sql);
$result = $req->execute(array('revid' => $oldid));
$oldrev = $req->fetch(PDO::FETCH_ASSOC);
$bdd->beginTransaction();

    if($type === 'chemsingle' || $type === 'chemparallel') {
    	$stoicTableRev;
		$prodTableRev;
		$rxn_id;
    	if($rxnChanged) {
    		
			// first save our png of the reaction scheme
			$pngData = base64_decode(substr($rxn_png, strpos($rxn_png, ",")+1));
			$pngFileName = 'uploads/internal/rxn-scheme-' . $id . '-' . substr(md5(microtime()),rand(0,26),10) . '.png';
			$fp = fopen($pngFileName, 'wb');
			fwrite($fp, $pngData);
			fclose($fp);
			// then continue database insert of reaction scheme
			$sql = "INSERT INTO reactions(user_id, experiment_id, rxn_mdl, rxn_image) VALUES(:userid, :expid, :rxn, :rxn_image)";
			$req = $bdd->prepare($sql);
			$result = $req->execute(array(
				'userid' => $_SESSION['userid'],
				'expid' => $id,
				'rxn'	=> $rxn,
				'rxn_image' => $pngFileName ));	
			$rxn_id = $bdd->lastInsertId();
			
			// then we want to separate our rxn scheme into products and reactant molecules
			$rxn_content = explode("\$MOL\n", $rxn);
            $header_lines = explode("\n", $rxn_content[0]);
            $num_react = intval(substr($header_lines[4], 0,3));
            $num_prod = intval(substr($header_lines[4], 3,6));
            $molecules = array();
            for ($i = 0; $i < $num_react + $num_prod; $i ++) {
                $molecules[] = $rxn_content[$i+1];
            }
            
			
			// then get the compound number (from compounds table) for each molecule. If molecule isn't in table,
			// put it in and generate fingerprints
			$cids = array();
			for($i = 0; $i < count($molecules); $i++) {
			    $inchi = getInChI($molecules[$i], $bdd);
			    $cid = findInChI($inchi, $bdd);
			    if ($cid) {
			        $cids[] = $cid;
			    }
                else {
                    $sql = "INSERT INTO compounds(name, created, user_id_entrant) VALUES('', NOW(), :userid)";
                    $req = $bdd->prepare($sql);
                    $result = $req->execute(array(
                        'userid' => $_SESSION['userid']));
                    
                    $cid = $bdd->lastInsertId();    

                    $sql = "INSERT INTO 3D_structures(compound_id, molfile) VALUES(:cid, :molfile)";
                    $req = $bdd->prepare($sql);
                    $result = $req->execute(array(
                        'cid'     => $cid,
                        'molfile' => $molecules[$i]));
                    
                    $sql = "INSERT INTO `1D_structures` (`compound_id`,`inchi`,`smiles`) SELECT `compound_id`, MOLECULE_TO_INCHI(`molfile`), MOLECULE_TO_SMILES(`molfile`) FROM `3D_structures` WHERE `compound_id` = :cid;";
                    $req = $bdd->prepare($sql);
                    $result = $req->execute(array(
                        'cid'     => $cid));

                    $sql = "INSERT INTO `bin_structures` (`compound_id`,`fp2`,`obserialized`) SELECT `compound_id`, FINGERPRINT2(`molfile`), MOLECULE_TO_SERIALIZEDOBMOL(`molfile`) FROM `3D_structures` WHERE `compound_id` = :cid;";
                    $req = $bdd->prepare($sql);
                    $result = $req->execute(array(
                        'cid'     => $cid));
    
                    $sql = "INSERT INTO compound_properties (compound_id, mwt, exact_mass, clogp, formula, num_donor, num_acceptor, num_heavyat, num_rings, num_rot_bond, tot_charge, num_atom, num_bond, mol_psa, is_chiral) SELECT compound_id, MOLWEIGHT(molfile), EXACTMASS(molfile), MOLLOGP(ADD_HYDROGENS(molfile)), molformula(molfile), NUMBER_OF_DONORS(ADD_HYDROGENS(molfile)), NUMBER_OF_ACCEPTORS(ADD_HYDROGENS(molfile)), NUMBER_OF_HEAVY_ATOMS(molfile), NUMBER_OF_RINGS(molfile), NUMBER_OF_ROTABLE_BONDS(molfile), TOTAL_CHARGE(molfile), NUMBER_OF_ATOMS(ADD_HYDROGENS(molfile)), NUMBER_OF_BONDS(ADD_HYDROGENS(molfile)), MOLPSA(ADD_HYDROGENS(molfile)), IS_CHIRAL(molfile) FROM 3D_structures WHERE `compound_id` = :cid;";
                    $req = $bdd->prepare($sql);
                    $result = $req->execute(array(
                        'cid'     => $cid));
                    
                    $cids[] = $cid;
                }
			}
			
		    // let's set up some arrays equipped to do a multi-line mysql insert w/PDO
			for($i = 0; $i < $num_react; $i++) {
			    $reacts_to_insert[] = $id;
			    $reacts_to_insert[] = $cids[$i];
			}
			for($i = $num_react; $i < $num_prod+$num_react; $i++) {
			    $prods_to_insert[] = $id;
                $prods_to_insert[] = $cids[$i];
            }
            
            // and then populate relation tables to x-reference exp_id and cpd_ids.
            // first by deleting any existing crossreferences for the given expt
            $sql = "DELETE FROM rel_exp_structure_react WHERE exp_id = :exp_id";
            $req = $bdd->prepare($sql);
            $result = $req->execute(array(
                'exp_id'    => $id));
            
            $sql = "DELETE FROM rel_exp_structure_prod WHERE exp_id = :exp_id";
            $req = $bdd->prepare($sql);
            $result = $req->execute(array(
                'exp_id'    => $id));
            
            if($num_react > 0) {
                $insertPlaceHolder = implode(',', array_fill(0, $num_react, '(?,?)'));
                $sql = "INSERT INTO rel_exp_structure_react (exp_id, cpd_id) VALUES " . $insertPlaceHolder;
                $req = $bdd->prepare($sql);
                $result = $req->execute($reacts_to_insert);
            }
            
            if($num_prod > 0) {
                $insertPlaceHolder = implode(',', array_fill(0, $num_prod, '(?,?)'));                
                $sql = "INSERT INTO rel_exp_structure_prod (exp_id, cpd_id) VALUES " . $insertPlaceHolder;
                $req = $bdd->prepare($sql);
                $result = $req->execute($prods_to_insert);
            }
			
		} else {
			$rxn_id = $oldrev['rev_reaction_id'];
		}
		 if($gridChanged) {
		 	// tables are stored by row in the stoichiometry table, tied back to an experiment id (exp_id) and an incrementing revision of the table
		 	// this table_rev_id is distinct from the actual revision id, so that we don't save multiple copies of the table when the user isn't 
		 	// changing it between edits.
		 	
		 	$stoicTableRev = $oldrev['rev_stoictab_id']+1;
			$grid = json_decode($grid, true);
			for ($i = 0; $i < count($grid); $i++) {
				$sql = "INSERT INTO rxn_stoichiometry(exp_id, table_rev_id, row_id, cpd_name, cpd_id, cas_number, cpd_type, supplier, batch_ref,
				mwt, mass, vol, mol, density, equiv, conc, solvent, limiting, notes, weightpercent, mwt_units, mass_units, mol_units, vol_units,
				density_units, conc_units, formula, inchi) VALUES(:exp_id, :table_rev_id, :row_id, :cpd_name, :cpd_id, :cas_number, :cpd_type, :supplier, :batch_ref,
				:mwt, :mass, :vol, :mol, :density, :equiv, :conc, :solvent, :limiting, :notes, :weightpercent, :mwt_units, :mass_units, :mol_units, :vol_units,
				:density_units, :conc_units, :formula, :inchi)";
				$req = $bdd->prepare($sql, array(PDO::ATTR_EMULATE_PREPARES => false));
				$values = array(
			        'exp_id' => $id,
			        'table_rev_id' => $stoicTableRev,
			        'row_id' => $i,
			        'cpd_name' => isset($grid[$i]['cpd_name']) ? $grid[$i]['cpd_name'] : null,
			        'cpd_id' => isset($grid[$i]['cpd_id']) ? $grid[$i]['cpd_id'] : null,
			        'cas_number' => isset($grid[$i]['cas_number']) ? $grid[$i]['cas_number'] : null,
			        'cpd_type' => isset($grid[$i]['cpd_type']) ? $grid[$i]['cpd_type'] : null,
			        'supplier' => isset($grid[$i]['supplier']) ? $grid[$i]['supplier'] : null,
			        'batch_ref' => isset($grid[$i]['batch_ref']) ? $grid[$i]['batch_ref'] : null,
			        'mwt' => isset($grid[$i]['mwt']) ? $grid[$i]['mwt'] : null,
			        'mass' => isset($grid[$i]['mass']) ? $grid[$i]['mass'] : null,
			        'vol' => isset($grid[$i]['vol']) ? $grid[$i]['vol'] : null,
			        'mol' => isset($grid[$i]['mol']) ? $grid[$i]['mol'] : null,
			        'density' => isset($grid[$i]['density']) ? $grid[$i]['density'] : null,
			        'equiv' => isset($grid[$i]['equiv']) ? $grid[$i]['equiv'] : null,
			        'conc' => isset($grid[$i]['conc']) ? $grid[$i]['conc'] : null,
			        'solvent' => isset($grid[$i]['solvent']) ? $grid[$i]['solvent'] : null,
			        'limiting' => isset($grid[$i]['limiting']) ? $grid[$i]['limiting'] : null,
			        'notes' => isset($grid[$i]['notes']) ? $grid[$i]['notes'] : null,
			        'weightpercent' => isset($grid[$i]['weightpercent']) ? $grid[$i]['weightpercent'] : null,
			        'mwt_units' => isset($grid[$i]['mwt_units']) ? $grid[$i]['mwt_units'] : null,
			        'mass_units' => isset($grid[$i]['mass_units']) ? $grid[$i]['mass_units'] : null,
			        'mol_units' => isset($grid[$i]['mol_units']) ? $grid[$i]['mol_units'] : null,
			        'vol_units' => isset($grid[$i]['vol_units']) ? $grid[$i]['vol_units'] : null,
			        'density_units' => isset($grid[$i]['density_units']) ? $grid[$i]['density_units'] : null,
			        'conc_units' => isset($grid[$i]['conc_units']) ? $grid[$i]['conc_units'] : null,
			        'formula' => isset($grid[$i]['formula']) ? $grid[$i]['formula'] : null,
			        'inchi' => isset($grid[$i]['inchi']) ? $grid[$i]['inchi'] : null);
				$result = $req->execute($values);		 
			}	
		 } else {
		 	$stoicTableRev = $oldrev['rev_stoictab_id'];
		 }
		if($prodGridChanged) {
			$prodGrid = json_decode($prodGrid,true);
			$prodTableRev = $oldrev['rev_prodtab_id']+1;
				for ($i = 0; $i < count($prodGrid); $i++) {
					$sql = "INSERT INTO rxn_product_table(table_rev_id, row_id, exp_id, cpd_name, cpd_id, batch_ref,
					mwt, mass, mol, equiv, notes, purity, nmr_ref, anal_ref1, anal_ref2, mpt, alphad, yield, colour, state, inchi, mass_units, mol_units) 
					VALUES(:table_rev_id, :row_id, :exp_id, :cpd_name, :cpd_id, :batch_ref,
					:mwt, :mass, :mol, :equiv, :notes, :purity, :nmr_ref, :anal_ref1, :anal_ref2, :mpt, :alphad, :yield, :colour, :state, :inchi, 
					:mass_units, :mol_units)";								
					$req = $bdd->prepare($sql, array(PDO::ATTR_EMULATE_PREPARES => false));
					$values = array(
						'table_rev_id' => $prodTableRev,
				        'row_id' => $prodGrid[$i]['id'],
				        'exp_id' => $id,
				        'cpd_name' => $prodGrid[$i]['cpd_name'],
                        'cpd_id' => isset($prodGrid[$i]['cpd_id']) ? $prodGrid[$i]['cpd_id'] : null,
                        'batch_ref' => isset($prodGrid[$i]['batch_ref']) ? $prodGrid[$i]['batch_ref'] : null,
                        'mwt' => isset($prodGrid[$i]['mwt']) ? $prodGrid[$i]['mwt'] : null,
                        'mass' => isset($prodGrid[$i]['mass']) ? $prodGrid[$i]['mass'] : null,
                        'mol' => isset($prodGrid[$i]['mol']) ? $prodGrid[$i]['mol'] : null,
                        'equiv' => isset($prodGrid[$i]['equiv']) ? $prodGrid[$i]['equiv'] : null,
                        'notes' => isset($prodGrid[$i]['notes']) ? $prodGrid[$i]['notes'] : null,
                        'purity' => isset($prodGrid[$i]['purity']) ? $prodGrid[$i]['purity'] : null,
                        'mass_units' => isset($prodGrid[$i]['mass_units']) ? $prodGrid[$i]['mass_units'] : null,
                        'mol_units' => isset($prodGrid[$i]['mol_units']) ? $prodGrid[$i]['mol_units'] : null,
                        'nmr_ref' => isset($prodGrid[$i]['nmr_ref']) ? $prodGrid[$i]['nmr_ref'] : null,
                        'anal_ref1' => isset($prodGrid[$i]['anal_ref1']) ? $prodGrid[$i]['anal_ref1'] : null,
                        'anal_ref2' => isset($prodGrid[$i]['anal_ref2']) ? $prodGrid[$i]['anal_ref2'] : null,
                        'mpt' => isset($prodGrid[$i]['mpt']) ? $prodGrid[$i]['mpt'] : null,
                        'alphad' => isset($prodGrid[$i]['alphad']) ? $prodGrid[$i]['alphad'] : null,
                        'yield' => isset($prodGrid[$i]['yield']) ? $prodGrid[$i]['yield'] : null,
                        'colour' => isset($prodGrid[$i]['colour']) ? $prodGrid[$i]['colour'] : null,
                        'state' => isset($prodGrid[$i]['state']) ? $prodGrid[$i]['state'] : null,
                        'inchi' => isset($prodGrid[$i]['inchi']) ? $prodGrid[$i]['inchi'] : null);
		
					$result = $req->execute($values);
				}
			} else {
				$prodTableRev = $oldrev['rev_prodtab_id'];
			}
			
		$sql = "INSERT INTO revisions(user_id, experiment_id, rev_notes, rev_body, rev_title, rev_reaction_id, rev_stoictab_id, rev_prodtab_id, 
		rev_stoictab_col, rev_prodtab_col) VALUES(:userid, :expid, :notes, :body, :title, :rxn_id, :stoicTableRev, :prodTableRev, :stoicCol, 
		:prodCol)";
	    $req = $bdd->prepare($sql);
	    $result = $req->execute(array(
	        'title' => $title,
	        'expid' => $id,
	        'notes' => "TODO",
	        'body' => $body,
	        'rxn_id' => $rxn_id,
	        'stoicTableRev' => $stoicTableRev,
	        'prodTableRev' => $prodTableRev,
	        'stoicCol' => $gridColumns,
	        'prodCol' => $prodGridColumns,
	        'userid' => $_SESSION['userid']));
	    $rev_id = $bdd->lastInsertId();   
	
	} else {

	$sql = "INSERT INTO revisions(user_id, experiment_id, rev_notes, rev_body, rev_title) VALUES(:userid, :expid, :notes, :body, :title)";
    $req = $bdd->prepare($sql);
    $result = $req->execute(array(
        'title' => $title,
        'expid' => $id,
        'notes' => "TODO",
        'body' => $body,
        'userid' => $_SESSION['userid']));
		$rev_id = $bdd->lastInsertId();  
	}
	
    $sql = "UPDATE experiments 
        SET 
        date = :date, 
        status = :status, 
        rev_id = :revid
        WHERE userid_creator = :userid 
        AND id = :id";
	$req = $bdd->prepare($sql);
	$result = $req->execute(array(
	    'date' => $date,
	    'status' => $status,
	    'revid' => $rev_id,
	    'userid' => $_SESSION['userid'],
	    'id' => $id
	));
	
	$result = $bdd->commit();


// Check if insertion is successful
if($result) {
    unset($_SESSION['new_title']);
    unset($_SESSION['new_date']);
    unset($_SESSION['status']);
    unset($_SESSION['errors']);
    header("location: experiments.php?mode=view&id=$id");
} else {
    die('Something went wrong in the database query. Check the flux capacitor.');
}

