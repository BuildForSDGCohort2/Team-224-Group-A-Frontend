"use strict"

var $$ = Dom7;

const api_url = "https://thewitcart.com/my_bank/";
const api_public = "https://thewitcart.com/my_bank/images/";
// const api_url = "http://barnabas/my_bank/";
// const api_public = "http://barnabas/my_bank/images/";
const api_key = "bmuzoora@gmail.com";
const app_version = "1.0.0";
const app_id = localStorage.getItem("app_id");

// create app
var app = new Framework7({
    root: "#app",
    name: "My Bank",
    id: "com.sdg.bank",
    theme: "auto",
    routes: routes,
    touch: {
        tapHold: true //enable tap hold events
    },
    panel: {
        swipe: true,
    }
});


// apps main view
var mainView = app.views.create(".view-main", {
    url: '/',
    on: {
        pageInit: function (e) {
            // show app preloader
            app.preloader.show("#6236FF");

            var loggedin = localStorage.getItem("loggedIn");
            if (loggedin == 1) {
                var rout = app.views.main.router;
                rout.navigate('/home/');
            }
        }
    }
});

// tap and hold
app.on('taphold', function(e) {
    console.log("Tap and hold works", e)
})