<?php
/********************************************************************************
*                                                                               *
*   Copyright 2012-2013 Nicolas CARPi (nicolas.carpi@gmail.com),				*
*  				   Martin Peeks (martinp23@gmail.com)                           *
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
	$gridColumns = array();
	$sql = "SELECT * FROM rxn_stoichiometry WHERE exp_id = :exp_id AND table_rev_id = :tableid";
	$req = $bdd->prepare($sql);
	$req->execute(array(
		'exp_id' => $id,
		'tableid' => $rev_data['rev_stoictab_id']));
	if ($req->rowcount() != 0) {
		while($gridRow = $req->fetch(PDO::FETCH_ASSOC)) {
			$gridDatadb[] = $gridRow;
		}	
	}
	$gridColumns = $rev_data['rev_stoictab_col'];
		
	$prodGridData = array();
	$prodGridColumns = array();
	$sql = "SELECT * FROM rxn_product_table WHERE exp_id = :exp_id AND table_rev_id = :tableid";
	$req = $bdd->prepare($sql);
	$req->execute(array(
		'exp_id' => $id,
		'tableid' => $rev_data['rev_prodtab_id']));
	if ($req->rowcount() != 0) {
		while($gridRow = $req->fetch(PDO::FETCH_ASSOC)) {
			$prodGridData[] = $gridRow;
		}
	}	
	$prodGridColumns = $rev_data['rev_prodtab_col'];
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
			
			var visibleColumnsNW = [];
	
			<?php if($gridColumns) { ?>
	  			visibleColumnsNW = JSON.parse('<?php echo $gridColumns;?>');
	  		<?php } ?> </script>	
            <meta http-equiv="X-UA-Compatible" content="chrome=1">
            <link rel="stylesheet" href="js/chemdoodleweb/ChemDoodleWeb.css" type="text/css">
            <link rel="stylesheet" href="js/slickgrid/slick.grid.css" type="text/css">
            <link rel="stylesheet" href="js/slickgrid/css/stoich-grid.css" type="text/css">
            <link rel="stylesheet" href="js/slickgrid/controls/slick.columnpicker.css" type="text/css">
            <script type="text/javascript" src="js/chemdoodleweb/ChemDoodleWeb-libs.js"></script>
            <script type="text/javascript" src="js/chemdoodleweb/ChemDoodleWeb.js"></script>      
            <script type="text/javascript" src="js/schemeViewer.js"></script>
            <script type="text/javascript" src="js/slickgrid/lib/jquery.event.drag-2.2.js"></script>
            <script type="text/javascript" src="js/slickgrid/lib/jquery.event.drop-2.2.js"></script>
            <script type="text/javascript" src="js/slickgrid/slick.dataview.js"></script>
            <script type="text/javascript" src="js/slickgrid/controls/slick.columnpicker.js"></script>
            <script type="text/javascript" src="js/slickgrid/plugins/slick.rowselectionmodel.js"></script>
            <script type="text/javascript" src="js/slickgrid/slick.core.js"></script>
            <script type="text/javascript" src="js/slickgrid/slick.editors.js"></script>
            <script type="text/javascript" src="js/slickgrid/slick.formatters.js"></script>
            <script type="text/javascript" src="js/slickgrid/slick.grid.js"></script>
            <script type="text/javascript" src="js/slickgrid/slick.groupitemmetadataprovider.js"></script>
            <script type="text/javascript" src="js/slickgrid/slick.dataview.js"></script>
            <script type="text/javascript" src="js/chem-editors.js"></script>    
            <script type="text/javascript" src="js/chem-formatters.js"></script>     
            <script type="text/javascript" src="js/stoic-table-view.js"></script>    
            <script type="text/javascript" src="js/chemistry-functions.js"></script>
						
			<script type='text/javascript'>

				// put in a scheme viewer		
			schemeViewer(<?php echo json_encode($rxn_data['rxn_mdl']);?>);


	 </script></p></div>
	    
	    	</div><h4>Stoichiometry table</h4><br />
	    
	<div id="stoich-table"></div><br />
	<h4>Experimental</h4>

	
<?php }
// BODY (show only if not empty, click on it to edit
if ($rev_data['rev_body'] != ''){
    ?>
    <div OnClick="document.location='experiments.php?mode=edit&id=<?php echo $expdata['id'];?>'" class='txt'><?php echo stripslashes($rev_data['rev_body']);?></div>

<?php if(($expdata['type'] == 'chemsingle' || $expdata['type'] == 'chemparallel') && count($prodGridData) > 0) { ?>

<br /><br />
<h4>Products</h4></br>
  <div id='prodGrid'>

  	<script>
  		var prodGridData = JSON.parse('<?php echo json_encode($prodGridData);?>');
	  	var	columnsProducts = [
  			{id: "name", name: "Name", field:"cpd_name", width:150, init_visible:true},
  			{id: "batchref", name: "Ref.", field:"batch_ref", init_visible:true, editor:Slick.Editors.Text},
  			{id: "mass", name: "Mass", field:"mass", groupTotalsFormatter: massTotalsFormatter, init_visible:true, editor:chemEditor, formatter:massFormatter},
  			{id: "mwt", name: "Mol wt.", field:"mwt", init_visible:false, editor:chemEditor, formatter:mwtFormatter},
  			{id: "mol", name: "Moles", field:"mol", groupTotalsFormatter: molTotalsFormatter, init_visible:true, editor:chemEditor, formatter:molFormatter},
  			{id: "yield", name: "% Yield", field:"yield", groupTotalsFormatter: yieldTotalsFormatter, init_visible:true, formatter:percentFormatter},
  			{id: "purity", name:"% Purity", field:"purity", init_visible:true, formatter:percentFormatter, editor:FloatEditor},
  			{id: "equiv", name: "Equiv.", field:"equiv", init_visible:false, editor:FloatEditor},
  			{id: "colour", name: "Colour", field:"colour", init_visible:false, editor:Slick.Editors.Text},
  			{id: "state", name: "State", field:"state", init_visible:false, editor:Slick.Editors.Text},
  			{id: "nmr_ref", name: "NMR ref", field:"nmr_ref", init_visible:false, editor:Slick.Editors.Text},
  			{id: "anal_ref1", name: "Analytical ref 1", field:"anal_ref1", init_visible:false, editor:Slick.Editors.Text},
  			{id: "anal_ref2", name: "Analytical ref 2", field:"anal_ref2", init_visible:false, editor:Slick.Editors.Text},
  			{id: "mpt", name: "Melt. pt.", field:"mpt", init_visible:false, editor:Slick.Editors.Text},
  			{id: "alphad", name: "&alpha;D", field:"alphad", init_visible:false, editor:Slick.Editors.Text},
  			{id: "notes", name: "Notes", field:"notes", init_visible:false, editor:Slick.Editors.Text}
  		];
  		var visibleColumnsProducts = [];
  		var visibleColumnsProductsNW = [];
  		<?php if($prodGridColumns) { ?>
  			visibleColumnsProductsNW = JSON.parse(<?php echo $prodGridColumns;?>);
  		<?php } ?>
  		
  		if(visibleColumnsProductsNW.length === 0) {
  			// if we have no names\widths for columns from the database, use the defaults
  			for (var i = 0; i < columnsProducts.length; i++) {
				if(columnsProducts[i].init_visible === true) {
					visibleColumnsProducts.push(columnsProducts[i]);
				}
			}
		} else {
			var found;
	        //otherwise, use what the database tells us
	        for (var i=0; i<columnsProducts.length; i++) {
	            found = false;
	            for (var j=0; j<visibleColumnsProductsNW.length; j++) {
	                if(columnsProducts[i].id === visibleColumnsProductsNW[j].id) {
	                    found = true;
	                    columnsProducts[i].width = visibleColumnsProductsNW[j].width;
	                }
	            }
	            if (found) {
	                visibleColumnsProducts.push(columnsProducts[i]);
	            }
        	}
		}
		for (i in prodGridData) {
			for(j in prodGridData[i]) {
				if(prodGridData[i][j] === null) {
					delete prodGridData[i][j];
				}
			}
		}
  	
  	
  		var dataViewProducts;
  		var gridProducts;
  		var dataProducts = prodGridData;

  	
  		var optionsProducts = {
  			enableCellNavigation: true,
  			editable: false,
  			autoHeight: true,
			enableColumnReorder: false,
			enableAddRow:false,
			leaveSpaceForNewRows:false,
			syncColumnCellResize:true,
			autoEdit:false,
			asyncEditorLoading:false
  		};
  		
  		
  		
  		function groupByName() {
  			dataViewProducts.setGrouping({
  				getter: "cpd_name",
  				formatter: function(g) {
  					return "Product:   " + g.value;
  				},
  				aggregators: [
  					new Slick.Data.Aggregators.Sum("mass"),
  					new Slick.Data.Aggregators.Sum("mol"),
  					new Slick.Data.Aggregators.Sum("yield")
  				],
  				aggregateCollapsed:false
  			});
  		}
  		
  		$(function () {

  			var groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
  			dataViewProducts = new Slick.Data.DataView({
  				groupItemMetadataProvider: groupItemMetadataProvider,
  				inlineFilters: true
  			});
  			dataViewProducts.setItems(dataProducts);
  			gridProducts = new Slick.Grid("#prodGrid", dataViewProducts, visibleColumnsProducts, optionsProducts);
  			
  			gridProducts.registerPlugin(groupItemMetadataProvider);
  			gridProducts.setSelectionModel(new Slick.RowSelectionModel());
  			
			dataViewProducts.beginUpdate();
			groupByName();
			dataViewProducts.endUpdate();
			gridProducts.invalidate();
			gridProducts.render();
			
  		});
  		
  		</script>
  	</div>


<?php }
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

