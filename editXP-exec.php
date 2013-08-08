<?php
/********************************************************************************
*                                                                               *
*   Copyright 2012 Nicolas CARPi (nicolas.carpi@gmail.com)                      *
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
$rxn = check_rxn($_POST['rxn_input']);
$grid = $_POST['grid_input'];
$prodGrid = $_POST['prodGrid_input'];
$gridColumns = $_POST['grid_columns'];
$prodGridColumns = $_POST['prodGrid_columns'];

// not sanitised! This is not committed to the db.
$type = $_POST['type'];

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

// SQL for editXP

    if($type === 'chemsingle' || $type === 'chemparallel') {
    	// do things slightly differently for chemistry expts
		$sql = "INSERT INTO reactions(user_id, experiment_id, rxn_mdl) VALUES(:userid, :expid, :rxn)";
		$req = $bdd->prepare($sql);
		$result = $req->execute(array(
			'userid' => $_SESSION['userid'],
			'expid' => $id,
			'rxn'	=> $rxn ));
			
		$rxn_id = $bdd->lastInsertId();
			
		$sql = "INSERT INTO revisions(user_id, experiment_id, rev_notes, rev_body, rev_title, rev_reaction_id) VALUES(:userid, :expid, :notes, :body, :title, :rxn_id)";
	    $req = $bdd->prepare($sql);
	    $result = $req->execute(array(
	        'title' => $title,
	        'expid' => $id,
	        'notes' => "TODO",
	        'body' => $body,
	        'rxn_id' => $rxn_id,
	        'userid' => $_SESSION['userid']));
	    $rev_id = $bdd->lastInsertId();    
		
	//	$bdd->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
	    $grid = json_decode($grid,true);
		for ($i = 0; $i < count($grid); $i++) {
			if ($i === 0) {
				$sql = "INSERT INTO rxn_stoichiometry(rxn_id, rev_id, row_id, user_id, cpd_name, cpd_id, cas_number, cpd_type, supplier, batch_ref,
				mwt, mass, vol, mol, density, equiv, conc, solvent, limiting, notes, weightpercent, mwt_units, mass_units, mol_units, vol_units,
				density_units, conc_units, formula, inchi, columns) VALUES(:rxn_id, :rev_id, :row_id, :user_id, :cpd_name, :cpd_id, :cas_number, :cpd_type, :supplier, :batch_ref,
				:mwt, :mass, :vol, :mol, :density, :equiv, :conc, :solvent, :limiting, :notes, :weightpercent, :mwt_units, :mass_units, :mol_units, :vol_units,
				:density_units, :conc_units, :formula, :inchi, :columns)";
			} else {
				$sql = "INSERT INTO rxn_stoichiometry(rxn_id, rev_id, row_id, user_id, cpd_name, cpd_id, cas_number, cpd_type, supplier, batch_ref,
				mwt, mass, vol, mol, density, equiv, conc, solvent, limiting, notes, weightpercent, mwt_units, mass_units, mol_units, vol_units,
				density_units, conc_units, formula, inchi) VALUES(:rxn_id, :rev_id, :row_id, :user_id, :cpd_name, :cpd_id, :cas_number, :cpd_type, :supplier, :batch_ref,
				:mwt, :mass, :vol, :mol, :density, :equiv, :conc, :solvent, :limiting, :notes, :weightpercent, :mwt_units, :mass_units, :mol_units, :vol_units,
				:density_units, :conc_units, :formula, :inchi)";
			}
			$req = $bdd->prepare($sql, array(PDO::ATTR_EMULATE_PREPARES => false));
			$values = array(
		        'rxn_id' => $rxn_id,
		        'rev_id' => $rev_id,
		        'row_id' => $i,
		        'user_id' => $_SESSION['userid'],
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
			
			if($i === 0) {
				$values['columns'] = $gridColumns;
			}
				


			$result = $req->execute($values);
			
			}
			if(isset($prodGrid) && !is_null($prodGrid)) {
				$prodGrid = json_decode($prodGrid,true);
						for ($i = 0; $i < count($prodGrid); $i++) {
							if($i === 0) {
								$sql = "INSERT INTO rxn_product_table(rxn_id, rev_id, row_id, exp_id, user_id, cpd_name, cpd_id, batch_ref,
								mwt, mass, mol, equiv, notes, purity, nmr_ref, anal_ref1, anal_ref2, mpt, alphad, yield, colour, state, inchi, mass_units, mol_units, columns) 
								VALUES(:rxn_id, :rev_id, :row_id, :exp_id, :user_id, :cpd_name, :cpd_id, :batch_ref,
								:mwt, :mass, :mol, :equiv, :notes, :purity, :nmr_ref, :anal_ref1, :anal_ref2, :mpt, :alphad, :yield, :colour, :state, :inchi, 
								:mass_units, :mol_units, :columns)";
							} else {
								$sql = "INSERT INTO rxn_product_table(rxn_id, rev_id, row_id, exp_id, user_id, cpd_name, cpd_id, batch_ref,
								mwt, mass, mol, equiv, notes, purity, nmr_ref, anal_ref1, anal_ref2, mpt, alphad, yield, colour, state, inchi, mass_units, mol_units) 
								VALUES(:rxn_id, :rev_id, :row_id, :exp_id, :user_id, :cpd_name, :cpd_id, :batch_ref,
								:mwt, :mass, :mol, :equiv, :notes, :purity, :nmr_ref, :anal_ref1, :anal_ref2, :mpt, :alphad, :yield, :colour, :state, :inchi, 
								:mass_units, :mol_units)";								
							}
							$req = $bdd->prepare($sql, array(PDO::ATTR_EMULATE_PREPARES => false));
							$values = array(
						        'rxn_id' => $rxn_id,
						        'rev_id' => $rev_id,
						        'row_id' => $prodGrid[$i]['id'],
						        'exp_id' => $id,
						        'user_id' => $_SESSION['userid'],
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
							if($i === 0) {
								$values['columns'] = $prodGridColumns;
							}				
				
							$result = $req->execute($values);
						}
			
		}	
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
?>
