<?php
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

	$structId = str_replace(" ", "+", $_REQUEST['structId']);
	$representation = $_REQUEST['representation'];
	
    if($representation === 'chemspider') {
        $url = "http://www.chemspider.com/inchi.asmx/InChIToCSID?inchi={$structId}";
        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_FAILONERROR, 1);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $result = curl_exec($curl);
        $resultxml = simplexml_load_string($result);
        $result = strval($resultxml);
    } else {
    
    	$url = "http://cactus.nci.nih.gov/chemical/structure/{$structId}/{$representation}";
    	$curl = curl_init($url);
    	curl_setopt($curl, CURLOPT_FAILONERROR, 1);
    	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    	
    	$result = curl_exec($curl);
    }
    if(substr_count($result, "\n") > 0) {
        // if pubchem has given us multiple choices then we return nothing, because we can't guess the right answer...
        $result = false;
    }
	echo $result;
	
	curl_close($curl);
    
    
    
?>
