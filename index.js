var fs = require("node-fs-extra"),
    glob = require("glob"),
    Q = require("q"),
    FS = require("q-io/fs");

var dataURIs = {};
var defaults = {
    outFile: "dist/svg-concat.json",
    encoding: "base64"
};

function map (arr, iterator) {
    // execute the func for each element in the array and collect the results
    var promises = arr.map(function (el) { return iterator(el) })
    return Q.all(promises) // return the group promise
}

function dataURIfy(path) {
    var header = "data:image/svg+xml;" + defaults.encoding + ",";

    function appendHeader(data) {
        return header + data;
    }

    return FS.read(path, {charset: "base64"}).then(appendHeader);

}

function concatenate(paths, opts) {

    if(paths instanceof Array) {
        paths.forEach(function(v) {
            concatenate(v, opts);
        });
    }

//    if(/.*\.svg$/g.test(paths) == false) {
//        throw "Path '"+paths+"' doesn't end in .svg. Are you sure you know what you're doing?";
//    }


    glob(paths, function(err, matches) {
//        matches.forEach(function(v) {
//            var header = "data:image/svg+xml;" + defaults.encoding + ",";
//            var rs = fs.createReadStream(v, { encoding: defaults.encoding });
//            var content = "";
//
//            rs.on("data", function(chunk) {
//               content += chunk;
//            });
//
//            rs.on("end", function() {
//                dataURIs[v] = header + content;
//
//                fs.outputJson(defaults.outFile, dataURIs, function(err) {
//                    if(err) throw err;
//                })
//            });
//
//        });


//        matches.forEach(function(v) {
//            dataURIfy(v).then(function(data) {
//                //console.log(data);
//            });
//        });

        map(matches, dataURIfy).then(function(val) {
            console.log(val);
        })
    });

}

module.exports = {
    concatenate: concatenate
};