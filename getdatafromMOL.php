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
	require_once('inc/connect.php');
    require_once('inc/functions.php');
	
	$mol = $_REQUEST['mol'];
	
    $inchi = getInChI($mol, $bdd);
    $compoundId = findInChI($inchi, $bdd);

	if ($compoundId) {
		$sql = "SELECT c.id, c.name as cpd_name, c.iupac_name, c.cas_number, c.pubchem_id, c.chemspider_id, c.notes, cp.mwt, cp.exact_mass, cp.formula, cp.density,
		cpreg.id AS regid, cpreg.regno, cpreg.validated, cpreg.is_salt, cpreg.parent_regid 
		FROM compounds c INNER JOIN compound_properties cp 
		ON c.id = cp.compound_id 
		LEFT JOIN compound_registry AS cpreg 
		ON c.id = cpreg.cpd_id 
		WHERE c.id= :cid ";
        $req = $bdd->prepare($sql, array(PDO::ATTR_EMULATE_PREPARES => false));
        $req->execute( array('cid' => $compoundId));
		$result = $req->fetch(PDO::FETCH_ASSOC);
		$result['inchi'] = $inchi;
		$result = array_filter($result);
        
        if(isset($result['is_salt']) && isset($result['parent_regid']))	{
            // get reg no corresponding to regid
            $sql = "SELECT regno FROM compound_registry WHERE id = :regid";
            $req = $bdd->prepare();
            $req->execute( array('regid' => $result['parent_regid']));
            $regsearch = $req->fetch();
            if ($regsearch) {
                $result['parent_regno'] = $regsearch[0];
            } else {
                $result['parent_regno'] = 'unassigned';
            }
        }	
	} else {

		$sql = "SELECT MOLWEIGHT(:molecule), MOLFORMULA(:molecule), EXACTMASS(:molecule);";
        $req = $bdd->prepare($sql);
        $req->execute(array('molecule' => $mol));
		$data = $req->fetch();
		$result = array();
		$result['mwt'] = $data[0];
		$result['formula'] = $data[1];
        $result['exact_mass'] = $data[2];
		$result['inchi'] = $inchi;
	};

	echo json_encode($result);
	
	

?>
