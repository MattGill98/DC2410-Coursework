const sanitizeHTML = require('sanitize-html');
const fs = require('fs');

module.exports = function (mongoose) {

    // Configure GridFS for picture storage
    const grid = require('gridfs-stream');
    grid.mongo = mongoose.mongo;

    function createPicture (id, image, callback) {
        const gfs = grid(mongoose.connection.db);
        var writeStream = gfs.createWriteStream({filename: id});
        fs.createReadStream(image).pipe(writeStream);
        writeStream.on('close', file => {
            callback(null, file.filename);
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

    function deleteAllPictures(callback) {
        const gfs = grid(mongoose.connection.db);
        gfs.files.remove({}, callback);
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
            }
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
                }
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
        find: function (conditions, sortColumn, callback) {
            if (conditions == null) {
                Event.find({}, [], {}, callback);
            }
            var sort = {};
            sort[sortColumn] = 1;
            Event.find(conditions, [], {
                sort: sort
            }, callback);
        },
        update: function (id, updatedMessage, callback) {
            Event.findOneAndUpdate({_id: id}, updatedMessage, callback);
        },
        delete: function (id, callback) {
            Event.remove({ _id: id }, (err, res) => {
                if (err) return callback(err);
                deletePicture(id, callback);
            });
        },
        deleteAll: function (callback) {
            Event.remove({}, (err, res) => {
                if (err) return callback(err);
                deleteAllPictures(callback);
            });
        }
    };
};
