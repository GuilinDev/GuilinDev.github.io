---
permalink: Pattern-Refactor
---

### 单例模式Singleton
![单例实现](/assets/img/blogs/2020-06-20/singleton.jpg)
#### 静态内部类来实现
* 实现代码简洁。和双重检查单例对比，静态内部类单例实现代码真的是太简洁，又清晰明了。
* 延迟初始化。调用getSingleton才初始化Singleton对象。
* 线程安全。JVM在执行类的初始化阶段，会获得一个可以同步多个线程对同一个类的初始化的锁。

线程A和线程B同时试图获得Singleton对象的初始化锁，假设线程A获取到了，那么线程B一直等待初始化锁。
线程A执行类初始化，就算双重检查模式中伪代码发生了重排序，也不会影响线程A的初始化结果。初始化完后，释放锁。
线程B获得初始化锁，发现Singleton对象已经初始化完毕，释放锁，不进行初始化，获得Singleton对象。

#### 双重校验锁来实现
* 延迟初始化。和懒汉模式一致，只有在初次调用静态方法getSingleton，才会初始化signleton实例。
* 性能优化。同步会造成性能下降，在同步前通过判读singleton是否初始化，减少不必要的同步开销。
* 线程安全。同步创建Singleton对象，同时注意到静态变量singleton使用volatile修饰。

使用volatile的原因，因为在new Singleton()这步，会执行以下：
```java
memory=allocate(); //1：分配内存空间
ctorInstance();   //2:初始化对象
singleton=memory; //3:设置singleton指向刚排序的内存空间
```
当线程A在执行上面伪代码时，第一个校验(singleton == null)和synchronized可能会发生重排序，因为重排序并不影响运行结果，还可以提升性能，所以JVM是允许的。
如果此时伪代码发生重排序，步骤变为1volatile->3synchronized->2第一个校验,线程A执行到第3步时，线程B调用getsingleton方法，在判断singleton==null时不为null，则返回singleton。但此时singleton并还没初始化完毕，线程B访问的将是个还没初始化完毕的对象。当声明对象的引用为volatile后，伪代码的2、3的重排序在多线程中将被禁止。


#### 其它情况
在涉及到反射和序列化的单例中

《Effective Java》是推荐该方法的。虽然线程安全，在实际开发中，还没有被广泛采用。因为太过简洁以致于可读性较差，还没有在实战中被广泛推广。枚举单例模式的线程安全同样利用静态内部类中讲到类初始化锁。枚举单例模式能够在序列化和反射中保证实例的唯一性。

```java
public enum Singleton {
    INSTANCE;
    
    public void doSomething(){
        //todo doSomething
    }
}

```

### 组合设计模式Composite Pattern
![组合模式实现](/assets/img/blogs/2020-06-20/compositePattern.png)