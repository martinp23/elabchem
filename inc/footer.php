<footer>
This website uses html5 and css3, please use a <a href="http://www.mozilla.com/firefox">recent browser</a>. Website by <a href="https://github.com/NicolasCARPi">Pascal NOIRCi</a><br />
<a href="http://creativecommons.org/licenses/by-nc-sa/2.0/fr/"><img src="img/cc.png" alt="License Creative Commons by-nc-sa" title="Creative Commons by-nc-sa" width="80" height="15" /></a>
<!-- Piwik -->
<script type="text/javascript">
var pkBaseURL = (("https:" == document.location.protocol) ? "https://flood.fr/piwik/" : "http://flood.fr/piwik/");
document.write(unescape("%3Cscript src='" + pkBaseURL + "piwik.js' type='text/javascript'%3E%3C/script%3E"));
</script><script type="text/javascript">
try {
var piwikTracker = Piwik.getTracker(pkBaseURL + "piwik.php", 2);
piwikTracker.trackPageView();
piwikTracker.enableLinkTracking();
} catch( err ) {}
</script><noscript><p><img src="http://flood.fr/piwik/piwik.php?idsite=2" style="border:0" alt="" /></p></noscript>
<!-- End Piwik Tracking Code -->
<!-- KONAMI CODE -->
<script type="text/javascript">
             if ( window.addEventListener ) {
            	  var state = 0, konami = [38,38,40,40,37,39,37,39,66,65];
            	  window.addEventListener("keydown", function(e) {
            	    if ( e.keyCode == konami[state] ) state++;
            	    else state = 0;
            	    if ( state == 10 )
            	      window.location = "http://www.gnu.org";
            	    }, true);
            	}
</script>
<script>
$(document).ready(function() {
    // show home
    $('#home_page').show();
    $('#screens_page').hide();
    $('#about_page').hide();
    moveArrow('home');

    $('#home').click(function() {
        $('#home_page').show();
        $('#screens_page').hide();
        $('#about_page').hide();
        moveArrow('home');
    });
    $('#screens').click(function() {
        $('#home_page').hide();
        $('#screens_page').show();
        $('#about_page').hide();
        moveArrow('screens');
    });
    $('#about').click(function() {
        $('#home_page').hide();
        $('#screens_page').hide();
        $('#about_page').show();
        moveArrow('about');
    });
    function moveArrow(page) {
        if ( page == 'home') {
            shift = '397';
        } else if ( page == 'screens') {
            shift = '270';
        } else if ( page == 'about' ) {
            shift = '130';
        }
        $('#arrow').css('margin-right', shift + 'px');
        $('#arrow').hide();
        $('#arrow').show('bounce', { direction: "down", times: 2 }, 400);
    }
    $('a.lightbox').lightBox();
});
</script>
</footer>
</body>
</html>
