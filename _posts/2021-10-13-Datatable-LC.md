---
layout: post
permalink: Datatable-LC
datatable: true
---
<html lang="zh">
    <head>
        <meta charset="utf-8" />
        <title>LC DataTables</title>
        <!--样式-->
        <link rel="stylesheet" type="text/css" href="/assets/css/jquery.dataTables.css">
        <!-- jQuery -->
        <script type="text/javascript" charset="utf8" src="/assets/js/jquery.min.js"></script>
        <!-- DataTables -->
        <script type="text/javascript" charset="utf8" src="/assets/js/jquery.dataTables.js"></script>
        <script type="text/javascript">
            $(document).ready(function() {
                var payload = [
                    ["lc0001", "E", "Array", "Two Sum", "HashMap"],
                    ["lc0002", "E", "LinkedList", "Add Two Numbers", ""],
                    ["lc0003", "M", "String", "Longest Substring without Repeating Characters", "滑动窗口"],
                    ["lc0005", "M", "String", "Longest Palindromic Substring", ""],
                    ["lc0006", "M", "String", "ZigZag Conversion", ""],
                    ["lc0008", "M", "String", "String to Integer\(atoi\)", ""],
                    ["lc0010", "M", "String", "Regular Expression Matching", ""],
                    ["lc0012", "M", "String", "Integer to Roman", ""],
                    ["lc0013", "M", "String", "Roman to Integer", ""],
                    ["lc0014", "M", "String", "Longest Common Prefix", ""],
                    ["lc0015", "M", "Array", "3Sum", ""],
                    ["lc0016", "M", "Array", "3Sum Closest", ""],
                    ["lc0017", "M", "String", "Letter Combinations of a Phone Number", ""],
                    ["lc0018", "M", "Array", "4Sum", ""],
                    ["lc0022", "M", "String", "Generate Parentheses", ""],
                    ["lc0026", "M", "Array", "Remove Duplicates from Sorted Array", ""],
                    ["lc0027", "M", "Array", "Remove Element", ""],
                    ["lc0028", "M", "String", "Implement substr", ""],
                    ["lc0030", "M", "Two Pointers", "Substring with Concatenation of All Words", ""],
                    ["lc0033", "M", "Array", "Search in Rotated Sorted Array", ""],
                    ["lc0034", "M", "Array", "Find First and Last Position of Element in Sorted Array \(Search for a Range\)", ""],
                    ["lc0035", "M", "Array", "Search Insertion Position", ""],
                    ["lc0037", "M", "Backtracking", "Sudoku Solver", ""],
                    ["lc0038", "M", "String", "Count and Say", ""],
                    ["lc0039", "M", "Backtracking", "Combination Sum", ""],
                    ["lc0040", "M", "Backtracking", "Combination Sum II", ""],
                    ["lc0042", "M", "Stack", "Trapping Rain Water", ""],
                    ["lc0043", "M", "String", "Multiply Strings", ""],
                    ["lc0045", "M", "DP, Greedy", "Jump Game II", ""],
                    ["lc0046", "M", "Backtracking", "Permutations", ""],
                    ["lc0047", "M", "Backtracking", "Permutations II", ""],
                    ["lc0049", "M", "String", "Group Anagrams", ""],
                    ["lc0050", "M", "Binary Search", "Power\(x, n\)", ""],
                    ["lc0051", "M", "Backtracking", "N-Queens", ""],
                    ["lc0053", "M", "Array", "Maximum Subarray", ""],
                    ["lc0055", "M", "DP, Greedy", "Jump Game", ""],
                    ["lc0065", "M", "String", "Valid Number", ""],
                    ["lc0067", "M", "String", "Add Binary", ""],
                    ["lc0069", "M", "Binary Search", "Sqrt\(x\)", ""],
                    ["lc0074", "M", "Array", "Search a 2D Matrix", ""],
                    ["lc0075", "M", "", "**75 Sort Colors**", ""],
                    ["lc0076", "M", "Two Pointers", "Minimum Window Substring", ""],
                    ["lc0077", "M", "Backtracking", "Combinations", ""],
                    ["lc0078", "M", "Backtracking", "Subsets", ""],
                    ["lc0079", "M", "Backtracking", "Word Search", ""],
                    ["lc0080", "M", "Array", "Remove Duplicates from Sorted Array II", ""],
                    ["lc0081", "M", "Array", "Search in Rotated Sorted Array II", ""],
                    ["lc0084", "M", "Array", "Largest Rectangle in Histogram", ""],
                    ["lc0085", "M", "Array", "Maximum Rectangle", ""],
                    ["lc0088", "M", "Array", "Merge Sorted Array", ""],
                    ["lc0089", "M", "Backtracking", "Gray Code", ""],
                    ["lc0090", "M", "Backtracking", "Subsets II", ""],
                    ["lc0093", "M", "Backtracking", "Restore IP Addresses", ""],
                    ["lc0118", "M", "Array", "Pascal's Triangle", ""],
                    ["lc0119", "M", "Array", "Pascal's Triangle II", ""],
                    ["lc0125", "M", "Two Pointers", "Valid Palindrome", ""],
                    ["lc0127", "M", "BFS", "Word Ladder", ""],
                    ["lc0133", "M", "Graph", "Clone Graph", ""],
                    ["lc0134", "M", "Greedy", "Gas Station", ""],
                    ["lc0135", "M", "Greedy", "Candy", ""],
                    ["lc0146", "M", "Design", "LRU Cache", "1. Hashmap + Double Linkedlist 2. LinkedHashMap"],
                    ["lc0149", "H", "Math", "Max Point On a Line", ""],
                    ["lc0150", "M", "Stack", "Evaluate Reverse Polish Notation", ""],
                    ["lc0151", "M", "String", "Reverse Words in a String", ""],
                    ["lc0152", "M", "Array", "Maximum Product Subarray", ""],
                    ["lc0153", "M", "Array", "Find Minimum in Rotated Sorted Array", ""],
                    ["lc0155", "M", "Stack", "Min Stack", ""],
                    ["lc0159", "M", "Two Pointers", "Longest Substring with At Most Two Distinct Characters", ""],
                    ["lc0162", "M", "Array", "Find Peak Element", ""],
                    ["lc0164", "M", "", "**Maximum Gap**", ""],
                    ["lc0165", "M", "String", "Compare Version Number", ""],
                    ["lc0167", "M", "Array", "2Sum II - Input Array is Sorted", ""],
                    ["lc0169", "M", "Array", "Majority Element", ""],
                    ["lc0170", "M", "Array", "2Sum III - Data Structure Design", ""],
                    ["lc0171", "M", "Math", "Excel Sheet Column Number", ""],
                    ["lc0172", "M", "Math", "Factorial Trailing Zeros", ""],
                    ["lc0179", "M", "", "**Largest Number**", ""],
                    ["lc0199", "M", "Tree, BFS", "Binary Tree Right Side View", ""],
                    ["lc0205", "M", "Hashtable", "Isomorphic Strings", ""],
                    ["lc0207", "M", "Graph", "Course Schedule", ""],
                    ["lc0208", "M", "Trie", "Implement Trie \(Prefix Tree\)", ""],
                    ["lc0209", "M", "Sliding Window", "Minimize Size SubArray Sum", ""],
                    ["lc0210", "M", "Graph", "Course Schedule II", ""],
                    ["lc0211", "M", "Trie", "Add and Search Word - Data Structure Design", ""],
                    ["lc0212", "M", "Trie", "Word Search II", ""],
                    ["lc0215", "M", "Divide and Conquer", "Kth Largest Element in an Array", ""],
                    ["lc0218", "M", "Sweep Line", "The Skyline Problem", ""],
                    ["lc0223", "M", "Math", "Rectangle Area", ""],
                    ["lc0224", "M", "Stack", "Basic Calculator", ""],
                    ["lc0227", "M", "String", "Basic Calculator II", ""],
                    ["lc0232", "M", "Stack", "Implement Queue using Stacks", ""],
                    ["lc0239", "M", "Heap", "Sliding Window Maximum", ""],
                    ["lc0240", "M", "Array", "Search a 2D Matrix II", ""],
                    ["lc0241", "M", "Divide and Conquer", "Different Ways to Add Parentheses", ""],
                    ["lc0244", "M", "Hashtable", "Shortest Word Distance II $", ""],
                    ["lc0252", "M", "", "Meeting Rooms", ""],
                    ["lc0253", "M", "", "Meeting Rooms II", ""],
                    ["lc0258", "M", "Math", "Add Digits", ""],
                    ["lc0259", "M", "Array", "3Sum Smaller", ""],
                    ["lc0263", "M", "Math", "Ugly Number", ""],
                    ["lc0264", "M", "Math", "Ugly Number II", ""],
                    ["lc0269", "M", "Graph", "Alien Dictionary", ""],
                    ["lc0271", "M", "String", "Encode and Decode Strings", ""],
                    ["lc0273", "M", "String", "Integer to English Words", ""],
                    ["lc0274", "M", "", "H-Index", ""],
                    ["lc0275", "M", "", "H-Index II", ""],
                    ["lc0277", "M", "Graph", "Find the Celebrity", ""],
                    ["lc0278", "E", "First Bad Version", ""],
                    ["lc0280", "M", "", "**280 Wiggle Sort**", ""],
                    ["lc0282", "M", "Backtracking", "Expression Add Operators", ""],
                    ["lc0284", "M", "Design", "Peeking Iterator", ""],
                    ["lc0290", "M", "Hashtable", "Word Pattern", ""],
                    ["lc0295", "M", "Heap", "Find Median from Data Stream", ""],
                    ["lc0299", "M", "Hashtable", "Bulls and Cows", ""],
                    ["lc0301", "M", "BFS", "Remove Invalid Parentheses", ""],
                    ["lc0303", "M", "Design", "Range Sum Query - Immutable", ""],
                    ["lc0306", "M", "Backtracking", "Additive Number", ""],
                    ["lc0307", "M", "Design", "Range Sum Query - Mutable", ""],
                    ["lc0313", "M", "Math", "Super Ugly Number", ""],
                    ["lc0315", "M", "Segment Tree", "Count of Smaller Numbers After Self", ""],
                    ["lc0316", "M", "String", "Remove Duplicate Letters", ""],
                    ["lc0319", "M", "Math", "Bulb Switcher", ""],
                    ["lc0336", "M", "Hashtable", "Palindrome Pairs", ""],
                    ["lc0341", "M", "Stack", "Flatten Nested List Iterator", ""],
                    ["lc0344", "M", "String", "Reverse String", ""],
                    ["lc0345", "M", "String", "Reverse Vowels of a String", ""],
                    ["lc0346", "M", "Queue", "Moving Average from Data Stream", ""],
                    ["lc0348", "M", "Design", "Design Tic-Tac-Toe", ""],
                    ["lc0355", "M", "Design", "Design Twitter", ""],
                    ["lc0373", "M", "Heap", "Find K Pairs with Smallest Sums", ""],
                    ["lc0377", "M", "Backtracking", "Combination Sum IV", ""],
                    ["lc0378", "M", "Kth Smallest Element in a Sorted Matrix", ""],
                    ["lc0380", "M", "Design", "Insert Delete GetRandom O\(1\)", ""],
                    ["lc0383", "M", "String", "Ransom Note", ""],
                    ["lc0387", "M", "String", "First Unique Character in a String", ""],
                    ["lc0402", "M", "Stack", "Remove k Digits", ""],
                    ["lc0406", "M", "Greedy", "Queue Reconstruction by Height", ""],
                    ["lc0407", "M", "Stack", "Trapping Rain Water II", ""],
                    ["lc0409", "M", "Hashtable", "Longest Palindrome", ""],
                    ["lc0436", "M", "Sweep Line", "Find Right Interval", ""],
                    ["lc0445", "M", "LinkedList", "Add Two Numbers II", ""],
                    ["lc0452", "M", "Greedy", "Minimum Number of Arrows to Burst Balloons", ""],
                    ["lc0455", "M", "Greedy", "Assign Cookies", ""],
                    ["lc0460", "H", "Design", "LFU", ""],
                    ["lc0490", "M", "BFS", "The Maze", ""],
                    ["lc0505", "M", "BFS", "The Maze II", ""],
                    ["lc0508", "M", "Tree", "Most Frequent Subtree Sum", ""],
                    ["lc0525", "M", "Hashtable", "Contiguous Array", ""],
                    ["lc0547", "H", "Design", "Friend Circles", ""],
                    ["lc0557", "M", "String", "Reverse Words in a String III", ""],
                    ["lc0560", "M", "Array", "Subarray Sum Equals K", ""],
                    ["lc0611", "M", "Array", "Valid Triangle Number", ""],
                    ["lc0621", "M", "Queue", "Task Scheduler", ""],
                    ["lc0622", "M", "Design", "Design Circular Queue", ""],
                    ["lc0642", "M", "Design", "Design Search Autocomplete System", ""],
                    ["lc0645", "M", "Hashtable", "Set Mismatch", ""],
                    ["lc0657", "M", "String", "Judge Route Cycle", ""],
                    ["lc0702", "M", "Search in a Sorted Array of Unknown Size", ""],
                    ["lc0703", "M", "Heap", "Kth Largest Element in a Stream", ""],
                    ["lc0704", "M", "Binary Search", "Binary Search", ""],
                    ["lc0743", "M", "Graph", "Network Delay Time", ""],
                    ["lc0779", "M", "Recursion", "K-th Symbol in Grammar", ""],
                    ["lc0804", "M", "String", "Unique Morse Code Words", ""],
                    ["lc0814", "M", "Tree", "Binary Tree Pruning", ""],
                    ["lc0819", "M", "String", "Most Common Word", ""],
                    ["lc0842", "M", "Backtracking", "Split Array into Fibonacci Sequence", ""],
                    ["lc0846", "M", "Hashtable", "Hand of Straights", ""],
                    ["lc0860", "M", "Greedy", "Lemonade Change", ""],
                    ["lc0904", "M", "Two Pointers", "Fruits Into Basket", ""],
                    ["lc0912", "M", "Sort", "Sort Array", ""],
                    ["lc0929", "M", "String", "Unique Email Address", ""],
                    ["lc0946", "M", "Stack", "Validate Stack Sequence", ""],
                    ["lc0973", "M", "Divide and Conquer", "K Closest Points from Origin", ""],
                    ["lc0986", "M", "Two Pointers", "Interval List Intersections", ""],
                    ["lc0994", "M", "BFS", "Rotting Oranges", ""],
                    ["lc1011", "M", "Capacity To Ship Packages Within D Days", ""],
                    ["lc1046", "M", "Queue", "Last Stone Weight", ""],
                    ["lc1071", "M", "String", "Greatest Common Divisor of Strings", ""],
                    ["lc1197", "M", "BFS", "Minimum Knight Moves", ""],
                    ["lc1248", "M", "Sliding Window", "Count Number of Nice Subarrays", ""],
                    ["lc1371", "M", "String", "Find the Longest Substring Containing Vowels in Even Counts", ""]
                    ];
                $('#lc').DataTable({
                    data: payload,
                    columnDefs: [
                        {
                            targets:[3], // for links
                            render: function ( data, type, row, meta ) {
                                if(type != null){
                                    var theLink = '<a href='+row[0]+'>'+data+'</a>';
                                    console.log("theLink: " + theLink);
                                    return theLink;
                                } else {
                                    return "";
                                }
                            }
                        }
                    ]      
                });
                // $('#lc').DataTable();
            });
        </script>
    </head>
    <body>
        <table id="lc" class="display" cellspacing="0" width="100%">
            <thead>
                <tr>
                    <th>#</th>
                    <th>难度</th>
                    <th>题目类型</th>
                    <th>题解链接</th>
                    <th>简单总结</th>
                </tr>
            </thead>
            <tfoot>
                <tr>
                    <th>#</th>
                    <th>难度</th>
                    <th>题目类型</th>
                    <th>题解链接</th>
                    <th>简单总结</th>
                </tr>
            </tfoot>
        </table>

    </body>

</html>
