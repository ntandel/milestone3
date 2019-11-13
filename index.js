var SERVER_NAME = 'patients-api'
var PORT = 8002;
var HOST = '127.0.0.1';




var restify = require('restify')

// Get a persistence engine for the patients
, patientsSave = require('save')('patients')

// Create the restify server
, server = restify.createServer({ name: SERVER_NAME })

server.listen(PORT, HOST, function() {
    console.log('Server %s listening at %s', server.name, server.url)
    console.log('Resources:')
    console.log(' /patients')
    console.log(' /patients/:id')

})

server
// to post the request to the server
    .use(restify.fullResponse())

// Maps req.body to req.params so there is no switching between them
.use(restify.bodyParser())

// Get all patients in the system
server.get('/patients', function(req, res, next) {

    // Find every entity within the given collection
    patientsSave.find({}, function(error, patients) {

        // Return all of the patients in the system
        res.send(patients);


    })
})

// Get a single name by their name id
server.get('/patients/:id', function(req, res, next) {

    // Find a single name by their id within save
    patientsSave.findOne({ _id: req.params.id }, function(error, name) {

        // If there are any errors, pass them to next in the correct format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

        if (name) {
            // Send the name if no issues
            res.send(name)

            console.log(name);
        } else {
            // Send 404 header if the name doesn't exist
            res.send(404)
        }
    })
})

// to Create the new name
server.post('/patients', function(req, res, next) {


    // Make sure name is defined
    if (req.params.firstname === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new restify.InvalidArgumentError('firstname must be supplied'))
    }
    if (req.params.lastname === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new restify.InvalidArgumentError('lastname must be supplied'))
    }
    if (req.params.DOB === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new restify.InvalidArgumentError('DOB must be supplied'))
    }
    if (req.params.gender === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new restify.InvalidArgumentError('gender must be supplied'))
    }

    var newpatients = {
        firstname: req.params.firstname,
        lastname: req.params.lastname,
        DOB: req.params.DOB,
        gender: req.params.gender
    }

    // Create the name using the persistence engine
    patientsSave.create(newpatients, function(error, name) {

        // If there are any errors, pass them to next in the correct format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

        // Send the name if no issues
        res.send(201, name)

    })
})

// Delete patients
server.del('/patients', function(req, res, next) {

    // Delete the patients with the persistence engine
    patientsSave.deleteMany(req.params, function(error, patients) {

        // If there are any errors, pass them to next in the correct format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

        // Send a 200 OK response
        res.send()
    })
})


// Delete patients by id
server.del('/patients/:id', function(req, res, next) {

    // Delete the patients with the persistence engine
    patientsSave.delete({ _id: req.params.id }, function(error, patients) {

        // If there are any errors, pass them to next in the correct format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

        // Send a 200 OK response
        res.send()
    })
})