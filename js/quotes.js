// Built-in quote collection (data only). IDs are stable slugs; favorites store them.

export const QUOTES = Object.freeze([
  { id: 'abelson-programs-for-people', text: 'Programs must be written for people to read, and only incidentally for machines to execute.', author: 'Harold Abelson' },
  { id: 'fowler-humans-understand', text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.', author: 'Martin Fowler' },
  { id: 'knuth-premature-optimization', text: 'Premature optimization is the root of all evil.', author: 'Donald Knuth' },
  { id: 'dijkstra-simplicity', text: 'Simplicity is prerequisite for reliability.', author: 'Edsger W. Dijkstra' },
  { id: 'dijkstra-testing-bugs', text: 'Testing shows the presence, not the absence of bugs.', author: 'Edsger W. Dijkstra' },
  { id: 'torvalds-show-me-the-code', text: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds' },
  { id: 'beck-make-it-work', text: 'Make it work, make it right, make it fast.', author: 'Kent Beck' },
  { id: 'kay-invent-the-future', text: 'The best way to predict the future is to invent it.', author: 'Alan Kay' },
  { id: 'lao-tzu-single-step', text: 'The journey of a thousand miles begins with a single step.', author: 'Lao Tzu' },
  { id: 'socrates-unexamined-life', text: 'The unexamined life is not worth living.', author: 'Socrates' },
  { id: 'aristotle-well-begun', text: 'Well begun is half done.', author: 'Aristotle' },
  { id: 'jobs-stay-hungry', text: 'Stay hungry, stay foolish.', author: 'Steve Jobs' },
].map((quote) => Object.freeze(quote)));
