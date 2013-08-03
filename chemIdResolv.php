<?php

	$structId = str_replace(" ", "+", $_REQUEST['structId']);
	$representation = $_REQUEST['representation'];
	
	$url = "http://cactus.nci.nih.gov/chemical/structure/{$structId}/{$representation}";
	$curl = curl_init($url);
	curl_setopt($curl, CURLOPT_FAILONERROR, 1);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	
	$result = curl_exec($curl);
	echo $result;
	
	curl_close($curl);
?>
