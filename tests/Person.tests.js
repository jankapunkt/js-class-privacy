export class Person {
  constructor ({ name, age }) {
    this.name = name
    this.age = age
  }

  greet () {
    return `Hello, my name is "${this.name}". I am ${this.age} years old.`
  }
}
