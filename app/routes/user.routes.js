var router = require('express').Router();
const userDB = require('../DB/user.db');

module.exports = app => {

    router.post('/', (req, res) => res.send('App is working'));

    router.post('/get/:id', function(req, res) {
        userDB.getUser(req.params.id, function(err, user) {
            if(err)
                res.send(err);
            else
                res.send(user);
        });
    });
    
    router.post('/getAll', function(req, res) {
        userDB.getAllUsers(function(err, user) {
            if(err)
                res.send(err);
            else
                res.send(user);
        });
    });

    router.post('/add', function (req, res){
        userDB.createUser(req, function(err, user) {
            if(err)
                res.send(err);
            else
                res.send(user);
                // res.status(200).json({ res });
                // console.log(msg);
        });
    });

    router.post('/login', function (req, res){
        userDB.comparePassword(req.body.password, req.body.username, function(err, response) {
                if(err)
                    res.send(err);
                else
                    res.send(response);
        })
    });

    router.post('/update/:id', function (req, res){
        userDB.updateUser(req, req.params.id, function(err, user) {
                if(err)
                    res.send(user);
                else
                    res.send(user);
        })
    });

    router.post('/delete/:id', function (req, res){
        userDB.deleteUser(req.params.id, function(err, response) {
                if(err)
                console.log("ERR", err);
                    // res.send(err);
                else
                    res.send(response);
        })
    });
    
    router.post('/addDependent/:id', function (req, res){
        userDB.addDependent(req, req.params.id, function(err, user) {
            if(err)
                res.send(err);
            else
                res.send(user);
        });
    });
    
    router.post('/updateDependent/:userId/:dependentId', function (req, res){
        userDB.updateDependent(req, req.params.userId, req.params.dependentId, function(err, user) {
            if(err)
                res.send(err);
            else
                res.send(user);
        });
    });
    
    router.post('/deleteDependent/:userId/:dependentId', function (req, res){
        userDB.deleteDependent(req, req.params.userId, req.params.dependentId, function(err, user) {
            if(err)
                res.send(err);
            else
                res.send(user);
        });
    });

    app.use('/api/user', router);

};