---
permalink: Caching-and-LoadBalancing
---
### 一致性Hashing算法
#### 什么是一致性hashing算法？
首先回顾下什么是**Hashing**，Hashing是一种将任意大小的数据映射到固定大小的另一数据（通常是整数）的技术，称为哈希或哈希码。

比如，编写了一些哈希函数以将任意字符串映射到0到50之间的某个数字。就是对50进行取模：

> hashcode = hash(Artists) % 50

> 24 = hash(Artists) % 50

> 42 = hash(Actor) % 50


“Artists”和“Actor”是两个通过哈希函数分别产生24和42哈希码的字符串。

这里的数字可以代表集群的数量，如果固定一个取模数字，会导致扩展性太差，比如我们现在有3台服务器,那么对请求的key进行hash，之后拿到的hashcode对3进行取模，得到的数字就是该key应该存储的服务器，
设想一下现在我们需要新添加一台机器，也就是机器数量来到了4，那么对4取模的结果和对3取模的结果基本上全部不一样，也就是说我们需要对所有的key进行一次重新的hash计算并重新存储。

一致性Hashing算法，就是解决这样的扩展性问题的，其本质也是hash取模，只是是永远的对2的32次方-1取模，在此基础上可以描述为：
* 它以某种虚拟环结构（称为hashing）的形式来表示资源请求。
* 服务器节点的位置的数量不固定，但环被认为具有无限数量的点，并且服务器节点可以放置在该环上的随机位置。当然，可以使用哈希函数再次选择此随机数，但是跳过了将其除以可用位置数的第二步，因为它不再是有限数。
* 与经典哈希方法中的密钥类似的请求（即用户，计算机或无服务器程序）也使用相同的哈希函数放置在同一环上。

[一致性Hash算法解释](https://zhuanlan.zhihu.com/p/34985026)

#### 实现一致性Hash算法

```java
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.math3.stat.descriptive.moment.StandardDeviation;

import java.util.*;

public class ConsistentHashing {
    public static void main(String[] args){
        String[] keys = {"测试数据A", "测试数据B", "测试数据C"};
        for(int i = 0; i < keys.length; i++)
            System.out.println("[" + keys[i] + "]的hash值为" +
                    getHash(keys[i]) + ", 路由到结点[" + getServer(keys[i]) + "]");

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

    //真实结点列表,考虑到服务器上线、下线的场景，即添加、删除的场景会比较频繁，这里使用LinkedList
    private static List<String> realNodes = new LinkedList<String>();

    //用一个TreeMap来存储虚拟节点，key是虚拟节点的hash值，value是虚拟节点的名称
    private static SortedMap<Integer, String> virtualNodes = new TreeMap<>();

    //虚拟节点的数目，这里hard coding，一个真实结点对应10万个虚拟节点
    private static final int VIRTUAL_NODES = 5;

    //存储100万个虚拟节点数据的hash值
    static ArrayList<Double> allNodesHash = new ArrayList<>();

    static{
        //先把原始的服务器添加到真实结点列表中
        for(int i = 0; i < servers.length; i++)
            realNodes.add(servers[i]);

        //再添加虚拟节点，遍历LinkedList使用foreach循环效率会比较高
        for (String str : realNodes){
            for(int i = 0; i < VIRTUAL_NODES; i++){
                String virtualNodeName = str + "&&VN" + String.valueOf(i);
                int hash = getHash(virtualNodeName);
                allNodesHash.add((double)hash);
                System.out.println("虚拟节点[" + virtualNodeName + "]被添加, hash值为" + hash);
                virtualNodes.put(hash, virtualNodeName);
            }
        }
        System.out.println();
    }

    //使用FNV1_32_HASH算法计算服务器的Hash值,这里不使用重写hashCode的方法，最终效果没区别
    private static int getHash(String str){
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

    // 计算100万个KV数据在服务器上分布数量（hash值）的标准差
    private static double calculateStandardDeviation(double[] values) {
        StandardDeviation sd = new StandardDeviation();
        return sd.evaluate(values);
    }

    //得到环中资源应该路由到的结点
    private static String getServer(String key){
        //得到该key的hash值
        int hash = getHash(key);
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
        //virtualNode虚拟节点名称要截取一下
        if(StringUtils.isNotBlank(virtualNode)){
            return virtualNode.substring(0, virtualNode.indexOf("&&"));
        }
        return null;
    }

}

```

运行结果如下
```text
....
虚拟节点[192.168.0.9:111&&VN99992]被添加, hash值为310953256
虚拟节点[192.168.0.9:111&&VN99993]被添加, hash值为2106318235
虚拟节点[192.168.0.9:111&&VN99994]被添加, hash值为1040923106
虚拟节点[192.168.0.9:111&&VN99995]被添加, hash值为477565327
虚拟节点[192.168.0.9:111&&VN99996]被添加, hash值为1486841019
虚拟节点[192.168.0.9:111&&VN99997]被添加, hash值为164333562
虚拟节点[192.168.0.9:111&&VN99998]被添加, hash值为280005771
虚拟节点[192.168.0.9:111&&VN99999]被添加, hash值为605025151

[测试数据A]的hash值为1394078889, 路由到结点[192.168.0.1:111]
[测试数据B]的hash值为2008402949, 路由到结点[192.168.0.1:111]
[测试数据C]的hash值为177062043, 路由到结点[192.168.0.5:111]

所有KV值的标准差为：6.201337717205867E8
```