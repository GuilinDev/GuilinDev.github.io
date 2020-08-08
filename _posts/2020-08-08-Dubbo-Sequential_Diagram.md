---
permalink: Dubbo-Sequential-Diagram
---

Dubbo的同步调用时序图
![](/assets/img/blogs/2020-08-08/DubboSD.jpg)
上面是同步调用的流程，异步调用与之不同的是，调用线程拿DefaultFuture实例阻塞get结果，而是调用即返回（要立刻保存RpcContext中的Future的引用，不然可能被其他线程覆盖掉），在需要拿结果的时候，再用future.get()方法取结果即可。

