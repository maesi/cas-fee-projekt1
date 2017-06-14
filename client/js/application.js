;(function (namespace) {
    'use strict';
    let loader = (function () {
        let instance;

        class TemplateLoader {
            constructor() {
                this.templates = {};
            }

            get(key, model) {
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
                }).then((resolve) => {
                    return this.templates[key](model);
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

;(function (namespace) {
    'use strict';

    let model = (function () {
        let instance;

        class Model {
            constructor() {
                this.model = {
                    headerConfig: {
                        createAvailable: true
                    },
                    notes: [
                        {
                            titel: "Note Pro App",
                            beschreibung: "Das Projekt 1 fürs CAS FEE erstellen",
                            wichtigkeit: 5,
                            erstellt: "2017-06-01",
                            faelligkeit: "2017-07-02",
                            erledigt: null
                        }, {
                            titel: "Sponsoren CRM",
                            beschreibung: "CRM für Raphi",
                            wichtigkeit: 4,
                            erstellt: "2017-06-01",
                            faelligkeit: "2017-06-20",
                            erledigt: null
                        }
                    ]
                };
            }

            getNotes() {
                return this.model.notes;
            }

            getHeaderConfig() {
                return this.model.headerConfig;
            }
        }

        return {
            getInstance: function () {
                if (!instance) {
                    instance = new Model()
                }
                return instance;
            }
        };
    }());

    namespace.model = model.getInstance();
})(window.model = window.model || {});


$(window).ready(() => {
    window.templates.loader.get("header", window.model.model.getHeaderConfig())
        .then((template) => {
            $('header').html(template);
        });
    window.templates.loader.get("edit", window.model.model.getNotes())
        .then((template) => {
            $('main').html(template);
        });
});
