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
require_once('inc/common.php');
$page_title='Legal';
require_once('inc/head.php');
require_once('inc/menu.php');
require_once('inc/info_box.php');

// Page begin

echo "<p>".LAB_NAME." powered by <a href='https://github.com/martinp23/elabchem'>eLabChem</a>, a fork of <a href='http://www.elabftw.net' onClick='cornify_add();return false;'>Nicolas CARPi's eLabFTW</a></p>";
?>

<h3><a href="https://github.com/martinp23/elabchem">Get the eLabChem source on GitHub</a></h3>

<p style='text-align:center'>eLabChem is free software, licensed using the <a href="agpl-3.0.txt">GNU Affero General Public License v3.0</a></p>
<p style='text-align:center'>eLabChem is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied  
 warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the <a href="agpl-3.0.txt">GNU Affero General Public License</a> for more details.  </p>
<br /><br />
<h4>Contributors</h4>
<p><ul>
	<li>Nicolas CARPi</li>
	<li>Pascal NOIRCi</li>
	<li>Martin Peeks</li>	
</ul></p>
<br /><br />
<h4>Acknowledgements</h4>
<p>The following open-source projects are incorporated in some way into eLabChem:<ul>
	<li><a href="http://jquery.com/">jQuery</a> (<a href="https://github.com/jquery/jquery">source</a>) (<a href="http://opensource.org/licenses/MIT">MIT License</a>)</li>
	<li><a href="http://web.chemdoodle.com/">ChemDoodle Web</a> (<a href="http://web.chemdoodle.com/installation/download">download</a>) (<a href="https://www.gnu.org/licenses/gpl.html">GPL v3.0 License</a>)</li> 
	<li><a href="https://github.com/mleibman/SlickGrid/wiki">SlickGrid</a> (<a href="https://github.com/mleibman/SlickGrid">source</a>) (<a href="http://opensource.org/licenses/MIT">MIT License</a>)</li>
	<li><a href="http://openbabel.org/wiki/Main_Page">OpenBabel</a></li>
	</ul>
</p>



<?php
require_once('inc/footer.php');
?>
