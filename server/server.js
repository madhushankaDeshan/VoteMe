const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');
// const Transaction = require('mongoose-transactions');
// const transaction = new Transaction();
var createError = require('http-errors');
var favicon = require('serve-favicon');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');


var {mongoose} = require('./db/mongoose');

var {authenticate} = require('./middleware/authenticate');

var {ContestAdmin} = require('./model/contestAdmin');
var {Contest} = require('./model/contest');
var {Contestant} = require('./model/Contestant');
var {VotingDetail} = require('./model/votingDetail');
var {Voter} = require('./model/voter')

var Transaction = require('mongoose-transaction')(mongoose);


var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var path = require('path');
const publicPath = path.join(__dirname,'../views/admin/production');
app.use(express.static(publicPath));
console.log(publicPath)
const port = process.env.PORT;

app.use(bodyParser.json());

// create contest admin--start

app.post('/admin', (req, res) => {

    var body = _.pick(req.body, ['user_name', 'password', 'email']);
    console.log(body);
    var admin = new ContestAdmin(body);


    admin.save().then(() => {

        return admin.generateAuthToken();

    }).then((token) => {

        res.header('x-auth', token).send(admin);

    }).catch((e) => {

        res.status(400).send(e);

    })
});

// create contest admin--end

// view contest admin--start

app.get('/admin/contestAdmin', authenticate, (req, res) => {
    res.send(req.admin);
});

// view contest admin--end

// delete contest admin--start
app.delete('/admin/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    ContestAdmin.findOneAndRemove({
        _id:id
    }).then((admin) => {
        if (!admin) {
            return res.status(404).send();
        }

        res.send({admin});
    }).catch((e) => {
        res.status(400).send();
    });
});
// delete contest admin--end

// contest admin login--start

app.post('/admin/login',urlencodedParser, (req, res) => {
    // var nameValue = document.getElementById("email").value;
    // console.log(nameValue)
    var body = ({
        email:req.body.email,
        password:req.body.password
    });
    // console.log(req.body(email))
    console.log(body);

    // var body = _.pick(req.body, [ 'password', 'email']);
     // var body = _.pick(req.body, ['email', 'password']);
    // console.log("aa"+email)



    ContestAdmin.findByCredentials(body.email, body.password).then((admin) => {
        return admin.generateAuthToken().then((token) => {
         // res.header('x-auth', token).send(admin);
            res.setHeader('x-auth', token)

            res.sendFile('index.html', {root : __dirname + '../../views/admin/production'});
            // console.log(header)
            // res.header('x-auth', token).send(admin);
            // res.setHeader('x-auth', token)

        });
    }).catch((e) => {
        res.status(400).send();



    });
});

// contest admin login--end

// contest admin logout--end

app.delete('/admin/logout', authenticate, (req, res) => {

    req.admin.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

// contest admin logout--end

// create contest--start
app.post('/contest', authenticate, (req, res) => {

    var contest = new Contest({
        name: req.body.name,
        startDate:req.body.startDate,
        endDate:req.body.endDate,
        _adminId: req.admin._id
    });

    contest.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

// create contest--end

// view contest--start

app.get('/contest', authenticate, (req, res) => {
    Contest.find({
        _adminId: req.admin._id
    }).then((contest) => {
        res.send({contest});
    }, (e) => {
        res.status(400).send(e);
    });
});

// view contest--end

// find contest--start

app.get('/contest/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Contest.findOne({
        _id: id,
        _adminId: req.admin._id
    }).then((contest) => {
        if (!contest) {
            return res.status(404).send();
        }

        res.send({contest});
    }).catch((e) => {
        res.status(400).send();
    });
});

// find contest--end

// create contestant--start
app.post('/contestant/:id',  (req, res) => {

    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    var contestant = new Contestant({
        name: req.body.name,
        image:req.body.image,
        description:req.body.description,
        _contestId: id
    });

    contestant.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

// create contest--end

// view contestant--start

app.get('/contestant/:id',(req, res) => {

    var id = req.params.id;

    Contestant.find({
        _contestId: id
    }).then((contestant) => {
        res.send({contestant});
    }, (e) => {
        res.status(400).send(e);
    });
});

// view contestant--end

// create contestant--start

app.post('/conant/:id', (req, res) => {

    const jonathanObject = {
        age: 18,
        name: 'Jonathan'
    }
    const aliceObject = {
        age: 23,
        name: 'Alice',
    }

    async function start () {
        try {
            const jonathanId = transaction.insert(person, jonathanObject)
            transaction.update(person, jonathanId, aliceObject)
            transaction.remove(person, 'fakeId') // this operation fail
            const final = await transaction.run()
            // expect(final[0].name).toBe('Jonathan')
        } catch (error) {
            console.error(error)
            const rollbackObj = await transaction.rollback().catch(console.error)
            transaction.clean()
            //  expect(rollbacks[0].name).toBe('Alice')
            //  expect(rollbacks[0].age).toBe(aliceObject.age)
            //  expect(rollbacks[1].name).toBe('Jonathan')
            //  expect(rollbacks[1].age).toBe(bobObject.age)
        }
    }

    start()
























//     var contestant = new Contestant({
//         name: req.body.name,
//         image: req.body.image,
//         description:req.body.description
//     });
//
//
//
//     var id = req.params.id;
//
//     if (!ObjectID.isValid(id)) {
//         return res.status(404).send();
//     }
// // var contest=Contest.findOne({_id:id});
// //     console.log(contest)
//     var contest = Contest.findOne({
//         _id: id,
//
//     }).then((contest) => {
//
//         if (!contest) {
//             return res.status(404).send();
//         }
//
//         res.send({contest});
//
//
//         var votingDetail = new VotingDetail({
//             _contestId: contest._id,
//             _contestantId:contestant._id
//
//             // _contestId:"a"
//         });
//
//         async function start () {
//             try {
//                 const contestantId = transaction.insert(Contestant, contestant)
//                 transaction.insert(VotingDetail,contestantId,votingDetail)
//                 // transaction.update(person, jonathanId, aliceObject)
//                 transaction.remove(person, 'fakeId') // this operation fail
//                 const final = await transaction.run()
//                 // expect(final[0].name).toBe('Jonathan')
//             } catch (error) {
//                 console.error(error)
//                 const rollbackObj = await transaction.rollback().catch(console.error)
//                 transaction.clean()
//                 //  expect(rollbacks[0].name).toBe('Alice')
//                 //  expect(rollbacks[0].age).toBe(aliceObject.age)
//                 //  expect(rollbacks[1].name).toBe('Jonathan')
//                 //  expect(rollbacks[1].age).toBe(bobObject.age)
//             }
//         }
//
//         start();
//
//
//     }).catch((e) => {
//         res.status(400).send();
//     });
//



    // contestant.save().then((doc) => {
    //     res.send(doc);
    // }, (e) => {
    //     res.status(400).send(e);
    // });
});

// create contestant--end

// view all contestant--start

app.get('/contestant', (req, res) => {
    Contestant.find().then((contestant) => {
        res.send({contestant});
    }, (e) => {
        res.status(400).send(e);
    });
});

// view all contestant--end

// create vote--start

app.post('/voter/:id', (req, res) => {

    var voter = new Voter({
        votingType:req.body.votingType,
        name:req.body.name,
        gender:req.body.gender
    })

    // var contestant = new Contestant({
    //     name: req.body.name,
    //     image: req.body.image,
    //     description:req.body.description
    // });



    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
// var contest=Contest.findOne({_id:id});
//     console.log(contest)

    var contestant = Contestant.findOne({
        _id: id,

    }).then((contestant) => {

        if (!contestant) {

            return res.status(404).send();
        }

        // res.send({contest});


        var votingDetail = new VotingDetail({
            _voterId: voter._id,
            _contestantId:contestant._id

            // _contestId:"a"
        });


        var transaction = new Transaction();
        transaction.insert('Voter',{votingType:req.body.votingType, name:req.body.name,gender:req.body.gender
        });
        // console.log(transaction)
        transaction.insert('VotingDetail', {  _voterId: voter._id,_contestantId:contestant._id});
        console.log(transaction)
        transaction.update('Contestant',id,{voteCount:+1})

        transaction.run(function(err, docs){

                if(err){
                    console.log("ssddds")
                }
                res.send(docs)
                // your code here
                console.log(docs)
            }
        );

    }).catch((e) => {
        res.status(400).send();
    });
});









// ======================================================================================================================





app.post('/contestants/:id', (req, res) => {



    var contestant = new Contestant({
        name: req.body.name,
        image: req.body.image,
        description:req.body.description
    });



    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
// var contest=Contest.findOne({_id:id});
//     console.log(contest)

    var contest = Contest.findOne({
        _id: id,

    }).then((contest) => {

        if (!contest) {

            return res.status(404).send();
        }

        res.send({contest});


        var votingDetail = new VotingDetail({
            _contestId: contest._id,
            _contestantId:contestant._id

            // _contestId:"a"
        });


    var transaction = new Transaction();
    transaction.insert('Contestant',{ name: req.body.name, image: req.body.image,description:req.body.description});
     // console.log(transaction)
    transaction.insert('VotingDetail', {  _contestId: contest._id,
        _contestantId:contestant._id});
        console.log(transaction)

    transaction.run(function(err, docs){

        if(err){
            console.log("ssddds")
        }

        // your code here
        console.log(docs)
    }
    );


    }).catch((e) => {
        res.status(400).send();
    });

});



// create contestant--end

//
//
// app.use(express.static(__dirname + '../../views'));
// app.set('production', __dirname + '/views/admin/production');
// console.log(app.mountpath)
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
//
// app.use(bodyParser.urlencoded({
//     extended: true
// }));
// app.use(bodyParser.json());
// -----------------------------------------------------------------------------------------

//
// app.get('/', function(req, res){
//     console.log(app.mountpath)
//     res.sendFile('login.html', {root : __dirname + '../../views/admin/production'});
//
//      // res.render('index.html');
// });
//

// app.set('production', path.join(__dirname,'/views','admin/production'));
// app.set('view engine', 'html');
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, '/view','/admin')));
// app.use(session({secret:'whatever',resave:true,saveUninitialized:true}));
//
// app.get('/', function (req,res) {
//     res.render('index.html')
//
// });

app.listen(3000, () => {
    console.log(`Started up at port ${3000}`);
});

