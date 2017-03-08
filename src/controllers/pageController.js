const pageService = require('../services/pageService');


function pageController() {

    this.getAllData = (req, res) => {
        pageService.getAll((err, pages) => {
            if (err) {
                console.log(err);
                res.json({ error: err });
            } else {
                res.json({ pages });
            }
        });
    };

    this.saveAction = (req, res) => {
        const data = JSON.parse(req.body);

        pageService.getByToken(data.data.pageToken, (error, page) => {
            if (error || !page) {
                res.json({ error });
            } else {
                for (let i = 0; i < data.data.actions.length; i += 1) {
                    page.actions.push(data.data.actions[i]);
                }
                page.save(() => {});
                res.json({ success: true });
            }
        });
    };

    return this;
}

module.exports = new pageController();
