;(function (namespace) {
    'use strict';
    let loader = (function () {
        let instance;

        class TemplateLoader {
            constructor() {
                this.templates = {};
            }

            get(key, valueOrPromise) {
                return new Promise((resolve) => {
                    if (this.templates[key]) {
                        resolve();
                    }
                    else {
                        $.get(`template/${key}.handlebars`, (template) => {
                            this.templates[key] = Handlebars.compile(template);
                            resolve();
                        });
                    }
                }).then(() => {
                    let promise = valueOrPromise && typeof valueOrPromise.then === 'Function' ? valueOrPromise : new Promise((resolve) => {
                        resolve(valueOrPromise);
                    });
                    return promise.then((model) => {
                        return this.templates[key](model);
                    });
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