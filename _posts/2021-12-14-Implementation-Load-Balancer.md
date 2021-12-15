---
layout: post
permalink: System-Load-Balancer
---

## Random

```java
import java.util.*;

public class RandomLB {
    /** 服务器列表 */
    private static List<String> serverList = new ArrayList<>();
    static {
        serverList.add("192.168.1.1");
        serverList.add("192.168.1.2");
        serverList.add("192.168.1.3");
        serverList.add("192.168.1.4");
    }
    public static String getRandomServer() {
        // 复制遍历用的集合，防止操作中非线程安全的集合有变更
        List<String> tempList = new ArrayList<>(serverList.size());
        tempList.addAll(serverList);
        // 随机数随机访问
        int randomInt = new Random().nextInt(tempList.size());
        return tempList.get(randomInt);
    }
}
```

## Round Robin

```java
import java.util.ArrayList;
import java.util.List;

public class RoundRobinLB {
    /** 服务器列表 */
    private static List<String> serverList = new ArrayList<>();
    static {
        serverList.add("192.168.1.1");
        serverList.add("192.168.1.2");
        serverList.add("192.168.1.3");
        serverList.add("192.168.1.4");
    }
    private static Integer index = 0;

    public static String getRRServer() {
        // 复制遍历用的集合，防止操作中非线程安全的集合有变更
        List<String> tempList = new ArrayList<>(serverList.size());
        tempList.addAll(serverList);
        String server = "";
        synchronized (index) {
            index++;
            if (index == tempList.size()) {
                index = 0;
            }
            server = tempList.get(index);;
        }
        return server;
    }
}
```

## Weighted Random
```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

public class WeightedRandomLB {
    private static HashMap<String, Integer> serverMap = new HashMap<>();
    static {
        serverMap.put("192.168.1.1", 2);
        serverMap.put("192.168.1.2", 2);
        serverMap.put("192.168.1.3", 2);
        serverMap.put("192.168.1.4", 4);
    }
    /**
     * 加权路由算法
     */
    public static String randomWithWeight() {
        List<String> tempList = new ArrayList();
        HashMap<String, Integer> tempMap = new HashMap<>();
        tempMap.putAll(serverMap);
        for (String key : serverMap.keySet()) {
            for (int i = 0; i < serverMap.get(key); i++) {
                tempList.add(key);
            }
        }
        int randomInt = new Random().nextInt(tempList.size());
        return tempList.get(randomInt);
    }
}
```

## Weighted Round Robin

```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class WeightedRoundRobinLB {
    private static HashMap<String, Integer> serverMap = new HashMap<>();
    static {
        serverMap.put("192.168.1.1", 2);
        serverMap.put("192.168.1.2", 2);
        serverMap.put("192.168.1.3", 2);
        serverMap.put("192.168.1.4", 4);
    }
    private static Integer index = 0;
    public static String getWeightedRRServer() {
        List<String> tempList = new ArrayList();
        HashMap<String, Integer> tempMap = new HashMap<>();
        tempMap.putAll(serverMap);
        for (String key : serverMap.keySet()) {
            for (int i = 0; i < serverMap.get(key); i++) {
                tempList.add(key);
            }
        }
        synchronized (index) {
            index++;
            if (index == tempList.size()) {
                index = 0;
            }
            return tempList.get(index);
        }
    }
}
```