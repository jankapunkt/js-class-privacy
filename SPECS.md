# `primem` Specifications

## Preface note

For our specifications we consider a simple ES6 class definition `Person`:

```javascript
class Person {
  constructor ({ name, age }) {
    this.name = name
    this.age = age
  }
  
  greet () {
    return `Hello, my name is "${this.name}". I am ${this.age} years old.`
  }
} 
```


## Conventions

### Preserving original default

While from a security perspective it would make sense to exclude by default,
this would result in an unusable state, where no member of the Object is accessible,
making it useless to interact with the outside world.

Therefore, the default is to preserver the original as much as possible by default
by including all members if no `decide` function is given.

### Let the user (developer) decide

The `decide` function is provided, because it is the user's (developers) responsibility
to decide the criteria on which basis the members are included / excluded.

It is also the reponsibility of the developers to prevent leakage of information through
this method. The best practice is to exclusively use this function as factory option:

```javascript
const createPerson = primem(Person, { 
  decide: function(key, value, /* ClassDefinition */) {
    // decide based on parameters
    // be careful when passing key or value to an external
    // function to process in order to prevent leakage
    return typeof value === 'function'
  }
})
```




## Factory Parameters

The `primem` factory generation function returns a factory function for
a given ES6 class definition (required) and options (optional).

### Class definition

It must be a `class` definition and must not be an instance of such. 
It throws a TypeError if this condition is not fulfilled.


### Factory options

The factory options can be omitted or an Object with the below described properties.
If it's not

#### decide

There may be the option to include members by providing a function that receives the key (name) of the member
and the respective value and returns a truthy or falsy value.

If none is provided it falls back to a `true` value, which implies full member inclusion.

```javascript
{
  decide: (key, value) => truthy/falsy
}
```


##### Examples

**Whitelist using array**

```javascript
const allowedKeys = ['getName', 'getAge']

{
  decide: (key, value) => allowedKeys.includes(key)
}
```

**Whitelist using RegExp**

```javascript
const allowedKeys = /^get.+$/

{
  decide: (key, value) => allowedKeys.test(key)
}
```

**Whitelist all functions**
```javascript
{
  decide: (key, value) => typeof value === 'function'
}
```

**Blacklist using array**


```javascript
const allowedKeys = ['getName', 'getAge']

{
  decide: (key, value) => !allowedKeys.includes(key)
}
```

**Blacklist using RegExp**

```javascript
const allowedKeys = /^get.+$/

{
  decide: (key, value) => !allowedKeys.test(key)
}
```

**Blacklist functions with \_**

```javascript
const blockedKeys = /^_.+$/

{
  decide: (key, value) => typeof value === 'function' && !blockedKeys.test(key)
}
```