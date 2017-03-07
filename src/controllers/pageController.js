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

        pageService.getBySession(data.data.sessionTemp, (err, page) => {
            if (err || !page) {
                res.json({ success: false, error: err });
            } else {

                const currentPage = page.pages.map((pag) => {
                    if (pag.pageToken === data.data.pageToken) {
                        return pag;
                    }
                });

                if (currentPage && currentPage.length === 1) {
                    currentPage[0].actions.push(data.data.actions);

                    const promise = page.save();

                    promise.then((actions) => {
                        console.log("Saved");
                        console.log(actions);
                    });

                    res.json({ success: true });
                }
            }
        });
    };

    return this;
}

module.exports = new pageController();
