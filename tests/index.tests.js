import { describe, it } from 'mocha'
import { expect } from 'chai'
import { Person } from './Person.tests'
import createFactory from '../lib'

describe(createFactory.name, function () {

  describe('create factory function', function () {
    it('throws if the required class definition is not a valid class', function () {
      expect(() => createFactory()).to.throw('Expected Function, got undefined.')
    })
    it('throws if the given options is not an Object', function () {
      expect(() => createFactory(Person, 42)).to.throw('Expected Object, got Number.')
    })
    it('crates a new factory without any further options', function () {
      const factory = createFactory(Person)
      expect(factory).to.be.a('function')
      expect(factory.name).to.equal(`factory`)
    })
  })

  describe('product', function () {
    it ('is a proxy object of the original class definition', function () {
      const createPrivatePerson = createFactory(Person, { revealIsProxy: true })
      const args = { name: 'John Doe', age: 42 }
      const privatePerson = createPrivatePerson(args)
      expect(privatePerson.isProxy).to.equal(true)
    })
    it ('reveals the relation to the original class definition if configured', function () {
      const createPrivatePerson = createFactory(Person, { referenceClass: true })
      const args = { name: 'John Doe', age: 42 }
      const privatePerson = createPrivatePerson(args)
      expect(privatePerson.class).to.equal(Person)
    })
    it ('creates an instance with all members if no inclusion criteria is defined', function () {
      const createPrivatePerson = createFactory(Person)
      const args = { name: 'John Doe', age: 42 }
      const privatePerson = createPrivatePerson(args)
      const publicPerson = new Person(args)

      expect(privatePerson.class).to.equal(undefined)
      expect(privatePerson.name).to.equal(publicPerson.name)
      expect(privatePerson.age).to.equal(publicPerson.age)
      expect(privatePerson.greet()).to.equal(publicPerson.greet())
    })
  })

  describe('decide',function () {
    it ('allows to white-list members by name', function () {
      const allowedKeys = ['name', 'age']
      const decide = (key) => allowedKeys.includes(key)
      const factory = createFactory(Person, { decide })
      const args = { name: 'Quiet Joe', age: 66 }
      const quietPerson = factory(args)
      expect(quietPerson.name).to.equal(args.name)
      expect(quietPerson.age).to.equal(args.age)
      expect(quietPerson.greet).to.equal(undefined)
    })
    it ('allows to white-list members by type', function () {
      const decide = (key, value) => typeof value === 'function'
      const factory = createFactory(Person, { decide })
      const args = { name: 'Quiet Joe', age: 66 }
      const publicPerson = new Person(args)
      const quietPerson = factory(args)
      expect(quietPerson.name).to.equal(undefined)
      expect(quietPerson.age).to.equal(undefined)
      expect(quietPerson.greet()).to.equal(publicPerson.greet())
    })
    it ('allows to black-list members by name', function () {
      const blockedKeys = ['greet']
      const decide = (key) => !blockedKeys.includes(key)
      const factory = createFactory(Person, { decide })
      const args = { name: 'Quiet Joe', age: 66 }
      const quietPerson = factory(args)
      expect(quietPerson.name).to.equal(args.name)
      expect(quietPerson.age).to.equal(args.age)
      expect(quietPerson.greet).to.equal(undefined)
    })
    it ('allows to black-list members by type', function () {
      const blockedTypes = ['string', 'number']
      const decide = (key, value) => !blockedTypes.includes(typeof value)
      const factory = createFactory(Person, { decide })
      const args = { name: 'Quiet Joe', age: 66 }
      const publicPerson = new Person(args)
      const quietPerson = factory(args)
      expect(quietPerson.name).to.equal(undefined)
      expect(quietPerson.age).to.equal(undefined)
      expect(quietPerson.greet()).to.equal(publicPerson.greet())
    })
  })

  describe('leakage prevention', function () {
    it ('does not leak a reference to the instance via any symbol', function () {
      const decide = (key, value) => typeof value === 'function'
      const factory = createFactory(Person, { decide })
      const args = { name: 'Quiet Joe', age: 66 }
      const quietPerson = factory(args)

      // try to get original Object
      const allSymbols = Object.getOwnPropertySymbols(quietPerson)
      expect(allSymbols.length).to.equal(0)
    })
    it ('does not leak a reference to the instance via Reflect.ownKeys', function () {
      const decide = (key, value) => typeof value === 'function'
      const factory = createFactory(Person, { decide })
      const args = { name: 'Quiet Joe', age: 66 }
      const quietPerson = factory(args)

      // try to get original Object
      const proxyDetails = process.binding('util').getProxyDetails(quietPerson)
      const originalObject = proxyDetails[0]
      const allKeys = Reflect.ownKeys(originalObject)
      expect(allKeys.length).to.equal(0)
    })
    it ('does not leak a reference to the instance via String casting', function () {
      const decide = (key, value) => typeof value === 'function'
      const factory = createFactory(Person, { decide })
      const args = { name: 'Quiet Joe', age: 66 }
      const quietPerson = factory(args)
      const greet = String(quietPerson.greet)
      expect(greet.indexOf(args.name)).to.equal(-1)
    })
  })
})
