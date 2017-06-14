;(function (namespace) {
    'use strict';

    class ApplicationController {
        constructor() {
            this.routings = [
                {
                    hash: "#edit",
                    controller: new FormController()
                }, {
                    hash: "#create",
                    controller: new FormController()
                }, {
                    hash: "#save",
                    controller: new SaveController()
                }, {
                    hash: "",
                    controller: new ListController()
                }
            ];
        }

        render() {
            let hash = location.hash;
            let config = this.routings.find((config) => {
                return config.hash === hash;
            });
            if(config.controller instanceof BaseController) {
                config.controller.updateHeaderConfig();
                window.templates.loader.get("header", window.model.model.getHeaderConfig())
                    .then((template) => {
                        $('header').html(template);
                        $("header button").click(function (event) {
                            location.hash = event.target.getAttribute("data-hash");
                        });

                        $("header select").change(function (event) {
                            console.log('Change CSS');
                        });
                    });

                config.controller.getRenderedTemplate()
                    .then((template) => {
                        $('main').html(template);
                    });
            } else if(config.controller instanceof ActionController) {
                config.controller.execute();
            }
        }
    }

    class BaseController {
        constructor(template) {
            this.template = template;
        }

        getRenderedTemplate() {
            return window.templates.loader.get(this.template, this.getModel());
        }

        updateHeaderConfig() {
            window.model.model.updateHeaderConfig(this.getHeaderConfig());
        }

        getModel() {
            return {};
        }

        getHeaderConfig() {
            return {};
        }
    }

    class FormController extends BaseController {
        constructor() {
            super("form");
        }

        getHeaderConfig() {
            return {
                saveAvailable: true,
                cancelAvailable: true
            };
        }
    }

    class ListController extends BaseController {
        constructor() {
            super("edit");
        }

        getModel() {
            return window.model.model.getNotes();
        }

        getHeaderConfig() {
            return {
                createAvailable: true
            };
        }
    }

    class ActionController {
        execute() {
            // Default
        }

        redirect(hash) {
            location.hash = hash;
        }
    }

    class SaveController extends ActionController {
        execute() {
            // TODO: Notiz speichern
            this.redirect("");
        }
    }

    namespace.controller = new ApplicationController();
})(window.app = window.app || {});