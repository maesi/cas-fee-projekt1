;(function (namespace, model, templates) {
    'use strict';

    class ApplicationController {
        constructor() {
            this.routings = [
                {
                    regex: /#edit\/\w{16}/i,
                    controller: new FormController()
                }, {
                    regex: /#create/i,
                    controller: new FormController()
                }, {
                    regex: /#save/i,
                    controller: new SaveController()
                }, {
                    regex: /\s*/i,
                    controller: new ListController()
                }
            ];
        }

        render() {
            let hash = location.hash;
            let config = this.routings.find((config) => {
                return config.regex.test(hash);
            });
            if(config.controller instanceof BaseController) {
                config.controller.updateActionConfig();
                templates.loader.get("header", model.getHeaderConfig())
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
                            model.setActiveStyle($("header select").val());
                            setStyle();
                        });

                        setStyle();
                    });

                config.controller.setContent();
            } else if(config.controller instanceof ActionController) {
                config.controller.execute();
            }
        }
    }

    class BaseController {
        constructor(template) {
            this.template = template;
        }

        setContent() {
            window.templates.loader.get(this.template, this.getModel())
                .then((template) => {
                    $('main').html(template);
                    this.addListener();
                });
        }

        getRenderedTemplate() {
            return templates.loader.get(this.template, this.getModel());
        }

        updateActionConfig() {
            model.updateActionConfig(this.getActionConfig());
        }

        getModel() {
            return {};
        }

        getActionConfig() {
            return {};
        }

        addListener() {}
    }

    class FormController extends BaseController {
        constructor() {
            super("form");
        }

        getModel() {
            let id = /\w{16}/i.exec(location.hash);
            if(id) {
                return model.getNote(id);
            } else {
                return {};
            }
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
            return model.getNotes();
        }

        getActionConfig() {
            return {
                createAvailable: true
            };
        }

        addListener() {
            $("main button").click(function (event) {
                location.hash = '#edit/' + event.target.getAttribute("data-id");
            });
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
            if($('#id').val()) {
                model.updateNote($('#id').val(), $('#title').val(), $('#description').val(), $('#importance').val(), $('#duedate').val());
            } else {
                model.createNote($('#title').val(), $('#description').val(), $('#importance').val(), $('#duedate').val());
            }
            this.redirect("");
        }
    }

    namespace.controller = new ApplicationController();
})(window.app = window.app || {}, window.model.model, window.templates);