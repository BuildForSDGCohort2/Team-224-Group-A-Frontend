// check for app details
function get_app_details() {
    // console.log("Getting app details");

    // first try to get details from localstorage
    try {
        var app_details = JSON.parse(localStorage.getItem("app_details"));
        console.log("App Id", app_details.app_id);
    } catch (err) {
        // console.log("Getting App Details from Server")

        // get app details from the server
        app.request.promise.post(api_url + "get-app-details.php", {
                api_key: api_key,
                app_id: app_id
            })
            .then((app_details) => {
                app.preloader.hide();
                if (app_details.status == 200) {
                    var app_data = JSON.parse(app_details.data)
                    if (app_data.statusCode == 200) {
                        localStorage.setItem("app_id", app_data.app_details.app_id);

                        console.log("App details", app_data);

                        // check if app has user registered$
                        $$('#first-time').click();

                        // show countries  show_countries




                    } else {
                        console.log("App details code 201", app_data);
                    }
                } else {
                    console.log("App details", app_details);
                }
            })
            .catch((err) => {
                app.preloader.hide();

                console.log("App details err", err);

                app.dialog.create({
                    title: "CONNECTION ERROR",
                    text: 'Server Connection Failed',
                    buttons: [{
                        text: '<span><i class="f7-icons">arrow_2_circlepath_circle_fill</i><span>',
                        onClick: () => {
                            reload_app();
                        }
                    }],
                    verticalButtons: false,
                }).open();

            })

    }
}

// get countries
function app_countries() {
    app.request.promise.post(api_url + "get-countries.php", {
            api_key: api_key
        })
        .then((countries) => {
            app.preloader.hide();

            if (countries.status == 200) {
                var country_data = JSON.parse(countries.data);
                console.log("Country details", country_data);
                if (country_data.statusCode == 201) {

                    $$('.show_countries').html(`<li>
                        <a href="#">
                            ${country_data.message}
                            <span class="text-muted"><i class="f7-icons">info_circle_fill</i></span>
                        </a>
                    </li>`)
                } else {

                    var count_list = '';
                    for (let c = 0; c < country_data.length; c++) {
                        var code;
                        if (country_data[c].currency_code != null) {
                            code = `<span class="badge bage-primary">${country_data[c].currency_code}</span>`;
                        } else {
                            code = ``;
                        }

                        count_list += `
                        <li id="${country_data[c].id}" onclick="select_country(this.id)">
                            <a href="#">
                            <input type="hidden" name="country_id" value="${country_data[c].id}">
                            <input type="hidden" name="country_name" value="${country_data[c].country_name}">
                            <input type="hidden" name="country_code" value="${country_data[c].country_code}">
                                <span>${country_data[c].country_name} (<em>${country_data[c].country_code}</em>)</span>                                
                                ${code}
                            </a>
                        </li>`;
                    }
                    $$('.show_countries').html(count_list)

                }
            } else {
                $$('.show_countries').html(`<li>
                        <a href="#">
                            Connection failed
                            <span class="text-muted"><i class="f7-icons">wifi_slash</i></span>
                        </a>
                    </li>`)
            }


        })
        .catch((err) => {
            app.preloader.hide();

            $$('.show_countries').html(`<li>
                <a href="#">
                    <b> ${err}</b>
                    <span class="text-muted text-danger"><i class="f7-icons">exclamationmark_octagon_fill</i></span>
                </a>
            </li>`)

        })


}

// set default country for app
function select_country(country_id) {
    app.preloader.show("#6236FF");
    var show_data = $$('.show_countries');
    
    // save selected country
    var country_d = app.form.convertToData('#'+country_id);
    // console.log("Selected country", country_d);
    localStorage.setItem("selected_country", JSON.stringify(country_d));


    // get bank details
    app.request.promise.post(api_url + "get-bank-list.php", {
            api_key: api_key,
            country_id: country_id
        })
        .then((bank_list) => {

            if (bank_list.status === 200) {

                var data = JSON.parse(bank_list.data);


                if (data.statusCode == 201) {

                    app.dialog.create({
                        title: "Bank List Empty",
                        text: 'No Banks found for the selected country, contact your Bank for help.',
                        buttons: [{
                            text: 'CLOSE ME',
                        }],
                        verticalButtons: false,
                    }).open();

                } else {
                    console.log("Bank List", data);
                    $$('#show_title').html("Select Bank You Use");

                    // loop through the banks returned
                    var list1 = '';
                    for (let b = 0; b < data.length; b++) {
                        list1 += `<li id="${data[b].id}" onclick="confirm_bank(this.id)">
                            <input type="hidden" name="bank_id" value="${data[b].id}">
                            <input type="hidden" name="bank_logo" value="${api_public}${data[b].logo}">
                            <input type="hidden" name="bank_name" value="${data[b].bank_name}">
                            <a href="#">
                                ${data[b].bank_name}

                                <span class="text-muted"><i class="f7-icons">chevron_right_circle</i></span>
                            </a>                                    
                            </li>`;
                    }
                    show_data.html(list1);
                }

                // stop loading
                app.preloader.hide();

            } else {
                console.log("Bank list", bank_list);
            }
        })
        .catch((err) => {
            app.preloader.hide();

            app.dialog.create({
                title: "CONNECTION ERROR",
                text: 'Server Connection Failed',
                buttons: [{
                    text: 'Alright',
                    onClick: () => {
                        // reload_app();
                    }
                }],
                verticalButtons: false,
            }).open();

        })

}
// get bank list from database
function get_bank_list_for_select() {

    console.log("Running on", app.device.os, "version", app.device.osVersion);
}

// reload app
function reload_app() {
    // show app preloader
    app.preloader.show("#6236FF");
    // get_bank_list_for_select();
    get_app_details();
}


// load bank data
function confirm_bank(bank_id) {
    var bank_details = app.form.convertToData('#' + bank_id);
    console.log("Bank Data", bank_details);

    app.dialog.create({
        title: "<center><img src='" + bank_details.bank_logo + "' style='border-radius:100%; width=55px;'/><br/>" + bank_details.bank_name+"</center>",
        text: '<center>Continue With ' + bank_details.bank_name + "</center>",
        buttons: [{
                text: '<i class="f7-icons">delete_left_fill</i>',
                onClick: () => {

                    app.notification.create({
                        icon: '<i class="f7-icons">exclamationmark_bubble_fill</i>',
                        title: 'MY BANK Message.',
                        titleRightText: 'now',
                        subtitle: '',
                        text: 'You must choose a bank to continue!',
                        closeOnClick: true,
                        closeTimeout: 4000,
                    }).open();

                },
                close: true,

            },
            {
                text: '<b><i class="f7-icons">square_arrow_right_fill</i></b>',
                onClick: () => {
                    app.notification.close();
                    app.preloader.show("#6236FF");
                    // open popup
                    var swipeToClosePopup = app.popup.create({
                        el: '.bank_pin',
                        swipeToClose: true,
                    });


                    // show bank details data

                    var country_d = JSON.parse(localStorage.getItem("selected_country"));

                    var template = ` <div class="col-12 mb-2">
                    <div class="bill-box bank_entry">
                    
                        <form style="margin-top:-10px;" id="confirm_bank_info" autocomplete="off">

                            <div class="row">
                                <div class="col-20">
                                    <i style="margin-top:25px;"
                                        class="f7-icons">phone_circle_fill</i>
                                </div>

                                <div class="col-80">
                                    <div class="form-group basic animated">
                                        <div class="input-wrapper">
                                            <div class="row">
                                                <div class="col-30">
                                                    <input type="text" style="margin-right:-15px !important;" class="form-control" name="country_code" readonly value="${country_d.country_code}">
                                                </div>
                                                <div class="col-70">
                                                    <input onclick="show_infor()" type="tel" style="margin-left:-20px;" class="form-control" name="phone_number"
                                                    placeholder="Phone Number" maxlength="10">
                                                    <span class="input-clear-button"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div class="row">
                                <div class="col-20">
                                    <i style="margin-top:25px;"
                                        class="f7-icons">lock_circle_fill</i>
                                </div>

                                <div class="col-80">
                                    <div class="form-group basic animated">
                                        <div class="input-wrapper">
                                            <input type="number" class="form-control"  pattern="[0-9]{4}"  maxlength="4" id="smscode" name="new_app_pin" placeholder="New PIN (4 Digits)">
                                            <span class="input-clear-button"></span>
                                        </div>
                                    </div>
                                </div>

                                <textarea style="display:none;" name="selected_bank_data">${JSON.stringify(bank_details)}</textarea>
                                <textarea style="display:none;" name="selected_country_data">${JSON.stringify(country_d)}</textarea>

                                <div class="col-20">
                                    <i style="margin-top:25px;"
                                        class="f7-icons">lock_circle_fill</i>
                                </div>

                                <div class="col-80">
                                    <div class="form-group basic animated">
                                        <div class="input-wrapper">
                                            <input type="number" class="form-control" name="confirm_new_app_pin"
                                                placeholder="Confirm Above PIN" pattern="[0-9]{4}"  maxlength="4" id="smscode">
                                            <span class="input-clear-button"></span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <br>

                            <a href="#"  onclick="submit_bank_info()" style="font-size:15px; border:1px solid; padding: 5px;border-radius: 5px;">Register
                                    <i style="font-size:15px; color:green;" class="f7-icons">checkmark_seal_fill</i>
                                </a>

                        </form>
                    </div>
                </div>`;

                    $$('#show_title').html("Confirm Your <b>" + bank_details.bank_name + "</b> Account");
                    $$('.show_countries').html(template);

                    // show popup
                    // swipeToClosePopup.open();
                    app.preloader.hide();
                }
            }
        ],
        verticalButtons: false,
    }).open();

}

function show_infor() {
    var bank_details = app.form.convertToData('#confirm_bank_info');
    var bank_name = JSON.parse(bank_details.selected_bank_data);

    app.notification.create({
        icon: '<i class="f7-icons">exclamationmark_bubble_fill</i>',
        title: 'MY BANK Message.',
        titleRightText: 'now',
        subtitle: '',
        text: 'Enter Number You Registered for Mobile Banking With ' + bank_name.bank_name,
        closeTimeout: 9000,
    }).open();

}

// submit bank info
function submit_bank_info() {
    var bank_details = app.form.convertToData('#confirm_bank_info');

    var phone_number = bank_details.phone_number;
    var new_app_pin = bank_details.new_app_pin;
    var confirm_new_app_pin = bank_details.confirm_new_app_pin;

    if (phone_number == "") {

        app.notification.create({
            icon: '<i class="f7-icons">exclamationmark_bubble_fill</i>',
            title: 'Empty Field.',
            titleRightText: 'now',
            subtitle: '',
            text: 'Phone Number Is Required!',
            closeTimeout: 9000,
        }).open();
    }
    else if (!Number.isSafeInteger(parseInt(phone_number))) {

        app.notification.create({
            icon: '<i class="f7-icons">exclamationmark_bubble_fill</i>',
            title: 'Invalid Phone.',
            titleRightText: 'now',
            subtitle: '',
            text: 'Enter a valid Phone Number (Only Numbers)!',
            closeTimeout: 9000,
        }).open();
    } else if (phone_number.length < 9) {

        app.notification.create({
            icon: '<i class="f7-icons">exclamationmark_bubble_fill</i>',
            title: 'Invalid Phone Length',
            titleRightText: 'now',
            subtitle: '',
            text: 'Enter a valid phone number (9 digits)!',
            closeTimeout: 9000,
        }).open();
    } else if (phone_number.length > 9) {

        app.notification.create({
            icon: '<i class="f7-icons">exclamationmark_bubble_fill</i>',
            title: 'Invalid Phone Length',
            titleRightText: 'now',
            subtitle: '',
            text: 'Enter a valid phone number!',
            closeTimeout: 9000,
        }).open();
    } else if (new_app_pin == "") {

        app.notification.create({
            icon: '<i class="f7-icons">exclamationmark_bubble_fill</i>',
            title: 'Empty Field.',
            titleRightText: 'now',
            subtitle: '',
            text: 'Set Your App PIN please!',
            closeTimeout: 9000,
        }).open();
    } else if (new_app_pin.length < 4) {
        app.notification.create({
            icon: '<i class="f7-icons">exclamationmark_bubble_fill</i>',
            title: 'Invalid PIN length',
            titleRightText: 'now',
            subtitle: '',
            text: 'PIN Length must be 4!',
            closeTimeout: 9000,
        }).open();
    } else if (new_app_pin.length > 4) {
        app.notification.create({
            icon: '<i class="f7-icons">exclamationmark_bubble_fill</i>',
            title: 'Invalid PIN length',
            titleRightText: 'now',
            subtitle: '',
            text: 'PIN Length must be exactly 4!',
            closeTimeout: 9000,
        }).open();
    } else if (new_app_pin != confirm_new_app_pin) {

        app.notification.create({
            icon: '<i class="f7-icons">exclamationmark_bubble_fill</i>',
            title: 'PIN Miss match',
            titleRightText: 'now',
            subtitle: '',
            text: 'PINs donot match! Enter the exact APP PINs please.',
            closeTimeout: 9000,
        }).open();
    } else {
        console.log("Bank Data", bank_details);


    }


}