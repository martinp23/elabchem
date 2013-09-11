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
// Search.php
require_once('inc/common.php');
$page_title='Search';
require_once('inc/head.php');
require_once('inc/menu.php');
require_once('inc/info_box.php');
?>

<!-- Advanced Search page begin -->
<div class='item' style='padding-bottom:16px;'>
    <div style='width:500px; margin:auto;'>
        <form name="search" method="get" onsubmit='return preSubmit();' action="search.php">
            <p class='inline'>Search in: </p>
            <select name='type' onChange='typeChanged(this.value);'>
                <option value='experiments'>Experiments</option>
                <?php // Database items types
                $sql = "SELECT * FROM items_types";
                $req = $bdd->prepare($sql);
                $req->execute();
                while ($items_types = $req->fetch()) {
                    echo "<option value='".$items_types['id']."'";
                    // item get selected if it is in the search url

                    if(isset($_REQUEST['type']) && ($items_types['id'] == $_REQUEST['type'])) {
                        echo " selected='selected'";
                    } 
                    echo ">".$items_types['name']."</option>";
                }
                ?>
            </select>
            <!-- search everyone box --> 
            <label for='all_experiments_chkbx'>(search in everyone's experiment </label>
            <input name="all" id='all_experiments_chkbx' value="y" type="checkbox" <?php
                // keep the box checked if it was checked
                if(isset($_REQUEST['all'])){
                    echo "checked=checked";
                }?>>)
            <br />
            <br />

            Search only in experiments owned by: <select name='owner' class='search_inputs'>
            <option value=''>Select a member</option>
            <?php
            $users_sql = "SELECT userid, firstname, lastname FROM users";
            $users_req = $bdd->prepare($users_sql);
            $users_req->execute();
            while ($users = $users_req->fetch()) {
                echo "<option value='".$users['userid']."'";
                    // item get selected if it is in the search url
                    if(isset($_REQUEST['owner']) && ($users['userid'] == $_REQUEST['owner'])) {
                        echo " selected='selected'";
                    } 
                    echo ">".$users['firstname']." ".$users['lastname']."</option>";
                }
                ?>
            </select>
            <br />
            <br />

            <div id='search_inputs_div'>
            <p class='inline'>Where date is between:</p><input name='from' type='text' size='11' class='search_inputs datepicker' value='<?php
                if(isset($_REQUEST['from']) && !empty($_REQUEST['from'])) {
                    echo check_date($_REQUEST['from']);
                }
?>'/><br />
<br />
            <p class='inline'>and:</p><input name='to' type='text' size='11' class='search_inputs datepicker' value='<?php
                if(isset($_REQUEST['to']) && !empty($_REQUEST['to'])) {
                    echo check_date($_REQUEST['to']);
                }
?>'/><br />
<br />
<p class='inline'>And title contains </p><input name='title' type='text' class='search_inputs' value='<?php
                if(isset($_REQUEST['title']) && !empty($_REQUEST['title'])) {
                    echo check_title($_REQUEST['title']);
                }
?>'/><br />
<br />
<!--
                <p class='inline'>Tags</p><input name='tags' type='text' class='search_inputs'/><br />
<br />
-->
<p class='inline'>And body contains</p><input name='body' type='text' class='search_inputs' value='<?php
                if(isset($_REQUEST['body']) && !empty($_REQUEST['body'])) {
                    echo check_body($_REQUEST['body']);
                }
?>'/><br />
<br />
                <p class='inline'>And status is </p><select name='status' class='search_inputs'>
<option value='' name='status'>select status</option>
<option value='running' name='status'<?php
                    if(isset($_REQUEST['status']) && ($_REQUEST['status'] == 'running')) {
                        echo " selected='selected'";
                    }
?>


>Running</option>

<option value='success' name='status'<?php
                    if(isset($_REQUEST['status']) && ($_REQUEST['status'] == 'success')) {
                        echo " selected='selected'";
                    }
?>
>Success</option>
<option value='redo' name='status'<?php
                    if(isset($_REQUEST['status']) && ($_REQUEST['status'] == 'redo')) {
                        echo " selected='selected'";
                    }
?>
>Redo</option>
<option value='fail' name='status'<?php
                    if(isset($_REQUEST['status']) && ($_REQUEST['status'] == 'fail')) {
                        echo " selected='selected'";
                    }
?>
>Fail</option>
<option value='deleted' name='status'<?php
                    if(isset($_REQUEST['status']) && ($_REQUEST['status'] == 'deleted')) {
                        echo " selected='selected'";
                    }
?>
>Deleted</option>
</select>
<br />
<br /> <p class='inline'>And rating is </p><select name='rating' class='search_inputs'>
<option value='' name='rating'>select number of stars</option>
<option value='no' name='rating'>Unrated</option>
<?php
for($i=1; $i<=5; $i++) {
    echo "<option value='".$i."' name='rating'";
        // item get selected if it is in the search url
    if(isset($_REQUEST['rating']) && ($_REQUEST['rating'] == $i)) {
        echo " selected='selected'";
    }
    echo ">".$i."</option>";
}
?>
</select>
<br />


<br />
            </div>
<?php if(CHEMISTRY){ ?>
<div id='chemdiv' align='center' <?php if((isset($_REQUEST['type'])) && $_REQUEST['type'] !== 'experiments') { echo "style='display:none;'"; } ?>>  
        <input type='hidden' id='rxn' name='rxn' value='<?php if(isset($_REQUEST['rxn'])) {
                        echo $_REQUEST['rxn'];
                    }  ?>'/>
    <input type='hidden' id='mol' name='mol' value='<?php if(isset($_REQUEST['mol'])) {
                        echo $_REQUEST['mol'];
                    }  ?>'/>
    
            <!-- stylesheets extra -->
                <meta http-equiv="X-UA-Compatible" content="chrome=1">
                <link rel="stylesheet" href="js/chemdoodleweb/ChemDoodleWeb.css" type="text/css">
                <link rel="stylesheet" href="js/chemdoodleweb/sketcher/jquery-ui-1.9.2.custom.css" type="text/css">
                <link rel="stylesheet" href="js/slickgrid/slick.grid.css" type="text/css">
                <link rel="stylesheet" href="js/slickgrid/css/stoich-grid.css" type="text/css">
                <link rel="stylesheet" href="js/slickgrid/controls/slick.columnpicker.css" type="text/css">
        <!-- these are required by the ChemDoodle Web Components library -->
                <script type="text/javascript" src="js/chemdoodleweb/ChemDoodleWeb-libs.js"></script>
                <script type="text/javascript" src="js/chemdoodleweb/ChemDoodleWeb.js"></script>
                    
    <!-- these are required by the SketcherCanvas plugin -->
                <script type="text/javascript" src="js/chemdoodleweb/sketcher/jquery-ui-1.9.2.custom.min.js"></script>
                <script type="text/javascript" src="js/chemdoodleweb/sketcher/ChemDoodleWeb-sketcher.js"></script>

<script type ="text/javascript">
            ChemDoodle.ELEMENT['H'].jmolColor = 'black';
            // darkens the default JMol color of sulfur so it appears on white backgrounds
            ChemDoodle.ELEMENT['S'].jmolColor = '#B9A130';
            var reactionCanvas = new ChemDoodle.SketcherCanvas('reactionquery', 500, 200, {useServices:false});
            reactionCanvas.specs.atoms_displayTerminalCarbonLabels_2D = true;
            // sets atom labels to be colored by JMol colors, which are easy to recognize
            reactionCanvas.specs.atoms_useJMOLColors = true;
            // enables overlap clear widths, so that some depth is introduced to overlapping bonds
            reactionCanvas.specs.bonds_clearOverlaps_2D = true;
            // sets the shape color to improve contrast when drawing figures
            reactionCanvas.specs.shapes_color = 'c10000';
            // because we do not load any content, we need to repaint the sketcher, otherwise we would just see an empty area with the toolbar
            // however, you can instead use one of the Canvas.load... functions to pre-populate the canvas with content, then you don't need to call repaint
            if(document.getElementById('rxn').value != "") {
                var reaction_cd = ChemDoodle.readRXN(document.getElementById('rxn').value);
                reactionCanvas.loadContent(reaction_cd.molecules, reaction_cd.shapes);
            } else if (document.getElementById('mol').value != "") {
                reactionCanvas.loadMolecule(ChemDoodle.readMOL(document.getElementById('mol').value));
            }
            
            reactionCanvas.repaint();

</script>
    <br />

    <div id='chem_search_inputs_div'>
    <p class='inline'>Search type </p><select name='structsearchtype' id='structsearchtype' onChange='searchTypeChanged(this.value);' class='search_inputs'>

<option value='exact' name='status'<?php
                    if(isset($_REQUEST['structsearchtype']) && ($_REQUEST['structsearchtype'] == 'exact')) {
                        echo " selected='selected'";
                    }
?>>Exact search</option>
<option value='substructure' name='status'<?php
                    if(isset($_REQUEST['structsearchtype']) && ($_REQUEST['structsearchtype'] == 'substructure')) {
                        echo " selected='selected'";
                    }
?>>Substructure search</option>
<option value='similarity' name='status'<?php
                    if(isset($_REQUEST['structsearchtype']) && ($_REQUEST['structsearchtype'] == 'similarity')) {
                        echo " selected='selected'";
                    }
?>>Similarity search</option>

</select>
    <br /><br />
    <span id='tanspan' <?php if(!isset($_REQUEST['structsearchtype']) || ($_REQUEST['structsearchtype'] !== 'similarity')) {
        echo "style='display:none;'";
    }    
    ?>><p class='inline'>Tanimoto coeff (0-1)</p><input type="text" name='tanimoto' id='tanimoto' class='search_inputs' value='<?php
                    if(isset($_REQUEST['tanimoto'])) {
                        echo $_REQUEST['tanimoto'];
                    } else {
                        echo '0.7';
                    }
?>'></input></span>
    </div>
    </div>


<?php //endif
} ?>
            </div>
        </div>
        <div class='center' style='margin-top:16px;'>
                <button class='button' value='Submit' type='submit'>
                Launch search
                </button>
        </div>
        </form>
        
    </div>
</div>
<script type='text/javascript'>function preSubmit() {
    <?php if(CHEMISTRY) { ?>
        var shapes = reactionCanvas.getShapes();
        try {
            if (shapes.length > 0) {
                document.getElementById('mol').value = '';
                document.getElementById('rxn').value = ChemDoodle.writeRXN(reactionCanvas.getMolecules(), shapes);
            } else {
                document.getElementById('rxn').value = '';
                document.getElementById('mol').value = ChemDoodle.writeMOL(reactionCanvas.getMolecule());         
            }
        } catch(e) {
            document.getElementById('rxn').value = '';
            document.getElementById('mol').value = '';
        }
        
        var tanimoto = document.getElementById('tanimoto').value;
        var parsedTanimoto = parseFloat(tanimoto);
        if(document.getElementById('structsearchtype').value === 'similarity') {
            // if we're doing a similarity search but the tanimoto field hasn't been filled, set it to 0.7.
            if(tanimoto === undefined || tanimoto === null || tanimoto === '') {
                document.getElementById('tanimoto').value = '0.7';
            } else if (parsedTanimoto === false || parsedTanimoto < 0 || parsedTanimoto > 1) {
                alert("Tanimoto value must be between 0 and 1.");
                return false;
            }
            
        }
        debugger;
        // if the length of mol or rxn is > 1500 (quite likely), we use POST instead of GET
        if (document.getElementById('mol').value.length > 1500 || document.getElementById('rxn').value.length > 1500) {
            search.method = 'POST';
        } else {
            search.method = 'GET';
        }

    <?php } ?>
}

function typeChanged(value) {
    <?php if(CHEMISTRY) { ?>
    if(value === 'experiments') {
        document.getElementById('chemdiv').style.display = 'block';
    } else {
        document.getElementById('chemdiv').style.display = 'none';
    }
    <?php } ?>
}

function searchTypeChanged(value) {
    <?php if(CHEMISTRY) { ?>
        if(value === 'similarity') {
            document.getElementById('tanspan').style.display = 'block';
        } else {
            document.getElementById('tanspan').style.display = 'none';
        }
    <?php } ?>
}
</script>

<?php
// assign variables from get
if (isset($_REQUEST['title']) && !empty($_REQUEST['title'])) {
    $title =  filter_var($_REQUEST['title'], FILTER_SANITIZE_STRING);
} else {
    $title = '';
}
if (isset($_REQUEST['from']) && !empty($_REQUEST['from'])) {
    $from = check_date($_REQUEST['from']);
} else {
    $from = '';
}
if (isset($_REQUEST['to']) && !empty($_REQUEST['to'])) {
    $to = check_date($_REQUEST['to']);
} else {
    $to = '';
}
if (isset($_REQUEST['tags']) && !empty($_REQUEST['tags'])) {
    $tags = filter_var($_REQUEST['tags'], FILTER_SANITIZE_STRING);
} else {
    $tags = '';
}
if (isset($_REQUEST['body']) && !empty($_REQUEST['body'])) {
    $body = check_body($_REQUEST['body']);
} else {
    $body = '';
}
if (isset($_REQUEST['status']) && !empty($_REQUEST['status'])) {
    $status = check_status($_REQUEST['status']);
} else {
    $status = '';
}
if (isset($_REQUEST['rating']) && !empty($_REQUEST['rating'])) {;
    if($_REQUEST['rating'] === 'no') {
        $rating = '0';
    } else {
    $rating = intval($_REQUEST['rating']);
    }
} else {
    $rating = '';
}
if (isset($_REQUEST['owner']) && !empty($_REQUEST['owner']) && is_pos_int($_REQUEST['owner'])) {
    $owner_search = true;
    $owner = $_REQUEST['owner'];
} else {
    $owner_search = false;
}
if (isset($_REQUEST['rxn']) && !empty($_REQUEST['rxn'])) {
    $rxn = check_rxn($_REQUEST['rxn']);
} else {
    $rxn = '';
}
if (isset($_REQUEST['structsearchtype']) && !empty($_REQUEST['structsearchtype'])) {
    $structSearchType = check_search_type($_REQUEST['structsearchtype']);
} else {
    $structSearchType = 'exact';
}
if (isset($_REQUEST['tanimoto'])) {
    $tanimoto = floatval($_REQUEST['tanimoto']);
} else {
    $tanimoto = 0.7;
}

$userid = intval($_SESSION['userid']);


// Is there a search ?
if (isset($_REQUEST)) {
    // EXPERIMENT ADVANCED SEARCH
    if(isset($_REQUEST['type'])) {
        if($_REQUEST['type'] === 'experiments') {
            // SQL
            // the BETWEEN stuff makes the date mandatory, so we switch the $sql with/without date
            if(!isset($_REQUEST['to']) || empty($_REQUEST['to'])) {
            	// if "to" date not set, put it far into the future
            	$to = 991212;
			} 
            
            
            
            if(isset($_REQUEST['from']) && !empty($_REQUEST['from'])) {
                if(isset($_REQUEST['all']) && !empty($_REQUEST['all'])) {
					$sql = "SELECT exp.id FROM experiments exp JOIN revisions rev on exp.rev_id = rev.rev_id
					WHERE exp.status LIKE '%$status%' AND exp.date BETWEEN '$from' AND '$to' AND rev.rev_title LIKE '%$title%'
					AND rev.rev_body LIKE '%$body%'";
				}
				else { //search only in your experiments
					$sql = "SELECT exp.id FROM experiments exp JOIN revisions rev on exp.rev_id = rev.rev_id
					WHERE exp.status LIKE '%$status%' AND exp.date BETWEEN '$from' AND '$to' AND rev.rev_title LIKE '%$title%'
					AND rev.rev_body LIKE '%$body%' AND exp.userid_creator = :userid";
				}			
            } else { // no date input
                if(isset($_REQUEST['all']) && !empty($_REQUEST['all'])) {
					$sql = "SELECT exp.id FROM experiments exp JOIN revisions rev on exp.rev_id = rev.rev_id
					WHERE exp.status LIKE '%$status%' AND rev.rev_title LIKE '%$title%'
					AND rev.rev_body LIKE '%$body%'";					
                } else {
                    $sql = "SELECT exp.id FROM experiments exp JOIN revisions rev on exp.rev_id = rev.rev_id
					WHERE exp.status LIKE '%$status%' AND rev.rev_title LIKE '%$title%'
					AND rev.rev_body LIKE '%$body%' AND exp.userid_creator = :userid";	
                }
            }
            
            if($status !== 'deleted') {
                $sql .= " AND exp.status NOT LIKE 'deleted'";
            }
            
            $args = array('userid' => $_SESSION['userid']);
            if($owner_search) {
                $args['userid'] = $owner;
            }
		
            $req = $bdd->prepare($sql);
            $req->execute($args);
            
            $results_id = array();
            // make array of results id
            
            while ($get_id = $req->fetch()) {
                    $results_id[] = $get_id['id'];
            }
            // This counts the number of results - and if there wasn't any it gives them a little message explaining that 
            $count = count($results_id);
            if ($count > 0) {
                // now let's run chem-structure queries on our first-pass search results
                $strucSearch = false;
                $num_react = 0;
                $num_prod = 0;
                if(isset($_REQUEST['rxn']) && !empty($_REQUEST['rxn'])) {
                    $strucSearch = true;
                    $rxn_content = explode("\$MOL\n", $rxn);
                    $header_lines = explode("\n", $rxn_content[0]);
                    $num_react = intval(substr($header_lines[4], 0,3));
                    $num_prod = intval(substr($header_lines[4], 3,6));
                    $molecules = array();
                    for ($i = 0; $i < $num_react + $num_prod; $i ++) {
                        $molecules[] = $rxn_content[$i+1];
                    }
                    
                } elseif(isset($_REQUEST['mol']) && !empty($_REQUEST['mol'])) {
                    $strucSearch = true;
                    $molecules = array($_REQUEST['mol']);
                }
                
                if($strucSearch) {
                    
                    if ($structSearchType === 'substructure') {      
                        // first let us deconstruct our rxn string into products and reagents.  
                        $results_temp = array();
                        if($num_react + $num_prod > 0) {
                            for($i = 0; $i < $num_react; $i++) {
                                $results_temp[] = substruc_search($molecules[$i], 'rel_exp_structure_react', $results_id, 'exp_id');
                            }
                            for($i = $num_react; $i < $num_react + $num_prod; $i++) {
                                $results_temp[] = substruc_search($molecules[$i], 'rel_exp_structure_prod', $results_id, 'exp_id');
                            }
                        } elseif (count($molecules) > 0) {
                            for($i = 0; $i < count($molecules); $i++) {
                                $x = substruc_search($molecules[$i], 'rel_exp_structure_react', $results_id, 'exp_id');
                                $y = substruc_search($molecules[$i], 'rel_exp_structure_prod', $results_id, 'exp_id');
                                $results_temp[] = array_merge($x,$y);
                            }                        
                        }

                     } elseif($structSearchType === 'exact') {
                         // exact search   
                         // we will do this by inchi  
                         $results_temp = array();  
                         if($num_react + $num_prod > 0) {
                                for($i = 0; $i < $num_react; $i++) {
                                    $results_temp[] = exact_search($molecules[$i], 'rel_exp_structure_react', $results_id, 'exp_id');
                                }
                                for($i = $num_react; $i < $num_react + $num_prod; $i++) {
                                    $results_temp[] = exact_search($molecules[$i], 'rel_exp_structure_prod', $results_id, 'exp_id');
                                }
                          } elseif (count($molecules) > 0) {
                                for($i = 0; $i < count($molecules); $i++) {
                                    $x = exact_search($molecules[$i], 'rel_exp_structure_react', $results_id, 'exp_id');
                                    $y = exact_search($molecules[$i], 'rel_exp_structure_prod', $results_id, 'exp_id');
                                    $results_temp[] = array_merge($x,$y);
                                }
                          }
                    } elseif($structSearchType === 'similarity') {
                         // similarity search   
                         $results_temp = array();  
                         if($num_react + $num_prod > 0) {
                                for($i = 0; $i < $num_react; $i++) {
                                    $results_temp[] = similarity_search($molecules[$i], 'rel_exp_structure_react', $results_id, $tanimoto, 'exp_id');
                                }
                                for($i = $num_react; $i < $num_react + $num_prod; $i++) {
                                    $results_temp[] = similarity_search($molecules[$i], 'rel_exp_structure_prod', $results_id, $tanimoto, 'exp_id');
                                }
                          } elseif (count($molecules) > 0) {
                                for($i = 0; $i < count($molecules); $i++) {
                                    $x = similarity_search($molecules[$i], 'rel_exp_structure_react', $results_id, $tanimoto, 'exp_id');
                                    $y = similarity_search($molecules[$i], 'rel_exp_structure_prod', $results_id, $tanimoto, 'exp_id');
                                    $results_temp[] = array_merge($x,$y);
                                }
                          }
                    }
                    
                    // where we have more than one results set, we treat the query as AND. So we find the intersection of the different 
                    // results arrays and return that as result.
                    if(count($results_temp) > 1) {
                        $results_id = call_user_func_array('array_intersect', $results_temp);
                    } else {
                        $results_id = $results_temp[0];
                    }
                    $results_id = array_unique($results_id);
                    $count = count($results_id); 
                }
     
            }
            if ($count > 0) {
                
                // sort by id, biggest (newer item) comes first
                $results_id = array_reverse($results_id);

                // construct string for links to export results
                $results_id_str = "";
                foreach($results_id as $id) {
                    $results_id_str .= $id."+";
                }
                // remove last +
                $results_id_str = substr($results_id_str, 0, -1);
    ?>

                <div id='export_menu'>
                <p class='inline'>Export this result : </p>
                <a href='make_zip.php?id=<?php echo $results_id_str;?>&type=exp'>
                <img src='themes/<?php echo $_SESSION['prefs']['theme'];?>/img/zip.gif' title='make a zip archive' alt='zip' /></a>

                    <a href='make_csv.php?id=<?php echo $results_id_str;?>&type=exp'><img src='img/spreadsheet.png' title='Export in spreadsheet file' alt='Export in spreadsheet file' /></a>
                </div>
    <?php
                if ($count == 1) {
                echo "<div id='search_count'>".$count." result</div>";
                } else {
                echo "<div id='search_count'>".$count." results</div>";
                }
                echo "<div class='search_results_div'>";
                // Display results
                echo "<hr>";
                foreach ($results_id as $id) {
                    showXP($id, $_SESSION['prefs']['display']);
                }
            } else { // no results
                $message = "Sorry, I couldn't find anything :(";
                echo display_message('error', $message);
            }

    // DATABASE ADVANCED SEARCH
    } elseif (is_pos_int($_REQUEST['type'])) {
            // SQL
            // the BETWEEN stuff makes the date mandatory, so we switch the $sql with/without date
            if(isset($_REQUEST['to']) && !empty($_REQUEST['to'])) {
            	$sql = "SELECT * FROM items WHERE type = :type AND title LIKE '%$title%' AND body LIKE '%$body%' AND rating LIKE '%$rating%' AND date BETWEEN '$from' AND '$to'";
            } elseif(isset($_REQUEST['from']) && !empty($_REQUEST['from'])) {
            	$sql = "SELECT * FROM items WHERE type = :type AND title LIKE '%$title%' AND body LIKE '%$body%' AND rating LIKE '%$rating%' AND date BETWEEN '$from' AND '991212'";
            } else { // no date input
            	$sql = "SELECT * FROM items WHERE type = :type AND title LIKE '%$title%' AND body LIKE '%$body%' AND rating LIKE '%$rating%'";
            }

        $req = $bdd->prepare($sql);
        $req->execute(array(
            'type' => $_REQUEST['type']
        ));
        $count = $req->rowCount();
        if ($count > 0) {
            // make array of results id
            $results_id = array();
            while ($get_id = $req->fetch()) {
                $results_id[] = $get_id['id'];
            }
            // sort by id, biggest (newer item) comes first
            $results_id = array_reverse($results_id);
            
            // construct string for links to export results
            $results_id_str = "";
            foreach($results_id as $id) {
                $results_id_str .= $id."+";
            }
            // remove last +
            $results_id_str = substr($results_id_str, 0, -1);
?>

            <div id='export_menu'>
            <p class='inline'>Export this result : </p>
            <a href='make_zip.php?id=<?php echo $results_id_str;?>&type=items'>
            <img src='themes/<?php echo $_SESSION['prefs']['theme'];?>/img/zip.gif' title='make a zip archive' alt='zip' /></a>

            <a href='make_csv.php?id=<?php echo $results_id_str;?>&type=items'><img src='img/spreadsheet.png' title='Export in spreadsheet file' alt='Export in spreadsheet file' /></a>
            </div>
<?php
            if ($count == 1) {
            echo "<div id='search_count'>".$count." result</div>";
            } else {
            echo "<div id='search_count'>".$count." results</div>";
            }
            echo "<div class='search_results_div'>";
            // Display results
            echo "<hr>";
            foreach ($results_id as $id) {
                showDB($id, $_SESSION['prefs']['display']);
            }
        } else { // no results
            $message = "Sorry, I couldn't find anything :(";
            echo display_message('error', $message);
        }
    }
    }

    }

?>

<script>
$(document).ready(function(){
    // DATEPICKER
    $( ".datepicker" ).datepicker({dateFormat: 'yy-mm-dd'});
});


</script>

<?php require_once('inc/footer.php');?>

