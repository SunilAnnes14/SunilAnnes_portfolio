/** Pop-quiz questions the Recruiter asks between reloads. Answer right to earn an item. */
export interface QuizQuestion {
  id: string;
  q: string;
  options: string[];
  /** Index into `options`. */
  answer: number;
  /** One line shown after answering. */
  why: string;
}

export const QUIZ: QuizQuestion[] = [
  {
    id: "http-404",
    q: "What does an HTTP 404 status mean?",
    options: ["Server crashed", "Not found", "Unauthorized", "Too many requests"],
    answer: 1,
    why: "404 is Not Found. 401 is Unauthorized, 429 is Too Many Requests and 500 is a server error.",
  },
  {
    id: "big-o-binary",
    q: "Binary search on a sorted array runs in…",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    answer: 1,
    why: "Each step halves the search space, so it's O(log n).",
  },
  {
    id: "git-undo",
    q: "Which git command makes a new commit that undoes an earlier one?",
    options: ["git reset --hard", "git revert", "git stash", "git checkout"],
    answer: 1,
    why: "git revert adds an inverse commit, so shared history stays intact.",
  },
  {
    id: "js-typeof-null",
    q: 'In JavaScript, typeof null is…',
    options: ['"null"', '"undefined"', '"object"', '"number"'],
    answer: 2,
    why: 'A famous historical bug: typeof null === "object".',
  },
  {
    id: "overfitting",
    q: "A model scores 99% on training data but 60% on new data. That's…",
    options: ["Underfitting", "Overfitting", "Data leakage", "Perfect generalization"],
    answer: 1,
    why: "It memorized the training set instead of learning the pattern: overfitting.",
  },
  {
    id: "css-flex",
    q: "Which CSS property centers flex items along the main axis?",
    options: ["align-items", "justify-content", "text-align", "place-self"],
    answer: 1,
    why: "justify-content works on the main axis; align-items works on the cross axis.",
  },
  {
    id: "sql-join",
    q: "Which SQL join keeps every row from the left table, even without a match?",
    options: ["INNER JOIN", "LEFT JOIN", "CROSS JOIN", "SELF JOIN"],
    answer: 1,
    why: "LEFT JOIN keeps all left rows and fills missing right columns with NULL.",
  },
  {
    id: "rest-idempotent",
    q: "Which HTTP method is NOT idempotent?",
    options: ["GET", "PUT", "DELETE", "POST"],
    answer: 3,
    why: "Repeating a POST can create duplicates; GET, PUT and DELETE end in the same state.",
  },
  {
    id: "angular-signals",
    q: "In Angular, a signal created with computed() is…",
    options: ["Writable", "Read-only and derived", "An RxJS Subject", "A lifecycle hook"],
    answer: 1,
    why: "computed() signals are read-only values derived from other signals.",
  },
  {
    id: "react-key",
    q: "Why does React want a key on list items?",
    options: ["For CSS styling", "To identify items between renders", "For accessibility", "To sort the list"],
    answer: 1,
    why: "Keys let React match items across renders so it updates the right ones.",
  },
  {
    id: "docker-image",
    q: "In Docker, a running instance of an image is called a…",
    options: ["Volume", "Container", "Registry", "Layer"],
    answer: 1,
    why: "Images are the blueprint; containers are running instances of them.",
  },
  {
    id: "precision-recall",
    q: "A spam filter that never misses spam but flags lots of real mail has…",
    options: ["High precision, low recall", "High recall, low precision", "High both", "Low both"],
    answer: 1,
    why: "It catches all spam (high recall) but many flags are wrong (low precision).",
  },
  {
    id: "stack-queue",
    q: "A stack is…",
    options: ["First in, first out", "Last in, first out", "Sorted by priority", "Random access only"],
    answer: 1,
    why: "Stacks are LIFO; queues are FIFO.",
  },
  {
    id: "ts-any",
    q: "In TypeScript, which type is the type-safe alternative to any?",
    options: ["never", "unknown", "object", "void"],
    answer: 1,
    why: "unknown accepts anything but makes you narrow it before use.",
  },
  {
    id: "gradient-descent",
    q: "If the learning rate in gradient descent is too high, training usually…",
    options: ["Converges faster, always", "Overshoots and may diverge", "Stops immediately", "Uses less memory"],
    answer: 1,
    why: "Too-large steps jump past the minimum and can blow up.",
  },
  {
    id: "jwt",
    q: "The middle part of a JWT holds the…",
    options: ["Signature", "Header", "Payload (claims)", "Private key"],
    answer: 2,
    why: "header.payload.signature. The payload holds the claims, so never put secrets there.",
  },
  {
    id: "mongodb",
    q: "MongoDB stores data as…",
    options: ["Tables and rows", "Documents (BSON)", "Key-value pairs only", "Graphs"],
    answer: 1,
    why: "MongoDB is a document database that stores BSON documents in collections.",
  },
  {
    id: "transformer",
    q: "The core mechanism inside a Transformer model is…",
    options: ["Convolution", "Recurrence", "Self-attention", "Decision trees"],
    answer: 2,
    why: '"Attention Is All You Need": self-attention is the heart of Transformers.',
  },
  {
    id: "event-loop",
    q: "In JavaScript, what runs first after the current task: a resolved Promise callback or a setTimeout(…, 0)?",
    options: ["setTimeout", "Promise callback", "They run together", "It's random"],
    answer: 1,
    why: "Promise callbacks are microtasks, which drain before the next timer task.",
  },
  {
    id: "dns",
    q: "DNS turns…",
    options: ["IP addresses into MAC addresses", "Domain names into IP addresses", "HTTP into HTTPS", "Code into binaries"],
    answer: 1,
    why: "DNS is the internet's phone book: names to IP addresses.",
  },
];
