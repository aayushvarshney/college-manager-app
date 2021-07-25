require("dotenv").config()
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var methodOverride = require('method-override');
var User = require('./models/User');
var College = require('./models/College');
var Hostel = require('./models/Hostel');
var Checkup = require('./models/Checkup');
var Arrival = require('./models/Arrival');
var Leave = require('./models/Leave');
var Order = require('./models/Order');
var Project = require('./models/Project');
var Issue = require('./models/Issue');
var Comment = require('./models/Comment');
const mongoose = require('mongoose');

mongoose.connect( process.env.DBPATH, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false, useCreateIndex: true});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', ()=>{
    console.log("Connected to db");
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));

//Passport
app.use(require("express-session")({
    secret: process.env.SECRETKEY,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});


app.get('/', (req, res) => {

    College.find({}, (err, foundCollege)=> {
                    
        User.find({}, (err, foundUser)=> {
                    
            if(err){
                console.log(err);
            }
            else{
                res.render('index', { users: foundUser, colleges: foundCollege});
            }
        })
    })

})

app.get('/home', isLoggedIn , (req, res) => {

    Checkup.find({}, (err, foundCheckup)=> {

        Arrival.find({}, (err, foundArrival)=> {
            
            Leave.find({}, (err, foundLeave)=> {
                
                Order.find({}, (err, foundOrder)=> {
                    
                    Hostel.find({}, (err, foundHostel)=> {
                    
                        User.find({}, (err, foundUser)=> {
                    
                            if(err){
                                console.log(err);
                            }
                            else{
                                res.render('home', {checkups: foundCheckup, arrivals: foundArrival, leaves: foundLeave, orders: foundOrder, hostels: foundHostel, users: foundUser});
                            }
                        })
                    })

                })

            })

        })

    })


})

app.get('/projects',isLoggedIn, (req, res)=> {

    Project.find({}, (err, foundProject)=> {
        if(err){
            console.log(err);
            res.redirect('back');
        }
        else{
            console.log(foundProject);
            res.render('Projects', {projects: foundProject});
        }
    })

})

app.get('/register', (req, res) => {

    College.find({}, (err, colleges) => {

        res.render("register", {colleges:colleges});

    })
})

app.post('/register', (req, res) => {
    var newUser = new User({username: req.body.username, name: req.body.name, role: req.body.role});

    newUser.college.id = req.body.college;

    College.findById(req.body.college, (err, college) => {
        newUser.college.name = college.name;
    })

    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate('local')(req, res, ()=> {
            res.redirect('/home');
        })
    })
})

app.get('/login', (req, res) => {
    res.render("login");
})

app.post('/login', passport.authenticate('local',
    {
        successRedirect: '/home',
        failureRedirect: '/login'
    }), (req, res) => {

    });

app.get('/logout', (req, res)=> {
    req.logout();
    res.redirect('/');
})

app.post('/request_checkup', isLoggedIn, (req, res)=> {

    var newCheckup = new Checkup({
        age: req.body.age,
        symptoms: req.body.symptoms
    });

    newCheckup.user.id = req.user._id;
    newCheckup.user.name = req.user.name;

    newCheckup.college.id = req.user.college.id;
    newCheckup.college.name = req.user.college.name;

    newCheckup.save((err, Checkup)=> {
        if(err){
            console.log(err);
        } else{
            console.log(Checkup);
        }
    })

    res.redirect('/home');

});

app.put('/checkup/:id/approve', (req,res) => {

    Checkup.findByIdAndUpdate( req.params.id , {status: 'approved'} , {new: true} , (err, data) => {
        if(err){
            console.log(err);
        } else{
            console.log(data);
        }
    })

})

app.put('/checkup/:id/reject', (req,res) => {

    Checkup.findByIdAndUpdate( req.params.id , {status: 'rejected'} , {new: true} , (err, data) => {
        if(err){
            console.log(err);
        } else{
            console.log(data);
        }
    })

})

// Arrival

app.post('/request_arrival', isLoggedIn, (req, res)=> {

    var newArrival = new Arrival({
        branch: req.body.branch,
        address: req.body.address,
        between: req.body.between,
        to: req.body.to,
        hostel: req.body.hostel,
        mobileno: req.body.mobileno,
        covid: req.body.covid,
        
    });

    newArrival.user.id = req.user._id;
    newArrival.user.name = req.user.name;

    newArrival.college.id = req.user.college.id;
    newArrival.college.name = req.user.college.name;

    newArrival.save((err, Arrival)=> {
        if(err){
            console.log(err);
        } else{
            console.log(Arrival);
        }
    })

    res.redirect('/home');

});

app.put('/arrival/:id/approve', (req,res) => {

    Arrival.findByIdAndUpdate( req.params.id , {status: 'approved'} , {new: true} , (err, data) => {
        if(err){
            console.log(err);
        } else{
            console.log(data);
        }
    })

    res.redirect('back');

})

app.put('/arrival/:id/reject', (req,res) => {

    Arrival.findByIdAndUpdate( req.params.id , {status: 'rejected'} , {new: true} , (err, data) => {
        if(err){
            console.log(err);
        } else{
            console.log(data);
        }
    })

    res.redirect('back');

})

// Leave

app.post('/request_leave', isLoggedIn, (req, res)=> {

    var newLeave = new Leave({
        branch: req.body.branch,
        address: req.body.address,
        days: req.body.days,
        from: req.body.from,
        to: req.body.to,
        hostel: req.body.hostel,
        mobileno: req.body.mobileno,
        covid: req.body.covid,
        
    });

    newLeave.user.id = req.user._id;
    newLeave.user.name = req.user.name;

    newLeave.college.id = req.user.college.id;
    newLeave.college.name = req.user.college.name;

    newLeave.save((err, Leave)=> {
        if(err){
            console.log(err);
        } else{
            console.log(Leave);
        }
    })

    res.redirect('/home');

});

app.put('/leave/:id/approve', (req,res) => {

    Leave.findByIdAndUpdate( req.params.id , {status: 'approved'} , {new: true} , (err, data) => {
        if(err){
            console.log(err);
        } else{
            console.log(data);
        }
    })

    res.redirect('back');

})

app.put('/leave/:id/reject', (req,res) => {

    Leave.findByIdAndUpdate( req.params.id , {status: 'rejected'} , {new: true} , (err, data) => {
        if(err){
            console.log(err);
        } else{
            console.log(data);
        }
    })

    res.redirect('back');

})

//

// Leave

app.post('/request_order', isLoggedIn, (req, res)=> {

    var newOrder = new Order({
        hostel: req.body.hostel,
        mobileno: req.body.mobileno,
        from: req.body.from,
        item: req.body.item
        
    });

    newOrder.user.id = req.user._id;
    newOrder.user.name = req.user.name;

    newOrder.college.id = req.user.college.id;
    newOrder.college.name = req.user.college.name;

    newOrder.save((err, Order)=> {
        if(err){
            console.log(err);
        } else{
            console.log(Order);
        }
    })

    res.redirect('/home');

});

app.put('/order/:id/approve', (req,res) => {

    Order.findByIdAndUpdate( req.params.id , {status: 'approved'} , {new: true} , (err, data) => {
        if(err){
            console.log(err);
        } else{
            console.log(data);
        }
    })

    res.redirect('back');

})

app.put('/order/:id/reject', (req,res) => {

    Order.findByIdAndUpdate( req.params.id , {status: 'rejected'} , {new: true} , (err, data) => {
        if(err){
            console.log(err);
        } else{
            console.log(data);
        }
    })

    res.redirect('back');

})

//

app.post('/addcollege', (req, res)=> {

    var newCollege = new College({
        name: req.body.name,
    });

    newCollege.save((err, college)=> {
        if(err){
            res.send(err);
        } else{
            res.send(college);
        }
    })

});

app.post('/addhostel', (req, res)=> {

    var newHostel = new Hostel({
        name: req.body.name,
    });

    newHostel.college.id = req.user.college.id;
    newHostel.college.name = req.user.college.name;

    newHostel.save((err, Hostel)=> {
        if(err){
            res.send(err);
        } else{
            res.redirect('back');
        }
    })

});

app.put('/hostel/:id/approve', (req,res) => {

    Hostel.findByIdAndUpdate( req.params.id , {status: 'yes'} , {new: true} , (err, data) => {
        if(err){
            console.log(err);
        } else{
            console.log(data);
        }
    })

    res.redirect('back');

})

app.put('/hostel/:id/reject', (req,res) => {

    Hostel.findByIdAndUpdate( req.params.id , {status: 'no'} , {new: true} , (err, data) => {
        if(err){
            console.log(err);
        } else{
            console.log(data);
        }
    })

    res.redirect('back');

})

app.post('/vaccine', (req,res) => {

    User.findByIdAndUpdate( req.body.vaccine , {vaccine: 'yes'} , {new: true} , (err, data) => {
        if(err){
            console.log(err);
        } else{
            console.log(data);
        }
    })

    res.redirect('back');

})

// old


app.get('/addproject',isLoggedIn, (req, res)=> {
    res.render("addProject");
})

app.post('/addproject',isLoggedIn, (req, res)=> {

    var newProject = new Project({
        name: req.body.name,
        description: req.body.description
    });

    newProject.author.id = req.user._id;
    newProject.author.username = req.user.username;

    newProject.save((err, project)=> {
        if(err){
            console.log(err);
        } else{
            console.log(project);
        }
    })

    res.redirect('/');

});

app.get('/project/:id', isLoggedIn , (req, res) => {

    Project.findById(req.params.id, (err, foundProject)=> {
        res.render('projectDetail', {project: foundProject});
    })

})

app.get('/project/:id/issue/add', isLoggedIn, (req, res) => {

    res.render('AddIssue', {projectId: req.params.id});

})

app.get('/project/:id/issue/:issue_id/comment/add', isLoggedIn, (req, res) => {

    res.render('AddComment', {projectId: req.params.id, issueId: req.params.issue_id});

})

app.get('/project/:id/issue', isLoggedIn, (req, res) => {

    Issue.find({}, (err, foundIssue) => {
        
        res.render('Issues', {projectId: req.params.id, issues: foundIssue});
        
    })

})

app.post('/project/:id/issue', (req, res) => {

    var newIssue = new Issue({
        name: req.body.name,
        description: req.body.description
    })
    newIssue.author.id = req.user._id;
    newIssue.author.username = req.user.username;
    newIssue.resolved = false;
    newIssue.project.id = req.params.id;

    Project.findById(req.params.id, (err, foundProject)=> {
        newIssue.project.name = foundProject.name;
    })

    newIssue.save((err, issue)=> {
        if(err){
            console.log(err);
        } else{
            console.log(issue);
        }
    })

    res.redirect('/project/' + req.params.id)


})

app.post('/project/:id/issue/:issue_id/comment', (req, res) => {

    var newComment = new Comment({
        text: req.body.comment,
    })
    newComment.author.id = req.user._id;
    newComment.author.username = req.user.username;
    newComment.issue.id = req.params.issue_id;

    Issue.findById(req.params.issue_id, (err, foundIssue)=> {
        newComment.issue.name = foundIssue.name;
    })

    newComment.save((err, comment)=> {
        if(err){
            console.log(err);
        } else{
            console.log(comment);
        }
    })

    res.redirect('/project/' + req.params.id)


})

app.get('/project/:id/issue/:issue_id', isLoggedIn, (req, res) => {

    Issue.findById( req.params.issue_id , (err, foundIssue) => {
        Comment.find({}, (err, foundComment) => {
            res.render('issueDetail', {projectId: req.params.id, issue: foundIssue, comments: foundComment});
        })
    })

})

app.delete('/project/:id/issue/:issue_id', (req, res) => {

    Issue.findByIdAndDelete( req.params.issue_id , (err, data) => {
        if(err){
            console.log(err);
        } else{
            console.log(data);
        }
    })

    res.redirect('/project/' + req.params.id + '/issue');

})

app.get('/project/:id/issue/:issue_id/edit', (req, res) => {

    Issue.findById( req.params.issue_id , (err, foundIssue) => {
        res.render('editIssue', {projectId: req.params.id, issue: foundIssue});
    })

})

app.put('/project/:id/issue/:issue_id', (req, res) => {

    Issue.findByIdAndUpdate( req.params.issue_id , {name: req.body.name, description: req.body.description} , {new: true} , (err, data) => {
        if(err){
            console.log(err);
        } else{
            console.log(data);
        }
    })

    res.redirect('/project/' + req.params.id + '/issue/' + req.params.issue_id);

})

app.put('/project/:id/issue/:issue_id/status', (req, res) => {

    Issue.findById( req.params.issue_id, (err, issue) => {
        if(issue.resolved){
            Issue.findByIdAndUpdate( req.params.issue_id , {resolved: false} , {new: true} , (err, data) => {
                if(err){
                    console.log(err);
                } else{
                    console.log(data);
                }
            })
        } else{
            Issue.findByIdAndUpdate( req.params.issue_id , {resolved: true} , {new: true} , (err, data) => {
                if(err){
                    console.log(err);
                } else{
                    console.log(data);
                }
            })
        }
    })

    res.redirect('back');

})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');

}

const port = process.env.PORT || '3000'

app.listen(port, () => {
    console.log("Server started at 3000");
})