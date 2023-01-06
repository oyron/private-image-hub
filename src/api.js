module.exports = function(version) {
    const express = require('express');
    const router = express.Router();

    router.get('/version', getVersion);

    function getVersion(_req, res) {
        res.send({version})
    }

    return router;
}

