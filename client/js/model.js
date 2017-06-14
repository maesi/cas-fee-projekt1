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

            updateHeaderConfig(newValue) {
                this.model.headerConfig = newValue;
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