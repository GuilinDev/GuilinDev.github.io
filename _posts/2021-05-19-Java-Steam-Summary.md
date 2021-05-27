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

stream和parallelStream的简单区分： stream是顺序流，由主线程按顺序对流执行操作，而parallelStream是并行流，内部以多线程并行执行的方式对流进行操作，但前提是流中的数据处理没有顺序要求。两者的处理不同之处：

![](/assets/img/blogs/2021-05-19/JavaSteamSequencialParallel.png)

![](/assets/img/blogs/2021-05-19/JavaSteamParallel.png)

如果流中的数据量足够大，并行流可以加快处理速度。

除了直接创建并行流，还可以通过parallel()把顺序流转换成并行流：

```java
Optional<Integer> findFirst = list.stream().parallel().filter(x-> x>6).findFirst();
```

### 3. Stream的使用

在使用stream之前，先理解一个概念：Optional 。

> Optional类是一个可以为null的容器对象。如果值存在则isPresent()方法会返回true，调用get()方法会返回该对象。详见：https://www.runoob.com/java/java8-optional-class.html

案例准备，创建一个Person类

```java
class Person {
    private String name;  // name
    private int salary; // salary
    private int age; // age
    private String sex; // gender
    private String area;  // location

    public Person(String name, int salary, int age,String sex,String area) {
        this.name = name;
        this.salary = salary;
        this.age = age;
        this.sex = sex;
        this.area = area;
    }
    // setter and getter
}
```

#### 3.1 遍历/匹配（foreach/find/match）

Stream也是支持类似集合的遍历和匹配元素的，只是Stream中的元素是以Optional这个类型存在的。Stream的遍历、匹配非常简单。

```java
private void testIterateAndMatch() {
        List<Integer> list = Arrays.asList(7, 6, 9, 3, 8, 2, 1);

        // 遍历输出符合 >6 条件的元素
        list.stream().filter(x -> x > 6).forEach(System.out::println);
        // 匹配第一个
        Optional<Integer> findFirst = list.stream().filter(x -> x > 6).findFirst();
        // 匹配任意一个（适用于并行流）
        Optional<Integer> findAny = list.parallelStream().filter(x -> x > 6).findAny();
        // 是否包含符合特定条件的元素
        boolean anyMatch = list.stream().anyMatch(x -> x < 6);
        System.out.println("匹配第一个值：" + findFirst.get());
        System.out.println("匹配任意一个值：" + findAny.get());
        System.out.println("是否存在大于6的值：" + anyMatch);
    }
```

输出结果

```text
7
9
8
匹配第一个值：7
匹配任意一个值：8
是否存在大于6的值：true
```

#### 3.2 筛选（filter）

筛选，是按照一定的规则校验流中的元素，将符合条件的元素提取到新的流中的操作。

case1：筛选出Integer集合中大于7的元素，并打印出来

```java
    private void testFilter1() {
        List<Integer> list = Arrays.asList(6, 7, 3, 8, 1, 2, 9);
        Stream<Integer> stream = list.stream();
        stream.filter(x -> x > 7).forEach(System.out::println);
    }
```

打印结果： 8 9

case2: 筛选员工中工资高于8000的人，并形成新的集合。 形成新集合依赖collect（收集）

```java
private void testFilter2() {
        List<Person> personList = new ArrayList<>();

        personList.add(new Person("Tom", 8900, 38, "male", "New York"));
        personList.add(new Person("Jack", 7000, 25, "male", "Washington"));
        personList.add(new Person("Lily", 7800, 29,"female", "Washington"));
        personList.add(new Person("Anni", 8200, 41, "female", "New York"));
        personList.add(new Person("Owen", 9500, 45, "male", "New York"));
        personList.add(new Person("Alisa", 7900, 33, "female", "New York"));

        // 新创建一个list来容纳filter后collect的集合
        List<String> filterList = personList.stream().filter(person -> person.getSalary() > 8000).map(Person::getName)
                .collect(Collectors.toList());

        System.out.println(filterList);
    }
```

打印结果:

```text
[Tom, Anni, Owen]
```

#### 3.3 聚合（max/min/count)

max、min、count等等函数在mysql中常用它们进行数据统计。Java stream中也引入了这些概念和用法，极大地方便了我们对集合、数组的数据统计工作。

case1: 获取String集合中最长的元素。

```java
private void testAggregate1() {
        List<String> list = Arrays.asList("admn", "admin", "TEST123", "Hello", ""); //可为null
        Optional<String> maxLen = list.stream().max(Comparator.comparing(String::length));
        System.out.println("最长字符串： " + maxLen.get()); //get()获取当前对象
    }
```

结果

```text
最长字符串： TEST123
```

case2: 获取Integer集合中的最大值

```java
private void testAggregate2() {
        List<Integer> list = Arrays.asList(7, 6, 9, 4, 11, 6);

        // 自然排序
        Optional<Integer> max = list.stream().max(Integer::compareTo);
        // 自定义排序，这里可以处理复杂的对象内根据特定的attributes排序的情况
        Optional<Integer> max2 = list.stream().max(new Comparator<Integer>() {
            @Override
            public int compare(Integer o1, Integer o2) {
                return o1.compareTo(o2);
            }
        });

        System.out.println("自然排序的最大值：" + max.get());
        System.out.println("自定义排序的最大值：" + max2.get());
    }
```

打印结果

```text
自然排序的最大值：11
自定义排序的最大值：11
```

case3: 获取员工工资最高的人

```java
private void testAggregate3() {
        List<Person> personList = new ArrayList<>();

        personList.add(new Person("Tom", 8900, 38, "male", "New York"));
        personList.add(new Person("Jack", 7000, 25, "male", "Washington"));
        personList.add(new Person("Lily", 7800, 29,"female", "Washington"));
        personList.add(new Person("Anni", 8200, 41, "female", "New York"));
        personList.add(new Person("Owen", 9500, 45, "male", "New York"));
        personList.add(new Person("Alisa", 7900, 33, "female", "New York"));

        Optional<Person> max = personList.stream().max(Comparator.comparingInt(Person::getSalary)); //根据工资对所有员工取最大值
        System.out.println(max.orElse(new Person("TestPerson", 0, 0, "", "")).getSalary());
    }
```

打印结果：

```text
9500
```

case4: 找出所有员工中工资大于8000的数量

```java
private void testAggregate4() {
        List<Person> personList = new ArrayList<>();

        personList.add(new Person("Tom", 8900, 38, "male", "New York"));
        personList.add(new Person("Jack", 7000, 25, "male", "Washington"));
        personList.add(new Person("Lily", 7800, 29,"female", "Washington"));
        personList.add(new Person("Anni", 8200, 41, "female", "New York"));
        personList.add(new Person("Owen", 9500, 45, "male", "New York"));
        personList.add(new Person("Alisa", 7900, 33, "female", "New York"));

        long count = personList.stream().filter(person -> person.getSalary() > 8000).count();
        System.out.println("工资大于8000的员工数量: " + count);
    }
```

打印结果

```text
工资大于8000的员工数量: 3
```

#### 3.4 映射(map/flatMap)
映射，可以将一个流的元素按照一定的映射规则映射到另一个流中。分为map和flatMap：

    * map：接收一个函数作为参数，该函数会被应用到每个元素上，并将其映射成一个新的元素。

    * flatMap：接收一个函数作为参数，将流中的每个值都换成另一个流，然后把所有流连接成一个流。

case1: 英文字符串数组的元素全部改为大写。整数数组每个元素 +3

```java

```

打印结果

```text

```