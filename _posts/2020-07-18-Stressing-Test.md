---
permalink: Stressing-Test
---
> 性能压测的时候，随着并发压力的增加，系统响应时间和吞吐量如何变化，为什么？

#### QPS
Queries Per Second指“每秒查询率”，是一台服务器每秒能够相应的查询次数，是对一个特定的查询服务器在规定时间内所处理流量多少的衡量标准。
互联网中，作为域名系统服务器的机器的性能经常用每秒查询率来衡量。

#### TPS
Transactions Per Second，也就是事务数/秒。它是软件测试结果的测量单位。
一个事务是指一个客户机向服务器发送请求然后服务器做出反应的过程。客户机在发送请求时开始计时，收到服务器响应后结束计时，以此来计算使用的时间和完成的事务个数。

#### QPS vs TPS
QPS基本类似于TPS，但是不同的是，对于一个页面的一次访问，形成一个TPS；但一次页面请求，可能产生多次对服务器的请求，服务器对这些请求，就可计入“QPS”之中。
如，访问一个页面会请求服务器2次，一次访问，产生一个“T”，产生2个“Q”。

#### RT
Response time，响应时间，执行一个请求从开始到最后收到响应数据所花费的总体时间,即从客户端发起请求到收到服务器响应结果的时间。
RT是一个系统最重要的指标之一，它的数值大小直接反应了系统的快慢。

#### Concurrency
并发数，是指系统同时能处理的请求数量，这个也是反应了系统的负载能力。

#### Throughput
吞吐量，系统的吞吐量（承压能力）与request对CPU的消耗、外部接口、IO等等紧密关联。单个request 对CPU消耗越高，外部系统接口、IO速度越慢，系统吞吐能力越低，反之越高。
系统吞吐量几个重要参数：QPS（TPS）、并发数、响应时间。

1. QPS（TPS）：（Query Per Second）每秒钟request/事务 数量
2. 并发数： 系统同时处理的request/事务数
3. 响应时间： 一般取平均响应时间

#### 举例
* QPS（TPS）= 并发数 / 平均响应时间
* 并发数 = QPS * 平均响应时间

按照二八定律，如果每天 80% 的访问集中在 20% 的时间里，这 20% 时间就叫做峰值时间。

* 公式：( 总PV数 * 80% ) / ( 每天秒数 * 20% ) = 峰值时间每秒请求数(QPS)
* 机器：峰值时间每秒QPS / 单台机器的QPS = 需要的机器

1. 每天300w PV 的在单台机器上，这台机器需要多少QPS？
    * ( 3000000 * 0.8 ) / (86400 * 0.2 ) = 139 (QPS)
2. 如果一台机器的QPS是58，需要几台机器来支持？
    * 139 / 58 = 3
    
#### 结论
1. 单线程QPS公式：QPS=1000ms/RT
对同一个系统而言，支持的线程数越多，QPS越高。假设一个RT是80ms,则可以很容易的计算出QPS,QPS = 1000/80 = 12.5
多线程场景，如果把服务端的线程数提升到2，那么整个系统的QPS则为 2*（1000/80） = 25, 可见QPS随着线程的增加而线性增长，那QPS上不去就加线程呗，听起来很有道理，
公司也说的通，但是往往现实并非如此。
2. QPS和RT的真实关系

我们想象的QPS、RT关系如下:

![](/assets/img/blogs/2020-07-18/qps_rt_1.png)

实际的QPS、RT关系如下:

![](/assets/img/blogs/2020-07-18/qps_rt_2.png)

3. 最佳线程数量
刚好消耗完服务器的瓶颈资源的临界线程数，公式如下
最佳线程数量=（（线程等待时间+线程cpu时间）/线程cpu时间）* cpu数量

特性：
* 在达到最佳线程数的时候，线程数量继续递增，则QPS不变，而响应时间变长，持续递增线程数量，则QPS开始下降。
* 每个系统都有其最佳线程数量，但是不同状态下，最佳线程数量是会变化的。
* 瓶颈资源可以是CPU,可以是内存，可以是锁资源，IO资源：超过最佳线程数-导致资源的竞争，超过最佳线程数-响应时间递增。


> 写一个 web 性能压测工具，输入参数：URL，请求总次数，并发数。输出参数：平均响应时间，95% 响应时间。用这个测试工具以 10 并发、100 次请求压测 www.baidu.com。

压力测试是一种外部测试（即黑盒测试）的形式，它可以在极端负载条件下测试应用程序的弹性，并检查其正确性和稳定性。

这使我们能够在系统开始崩溃和不可靠之前了解系统的容量和硬限制。还正在测试这个级别的错误管理，这使我们可以设计应用程序来管理在这些异常浪涌情况下的正确错误解决方案，从而提高系统的可恢复性。

在进行压力测试时，不仅要测试应用程序，还要测试所有相关的服务，资源和基础结构。资源通常是这些测试期间的瓶颈，应用程序通常会在CPU和内存资源用尽以正常运行时开始崩溃。
从测试中获得的度量标准使我们能够了解当前资源的限制，从而告知我们何时进行升级，从而提高了成本效率。

如果使用的是Kubernetes之类的高级协调器，那么压力测试是否还允许我们调整自动缩放因子，从而在服务开始复制Pod来容纳额外负载之前定义CPU限制。
可以使用这样的编排器将提高性价比，使其适应不断增长的需求负载。

#### 与负载测试Load Testing的区别
“负载测试”经常被与“压力测试”相混淆。负载测试是按照**预期**的设计需求（即实际工作量）模拟负载。
假设该产品预计每天最多可为5000个用户提供服务，平均RPS（每秒请求数）为150。
然后，我们将测试系统上给定负载附近的负载，并期望其平稳可靠地运行，这与压力测试一样会使系统承受尽可能多的负载，但不会像压力测试那样让系统宕机。

另一个区别是压力测试的成本也可能更高，这是因为可能会花费大量资源来进行此类破坏系统的测试，因此压力测试通常在较小的时间周期内进行，而负载测试则在较长的时间段内进行以模拟恒定负载。

Python建立Locust终端压测[例子](https://medium.com/happyfresh-fleet-tracker/danny-stress-testing-1146a0619416)

```python
import time
import gevent

from websocket import create_connection

from locust import HttpLocust, TaskSet, task
from locust.events import request_success

class UserTaskSet(TaskSet):
    @task(1)
    def index(self):
        self.client.get("/")

    @task(2)
    def sent(self):
        start_at = time.time()
        ws = create_connection('www.baidu.com')
        def _receive():
            while True:
                res = ws.recv()
                data = json.loads(res)
                response_time = int((time.time() - start_at) * 1000)
                request_success.fire(
                    request_type='WSS',
                    name='api/v1/websocket/',
                    response_time=response_time,
                    response_length=len(res),
                )
        gevent.spawn(_receive)

class CustomerUser(HttpLocust):
    task_set = UserTaskSet
    host = "https://www.baidu.com"
    min_wait = 500
    max_wait = 1500
```