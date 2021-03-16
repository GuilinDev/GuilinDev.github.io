---
permalink: JVM-Gabage-Collection
---

# JVM垃圾回收
仅仅从名字上看，垃圾回收看起来是可以从内存中查找和清空垃圾，实际上，垃圾收集会跟踪JVM堆空间中的每个可用对象，并删除未使用的对象。从而达到回收已经分配出去的内存，
然后可以进行再分配。

## 1. 前置知识Recall
### 1.1 Java SDK
了解Java SDK的结构
![](/assets/img/blogs/2020-08-01/sdk.png)
如上图所示，最底下的一层就是Java Virtual Machine(JVM)，也就是HotSpot。

### 1.2 JVM逻辑内存模型
#### 1.2.1 从内存设置的角度看
![](/assets/img/blogs/2020-08-01/jvmMemory0.png)
可以分为三个大的类别：堆内存，非堆内存（JDK8以后叫做Metaspace，元空间）和其它。如果再细分一下，如下：
![](/assets/img/blogs/2020-08-01/jvmMemory1.png)
可以看到，堆内存包含有Young Generation年轻代和Old Generation老年代，元空间中包含有永久带Permannet Generation。

打开安装目录java/bin/jconsole或H我java/bin/jvisualvm，可以查看当前运行的进程的各个内存分区的运行情况
![](/assets/img/blogs/2020-08-01/jvmMemory2.png)
![](/assets/img/blogs/2020-08-01/jvmMemory3.png)
可以看到JVM将内存分为堆和非堆（Metaspace）。那上面图中除了heap和Metaspace，还有个other是什么呢？Other 指的是“直接内存”，如一些（IO/NIO），
这些 JVM 控制不了（如果线程变多线程栈吃的内存也会变的非常大，不可设置）。

**对应的JVM设置参数包括**：

* Xmx4g：JVM 最大允许分配的堆内存，按需分配；
* Xms4g：JVM 初始分配的堆内存，一般和 Xmx 配置成一样以避免每次 gc 后 JVM 重新分配内存；
* XX：MetaspaceSize=64m 初始化元空间大小；
* XX：MaxMetaspaceSize=128m 最大化元空间大小。

Metaspace 建议不要设置，一般让 JVM 自己启动的时候动态扩容就好了，没必要自己去设置。如果不动态加载 class ，当启动起来的时候，一般是很少有变化的。

从这个角度可以认为 JVM 内存的大小 = 堆 + metaspace + io(运行时产生的大小)。

#### 1.2.2 从线程的角度看JVM内存模型
可以把 JVM 内存结构直接分成线程私有内存和共享主内存。这样就可以很好地理解多线程的很多问题如同步锁、lock、validate 关键字，
以及 ThreadLocal。
![](/assets/img/blogs/2020-08-01/jvmMemory4.png)

#### 1.2.3 从JVM运行期的角度看
可以分为五大部分：方法区、堆、本地方法栈区、PC 计数器、线程栈。PC 计数器和栈、本地方法栈，是随着当前的线程开始而开始，销毁而销毁的。
![](/assets/img/blogs/2020-08-01/jvmMemory5.png)
![](/assets/img/blogs/2020-08-01/jvmMemory6.png)

#### 1.2.4 从垃圾回收的角度看
![](/assets/img/blogs/2020-08-01/jvmMemory7.png)
通过 java/bin/jvisualvm
![](/assets/img/blogs/2020-08-01/jvmMemory8.png)

JVisualVM 可以看得出来：

* 内存直接被垃圾收集器切分了5个部分：metaspace（class 结构）（永久代）、Old（老年代）、新生代（一个 Eden（伊甸，新对象创作的乐园）、二个 Survivor Space)）。
* 一个对象默认被交换了6次还没有回收掉就会被扔到老年区里面。
* -XX:InitialTenuringThreshold=7 通过这个来设置，交换几次丢到老年代。

比如递归就在heap中分配一段内存作为辅助的stack，for循环包括尾递归都是在栈空间里面。

## 2. 垃圾回收简介
在 java 中，程序员是不需要显示的去释放一个对象的内存的，而是由虚拟机自行执行。在 JVM 中，有一个垃圾回收线程，它是低优先级的，在正常情况下是不会执行的，
只有在虚拟机空闲或者当前堆内存不足时，才会触发执行，扫描那些没有被任何引用的对象，并将它们添加到要回收的集合中，进行回收。

### 2.1 Reference Counting引用计数法和可达性分析
在 Java 虚拟机的语境下，垃圾指的是死亡的对象所占据的堆空间。这里便涉及了一个关键的问题：如何辨别一个对象是存是亡？

先介绍一种古老的辨别方法：引用计数法（reference counting）。它的做法是为每个对象添加一个引用计数器，用来统计指向该对象的引用个数。一旦某个对象的引用计数器为 0，
则说明该对象已经死亡，便可以被回收了。

它的具体实现是这样子的：如果有一个引用，被赋值为某一对象，那么将该对象的引用计数器 +1。如果一个指向某一对象的引用，被赋值为其他值，那么将该对象的引用计数器 -1。也就是说，
需要截获所有的引用更新操作，并且相应地增减目标对象的引用计数器。除了需要额外的空间来存储计数器，以及繁琐的更新操作，引用计数法还有一个重大的漏洞，那便是无法处理循环引用对象。

举个例子，假设对象 a 与 b 相互引用，除此之外没有其他引用指向 a 或者 b。在这种情况下，a 和 b 实际上已经死了，但由于它们的引用计数器皆不为 0，在引用计数法的心中，这两个对象还活着。因此，这些循环引用对象所占据的空间将不可回收，从而造成了内存泄露。

所以目前 Java 虚拟机的主流垃圾回收器采取的是可达性分析算法。
这个算法的实质在于将一系列 GC Roots 作为初始的存活对象合集（live set），然后从该合集出发，探索所有能够被该集合引用到的对象，并将其加入到该集合中，
这个过程我们也称之为标记（mark）。最终，未被探索到的对象便是可以回收的。

其中GC Roots可以理解为堆外指向堆内的引用

### 2.2 垃圾回收优点
Java 语言最显著的特点就是引入了垃圾回收机制，它使 java 程序员在编写程序时不再考虑内存管理的问题。 由于有这个垃圾回收机制，java 中的对象不再有“作用域”的概念，
只有引用的对象才有“作用域”。 垃圾回收机制有效的防止了内存泄露，可以有效的使用可使用的内存。 垃圾回收器通常作为一个单独的低级别的线程运行，
在不可预知的情况下对内存堆中已经死亡的或很长时间没有用过的对象进行清除和回收。 程序员不能实时的对某个对象或所有对象调用垃圾回收器进行垃圾回收。

### 2.3 垃圾回收机制
JVM垃圾回收采用的是分代收集算法（Generational Collection），下面根据代（generation）来看收集过程：
1. 新对象被分配在新生代的Eden区
![](/assets/img/blogs/2020-08-01/generationalCollection0.png)
2. 当达到回收条件的时候，没有引用的对象不动，有引用的对象被放到新生代的S0 survivor space区
![](/assets/img/blogs/2020-08-01/generationalCollection1.png)
3. 回收往复多次，来回在S0 Survivor Space复制几次，并标记对象的年龄
![](/assets/img/blogs/2020-08-01/generationalCollection2.png)
4. 比如设置参数```text -xx：MaxTenuringThreshold=9 ```，表示将标记了年龄等于9的对象copy到老年代
![](/assets/img/blogs/2020-08-01/generationalCollection3.png)
5. 然后循环此过程，当老年代达到一定值的时候触发老年GC

### 2.4 垃圾回收算法
当上面出发GC的时候，用的算法包括以下几种：

1. Mark-Sweep 标记-清除算法
分为“标记”和“清除”两个阶段。首先标记出所有需要回收的对象所占据的内存为空闲内存，记录在一个空闲list中，当需要创建新对象时，内存管理模块从该空闲list中寻找空闲内存
，并分配给新建的对象。它是最基础的收集算法，因为后续的垃圾收集算法都是基于这种思路并对其缺点进行改进而得到的。
![](/assets/img/blogs/2020-08-01/gcAlgorithm0.png)

它的主要缺点有两个：

1）分配效率比较低的问题，在标记和清除过程中，JVM需要逐个访问空闲list中的各个项，来查找能够放入新建对象的空闲内存；

2）空间问题，标记清除之后会产生大量不连续的内存碎片（Memory Fragmentation），可能会导致太多空间碎片，当程序在以后的运行过程中需要分配较大对象时无法找到足够的连续内存而不得不提前触发另一次垃圾收集动作。

2. Mark-Copy 标记-复制算法
在上面算法的基础上，即把内存区域分为两等分，分别用两个指针 from 和 to 来维护，并且只是用 from 指针指向的内存区域来分配内存（即每次只使用其中一块）。
当发生垃圾回收时，便把存活的对象复制到 to 指针指向的内存区域中，并且交换 from 指针和 to 指针的内容。
![](/assets/img/blogs/2020-08-01/gcAlgorithm1.png)
该算法的优点：
    * 由于是每次都对整个半区进行内存回收，内存分配时不必考虑内存碎片问题；
    * 只要移动堆顶from和to两个指针，按顺序分配内存即可，实现简单，运行高效。
    
该算法的缺点：
    * 内存减少为原来的一半，太浪费了，堆空间的使用效率很低下；
    * 对象存活率较高的时候就要执行较多的复制操作，效率变低；
    * 如果不使用50%的对分策略，老年代需要考虑的空间担保策略（演进：也就是不按1：1划分内存空间，将内存划分为一块较大的 Eden Space 和两块较小的 Survivor Space。）。
3. Mark-Compact 标记-整理算法
上面的复制算法在对象存活率较高时会执行较多的复制操作，效率将会变低。
更关键的是，如果不想浪费50%的空间，就需要有额外的空间进行分配担保，以应对被使用的内存中所有对象都100%存活的极端情况，所以在老年代一般不能直接选用Mark-Copy算法。

根据老年代的特点，标记-整理算法标记过程仍然与“标记-清除”算法一样，但后续步骤不是直接对可回收对象进行清理，而是让所有存活的对象都向一端移动，
然后直接清理掉端边界以外的内存，有点 copy 的意思，但是比 copy 省空间。这种做法也能够解决内存碎片化的问题，并有更高的空间利用率，但代价是压缩算法的性能开销。
![](/assets/img/blogs/2020-08-01/gcAlgorithm2.png)

### 2.5 收集器GC Implementations
JVM有四种垃圾收集器的实现：

#### 2.5.1 Serial Garbage Collector
这是最简单的GC实现，因为它基本上可以在单个线程中工作（单线程阻塞队列）。串行GC实现在运行时会冻结所有应用程序线程。因此，在诸如服务器环境之类的多线程应用程序中最好不要使用。

缺点：
    * 单线程收集器，只会使用一个 CPU 或一条收集线程去完成垃圾收集工作；
    * 它在进行垃圾收集时，必须暂停其他所有的工作线程，直至 Serial 收集器收集结束为止（Stop The World）；
    
应用场景：
    * HotSpot 虚拟机运行在 Client 模式下的默认的新生代收集器。
    * 单 CPU 虚拟机
    * JDK 1.3.1 之前，是虚拟机新生代收集的唯一选择。JDK 1.5.0 之前老年代的唯一选择。
    * 内存比较小的情况下，效率还是很高的

配置参数： 
```text 
java -XX:+UseSerialGC -jar Application.java
```

#### 2.5.2 Parallel Garbage Collector
并行的收集器，Parallel Scavenge 收集器的目标是达到一个可控制的吞吐量（Throughput）；
自适应调节策略也是 Parallel Scavenge 收集器与 ParNew 收集器的一个重要区别。
其吞吐量（Throughput），即CPU用于运行用户代码的时间与 CPU 总消耗时间的比值，即“吞吐量 = 运行用户代码时间 /（运行用户代码时间 + 垃圾收集时间）”。

假设虚拟机总共运行了100分钟，其中垃圾收集花掉1分钟，那吞吐量就是99%。

其优点为：停顿时间越短就越适合需要与用户交互的程序，良好的响应速度能提升用户体验。而高吞吐量则可以高效率地利用 CPU 时间，尽快完成程序的运算任务，主要适合在后台运算而不需要太多交互的任务。

其缺点为：Parallel Scavenge 收集器无法与 CMS 收集器配合使用。

应用场景：
    * 新生代：复制算法。设置参数：-XX:+UseParallelGC。
    * 老年代：使用多线程和“标记-整理”算法。设置参数：-XX:+UseParallelOldGC。

全部配置参数： 
```text 
java -XX:+UseParallelGC -jar Application.java
```

#### 2.5.3 CMS Garbage Collector
CMS（Concurrent Mark Sweep）收集器是一种以获取最短回收停顿时间为目标的收集器，它非常符合那些集中在互联网站或者 B/S 系统的服务端上的 Java 应用，
这些应用都非常重视服务的响应速度。从名字上（“Mark Sweep”）就可以看出它是基于“标记-清除”算法实现的。

CMS 收集器工作的整个流程分为以下4个步骤：

1) 初始标记（CMS initial mark）：仅仅只是标记一下 GC Roots 能直接关联到的对象，速度很快，需要“Stop The World”。
2) 并发标记（CMS concurrent mark）：进行 GC Roots Tracing 的过程，在整个过程中耗时最长。
3) 重新标记（CMS remark）：为了修正并发标记期间因用户程序继续运作而导致标记产生变动的那一部分对象的标记记录，这个阶段的停顿时间一般会比初始标记阶段稍长一些，但远比并发标记的时间短。此阶段也需要“Stop The World”。
4) 并发清除（CMS concurrent sweep）。

配置参数： 
```text 
java -XX:+UseParNewGC -jar Application.java
```

注意： 从Java 9开始，CMS GC已经被标记为不推荐使用了，从Java 14开始则完全移除了。

#### 2.5.4 G1 Garbage Collector
G1（Garbage First）GC设计用于在具有大内存空间的多处理器计算机上运行的应用程序。自JDK7 Update 4及更高版本开始。

G1 GC取代CMS GC，因为具有更高的性能效率。

与其他GC收集器不同，G1收集器将堆划分为一组大小相等的堆区域，每个堆区域都包含一个连续范围的虚拟内存。
执行垃圾收集时，G1显示一个并发的全局标记阶段（即称为标记的阶段1）。

标记阶段完成后，G1知道哪些区域大部分为空。它首先在这些区域中收集，通常会产生大量的自由空间（即阶段2，即“扫描”）。这就是为什么这种垃圾收集方法称为“垃圾优先”的原因。

配置参数： 
```text 
java -XX:+UseG1GC -jar Application.java
```