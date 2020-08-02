---
permalink: JVM-Gabage-Collection-Review
---

### JVM 垃圾回收
垃圾回收(Garbage Collection)是Java虚拟机(JVM)垃圾回收器提供的一种用于在空闲时间不定时回收无任何对象引用的对象占据的内存空间的一种机制。

> 注意：垃圾回收回收的是无任何引用的对象占据的内存空间而不是对象本身。换言之，垃圾回收只会负责释放那些对象占有的内存。对象是个抽象的词，包括引用和其占据的内存空间。
当对象没有任何引用时其占据的内存空间随即被收回备用，此时对象也就被销毁。

#### Java中的对象引用
* 强引用（Strong Reference）
* 软引用（Soft Reference）
* 弱引用（Weak Reference）
* 虚引用（Phantom Reference）

#### 判断对象为“垃圾” - 内存leaky
* 引用计数算法（Reference Counting Collector
* 根搜索算法（Tracing Collector）

#### GC算法
* Mark Sweep
* Mark Copy
* Mark Compact

#### 内存分区
* Heap
* Non Heap（MetaSpace）
* Other

#### Java API
* System.gc()
* finalize()

### 秒杀系统
* 超卖问题
* 对象级缓存
* 订单处理队列
* 分布式
* 安全性设计

![](/assets/img/blogs/2020-08-01/miaoshaDB.png)

### 搜索引擎简介
搜索引擎处理用户请求的大致工作流程
![](/assets/img/blogs/2020-08-01/searchEngine.png)
