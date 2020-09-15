"use strict"

var routes = [
    {
        name: "index",
        path: "/index/",
        url: "/index.html",
        on: {
            pageInit: function (e, page) {
                console.log("Index Page Loading...", page);
                app.preloader.hide();
            }
        },
    },
    {
        name: "home",
        path: "/home/",
        url: "/pages/home.html",
        options: {
            transition: 'f7-circle',
        },
        on: {
            pageAfterIn(e, page) {
              page.router.clearPreviousHistory();
            },
        }
    }
]