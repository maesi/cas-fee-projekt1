;(function (namespace, rest) {
    'use strict';

    class Note {
        constructor(title, description, importance, duedate) {
            this.titel = title || "Ohne Titel";
            this.beschreibung = description;
            this.wichtigkeit = importance || 1;
            this.faelligkeit = duedate || "2017-08-01"; // TODO: moment.js einbinden
        }
    };

    let model = (function () {
        let instance;

        class Model {
            constructor() {
                this.model = {
                    headerConfig: {
                        createAvailable: true,
                        style: 'lion'
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
                return rest.getAll();
            }

            addNote(note) {
                rest.create(note);
            }

            getHeaderConfig() {
                return this.model.headerConfig;
            }

            updateHeaderConfig(newValue) {
                let style = newValue.style || this.model.style;
                this.model.headerConfig = newValue;
                this.model.style = style;
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
    namespace.Note = Note;
})(window.model = window.model || {}, window.service.rest);