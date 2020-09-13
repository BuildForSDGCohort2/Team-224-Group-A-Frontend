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
        name: "Get Started",
        path: "/first-time/",
        url: "/pages/first_time/index.html",
        on: {
            pageInit: function(){
                app_countries();
            }
        }
    },
    {
        name: "home",
        path: "/home/",
        url: "/pages/home.html",
        options: {
            transition: 'f7-circle',
        },
    }
]