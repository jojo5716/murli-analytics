

const userService = require('../services/userService');


function userController() {



    this.getAll = (req, res) => {
        userService.getAll((err, users) => {
            if (err) {
                console.log(err);
                res.send({ error: err });
            } else {
                res.json({ users });
            }
        });
    };
    return this;
}

module.exports = new userController();
