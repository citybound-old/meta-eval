*This module is part of and developed for [Citybound](http://cityboundsim.com).
At some point in the future it might become generally useful!*

# meta-eval

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Eval for metaprogramming debuggable JavaScript.

Features:
- Babel compilation for ES7
- Nice syntax error formatting

## Purpose

Many parts of Citybound make use of metaprogramming to make some especially black magic possible.
This module provides a simple way to evaluate Javascript code at runtime (given as a string).

The environment that the code will run in is precisely definable.

A source URL is defined for each evaluated piece of code, to make it debuggable in Chrome DevTools - just like a normal JS file.

## Usage Examples

```javascript
import metaEval from 'meta-eval';

const aNameForMyClass = 'HorribleObjectOrientedMessFactoryProviderStrategy';

const source = `

    exports.theActualClass = class ${aNameForMyClass} {

        constructor (magicNumber) {
            this.magicNumber = magicNumber;
        }

        doSomethingSimple () {
            // you will be able to set a breakpoint here, for example!
            return "I'm ${aNameForMyClass} and my magic number is " + this.magicNumber;
        }

    }
`

const environment = {exports: {}};

// this controls how/where the code will show up in DevTools
const alias = aNameForMyClass;
const filename = alias + '.js';
const sourceUrlBase = 'file://myproject/';

// this is where the magic happens
const newEnvironment = metaEval(source, environment, alias, filename, sourceUrlBase, {transpile: true});

const ActualClass = newEnvironment.exports.theActualClass;
const instance = new ActualClass(13);

console.log(instance.doSomethingSimple());
// => "I'm HorribleObjectOrientedMessFactoryProviderStrategy and my magic number is 13"
```

## Contribution

Goals, wishes and bugs are managed as GitHub Issues - if you want to help, have a look there and submit your work as pull requests.
Your help is highly welcome! :)

## License

MIT, see [LICENSE.md](http://github.com/citybound/meta-eval/blob/master/LICENSE.md) for details.
