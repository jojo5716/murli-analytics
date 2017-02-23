const pageService = require('../services/pageService');


function pageController() {

    this.getAllData = (req, res) => {
        pageService.getAll((err, users) => {
            if (err) {
                console.log(err);
                res.send({ error: err });
            } else {
                res.send({ users });
            }
        });
    };
    return this;
}

module.exports = new pageController();
