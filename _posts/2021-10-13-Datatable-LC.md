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
                var payload = [["1", "E", "Two Sum", "Two Sum", "HashMap"],["146", "M", "LRU Cache", "LRU Cache", "1. Hashmap + Double Linkedlist 2. LinkedHashMap"]];
                $('#lc').DataTable({
                    data: payload,
                    columnDefs: [
                        {
                            targets:[2, 3], // for links
                            render: function ( data, type, row, meta ) {
                                console.log("data: " + data);
                                console.log("type: " + type);
                                console.log("row[0]: " + row[0]);
                                if(type != null){
                                    return '<a href='+data+'>'+row[0]+'</a>';
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
                    <th>题目链接</th>
                    <th>题解链接</th>
                    <th>简单总结</th>
                </tr>
            </thead>
            <tfoot>
                <tr>
                    <th>#</th>
                    <th>难度</th>
                    <th>题目链接</th>
                    <th>题解链接</th>
                    <th>简单总结</th>
                </tr>
            </tfoot>
        </table>

    </body>

</html>
