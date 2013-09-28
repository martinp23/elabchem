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
require_once('inc/common.php');
$page_title = 'Profile';
require_once('inc/head.php');
require_once('inc/menu.php');
// SQL to get number of experiments
$sql = "SELECT COUNT(*) FROM experiments WHERE userid_creator = ".$_SESSION['userid'] . " AND status <> 'deleted'";
$req = $bdd->prepare($sql);
$req->execute();

$countdone = $req->fetch();

$sql = "SELECT COUNT(*) FROM experiments WHERE userid_creator = ".$_SESSION['userid'] . " AND status = 'deleted'";
$req = $bdd->prepare($sql);
$req->execute();

$countdeleted = $req->fetch();


// SQL for profile
$sql = "SELECT * FROM users WHERE userid = ".$_SESSION['userid'];
$req = $bdd->prepare($sql);
$req->execute();
$data = $req->fetch();

echo "<section class='item'>";
echo "<img src='themes/".$_SESSION['prefs']['theme']."/img/user.png' alt='user' /> <h4>INFOS</h4>";
echo "<div class='center'>
    <p>".$data['firstname']." ".$data['lastname']." (".$data['email'].")</p>
    <p>".$countdone[0]." experiments done and {$countdeleted[0]} deleted since ".date("l jS \of F Y", $data['register_date']);
    
if($data['group'] == 'admin') {echo "<p>You ARE admin \o/</p>";}
if($data['group'] === 'journalclub') {echo "<p>You ARE responsible of the <a href='journal-club.php'>Journal Club</a> !</p>";}
echo "</div>";

echo "<hr>";
require_once('inc/statistics.php');
echo "<hr>";
require_once('inc/tagcloud.php');

echo "</section>";

require_once('inc/footer.php');

