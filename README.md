# :lock: Javascript Class-Privacy

[![Build Status](https://travis-ci.org/jankapunkt/npm-package-template.svg?branch=master)](https://travis-ci.org/jankapunkt/js-class-privacy)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Project Status: Active – The project has reached a stable, usable state and is being actively developed.](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)
![npm bundle size](https://img.shields.io/bundlephobia/min/class-privacy)


Lean dry no-dep srp :cup: package to create instances from classes with defined private members.
Keep your classes clean und use this instead to define private properties.
Uses proxies to hide information.

## Installation and basic usage

Install this package via NPM like

```bash
$ npm install class-privacy
```

The packages exports only one function, that acts similar to an abstract factory.
You can pass in a `decide` function to define rules (e.g. whitelist)
for members. The created factory can be used to create (proxies to) instances that
contain only the public members.

```javascript
import createFactory from 'class-privacy'

export class Person {
  constructor ({ name, age }) {
    this.name = name
    this.age = age
  }

  greet () {
    return `Hello, my name is "${this.name}". I am ${this.age} years old.`
  }
}

// make all functions public, all other members are private
// it is your responsibility to prevent leakage of information
// for example if value is passed to external functions that aid
// for a decision. 
// Think twice, before you pass value to third party libraries.
const decide = (key, value) => typeof value === 'function'

// create the factory for private persons 
const createPrivatePerson = createFactory(Person, { decide })

const anon = createPrivatePerson({ name: 'John Doe', age: 42 })
anon.name // undefined
anon.age // undefined
anon.greet() // `Hello, my name is "John Doe". I am 42 years old.`
```

### Options

As shown in the example above, the factory can be created with certain
configurations, defined as `options`:

#### `decide`

A function that is invoked on every access request (proxy `get` trap) 
and receives `key`, `value` and `ClassDefinition` to decide, whether
this value should be allowed to be public or kept being private.

Signature:

```javascript
decide: (key, value, ClassDefinition) => Boolean
```

Non-boolean return values are evaluated as truthy/falsy.

If not passed, all members are included by default to preserve the original
state.

#### `revealIsProxy`

If this option is set to `true` the `isProxy` property will be added to the
proxy in order to allow a classification of the Object as proxy.

```javascript
import createFactory from 'class-privacy'

export class Person {
  constructor ({ name, age }) {
    this.name = name
    this.age = age
  }

  greet () {
    return `Hello, my name is "${this.name}". I am ${this.age} years old.`
  }
}

const createPrivatePerson = createFactory(Person, { revealIsProxy: true })
const anon = createPrivatePerson({ name: 'John Doe', age: 42 })
anon.isProxy // true
```

#### `referenceClass`

If this option is set to `true` the `class` property will be added to the
proxy in order to allow a classification of the instance as proxy to the given 
class definition.

```javascript
import createFactory from 'class-privacy'

export class Person {
  constructor ({ name, age }) {
    this.name = name
    this.age = age
  }

  greet () {
    return `Hello, my name is "${this.name}". I am ${this.age} years old.`
  }
}

const createPrivatePerson = createFactory(Person, { referenceClass: true })
const anon = createPrivatePerson({ name: 'John Doe', age: 42 })
anon.class === Person // true
```

## Code Quality

We use `standard` as opinionated but zero-config linter.
You can run lint in two modes:

##### lint 
 
```bash
$ npm run lint
``` 

##### lint with auto fixing

```bash
$ npm run lint:fix
``` 

## Run the tests

We use mocha and chai with a mostly (but not strict) behavioural style for testing.
You can run the tests in three different contexts:

##### Single run

```bash
$ npm run test
``` 

##### Watch mode

```bash
$ npm run test:watch
``` 

##### Coverage

```bash
$ npm run test:coverage
``` 

## Documentation

Documentation is using jsDoc and is available as [html](docs/index.html) or [markdown](api.md) version.

To build the documentation in development, you need to run 

```bash
$ npm run docs
``` 

## Build the package

The package can be build into the `dist` folder using `babel` and the respective script:

```bash
$ npm run build
```


## License

MIT, see [license file](LICENSE)
