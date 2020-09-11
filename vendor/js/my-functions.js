// get bank list from database
function get_bank_list_for_select() {

    app.request.promise.post(api_url + "get-bank-list.php", {
            api_key: api_key
        })
        .then((bank_list) => {

            if (bank_list.status === 200) {

                var data = JSON.parse(bank_list.data);

                // add bank list
                var items = [];
                data.forEach(bank => {
                    items.push({
                        id: bank.id,
                        logo: bank.logo,
                        title: bank.bank_name,
                        subtitle: 'Tap To Select <em>`' + bank.bank_name + "`</em>"
                    });
                });

                // create the real list
                var virtualList = app.virtualList.create({
                    // List Element
                    el: '.virtual-list',
                    // Pass array with items
                    items: items,
                    // Custom search function for searchbar
                    searchAll: function (query, items) {
                        var found = [];
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].title.toLowerCase().indexOf(query.toLowerCase()) >= 0 || query.trim() === '') found.push(i);
                        }
                        return found; //return array with mathced indexes
                    },
                    // List item Template7 template 
                    itemTemplate: `
                                <li>
                                    <a href="#" onclick="confirm_bank(this.id)" class="item-link item-content" id="{{id}}">
                                    <input type="hidden" name="bank_id" value="{{id}}">
                                    <input type="hidden" name="bank_name" value="{{title}}">
                                    <input type="hidden" name="bank_logo" value="${api_public}{{logo}}">
                                        <div class="item-media"><img class="image-block imaged"
                                                src="${api_public}{{logo}}"
                                                width="44" /></div>
                                        <div class="item-inner">
                                            <div class="item-title-row">
                                                <div class="item-title">{{title}}</div>
                                            </div>
                                            <div class="item-subtitle">{{subtitle}}</div>
                                        </div>
                                    </a>
                                </li>`,
                    // Item height
                    height: app.theme === 'ios' ? 71 : (app.theme === 'md' ? 73 : 46),
                });

                // stop loading
                app.preloader.hide();

            } else {
                console.log("Bank list", bank_list)
            }
        })
        .catch((err) => {
            app.preloader.hide();

            app.dialog.create({
                title: "CONNECTION ERROR",
                text: 'Server Connection Failed',
                buttons: [{
                    text: 'Retry',
                    onClick: () => {
                        reload_app();
                    }
                }],
                verticalButtons: false,
            }).open();

        })


    console.log("Running on", app.device.os, "version", app.device.osVersion);
}

// reload app
function reload_app() {
    // show app preloader
    app.preloader.show("#6236FF");
    get_bank_list_for_select();
}


// load bank data
function confirm_bank(bank_id) {
    var bank_details = app.form.convertToData('#' + bank_id);
    // console.log("Bank Data", bank_details);

    app.dialog.create({
        title: "<img src='" + bank_details.bank_logo + "' style='border-radius:100%; width=55px;'/><br/>" + bank_details.bank_name,
        text: 'Continue With Selected Bank?',
        buttons: [{
                text: '<i class="f7-icons">delete_left_fill</i>',
                onClick: () => {

                    app.notification.create({
                        icon: '<i class="f7-icons">exclamationmark_bubble_fill</i>',
                        title: 'Heads Up!',
                        titleRightText: 'now',
                        subtitle: '',
                        text: 'Choose a bank to continue!',
                        closeOnClick: true,
                        closeTimeout: 3000,
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

                    var template = ` <div class="col-12 mb-2">
                    <div class="bill-box">
                        <div class="img-wrapper">
                            <img src="${bank_details.bank_logo}" alt="img"
                                class="image-block imaged w100">
                        </div>
                        <div class="price">${bank_details.bank_name}</div>

                        <p>
                            Enter Phone Number And Bank Pin
                        </p>
                        <form style="margin-top:-20px;">

                            <div class="row">
                                <div class="col-20">
                                    <i style="margin-top:25px;"
                                        class="f7-icons">phone_circle_fill</i>
                                </div>

                                <div class="col-80">
                                    <div class="form-group basic animated">
                                        <div class="input-wrapper">
                                            <input type="tel" class="form-control"
                                                id="phone_number" name="phone_number"
                                                placeholder="Phone Number">
                                                <span class="input-clear-button"></span>
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
                                            <input type="password" class="form-control"
                                                id="bank_pin" name="bank_pin"
                                                placeholder="PIN">
                                            <span class="input-clear-button"></span>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </form>

                        <button type="button" class="btn btn-primary btn-sm mr-1 mb-1">
                            
                            LOGIN <i class="f7-icons">square_arrow_right</i>
                        </button>
                    </div>
                </div>`;


                    $$('.show_bank_info').html(template);

                    // show popup
                    swipeToClosePopup.open();
                    app.preloader.hide();
                }
            }
        ],
        verticalButtons: false,
    }).open();

}