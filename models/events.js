const sanitizeHTML = require('sanitize-html');

module.exports = function (mongoose) {
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
            var event = new Event(from);
            event.save(callback);
        },
        read: function (id, callback) {
            Event.findById(id, callback);
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
            Event.remove({ _id: id }, callback);
        },
        deleteAll: function (callback) {
            Event.remove({}, callback);
        }
    };
};
