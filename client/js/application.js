;(function (namespace) {
    'use strict';
    let loader = (function () {
        let instance;

        class TemplateLoader {
            constructor() {
                this.templates = {};
            }

            get(key) {
                return new Promise((resolve) => {
                    if (!this.templates[key]) {
                        return $.get(`template/${key}.handlebars`, (template) => {
                            this.templates[key] = Handlebars.compile(template);
                            resolve(this.templates[key]);
                        });
                    }
                    resolve(this.templates[key]);
                });
            }
        }

        return {
            getInstance: function () {
                if (!instance) {
                    instance = new TemplateLoader()
                }
                return instance;
            }
        };
    }());

    namespace.loader = loader.getInstance();
})(window.templates = window.templates || {});


$(window).ready(() => {
    window.templates.loader.get("header")
        .then((template) => {
            $('header').html(template({}));
        });
});
