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
                    ["lc0015", "M", "Array", "3Sum", ""],
                    ["lc0016", "M", "Array", "3Sum Closest", ""],
                    ["lc0018", "M", "Array", "4Sum", ""],
                    ["lc0026", "M", "Array", "Remove Duplicates from Sorted Array", ""],
                    ["lc0027", "M", "Array", "Remove Element", ""],
                    ["lc0033", "M", "Array", "Search in Rotated Sorted Array", ""],
                    ["lc0034", "M", "Array", "Find First and Last Position of Element in Sorted Array \(Search for a Range\)", ""],
                    ["lc0035", "M", "Array", "Search Insertion Position", ""],
                    ["lc0053", "M", "Array", "Maximum Subarray", ""],
                    ["lc0074", "M", "Array", "Search a 2D Matrix", ""],
                    ["lc0080", "M", "Array", "Remove Duplicates from Sorted Array II", ""],
                    ["lc0081", "M", "Array", "Search in Rotated Sorted Array II", ""],
                    ["lc0084", "M", "Array", "Largest Rectangle in Histogram", ""],
                    ["lc0085", "M", "Array", "Maximum Rectangle", ""],
                    ["lc0088", "M", "Array", "Merge Sorted Array", ""],
                    ["lc0118", "M", "Array", "Pascal's Triangle", ""],
                    ["lc0119", "M", "Array", "Pascal's Triangle II", ""],
                    ["lc0146", "M", "Design", "LRU Cache", "1. Hashmap + Double Linkedlist 2. LinkedHashMap"],
                    ["lc0152", "M", "Array", "Maximum Product Subarray", ""],
                    ["lc0153", "M", "Array", "Find Minimum in Rotated Sorted Array", ""],
                    ["lc0162", "M", "Array", "Find Peak Element", ""],
                    ["lc0167", "M", "Array", "2Sum II - Input Array is Sorted", ""],
                    ["lc0169", "M", "Array", "Majority Element", ""],
                    ["lc0170", "M", "Array", "2Sum III - Data Structure Design", ""],
                    ["lc0240", "M", "Array", "Search a 2D Matrix II", ""],
                    ["lc0259", "M", "Array", "3Sum Smaller", ""],
                    ["lc0284", "M", "Design", "Peeking Iterator", ""],
                    ["lc0445", "M", "LinkedList", "Add Two Numbers II", ""],
                    ["lc0560", "M", "Array", "Subarray Sum Equals K", ""],
                    ["lc0611", "M", "Array", "Valid Triangle Number", ""],
                    ["lc0653", "M", "Array", "2Sum IV - Input is a BST", ""]
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
