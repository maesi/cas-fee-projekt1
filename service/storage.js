const Datastore = require('nedb');
const db = new Datastore({
    filename: './data/note.db',
    autoload: true
});
const moment = require('moment');

let callbackFactory = (callback) => {
    return (err, res) => {
        if (callback) {
            callback(err, res);

        }
    };
};

function create(note, callback) {
    db.insert(note, callbackFactory(callback));
}

function update(id, note, callback) {
    db.update({ _id: id }, note, callbackFactory(callback));
}

function getAll(callback) {
    db.find({}, callbackFactory(callback));
}

function getById(id, callback) {
    db.findOne({ _id: id }, callbackFactory(callback));
}

module.exports = {
    create: create,
    update: update,
    getAll: getAll,
    getById: getById
};
