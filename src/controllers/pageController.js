const pageService = require('../services/pageService');


function pageController() {

    this.getAllData = (req, res) => {
        pageService.getAll((err, pages) => {
            if (err) {
                console.log(err);
                res.send({ error: err });
            } else {
                res.json({ pages });
            }
        });
    };
    return this;
}

module.exports = new pageController();
