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
                                        <div class="item-media"><img
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
                buttons: [
                    {
                        text: 'Retry',
                        onClick: () => {
                            reload_app();
                        }
                    }
                ],
                verticalButtons: false,
            }).open();
            
        })


    console.log("Running on", app.device.os, "version", app.device.osVersion);
}

// reload app
function reload_app(){
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
                text: 'No',
                onClick: () => {
                    console.log("Clicked No")
                },
                close: true,

            },
            {
                text: 'Continue <i class="fas fa-arrow-alt-circle-right"></i>',
                onClick: () => {
                    console.log("Clicked Continue")
                    // open popup
                    var swipeToClosePopup = app.popup.create({
                        el: '.bank_pin',
                        swipeToClose: true,
                      });
                      swipeToClosePopup.open();
                }
            }
        ],
        verticalButtons: false,
    }).open();

}