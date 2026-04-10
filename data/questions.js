/**
 * OOP multiple-choice questions for Tic Tac Toe loser quiz.
 * Each item: q, options (4 strings), correct (0–3 index), explanation (shown on wrong pick).
 */
window.OOP_QUESTIONS = [
  {
    q: 'Which pillar of OOP describes bundling data with the methods that operate on it, often hiding internal details?',
    options: ['Polymorphism', 'Encapsulation', 'Inheritance', 'Abstraction'],
    correct: 1,
    explanation: 'Encapsulation bundles state and behavior together and controls access (e.g., private fields), hiding implementation details.'
  },
  {
    q: 'Runtime polymorphism in many OOP languages is most commonly achieved via:',
    options: ['Method overloading only', 'Operator overloading only', 'Method overriding (virtual / dynamic dispatch)', 'Macros'],
    correct: 2,
    explanation: 'Overriding a method in a subclass lets the program call the correct implementation at runtime based on the actual object type.'
  },
  {
    q: 'Inheritance primarily models which relationship?',
    options: ['Has-a', 'Uses-a', 'Is-a', 'Depends-on'],
    correct: 2,
    explanation: 'Inheritance expresses an is-a relationship: a subclass is a specialized kind of its superclass.'
  },
  {
    q: 'Which statement best describes abstraction?',
    options: [
      'Hiding variables inside a class',
      'Exposing only essential behavior while hiding complexity',
      'Allowing one interface for many implementations',
      'Copying code from a base class'
    ],
    correct: 1,
    explanation: 'Abstraction focuses on what an object does (essential interface) rather than how every detail works internally.'
  },
  {
    q: 'Compile-time polymorphism often refers to:',
    options: ['Method overriding', 'Method overloading', 'Garbage collection', 'Reflection'],
    correct: 1,
    explanation: 'Overloading resolves which method to call based on signatures at compile time in statically typed languages.'
  },
  {
    q: 'A class that cannot be instantiated and may define abstract methods is called:',
    options: ['A sealed class', 'An abstract class', 'A static class', 'A friend class'],
    correct: 1,
    explanation: 'Abstract classes are meant to be extended; they may leave some methods for subclasses to implement.'
  },
  {
    q: 'Encapsulation is strengthened by:',
    options: ['Public fields everywhere', 'Controlled access via getters/setters or accessors', 'Global variables', 'Multiple inheritance only'],
    correct: 1,
    explanation: 'Accessors and visibility modifiers let you enforce invariants while still exposing a minimal interface.'
  },
  {
    q: 'The Liskov Substitution Principle says that:',
    options: [
      'Subclasses should be replaceable for their base types without breaking correctness',
      'Every class must have exactly one parent',
      'Interfaces cannot have default methods',
      'Private methods must be virtual'
    ],
    correct: 0,
    explanation: 'If you substitute a subclass where a base type is expected, behavior should remain valid for clients.'
  },
  {
    q: 'Composition (object fields) vs inheritance — composition favors:',
    options: [
      'Tight coupling to base class internals',
      'Flexible has-a relationships and easier change',
      'Eliminating interfaces',
      'Faster compilation only'
    ],
    correct: 1,
    explanation: 'Composition builds behavior by combining objects, often reducing fragile coupling to inheritance hierarchies.'
  },
  {
    q: 'An interface in OOP typically emphasizes:',
    options: ['Implementation details', 'What operations are available, not how they are coded', 'Heap allocation only', 'Inheritance depth'],
    correct: 1,
    explanation: 'Interfaces define contracts — the operations types must support — leaving implementation to classes.'
  },
  {
    q: 'Polymorphism allows:',
    options: [
      'Only one subclass per base class',
      'Different classes to be treated uniformly through a shared interface or base type',
      'Only static methods',
      'No virtual methods'
    ],
    correct: 1,
    explanation: 'Polymorphism lets you write code against a common type while actual behavior varies by concrete class.'
  },
  {
    q: 'Which is an example of encapsulation?',
    options: [
      'A subclass overriding a method',
      'Keeping a balance field private and exposing deposit() / withdraw()',
      'Two classes with the same name in one file',
      'Using multiple return types'
    ],
    correct: 1,
    explanation: 'Hiding internal state and exposing controlled operations is classic encapsulation.'
  },
  {
    q: 'Diamond problem is most associated with:',
    options: [
      'Single inheritance',
      'Multiple inheritance where the same base appears along different paths',
      'Interfaces only',
      'Garbage collection'
    ],
    correct: 1,
    explanation: 'Ambiguity can arise when a class inherits the same base through more than one path in a multiple-inheritance graph.'
  },
  {
    q: 'A constructor’s main role is typically to:',
    options: ['Destroy objects', 'Initialize new object state', 'Compile the program', 'Serialize to JSON only'],
    correct: 1,
    explanation: 'Constructors set up initial state when an instance is created.'
  },
  {
    q: 'Method overriding requires:',
    options: [
      'Different class name only',
      'A subclass providing a new implementation for a method defined in an ancestor',
      'Same parameter types in unrelated classes',
      'Static binding only'
    ],
    correct: 1,
    explanation: 'Overriding replaces or extends inherited instance behavior in a subclass, resolved dynamically in many languages.'
  }
];

/**
 * Aptitude & reasoning MCQs for the timed Aptitude Quiz module.
 * Same shape as OOP: q, options (4), correct (0–3), explanation (after wrong or timeout).
 */
window.APTITUDE_QUESTIONS = [
  {
    q: 'A number series: 3, 7, 15, 31, 63, … What is the next term?',
    options: ['95', '111', '127', '129'],
    correct: 2,
    explanation: 'Terms follow 2ⁿ−1: 2²−1=3, 2³−1=7, … 2⁶−1=63, so next is 2⁷−1=127.'
  },
  {
    q: 'If 15% of a number is 45, what is the number?',
    options: ['200', '250', '300', '350'],
    correct: 2,
    explanation: 'Let the number be N. Then 0.15N = 45, so N = 45 / 0.15 = 300.'
  },
  {
    q: 'A train 180 m long crosses a pole in 9 seconds. What is its speed in km/h?',
    options: ['60 km/h', '72 km/h', '80 km/h', '90 km/h'],
    correct: 1,
    explanation: 'Speed = 180 m / 9 s = 20 m/s. Convert: 20 × (18/5) = 72 km/h.'
  },
  {
    q: 'If A is 20% more than B, then B is approximately what percent less than A?',
    options: ['About 12.5%', 'About 16.67%', 'About 20%', 'About 25%'],
    correct: 1,
    explanation: 'Let B = 100, then A = 120. B is (20/120)×100 ≈ 16.67% less than A.'
  },
  {
    q: 'Odd one out:',
    options: ['17', '23', '27', '31'],
    correct: 2,
    explanation: '27 is composite (3×9); 17, 23, and 31 are prime numbers.'
  },
  {
    q: 'In a certain code, HAND is written as IBOE (each letter shifted by +1). How is YEAR coded?',
    options: ['ZFBS', 'ZFBT', 'YFBS', 'ZEBS'],
    correct: 0,
    explanation: 'Each letter moves one step forward in the alphabet: Y→Z, E→F, A→B, R→S, giving ZFBS.'
  },
  {
    q: 'At 3:15, the angle between the hour and minute hands of a clock is closest to:',
    options: ['0°', '7.5°', '15°', '90°'],
    correct: 1,
    explanation: 'Minute hand at 3; hour hand has moved ¼ of the way from 3 to 4 (7.5° from 3), so the gap is about 7.5°.'
  },
  {
    q: 'If the day after tomorrow is Wednesday, what day was it yesterday?',
    options: ['Saturday', 'Sunday', 'Monday', 'Tuesday'],
    correct: 1,
    explanation: 'Day after tomorrow = Wednesday ⇒ tomorrow = Tuesday ⇒ today = Monday ⇒ yesterday = Sunday.'
  },
  {
    q: 'A pipe fills a tank in 12 hours. Another empties it in 18 hours. If both are open, the net part of the tank filled in one hour is:',
    options: ['1/36', '1/12', '1/6', '5/36'],
    correct: 0,
    explanation: 'Net rate per hour = 1/12 − 1/18 = (3−2)/36 = 1/36 of the tank.'
  },
  {
    q: 'In a row of boys, Raj is 7th from the left and 12th from the right. How many boys are in the row?',
    options: ['17', '18', '19', '20'],
    correct: 1,
    explanation: 'Total = position from left + position from right − 1 = 7 + 12 − 1 = 18.'
  }
];
