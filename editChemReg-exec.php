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
*   eLabChem is a fork of elabFTW. This file incorporates work covered by the   *
*   copyright notice below.                                                     *                                                               
*                                                                               *
********************************************************************************/
/********************************************************************************
*                                                                               *
*   Copyright 2012-2013 Nicolas CARPi (nicolas.carpi@gmail.com)                 *
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
if(is_pos_int($_POST['regid']) || $_POST['regid'] == 0){
    $regid = $_POST['regid'];
} else {
    $regid='';
    $msg_arr[] = 'The id parameter is not valid !';
    $errflag = true;
}
if(is_pos_int($_POST['cpdid'])){
    $cpdid = $_POST['cpdid'];
} else {
    $cpdid='';
}
$name = check_title($_POST['name']);
$iupacname = check_title($_POST['iupac_name']);

if(isset($_POST['validated'])) {
    if($_POST['validated'] === 'true') {
        $validated = 1;
    } else {
        $validated = 0;
    }
} else {
    $validated = 0;
}

if($_POST['regno'] === 'unassigned') {
    $registered = false;
} else {
    $registered = true;
}
$parentregid = null;
if(isset($_POST['saltCheck'])) {
    
    if ($_POST['saltCheck'] === 'true') {
        $isSalt = 1;
        if(isset($_POST['cpdParentRegNum'])) {
            $sql = "SELECT id FROM compound_registry WHERE regno = :regno";
            $req = $bdd->prepare($sql);
            $result = $req->execute(array('regno'    =>  check_title($_POST['cpdParentRegNum'])));
            $ids = $req->fetch();
            if (count($ids) === 2) {
                $parentregid = $ids[0];
            } else {
                $msg_arr[] = 'The parent registration ID for the salt is not valid!';
                $errflag = true;
            }
        } else {
            $msg_arr[] = 'The parent registration ID for the salt is not valid!';
            $errflag = true;        
        }
    } else {
        $isSalt = 0;
    }
} else {
    $isSalt = 0;
}


$mol = check_rxn($_POST['mol']);


$cas_number = (isset($_POST['cas_number']) && $_POST['cas_number'] !== '') ? $_POST['cas_number'] : null;    
$pubchem_id = (isset($_POST['pubchem_id']) && $_POST['pubchem_id'] !== '') ? $_POST['pubchem_id'] : null;    
$chemspider_id = (isset($_POST['chemspider_id']) && $_POST['chemspider_id'] !== '') ? $_POST['chemspider_id'] : null;

$mwt = (isset($_POST['mwt'])) ? ((floatval($_POST['mwt'])) ? floatval($_POST['mwt']) : null) : null;
$exact_mass = (isset($_POST['exact_mass'])) ? ((floatval($_POST['exact_mass'])) ? floatval($_POST['exact_mass']) : null) : null;
$density = (isset($_POST['density'])) ? ((floatval($_POST['density'])) ? floatval($_POST['density']) : null) : null;

$notes = check_body($_POST['notes']);


$formula = (isset($_POST['formula'])) ? $_POST['formula'] : null;  

// If input errors, redirect back to the experiment form
if($errflag) {
    $_SESSION['errors'] = $msg_arr;
    session_write_close();
    header("location: compounds.php?mode=view&regid=$regid");
    exit();
}

// // if nothing is changed, we can just return.
// if(!$rxnChanged && !$gridChanged && !$prodGridChanged && !$bodyChanged && !$titleChanged && !$gridColumnsChanged && !$prodGridColumnsChanged) {
	// unset($_SESSION['new_title']);
    // unset($_SESSION['new_date']);
    // unset($_SESSION['status']);
    // unset($_SESSION['errors']);
    // header("location: experiments.php?mode=view&id=$id");
// }

// SQL for editChemReg

$bdd->beginTransaction();

if($regid == 0) {
    // if this is a new registry entry, we will just create a placeholder row in compound_registry and then we can update it just as we would an existing entry.
    // this does mean we make one redundant mysql request, so it could do with being cleaned up...
    $sql = "INSERT INTO compound_registry (cpd_id, userid_entrant, validated, no_structure, is_salt) VALUES (:cpd_id, :userid_entrant, :validated, :no_structure, :is_salt)";
    $req = $bdd->prepare($sql);
    $result = $req->execute(array(
                        'cpd_id' => 0,
                        'userid_entrant' => $_SESSION['userid'],
                        'validated' => 0,
                        'no_structure' => 0,
                        'is_salt' => 0));
    $regid = $bdd->lastInsertId();
}

if($mol !== '' && $cpdid !== '')  {
    // if we have a structure and a compound ID, we can fire away and add all of our data in one shot
    // for data integrity, we will not change mwt, exact_mass or formula.
    
    $sql = "UPDATE compound_registry SET cpd_id = :cpdid WHERE id = :regid";
    $req = $bdd->prepare($sql);
    $result = $req->execute(array(
                        'cpdid' =>  $cpdid,
                        'regid' =>  $regid));
    
    $sql = "UPDATE compounds AS c JOIN compound_properties AS cp
    ON c.id = cp.compound_id JOIN compound_registry AS creg ON c.id = creg.cpd_id 
    SET c.name = :name, c.iupac_name = :iupac_name, c.cas_number = :cas_number, c.pubchem_id = :pubchem_id,
    c.chemspider_id = :chemspider_id, cp.density = :density, creg.is_salt = :saltCheck, 
    creg.parent_regid = :parentregid, c.notes = :notes, creg.no_structure = 0 
    WHERE creg.id = :regid";
    $req = $bdd->prepare($sql, array(PDO::ATTR_EMULATE_PREPARES => false));
    $result = $req->execute(array(
                        'name'  => $name,
                        'iupac_name' => $iupacname,
                        'cas_number' => $cas_number,
                        'pubchem_id' => $pubchem_id,
                        'chemspider_id' => $chemspider_id,
                        'density' => $density,
                        'saltCheck' => $isSalt,
                        'parentregid' => $parentregid,
                        'notes' => $notes,
                        'regid' => $regid));
                        
                        
} else if($mol !== '') {
    // if we have a structure but no compound ID, let's first register the structure as a compound and calculate properties
    // and then insert data  
    $sql = "INSERT INTO compounds (name, iupac_name, cas_number, pubchem_id, chemspider_id, user_id_entrant, created, notes)
    VALUES (:name, :iupac_name, :cas_number, :pubchem_id, :chemspider_id, :user_id, NOW(), :notes)";
    $req = $bdd->prepare($sql, array(PDO::ATTR_EMULATE_PREPARES => false));
    $result = $req->execute(array(                        
                        'name'  => $name,
                        'iupac_name' => $iupacname,
                        'cas_number' => $cas_number,
                        'pubchem_id' => $pubchem_id,
                        'chemspider_id' => $chemspider_id,
                        'user_id'   => $_SESSION['userid'],
                        'notes' => $notes));
    
    $cpdid = $bdd->lastInsertId();
    
    $sql = "INSERT INTO 3D_structures (compound_id, molfile) VALUES ($cpdid, :mol)";
    $req = $bdd->prepare($sql);
    $result = $req->execute(array('mol' => $mol));
    
    $sql = "INSERT INTO `1D_structures` (`compound_id`,`inchi`,`smiles`) SELECT `compound_id`, 
            MOLECULE_TO_INCHI(`molfile`), MOLECULE_TO_SMILES(`molfile`) FROM `3D_structures` WHERE `3D_structures`.compound_id = $cpdid";
    $req = $bdd->prepare($sql);
    $result = $req->execute();
    
    $sql = "INSERT INTO `bin_structures` (`compound_id`,`fp2`,`obserialized`) SELECT `compound_id`, FINGERPRINT2(`molfile`), 
            MOLECULE_TO_SERIALIZEDOBMOL(`molfile`) FROM `3D_structures` WHERE `3D_structures`.compound_id = $cpdid";
    $req = $bdd->prepare($sql);
    $result = $req->execute();
    
    $sql = "INSERT INTO compound_properties (compound_id, mwt, exact_mass, clogp, formula, num_donor, num_acceptor, num_heavyat, 
            num_rings, num_rot_bond, tot_charge, num_atom, num_bond, mol_psa, is_chiral, density) 
            SELECT compound_id, MOLWEIGHT(molfile), EXACTMASS(molfile), MOLLOGP(ADD_HYDROGENS(molfile)), molformula(molfile), 
            NUMBER_OF_DONORS(ADD_HYDROGENS(molfile)), NUMBER_OF_ACCEPTORS(ADD_HYDROGENS(molfile)), NUMBER_OF_HEAVY_ATOMS(molfile), 
            NUMBER_OF_RINGS(molfile), NUMBER_OF_ROTABLE_BONDS(molfile), TOTAL_CHARGE(molfile), NUMBER_OF_ATOMS(ADD_HYDROGENS(molfile)), 
            NUMBER_OF_BONDS(ADD_HYDROGENS(molfile)), MOLPSA(ADD_HYDROGENS(molfile)), IS_CHIRAL(molfile), :density 
            FROM 3D_structures WHERE `3D_structures`.compound_id = $cpdid";
    $req = $bdd->prepare($sql, array(PDO::ATTR_EMULATE_PREPARES => false));
    $result = $req->execute(array('density' => $density));
    
    $sql = "UPDATE compound_registry SET cpd_id = $cpdid, is_salt = :issalt, parent_regid = :parent_regid, no_structure = 0 WHERE id = :regid";
    $req = $bdd->prepare($sql, array(PDO::ATTR_EMULATE_PREPARES => false));
    $result = $req->execute(array(
                        'issalt' => $issalt,
                        'parent_regid' => $parentregid,
                        'regid'     => $regid));        
    
} else if($cpdid !== '') {
    // if we have no structure but we have a compound ID, we can update all compound properties (incl. mwt, exact_mass, formula)
    $sql = "UPDATE compound_registry SET cpd_id = :cpdid WHERE id = :regid";
    $req = $bdd->prepare($sql);
    $result = $req->execute(array(
                        'cpdid' =>  $cpdid,
                        'regid' =>  $regid));
    
    $sql = "UPDATE compounds AS c JOIN compound_properties AS cp
    ON c.id = cp.compound_id JOIN compound_registry AS creg ON c.id = creg.cpd_id 
    SET c.name = :name, c.iupac_name = :iupac_name, c.cas_number = :cas_number, c.pubchem_id = :pubchem_id,
    c.chemspider_id = :chemspider_id, cp.mwt = :mwt, cp.exact_mass = :exact_mass, cp.formula = :formula,
    cp.density = :density, creg.no_structure = 1, creg.is_salt = :saltCheck, 
    creg.parent_regid = :parentregid, c.notes = :notes
    WHERE creg.id = :regid";
    $req = $bdd->prepare($sql, array(PDO::ATTR_EMULATE_PREPARES => false));
    $result = $req->execute(array(
                        'name'  => $name,
                        'iupac_name' => $iupacname,
                        'cas_number' => $cas_number,
                        'pubchem_id' => $pubchem_id,
                        'chemspider_id' => $chemspider_id,
                        'mwt'          => $mwt,
                        'exact_mass'    => $exact_mass,
                        'formula'       => $formula,
                        'density' => $density,
                        'saltCheck' => $isSalt,
                        'parentregid' => $parentregid,
                        'notes' => $notes,
                        'regid' => $regid));
} else {
    // if we have no structure and no compound ID, we need to first make a compound with the properties stated by the user,
    // then update the entry in the registry to refer to the new cpd_id.    
    $sql = "INSERT INTO compounds (name, iupac_name, cas_number, pubchem_id, chemspider_id, user_id_entrant, created, notes)
    VALUES (:name, :iupac_name, :cas_number, :pubchem_id, :chemspider_id, :user_id_entrant, NOW(), :notes)";
    $req = $bdd->prepare($sql, array(PDO::ATTR_EMULATE_PREPARES => false));
    $result = $req->execute(array(                        
                        'name'  => $name,
                        'iupac_name' => $iupacname,
                        'cas_number' => $cas_number,
                        'pubchem_id' => $pubchem_id,
                        'chemspider_id' => $chemspider_id,
                        'user_id'   => $_SESSION['userid'],
                        'notes' => $notes));
    
    $cpdid = $bdd->lastInsertId();
    
    $sql = "INSERT INTO compound_properties (compound_id, mwt, exact_mass, formula, density) 
            VALUES($cpdid, :mwt, :exact_mass, :formula, :density)";
    $req = $bdd->prepare($sql, array(PDO::ATTR_EMULATE_PREPARES => false));
    $result = $req->execute(array(
                        'mwt'     => $mwt,
                        'exact_mass' => $exact_mass,
                        'formula'   => $formula,
                        'density' => $density));    
    
    $sql = "UPDATE compound_registry SET cpd_id = $cpdid, is_salt = :issalt, parent_regid = :parent_regid, no_structure=1 WHERE id = :regid";
    $req = $bdd->prepare($sql, array(PDO::ATTR_EMULATE_PREPARES => false));
    $result = $req->execute(array(
                        'issalt' => $isSalt,
                        'parent_regid' => $parentregid,
                        'regid'     => $regid)); 
}

if($isSalt) {
    // let's look up the parent regno, see how many salts we already have (count(regno) - 1) then select a 
    // $saltSuffice accordingly
    
    $sql = "SELECT count(regno) FROM compound_registry WHERE regno LIKE :regno";
    $req = $bdd->prepare($sql);
    $result = $req->execute(array('regno' => $_POST['cpdParentRegNum'] . '%'));
    $count = $req->fetch();
    
    $saltSuffix = 'A';
    
    for($i = 0; $i < $count[0]-1; $i++) {
        $saltSuffix = ++$saltSuffix;
    }
}


if(!$registered && $validated) {
    if(!$isSalt) {
        $sql = "SELECT regno FROM compound_registry ORDER BY regno DESC LIMIT 1";
        $req = $bdd->prepare($sql);
        $result = $req->execute();
        $latestRegNo = $req->fetch();
        $prefix = CPD_PREFIX;
        if(count($latestRegNo) >= 1) {
            if(ctype_alpha(substr($latestRegNo[0], strlen($latestRegNo[0])-1))) {
                $number = substr($latestRegNo[0], strlen($prefix), strlen($latestRegNo[0]) - strlen($prefix) - 1);
            } else {
                $number = substr($latestRegNo[0], strlen($prefix), strlen($latestRegNo[0]) - strlen($prefix));
            }
        } else {
            $number = 0;
        }
        
        $newRegNo = $prefix . strval($number+1);
    } else {
        $newRegNo = check_title($_POST['cpdParentRegNum']) . $saltSuffix;
    }
    
    $sql = "UPDATE compound_registry SET cpd_id = :cpdid, validated = :validated, regno = :regno WHERE id = :regid";
    $req = $bdd->prepare($sql);
    $result = $req->execute(array(
                                'cpdid'     => $cpdid,
                                'validated' => $validated,
                                'regno'     => $newRegNo,
                                'regid'     => $regid));
                                    
} else if (!$validated) {                            
    $sql = "UPDATE compound_registry SET cpd_id = :cpdid, validated = :validated WHERE id = :regid";
    $req = $bdd->prepare($sql);
    $result = $req->execute(array(
                                'cpdid'     => $cpdid,
                                'validated' => $validated,
                                'regid'     => $regid));
}

$result = $bdd->commit();

// Check if insertion is successful
if($result) {
    unset($_SESSION['new_title']);
    unset($_SESSION['new_date']);
    unset($_SESSION['status']);
    unset($_SESSION['errors']);
    header("location: compounds.php?mode=edit&regid=$regid");
} else {
    die('Something went wrong in the database query. Check the flux capacitor.');
}

