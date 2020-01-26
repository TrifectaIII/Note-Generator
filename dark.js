// get cookie, and set default behaivior
var saved = cookie.get('dark-mode','off');

// turn on if cookie indicates such
var dark_mode = false;

if (saved == 'on') {
    document.body.classList.add('dark-mode');
    dark_mode = true;
}

// get button from DOM
var mode_toggle = document.querySelector('.mode-toggle');

// toggle on button click
mode_toggle.addEventListener('click',function () {
    dark_mode = !dark_mode;
    if (dark_mode) {
        document.body.classList.add('dark-mode');
        cookie.set('dark-mode','on', {
            //save to root path so it works site-wide
            path: '/',
        });
    } else {
        document.body.classList.remove('dark-mode');
        cookie.set('dark-mode','off', {
            //save to root path so it works site-wide
            path: '/',
        });
    }
});