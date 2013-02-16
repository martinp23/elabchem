<?php 
require_once('inc/head.php');
require_once('inc/menu.php'); ?>

<section class='page' id='home_page'>

    <section class='second'>
    <figure>
    <img src="img/logo-crea.png"/>
    <img class='ico' src="img/ico-experience.png"/>
    <img class='ico' src="img/ico-database.png"/>
    <img class='ico' src="img/ico-archive.png"/>
    </figure>
    <div id='ico-txt'>
        <h2>Experience</h2>
        <p>A free and open-source <br/>
        lab notebook. <br/>
        Usable, efficient, simple and yet complete.</p>
        <h2>Database</h2>
        <p>Modernize your lab <br/>
        Get a real database<br/>
        Find what you search easily</p>
        <h2>Archive</h2>
        <p>Export your experiments<br/>
        as pdf, spreadsheet or zip archive<br/>
        </p>
        <h2>Flexibility</h2>
        <p>Any kind of lab can use eLabFTW<br/>
        from Molecular biology to crystallography lab</p>
        <h2>Updates</h2>
        <p>Get frequent updates<br/>
        They will always be free !</p>
    </div>

    <section id='tagline'>
        <div>
            <p class="tagline">It was made by researchers, for researchers, with usability in mind.
            <a href='https://github.com/NicolasCARPi/elabftw/#readme'><img src="img/btn-try.png" onmouseover="this.src='img/btn-try-hover.png'" onmouseout="this.src='img/btn-try.png'" alt='try me' /></a></p>
        </div>
    </section>

    <section class='second' id='updates'>
            <h2>Recent Updates</h2>
<div class='center'>
<a class="twitter-timeline" data-dnt="true" href="https://twitter.com/eLabFTW"  data-widget-id="302828812129935361">Tweets by @eLabFTW</a><script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
</div>
    </section>

    </section>

</section>
<!-- SCREENS -->
<section class='page' id='screens_page'>

    <section class='second'>
    <div>
    <?php
    // dir containing scrots
    $scrots_dir = "scrots/full";
    // 
    // get file list and remove the two first entries : . and ..
    $scrots = array_slice(scandir($scrots_dir), 2);
    // foreach file, display it
    foreach($scrots as $scrot){
        echo "<a class='lightbox' href='scrots/full/".$scrot."'><img src='scrots/thumb/".$scrot."_thumb.png' alt=''></a>";
    }
    ?>
    </div>
    <article><p>Want to try before installing ? Please do :<br />
    <ul>
    <li><a href='http://elabftw-demo.yzi.me'>elabftw-demo.yzi.me</a></li> 
    <li>Username = demo</li>
    <li>Password = demo</li>
    </ul>
    </article>
    </section>
</section>

<!-- ABOUT -->
<section class='page' id='about_page'>
    <section class='second'>
<p class='center'>About what ?</p>
<!--
        <figure class='center'><img src='img/home.png' alt='elabftw' title='elabftw can help you organize your lab' /></figure>
        <section id='faq'>
            <ol>
            <li><a href='#why'>Why should I use an electronic lab notebook ?</a></li>
            <li><a href='#choose'>Why choose eLabFTW ?</a></li>
            <li><a href='#fail'>I tried installing it but it doesn't work !! What do I do ?</a></li>
            <li><a href='#donate'>I really like this software, how can I retribute the author ?</a></li>
            </ol>
            <p id='why'><em>Why should I use an electronic lab notebook ?</em><br />
            Paper is dead. We are in the era of dematerialized objects. Compared to a traditional lab notebook, eLabFTW has numerous advantages. The first one is allowing users to search in the experiments/protocols. No more page turning and weird writing deciphering !<br />
            But it's a lot more than that ! You can share an experiment easily, export it in pdf, make a zip archive, etc...</p>
            <p id='choose'><em>Why choose eLabFTW ?</em><br />
            Because it's free, open-source,  designed with usability in mind, and also because it's the only one alive ! Other lab manager projects are dead or so shitty you wouldn't believe it !</p>
            <p id='fail'><em>I tried installing it but it doesn't work !! What do I do ?</em><br />
            Please refer to the <a href='https://github.com/NicolasCARPi/elabftw/wiki/Install'>wiki</a>.</p>
            <p id='donate'><em>I really like this software, how can I retribute the author ?</em><br />
            You can donate <a href='http://bitcoin.org/'>bitcoins</a> to 1M5Y47jpdFSwXDg5yEwxGvsh3W3Tm6BQX1. I don't use Paypal and such as <a href='https://encrypted.google.com/search?q=paypal+cut+wikileaks'>they do not support</a> freedom (and take a fee). You can also donate this money to the Free Software Fondation, <a href='https://my.fsf.org/donate/'>click here.</a></p>
        </section>
-->
    </section>

</section>

<?php include("inc/footer.php"); ?>
