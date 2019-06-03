const express = require('express');

const server = express();

//const router = express.Router();

server.use(express.json());

const AcctDB = require('./data/accounts-model.js');

server.get("/", (req, res) => {
    AcctDB.find()
    .then( response => {
        res.status(200).json(response)
    })
    .catch( error => {
        res.status(500).json(error)
    })
})

server.get("/:id", validateAccountId, (req, res) => {
    
        res.status(200).json(req.body.account)
    
})

server.post("/", validateAccount, (req, res) => {
    const newAcct = {name : req.body.name, budget : req.body.budget}
    AcctDB.add(newAcct)
    .then( response => {
        res.status(201).json(response)
    })
    .catch( error => {
        res.status(500).json(error)
    })
})

server.put("/:id",validateAccountId, validateAccount, (req, res) => {
    const updatedAcct = {name : req.body.name, budget : req.body.budget}
    AcctDB.update(req.params.id, updatedAcct)
    .then(response => {
        res.status(200).json(response)
    })
    .catch(error => {
        res.status(500).json(error)
    })
} )

server.delete("/:id", validateAccountId, (req, res) => {
    AcctDB.remove(req.params.id)
    .then(response => {
        res.status(200).json(response)
    })
    .catch(error => {
        res.status(500).json(error)
    })
})


//middleware
function validateAccountId(req, res, next) {
    AcctDB.findById(req.params.id)
    .then( account => {
        if(account) {
            req.body.account = account;
            next();
        } else {
            res.status(404).json({message : "Account not found"})
        }
    })
    .catch( error => {
        res.status(500).json({message : "error occured when accessing data"})
    })
}

function validateAccount(req, res, next) {
    if(req.body.name && req.body.budget) {
        next();
    } else {
        res.status(400).json({message : "Please provide a name and a budget"})
    }
}


 

module.exports = server;