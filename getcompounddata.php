<?php

	require_once('inc/connect.php');
	
	$reactants = $_REQUEST['reactants'];
	$products = $_REQUEST['products'];
	
	$reactant_results = array();
	$product_results = array();
	
	foreach ($reactants as $molecule) {
		$inchi = getInChI($molecule,$bdd);
		$compoundId = findInChI($inchi, $bdd);
		if ($compoundId) {
			$sql = "SELECT c.id, c.name as cpd_name, c.iupac_name, c.cas_number, cp.mwt, cp.formula, cp.density 
			FROM compounds c INNER JOIN compound_properties cp 
			ON c.id = cp.compound_id 
			WHERE c.id= :cid ;";
	        $req = $bdd->prepare($sql, array(PDO::ATTR_EMULATE_PREPARES => false));
	        $req->execute( array('cid' => $compoundId));
			$result = $req->fetch(PDO::FETCH_ASSOC);
			$result['inchi'] = $inchi;
			$result = array_filter($result);
			$reactant_results[] = $result;			
		} else {
			$moleculeJson = json_encode($molecule);
			$sql = "SELECT MOLWEIGHT(:molecule), MOLFORMULA(:molecule);";
	        $req = $bdd->prepare($sql);
	        $req->execute(array('molecule' => $molecule));
			$data = $req->fetch();
			$result = array();
			$result['mwt'] = $data[0];
			$result['formula'] = $data[1];
			$result['inchi'] = $inchi;
			$result['cpd_name'] = null;
			$result['density'] = null;
			$result['cas_number'] = null;
			$reactant_results[] = $result;		
		};
	};
	
	
	foreach ($products as $molecule) {
		$inchi = getInChI($molecule,$bdd);
		$compoundId = findInChI($inchi, $bdd);
		if ($compoundId) {
			$sql = "SELECT c.id, c.name, c.iupac_name, c.cas_number, cp.mwt, cp.formula, cp.density 
			FROM compounds c INNER JOIN compound_properties cp 
			ON c.id = cp.compound_id 
			WHERE c.id= :cid;";
	        $req = $bdd->prepare($sql, array(PDO::ATTR_EMULATE_PREPARES => false));
	        $req->execute( array('cid' => $compoundId));
			$result = $req->fetch(PDO::FETCH_ASSOC);
			$result['inchi'] = $inchi;
			$product_results[] = $result;			
		} else {
			$moleculeJson = json_encode($molecule);
			$sql = "SELECT MOLWEIGHT(:molecule), MOLFORMULA(:molecule);";
	        $req = $bdd->prepare($sql);
	        $req->execute( array('molecule' => $molecule));
			$data = $req->fetch();
			$result = array();
			$result['mwt'] = $data[0];
			$result['formula'] = $data[1];
			$result['inchi'] = $inchi;
			$product_results[] = $result;		
		};
	};	
	
	
	echo json_encode(array("reactants" => $reactant_results, "products"=>$product_results));
	
	function getInChI($molecule,$bdd) {
		$moleculeJson = json_encode($molecule);
		$sql = "SELECT MOLECULE_TO_INCHI(:molecule)";
        $req = $bdd->prepare($sql);
        $req->execute(array('molecule' => $molecule));
		$result = $req->fetch();
        return $result[0];
		
	};
	
	function findInChI($inchi,$bdd) {
		$sql = "SELECT compound_id from `1D_structures` WHERE inchi = :inchi";
		$req = $bdd->prepare($sql);
		$req->execute( array('inchi' => $inchi));
		$results = array();
		while ($data = $req->fetch()) {
            $results[] = $data['compound_id'];
        };
		if(count($results) == 1) {
			return $results[0];
		} else {
			return false;
		};
	};
	
	function getReactantInfo($compoundId,$molecule) {
		if ($compoundId) {
			$sql = "SELECT c.id, c.name, c.iupac_name, c.cas_number, cp.mwt, cp.formula 
			FROM compounds c INNER JOIN compound_properties cp 
			ON c.id = cp.compound_id 
			WHERE c.id= :cid;";
	        $req = $bdd->prepare($sql);
	        $req->execute( array('cid' => $compoundId));
			$result = $req->fetch();
			$result['inchi'] = $inchi;
			$reactant_results[] = $result;			
		} else {
			$moleculeJson = json_encode($molecule);
			$sql = "SELECT MOLWEIGHT(:molecule), MOLFORMULA(:molecule);";
	        $req = $bdd->prepare($sql);
	        $req->execute( array('molecule' => $molecule));
			$data = $req->fetch();
			$result['mwt'] = $data[0];
			$result['formula'] = $data[1];
			$result['inchi'] = $inchi;
			$reactant_results[] = $result;		
			// We need to generate mwt and formula
		};
		return $reactant_results;
	};
	
?>
