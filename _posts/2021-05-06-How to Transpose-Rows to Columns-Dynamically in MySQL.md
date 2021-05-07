---
permalink: Dynamically-Transpose-Rows-MySQL
---

## MySQL中如何动态地转置行为列
有些时候，数据按行存储，但是报表的时候需要按列输出，这时候就需要转置。同时，数据本身存储的行不知道共有多少，这时候需要知道需要多少列，也即是动态转置。MySQL中没有built-in的函数进行动态转置的操作，所以需要使用SQL来完成，以下是如何使用SQL语句在MySQL中动态转置将行转变成列。

### 创建一个动态数据透视表Dynamical Pivot Table

使用如下的语句：

![](/assets/img/blogs/2021-05-06/createDynamicalTable.png)

表结构

![](/assets/img/blogs/2021-05-06/createDynamicalTable1.png)



### 分析

我们想根据上面的原始数据表结构，生成如下的report，把人和职业对应起来:

![](/assets/img/blogs/2021-05-06/expectedResult.png)

+------------+------------+-----------+------------+
| meeting_id | first_name | last_name | occupation |
+------------+------------+-----------+------------+
|      1     |    Alec    |   Johns   |  engineer |
|      2     |    John    |    Doe    |  engineer |
+------------+------------+-----------+------------+

因为MySQL中没有built-in的函数进行动态转置的操作，这时候可以用一些额外的脚本程序或者工具来连接MySQL，生成数据结构然后执行行列转换，不过这里介绍手动实现SQL语句来进行数据转换，如下：

```sql
SET @sql = NULL;
SELECT
  GROUP_CONCAT(DISTINCT
    CONCAT(
      'max(case when field_key = ''',
      field_key,
      ''' then field_value end) ',
      field_key
    )
  ) INTO @sql
FROM
  Meeting;
SET @sql = CONCAT('SELECT Meeting_id, ', @sql, ' 
                   FROM Meeting 
                   GROUP BY Meeting_id');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
```

GROUP_CONCAT对上面Table中的不同行中的filed_key的值连接为一个字符串，在以上SQL语句中，根据field_key的列的值的独特性，我们用GROUP_CONCAT来动态创建Select后面的Case语句，并将之赋值给@sql变量，@sql随后被用到接下来的语句中。



### 转置后结果

![](/assets/img/blogs/2021-05-06/tranpose.png)



### limit设置

MySQL对于GROUP_CONCAT结果用系统变量group_concat_max_len做了限制，默认值是1024。所以，如果你的表有很多列，最好将该值设大一些。

```sql
SET @@group_concat_max_len = 5000;
SELECT GROUP_CONCAT(column_name) FROM table;
```



### 扩展

上面的SQL语句可以再进行改变
* 如果只想转置选中的行的值，只需在GROUP_CONCAT语句中添加一个WHERE判断条件，确定该值为被选中的值即可

 ```sql
SELECT
  GROUP_CONCAT(DISTINCT
    CONCAT(
      'max(case when field_key = ''',
      field_key,
      ''' then field_value end) ',
      field_key
    )
  ) INTO @sql
FROM
  Meeting
WHERE <condition>;
```

以下只对field_key中的first_name进行转置，结果如下：

![](/assets/img/blogs/2021-05-06/tranpose_where1.png)

* 如果想对转置前的行进行filter，只需将WHERE添加到SET语句的位置

```sql
SET @sql = CONCAT('SELECT Meeting_id, ', @sql, ' 
                  FROM Meeting WHERE <condition>
                   GROUP BY Meeting_id');
```

以下对转置后的结果筛选出meeting_id为1的记录，结果如下：

![](/assets/img/blogs/2021-05-06/tranpose_where2.png)

除了Where语句，也可以用Join， Group By等操作。

