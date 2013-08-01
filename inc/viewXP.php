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
// inc/viewXP.php
// ID
if(isset($_GET['id']) && !empty($_GET['id']) && is_pos_int($_GET['id'])){
    $id = $_GET['id'];
} else {
    die("The id parameter in the URL isn't a valid experiment ID.");
}

// SQL for viewXP
$sql = "SELECT * FROM experiments WHERE id = :id";
$req = $bdd->prepare($sql);
$req->execute( array('id' => $id));
$expdata = $req->fetch();

$sql = "SELECT * FROM revisions WHERE rev_id = :revid";
$req = $bdd->prepare($sql);
$req->execute(array(
		'revid' => $expdata['rev_id']
	));
$rev_data = $req->fetch();

if($expdata['type'] == 'chemsingle' || $expdata['type'] == 'chemparallel') {
	// get reaction scheme data and get stoichiometry grid data
	if($rev_data['rev_reaction_id'] != NULL) {
		$sql = "SELECT * FROM reactions WHERE rxn_id = :rev_rxn_id";
		$req = $bdd->prepare($sql);
		$req->execute(array('rev_rxn_id' => $rev_data['rev_reaction_id']));
		$rxn_data = $req->fetch();		
	} else {
		$rxn_data['rxn_mdl'] = "";
	}
	
	$gridDatadb = array();
	$sql = "SELECT * FROM rxn_stoichiometry WHERE rev_id = :revid";
	$req = $bdd->prepare($sql);
	$req->execute(array('revid' => $expdata['rev_id']));
	if ($req->rowcount() != 0) {
		while($gridRow = $req->fetch(PDO::FETCH_ASSOC)) {
			$gridDatadb[] = $gridRow;
		}
	}
}


// Check id is owned by connected user to present comment div if not
if ($expdata['userid_creator'] != $_SESSION['userid']) {
    echo "<ul class='infos'>Read-only mode. Not your experiment.</ul>";
}


// Display experiment
?>
<section class="item <?php echo $expdata['status'];?>">
<a class='align_right' href='delete_item.php?id=<?php echo $expdata['id'];?>&type=exp' onClick="return confirm('Delete this experiment ?');"><img src='themes/<?php echo $_SESSION['prefs']['theme'];?>/img/trash.png' title='delete' alt='delete' /></a>
<?php
echo "<span class='date'><img src='themes/".$_SESSION['prefs']['theme']."/img/calendar.png' title='date' alt='Date :' />".$expdata['date']."</span><br />
    <a href='experiments.php?mode=edit&id=".$expdata['id']."'><img src='themes/".$_SESSION['prefs']['theme']."/img/edit.png' title='edit' alt='edit' /></a> 
<a href='duplicate_item.php?id=".$expdata['id']."&type=exp'><img src='themes/".$_SESSION['prefs']['theme']."/img/duplicate.png' title='duplicate experiment' alt='duplicate' /></a> 
<a href='make_pdf.php?id=".$expdata['id']."&type=experiments'><img src='themes/".$_SESSION['prefs']['theme']."/img/pdf.png' title='make a pdf' alt='pdf' /></a> 
<a href='javascript:window.print()'><img src='themes/".$_SESSION['prefs']['theme']."/img/print.png' title='Print this page' alt='Print' /></a> 
<a href='make_zip.php?id=".$expdata['id']."&type=exp'><img src='themes/".$_SESSION['prefs']['theme']."/img/zip.gif' title='make a zip archive' alt='zip' /></a> ";
// lock
if($expdata['locked'] == 0) {
    echo "<a href='lock-exec.php?id=".$expdata['id']."&action=lock'><img src='themes/".$_SESSION['prefs']['theme']."/img/unlock.png' title='lock experiment' alt='lock' /></a>";
} else { // experiment is locked
    echo "<a href='lock-exec.php?id=".$expdata['id']."&action=unlock'><img src='themes/".$_SESSION['prefs']['theme']."/img/lock.png' title='unlock experiment' alt='unlock' /></a>";
}

// <a href='publish.php?id=".$expdata['id']."&type=exp'><img src='themes/".$_SESSION['prefs']['theme']."/img/publish.png' title='submit to a journal' alt='publish' /></a>";
// TAGS
echo show_tags($id, 'experiments_tags');
// TITLE : click on it to go to edit mode
?>
<div OnClick="document.location='experiments.php?mode=edit&id=<?php echo $expdata['id'];?>'" class='title'>
    <?php echo stripslashes($rev_data['rev_title']);?>
    <span class='align_right' id='status'>(<?php echo $expdata['status'];?>)<span>
</div>
<?php
	if($expdata['type'] == 'chemsingle' || $expdata['type'] == 'chemparallel') {
	?><div OnClick="document.location='experiments.php?mode=edit&id=<?php echo $expdata['id'];?>'"><p class="schemeView">
		<script type='text/javascript'>
			var gridData = <?php echo json_encode($gridDatadb);?>;
			for (i in gridData) {
				for(j in gridData[i]) {
					if(gridData[i][j] === null) {
						delete gridData[i][j];
					}
				}
			}
		
			// these four are required by the ChemDoodle Web Components library	
			$("head").append('<meta http-equiv="X-UA-Compatible" content="chrome=1">',
						'<link rel="stylesheet" href="js/chemdoodleweb/ChemDoodleWeb.css" type="text/css">',
						'<script type="text/javascript" src="js/chemdoodleweb/ChemDoodleWeb-libs.js"/>',
						'<script type="text/javascript" src="js/chemdoodleweb/ChemDoodleWeb.js"/>');
						
			$("head").append('<script type="text/javascript" src="js/schemeViewer.js"/>');
				// now all the slickgrid stuff
			$("head").append('<link rel="stylesheet" href="js/slickgrid/slick.grid.css" type="text/css">',
						'<link rel="stylesheet" href="js/slickgrid/css/stoich-grid.css" type="text/css">',
					    '<link rel="stylesheet" href="js/slickgrid/controls/slick.columnpicker.css" type="text/css">',
						'<script type="text/javascript" src="js/slickgrid/lib/jquery.event.drag-2.2.js"/>',
						'<script type="text/javascript" src="js/slickgrid/lib/jquery.event.drop-2.2.js"/>',
						'<script type="text/javascript" src="js/slickgrid/slick.dataview.js"/>',
						'<script type="text/javascript" src="js/slickgrid/controls/slick.columnpicker.js"/>',
						'<script type="text/javascript" src="js/slickgrid/plugins/slick.rowselectionmodel.js"/>',
						'<script type="text/javascript" src="js/slickgrid/slick.core.js"/>',
						'<script type="text/javascript" src="js/slickgrid/slick.editors.js"/>',
						'<script type="text/javascript" src="js/slickgrid/slick.formatters.js"/>',
						'<script type="text/javascript" src="js/slickgrid/slick.grid.js"/>',
						'<script type="text/javascript" src="js/chem-editors.js"/>', 	
						'<script type="text/javascript" src="js/chem-formatters.js"/>', 	
						'<script type="text/javascript" src="js/stoic-table-view.js"/>', 	
						'<script type="text/javascript" src="js/unit-converters.js"/>'); 
				// put in a scheme viewer		
			schemeViewer(<?php echo json_encode($rxn_data['rxn_mdl']);?>);

			
	 </script></p></div>
	    
	    	</div><h4>Stoichiometry table</h4><br />
	<div id="stoich-table"></div><br /><h4>Experimental</h4>
	
<?php }
// BODY (show only if not empty, click on it to edit
if ($rev_data['rev_body'] != ''){
    ?>
    <div OnClick="document.location='experiments.php?mode=edit&id=<?php echo $expdata['id'];?>'" class='txt'><?php echo stripslashes($rev_data['rev_body']);?></div>
<?php
}
echo "<br />";

// DISPLAY FILES
require_once('inc/display_file.php');

// DISPLAY LINKED ITEMS
$sql = "SELECT link_id, id FROM experiments_links WHERE item_id = :id";
$req = $bdd->prepare($sql);
$req->execute(array('id' => $id));
// Check there is at least one link to display
if ($req->rowcount() != 0) {
    echo "<h4>Linked items</h4>";
    echo "<ul>";
    while ($links = $req->fetch()) {
        // SQL to get title
        $linksql = "SELECT id, title, type FROM items WHERE id = :link_id";
        $linkreq = $bdd->prepare($linksql);
        $linkreq->execute(array(
            'link_id' => $links['link_id']
        ));
        $linkdata = $linkreq->fetch();
        $name = get_item_info_from_id($linkdata['type'], 'name');
        echo "<li>[".$name."] - <a href='database.php?mode=view&id=".$linkdata['id']."'>".stripslashes($linkdata['title'])."</a></li>";
    } // end while
    echo "</ul>";
} else { // end if link exist
    echo "<br />";
}

// DISPLAY eLabID
echo "<p class='elabid'>Unique eLabID : ".$expdata['elabid']."</p>";

// KEYBOARD SHORTCUTS
echo "<script>
key('".$_SESSION['prefs']['shortcuts']['create']."', function(){location.href = 'create_item.php?type=exp'});
key('".$_SESSION['prefs']['shortcuts']['edit']."', function(){location.href = 'experiments.php?mode=edit&id=".$id."'});
</script>";
echo "</section>";
?>
<script>
// change title
$(document).ready(function() {
    // fix for the ' and "
    title = "<?php echo $rev_data['rev_title']; ?>".replace(/\&#39;/g, "'").replace(/\&#34;/g, "\"");
    document.title = title;
});
</script>

