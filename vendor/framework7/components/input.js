(function framework7ComponentLoader(t,e){void 0===e&&(e=!0);var a=document,i=window,n=t.$,r=(t.Template7,t.utils),s=t.device,l=(t.support,t.Class,t.Modal,t.ConstructorMethods,t.ModalMethods,{ignoreTypes:["checkbox","button","submit","range","radio","image"],createTextareaResizableShadow:function(){var t=n(a.createElement("textarea"));t.addClass("textarea-resizable-shadow"),t.prop({disabled:!0,readonly:!0}),l.textareaResizableShadow=t},textareaResizableShadow:void 0,resizeTextarea:function(t){var e=n(t);l.textareaResizableShadow||l.createTextareaResizableShadow();var a=l.textareaResizableShadow;if(e.length&&e.hasClass("resizable")){0===l.textareaResizableShadow.parents().length&&this.root.append(a);var r=i.getComputedStyle(e[0]);"padding-top padding-bottom padding-left padding-right margin-left margin-right margin-top margin-bottom width font-size font-family font-style font-weight line-height font-variant text-transform letter-spacing border box-sizing display".split(" ").forEach((function(t){var e=r[t];"font-size line-height letter-spacing width".split(" ").indexOf(t)>=0&&(e=e.replace(",",".")),a.css(t,e)}));var s=e[0].clientHeight;a.val("");var o=a[0].scrollHeight;a.val(e.val()),a.css("height",0);var u=a[0].scrollHeight;s!==u&&(u>o?e.css("height",u+"px"):u<s&&e.css("height",""),(u>o||u<s)&&(e.trigger("textarea:resize",{initialHeight:o,currentHeight:s,scrollHeight:u}),this.emit("textareaResize",{initialHeight:o,currentHeight:s,scrollHeight:u})))}},validate:function(t){var e=n(t);if(!e.length)return!0;var a=e.parents(".item-input"),i=e.parents(".input");function r(){e[0].f7ValidateReadonly&&(e[0].readOnly=!0)}e[0].f7ValidateReadonly&&(e[0].readOnly=!1);var s=e[0].validity,l=e.dataset().errorMessage||e[0].validationMessage||"";if(!s)return r(),!0;if(!s.valid){var o=e.nextAll(".item-input-error-message, .input-error-message");return l&&(0===o.length&&(o=n('<div class="'+(i.length?"input-error-message":"item-input-error-message")+'"></div>')).insertAfter(e),o.text(l)),o.length>0&&(a.addClass("item-input-with-error-message"),i.addClass("input-with-error-message")),a.addClass("item-input-invalid"),i.addClass("input-invalid"),e.addClass("input-invalid"),r(),!1}return a.removeClass("item-input-invalid item-input-with-error-message"),i.removeClass("input-invalid input-with-error-message"),e.removeClass("input-invalid"),r(),!0},validateInputs:function(t){var e=this;return n(t).find("input, textarea, select").toArray().map((function(t){return e.input.validate(t)})).indexOf(!1)<0},focus:function(t){var e=n(t),a=e.attr("type");l.ignoreTypes.indexOf(a)>=0||(e.parents(".item-input").addClass("item-input-focused"),e.parents(".input").addClass("input-focused"),e.addClass("input-focused"))},blur:function(t){var e=n(t);e.parents(".item-input").removeClass("item-input-focused"),e.parents(".input").removeClass("input-focused"),e.removeClass("input-focused")},checkEmptyState:function(t){var e=n(t);if(e.is("input, select, textarea, .item-input [contenteditable]")||(e=e.find("input, select, textarea, .item-input [contenteditable]").eq(0)),e.length){var a;a=e[0].hasAttribute("contenteditable")?e.find(".text-editor-placeholder").length?"":e.html():e.val();var i=e.parents(".item-input"),r=e.parents(".input");a&&"string"==typeof a&&""!==a.trim()||Array.isArray(a)&&a.length>0?(i.addClass("item-input-with-value"),r.addClass("input-with-value"),e.addClass("input-with-value"),e.trigger("input:notempty"),this.emit("inputNotEmpty",e[0])):(i.removeClass("item-input-with-value"),r.removeClass("input-with-value"),e.removeClass("input-with-value"),e.trigger("input:empty"),this.emit("inputEmpty",e[0]))}},scrollIntoView:function(t,e,a,i){void 0===e&&(e=0);var r=n(t),s=r.parents(".page-content, .panel, .card-expandable .card-content").eq(0);if(!s.length)return!1;var l=s[0].offsetHeight,o=s[0].scrollTop,u=parseInt(s.css("padding-top"),10),p=parseInt(s.css("padding-bottom"),10),d=s.offset().top-o,c=r.offset().top-d,h=c+o-u,f=c+o-l+p+r[0].offsetHeight,v=h+(f-h)/2;return o>h?(s.scrollTop(a?v:h,e),!0):o<f?(s.scrollTop(a?v:f,e),!0):(i&&s.scrollTop(a?v:f,e),!1)},init:function(){var t=this;l.createTextareaResizableShadow(),n(a).on("click",".input-clear-button",(function(){var e=n(this).siblings("input, textarea").eq(0),a=e.val();e.val("").trigger("input change").focus().trigger("input:clear",a),t.emit("inputClear",a)})),n(a).on("mousedown",".input-clear-button",(function(t){t.preventDefault()})),n(a).on("change input","input, textarea, select, .item-input [contenteditable]",(function(){var e=n(this),a=e.attr("type"),i=e[0].nodeName.toLowerCase(),r=e[0].hasAttribute("contenteditable");l.ignoreTypes.indexOf(a)>=0||(t.input.checkEmptyState(e),r||(null!==e.attr("data-validate-on-blur")||!e.dataset().validate&&null===e.attr("validate")||t.input.validate(e),"textarea"===i&&e.hasClass("resizable")&&t.input.resizeTextarea(e)))}),!0),n(a).on("focus","input, textarea, select, .item-input [contenteditable]",(function(){var e=this;t.params.input.scrollIntoViewOnFocus&&(s.android?n(i).once("resize",(function(){a&&a.activeElement===e&&t.input.scrollIntoView(e,t.params.input.scrollIntoViewDuration,t.params.input.scrollIntoViewCentered,t.params.input.scrollIntoViewAlways)})):t.input.scrollIntoView(e,t.params.input.scrollIntoViewDuration,t.params.input.scrollIntoViewCentered,t.params.input.scrollIntoViewAlways)),t.input.focus(e)}),!0),n(a).on("blur","input, textarea, select, .item-input [contenteditable]",(function(){var e=n(this),a=e[0].nodeName.toLowerCase();t.input.blur(e),(e.dataset().validate||null!==e.attr("validate")||null!==e.attr("data-validate-on-blur"))&&t.input.validate(e),"textarea"===a&&e.hasClass("resizable")&&l.textareaResizableShadow&&l.textareaResizableShadow.remove()}),!0),n(a).on("invalid","input, textarea, select",(function(e){var a=n(this);null!==a.attr("data-validate-on-blur")||!a.dataset().validate&&null===a.attr("validate")||(e.preventDefault(),t.input.validate(a))}),!0)}}),o={name:"input",params:{input:{scrollIntoViewOnFocus:s.android,scrollIntoViewCentered:!1,scrollIntoViewDuration:0,scrollIntoViewAlways:!1}},create:function(){r.extend(this,{input:{scrollIntoView:l.scrollIntoView.bind(this),focus:l.focus.bind(this),blur:l.blur.bind(this),validate:l.validate.bind(this),validateInputs:l.validateInputs.bind(this),checkEmptyState:l.checkEmptyState.bind(this),resizeTextarea:l.resizeTextarea.bind(this),init:l.init.bind(this)}})},on:{init:function(){this.input.init()},tabMounted:function(t){var e=this,a=n(t);a.find(".item-input, .input").each((function(t,a){n(a).find("input, select, textarea, [contenteditable]").each((function(t,a){var i=n(a);l.ignoreTypes.indexOf(i.attr("type"))>=0||e.input.checkEmptyState(i)}))})),a.find("textarea.resizable").each((function(t,a){e.input.resizeTextarea(a)}))},pageInit:function(t){var e=this,a=t.$el;a.find(".item-input, .input").each((function(t,a){n(a).find("input, select, textarea, [contenteditable]").each((function(t,a){var i=n(a);l.ignoreTypes.indexOf(i.attr("type"))>=0||e.input.checkEmptyState(i)}))})),a.find("textarea.resizable").each((function(t,a){e.input.resizeTextarea(a)}))},"panelBreakpoint panelCollapsedBreakpoint panelResize panelOpen panelSwipeOpen resize viewMasterDetailBreakpoint":function(t){var e=this;t&&t.$el?t.$el.find("textarea.resizable").each((function(t,a){e.input.resizeTextarea(a)})):n("textarea.resizable").each((function(t,a){e.input.resizeTextarea(a)}))}}};if(e){if(t.prototype.modules&&t.prototype.modules[o.name])return;t.use(o),t.instance&&(t.instance.useModuleParams(o,t.instance.params),t.instance.useModule(o))}return o}(Framework7, typeof Framework7AutoInstallComponent === 'undefined' ? undefined : Framework7AutoInstallComponent))
