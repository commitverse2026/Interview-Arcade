// Data file for DSA Match the Following game
// Contains terms and their matching definitions

const DSA_PAIRS = [
    {
        term: "Binary Search Tree",
        definition: "Tree where left child < parent < right child; in-order traversal gives sorted order"
    },
    {
        term: "Hash Table",
        definition: "Key-value store using hash function; average O(1) lookup time"
    },
    {
        term: "Stack",
        definition: "LIFO data structure; push/pop operations at one end"
    },
    {
        term: "Queue",
        definition: "FIFO data structure; enqueue at rear, dequeue from front"
    },
    {
        term: "Linked List",
        definition: "Linear collection of nodes; each node points to next node"
    },
    {
        term: "Heap",
        definition: "Complete binary tree; parent greater (max-heap) or smaller (min-heap) than children"
    },
    {
        term: "Graph",
        definition: "Vertices connected by edges; can be directed or undirected"
    },
    {
        term: "Trie",
        definition: "Prefix tree for efficient string storage and search"
    }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DSA_PAIRS;
}
