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
require_once('inc/common.php');
// Check id is valid and assign it to $id
if(isset($_GET['id']) && is_pos_int($_GET['id'])) {
    $id = $_GET['id'];
} else {
    die("<div class='center'><img src='img/hal9000.png' alt='hal' /><br />I'm sorry, Dave. I'm afraid I can't do that.</div>");
}

if($_GET['type'] === 'experiments'){
// Check file id is owned by connected user
    $sql = "SELECT userid, real_name, long_name, item_id FROM uploads WHERE id = :id";
    $req = $bdd->prepare($sql);
    $req->execute(array(
        'id' => $id));
    $data = $req->fetch();
   if($data['userid'] == $_SESSION['userid']){
       // Good to go -> DELETE FILE
    $sql = "DELETE FROM uploads WHERE id = ".$id;
    $reqdel = $bdd->prepare($sql);
    $reqdel->execute();
    $reqdel->closeCursor();
    $filepath = $ini_arr['upload_dir'].$data['long_name'];
    unlink($filepath);
    // remove thumbnail
    $ext = get_ext($data['real_name']);
    if (file_exists($ini_arr['upload_dir'].$data['long_name'].'_th.'.$ext)) {
        unlink($ini_arr['upload_dir'].$data['long_name'].'_th.'.$ext);
    }
    // Redirect to the viewXP
    $expid = $data['item_id'];
    $msg_arr = array();
    $msg_arr [] = 'File '.$data['real_name'].' deleted successfully';
    $_SESSION['infos'] = $msg_arr;
    header("location: experiments.php?mode=view&id=$expid");
   } else {
        die("<div class='center'><img src='img/hal9000.png' alt='hal' /><br />I'm sorry, Dave. I'm afraid I can't do that.</div>");
   }
}elseif ($_GET['type'] === 'database'){
    // Get realname
    $sql = "SELECT real_name, long_name, item_id FROM uploads WHERE id = ".$id;
    $req = $bdd->prepare($sql);
    $req->execute();
    $data = $req->fetch();
    // Delete file
    $filepath = $ini_arr['upload_dir'].$data['long_name'];
    unlink($filepath);

    // Delete SQL entry (and verify that the type is prot, to avoid someone deleting files saying it's DB whereas it's exp
    $sql = "DELETE FROM uploads WHERE id = ".$id." AND type = 'database'";
    $reqdel = $bdd->prepare($sql);
    $reqdel->execute();

    // Redirect to the viewDB
    $msg_arr = array();
    $msg_arr [] = 'File '.$data['real_name'].' deleted successfully';
    $_SESSION['infos'] = $msg_arr;
    $item_id = $data['item_id'];
    header("location: database.php?mode=view&id=$item_id");
}elseif (($_GET['type'] === 'lm') || ($_GET['type'] === 'jc')) {
    $type = $_GET['type'];
    // Get realname
    $sql = "SELECT real_name, long_name FROM uploads WHERE id = ".$id;
    $req = $bdd->prepare($sql);
    $req->execute();
    $data = $req->fetch();
    // Delete file
    $filepath = $ini_arr['upload_dir'].$data['long_name'];
    unlink($filepath);

    // Delete SQL entry (and verify the type, to avoid someone deleting files saying it's DB whereas it's XP
    $sql = "DELETE FROM uploads WHERE id = :id AND type = :type";
    $reqdel = $bdd->prepare($sql);
    $reqdel->execute(array(
        'id' => $id,
        'type' => $type
    ));

    // Redirect to the team page
    $msg_arr = array();
    $msg_arr [] = 'File '.$data['real_name'].' deleted successfully';
    $_SESSION['infos'] = $msg_arr;
    if ($type === 'lm') {
        header("location: team.php#team-2");
    } elseif ($type === 'jc') {
        header("location: team.php#team-3");
    }
} else {
        die("<div class='center'><img src='img/hal9000.png' alt='hal' /><br />I'm sorry, Dave. I'm afraid I can't do that.</div>");
}
?>