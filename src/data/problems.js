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
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]"
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
  }


];
