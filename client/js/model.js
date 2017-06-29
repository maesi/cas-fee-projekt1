;(function (namespace, rest, momentjs) {
    'use strict';

    class Note {
        constructor(title, description, importance, duedate) {
            this.titel = title || "Default Titel";
            this.beschreibung = description;
            this.wichtigkeit = importance || 1;
            this.faelligkeit = duedate || momentjs().add(7, 'days').format('YYYY-MM-DD');
            this.erstellt = momentjs().format('YYYY-MM-DD');
        }

        faelligkeitFormatiert() {
            return momentjs(this.faelligkeit).format('DD.MM.YYYY');
        }
    };

    let model = (function () {
        let instance;

        class Model {
            constructor() {
                this.headerConfig = {
                    actions: {
                        createAvailable: true
                    },
                    style: [
                        {
                            label: 'Löwe',
                            value: 'lion'
                        },
                        {
                            label: 'Panda',
                            value: 'panda',
                            selected: true
                        }
                    ]
                };
            }

            getNotes() {
                return rest.getAll().then((notes) => {
                    return notes.map((note) => Object.assign(new Note, note));
                });
            }

            createNote(titel, beschreibung, wichtigkeit, faelligkeit) {
                rest.create(new Note(titel, beschreibung, wichtigkeit, faelligkeit));
            }

            updateNote(id, titel, beschreibung, wichtigkeit, faelligkeit) {
                rest.update(id, new Note(titel, beschreibung, wichtigkeit, faelligkeit));
            }

            getNote(id) {
                return rest.getById(id)
                    .then((note) => {
                        return Object.assign(new Note, note);
                    });
            }

            getEmptyNote() {
                return new Note();
            }

            getHeaderConfig() {
                return this.headerConfig;
            }

            updateActionConfig(config) {
                this.headerConfig.actions = config;
            }

            setActiveStyle(value) {
                this.headerConfig.style.forEach((style) => {
                    style.selected = style.value === value;
                })
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
})(window.model = window.model || {}, window.service.rest, window.moment);