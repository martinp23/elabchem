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
*   Copyright 2012-2013 Nicolas CARPi (nicolas.carpi@gmail.com) 				*
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
function kdate(){
    // returns today's date as YYMMDD format
    $today = getdate();
    $year = $today['year'];
    $month = $today['mon'];
    if (strlen($month) === 1){
        $month = "0".$month;
    }
    $day = $today['mday'];
    if (strlen($day) === 1){
        $day = "0".$day;
    }
    return $year.'-'.$month.'-'.$day;
}

function format_bytes($a_bytes){
    // nice display of filesize
if ($a_bytes < 1024) {
return $a_bytes .' B';
} elseif ($a_bytes < 1048576) {
return round($a_bytes / 1024, 2) .' KiB';
} elseif ($a_bytes < 1073741824) {
return round($a_bytes / 1048576, 2) . ' MiB';
} elseif ($a_bytes < 1099511627776) {
return round($a_bytes / 1073741824, 2) . ' GiB';
} elseif ($a_bytes < 1125899906842624) {
return round($a_bytes / 1099511627776, 2) .' TiB';
} elseif ($a_bytes < 1152921504606846976) {
return round($a_bytes / 1125899906842624, 2) .' PiB';
} elseif ($a_bytes < 1180591620717411303424) {
return round($a_bytes / 1152921504606846976, 2) .' EiB';
} elseif ($a_bytes < 1208925819614629174706176) {
return round($a_bytes / 1180591620717411303424, 2) .' ZiB';
} else {
return round($a_bytes / 1208925819614629174706176, 2) .' YiB';
}
}

function createPassword($length) {
    $password = "ChangeMe_";
    $chars = "1234567890abcdefghijkmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    $i = 0;
    $random_part = "";
    while ($i < $length) {
        $random_part .= $chars{mt_rand(0,strlen($chars))};
        $i++;
    }
    $fullpassword = $password.$random_part;

    return $fullpassword;
}

function get_ext($filename){
    // Get file extension
    $path_info = pathinfo($filename);
    // if no extension
    if (!empty($path_info['extension'])) {
        return $path_info['extension'];
    }

    return false;
}


function make_thumb($src,$ext,$dest,$desired_width){
    // Create thumbnail from jpg, png or gif
    if($ext === 'jpg' || $ext === 'JPEG' || $ext === 'JPG' || $ext === 'jpeg'){
        $source_image = imagecreatefromjpeg($src);
    }
    elseif($ext === 'png'){
        $source_image = imagecreatefrompng($src);
    }
    elseif($ext === 'gif'){
        $source_image = imagecreatefromgif($src);
    }
    $width = imagesx($source_image);
    $height = imagesy($source_image);

    // find the "desired height" of this thumbnail, relative to the desired width
    $desired_height = floor($height*($desired_width/$width));

    // create a new, "virtual" image
    $virtual_image = imagecreatetruecolor($desired_width,$desired_height);

    // copy source image at a resized size
    imagecopyresized($virtual_image,$source_image,0,0,0,0,$desired_width,$desired_height,$width,$height);

    // create the physical thumbnail image to its destination (85% quality)
    imagejpeg($virtual_image,$dest, 85);
}

// check if $int is a positive integer
function is_pos_int($int) {
    $filter_options = array(
        'options' => array(
            'min_range' => 1
        ));
    return filter_var($int, FILTER_VALIDATE_INT, $filter_options);
}

function has_attachement($id) {
    // Check if an item has a file attached
    global $bdd;
    $sql = "SELECT id FROM uploads 
        WHERE item_id = :item_id";
    $req = $bdd->prepare($sql);
    $req->execute(array(
        'item_id' => $id
    ));
    if ($req->rowCount() > 0) {
        return true;
    }

    return false;
}



// substructure search across all structures in all experiments
function substruc_search($fragmentmol, $table, $explist, $col) {
    global $bdd;
    $results_arr = array();
    $sql = "SELECT MOLECULE_TO_SMILES(:molecule)";
    $req = $bdd->prepare($sql);
    $result = $req->execute(array(
        'molecule'  => $fragmentmol));
    $smiles = $req->fetch();
    
    $sql = "SELECT t.".$col." FROM bin_structures as bin INNER JOIN $table AS t ON 
                bin.compound_id=t.cpd_id WHERE ";
    if($explist) {
        $sql .= "t.".$col." IN (". implode(",", array_fill(0,count($explist),'?')) . ") AND ";
    } else {
        $explist = array();
    }
    $sql .= "MATCH_SUBSTRUCT(?, `obserialized`)";
    $req = $bdd->prepare($sql);
    $query_values = array_merge($explist,array($smiles[0]));
    $result = $req->execute($query_values);
    while ($data = $req->fetch()) {
        $results_arr[] = $data[$col];
    }
    
    return array_unique($results_arr); 
}


function exact_search($molecule, $table, $explist, $col) {
    global $bdd;
    $inchi = getInChI($molecule, $bdd);
    $cid = findInChI($inchi, $bdd);
    $results_arr = array();
    $sql = "SELECT ".$col." FROM $table WHERE cpd_id = :cid";
    $req = $bdd->prepare($sql);
    $result = $req->execute(array('cid' => $cid));
        while ($data = $req->fetch()) {
        $results_arr[] = $data[$col];
    }
    return array_unique($results_arr); 
    
}

function similarity_search($molecule, $table, $explist, $tanimoto, $col) {
    global $bdd;
    $results_arr = array();
    // first we use SET to store fingerprint in mysql memory for performance reasons
    $sql = "SET @fp = (SELECT FINGERPRINT2(:mol))";
    $req = $bdd->prepare($sql);
    $result = $req->execute(array('mol' => $molecule));
    
    // now construct and run actual query
    
    $sql = "SELECT t.".$col." FROM bin_structures as bin INNER JOIN $table AS t ON 
                bin.compound_id=t.cpd_id WHERE ";
    if($explist) {
        $sql .= "t.".$col." IN (". implode(",", array_fill(0,count($explist),'?')) . ") AND ";
    } else {
        $explist = array();
    }
    $sql .= "TANIMOTO(@fp,bin.fp2) >= ? ORDER BY TANIMOTO(@fp, bin.fp2) DESC";
    $req = $bdd->prepare($sql);
    $query_values = $explist;
    $query_values[] = $tanimoto;
    $result = $req->execute($query_values);
    while ($data = $req->fetch()) {
        $results_arr[] = $data[$col];
    }
    
    
    return array_unique($results_arr); 
}

// Search item
function search_item($type, $query, $userid) {
    global $bdd;
    // we make an array for the resulting ids
    $results_arr = array();
    if($type === 'xp') {
    // search in title date and body
    $sql = "SELECT exp.id FROM experiments exp JOIN revisions rev on exp.rev_id = rev.rev_id
    WHERE exp.userid_creator = :userid AND (exp.date LIKE '%:query%' OR rev.rev_body LIKE '%:query%' 
    OR rev.rev_title LIKE '%:query%');"; 
    $req = $bdd->prepare($sql);
    $req->execute(array(
        'userid' => $userid,
        'query' => $query
    ));
    // put resulting ids in the results array
    while ($data = $req->fetch()) {
        $results_arr[] = $data['id'];
    }

    // now we search in tags, and append the found ids to our result array
    $sql = "SELECT item_id FROM experiments_tags WHERE userid = :userid AND tag LIKE '%:query%' LIMIT 100";
    $req = $bdd->prepare($sql);
    $req->execute(array(
        'userid' => $userid,
        'query' => $query
    ));
    while ($data = $req->fetch()) {
        $results_arr[] = $data['item_id'];
    }
    // now we search in file comments and filenames
    $sql = "SELECT item_id FROM uploads WHERE userid = :userid AND (comment LIKE '%:query%' OR real_name LIKE '%:query%') AND type = 'experiment' LIMIT 100";
    $req = $bdd->prepare($sql);
    $req->execute(array(
        'userid' => $userid,
        'query' => $query
    ));
    while ($data = $req->fetch()) {
        $results_arr[] = $data['item_id'];
    }
    $req->closeCursor();

    } elseif ($type === 'db') {
    // search in title date and body
    $sql = "SELECT id FROM items 
        WHERE (title LIKE '%:query%' OR date LIKE '%:query%' OR body LIKE '%:query%') LIMIT 100";
    $req = $bdd->prepare($sql);
    $req->execute( array('query' => $query));
    // put resulting ids in the results array
    while ($data = $req->fetch()) {
        $results_arr[] = $data['id'];
    }
    $req->closeCursor();
    // now we search in tags, and append the found ids to our result array
    $sql = "SELECT item_id FROM items_tags WHERE tag LIKE '%:query%' LIMIT 100";
    $req = $bdd->prepare($sql);
    $req->execute(array(
        'userid' => $_SESSION['userid'],
        'query' => $query
    ));
    while ($data = $req->fetch()) {
        $results_arr[] = $data['item_id'];
    }
    // now we search in file comments and filenames
    $sql = "SELECT item_id FROM uploads WHERE (comment LIKE '%:query%' OR real_name LIKE '%:query%') AND type = 'database' LIMIT 100";
    $req = $bdd->prepare($sql);
    $req->execute( array('query' => $query));
    while ($data = $req->fetch()) {
        $results_arr[] = $data['item_id'];
    }
    $req->closeCursor();
    } else {
        die('bad type : must be db or xp');
    }
    // filter out duplicate ids and reverse the order; XP should be sorted by date
    return $results_arr = array_reverse(array_unique($results_arr));
}
function show_tags($item_id, $table) {
    // $table can be experiments_tags or items_tags
    global $bdd;
    // DISPLAY TAGS
    $sql = "SELECT tag FROM $table WHERE item_id = $item_id";
    $req = $bdd->prepare($sql);
    $req->execute();
    $tagcount = $req->rowCount();
    if ($tagcount > 0) {
        echo "<span class='tags'><img src='themes/".$_SESSION['prefs']['theme']."/img/tags.gif' alt='tags' /> ";
        while($tags = $req->fetch()) {
            if ($table === 'experiments_tags') {
            echo "<a href='experiments.php?mode=show&tag=".urlencode(stripslashes($tags['tag']))."'>".stripslashes($tags['tag'])."</a> ";
            } else { // table is items_tags
            echo "<a href='database.php?mode=show&tag=".urlencode(stripslashes($tags['tag']))."'>".stripslashes($tags['tag'])."</a> ";
            }
        }
        echo "</span>";
    }
}

function showXP($id, $display) {
// Show unique XP
    global $bdd;
    // SQL to get everything from selected id
    $sql = "SELECT id, date, rev_id, status, locked, type FROM experiments WHERE id = :id";
    $req = $bdd->prepare($sql);
    $req->execute(array(
        'id' => $id
    ));
    $exp_query = $req->fetch();
	
	$sql = "SELECT rev_id, rev_body, rev_title, rev_reaction_id FROM revisions WHERE rev_id = :revid";
	$req = $bdd->prepare($sql);
	$req->execute(array(
		'revid' => $exp_query['rev_id']
	));
	$rev_query = $req->fetch();
	
	if ($exp_query['type'] === 'chemsingle' || $exp_query['type'] === 'chemparallel') {
		// get reaction scheme
		$sql = "SELECT rxn_image FROM reactions WHERE rxn_id = :rev_rxn_id";
		$req = $bdd->prepare($sql);
		$req->execute(array('rev_rxn_id' => $rev_query['rev_reaction_id']));
		$rxn_result = $req->fetch(PDO::FETCH_ASSOC);
		$rxn_image = $rxn_result['rxn_image'];
	}
	
        if ($display === 'compact') {
            // COMPACT MODE //
            echo "<section class='item'>";
            echo "<span class='".$exp_query['status']."_compact'>".$exp_query['date']."</span> ";
            echo stripslashes($rev_query['rev_title']);
            // view link
            echo "<a href='experiments.php?mode=view&id=".$exp_query['id']."'>
                <img class='align_right' src='img/view_compact.png' alt='view' title='view experiment' /></a>";
            echo "</section>";
        } else { // NOT COMPACT
?>
        <section class="item <?php echo $exp_query['status'];?>">
    <?php
    // DATE
    echo "<span class='redo_compact'>".$exp_query['date']."</span> ";
    // TAGS
    echo show_tags($id, 'experiments_tags');
    // view link
    echo "<a href='experiments.php?mode=view&id=".$exp_query['id']."'>
        <img class='align_right' style='margin-left:5px;' src='img/view.png' alt='view' title='view experiment' /></a>";
    // show attached if there is a file attached
    if (has_attachement($exp_query['id'])) {
        echo "<img class='align_right' src='themes/".$_SESSION['prefs']['theme']."/img/attached_file.png' alt='file attached' />";
    }
    // show lock if item is locked on viewXP
    if ($exp_query['locked'] == 1) {
        echo "<img class='align_right' src='themes/".$_SESSION['prefs']['theme']."/img/lock.png' alt='lock' />";
    }
    echo "<p class='title'>". stripslashes($rev_query['rev_title']) . "</p>";
	
	if(isset($rxn_image)) {
	?>	<p class = "schemeView">
		<img style="border:1px solid black;" src='<?php echo $rxn_image;?>' />  </p>
	
<?php	} //endif
    echo "</section>";
        }
}
function show_stars($rating) {
// a function to display the star ratings read only
// show_stars(3)
            echo "<div id='rating'>";
            if ($rating == 1) {
                echo "<img src='img/redstar.gif' alt='1' /><img src='img/greystar.gif' alt='1' /><img src='img/greystar.gif' alt='1' /><img src='img/greystar.gif' alt='1' /><img src='img/greystar.gif' alt='1' />";
            }
            if ($rating == 2) {
                echo "<img src='img/redstar.gif' alt='1' /><img src='img/redstar.gif' alt='1' /><img src='img/greystar.gif' alt='1' /><img src='img/greystar.gif' alt='1' /><img src='img/greystar.gif' alt='1' />";
            }
            if ($rating == 3) {
                echo "<img src='img/redstar.gif' alt='1' /><img src='img/redstar.gif' alt='1' /><img src='img/redstar.gif' alt='1' /><img src='img/greystar.gif' alt='1' /><img src='img/greystar.gif' alt='1' />";
            }
            if ($rating == 4) {
                echo "<img src='img/redstar.gif' alt='1' /><img src='img/redstar.gif' alt='1' /><img src='img/redstar.gif' alt='1' /><img src='img/redstar.gif' alt='1' /><img src='img/greystar.gif' alt='1' />";
            }
            if ($rating == 5) {
                echo "<img src='img/redstar.gif' alt='1' /><img src='img/redstar.gif' alt='1' /><img src='img/redstar.gif' alt='1' /><img src='img/redstar.gif' alt='1' /><img src='img/redstar.gif' alt='1' />";
            }
            echo "</div>";
}

/************************************
*************************************/
function get_item_info_from_id($id, $info) {
    global $bdd;
    $sql = "SELECT * FROM items_types WHERE id = :id";
    $req = $bdd->prepare($sql);
    $req->execute(array(
        'id' => $id
    ));
    $data = $req->fetch();
    return $data[$info];
}

function showDB($id, $display) {
// Show unique DB item
    global $bdd;
    // SQL to get everything from selected id
    $sql = "SELECT * FROM items WHERE id = :id";
    $req = $bdd->prepare($sql);
    $req->execute(array(
        'id' => $id
    ));
    $final_query = $req->fetch();
        if ($display === 'compact') {
            // COMPACT MODE //
            ?>
            <section class='item'>
            <h4 style='color:#<?php echo get_item_info_from_id($final_query['type'], 'bgcolor');?>'><?php echo get_item_info_from_id($final_query['type'], 'name');?> </h4>
            <span class='date date_compact'><?php echo $final_query['date'];?></span>
            <span><?php echo stripslashes($final_query['title']);?>
<?php
        // view link
    echo "<a href='database.php?mode=view&id=".$final_query['id']."'>
        <img class='align_right' style='margin-left:5px;' src='img/view_compact.png' alt='view' title='view item' /></a>";
        // STAR RATING read only
        show_stars($final_query['rating']);
        echo "</section>";

        } else { // NOT COMPACT

        echo "<section class='item'>";
        echo "<h4 style='color:#".get_item_info_from_id($final_query['type'], 'bgcolor')."'>".get_item_info_from_id($final_query['type'], 'name')." </h4>";
        // TAGS
        echo show_tags($id, 'items_tags');
        // view link
        echo "<a href='database.php?mode=view&id=".$final_query['id']."'>
        <img class='align_right' style='margin-left:5px;' src='img/view.png' alt='view' title='view item' /></a>";
        // STARS
        show_stars($final_query['rating']);
        // show attached if there is a file attached
        if (has_attachement($final_query['id'])) {
            echo "<img class='align_right' src='themes/".$_SESSION['prefs']['theme']."/img/attached_file.png' alt='file attached' />";
        }
        echo "<p class='title'>". stripslashes($final_query['title']) . "</p>";
        echo "</section>";
        }
}

function check_title($input) {
    // Check TITLE, what else ?
    if ((isset($input)) && (!empty($input))) {
        $title = filter_var($input, FILTER_SANITIZE_STRING);
        // remove linebreak to avoid problem in javascript link list generation on editXP
        return str_replace(array("\r\n", "\n", "\r"), ' ', $title);
    } else {
        return '';
    }
}

function check_rxn($input) {				
	if ((isset($input)) && (!empty($input))) {
   			 $rxn = filter_var($input, FILTER_SANITIZE_STRING);
			 $rxn = str_replace("\r\n", "\n", $rxn); 
		 return $rxn;
    } else {
    return '';
    }
}

function check_date($input) {
    // Check DATE (is != null ? is 6 in length ? is int ? is valable ?)
    if (((isset($input) 
        && (!empty($input))
        && (date_parse_from_format('Y-m-d', $input))))){
                // SUCCESS on every test
        return $input;
    } else {
        return kdate();
    }
}

function check_body($input) {
    // Check BODY (sanitize only);
    if ((isset($input)) && (!empty($input))) {
        // we white list the allowed html tags
        return strip_tags($input, "<br><br /><p><sub><img><sup><strong><b><em><u><a><s><font><span><ul><li><ol><blockquote><h1><h2><h3><h4><h5><h6><hr><table><tr><td>");
    } else {
        return '';
    }
}

function check_status($input) {
    // Check STATUS
    if ((isset($input)) 
        && (!empty($input))){
        if (($input === 'running')
        || ($input === 'success')
        || ($input === 'fail')
        || ($input === 'redo')
		|| ($input === 'deleted')) {
        return $input;
        }
    } else {
        // default is running
        return 'running';
    }
}

function check_search_type($input) {
    if((isset($input)) && (!empty($input))){
        if(($input === 'exact') || ($input === 'substructure') || ($input === 'similarity')){
            return $input;
        }
    } else {
        return 'exact';
    }
}

function check_bool($input) {
	if((isset($input)) && (!empty($input)) && (($input === '1') || ($input === 'true'))){
		return true;
	}
	else {
		return false;
	}
}

function get_html_table($gridDatadb, $gridColumns) {
    // now construct a 2D array for stoichiometry data, extracting the data 
    // from gridDatadb that we will want to display, based on gridColumns
    $rowIndex = 0;
    $filteredGridData = array();
    foreach($gridDatadb as $row) {
        for($j = 0; $j < count($row); $j++) {
            $filteredGridData[$rowIndex] = array();
            for($i = 0; $i < count($gridColumns); $i++) {
                if(isset($row[$gridColumns[$i]['id']])) {
                    $filteredGridData[$rowIndex][$gridColumns[$i]['id']] = $row[$gridColumns[$i]['id']];   
                    if(isset($row[$gridColumns[$i]['id'].'_units'])) {
                        // if we have a "value_units" preference set, let's change our value to  a string correctly
                        // formatted for display.
                        $filteredGridData[$rowIndex][$gridColumns[$i]['id']] = round(fromSI($filteredGridData[$rowIndex][$gridColumns[$i]['id']], $row[$gridColumns[$i]['id'].'_units']),2). ' '.$row[$gridColumns[$i]['id'].'_units'];
                    }
                   // change "limiting" to a checkbox
                   if($gridColumns[$i]['id'] === 'limiting') {
                       if($filteredGridData[$rowIndex]['limiting'] == 1) {
                           $filteredGridData[$rowIndex]['limiting'] = '&#10004;';
                       } else {
                           $filteredGridData[$rowIndex]['limiting'] = '';
                       }
                   }
                }
                
            }
        }
    $rowIndex++;
    }
    
    // now remove columns from $gridColumns for which there is no data in any rows of $filteredGridData
    
    for($i = count($gridColumns); $i >= 0; $i--) {
        $keepColumn = false;
        for($j =0; $j < count($filteredGridData); $j++) {
            if(isset($filteredGridData[$j][$gridColumns[$i]['id']])) {
                $keepColumn = true;
            }
        }
        if(!$keepColumn) {
            unset($gridColumns[$i]);
        }
    }
    // need to rebase array after unsetting elements
    $gridColumns = array_values($gridColumns);
    // now $gridColumns is a list of all of the columns we want in our table
    // and $filteredGridData is all of the corresponding data, organised as table rows
    // it just remains to construct the html for the table.
    
    $table = '<table style="border:1px solid black;border-collapse:collapse;"><tr>';
    for($i = 0; $i < count($gridColumns); $i++) {
        if($i !== count($gridColumns)-1) {
            $table .= '<th style="border-right:1px solid black;border-bottom:1px solid black;padding:3px">'.getColNameFromId($gridColumns[$i]['id']).'</th>';
        } else {
            $table .= '<th style="border-bottom:1px solid black;padding:3px">'.getColNameFromId($gridColumns[$i]['id']).'</th>';            
        }
    }
    $table .= '</tr>';
    
    foreach($filteredGridData as $row) {
        $table .= '<tr>';
        for($i = 0; $i < count($gridColumns); $i++) {
            if($i !== count($gridColumns)-1) {
                $table .= '<td style="border-right:1px solid black;padding:3px">';
            } else {
                $table .= '<td style="padding:3px">';                
            }
            $table .= isset($row[$gridColumns[$i]['id']]) ? $row[$gridColumns[$i]['id']] : '';
            $table .= '</td>';
        }
        $table .= '</tr>';
    }
    
    $table .= '</table>';
    return $table;
}

function getColNameFromId($id) {
    switch ($id) {
        case 'cpd_name':
            return "Name";
        case 'cpd_type':
            return "Type";
        case 'mwt':
            return "Mol. wt.";
        case 'mol':
            return "Moles";
        case 'vol':
            return "Volume";
        case 'conc':
            return "Conc.";       
        case 'equiv':
            return "Type";
        case 'wtpercent':
            return "w/w %";   
        case 'cas_number':
            return "CAS number"; 
        case 'batch_ref':
            return "Batch ref";  
        case 'batchref':
            return "Ref.";
        case 'yield':
            return '% Yield';
        case 'purity':
            return '% purity';
        case 'nmr_ref':
            return 'NMR ref.';
        case 'anal_ref1':
            return "Analytical ref. 1";
        case 'anal_ref2':
            return "Analytical ref. 2"; 
        case 'mpt':
            return "Melt. pt.";         
        case 'alphad':
            return "&alpha;D";                    
        default:
            return ucfirst($id);                 
   }
}

function fromSI($value, $units) {
    switch ($units) {
        // mass (base: g)
        case 'kg':
            return $value / 1000;
        case 'mg':
            return $value * 1000;
        case 'µg':
            return $value * 1000000;
        case 'ng':
            return $value * 1000000000;
        // amount (base: mol)
        case 'mmol':
            return $value * 1000;
        case 'µmol':
            return $value * 1000000;
        case 'nmol':
            return $value * 1000000000;
        // mol weight (base: g/mol)
        case 'kg/mol':
            return $value / 1000;
        case 'mg/mol':
            return $value * 1000;
        // Volume (base: L)
        case 'm3':
            return $value / 1000;
        case 'dL':
            return $value * 10;
        case 'mL':
            return $value * 1000;
        case 'µL':
            return $value * 1000000;
        case 'nL':
            return $value * 1000000000;
        // Concentration (SI: mol/L or M)
        case 'mol/m3':
            return $value * 1000;
        case 'mM':
            return $value * 1000;
        case 'µM':
            return $value * 1000000;
        case 'nM':
            return $value * 1000000000;
        // Density (SI: g/L)
        case 'kg/L':
            return $value / 1000;
        case 'g/mL':
            return $value / 1000;
        default:
            return $value; // in SI unit
    }
    
}
function check_visibility($input) {
    // Check VISIBILITY
    if ((isset($input)) 
        && (!empty($input))){
        if (($input === 'team')
        || ($input === 'user')) {
        return $input;
        }
    } else {
        // default is team
        return 'team';
    }
}

function make_pdf($id, $type, $out = 'browser') {
    // make a pdf
    // $type can be 'experiments' or 'items'
    // $out is the output directory, 'browser' => pdf is downloaded (default), else it's written in the specified dir
    global $bdd;

    // SQL to get title, body and date
    if ($type === 'experiments') {
    	$sql = "SELECT * FROM experiments WHERE id = :id";
		$req = $bdd->prepare($sql);
        $req->execute(array('id' => $id));
        $exp_data = $req->fetch();	
		
		$sql = "SELECT * FROM revisions WHERE rev_id = :revid";
		$req = $bdd->prepare($sql);
        $req->execute(array('revid' => $exp_data['rev_id']));
        $rev_data = $req->fetch();	
			
 	    $title = stripslashes($rev_data['rev_title']);
 	    $date = $exp_data['date'];
 	    // the name of the pdf is needed in make_zip
   	    $clean_title = $date."-".preg_replace('/[^A-Za-z0-9]/', ' ', $title);
        $body = stripslashes($rev_data['rev_body']);
 	    $elabid = $exp_data['elabid'];
        
        if ($exp_data['type'] === 'chemsingle' || $exp_data['type'] === 'chemparallel') {
            // get reaction scheme
            $sql = "SELECT rxn_image FROM reactions WHERE rxn_id = :rev_rxn_id";
            $req = $bdd->prepare($sql);
            $req->execute(array('rev_rxn_id' => $rev_data['rev_reaction_id']));
            $rxn_result = $req->fetch(PDO::FETCH_ASSOC);
            $rxn_image = $rxn_result['rxn_image'];
            
                // get stoichiometry grid data from db
            $gridDatadb = array();
            $gridColumns = array();
            $sql = "SELECT * FROM rxn_stoichiometry WHERE exp_id = :exp_id AND table_rev_id = :tableid";
            $req = $bdd->prepare($sql);
            $req->execute(array(
                'exp_id' => $rev_data['experiment_id'],
                'tableid' => $rev_data['rev_stoictab_id']));
            if ($req->rowcount() != 0) {
                while($gridRow = $req->fetch(PDO::FETCH_ASSOC)) {
                    $gridDatadb[] = $gridRow;
                }   
            }
            $gridColumns = json_decode($rev_data['rev_stoictab_col'],1);
                    
            // get product grid data from db
            $prodGridData = array();
            $prodGridColumns = array();
            $sql = "SELECT * FROM rxn_product_table WHERE exp_id = :exp_id AND table_rev_id = :tableid";
            $req = $bdd->prepare($sql);
            $req->execute(array(
                'exp_id' => $id,
                'tableid' => $rev_data['rev_prodtab_id']));
            if ($req->rowcount() != 0) {
                while($gridRow = $req->fetch(PDO::FETCH_ASSOC)) {
                    // for($i=0;$i < count($gridRow); $i++) {
                        // if(!isset($gridRow[$i])) {
                            // unset($gridRow[$i]);
                        // } 
                    // }
                    $prodGridData[] = $gridRow;
                }
            }   
            $prodGridColumns = json_decode($rev_data['rev_prodtab_col'],1);
            
            $stoicTable = get_html_table($gridDatadb, $gridColumns);
            $prodTable = get_html_table($prodGridData, $prodGridColumns);
        }
    }
		
    else {
    
    $sql = "SELECT * FROM $type WHERE id = :id";
    $req = $bdd->prepare($sql);
    $req->execute(array('id' => $id));
    $data = $req->fetch();
	
	

    $req->closeCursor();
    }
    // SQL to get firstname + lastname
    $sql = "SELECT firstname,lastname FROM users WHERE userid = :userid";
    $req = $bdd->prepare($sql);
    $req->execute(array(
        'userid' => $exp_data['userid_creator']
    ));
    $data = $req->fetch();
    $firstname = $data['firstname'];
    $lastname = $data['lastname'];
    $req->closeCursor();

    // SQL to get tags
    $sql = "SELECT tag FROM ".$type."_tags WHERE item_id = $id";
    $req = $bdd->prepare($sql);
    $req->execute();
    $tags = null;
    while($data = $req->fetch()){
        $tags .= $data['tag'].' ';
    }
    $req->closeCursor();
    
    // build content of page
    $content = "<h1>".$title."</h1><br />
        Date : ".$date."<br />
        <em>Keywords : ".$tags."</em><br />";
        if (isset($rxn_image)) {
            $content .= "<div align=center><img align=center src='". $rxn_image ."'/></div><hr>";
        } else
            $content .= "<hr>";
        if (isset($stoicTable)) {
            $content .= "<h4>Stoichiometry table:</h4>".$stoicTable."<br/>";
        }
        $content .= "<div style='border:1px solid black; padding:5px; padding-bottom:20px;'>".$body."</div>";
        if (isset($prodTable)) {
            $content .= "<h4>Product table:</h4>".$prodTable . "<br /><br />";
        }
        $content .= "<hr>Made by : ".$firstname." ".$lastname."<br /><br />";
    // QR CODE
    if (!empty($_SERVER['HTTPS'])) {
        $protocol = 'https://';
    } else {
        $protocol = 'http://';
    }
    $url = $protocol.$_SERVER['SERVER_NAME'].':'.$_SERVER['SERVER_PORT'].$_SERVER['PHP_SELF'];
    if ($type == 'experiments') {
        if ($out === 'browser') { 
        $url = str_replace('make_pdf.php', 'experiments.php', $url);
        } else { // call from make_zip
        $url = str_replace('make_zip.php', 'experiments.php', $url);
        }
        $full_url = $url."?mode=view&id=".$id;
        $content .= "<qrcode value='".$full_url."' ec='H' style='width: 42mm; background-color: white; color: black;'></qrcode>";
        $content .= "<br /><p>elabid : ".$elabid."</p>";
        $content .= "<p>URL : <a href='".$full_url."'>".$full_url."</a></p>";
    } else {
        if ($out === 'browser') { 
        $url = str_replace('make_pdf.php', 'database.php', $url);
        } else { // call from make_zip
        $url = str_replace('make_zip.php', 'database.php', $url);
        }
        $full_url = $url."?mode=view&id=".$id;
        $content .= "<qrcode value='".$full_url."' ec='H' style='width: 42mm; background-color: white; color: black;'></qrcode>";
        $content .= "<p>URL : <a href='".$full_url."'>".$full_url."</a></p>";
    }


    // convert in PDF with html2pdf
    require_once('lib/html2pdf/html2pdf.class.php');
    try
    {
        $html2pdf = new HTML2PDF('P', 'A4', 'fr');
        $html2pdf->pdf->SetAuthor($firstname.' '.$lastname);
        $html2pdf->pdf->SetTitle($title);
        $html2pdf->pdf->SetSubject('eLabFTW pdf');
        $html2pdf->pdf->SetKeywords($tags);
        // $html2pdf->setDefaultFont('Arial');
        $html2pdf->setDefaultFont('DejavuSans');
        $html2pdf->writeHTML($content);

        if ($type == 'experiments') {
            // used by make_zip
            if ($out != 'browser') {
            $html2pdf->Output($out.'/'.$clean_title.'.pdf', 'F');
            return $clean_title.'.pdf';
            } else {
            $html2pdf->Output($clean_title.'.pdf');
            }
        } else { // database item(s)
            // used by make_zip
            if ($out != 'browser') {
            $html2pdf->Output($out.'/'.$clean_title.'.pdf', 'F');
            return $clean_title.'.pdf';
            } else {
            $html2pdf->Output($clean_title.'.pdf');
            }
        }
    }

    catch(HTML2PDF_exception $e) {
        echo $e;
        exit;
    }
}

function generate_elabid() {
// Generate unique elabID
    $date = kdate();
    return $date."-".sha1(uniqid($date, true));
}

function duplicate_item($id, $type) {
    global $bdd;
    if ($type === 'experiments') {
        $elabid = generate_elabid();

        // SQL to get latest revision from the experiment we duplicate
        $sql = "SELECT rev.rev_id, rev.rev_title, rev.rev_body, exp.visibility FROM revisions as rev JOIN experiments as exp ON rev.experiment_id = exp.id WHERE exp.id = :id";
        $req = $bdd->prepare($sql);
        $req->execute(array('id' => $id));
        $data = $req->fetch();

		//now get content of latest revision and 
		
        // SQL for duplicateXP
        $sql = "INSERT INTO experiments(date, status, elabid, visibility, userid_creator) VALUES(:date, :status, :elabid, :visibility, :userid)";
        $req = $bdd->prepare($sql);
        $result = $req->execute(array(
            'date' => kdate(),
            'status' => 'running',
            'elabid' => $elabid,
            'visibility' => $data['visibility'],
            'userid' => $_SESSION['userid']));

        // END SQL main
        // Get what is the experiment id we just created
		// Get what is the experiment id we just created
   	    $sql = "SELECT LAST_INSERT_ID();";
	    $req = $bdd->prepare($sql);
	    $req->execute();
	    $data1 = $req->fetch();
 	    $newid = $data1['LAST_INSERT_ID()'];
			
			
		// now copy the text for the new page into the revisions table	
		$sql = "INSERT INTO revisions(user_id, experiment_id, rev_notes, rev_body, rev_title) VALUES(:userid, :expid, :notes, :body, :title)";
        $req = $bdd->prepare($sql);
        $result = $req->execute(array(
            'title' => $data['rev_title'],
            'expid' => $newid,
            'notes' => "Duplication of experiment {$id}.",
            'body' => $data['rev_body'],
            'userid' => $_SESSION['userid']));
            
        // now populate rev-id for expt
   		$sql = "UPDATE experiments SET rev_id=LAST_INSERT_ID() WHERE id = " .$newid;
    	$req = $bdd->prepare($sql);
    	$result = $req->execute();  
	}

    if ($type === 'items') {
        // SQL to get data from the item we duplicate
        $sql = "SELECT * FROM items WHERE id = :id";
        $req = $bdd->prepare($sql);
        $req->execute(array('id' => $id));
        $data = $req->fetch();

        // SQL for duplicateDB
        $sql = "INSERT INTO items(title, date, body, userid, type) VALUES(:title, :date, :body, :userid, :type)";
        $req = $bdd->prepare($sql);
        $result = $req->execute(array(
            'title' => $data['title'],
            'date' => kdate(),
            'body' => $data['body'],
            'userid' => $_SESSION['userid'],
            'type' => $data['type']
        ));
        // END SQL main
        
        // Get what is the item id we just created
   	    $sql = "SELECT LAST_INSERT_ID();";
	    $req = $bdd->prepare($sql);
	    $req->execute();
	    $data1 = $req->fetch();
 	    $newid = $data1['LAST_INSERT_ID()'];
	}




    if ($type === 'experiments') {
        // TAGS
        $sql = "SELECT tag FROM experiments_tags WHERE item_id = :id";
        $req = $bdd->prepare($sql);
        $req->execute(array(
            'id' => $id
        ));
        $tag_number = $req->rowCount();
        if($tag_number > 1) {
            while($tags = $req->fetch()){
                // Put them in the new one. here $newid is the new exp created
                $sql = "INSERT INTO experiments_tags(tag, item_id, userid) VALUES(:tag, :item_id, :userid)";
                $reqtag = $bdd->prepare($sql);
                $result_tags = $reqtag->execute(array(
                    'tag' => $tags['tag'],
                    'item_id' => $newid,
                    'userid' => $_SESSION['userid']
                ));
            }
        } else { //no tag
            $result_tags = true;
        }
        // LINKS
        $linksql = "SELECT link_id FROM experiments_links WHERE item_id = :id";
        $linkreq = $bdd->prepare($linksql);
        $result_links = $linkreq->execute(array('id' => $id));
        while($links = $linkreq->fetch()) {
            $sql = "INSERT INTO experiments_links (link_id, item_id) VALUES(:link_id, :item_id)";
            $req = $bdd->prepare($sql);
            $result_links = $req->execute(array(
                'link_id' => $links['link_id'],
                'item_id' => $newid
            ));
        }

        if($result && $result_tags && $result_links) {
            return $newid;
        }

        return false;

    } else { // DB
        // TAGS
        $sql = "SELECT tag FROM items_tags WHERE item_id = :id";
        $req = $bdd->prepare($sql);
        $req->execute(array('id' => $id));
        while($tags = $req->fetch()){
            // Put them in the new one. here $newid is the new exp created
            $sql = "INSERT INTO items_tags(tag, item_id) VALUES(:tag, :item_id)";
            $reqtag = $bdd->prepare($sql);
            $result_tags = $reqtag->execute(array(
                'tag' => $tags['tag'],
                'item_id' => $newid
            ));
        }
        if($result && $result_tags) {
            return $newid;
        }

        return false;
    }
}

// for displaying messages using jquery ui highlight/error messages
// call with echo display_message('info|error', $message);
function display_message($type, $message) {
    if ($type === 'info') {

        return "<div class='ui-state-highlight ui-corner-all'>
        <p><span class='ui-icon ui-icon-info' style='float: left; margin: 0 5px 0 5px;'></span>
        $message</p></div>";

    } elseif ($type === 'error') {

    return "<div class='ui-state-error ui-corner-all'>
        <p><span class='ui-icon ui-icon-alert' style='float:left; margin: 0 5px 0 5px;'></span>
        $message</p></div>";
    }

    return false;
}

function getInChI($molecule,$bdd) {
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

function regIdFromCid($cid,$bdd) {
    $sql = "SELECT id from `compound_registry` WHERE cpd_id = :cid";
    $req = $bdd->prepare($sql);
    $req->execute( array('cid' => $cid));
    $results = array();
    while ($data = $req->fetch()) {
        $results[] = $data['id'];
    };
    if(count($results) == 1) {
        return $results[0];
    } else {
        return false;
    };
};

function regNoFromRegId($regid,$bdd) {
    $sql = "SELECT regno from `compound_registry` WHERE id = :id";
    $req = $bdd->prepare($sql);
    $req->execute( array('id' => $regid));
    $results = array();
    while ($data = $req->fetch()) {
        $results[] = $data['regno'];
    };
    if(count($results) == 1) {
        return $results[0];
    } else {
        return false;
    };
};

function showRegCpd($regId) {
    global $bdd;
    
    // sql to get name, CAS, verification status and structure (if present)
    $sql = "SELECT cpd.name, cpd.cas_number, reg.no_structure, reg.validated FROM compounds AS cpd JOIN compound_registry AS reg 
            ON reg.cpd_id = cpd.id WHERE reg.id = :id";
    $req = $bdd->prepare($sql); 
    $req->execute(array('id' => $regId));
    $cpd_result = $req->fetch(PDO::FETCH_ASSOC);
    
    if($cpd_result['validated'] === '1') {
        $html = "<div class='regCpdContainer validated'>";
    } else {
        $html = "<div class='regCpdContainer pending'>";
    }
    
    if($cpd_result['no_structure'] === '0') {
        $sql = "SELECT 3d.molfile FROM 3D_structures AS 3d JOIN compound_registry AS reg ON reg.cpd_id = 3d.compound_id WHERE reg.id = :id";
        $req = $bdd->prepare($sql);
        $req->execute(array('id' => $regId));
        $mol_results = $req->fetch();
        $mol = $mol_results[0]; 
        $html .= "<div class='regMolecule'><canvas id='viewer_" .$regId. "'></canvas></div>";
        $html .= "<script type='text/javascript'>\nvar viewer_".$regId." = new ChemDoodle.ViewerCanvas('viewer_".$regId."', 150, 150);\n";
        $html .= "viewer_".$regId.".loadMolecule(ChemDoodle.readMOL(".json_encode($mol)."));\n</script>";
    } else {
        $html .= "<div class='regMolecule'><canvas id='viewer_" .$regId. "'></canvas></div>";
        $html .= "<script type='text/javascript'>\nvar viewer_".$regId." = new ChemDoodle.ViewerCanvas('viewer_".$regId."', 150, 150);\n";
        $html .= "viewer_".$regId.".emptyMessage = 'No structure';\nviewer_".$regId.".repaint</script>";
    }
    $html .= "<div class='regDataContainer'>Name: ".$cpd_result['name']."<br />";
    $html .= "CAS: ".$cpd_result['cas_number']."<br />";
    $html .= "<a href='compounds.php?mode=edit&regid=".$regId."'>Edit</a>";
    $html .= "</div></div>";
    echo $html;

  
}

