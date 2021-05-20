---
layout: post
permalink: Java-Stream-Summary
---
![](/assets/img/blogs/2021-05-19/JavaSteamMindMap.png)

### 1. Java Stream 概述

Stream将要处理的元素集合看作一种流，在流的过程中，借助Stream API对流中的元素进行操作，比如：筛选、排序、聚合等。

Stream可以由数组或集合创建，对流的操作分为两种：

* 中间操作，每次返回一个新的流，可以有多个。

* 终端操作，每个流只能进行一次终端操作，终端操作结束后流无法再次使用。终端操作会产生一个新的集合或值。

另外，Stream有几个特性：

* stream不存储数据，而是按照特定的规则对数据进行计算，一般会输出结果。

* stream不会改变数据源，通常情况下会产生一个新的集合或一个值。

* stream具有**延迟执行**特性，只有调用终端操作时，中间操作才会执行。

### 2. Java Stream 创建

1. 通过集合数组来创建

```java
    List<String> list = Arrays.asList("a", "b", "c"); // 需要使用List Interface
        
    // 创建一个顺序流 Sequential Stream
    Stream<String> stream = list.stream();
    
    // 创建一个并行流 Parallel Stream
    Stream<String> parallelStream = list.parallelStream();
```

2. 使用java.util.Arrays.stream(T[] array)方法用数组创建流

```java
    int[] array={1,3,5,6,8};
    IntStream stream = Arrays.stream(array);
```

3. 使用Stream的静态方法：of()、iterate()、generate()

```java
    Stream<String> stream1 = Stream.of("a", "b", "c", "d", "e", "f");

    Stream<String> stream2 = Stream.iterate("zzz", (x) -> x + "OPQ").limit(4);
    stream2.forEach(System.out::println);

    Stream<Double> stream3 = Stream.generate(Math::random).limit(3);
    stream3.forEach(System.out::println);
```

打印结果

```text
zzz
zzzOPQ
zzzOPQOPQ
zzzOPQOPQOPQ
0.7334379516465784
0.8249986567254909
0.47393047848653147
```
