/**
 * @type {decide} defaults to a function always returning true
 * @type {revealIsProxy} defaults to false
 * @type {referenceClass} defaults to false
 */
const defaultOptions = {}
defaultOptions.decide = () => true
defaultOptions.revealIsProxy = false
defaultOptions.referenceClass = false

const IS_PROXY = 'isProxy'
const CLASS = 'class'

/**
 * @private checks for a prototype constructor to match an expected value
 */
const check = (value, expected) => {
  const proto = value && Object.getPrototypeOf(value)
  const constructor = proto && proto.constructor
  if (constructor !== expected) {
    const constructorName = constructor && constructor.name
    const expectedName = expected && expected.name
    throw new TypeError(`Expected ${expectedName}, got ${constructorName}.`)
  }
}

/**
 * Creates a factory function that produces proxies to instances of a {class} definition, based on
 * @param ClassDefinition
 * @param options.decide {function} A function that checks the instance's given {key} and {value} of a property and
 *        returns true, if the property is public or false if private.
 * @param options.revealIsProxy {boolean} if true it allows external code to ask for {isProxy} which then returns true
 * @param options.referenceClass {boolean} if true it allows external code to ask for {class} which then returns
 *        the referenced original class definition but never the instance
 * @returns {function} A factory function to produce proxies to an instance
 */
const createFactory = (ClassDefinition, options = defaultOptions) => {
  check(ClassDefinition, Function)
  check(options, Object)

  // we flat-merge the options with the default options
  // to ensure that there are no options missing and the factory
  // doesn't crash at runtime, for example because an options has
  // been explicitly set to null
  const factoryOptions = Object.assign({}, defaultOptions, options)
  const decide = factoryOptions.decide || defaultOptions.decide
  const referenceClass = factoryOptions.referenceClass || defaultOptions.referenceClass
  const revealIsProxy = factoryOptions.revealIsProxy || defaultOptions.revealIsProxy

  /**
   * Creates an instance of the given ClassDefinition
   * @param invocationArgs arguments of arbitrary length, determined by ClassDefinition
   * @return {proxy}
   */
  const factory = (...invocationArgs) => {
    const instance = new ClassDefinition(...invocationArgs)
    const handler = {
      get: function (target, property /*, receiver */) {
        // get proxy by symbol
        if (revealIsProxy && property === IS_PROXY) {
          return true
        }

        // get class by symbol
        if (referenceClass && property === CLASS) {
          return ClassDefinition
        }

        // skip any request to unowned properties
        // using 'in' as a good trade-off between validity and performance
        if (!(property in instance)) {
          return
        }

        // skip members, that don't pass the test,
        // let developer decide how to design tests
        const member = instance[property]
        const includeMember = decide(property, member, ClassDefinition)
        if (!includeMember) {
          return
        }

        // bind functions to the instance to avoid unintended
        // blocking the member function's internals
        if (typeof member === 'function') {
          return member.bind(instance)
        } else {
          return member
        }
      }
    }

    return new Proxy({}, handler)
  }
  return factory
}

export default createFactory
