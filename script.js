// Script for Responsive Topnav with Dropdown
function responsiveTopnav() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var topnav = document.getElementById('myTopnav');
    if (!topnav) return;

    // Close responsive nav when any anchor inside topnav (except the hamburger) is clicked
    topnav.addEventListener('click', function (e) {
        var el = e.target;
        var a = el.closest('a');
        if (!a) return;
        // ignore the hamburger/icon link that toggles the menu
        if (a.classList.contains('icon')) return;

        if (topnav.classList.contains('responsive')) {
            topnav.className = 'topnav';
        }
    });

    // Also close when clicking links inside dropdown-content (if you have anchors not wrapped in <a> directly)
    var dropdownLinks = topnav.querySelectorAll('.dropdown-content a');
    dropdownLinks.forEach(function(link) {
        link.addEventListener('click', function () {
            if (topnav.classList.contains('responsive')) {
                topnav.className = 'topnav';
            }
        });
    });

    // Add touch/click-friendly toggling for dropdown buttons on small screens.
    // On desktop the CSS :hover still works; on mobile we toggle an 'open' class so
    // the dropdown-content flows properly and can be closed.
    var dropBtns = topnav.querySelectorAll('.dropdown .dropbtn');
    dropBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            // Only intercept toggle on small screens where the responsive menu is active
            if (!topnav.classList.contains('responsive') && window.matchMedia('(max-width:600px)').matches) {
                // If the topnav isn't already in responsive mode, let the hamburger control it.
                return;
            }

            // Prevent default button behaviour (if any) and toggle the dropdown
            e.preventDefault();
            var parent = btn.closest('.dropdown');
            if (!parent) return;
            var isOpen = parent.classList.toggle('open');
            var content = parent.querySelector('.dropdown-content');
            if (content) {
                // when open, ensure it displays in responsive flow; when closed, hide it
                content.style.display = isOpen ? 'block' : 'none';
            }
        });
    });

    // When a dropdown link is clicked, also remove any 'open' classes so stray boxes close
    dropdownLinks.forEach(function(link) {
        link.addEventListener('click', function () {
            var dd = link.closest('.dropdown');
            if (dd) {
                dd.classList.remove('open');
                var content = dd.querySelector('.dropdown-content');
                if (content) content.style.display = '';
            }
        });
    });
});
