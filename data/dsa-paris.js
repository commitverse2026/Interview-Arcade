
const dsaPairs = [
    {
        term: "Array",
        definition: "A collection of elements stored at contiguous memory locations, allowing O(1) random access"
    },
    {
        term: "Linked List",
        definition: "A linear data structure where elements are stored in nodes, each pointing to the next node"
    },
    {
        term: "Stack",
        definition: "LIFO (Last In First Out) data structure supporting push and pop operations"
    },
    {
        term: "Queue",
        definition: "FIFO (First In First Out) data structure supporting enqueue and dequeue operations"
    },
    {
        term: "Binary Search Tree",
        definition: "A tree where left child < parent < right child, enabling O(log n) search"
    },
    {
        term: "Hash Table",
        definition: "Data structure that maps keys to values using a hash function for O(1) average access"
    },
    {
        term: "Graph",
        definition: "Non-linear data structure consisting of vertices connected by edges"
    },
    {
        term: "Heap",
        definition: "Complete binary tree where parent node is greater (max-heap) or smaller (min-heap) than children"
    },
    {
        term: "Trie",
        definition: "Tree-like structure used for efficient string storage and prefix-based search"
    },
    {
        term: "Quick Sort",
        definition: "Divide-and-conquer sorting algorithm using a pivot element to partition the array"
    },
    {
        term: "Merge Sort",
        definition: "Divide-and-conquer algorithm that divides array, sorts halves, and merges them"
    },
    {
        term: "Binary Search",
        definition: "Efficient algorithm for finding an element in a sorted array by repeatedly dividing search interval"
    },
    {
        term: "Bubble Sort",
        definition: "Simple sorting algorithm that repeatedly steps through list and swaps adjacent elements"
    },
    {
        term: "Depth First Search",
        definition: "Graph traversal algorithm that explores as far as possible along each branch before backtracking"
    },
    {
        term: "Breadth First Search",
        definition: "Graph traversal algorithm that explores all neighbors at the present depth before moving deeper"
    },
    {
        term: "Dynamic Programming",
        definition: "Optimization technique that solves complex problems by breaking into simpler subproblems"
    },
    {
        term: "Recursion",
        definition: "Problem-solving technique where a function calls itself to solve smaller instances"
    },
    {
        term: "AVL Tree",
        definition: "Self-balancing binary search tree where heights of two child subtrees differ by at most one"
    },
    {
        term: "Red-Black Tree",
        definition: "Self-balancing BST with color properties ensuring O(log n) time for operations"
    },
    {
        term: "Dijkstra's Algorithm",
        definition: "Algorithm for finding shortest paths between nodes in a weighted graph"
    }
];

// Function to get random pairs for the game
function getRandomPairs(count = 8) {
    const shuffled = [...dsaPairs];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
}

// Function to shuffle an array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
