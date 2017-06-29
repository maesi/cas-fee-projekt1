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
            return momentjs(this.faelligkeit).fromNow();
        }

        erledigtFormatiert() {
            return this.erledigt ? `[${momentjs(this.erledigt).fromNow()}]` : '';
        }
    }
    ;


    class ListModel {
        constructor() {
            this.sort = "wichtigkeit";
            this.exclude = "erledigt";
        }

        getSort() {
            return this.sort;
        }

        setSort(sort) {
            this.sort = sort;
        }

        getExclude() {
            return this.exclude;
        }

        setExclude(exclude) {
            this.exclude = exclude;
        }
    }

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
                        }, {
                            label: 'Panda',
                            value: 'panda',
                            selected: true
                        }
                    ]
                };
            }

            getNotes() {
                return rest.getAll().then((notes) => {
                    return notes
                        .map((note) => Object.assign(new Note, note))
                        .filter((note) => {
                            let exlude = namespace.list.getExclude();
                            if(exlude) {
                                return !note[exlude];
                            }
                            return true;
                        });
                })
                    .then((notes) => {
                        let _getComparable = (o) => {
                            let value = o[namespace.list.getSort()] || -Infinity;
                            if(isNaN(value)) {
                                return momentjs(value).format('YYYYMMDD');
                            }
                            return value * -1;
                        };
                        notes.sort((a, b) => {
                            return _getComparable(a) - _getComparable(b);
                        });
                        return notes;
                    });
            }

            createNote(titel, beschreibung, wichtigkeit, faelligkeit) {
                rest.create(new Note(titel, beschreibung, wichtigkeit, faelligkeit));
            }

            updateNote(id, titel, beschreibung, wichtigkeit, faelligkeit) {
                let note = new Note(titel, beschreibung, wichtigkeit, faelligkeit);
                note._id = id;
                this.update(note);
            }

            update(note) {
                rest.update(note._id, note);
            }

            getNote(id) {
                return rest.getById(id)
                    .then((note) => {
                        return Object.assign(new Note, note);
                    });
            }

            setFinished(id, finished) {
                return this.getNote(id)
                    .then((note) => {
                        note.erledigt = finished ? momentjs().format('YYYY-MM-DD') : undefined;
                        return this.update(note);
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
    namespace.list = new ListModel();
})(window.model = window.model || {}, window.service.rest, window.moment);