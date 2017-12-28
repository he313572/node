var request = require('request');
exports.getBaisiList = (req, res) => {
    console.log(req.query);
    let type = req.query.type || 29;
    let page = req.query.page || 1;
    let maxtime = req.params.maxtime || 0;
    let options = {
        headers: {
            "Connection": "close"
        },
        url: 'http://api.budejie.com/api/api_open.php?a=list&c=data&page=' + page + '&type=' + type + '&maxtime=' + maxtime,
        method: 'GET',
        json: true
    };
    request(options, (error, response, data) => {
        if (!error && response.statusCode == 200) {
            console.log(data.info.maxtime);
            res.json(data)
        }
    })
}