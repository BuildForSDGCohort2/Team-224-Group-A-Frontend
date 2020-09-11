"use strict"

var $$ = Dom7;

const api_url = "http://192.168.0.120/my_bank/";
const api_public = "http://192.168.0.120/my_bank/images/";
const api_key = "bmuzoora@gmail.com";
const app_version = "1.0.0";

// create app
var app = new Framework7({
    root: "#app",
    name: "My Bank",
    id: "com.sdg.bank",
    theme: "ios",
    routes: routes,
    touch: {
        tapHold: true //enable tap hold events
    },
});


// apps main view
var mainView = app.views.create(".view-main", {
    url: '/',
    on: {
        pageInit: function (e) {
            // show app preloader
            app.preloader.show("#6236FF");

            // create bank_list to check
            try {
                // get bank list to show
                get_bank_list_for_select();
            } catch (error) {
                console.log("No bank list available", error);
            }
        }
    }
});