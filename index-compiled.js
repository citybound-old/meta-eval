"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = metaEval;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _babelCore = require("babel-core");

var _babelCore2 = _interopRequireDefault(_babelCore);

var _node_modulesBabelCoreLibHelpersParseJs = require("./node_modules/babel-core/lib/helpers/parse.js");

var _node_modulesBabelCoreLibHelpersParseJs2 = _interopRequireDefault(_node_modulesBabelCoreLibHelpersParseJs);

function metaEval(source, environment, alias, sourceUrlBase, options) {

	if (options && options.transpile) {
		try {
			source = _babelCore2["default"].transform(source, {
				blacklist: ["regenerator", "es6.tailCall"],
				loose: ["es6.forOf"],
				optional: ["es7.classProperties"],
				filename: alias
			}).code;
		} catch (e) {
			if (e instanceof SyntaxError) {
				logSyntaxError(source, e);
				return;
			} else throw e;
		}
	}

	alias = alias || "anonymousMetaProgram" + createKuid();
	source = source + "\n//# sourceURL=" + sourceUrlBase + alias;

	var executable = Object.create(Function.prototype);
	var wrapperSource = "   // this function evaluates " + alias + "\n\n\t// catch syntax errors early\n\ttry {parse(source);} catch(e) {\n\t\tif (e instanceof SyntaxError) {\n\t\t\t__logSyntaxError(source, e);\n\t\t\treturn;\n\t\t} else throw e;\n\t}\n\n\teval(source);\n\n\t//# sourceURL=" + (sourceUrlBase + "metaEval/" + alias);

	environment.__logSyntaxError = logSyntaxError;
	environment.__parse = _node_modulesBabelCoreLibHelpersParseJs2["default"];

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