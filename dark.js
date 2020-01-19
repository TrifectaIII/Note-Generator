cookie.defaults.path = '/';

// get cookie, and set default behaivior
var saved = cookie.get('dark-mode','on');

var mode_toggle = document.querySelector('.mode-toggle');

var dark_mode = false;

mode_toggle.addEventListener('click',function () {
    dark_mode = !dark_mode;
    if (dark_mode) {
        document.body.classList.add('dark-mode');
        cookie.set('dark-mode','on');
    } else {
        document.body.classList.remove('dark-mode');
        cookie.set('dark-mode','off');
    }
});

if (saved == 'on') {
    document.body.classList.add('dark-mode');
    dark_mode = true;
}