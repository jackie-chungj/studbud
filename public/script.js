import Navigation from './component/navigation';
import './component/tasklist';
import './component/dictionary';
import './component/pomodoro';
import './component/stopwatch';
import './component/music';

// Reference from from Rob Dongas class tutorial walkthrough
const links = document.querySelectorAll('.timer-nav > ul > li > a');
const pages = document.querySelectorAll('.timer-page-container');

var timerNav = new Navigation(links, pages);
timerNav.getLinks();

timerNav.links.forEach(function(link) {
    link.addEventListener('click', function() {
        let pageId = timerNav.getHash(link);
        timerNav.setPage(pageId);
    })
})



// Multiple modals reference from = https://stackoverflow.com/questions/40645032/creating-multiple-modals-on-a-single-page
    // Get the modal
    var modal = document.getElementsByClassName('modal');

    // Get the button that opens the modal
    var btn = document.getElementsByClassName('openBtn');

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName('closeBtn');

    // When the user clicks the button, open the modal 
    btn[0].onclick = function() {
        modal[0].style.display = "block";
    }

    btn[1].onclick = function() {
        modal[1].style.display = "block";
    }
    // When the user clicks on <span> (x), close the modal
    span[0].onclick = function() {
        modal[0].style.display = "none";
    }

    span[1].onclick = function() {
        modal[1].style.display = "none";
    }
    // Close intro modal on backdrop click
    // Close drawer when clicking the overlay area (outside the drawer panel)
    window.onclick = function(event) {
        if (event.target == modal[0]) {
            modal[0].style.display = "none";
        }
        if (event.target == modal[1]) {
            modal[1].style.display = "none";
        }
    }

    // Escape key closes whichever modal/drawer is open
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modal[0].style.display = 'none';
            modal[1].style.display = 'none';
        }
    });

