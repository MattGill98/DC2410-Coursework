const fs = require('fs');
const readChunk = require('read-chunk');
const fileType = require('file-type');

module.exports = function (mongoose) {

    // Configure GridFS for picture storage
    const grid = require('gridfs-stream');
    grid.mongo = mongoose.mongo;

    function validatePicture(image, callback) {
        if (image === null) return callback(null, true);
        readChunk(image, 0, 4100).then(buffer => {
            if (!buffer) throw 'Error reading file.';

            const type = fileType(buffer);

            if (!type || !type.mime.includes('image')) throw 'File wasn\'t image.';

            callback(null, true);
        }).catch(err => {
            callback(err);
        });
    }

    function createPicture (id, image, callback) {
        const gfs = grid(mongoose.connection.db);

        var writeStream = gfs.createWriteStream({filename: id});
        fs.createReadStream(image).pipe(writeStream);
        writeStream.on('close', file => {
            callback(null, true);
        });
    }

    function getPicture (id, callback) {
        const gfs = grid(mongoose.connection.db);
        gfs.exist({filename: id}, (err, exist) => {
            if (err) {
                callback(err, null);
            } else if (!exist) {
                callback(null, null);
            } else {
                const readStream = gfs.createReadStream({filename: id});
                callback(null, readStream);
            }
        });
    }

    function deletePicture (id, callback) {
        const gfs = grid(mongoose.connection.db);
        gfs.exist({filename: id}, (err, exist) => {
            if (err) return callback(err);
            if (!exist) return callback();
            gfs.remove({filename: id}, (err, res) => {
                if (err) return callback(err);
                callback(null, res);
            });
        });
    }

    function updatePicture (id, image, callback) {
        deletePicture(id, (err, res) => {
            if (err) return callback(err);
            createPicture(id, image, callback);
        });
    }

    const eventSchema = new mongoose.Schema(
        {
            name: {
                type: String,
                required: [true, "An event requires a name."]
            },
            description: {
                type: String,
                required: false
            },
            category: {
                type: String,
                required: [true, 'An event requires a valid category.'],
                enum: ['sport', 'culture', 'other']
            },
            date: {
                type: Date,
                required: [true, "An event requires a date."]
            },
            picture: {
                type: Boolean,
                required: false
            },
            organiser: {
                type: String,
                required: [true, "An event requires an organiser."]
            },
            venue: {
                type: String,
                required: [true, "An event requires a venue."]
            },
            interested: [{
                type: String
            }]
        },
        {
            strict: "throw",
            toObject: {
                versionKey: false
            }
        }
    );
    const Event = mongoose.model('Event', eventSchema);

    return {
        create: function (from, callback) {

            var picturePath = (from.picture == null) ? null : from.picture.path;
            from.picture = false;

            var event = new Event(from);

            validatePicture(picturePath, (err, pictureValid) => {
                if (err) return callback({errors: {picture: {message: err}}});

                event.save((err, createdEvent) => {
                    if (err) return callback(err, createdEvent);
    
                    if (picturePath) {
                        createPicture(createdEvent.id, picturePath, (err, createdPicture) => {
                            if (err) return callback(err, createdEvent);
    
                            createdEvent.picture = true;
                            Event.findByIdAndUpdate(createdEvent.id, createdEvent, {new: true}, (err, updatedEvent) => {
                                if (err) return callback(err, updatedEvent);
    
                                callback(null, updatedEvent);
                            });
                        });
                    } else {
                        return callback(null, from);
                    }
                });
            });
        },
        read: function (id, callback) {
            Event.findById(id, callback);
        },
        readPicture: function(id, callback) {
            Event.findById(id, (err, res) => {
                if (err) return callback(err, res);
                getPicture(id, (err, res) => {
                    if (err) return callback(err, res);
                    callback(null, res);
                });
            });
        },
        find: function (filterString, sortString, sortOrder, username, limit, offset, callback) {

            // Find the filters
            var conditions = {};
            if (filterString) {
                if (filterString.includes('sport')) conditions.category = 'sport';
                if (filterString.includes('culture')) conditions.category = 'culture';
                if (filterString.includes('other')) conditions.category = 'other';
                if (filterString.includes('mine')) conditions.organiser = username;
                if (filterString.includes('subscribed')) conditions.interested = username;
            }

            // Find the sort order
            var sortOrderValue = 1;
            if (sortOrder === 'desc') sortOrderValue = -1;

            // Find the sort value
            var sort = {};
            if (sortString === 'popularity') sort.interested = sortOrderValue;
            if (sortString === 'name') sort.name = sortOrderValue;
            if (sortString === 'date') sort.date = sortOrderValue;
            if (sortString === 'category') sort.category = sortOrderValue;
            if (sortString === 'venue') sort.venue = sortOrderValue;
            if (sortString === 'organiser') sort.organiser = sortOrderValue;

            Event.find(conditions, [], {'sort': sort, 'skip': Number(offset), 'limit': Number(limit)}, callback);
        },
        count: function(filterString, username, callback) {

            // Find the filters
            var conditions = {};
            if (filterString) {
                if (filterString.includes('sport')) conditions.category = 'sport';
                if (filterString.includes('culture')) conditions.category = 'culture';
                if (filterString.includes('other')) conditions.category = 'other';
                if (filterString.includes('mine')) conditions.organiser = username;
                if (filterString.includes('subscribed')) conditions.interested = username;
            }

            Event.count(conditions, callback);
        },
        update: function (id, updatedEvent, callback) {
            Event.findOneAndUpdate({_id: id}, updatedEvent, {new: true}, callback);
        },
        patch: function (id, updatedEvent, callback) {
            // If any properties are present but null
            if ("name" in updatedEvent && !updatedEvent.name) {
                return callback({errors: {name: {message: "An event requires a name."}}});
            }
            if ("category" in updatedEvent && !updatedEvent.category) {
                return callback({errors: {name: {message: "An event requires a category."}}});
            }
            if ("date" in updatedEvent && !updatedEvent.date) {
                return callback({errors: {name: {message: "An event requires a date."}}});
            }
            if ("organiser" in updatedEvent && !updatedEvent.organiser) {
                return callback({errors: {name: {message: "An event requires a organiser."}}});
            }
            if ("venue" in updatedEvent && !updatedEvent.venue) {
                return callback({errors: {name: {message: "An event requires a venue."}}});
            }

            Event.findById(id, (err, res) => {
                if (err) return callback(err);
                if (!res) return callback({message: 'Event not found.'});

                var picturePath = (updatedEvent.picture == null) ? null : updatedEvent.picture.path;
                updatedEvent.picture = res.picture;
    
                validatePicture(picturePath, (err, pictureValid) => {
                    if (err) return callback({errors: {picture: {message: err}}});
    
                    Event.findOneAndUpdate({_id: id}, {$set: updatedEvent}, {new: true}, (err, createdEvent) => {
                        if (err) return callback(err, createdEvent);
    
                        if (picturePath) {
                            updatePicture(id, picturePath, (err, createdPicture) => {
                                if (err) return callback(err, createdEvent);
        
                                createdEvent.picture = true;
                                Event.findByIdAndUpdate(createdEvent.id, createdEvent, {new: true}, (err, updatedEvent) => {
                                    if (err) return callback(err, updatedEvent);
        
                                    callback(null, updatedEvent);
                                });
                            });
                        } else {
                            return callback(null, createdEvent);
                        }
                    });
                });
            });
        },
        delete: function (id, callback) {
            Event.remove({ _id: id }, (err, res) => {
                if (err) return callback(err);
                deletePicture(id, (err, store) => {
                    if (err) return callback(err);
                    callback(null, res);
                });
            });
        }
    };
};
