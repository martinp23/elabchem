<?php
/********************************************************************************
*                                                                               *
*   Copyright 2012-2013 Nicolas CARPi (nicolas.carpi@gmail.com)                 *
*                  Martin Peeks (martinp23@googlemail.com)                      *
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
if(isset($_SESSION['prefs']['theme'])) {
require_once("themes/".$_SESSION['prefs']['theme']."/highlight.css");
}
if(isset($_SESSION['prefs']['display'])) {
    $display = $_SESSION['prefs']['display'];
} else {
    $display = 'default';
}
?>

<!-- Advanced Search page begin -->
<a href='compounds.php?mode=create'>Add a new compound</a>
<div class='item'>
    <div class='align_left'>
        
        <!-- even though this is a search form, we are submitting with POST because query strings might be long 
            when involving chemistry queries -->
        <form name="search" method="post" onsubmit='return preSubmit();' action="compounds.php">
            <!-- SUBMIT BUTTON -->
            <button class='submit_search_button' type='submit'>
                <img src='themes/<?php echo $_SESSION['prefs']['theme'];?>/img/submit.png' name='Submit' value='Submit' />
                <p>FIND</p>
            </button>
            
          
            <br />
            <div id='search_inputs_div'>
            <p class='inline'>Search for: </p>
            <label class='search_inputs'><input name="validated" value="y" type="checkbox" class='search_inputs' <?php
                // keep the box checked if it was checked
                if(isset($_REQUEST['validated'])){
                    echo "checked=checked";
                }?>>Validated compounds&nbsp;&nbsp;</label><br /><br />
            <label class='search_inputs'><input name="pending" value="y" type="checkbox" class='search_inputs' <?php
            // keep the box checked if it was checked
            if(isset($_REQUEST['pending'])){
                echo "checked=checked";
            }?>>Pending compounds&nbsp;&nbsp;</label>
<br /><br /><br /> 
<!-- <p class='inline'>For compounds which I:</p>

<label class='search_inputs'><input name="userreg" value="y" type="checkbox" class='search_inputs' <?php
                // keep the box checked if it was checked
                if(!isset($_REQUEST['userreg'])){
                    echo "checked=checked";
                }?>>Registered&nbsp;&nbsp;</label><br /><br />
            <label class='search_inputs'><input name="userval" value="y" type="checkbox" class='search_inputs' <?php
            // keep the box checked if it was checked
            if(isset($_REQUEST['userval'])){
                echo "checked=checked";
            }?>>Validated&nbsp;&nbsp;</label> 
<br /><br />-->
<p class='inline'>Where name contains: </p><input name='name' type='text' class='search_inputs' value='<?php
                if(isset($_REQUEST['name']) && !empty($_REQUEST['name'])) {
                    echo check_title($_REQUEST['name']);
                }
?>'/><br />
<br />
<p class='inline'>And mwt is between: </p><input name='from' type='text' size='6' class='search_inputs' value='<?php
                if(isset($_REQUEST['from']) && !empty($_REQUEST['from'])) {
                    echo $_REQUEST['from'];
                }
?>'/><br />
<br />
            <p class='inline'>and: </p><input name='to' type='text' size='6' class='search_inputs' value='<?php
                if(isset($_REQUEST['to']) && !empty($_REQUEST['to'])) {
                    echo $_REQUEST['to'];
                }
?>'/><br />

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

<div align='center'>  

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
            var searchCanvas = new ChemDoodle.SketcherCanvas('compoundquery', 300, 200, {useServices:false, allowShapes:false});
            searchCanvas.specs.atoms_displayTerminalCarbonLabels_2D = true;
            // sets atom labels to be colored by JMol colors, which are easy to recognize
            searchCanvas.specs.atoms_useJMOLColors = true;
            // enables overlap clear widths, so that some depth is introduced to overlapping bonds
            searchCanvas.specs.bonds_clearOverlaps_2D = true;
            // sets the shape color to improve contrast when drawing figures
            searchCanvas.specs.shapes_color = 'c10000';
            // because we do not load any content, we need to repaint the sketcher, otherwise we would just see an empty area with the toolbar
            // however, you can instead use one of the Canvas.load... functions to pre-populate the canvas with content, then you don't need to call repaint
            if (document.getElementById('mol').value != "") {
                searchCanvas.loadMolecule(ChemDoodle.readMOL(document.getElementById('mol').value));
            }
            
            searchCanvas.repaint();

</script>
    <br />

    <div id='chem_search_inputs_div'>
    <p class='inline'>Search type </p><select name='structsearchtype' id='structsearchtype' class='search_inputs'>

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
    <p class='inline'>Tanimoto coeff (0-1) </p><input type="text" name='tanimoto' id='tanimoto' class='search_inputs' value='<?php
                    if(isset($_REQUEST['tanimoto'])) {
                        echo $_REQUEST['tanimoto'];
                    } else {
                        echo '0.7';
                    }
?>'></input>
    </div>
    </div>



            </div>
            </div>

        </form>
        
    </div>
</div>
<script type='text/javascript'>function preSubmit() {
           try {
            document.getElementById('mol').value = ChemDoodle.writeMOL(searchCanvas.getMolecule());         
        } catch(e) {
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

  
}</script>

<?php
// assign variables from get
if (isset($_REQUEST['from']) && !empty($_REQUEST['from'])) {
    $from = floatval($_REQUEST['from']);
} else {
    $from;
}
if (isset($_REQUEST['to']) && !empty($_REQUEST['to'])) {
    $to = floatval($_REQUEST['to']);
} else {
    $to;
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
if (isset($_REQUEST['mol']) && !empty($_REQUEST['mol'])) {
    $mol = check_rxn($_REQUEST['mol']);
} else {
    $mol = '';
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
if (isset($_REQUEST['validated'])) {
    $getValidated = true;
} else {
    $getValidated = false;
}
if (isset($_REQUEST['pending'])) {
    $getPending = true;
} else {
    $getPending = false;
}
if (isset($_REQUEST['name'])) {
    $name = check_title($_REQUEST['name']);
} else {
    $name = '';
}

$userid = intval($_SESSION['userid']);


// Is there a search ?
if (isset($_REQUEST)) {
    // first do text-based search where necessary
    if(isset($from) || isset($to)) {
        if(!isset($from)) {
            $sql = "SELECT compreg.id FROM compound_registry compreg JOIN compounds comp ON compreg.cpd_id = comp.id
            JOIN compound_properties compprop ON compreg.cpd_id = compprop.compound_id
            WHERE compprop.mwt <= :to AND comp.name LIKE :name";
            $sqlArgs = array('to'   => $to,
                             'name' => '%'.$name.'%');
        } else if(!isset($to)) {
            $sql = "SELECT compreg.id FROM compound_registry compreg JOIN compounds comp ON compreg.cpd_id = comp.id
            JOIN compound_properties compprop ON compreg.cpd_id = compprop.compound_id
            WHERE compprop.mwt >= :from AND comp.name LIKE :name";
            $sqlArgs = array('from' => $from,
                             'name' => '%'.$name.'%');
        } else {
            $sql = "SELECT compreg.id FROM compound_registry compreg JOIN compounds comp ON compreg.cpd_id = comp.id
            JOIN compound_properties compprop ON compreg.cpd_id = compprop.compound_id
            WHERE compprop.mwt BETWEEN :from AND :to AND comp.name LIKE :name";
            $sqlArgs = array('from' => $from,
                             'to'   => $to,
                             'name' => '%'.$name.'%');
        }
    } else {
        $sql = "SELECT compreg.id FROM compound_registry compreg JOIN compounds comp ON compreg.cpd_id = comp.id
        JOIN compound_properties compprop ON compreg.cpd_id = compprop.compound_id
        WHERE comp.name LIKE :name";
        $sqlArgs = array('name' => '%'.$name.'%');
    }  
    
    if(($getValidated && $getPending) || (!$getValidated && !$getPending)) {
        // get everything, don't need to change query
    } else if ($getValidated) {
        $sql .= " AND compreg.validated = 1";
    } else if ($getPending) {
        $sql .= " AND compreg.validated = 0";
    }
          

    $req = $bdd->prepare($sql);
    $req->execute($sqlArgs);
    
    $results_id = array();
    // make array of results id
    
    while ($get_id = $req->fetch()) {
            $results_id[] = $get_id['id'];
    }
    // This counts the number of results - and if there wasn't any it gives them a little message explaining that 
    $count = count($results_id);
    if ($count > 0) {

    
        // then, if necessary, do molecule-based search
        if(!empty($mol)) {
            if ($structSearchType === 'substructure') {      
                $results_temp = array();
                $results_temp[] = substruc_search($mol, 'compound_registry', $results_id, 'id');                                 
             } else if($structSearchType === 'exact') {
                 // exact search   
                 // we will do this by inchi  
                 $results_temp = array();  
                 $results_temp[] = exact_search($mol, 'compound_registry', $results_id, 'id');
            } else if($structSearchType === 'similarity') {
                 // similarity search   
                 $results_temp = array();  
                 $results_temp[] = similarity_search($mol, 'compound_registry', $results_id, $tanimoto, 'id');
            }
            // where we have more than one results set, we treat the query as AND. So we find the intersection of the different 
            // results arrays and return that as result.
            if(count($results_temp) > 1) {
                $results_id = call_user_func_array('array_intersect', $results_temp);
            } else {
                $results_id = array_intersect($results_id, $results_temp[0]);
            }
            $results_id = array_values(array_unique($results_id));
            $count = count($results_id); 
            
        } // endif !empty($mol)
    }      
    if ($count > 0) {

        if ($count == 1) {
        echo "<div id='search_count'>".$count." result</div>";
        } else {
        echo "<div id='search_count'>".$count." results</div>";
        }
        echo "<div class='search_results_div'>";
        // Display results
        echo "<hr>";
        for ($i = 0; $i < count($results_id); $i++) {
           if(is_int($i / 2)) {
               echo "<div class='cpdItemContainer'>";
           }
           showRegCpd($results_id[$i], $_SESSION['prefs']['display']);
           if(!is_int($i / 2) || $i+1 === count($results_id)) {
              echo "</div>";
           }
        }
    } else { // no results
        echo "<p>Sorry, I couldn't find anything :(</p><br />";
    }
}
 

// FOOTER
require_once('inc/footer.php');
?>


