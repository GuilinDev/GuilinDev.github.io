---
layout: post
permalink: Datatable-LC
datatable: true
---
<!DOCTYPE html>
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
                var table = $('#lc').DataTable({
                    data: payload,
                    columnDefs: [
                        {
                            // targets:-1, // Start with the last
                            render: function ( data, type, row, meta ) {
                                if(type === 'linkLC'){
                                    return '<a href='+data+'>'+data+'</a>';
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
                    <th class="linkLC">题目链接</th>
                    <th class="linkLC">题解链接</th>
                    <th>简单总结</th>
                </tr>
            </thead>
            <tfoot>
                <tr>
                    <th>#</th>
                    <th>难度</th>
                    <th class="linkLC">题目链接</th>
                    <th class="linkLC">题解链接</th>
                    <th>简单总结</th>
                </tr>
            </tfoot>
        </table>

    </body>

</html>
