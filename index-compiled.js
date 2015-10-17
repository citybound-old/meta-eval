"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = metaEval;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _babelCore = require("babel-core");

var _babelCoreLibHelpersParseJs = require("babel-core/lib/helpers/parse.js");

var _babelCoreLibHelpersParseJs2 = _interopRequireDefault(_babelCoreLibHelpersParseJs);

function metaEval(source, environment, alias, filename, sourceUrlBase, options) {

	filename = filename || alias;
	options = options || {};

	if (options.transpile) {
		try {
			source = (0, _babelCore.transform)(source, {
				blacklist: ["regenerator", "es6.tailCall"],
				loose: ["es6.forOf"],
				optional: ["es7.classProperties"],
				filename: filename
			}).code;
		} catch (e) {
			if (e instanceof SyntaxError) {
				logSyntaxError(source, e);
				return;
			} else throw e;
		}
	}

	alias = alias || "anonymousMetaProgram" + createKuid();
	source = source + "\n//# sourceURL=" + sourceUrlBase + filename;

	var executable = Object.create(Function.prototype);
	var wrapperSource = "   // this function evaluates " + alias + "\n\n\t// catch syntax errors early\n\ttry {__parse(source);}\n\tcatch(e) {\n\t\tif (e instanceof SyntaxError) {\n\t\t\t__logSyntaxError(source, e);\n\t\t\treturn;\n\t\t} else throw e;\n\t}\n\n\teval(source);\n\t";

	if (options.wrapperFileListed) wrapperSource += "//# sourceURL=" + (sourceUrlBase + "metaEval/" + alias);

	environment.__logSyntaxError = logSyntaxError;
	environment.__parse = _babelCoreLibHelpersParseJs2["default"];

	var wrapperParameters = ["source"].concat(Object.keys(environment)).concat([wrapperSource]);
	var wrapperFunction = Function.prototype.constructor.apply(executable, wrapperParameters);

	var environmentValues = Object.keys(environment).map(function (k) {
		return environment[k];
	});
	var wrapperArguments = [source].concat(environmentValues);

	wrapperFunction.apply(executable, wrapperArguments);

	return environment;
}

;

function logSyntaxError(source, e) {
	if (e.loc) {
		console.error(source.split(/\n/).slice(0, e.loc.line).map(function (l, i) {
			return i + ":\t" + l;
		}).join("\n") + "\n" + (e.loc.line + "").replace(/./g, "!") + "!\t" + source.split(/\n/)[e.loc.line - 1].slice(0, e.loc.column).replace(/[^\t]/g, "-") + "^");
	}
	console.error(e);
}

// kinda unique id
function createKuid() {
	return 'xxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0,
		    v = c === 'x' ? r : r & 0x3 | 0x8;
		return v.toString(16);
	});
}
module.exports = exports["default"];

//# sourceMappingURL=index-compiled.js.map