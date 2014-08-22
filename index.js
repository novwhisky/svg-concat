var dataURI = require("data-uri-fy"),
    fs = require("node-fs-extra"),
    glob = require("glob"),
    Q = require("q");


function expand(src, tgt, handler) {
    var d = Q.defer();

    src.forEach(function(v, idx, arr) {
        var res = handler(v);
        tgt = tgt.concat(res || []);

        if(idx == arr.length - 1) {
            d.resolve(tgt);
        }
    });

    return d.promise;
}

function map(src, obj, handler) {
    var d = Q.defer();

    src.forEach(function(v, idx, arr) {
        obj[v] = handler(v)

        if(idx == arr.length - 1) {
            d.resolve(obj);
        }
    });

    return d.promise;
}

var defaults = {
    outFile: "svg_dist.json",
    encoding: "base64"
};


/**
 * Exports
 */
function concatenate(globs, opts) {

    if(typeof(globs) == "string")
        return concatenate([globs], opts);

    expand(globs, [], function(item) {
        return glob.sync(item);
    }).then(function(data) {
        return map(data, {}, dataURI.convert);
    }).then(function(v) {
        return fs.outputJson(defaults.outFile, v);
    })
}

module.exports.concatenate = concatenate;