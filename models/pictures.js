const sanitizeHTML = require('sanitize-html');
const fs = require('fs');

module.exports = function (mongoose) {

    const grid = require('gridfs-stream');
    grid.mongo = mongoose.mongo;

    return {
        create: function (id, image, callback) {
            const gfs = grid(mongoose.connection.db);
            var writeStream = gfs.createWriteStream({filename: id});
            fs.createReadStream(image).pipe(writeStream);
            writeStream.on('close', file => {
                callback(null, file.filename);
            });
        },
        read: function (id, callback) {
            const gfs = grid(mongoose.connection.db);
            gfs.exist({filename: id}, (err, exist) => {
                if (err) {
                    callback(err, null);
                } else if (!exist) {
                    callback("picture doesn't exist.", null);
                } else {
                    const readStream = gfs.createReadStream({filename: id});
                    callback(null, readStream);
                }
            });
        },
        delete: function(id, callback) {
            const gfs = grid(mongoose.connection.db);
            gfs.remove({fileName: id}, callback);
        },
        deleteAll: function(callback) {
            const gfs = grid(mongoose.connection.db);
            gfs.remove({}, callback);
        },
        disconnect: function () {
            mongoose.disconnect();
        }
    };
};
