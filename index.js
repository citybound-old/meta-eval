import babel from "babel-core";
import babelParser from "babel-core/lib/helpers/parse.js";

export default function metaEval (source, environment, alias, filename, sourceUrlBase, options) {

	filename = filename || alias;

	if (options && options.transpile) {
		try {
			source = babel.transform(source, {
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

	let executable = Object.create(Function.prototype);
	let wrapperSource =
`   // this function evaluates ${alias}

	// catch syntax errors early
	try {__parse(source);}
	catch(e) {
		if (e instanceof SyntaxError) {
			__logSyntaxError(source, e);
			return;
		} else throw e;
	}

	eval(source);

	//# sourceURL=${sourceUrlBase + "metaEval/" + alias}`;

	environment.__logSyntaxError = logSyntaxError;
	environment.__parse = babelParser;

	let wrapperParameters = ["source"].concat(Object.keys(environment)).concat([wrapperSource]);
	let wrapperFunction = Function.prototype.constructor.apply(executable, wrapperParameters);

	let environmentValues = Object.keys(environment).map(function (k) {return environment[k];});
	let wrapperArguments = [source].concat(environmentValues);

	wrapperFunction.apply(executable, wrapperArguments);

	return environment;
};

function logSyntaxError (source, e) {
	if (e.loc) {
		console.error(
			source.split(/\n/).slice(0, e.loc.line).map((l, i) => i + ":\t" + l).join("\n") +
			"\n" + (e.loc.line + "").replace(/./g, "!") + "!\t" + source.split(/\n/)[e.loc.line - 1].slice(0, e.loc.column)
				.replace(/[^\t]/g, "-") + "^"
		);
	}
	console.error(e);
}

// kinda unique id
function createKuid () {
	return 'xxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}
