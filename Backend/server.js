const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const getCode = require('./getCode');
const account = require('./manageAccount');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));


app.post('/execute-code', async (req, res) => {
    const userCode = req.body.text;

    getCode.getCode(userCode)
    .then(function (response) {
        const body = JSON.parse(JSON.stringify(response));
        res.json(body);
    })
    .catch(function (error) {
        const body = JSON.parse(JSON.stringify(error));
        res.json(body);
    });
});


app.post('/get-exercise', (req, res) => {

    getCode.getExercise(req.body.id)
    .then(results => {
        const body = JSON.parse(JSON.stringify(results));
        res.json(body);
    })
    .catch(error => {
        res.json(error);
    });
});

app.get('/get-exercise-amount', (req, res) => {

    getCode.getAmountOfExercises()
    .then(results => {
        console.log("HALLLOOOO: " + results);
        res.json(results);
    })
    .catch(error => {
        res.json(error);
    });
});


app.post('/get-tests', (req, res) => {
    getCode.getTests(req.body.id)
    .then(results => {
        const body = JSON.parse(JSON.stringify(results));
        res.json(body);
    })
    .catch(error => {
        res.json(error);
    });
});


app.post('/signup', (req, res) => {
    account.createAccount(req.body)
    .then(results => {
        res.json({"success": true, "user": results});
    })
    .catch(error => {
        const body = String(error);
        res.json({"success": false, "message": body});
    });
});


app.post('/login', async (req, res) => {
    account.login(req.body)
    .then(results => {
        res.json({"success": true, "user": results});
    })
    .catch(error => {
        const body = String(error);
        res.json({"success": false, "message": body});
    });
});

app.post('/store-completed-exercise', async (req, res) => {
    account.storeCompletedExercise(req.body.userId, req.body.exerciseId)
    .then(() => {
        res.json({"success": true});
    })
    .catch(error => {
        res.json({"success": false, "error": error});
    });
});

app.post('/get-completed-exercises', async (req, res) => {
    account.getCompletedExercises(req.body.userId)
    .then(response => {
        const body = response;
        res.json({"success": true, "exercises": body});
    })
    .catch(error => {
        res.json({"success": false, "error": error});
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {console.log("Server started on port " + port)});
