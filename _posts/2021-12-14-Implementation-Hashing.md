---
layout: post
permalink: Implementation-Hashing
---

## Simple Hashing

```java
import java.util.Arrays;
import java.util.stream.Collectors;

public class SimpleHashing {
    private int capacity;
    private int seed;

    public SimpleHashing(int capacity, int seed) {
        this.capacity = capacity;
        this.seed = seed;
    }
    public int getSimpleHash(String key) {
        int result = 0;
        for (int i = 0; i < key.length(); i++) {
            result = seed * result + key.charAt(i);
        }
        return (capacity - 1) & result;
    }

    private static final int NUM_SERVERS = 3;

    private static final int SCA_NUM_SERVERS = 7;

    public static void main(String[] args) {
        String[] keys = {"图片A.png", "图片B.png", "图片C.png", "图片D.png", "图片E.png", "test"};
        SimpleHashing simpleHashing = new SimpleHashing(2 << 12, 8);
        System.out.println(NUM_SERVERS + " Servers: ");
        Arrays.stream(keys).map(simpleHashing::getSimpleHash)
                .map(it -> it % NUM_SERVERS)
                .collect(Collectors.toList())
                .forEach(
                        it -> {
                            System.out.println("Map to server: " + it);
                        });
        System.out.println(SCA_NUM_SERVERS + " Servers: ");
        Arrays.stream(keys).map(simpleHashing::getSimpleHash)
                .map(it -> it % SCA_NUM_SERVERS)
                .collect(Collectors.toList())
                .forEach(
                        it -> {
                            System.out.println("Map to server: " + it);
                        });
    }
}

```

## Consistent Hashing

```java
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.math3.stat.descriptive.moment.StandardDeviation;

import java.util.*;

public class ConsistentHashing {
    public static void main(String[] args){
        String[] keys = {"图片A.png", "图片B.png", "图片C.png", "图片D.png", "图片E.png", "test"};
        for (String key : keys)
            System.out.println("[" + key + "]的hash值为" +
                    getConsistentHash(key) + ", 路由到结点[" + mapToServerIP(key) + "]");

        System.out.println();
        System.out.println("所有KV值的标准差为：" +
                calculateStandardDeviation(allNodesHash.stream().mapToDouble(i -> i).toArray()));
    }

    //待添加入Hash环的服务器，共10个服务器节点
    private static String[] servers = {
            "192.168.0.0:111",
            "192.168.0.1:111",
            "192.168.0.2:111",
            "192.168.0.3:111",
            "192.168.0.4:111",
            "192.168.0.5:111",
            "192.168.0.6:111",
            "192.168.0.7:111",
            "192.168.0.8:111",
            "192.168.0.9:111"
    };

    private static String[] sca_servers = {
            "192.168.0.0:111",
            "192.168.0.1:111",
            "192.168.0.2:111",
            "192.168.0.3:111",
            "192.168.0.4:111",
            "192.168.0.5:111",
            "192.168.0.6:111",
            "192.168.0.7:111",
            "192.168.0.8:111",
            "192.168.0.9:111",
            "192.168.0.10:111",
            "192.168.0.11:111",
            "192.168.0.12:111",
            "192.168.0.13:111",
            "192.168.0.14:111",
            "192.168.0.15:111",
            "192.168.0.16:111",
    };

    //真实结点列表,考虑到服务器上线、下线的场景，即添加、删除的场景会比较频繁，这里使用LinkedList
    private static final List<String> realNodes = new LinkedList<String>();

    //用一个TreeMap来存储虚拟节点，key是虚拟节点的hash值，value是虚拟节点的名称
    private static final SortedMap<Integer, String> virtualNodes = new TreeMap<>();

    //虚拟节点的数目，这里hard coding，一个真实结点对应1万个虚拟节点
    private static final int VIRTUAL_NODES = 10000;

    //存储100万个虚拟节点数据的hash值
    static ArrayList<Double> allNodesHash = new ArrayList<>();

    static{
        //先把原始的服务器添加到真实结点列表中
        Collections.addAll(realNodes, sca_servers);

        //再添加虚拟节点，遍历LinkedList使用foreach循环效率会比较高
        for (String str : realNodes){
            for(int i = 0; i < VIRTUAL_NODES; i++){
                String virtualNodeName = str + "&&VN" + String.valueOf(i);
                int hash = getConsistentHash(virtualNodeName);
                allNodesHash.add((double)hash);
                System.out.println("虚拟节点[" + virtualNodeName + "]被添加, hash值为" + hash);
                virtualNodes.put(hash, virtualNodeName);
            }
        }
        System.out.println();
    }

    //使用FNV1_32_HASH算法计算服务器的Hash值,这里不使用重写hashCode的方法，最终效果没区别
    private static int getConsistentHash(String str){
        final int p = 16777619;
        int hash = (int)2166136261L;
        for (int i = 0; i < str.length(); i++)
            hash = (hash ^ str.charAt(i)) * p;
        hash += hash << 13;
        hash ^= hash >> 7;
        hash += hash << 3;
        hash ^= hash >> 17;
        hash += hash << 5;

        // 如果算出来的值为负数则取其绝对值
        if (hash < 0)
            hash = Math.abs(hash);
        return hash;
    }

    // 计算服务器数 * 虚拟节点数 个KV数据在服务器上分布数量（hash值）的标准差
    private static double calculateStandardDeviation(double[] values) {
        StandardDeviation sd = new StandardDeviation();
        return sd.evaluate(values);
    }

    //得到环中资源应该路由到的结点
    private static String mapToServerIP(String key){
        //得到该key的hash值
        int hash = getConsistentHash(key);
        // 得到大于该Hash值的所有Map
        SortedMap<Integer, String> subMap = virtualNodes.tailMap(hash);
        String virtualNode;
        if(subMap.isEmpty()){
            //如果没有比该key的hash值大的，则从第一个node开始
            Integer i = virtualNodes.firstKey();
            //返回对应的服务器
            virtualNode = virtualNodes.get(i);
        }else{
            //第一个Key就是顺时针过去离node最近的那个结点
            Integer i = subMap.firstKey();
            //返回对应的服务器
            virtualNode = subMap.get(i);
        }
        //virtualNode虚拟节点名称截取一下
        if(StringUtils.isNotBlank(virtualNode)){
            return virtualNode.substring(0, virtualNode.indexOf("&&"));
        }
        return null;
    }

}
```