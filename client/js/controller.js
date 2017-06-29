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
                config.controller.updateActionConfig();
                window.templates.loader.get("header", window.model.model.getHeaderConfig())
                    .then((template) => {
                        $('header').html(template);
                        $("header button").click(function (event) {
                            location.hash = event.target.getAttribute("data-hash");
                        });

                        let setStyle = () => {
                            if($("header select").val() === 'lion') {
                                if(!$("link[href='css/lion.css']")[0]) {
                                    $('head').append('<link rel="stylesheet" href="css/lion.css" type="text/css" />');
                                }
                            } else {
                                if($("link[href='css/lion.css']")[0]) {
                                    $("link[href='css/lion.css']")[0].remove();
                                }
                            }
                        };

                        $("header select").change(function () {
                            window.model.model.setActiveStyle($("header select").val());
                            setStyle();
                        });

                        setStyle();
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

        updateActionConfig() {
            window.model.model.updateActionConfig(this.getActionConfig());
        }

        getModel() {
            return {};
        }

        getActionConfig() {
            return {};
        }
    }

    class FormController extends BaseController {
        constructor() {
            super("form");
        }

        getActionConfig() {
            return {
                saveAvailable: true,
                cancelAvailable: true
            };
        }
    }

    class ListController extends BaseController {
        constructor() {
            super("list");
        }

        getModel() {
            return window.model.model.getNotes();
        }

        getActionConfig() {
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
            let note = new window.model.Note($('#title').val(), $('#description').val(), $('#importance').val(), $('#duedate').val());
            window.model.model.addNote(note);

            $('');

            this.redirect("");
        }
    }

    namespace.controller = new ApplicationController();
})(window.app = window.app || {});