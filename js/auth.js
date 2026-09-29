/* ==========================================================================
   VIRASYA — Session / Auth helper
   Shared by the marketplace and the login page.

   There is no backend in this prototype, so a "session" is just a profile
   object in localStorage. Everything is wrapped in try/catch with an
   in-memory fallback because the site is often opened straight off disk
   (file://), where some browsers refuse localStorage.
   ========================================================================== */
(function (global) {
    'use strict';

    var STORAGE_KEY = 'virasya.auth';
    var memory = null;

    function read() {
        if (memory) { return memory; }
        try {
            var raw = global.localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    function write(value) {
        memory = value;
        try {
            if (value) {
                global.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
            } else {
                global.localStorage.removeItem(STORAGE_KEY);
            }
        } catch (e) { /* file:// or private mode - memory copy still works */ }
    }

    function displayName(profile) {
        if (!profile) { return ''; }
        if (profile.name) { return profile.name; }
        if (profile.email) { return profile.email.split('@')[0]; }
        return 'Member';
    }

    var VirasyaAuth = {

        /* Current profile, or null when signed out. */
        get: function () {
            return read();
        },

        isLoggedIn: function () {
            return !!read();
        },

        name: function () {
            return displayName(read());
        },

        /* Create a session. `profile` is { name, email, role }. */
        signIn: function (profile) {
            var session = {
                name: (profile && profile.name) || '',
                email: (profile && profile.email) || '',
                role: (profile && profile.role) || 'user',
                signedInAt: new Date().toISOString()
            };
            write(session);
            return session;
        },

        signOut: function () {
            write(null);
        },

        /* Where the visitor was headed, relative to the LOGIN page's folder.
           Callers pass a path they have already made correct for login.html. */
        returnTo: function () {
            try {
                var params = new URLSearchParams(global.location.search);
                var target = params.get('redirect');
                // Only same-site relative paths, so ?redirect= can't be abused
                // to bounce someone to another origin.
                if (target && !/^[a-z][a-z0-9+.-]*:/i.test(target) && target.charAt(0) !== '/' && target.indexOf('..') === -1) {
                    return target;
                }
            } catch (e) { /* no URLSearchParams */ }
            return null;
        },

        loginUrl: function (loginPage, returnTo) {
            var query = 'redirect=' + encodeURIComponent(returnTo);
            return loginPage + '?' + query;
        },

        /* Gate for actions that need an account. Returns true when the visitor
           may proceed; otherwise sends them to the login page and returns
           false, so callers can simply `if (!requireLogin()) return;`. */
        requireLogin: function (loginPage, returnTo) {
            if (this.isLoggedIn()) { return true; }
            global.location.href = this.loginUrl(loginPage, returnTo);
            return false;
        }
    };

    global.VirasyaAuth = VirasyaAuth;

})(window);
