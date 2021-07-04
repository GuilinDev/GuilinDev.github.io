---
layout: post
permalink: Java-Stream-Debug
---
Intellij中Java Stream的dubug经常不知道怎么做的，最近看到这个文档[Intellij Java Stream Debug](https://www.jetbrains.com/help/idea/analyze-java-stream-operations.html)才发现挺方便用的。

1. 创建一个测试用例，在Stream链开始的地方打好断点

![](/assets/img/blogs/2021-07-03/debug0.png)

2. 点击 Trace Current Stream Chain

![](/assets/img/blogs/2021-07-03/debug1.png)

3. 打开Stream Trace的dialog，可以看到上面代码中stream chain的pipeline中的各个步骤

![](/assets/img/blogs/2021-07-03/debug2.png)

4. 点击各个pipeline可以看到从上一步到下一步的结果（注意stream各个步骤不分前后)）

![](/assets/img/blogs/2021-07-03/debug3.png)

skip() 跳过前n个元素，这里是1个

![](/assets/img/blogs/2021-07-03/debug4.png)

skip() 取整个数组al的前5个元素（并非从skip的结果中取）

![](/assets/img/blogs/2021-07-03/debug5.png)

自定义方法找出2个素数

![](/assets/img/blogs/2021-07-03/debug6.png)