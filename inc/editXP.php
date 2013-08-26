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
// inc/editXP.php
?>
<script src="js/tinymce/tinymce.min.js"></script>
<?php
// ID
if(isset($_GET['id']) && !empty($_GET['id']) && is_pos_int($_GET['id'])){
    $id = $_GET['id'];
} else {
    die("The id parameter in the URL isn't a valid item ID.");
}

// SQL for editXP
$sql = "SELECT * FROM experiments WHERE id = ".$id;
$req = $bdd->prepare($sql);
$req->execute();
$exp_data = $req->fetch();

$sql = "SELECT rev_id, rev_body, rev_title, rev_reaction_id, rev_stoictab_id, rev_prodtab_id, rev_stoictab_col, rev_prodtab_col
		 FROM revisions WHERE rev_id = :revid";
$req = $bdd->prepare($sql);
$req->execute(array(
		'revid' => $exp_data['rev_id']
	));
$rev_data = $req->fetch();


// Do some chemistry-specific stuff
if($exp_data['type'] === 'chemsingle' || $exp_data['type'] === 'chemparallel') {
	// SQL to get our reaction box and content of slickgrids.
	if($rev_data['rev_reaction_id'] != NULL) {
		$sql = "SELECT rxn_mdl FROM reactions WHERE rxn_id = :rev_rxn_id";
		$req = $bdd->prepare($sql);
		$req->execute(array('rev_rxn_id' => $rev_data['rev_reaction_id']));
		$rxn_data = $req->fetch();		
	} 
	
	$gridDatadb = array();
	
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
	
	 ?>
	 <!-- first just make the grid data available -->
	<script type="text/javascript">
	var gridData = <?php echo  json_encode($gridDatadb) ;?>;
	
		for (i in gridData) {
			for(j in gridData[i]) {
				if(gridData[i][j] === null) {
					delete gridData[i][j];
				}
			}
		}
		gridData;
		var gridDataOrig = JSON.stringify(gridData);
		var visibleColumnsNW = [];
		<?php if($gridColumns) { ?>
  			visibleColumnsNW = JSON.parse(<?php echo "'" . $gridColumns . "'";?>);
  		<?php } ?>

				var rxn = <?php echo json_encode((isset($rxn_data['rxn_mdl'])) ? $rxn_data['rxn_mdl'] : '');?>;
				var rxnOrig = rxn;
		</script>
		
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

    <!-- now all the slickgrid stuff-->

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
                <script type="text/javascript" src="js/stoic-table-edit.js"></script> 
                <script type="text/javascript" src="js/schemeViewer.js"></script>    
                <script type="text/javascript" src="js/chemistry-functions.js"></script> 
								

	<?php 
	
	
}

// Check id is owned by connected user
if ($exp_data['userid_creator'] != $_SESSION['userid']) {
    echo ("<ul class='errors'>You are trying to edit an experiment which is not yours.</ul>");
    require_once('inc/footer.php');
    exit();
}

// Check for lock
if ($exp_data['locked'] == 1) {
    die("Item is locked. Can't edit.");
}

// BEGIN CONTENT
?>
<section id='view_xp_item' class='item <?php echo $exp_data['status'];?>'>
<a class='align_right' href='delete_item.php?id=<?php echo $id;?>&type=exp' onClick="return confirm('Delete this experiment ?');"><img src='themes/<?php echo $_SESSION['prefs']['theme'];?>/img/trash.png' title='delete' alt='delete' /></a>
<!-- ADD TAG FORM -->
<img src='themes/<?php echo $_SESSION['prefs']['theme'];?>/img/tags.gif' alt='' /> <h4>Tags</h4><span class='smallgray'> (click a tag to remove it)</span><br />
<div class='tags'>
<span id='tags_div'>
<?php
$sql = "SELECT id, tag FROM experiments_tags WHERE item_id = ".$id;
$tagreq = $bdd->prepare($sql);
$tagreq->execute();
// DISPLAY TAGS
while($tags = $tagreq->fetch()){
echo "<span class='tag'><a onclick='delete_tag(".$tags['id'].",".$id.")'>";
echo stripslashes($tags['tag']);?>
</a></span>
<?php } //end while tags ?>
</span>
<input type="text" name="tag" id="addtaginput" placeholder="Add a tag" />
</div>
<!-- END ADD TAG -->
<!-- BEGIN EDITXP FORM -->
<form id="editXP" name="editXP" method="post" action="editXP-exec.php" enctype='multipart/form-data'>
<input name='item_id' type='hidden' value='<?php echo $id;?>' />
<input name='type' type='hidden' value='<?php echo $exp_data['type'];?>' />

<h4>Date</h4><span class='smallgray'> (date format : YYMMDD)</span><br />
<!-- TODO if firefox has support for it: type = date -->
<img src='themes/<?php echo $_SESSION['prefs']['theme'];?>/img/calendar.png' title='date' alt='Date :' /><input name='date' id='datepicker' size='6' type='text' value='<?php echo $exp_data['date'];?>' />

<span class='align_right'>
<h4>Status</h4>
<!-- Status get selected by default -->
<?php
$status = $exp_data['status'];
?>
<select id="status_form" name="status" onchange="update_status(this.value)">
	<option id='option_running' value="running">Running</option>
	<option id='option_success' value="success">Success</option>
	<option id='option_redo' value="redo">Need to be redone</option>
	<option id='option_fail' value="fail">Fail</option>
	<option id='option_deleted' value="deleted">Deleted</option>
</select>
</span>
<br />
<br />
<h4>Title</h4><br />
      <textarea id='title_txtarea' name='title' rows="1" cols="80"><?php if(empty($_SESSION['errors'])){
          echo stripslashes($rev_data['rev_title']);
      } else {
          echo stripslashes($_SESSION['new_title']);
      } ?></textarea>

<br /><br />
<?php if($exp_data['type'] === 'chemsingle' || $exp_data['type'] === 'chemparallel') { ?>
	<h4>Reaction scheme</h4><br /><div id="scheme" align="center">
		<script type="text/javascript" src="js/edittableScheme.js"></script><br />

	</div>

	<br />
	<div class='center' id='updateStoichTableBtn'>
		<input type="button" href="#" name="Update" onclick="updateStoichTable()" class='button' value="Update table" />
	</div><br /><h4>Stoichiometry table</h4><br />
	<div id="stoich-table"></div><br /><br />
	<!-- Chemistry edit area smaller than generic -->
<h4>Experiment</h4>
<br />
<textarea id='body_area' class='mceditable' style='height:350px;' name='body' rows="15" cols="80">
    <?php echo stripslashes($rev_data['rev_body']);?>
</textarea>
<br /><br />
<h4>Products</h4></br>

  <div id='prodGrid'>

  	<script>
  		var prodGridData = JSON.parse('<?php echo json_encode($prodGridData);?>');
  		var prodGridDataOrig = JSON.stringify(prodGridData);
	  	var	columnsProducts = [
  			{id: "del", name: "", field:"del", width:10, formatter:delButtonFormatter, init_visible:true},
  			{id: "copy", name: "", field:"copy", width:10, formatter:copyButtonFormatter, init_visible:true},
  			{id: "cpd_name", name: "Name", field:"cpd_name", width:150, init_visible:true},
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
  			visibleColumnsProductsNW = JSON.parse(<?php echo "'" . $prodGridColumns . "'";?>);
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
  			editable: true,
  			autoHeight: true,
			enableColumnReorder: true,
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
  			gridProducts = new Slick.Grid("#prodGrid", dataViewProducts, visibleColumnsProducts, optionsProducts);
  			
  			gridProducts.registerPlugin(groupItemMetadataProvider);
  			gridProducts.setSelectionModel(new Slick.RowSelectionModel());
  			
  			var columnpickerProducts = new Slick.Controls.ColumnPicker(columnsProducts, gridProducts, optionsProducts);
  		
  			
			dataViewProducts.onRowCountChanged.subscribe(function (e, args) {
				gridProducts.updateRowCount();
				gridProducts.render();
			});
			
			dataViewProducts.onRowsChanged.subscribe(function (e,args) {
				gridProducts.invalidateRows(args.rows);
				gridProducts.render();
			});
		
		
			gridProducts.onCellChange.subscribe(function (e, args) {
				// if mass has been changed, update mol and yield%
				// if mwt has been changed, update mol and yield%
				// if equiv has been changed, updated mol and yield%
				
				var colName = gridProducts.getColumns()[args.cell].id;
				if (colName === 'mass' || colName === 'mwt' || colName === 'equiv') {
					var dataViewData = dataViewProducts.getItems();
					dataViewProducts.beginUpdate();
					// var dataViewIndex;
					// for(var i=0; i<dataViewData.length; i++) {
						// if (dataViewData[i].id === args.item.id) {
							// dataViewIndex = i;
						// }
					// }
					var dataViewIndex = dataViewProducts.getIdxById(args.item.id);
					var reactantData = grid.getData();
					limitIndex = getLimitIndex(reactantData);
					dataViewData[dataViewIndex].mol = dataViewData[dataViewIndex].mass * (dataViewData[dataViewIndex].purity/100) / dataViewData[dataViewIndex].mwt;
					dataViewData[dataViewIndex].mass_units = getMassUnits(dataViewData[dataViewIndex].mass);
					dataViewData[dataViewIndex].mol_units = getMolUnits(dataViewData[dataViewIndex].mol);
					dataViewData[dataViewIndex].yield = (100 * (dataViewData[dataViewIndex].mol / dataViewData[dataViewIndex].equiv)) / (reactantData[limitIndex].mol / reactantData[limitIndex].equiv);
					dataViewProducts.setItems(dataViewData);
					groupByName();
					dataViewProducts.endUpdate();
					gridProducts.invalidateAllRows();
					gridProducts.render();
				}
       		});
       		
       		gridProducts.onClick.subscribe( function(e,args) {
	            if(args.grid.getColumns()[args.cell].field === 'del') {
	                dataViewProducts.deleteItem(dataViewProducts.getItem(args.row).id);
	            } else if (args.grid.getColumns()[args.cell].field === 'copy') {
	            	dataViewProducts.addItem(dataViewProducts.getItem(args.row));
	            }
	        });
		
		
			dataViewProducts.beginUpdate();
			dataViewProducts.setItems(dataProducts);
			groupByName();
			dataViewProducts.endUpdate();
			
			
  		});
  	
  			
  	</script>
  </div>
  
  <div class='center' id='addProductBtn'><br />
		<input type="button" href="#" name="addProdBtn" onclick="showAddProductDialog()" class='button' value="Add product batch" />
	</div>
	
	<div id='addProductDialog' title='Add Product'><div id='productRowsContainer'></div><div id='customProduct'>
		<section>
			<div class='prodDialogContainer'><div class='prodDialogMoleculePlaceholder'>&nbsp;</div>			
			<div class='prodDialogInputContainer'>
				<label for="prodNameNew">Name:</label>
				<input type="text" id="prodNameNew" style="width:60%;" class='prodDialogInputText' value="">
				<br style="clear:left;">
				<label for="prodMwtNew">Mol wt:</label>
				<div class='prodDialogInputTextWithUnits'>
					<input type="text" style="width:40%;" id="prodMwtNew" value=""><p class="inline">&nbsp;g/mol</p>
				</div>
				<br style="clear:left">
				<label for="prodMassNew">Mass:</label>
				<div class='prodDialogInputTextWithUnits'>
					<input type="text" style="width:40%;display:block;float:left;" id="prodMassNew" value="">
					<select id="massUnitsNew" style="display:block;float:left;margin-top:5px;">
						<option>kg</option>
						<option>g</option>
						<option selected="selected">mg</option>
						<option>ug</option>
						<option>ng</option>
					</select>
				</div>
				<br style="clear:left">
				<p class="center">
					<input type="button" href="#" name="Add new product" onclick="addBatch(document.getElementById('prodNameNew').value, document.getElementById('prodMwtNew').value, document.getElementById('prodMassNew').value, document.getElementById('massUnitsNew').value);" class="button" value="Add new product" />
				</p>
			</div>
		</section>
			
			
	</div>
		</div>
	
<script>
	
	
	  	$('#addProductDialog').dialog({ 
	  			modal: true,
		  		autoOpen: false,
		  		width: 'auto',
		  		height: 'auto',
		  		resizable:false});
  		function showAddProductDialog() {
  			//first we want to get our list of products present in the scheme
  			updateScheme();
		    var allMolecules = rxn.split('$MOL\n'),
	            counts = rxn.split('\n')[4],
	            numReact = parseInt(counts.substring(0,3), 10),
	            numProd = parseInt(counts.substring(3,6), 10);    
	        var reactants = [];
	        var products = [];
	        
            
            var prodGridData = dataViewProducts.getItems();
            
    		for (var i = 1; i <= numReact; i++) {
				reactants.push(allMolecules[i]);
			}
			for (var i = numReact + 1; i <= numReact + numProd; i++) {
				products.push(allMolecules[i]);
			}
			
			$.ajax({
	            url: 'getcompounddata.php',
	            data:{reactants:reactants, products:products},
	            dataType: "json",
	            productsArr: products,
	            type: 'POST',
	            
	            success: function(dbdata) {
	            	// we're going to build a collection of "possible products" (unique by name) from the scheme and from existing entries in the product table
	            	// then we're going to show a dialog with an element for each possible product: 
	            	// <table><tr><td>Name</td><td rowspan="2">Add this btn</td></tr><tr><td>Picture</td></tr></table>
	            	// Then an (expandable?) "Add new product" control where user can define name, iupac_name, mwt, 
	            	
	            	// first, get all of our possible products from the scheme
	            	productsResults = [];
	            	var prodGridData = dataViewProducts.getItems();
	       			for (var i=0; i<dbdata.products.length; i++) {
	       				productsResults.push({"cpd_name": dbdata.products[i].name, "mwt":dbdata.products[i].mwt, "inchi":dbdata.products[i].inchi, "cpd_id":dbdata.products[i].id, "cas_number":dbdata.products[i].cas_number, "mdl":this.productsArr[i]});
		       			
		       			for (var j=0; j<prodGridData.length; j++) {
		       				if(prodGridData[j].inchi === productsResults[i].inchi) {
		       					// if this is satisfied, our product already exists once in the table. The name from the table should therefore be correct, so let's use it.
		       					productsResults[i].cpd_name = prodGridData[j].cpd_name;
		       					productsResults[i].namefixed = true;
		       				}
		       				else {
		       					productsResults[i].namefixed = false;
		       				}
		       			}
		       		}
	       			
	       			// now let's go through our existing products (prodGridData) by name, and if they're missing from the "possible products", add their data.
	       			// this is for products which may not have a structure attached, for whatever reason.
	       			
	       			for (var i=0; i<prodGridData.length; i++) {
	       				var foundName = false;
	       				for (var j=0; j<productsResults.length; j++) {
	       					if(productsResults[j].cpd_name === prodGridData[i].cpd_name) {
	       						foundName = true;
	       					}
	       				}
	       				if(!foundName) {
	       					productsResults.push({"cpd_name": prodGridData[i].cpd_name, "mwt": prodGridData[i].mwt})
	       					productsResults[productsResults.length-1].namefixed = true;
	       				}
	       			}
	       			// at this point we should have an array of objects in productsResults which describes all the *known* possible products of the reaction
	       			$('#productRowsContainer').empty();
	       			for(var i=0; i<productsResults.length; i++) {
		       			if (productsResults[i]['mdl']) {
		       				// we need to make a structure viewer and have that on left of form
			       			var viewerName = 'productViewer' + i;
							var code = "<section><div class='prodDialogContainer'><div class='prodDialogMolecule'>";
							code += "<canvas id='" + viewerName + "'></canvas>";
							code += "<input type='image' href='#' src='img/loupe-15px.png' class='prodDialogLoupe' title='Get name from structure using PubChem' alt='Try to get name from structure using PubChem' onClick=\"getNameFromInchi(document.getElementById('prodName"+i+ "'), '" + productsResults[i]['inchi']+ "');\"/></div>";
						} else {
							// if no structure, we're just going to have empty space
		       				var code = "<section><div class='prodDialogContainer'><div class='prodDialogMoleculePlaceholder'>&nbsp;</div>";
						}	
							
						// now make the fields for the rest of the form.	
						code += "<div class='prodDialogInputContainer'>";
						// first product name. If the name is already in the table, the field is disabled and read-only. Otherwise, they can change it.
						code += "<label for='prodName"+i+ "'>Name:</label>";
						code += "<input type='text' id='prodName"+i+"' style='width:60%' class='prodDialogInputText' value='" + productsResults[i]['cpd_name'] +"' ";
						if(productsResults[i]['namefixed']) {
							code +=	"disabled='disabled' ";
						}
						code +=	"/><br style='clear:right;'/>";
						// now molecular weight. The field is always disabled.
						code += "<label for='prodMwt"+i+ "'>Mol wt:</label>";
						code += "<div class='prodDialogInputTextWithUnits'><input type='text' style='width:40%;'  id='prodMwt"+i + "' value='" + productsResults[i]['mwt'] + " ' disabled='disabled' /><p class='inline'>&nbsp;g/mol</p></div>";
						code += "<br style='clear:right'/>";
						// now mass. This requires user input. Units are selectable and default at 'mg'.
						code += "<label for='prodMass"+i+ "'>Mass:</label>";
						code += "<div class='prodDialogInputTextWithUnits'><input type='text' style='width:40%;display:block;float:left;'  id='prodMass"+i + "' value=''/><select id='massUnits"+i+"' style='display:block;float:left;margin-top:5px;'><option>kg</option><option>g</option><option selected='selected'>mg</option><option>ug</option><option>ng</option></select></div>";
						code += "<br style='clear:right'/>";
						code += "<p class='center'><input type='button' href='#' name='Add batch' onClick=\"addBatch(document.getElementById('prodName"+i+"').value, document.getElementById('prodMwt"+i+"').value, document.getElementById('prodMass"+i+"').value, document.getElementById('massUnits"+i+"').value,'"+productsResults[i]['inchi']+"');\" class='button' value='Add Batch'/></p>";
						code +="</div></div></section>";
						$('#productRowsContainer').append(code);
							
						if(productsResults[i]['mdl']) {
							// if we have a structure (ie need a viewer), we now need to initialise the viewer component. 
							// This must be done now because the canvas needs to be present in the document. We just added it in the .append().
	  						this[viewerName] = new ChemDoodle.ViewerCanvas(viewerName, 150, 150);
							this[viewerName].loadMolecule(ChemDoodle.readMOL(productsResults[i]['mdl']));
						 }
		       		}

		  			$('#addProductDialog').dialog('open');
		  			return;
	            }
	        });
	            	

  		}
  		function closeDialog() {
  			$('#addProductDialog').dialog('close');
  			return;  			
  		}
  		
  		function getNameFromInchi(nameEl, inchi) {
	  		$.ajax({
		        url: 'chemIdResolv.php',
		        data:{structId:inchi, representation:'iupac_name'},
		        
		        success: function(iupacname) {
		            if(iupacname) {
		            	nameEl.value = iupacname;
		            } else {
		            	alert("Name not found.");
		            }
		        }
	    	});
  		}
  		
  		function addBatch(name, mwt, mass, massunits, inchi) {
  			closeDialog();
  			mass = toSI(mass, massunits);
  			mol = mass / mwt;
  			molunits = getMolUnits(mol);
  			// get index of limiting reagent from main stoichiometry grid
  			reactantData = grid.getData();
  			limitIndex = getLimitIndex(reactantData);
  			yield = 100 * mol / (reactantData[limitIndex].mol / reactantData[limitIndex].equiv);
  			dataProducts.push({cpd_name:name, mwt:mwt, mass:mass, mass_units:massunits, purity:100, inchi:inchi, yield:yield, mol:mol, mol_units:molunits, id:dataProducts.length+1, equiv:1});
  			dataViewProducts.beginUpdate();
  			dataViewProducts.setItems(dataProducts);
  			groupByName();
  			dataViewProducts.endUpdate();
  			
  		}
	
	
	
	
</script><br />
<input name='rxn_input' type='hidden' value='' />
<input name='rxn_png' type='hidden' value='' />
<input name='grid_input' type='hidden' value='' />
<input name='prodGrid_input' type='hidden' value='' />
<input name='grid_columns' type='hidden' value='' />
<input name='prodGrid_columns' type='hidden' value='' />
<input name='rxn_changed' id='rxn_changed' type='hidden' value='0' />
<input name='grid_changed' id='grid_changed' type='hidden' value='0' />
<input name='prodGrid_changed' id='prodGrid_changed' type='hidden' value='0' />
<input name='gridColumns_changed' id='gridColumns_changed' type='hidden' value='0' />
<input name='prodGridColumns_changed' id='prodGridColumns_changed' type='hidden' value='0' />
<hr class='flourishes'>
	<?php 
	// non-chemistry experiment section
} else {
?>
<h4>Experiment</h4>
<br />
<textarea id='body_area' class='mceditable' name='body' rows="15" cols="80">
    <?php echo stripslashes($rev_data['rev_body']);?>
</textarea>


<?php 
	//end if
}?>
<!-- SUBMIT BUTTON -->
<input name='oldid' type='hidden' value='<?php echo $exp_data['rev_id'];?>' />
<input name='body_changed' type='hidden' value='0' />
<input name='title_changed' type='hidden' value='0' />


<div class='center' id='saveButton'>
    <input type="submit" name="Submit" onclick="preSubmit();" class='button' value="Save and go back" />
</div>
</form><!-- end editXP form -->

<script>		

function preSubmit() {
	<?php if($exp_data['type'] === 'chemsingle' || $exp_data['type'] === 'chemparallel') { ?>
		rxn = ChemDoodle.writeRXN(reactionCanvas.getMolecules(), reactionCanvas.getShapes()) || '';
		if(rxnOrig !== rxn) {
			document.editXP.rxn_changed.value = '1';
	    	document.editXP.rxn_input.value = rxn;
	    	reactionCanvas.lasso.empty();
	    	reactionCanvas.repaint(false);
	    	document.editXP.rxn_png.value = document.getElementById('reaction').toDataURL("image/png");
	    	reactionCanvas.repaint();
	    }
	    var gridDataNew = JSON.stringify(grid.getData()) || '';
	    if (gridDataOrig !== gridDataNew) {
	    	document.editXP.grid_changed.value = '1';
	    	document.editXP.grid_input.value = gridDataNew;
	    }
	    var prodGridDataNew = JSON.stringify(dataViewProducts.getItems()) || '';
	    if (prodGridDataOrig !== prodGridDataNew) {
	    	document.editXP.prodGrid_changed.value = '1';
	    	document.editXP.prodGrid_input.value = prodGridDataNew;
	    }
	    
	    var gridColumns = grid.getColumns();
	    var prodGridColumns = gridProducts.getColumns();
	    
	    var gridColumnsNW = [];
	    for (var i = 0; i<gridColumns.length; i++) {
	    	gridColumnsNW.push({id:gridColumns[i].id, width:gridColumns[i].width})
	    }
	    
	    var prodGridColumnsNW = [];
	    for (var i = 0; i<prodGridColumns.length; i++) {
	    	prodGridColumnsNW.push({id:prodGridColumns[i].id, width:prodGridColumns[i].width})
	    }
	    
	  
	    if(gridColumnsNW !== JSON.stringify(visibleColumnsNW)) {	
	    	document.editXP.gridColumns_changed.value = '1';	   
	    } 
	   // }
	    if(prodGridColumnsNW !== JSON.stringify(visibleColumnsProductsNW)) {
	    	document.editXP.prodGridColumns_changed.value = '1';
	    }
    	document.editXP.grid_columns.value = JSON.stringify(gridColumnsNW);	    	
    	document.editXP.prodGrid_columns.value = JSON.stringify(prodGridColumnsNW);
	  //  }		    
    <?php } ?>
    if(document.editXP.body_area.value !== '<?php echo stripslashes($rev_data['rev_body']); ?>') {
    	document.editXP.body_changed.value = '1';
    }
    
    if(document.editXP.title.value !== '<?php echo stripslashes($rev_data['rev_title']); ?>') {
    	document.editXP.title.value = '1';
    }
    return;
}

</script>

<?php
// FILE UPLOAD
require_once('inc/file_upload.php');
// DISPLAY FILES
require_once('inc/display_file.php');
?>

<hr class='flourishes'>

<h4>Linked items</h4>
<div id='links_div'>
<?php
// DISPLAY LINKED ITEMS
$sql = "SELECT link_id, id FROM experiments_links WHERE item_id = ".$id;
$req = $bdd->prepare($sql);
$req->execute();
// Check there is at least one link to display
if ($req->rowcount() != 0) {
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
        echo "<li>- [".$name."] - <a href='database.php?mode=view&id=".$linkdata['id']."'>".stripslashes($linkdata['title'])."</a>";
        echo "<a onclick='delete_link(".$links['id'].", ".$id.")'>
        <img src='themes/".$_SESSION['prefs']['theme']."/img/trash.png' title='delete' alt='delete' /></a></li>";
    } // end while
    echo "</ul>";
} else { // end if link exist
    echo "<br />";
}
?>
</div>
<p class='inline'>Add a link</p>
<input id='linkinput' size='60' type="text" name="link" placeholder="from the database" />

</section>

<script>
// JAVASCRIPT
<?php
// KEYBOARD SHORTCUTS
echo "key('".$_SESSION['prefs']['shortcuts']['create']."', function(){location.href = 'create_item.php?type=exp'});";
echo "key('".$_SESSION['prefs']['shortcuts']['submit']."', function(){document.forms['editXP'].submit()});";
?>
// TAGS AUTOCOMPLETE
$(function() {
		var availableTags = [
<?php // get all user's tag for autocomplete
$sql = "SELECT DISTINCT tag FROM experiments_tags WHERE userid = :userid ORDER BY id DESC LIMIT 500";
$getalltags = $bdd->prepare($sql);
$getalltags->execute(array(
    'userid' => $_SESSION['userid']
));
while ($tag = $getalltags->fetch()){
    echo "'".$tag[0]."',";
}?>
		];
		$( "#addtaginput" ).autocomplete({
			source: availableTags
		});
	});
// DELETE TAG
function delete_tag(tag_id, item_id) {
    var you_sure = confirm('Delete this tag ?');
    if (you_sure == true) {
        var jqxhr = $.post('delete_tag.php', {
            id: tag_id,
            item_id: item_id,
            type: 'exp'
        }).done(function () {
            $("#tags_div").load("experiments.php?mode=edit&id=" + item_id + " #tags_div");
        })
    }
    return false;
}

// ADD TAG
function addTagOnEnter(e) { // the argument here is the event (needed to detect which key is pressed)
    var keynum;
    if (e.which) {
        keynum = e.which;
    }
    if (keynum == 13) { // if the key that was pressed was Enter (ascii code 13)
        // get tag
        var tag = $('#addtaginput').attr('value');
        // POST request
        var jqxhr = $.post('add_tag.php', {
            tag: tag,
            item_id: <?php echo $id; ?> , type: 'exp'
        })
        // reload the tags list
        .done(function () {
            $("#tags_div").load("experiments.php?mode=edit&id=<?php echo $id;?> #tags_div");
            // clear input field
            $("#addtaginput").val("");
            return false;
        })
    } // end if key is enter
}
// LINKS AUTOCOMPLETE
$(function() {
		var availableLinks = [
<?php // get all links for autocomplete
$sql = "SELECT title, id, type FROM items";
$getalllinks = $bdd->prepare($sql);
$getalllinks->execute();
while ($link = $getalllinks->fetch()){
    // html_entity_decode is needed to convert the quotes
    // str_replace to remove ' because it messes everything up
    $name = get_item_info_from_id($link['type'], 'name');
    echo "'".$link['id']." - ".$name." - ".str_replace("'", "", html_entity_decode(substr($link[0], 0, 60), ENT_QUOTES))."',";
}?>
		];
		$( "#linkinput" ).autocomplete({
			source: availableLinks
		});
	});
// DELETE LINK
function delete_link(id, item_id) {
    var you_sure = confirm('Delete this link ?');
    if (you_sure == true) {
        var jqxhr = $.post('delete_link.php', {
            id: id,
            item_id : item_id
        }).done(function () {
            $("#links_div").load("experiments.php?mode=edit&id=" + item_id + " #links_div");
        })
    }
    return false;
}

function addLinkOnEnter(e) { // the argument here is the event (needed to detect which key is pressed)
    var keynum;
    if (e.which) {
        keynum = e.which;
    }
    if (keynum == 13) { // if the key that was pressed was Enter (ascii code 13)
        // get link
        var link_id = decodeURIComponent($('#linkinput').attr('value'));
        // fix for user pressing enter with no input
        if (link_id.length > 0) {
            // parseint will get the id, and not the rest (in case there is number in title)
            link_id = parseInt(link_id, 10);
            console.log(isNaN(link_id));
            if (isNaN(link_id) != true) {
                // POST request
                var jqxhr = $.post('add_link.php', {
                    link_id: link_id,
                    item_id: <?php echo $id; ?>
                })
                // reload the link list
                .done(function () {
                    $("#links_div").load("experiments.php?mode=edit&id=<?php echo $id;?> #links_div");
                    // clear input field
                    $("#linkinput").val("");
                    return false;
                })
            } // end if input is bad
        } // end if input < 0
    } // end if key is enter
}

function update_status(status) {
            var jqxhr = $.ajax({
                type: "POST",
                url: "quicksave.php",
                data: {
                id : <?php echo $id;?>,
                status : status,
                }
                // change the color of the item border
            }).done(function() { 
                // we first remove any status class
                $("#view_xp_item").removeClass('running success redo fail');
                // and we add our new status class
                $("#view_xp_item").toggleClass(status);
            });
}

// READY ? GO !!
$(document).ready(function() {
    // javascript to put the selected on status option, because with php, browser cache the value of previous edited XP
    var status = "<?php echo $status;?>";
    switch(status) {
    case 'running' :
        $("#option_running").attr('selected', true);
        break;
    case 'success' :
        $("#option_success").attr('selected', true);
        break;
    case 'redo' :
        $("#option_redo").attr('selected', true);
        break;
    case 'fail' :
        $("#option_fail").attr('selected', true);
        break;
    default :
        $("#option_running").attr('selected', true);
    }

    // fix for the ' and "
    title = "<?php echo $rev_data['rev_title']; ?>".replace(/\&#39;/g, "'").replace(/\&#34;/g, "\"");
    document.title = title;
    // DATEPICKER
    $( "#datepicker" ).datepicker({dateFormat: 'ymmdd'});
    // SELECT ALL TXT WHEN FOCUS ON TITLE INPUT
    $("#title").focus(function(){
        $("#title").select();
    });
    // EDITOR
    tinymce.init({
        mode : "specific_textareas",
        editor_selector : "mceditable",
        content_css : "css/tinymce.css",
        plugins : "table textcolor searchreplace code fullscreen insertdatetime paste charmap save",
        toolbar1: "undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | superscript subscript | bullist numlist outdent indent | forecolor backcolor | charmap | save",
        removed_menuitems : "newdocument",
        // save button :
        save_onsavecallback: function() {
            $.ajax({
                type: "POST",
                url: "quicksave.php",
                data: {
                id : <?php echo $id;?>,
                type : 'experiments',
                // we need this to get the updated content
                title : document.getElementById('title_txtarea').value,
                date : document.getElementById('datepicker').value,
                body : tinymce.activeEditor.getContent()
                
                }
            });
        }
    });
    // ADD TAG JS
    // listen keypress, add tag when it's enter
    jQuery('#addtaginput').keypress(function (e) {
        addTagOnEnter(e);
    });
    // ADD LINK JS
    // listen keypress, add link when it's enter
    jQuery('#linkinput').keypress(function (e) {
        addLinkOnEnter(e);
    });
});
</script>

