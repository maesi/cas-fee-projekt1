const express = require('express');

const router = express.Router();
const storage = require('../service/storage');

let callbackFactory = (response) => {
    return (err, notes) => {
        response.json(notes);
    };
};

router.get("/notes", function (req, res) {
    storage.getAll(callbackFactory(res));
});
router.post("/notes", function (req, res) {
   storage.create(req.body, callbackFactory(res))
});
router.put("/notes/:id", function (req, res) {
    storage.update(req.params.id, req.body, callbackFactory(res))
});
router.get("/notes/:id", function (req, res) {
    storage.getById(req.params.id, callbackFactory(res))
});
module.exports = router;
