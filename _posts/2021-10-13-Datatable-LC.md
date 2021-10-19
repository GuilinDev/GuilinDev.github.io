---
layout: post
permalink: Datatable-LC
datatable: true
---
<html lang="zh">
    <head>
        <meta charset="utf-8" />
        <title>DataTables简单用例</title>
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
                    ["lc0003", "M", "String", "Longest Substring without Repeating Characters", "滑动窗口"],
                    ["lc0026", "M", "Array", "Remove Duplicates from Sorted Array", ""],
                    ["lc0027", "M", "Array", "Remove Element", ""],
                    ["lc0080", "M", "Array", "Remove Duplicates from Sorted Array II", ""],
                    ["lc0146", "M", "Design", "LRU Cache", "1. Hashmap + Double Linkedlist 2. LinkedHashMap"]
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
