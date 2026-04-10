// data/questions.js
const oopQuestions = [
    {
        text: "What is encapsulation in OOP?",
        options: [
            "a) Hiding internal details and protecting data",
            "b) Creating multiple methods with same name",
            "c) Inheriting properties from parent class",
            "d) Converting one data type to another"
        ],
        correct: 0,
        explanation: "Encapsulation bundles data and methods within a class, hiding internal implementation details."
    },
    {
        text: "Which concept allows a class to have multiple forms?",
        options: [
            "a) Inheritance",
            "b) Polymorphism",
            "c) Abstraction",
            "d) Encapsulation"
        ],
        correct: 1,
        explanation: "Polymorphism allows objects to take multiple forms (method overloading/overriding)."
    },
    {
        text: "What is inheritance?",
        options: [
            "a) Creating multiple instances of a class",
            "b) Hiding data from outside access",
            "c) A class acquiring properties of another class",
            "d) Binding data and methods together"
        ],
        correct: 2,
        explanation: "Inheritance allows a child class to inherit properties and methods from a parent class."
    },
    {
        text: "Which is NOT an OOP principle?",
        options: [
            "a) Inheritance",
            "b) Polymorphism",
            "c) Compilation",
            "d) Encapsulation"
        ],
        correct: 2,
        explanation: "Compilation is a process, not an OOP principle. The four pillars are Encapsulation, Inheritance, Polymorphism, and Abstraction."
    },
    {
        text: "What is abstraction?",
        options: [
            "a) Hiding implementation and showing only functionality",
            "b) Creating multiple objects from a class",
            "c) Converting objects to different types",
            "d) Reusing code through inheritance"
        ],
        correct: 0,
        explanation: "Abstraction hides complex implementation details and shows only essential features."
    },
    {
        text: "What does 'this' keyword refer to in JavaScript class?",
        options: [
            "a) Global object",
            "b) Parent class",
            "c) Current instance of the class",
            "d) Class definition"
        ],
        correct: 2,
        explanation: "'this' refers to the current instance of the class."
    },
    {
        text: "What is method overriding?",
        options: [
            "a) Creating multiple methods with different parameters",
            "b) Child class redefining parent class method",
            "c) Calling parent class method from child class",
            "d) Deleting a method from class"
        ],
        correct: 1,
        explanation: "Method overriding allows a child class to provide specific implementation of a parent class method."
    },
    {
        text: "Which keyword is used for inheritance in JavaScript?",
        options: [
            "a) inherit",
            "b) extends",
            "c) super",
            "d) implements"
        ],
        correct: 1,
        explanation: "'extends' keyword is used to create a child class that inherits from a parent class."
    },
    {
        text: "What is a constructor?",
        options: [
            "a) Method that destroys objects",
            "b) Special method that initializes objects",
            "c) Static method of class",
            "d) Private method of class"
        ],
        correct: 1,
        explanation: "Constructor is a special method that automatically runs when creating a new object."
    },
    {
        text: "What is the difference between class and object?",
        options: [
            "a) Class is instance, object is blueprint",
            "b) Class is blueprint, object is instance",
            "c) Both are same",
            "d) Object cannot be created from class"
        ],
        correct: 1,
        explanation: "Class is a blueprint/template, and object is an actual instance created from that blueprint."
    }
];

// Helper function to get random questions
function getRandomQuestions(count = 5) {
    const shuffled = [...oopQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
}