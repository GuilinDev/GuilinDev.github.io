---
permalink: Algorithm-DataBase
---

1. 一道算法题
有两个单向链表（链表长度分别为 m，n），这两个单向链表有可能在某个元素合并，如下图所示的这样，也可能不合并。
现在给定两个链表的头指针，在不修改链表的情况下，如何快速地判断这两个链表是否合并？如果合并，找到合并的元素，也就是图中的 x 元素。
请用（伪）代码描述算法，并给出时间复杂度和空间复杂度。
![](/assets/img/blogs/2020-07-25/IntersectionLinkedList.png)

算法：
* 用环的思想来做；
* 让两条链表分别从各自的开头开始往后遍历；
* 当其中一条遍历到末尾时，跳到另一个条链表的开头继续遍历；
* 两个指针最终会相等，而且只有两种情况：
    * 一种情况是在交点处相遇（有交叉）；
    * 另一种情况是在各自的末尾的空节点（没有交叉）处相等。
* 为什么一定会相等呢，因为两个指针走过的路程相同，是两个链表的长度之和，所以一定会相等。
* 这个方法的时间复杂度是O(m + n)，分别是链表的长度，空间是O(1)。

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) {
 *         val = x;
 *         next = null;
 *     }
 * }
 */
public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        if (headA == null || headB == null) {
            return null;
        }
        ListNode indexA = headA;
        ListNode indexB = headB;
        
        while (indexA != indexB) {
            if (indexA == null) {
                indexA = headB;
            } else { // 为null这一步不往下走
                indexA = indexA.next;
            }
            
            if (indexB == null) {
                indexB = headA;
            } else { // 为null这一步不往下走
                indexB = indexB.next;
            }
            
        }
        return indexA;
    }
}
```

2. Hadoop DataNode宕机时，HDFS处理过程的时序图
![](/assets/img/blogs/2020-07-25/HDFS.jpg)