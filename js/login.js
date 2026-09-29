/* Role switcher + sign-in for the login card. The markup calls setRole(role)
   from the tab buttons' inline onclick handlers, so it has to stay a global.

   There is no backend here: signing in writes a profile object through
   js/auth.js, which is what the marketplace checks before checkout. */
(function () {
    'use strict';

    var activeRole = 'user';

    function setRole(role) {
        activeRole = role;
        ['user', 'artisan'].forEach(function (r) {
            var isActive = r === role;
            document.getElementById('tab-' + r).classList.toggle('active', isActive);
            document.getElementById('panel-' + r).classList.toggle('active', isActive);
        });
    }

    window.setRole = setRole;

    function nameFromIdentifier(value) {
        var text = (value || '').trim();
        if (!text) { return ''; }
        if (text.indexOf('@') > -1) { return text.split('@')[0]; }
        return text;
    }

    function signIn(role) {
        var emailField = document.getElementById(role + '-email');
        var passField = document.getElementById(role + '-pass');
        var email = (emailField.value || '').trim();
        var pass = passField.value || '';

        if (!email) {
            emailField.focus();
            return;
        }
        if (!pass) {
            passField.focus();
            return;
        }

        var auth = window.VirasyaAuth;
        auth.signIn({
            name: nameFromIdentifier(email),
            email: email,
            role: role
        });

        var target = auth.returnTo() || 'newproto/newproto.html?from=nav';
        window.location.href = target;
    }

    function init() {
        setRole('user');

        ['user', 'artisan'].forEach(function (role) {
            var btn = document.getElementById('submit-' + role);
            if (btn) { btn.addEventListener('click', function () { signIn(role); }); }
        });

        // Arriving from the marketplace's checkout gate: say so, and point
        // "back" at the cart instead of the homepage.
        var auth = window.VirasyaAuth;
        var target = auth.returnTo();
        if (target) {
            var note = document.getElementById('return-note');
            if (note) { note.hidden = false; }
            var back = document.getElementById('back-link');
            if (back) {
                back.href = target;
                back.textContent = '← Back to marketplace';
            }
        } else if (auth.isLoggedIn()) {
            // Already signed in: no reason to show the form again.
            window.location.replace('newproto/newproto.html?from=nav');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
