const User = require('../models/user')
const Card = require('../models/card')

module.exports = (app) => {
    app.get('/set/:name', async (req, res) => {
    const search = await Card.find({ "sets.set_name": req.params.name })
    .then(async (cards) => {
        console.log(cards)
        res.send(cards)
        })
    .catch(err => {
        res.send(err)
        })
    })

    app.get('/uniques', async (req, res) => {
        var uniques = await Card.distinct( "sets.set_name", function(error, names) {
            if (error) {
                console.log(err)
            } else {
                console.log(names)
                res.render('index')
            }
        }).clone();
    })
    app.get('/api/getDeck', async function (req, res) {
    try {
        var uniques = Card.distinct( "sets.set_name", function(error, names)
        return res.send(allApprovedPublicDecks);
    } catch (err) {
        console.error(err);
        return res
        .status(500)
        .send(
            'Error: There was an issue retrieving  decks...',
            err.message
        );
    }
    });
}
