export const problems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    functionName: "solve",
    testInputs: [
      [[2, 7, 11, 15], 9],
      [[3, 2, 4], 6]
    ],
    starterCode: {
      javascript: `// Two Sum\nfunction solve(nums, target) {\n  // Your code here\n};`,
      python: `# Two Sum\ndef solve(nums, target):\n    # Your code here\n    pass`,
      cpp: `#include <vector>\n#include <iostream>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> solve(vector<int>& nums, int target) {\n        // Your code here\n    }\n};`
    }
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    tags: ["Linked List", "Math"],
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\n\nYou may assume the two numbers do not contain any leading zero, except the number 0 itself.",
    examples: [
      {
        input: "l1 = [2,4,3], l2 = [5,6,4]",
        output: "[7,0,8]",
        explanation: "342 + 465 = 807."
      }
    ],
    constraints: [
      "The number of nodes in each linked list is in the range [1, 100].",
      "0 <= Node.val <= 9",
      "It is guaranteed that the list represents a number that does not have leading zeros."
    ],
    functionName: "solve",
    testInputs: [
      [[2, 4, 3], [5, 6, 4]]
    ],
    starterCode: {
      javascript: `// Add Two Numbers\nfunction solve(l1, l2) {\n  // Your code here\n};`,
      python: `# Add Two Numbers\ndef solve(l1, l2):\n    # Your code here\n    pass`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    void solve() {\n        // Your code here\n    }\n};`
    }
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    tags: ["Hash Table", "String", "Sliding Window"],
    description: "Given a string `s`, find the length of the longest substring without repeating characters.",
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with the length of 3.'
      }
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    functionName: "solve",
    testInputs: [
      ["abcabcbb"],
      ["bbbbb"],
      ["pwwkew"]
    ],
    starterCode: {
      javascript: `// Longest Substring Without Repeating Characters\nfunction solve(s) {\n  // Your code here\n};`,
      python: `# Longest Substring Without Repeating Characters\ndef solve(s):\n    # Your code here\n    pass`,
      cpp: `#include <string>\n#include <iostream>\nusing namespace std;\n\nclass Solution {\npublic:\n    int solve(string s) {\n        // Your code here\n    }\n};`
    }
  },
  {
    id: 4,
    title: "Valid Parentheses",
    difficulty: "Easy",
    tags: ["Stack", "String"],
    description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    examples: [
      {
        input: 's = "()[]{}"',
        output: "true",
        explanation: "The brackets are closed in the correct order."
      }
    ],
    constraints: [
      "1 <= s.length <= 10^4"
    ],
    functionName: "solve",
    testInputs: [
      ["()[]{}"],
      ["(]"],
      ["([)]"]
    ],
    starterCode: {
      javascript: `// Valid Parentheses\nfunction solve(s) {\n  // Your code here\n};`,
      python: `# Valid Parentheses\ndef solve(s):\n    # Your code here\n    pass`,
      cpp: `#include <string>\n#include <iostream>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool solve(string s) {\n        // Your code here\n    }\n};`
    }
  },
  {
    id: 5,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    tags: ["Array", "Dynamic Programming"],
    description: "You are given an array `prices` where prices[i] is the price of a given stock on the ith day. Maximize your profit.",
    examples: [
      {
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation: "Buy on day 2 and sell on day 5."
      }
    ],
    constraints: [
      "1 <= prices.length <= 10^5"
    ],
    functionName: "solve",
    testInputs: [
      [[7, 1, 5, 3, 6, 4]],
      [[7, 6, 4, 3, 1]]
    ],
    starterCode: {
      javascript: `// Best Time to Buy and Sell Stock\nfunction solve(prices) {\n  // Your code here\n};`,
      python: `# Best Time to Buy and Sell Stock\ndef solve(prices):\n    # Your code here\n    pass`,
      cpp: `#include <vector>\n#include <iostream>\nusing namespace std;\n\nclass Solution {\npublic:\n    int solve(vector<int>& prices) {\n        // Your code here\n    }\n};`
    }
  },
  {
    id: 6,
    title: "Merge Sorted Array",
    difficulty: "Easy",
    tags: ["Array", "Two Pointers"],
    description: "Merge two sorted arrays into one sorted array.",
    examples: [
      {
        input: "nums1 = [1,2,3], nums2 = [2,5,6]",
        output: "[1,2,2,3,5,6]",
        explanation: "Merged sorted array."
      }
    ],
    constraints: [
      "1 <= nums1.length, nums2.length <= 200"
    ],
    starterCode: {
      javascript: `// Merge Sorted Array\nfunction merge(nums1, m, nums2, n) {\n  // Your code here\n};`,
      python: `# Merge Sorted Array\ndef merge(nums1, m, nums2, n):\n    # Your code here\n    pass`,
      cpp: `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {\n        // Your code here\n    }\n};`
    }
  },
  {
    id: 7,
    title: "Binary Search",
    difficulty: "Easy",
    tags: ["Array", "Binary Search"],
    description: "Given a sorted array and a target value, return the index if found.",
    examples: [
      {
        input: "nums = [-1,0,3,5,9,12], target = 9",
        output: "4",
        explanation: "9 exists at index 4."
      }
    ],
    constraints: [
      "1 <= nums.length <= 10^4"
    ],
    starterCode: {
      javascript: `// Binary Search\nfunction search(nums, target) {\n  // Your code here\n};`,
      python: `# Binary Search\ndef search(nums, target):\n    # Your code here\n    pass`,
      cpp: `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Your code here\n    }\n};`
    }
  },
  {
    id: 8,
    title: "Reverse Linked List",
    difficulty: "Easy",
    tags: ["Linked List"],
    description: "Reverse a singly linked list.",
    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
        explanation: "The linked list is reversed."
      }
    ],
    constraints: [
      "The number of nodes is in the range [0, 5000]"
    ],
    starterCode: {
      javascript: `// Reverse Linked List\n/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\nfunction reverseList(head) {\n  // Your code here\n};`,
      python: `# Reverse Linked List\n# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\ndef reverseList(head):\n    # Your code here\n    pass`,
      cpp: `/**\n * Definition for singly-linked list.\n * struct ListNode {\n *     int val;\n *     ListNode *next;\n *     ListNode() : val(0), next(nullptr) {}\n *     ListNode(int x) : val(x), next(nullptr) {}\n *     ListNode(int x, ListNode *next) : val(x), next(next) {}\n * };\n */\nclass Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        // Your code here\n    }\n};`
    }
  },
  {
    id: 9,
    title: "Maximum Subarray",
    difficulty: "Medium",
    tags: ["Array", "Dynamic Programming"],
    description: "Find the contiguous subarray with the largest sum.",
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "Subarray [4,-1,2,1] has the largest sum."
      }
    ],
    constraints: [
      "1 <= nums.length <= 10^5"
    ],
    starterCode: {
      javascript: `// Maximum Subarray\nfunction maxSubArray(nums) {\n  // Your code here\n};`,
      python: `# Maximum Subarray\ndef maxSubArray(nums):\n    # Your code here\n    pass`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        // Your code here\n    }\n};`
    }
  },
  {
    id: 10,
    title: "Container With Most Water",
    difficulty: "Medium",
    tags: ["Array", "Two Pointers"],
    description: "Find two lines that together with the x-axis form a container that holds the most water.",
    examples: [
      {
        input: "height = [1,8,6,2,5,4,8,3,7]",
        output: "49",
        explanation: "Maximum water can be stored between lines 2 and 9."
      }
    ],
    constraints: [
      "2 <= height.length <= 10^5"
    ],
    starterCode: {
      javascript: `// Container With Most Water\nfunction maxArea(height) {\n  // Your code here\n};`,
      python: `# Container With Most Water\ndef maxArea(height):\n    # Your code here\n    pass`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        // Your code here\n    }\n};`
    }
  },
  {
    id: 11,
    title: "3Sum",
    difficulty: "Medium",
    tags: ["Array", "Two Pointers", "Sorting"],
    description: "Find all unique triplets in the array which gives the sum of zero.",
    examples: [
      {
        input: "nums = [-1,0,1,2,-1,-4]",
        output: "[[-1,-1,2],[-1,0,1]]",
        explanation: "The unique triplets sum to zero."
      }
    ],
    constraints: [
      "3 <= nums.length <= 3000"
    ],
    starterCode: {
      javascript: `// 3Sum\nfunction threeSum(nums) {\n  // Your code here\n};`,
      python: `# 3Sum\ndef threeSum(nums):\n    # Your code here\n    pass`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        // Your code here\n    }\n};`
    }
  },
  {
    id: 12,
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    tags: ["Array", "Binary Search"],
    description: "Search target in rotated sorted array.",
    examples: [
      {
        input: "nums = [4,5,6,7,0,1,2], target = 0",
        output: "4",
        explanation: "0 is found at index 4."
      }
    ],
    constraints: [
      "1 <= nums.length <= 5000"
    ],
    starterCode: {
      javascript: `// Search in Rotated Sorted Array\nfunction search(nums, target) {\n  // Your code here\n};`,
      python: `# Search in Rotated Sorted Array\ndef search(nums, target):\n    # Your code here\n    pass`,
      cpp: `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Your code here\n    }\n};`
    }
  },
  {
    id: 13,
    title: "Group Anagrams",
    difficulty: "Medium",
    tags: ["Array", "Hash Table", "String"],
    description: "Group the anagrams together.",
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
        explanation: "Grouped based on anagram similarity."
      }
    ],
    constraints: [
      "1 <= strs.length <= 10^4"
    ],
    starterCode: {
      javascript: `// Group Anagrams\nfunction groupAnagrams(strs) {\n  // Your code here\n};`,
      python: `# Group Anagrams\ndef groupAnagrams(strs):\n    # Your code here\n    pass`,
      cpp: `#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<string>> groupAnagrams(vector<string>& strs) {\n        // Your code here\n    }\n};`
    }
  },
  {
    id: 14,
    title: "Kth Largest Element in an Array",
    difficulty: "Medium",
    tags: ["Array", "Heap"],
    description: "Find the kth largest element in an array.",
    examples: [
      {
        input: "nums = [3,2,1,5,6,4], k = 2",
        output: "5",
        explanation: "The 2nd largest element is 5."
      }
    ],
    constraints: [
      "1 <= k <= nums.length"
    ],
    starterCode: {
      javascript: `// Kth Largest Element in an Array\nfunction findKthLargest(nums, k) {\n  // Your code here\n};`,
      python: `# Kth Largest Element in an Array\ndef findKthLargest(nums, k):\n    # Your code here\n    pass`,
      cpp: `#include <vector>\n#include <queue>\nusing namespace std;\n\nclass Solution {\npublic:\n    int findKthLargest(vector<int>& nums, int k) {\n        // Your code here\n    }\n};`
    }
  },
  {
    id: 15,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    tags: ["String", "Dynamic Programming"],
    description: "Return the longest palindromic substring.",
    examples: [
      {
        input: 's = "babad"',
        output: '"bab"',
        explanation: '"bab" is the longest palindrome.'
      }
    ],
    constraints: [
      "1 <= s.length <= 1000"
    ],
    starterCode: {
      javascript: `// Longest Palindromic Substring\nfunction longestPalindrome(s) {\n  // Your code here\n};`,
      python: `# Longest Palindromic Substring\ndef longestPalindrome(s):\n    # Your code here\n    pass`,
      cpp: `#include <string>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    string longestPalindrome(string s) {\n        // Your code here\n    }\n};`
    }
  },
  {
    id: 16,
    title: "Word Break",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "String"],
    description: "Determine if s can be segmented into words from dictionary.",
    examples: [
      {
        input: 's = "leetcode", wordDict = ["leet","code"]',
        output: "true",
        explanation: "leetcode can be segmented as leet + code."
      }
    ],
    constraints: [
      "1 <= s.length <= 300"
    ],
    starterCode: {
      javascript: `// Word Break\nfunction wordBreak(s, wordDict) {\n  // Your code here\n};`,
      python: `# Word Break\ndef wordBreak(s, wordDict):\n    # Your code here\n    pass`,
      cpp: `#include <string>\n#include <vector>\n#include <unordered_set>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool wordBreak(string s, vector<string>& wordDict) {\n        // Your code here\n    }\n};`
    }
  },
  {
    id: 17,
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    tags: ["Linked List", "Heap"],
    description: "Merge k sorted linked lists and return it as one sorted list.",
    examples: [
      {
        input: "lists = [[1,4,5],[1,3,4],[2,6]]",
        output: "[1,1,2,3,4,4,5,6]",
        explanation: "Merged all linked lists into one sorted list."
      }
    ],
    constraints: [
      "k <= 10^4"
    ],
    starterCode: {
      javascript: `// Merge k Sorted Lists\n/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\nfunction mergeKLists(lists) {\n  // Your code here\n};`,
      python: `# Merge k Sorted Lists\n# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\ndef mergeKLists(lists):\n    # Your code here\n    pass`,
      cpp: `/**\n * Definition for singly-linked list.\n * struct ListNode {\n *     int val;\n *     ListNode *next;\n *     ListNode() : val(0), next(nullptr) {}\n *     ListNode(int x) : val(x), next(nullptr) {}\n *     ListNode(int x, ListNode *next) : val(x), next(next) {}\n * };\n */\nclass Solution {\npublic:\n    ListNode* mergeKLists(vector<ListNode*>& lists) {\n        // Your code here\n    }\n};`
    }
  },
  {
    id: 18,
    title: "Trapping Rain Water",
    difficulty: "Hard",
    tags: ["Array", "Stack", "Two Pointers"],
    description: "Compute how much water can be trapped after raining.",
    examples: [
      {
        input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        output: "6",
        explanation: "Total trapped water is 6 units."
      }
    ],
    constraints: [
      "1 <= height.length <= 2 * 10^4"
    ],
    starterCode: {
      javascript: `// Trapping Rain Water\nfunction trap(height) {\n  // Your code here\n};`,
      python: `# Trapping Rain Water\ndef trap(height):\n    # Your code here\n    pass`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int trap(vector<int>& height) {\n        // Your code here\n    }\n};`
    }
  },
  {
    id: 19,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    tags: ["Array", "Binary Search"],
    description: "Find median of two sorted arrays.",
    examples: [
      {
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2.0",
        explanation: "Median value is 2."
      }
    ],
    constraints: [
      "nums1.length + nums2.length <= 2000"
    ],
    starterCode: {
      javascript: `// Median of Two Sorted Arrays\nfunction findMedianSortedArrays(nums1, nums2) {\n  // Your code here\n};`,
      python: `# Median of Two Sorted Arrays\ndef findMedianSortedArrays(nums1, nums2):\n    # Your code here\n    pass`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        // Your code here\n    }\n};`
    }
  },
  {
    id: 20,
    title: "Word Ladder",
    difficulty: "Hard",
    tags: ["Graph", "BFS"],
    description: "Find shortest transformation sequence from beginWord to endWord.",
    examples: [
      {
        input: 'beginWord = "hit", endWord = "cog"',
        output: "5",
        explanation: "Shortest transformation sequence length is 5."
      }
    ],
    constraints: [
      "1 <= wordList.length <= 5000"
    ],
    starterCode: {
      javascript: `// Word Ladder\nfunction ladderLength(beginWord, endWord, wordList) {\n  // Your code here\n};`,
      python: `# Word Ladder\ndef ladderLength(beginWord, endWord, wordList):\n    # Your code here\n    pass`,
      cpp: `#include <string>\n#include <vector>\n#include <unordered_set>\n#include <queue>\nusing namespace std;\n\nclass Solution {\npublic:\n    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {\n        // Your code here\n    }\n};`
    }
  }
];
