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
			$sql = "INSERT INTO rxn_stoichiometry(rxn_id, rev_id, row_id, user_id, cpd_name, cpd_id, cas_number, cpd_type, supplier, batch_ref,
			mwt, mass, vol, mol, density, equiv, conc, solvent, limiting, notes, weightpercent, mwt_units, mass_units, mol_units, vol_units,
			density_units, conc_units, formula, inchi) VALUES(:rxn_id, :rev_id, :row_id, :user_id, :cpd_name, :cpd_id, :cas_number, :cpd_type, :supplier, :batch_ref,
			:mwt, :mass, :vol, :mol, :density, :equiv, :conc, :solvent, :limiting, :notes, :weightpercent, :mwt_units, :mass_units, :mol_units, :vol_units,
			:density_units, :conc_units, :formula, :inchi)";
			$req = $bdd->prepare($sql, array(PDO::ATTR_EMULATE_PREPARES => false));
			$values = array(
		        'rxn_id' => $rxn_id,
		        'rev_id' => $rev_id,
		        'row_id' => $i,
		        'user_id' => $_SESSION['userid'],
		        'cpd_name' => $grid[$i]['cpd_name'],
				'cpd_id' => $grid[$i]['cpd_id'],
				'cas_number' => $grid[$i]['cas_number'],
				'cpd_type' => $grid[$i]['cpd_type'],
				'supplier' => $grid[$i]['supplier'],
				'batch_ref' => $grid[$i]['batch_ref'],
				'mwt' => $grid[$i]['mwt'],
				'mass' => $grid[$i]['mass'],
				'vol' => $grid[$i]['vol'],
				'mol' => $grid[$i]['mol'],
				'density' => $grid[$i]['density'],
				'equiv' => $grid[$i]['equiv'],
				'conc' => $grid[$i]['conc'],
				'solvent' => $grid[$i]['solvent'],
				'limiting' => $grid[$i]['limiting'],
				'notes' => $grid[$i]['notes'],
				'weightpercent' => $grid[$i]['weightpercent'],
				'mwt_units' => $grid[$i]['mwt_units'],
				'mass_units' => $grid[$i]['mass_units'],
				'mol_units' => $grid[$i]['mol_units'],
				'vol_units' => $grid[$i]['vol_units'],
				'density_units' => $grid[$i]['density_units'],
				'conc_units' => $grid[$i]['conc_units'],
				'formula' => $grid[$i]['formula'],
				'inchi' => $grid[$i]['inchi']);
			$keys = array_keys($values);
			for ($j=0; $j < count($values); $j++) {
				if(!isset($values[$keys[$j]])) {
					$values[$keys[$j]] = null;
				}
			}

			$result = $req->execute($values);
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
