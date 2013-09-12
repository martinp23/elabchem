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
?>
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-type" content="text/html;charset=UTF-8" />
<link rel="icon" type="image/ico" href="img/favicon.ico" />
<?php
echo "<title>".(isset($page_title)?$page_title:"Lab manager")." - eLabChem</title>"?>
<meta name="author" content="Nicolas CARPi, Martin Peeks" />
<!-- CSS -->
<link rel="stylesheet" media="all" href="css/main.css" />
<?php
if (isset($_SESSION['auth']) && $_SESSION['auth'] === 1){
echo "<link id='maincss' rel='stylesheet' media='all' href='themes/".$_SESSION['prefs']['theme']."/style.css' />";
} else {
echo "<link id='maincss' rel='stylesheet' media='all' href='themes/default/style.css' />";
}
?>
<link rel="stylesheet" media="all" href="css/jquery-ui-1.10.3.custom.min.css" />
<link rel="stylesheet" media="all" href="css/tagcloud.css" />
<link rel="stylesheet" media="all" href="css/pageslide.css" />
<link rel="stylesheet" media="all" href="css/jquery.rating.css" />
<link rel="stylesheet" media="all" href="css/jquery.lightbox-0.5.css" />
<!-- JAVASCRIPT -->

<script src="js/jquery-2.0.3.min.js"></script>
<script src="js/jquery-migrate-1.2.1.min.js"></script>

<script src="js/jquery-ui-1.10.3.custom.min.js"></script>
<!-- for editable comments -->
<script src="js/jquery.jeditable.min.js"></script>
<!-- for keyboard shortcuts -->
<script src='js/keymaster.min.js'></script>
<!-- for stars rating -->
<script src='js/jquery.rating.min.js'></script>
</head>

<body>
<?php // Page generation time
$time = microtime();
$time = explode(' ', $time);
$time = $time[1] + $time[0];
$start = $time;
?>
<section id="container">

