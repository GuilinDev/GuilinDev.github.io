---
layout: post
permalink: Web-Security-Fundamentals
---

## 1. Cross Site Scripting (XSS)
XSS跨站脚本攻击，为了与CSS避免同名，所以缩写为XSS。攻击方式是利用网页开发时留下的漏洞，讲恶意脚本嵌入到用户将会访问的页面中，这样当正常用户访问该页面时，会导致之前嵌入的恶意脚本被执行，从而恶意攻击用户。

### 1.1 反射型XSS
在正常页面上，攻击者在URL中使用URLEncode相关方法对路径加密，诱惑用户访问一个加密后的URL，当用户点击该恶意URL时，恶意代码会在用户主机的浏览器上执行，获取cookie等隐私信息。步骤：

    1. 制作恶意链接例如中奖网站，对一些有需要传参的路径加入 JS 脚本代码，同时开发人员没有针对路径的参数进行转义过滤，导致这些链接出现在页面上（或邮件钓鱼）。
    2. 通过恶意链接诱导用户点击。
    3. 用户打开页面后，会触发链接中带的脚本代码，从而实行攻击。

例子：
```html
https://www.hiyd.com/dongzuo/?name=%3Cscript%3Ealert(document.cookie);%3C/script%3E
```
![](/assets/img/blogs/2021-09-16/xss0.png)

这种XSS攻击主要针对前端，并未改变网站的核心逻辑。

### 1.2 存储型XSS
这种攻击更严重一些，攻击者发现网站中存在某个漏洞，可以把 HTML 或 JS 的代码直接保存到数据库。同样后端没有对标签过滤，当response返回给前端展示时，浏览器直接解析运行这部分恶意 HTML 或 JS 代码，实行攻击。由于该部分代码是存储在数据库的，只要访问到该代码的人，都会被成为攻击的主体，从而窃取访问者的信息。步骤：

    1. 攻击者将恶意代码（HTML、JS） 提交到目标网站的数据库保存，后端人员没有对 HTML、JS 相关代码转义。
    2. 用户访问到包含从数据库中取出的恶意代码的网页；
    3. 这部分恶意代码被执行，间接盗取用户相关信息，攻击者可以冒充该用户在平台进行操作。
    
### 1.3 XSS的预防
XSS攻击的根本原理是用户输入的数据存在代码时，没有针对性进行转义和过滤，浏览器以为是正常的 HTML、JS 代码而被运行。

前端也可以对后端获取的数据做一下处理，比如对 script 标签，将特殊字符替换成 HTML 编码这些等。前端获取浏览器的参数时，要对参数过滤，目前大多数浏览器都会对从 URL 中获取的内容进行编码，这也可以阻止执行任何注入的 JavaScript 代码。后端可以对前端提交过来的数据，其中的特殊字符例如"<","'"等进行转义处理，例子：

    < 符号转义为 HTML 的 &lt;
    > 符号转义为 HTML 的 &gt;
    ' 符号转义为 HTML 的 &amp;
    " 符号转义为 HTML 的 &quot;

## 2. Cross-Site Request Forgery (CSRF,XSRF)
CSRF和XSS不同是，XSS利用站点内的信任用户进行攻击，而CSRF是通过伪装成来自受信任用户的请求来利用受信任的网站。CSRF攻击利用的是盗用身份，然后冒充盗用的身份向第三方网站发送恶意请求，CSRF能做的事情包括利用盗走的身份发邮件，发短信，进行交易转账等，甚至盗取账号。这利用 Web中用户身份验证的一个漏洞：简单的身份验证只能保证请求发自某个用户的浏览器，却不能保证请求本身是用户自愿发出的。

![](/assets/img/blogs/2021-09-16/csrf0.png)

受害者只需做下面的两件事，攻击者就能够完成CSRF攻击：

    1. 登录受信任的服务器 B，在本地生成未过期的 Cookie；
    2. 在不登出站点 B 的情况下（未清空服务器 B 的 Cookie），服务器 C 窃取用户 Cookie 恶意访问服务器 B。
    
很多情况下，恶意站点可能是一个存在其他漏洞（例如XSS）的受信任并且被很多人访问的站点，这时用户可能在不知不觉中成为受害者

### 2.2 CSRF的预防

### 2.2.1 使用 Token

Token是预防CSRF的主要方法，开发者可以在HTTP header中以参数的形式加入一个随机产生的Token，在服务端校验Token，如果请求中没有Token 或者Token 不正确，那么可以认为是 CSRF 攻击，而拒绝请求。Token主要是在请求中放入攻击者无法伪造的信息，避免了攻击者进行攻击。

![](/assets/img/blogs/2021-09-16/csrf1.jpg)

### 2.2.2 将 Cookie 设置为 HttpOnly

根据前面介绍的 XSRF 的攻击原理知道，XSRF 的攻击上很大程度是利用了用户的 Cookie，为了防止站内的 XSS 漏洞被盗取 Cookie，可以在 Cookie 中设置为“HttpOnly”属性，这样别人就无法通过程序读取到该站点的 Cookie 信息，避免攻击者伪造 Cookie 的情况出现。

### 2.2.3 使用验证码

增加验证码类似于通过 Token 进行访问判断，但是这样的体验一般不是很好，所以验证码一般用于留言、评论、登录这种地方。

### 2.2.4 通过 Referer 识别

HTTP 协议中有一个 Referer 字段，它表示的是访问来源，服务器端可以根据该字段判断，判断该来源的域名是否是本地网站，如果不是的话，可以直接认为是危险链接，拒绝访问。但是如果我们把网站页面分享出去给别人，例如微信、QQ，其他人从微信朋友圈点击进来，那么该 Referer 也不是本地域名网站的。

## 3. SQL Injection
SQL注入是指通过把SQ 命令伪装成正常的HTTP请求参数，传递到服务端，欺骗服务器执行恶意的SQL命令。攻击者可以利用SQL注入漏洞，查询非授权信息，修改数据库服务器的数据，改变表结构，甚至是获取服务器 root 权限。通常是因为后端开发人员对用户所输入的数据或Cookie 等内容不进行过滤或验证（即存在注入点）就直接传输给数据库，就可能导致攻击者拼接的SQL被执行，从而获取对数据库的信息以及提权。

### 3.1 SQL Injection的攻击原理
例如有这样一个前端登陆页面
```html
<html>
    <title>Test</title>
    <body>
            <form action="" method="post">
                Username：<input type="text" name="username" > <br/>
                Password：<input type="text" name="password" > <br/>
                <input type="submit"  value="login"> 
            </form>
    </body>
</html>
```

后端的查询 SQL 为:
```sql
select * from user where username='{$name}' and password=‘{$password}’
```
如果后端获取前端输入的参数后，没有对参数进行过滤，而是直接拼接原生SQL让数据库执行，例如用户输入用户名“john”，密码为 ' or '1'='1 时，具体SQL会如下所示：
```sql
select * from user where username='john' and password=‘' or '1'='1’
```
这时不管用户名和密码是什么，是否正确，SQL 中的 1=1 都是满足条件的，查出来的用户列不会为空，攻击者获取用户信息，如果drop table表名则损失更大，这只是简单的示例，SQL注入还有更危险的攻击手法。

### 3.2 SQL Injection的预防
主要有以下措施：

    1. 使用预编译语句，这样即使使用SQL语句伪造参数进行攻击，到了服务端的时候，这个伪造的SQL语句参数也只是简单的字符串。
    2. 存储在数据库的重要信息，例如密码等不要明文存储，避免数据库数据泄露后，用户的密码一并被暴露。
    3. 对数据库的操作相关语句，做好异常处理，避免数据库执行的SQL语句编写暴露在用户访问页面中，泄露表的结构字段。

## 4. DoS/DDoS
（分布式）拒绝服务攻击，是目前最难以防御的攻击方式之一。攻击者借助公共网络，将数量庞大的计算机设备联合起来作为攻击平台，对一个或多个目标发动攻击，使目标主机瘫痪。通常在攻击开始前，攻击者会提前控制大量的用户计算机，称之为“肉鸡”，并通过指令使大量的肉鸡在同一时刻对某个主机进行访问，从而达到瘫痪目标主机的目的。常见的三种DDoS攻击：

### 4.1 DDoS攻击手段 - SYN Flood
首先要了解TCP协议的通信流程。TCP协议为了保证数据传输的可靠性，在三次握手的过程中新增了异常处理机制。如果在第三次握手中服务器没有收到客户端的ACK 报文，服务端会尝试重试，即再次发送SYN + ACK报文给客户端，状态一直是SYN_RECV状态，然后将客户端加入等待列表。重发的次数一般在3~5次，每隔30秒左右会再轮询一遍等待队列，重新重试所有客户端；另一面，服务器在发出 SYN + ACK 报文后，对应的预分配一部分资源给即将建立的 TCP 连接使用，这个资源在等待重试期间会一直保留，最重要的是，服务器资源本身是有限的，可以维护的等待列表超过极限后就不能再接收新的SYN报文，就会出现拒绝建立新的TCP连接的情况。

![](/assets/img/blogs/2021-09-16/ddos0.jpg)

而 SYN Flood 的攻击原理正是利用了 TCP 协议三次握手的这个过程达成攻击目的。伪造大量的IP地址向服务器发送 SYN 报文，因为伪造的IP地址基本不存在，客户端也就不可能有响应，服务端就需要维护一个非常大的半连接等待列表，不断的对这个列表的 IP 地址遍历和尝试，服务器的大量资源就会被占用。大量的恶意客户端信息占满服务器的等待队列后，服务器会不再接收新的SYN请求，正常的用户就无法完成三次握手与服务器通信。

### 4.2 DDoS攻击手段 - Challenge Collapser CC攻击 (HTTP flood)
从应用层发起，利用代理服务器向目标服务器发起大量HTTP Get请求；主要请求动态页面，涉及到数据库访问操作；使目标数据库负载以及数据库连接池负载极高，无法响应正常请求。

![](/assets/img/blogs/2021-09-16/ddos1.jpg)

### 4.3 DDoS攻击手段 - DNS Query Flood
一种UDP Flood的形式，目标是瘫痪DNS，通过发起大量的 DNS 请求，导致 DNS 服务器无法响应正常用户的请求，正常用户不能解析 DNS，从而不能获取服务。

![](/assets/img/blogs/2021-09-16/ddos2.png)

### 4.4 DDoS的防御

#### 4.4.1 对异常流量的清洗过滤

通过 DDoS 硬件防火墙对异常流量的清洗过滤，通过数据包的规则过滤、数据流指纹检测过滤、及数据包内容定制过滤等技术能比较准确判断外来访问流量是否正常，进一步将异常流量禁止过滤。单台负载每秒可防御900万个 syn 攻击包。

#### 4.4.2 分布式集群防御

这是目前网络安全界防御大规模DDoS攻击的最有效办法。分布式集群防御的特点是在每个节点服务器配置多个IP地址，并且每个节点能承受不低于10G的 DDoS 攻击，如一个节点受攻击无法提供服务，系统将会根据优先级设置自动切换另一个节点，并将攻击者的数据包全部返回发送点，使攻击源成为瘫痪状态，从更为深度的安全防护角度去影响企业的安全执行决策。

#### 4.4.3 智能DNS解析

智能DNS解析系统与DDoS防御系统的完美结合，为企业提供对抗新兴安全威胁的超级检测功能。它颠覆了传统一个域名对应一个镜像的做法，智能根据用户的上网路线将 DNS 解析请求解析到用户所属网络的服务器。同时智能DNS解析系统还有宕机检测功能，随时可将瘫痪的服务器IP智能更换成正常服务器IP。

## 5. 常见网络防御技术手段

### 5.1 Digital Signature
将任意长度的消息变成一个唯一对应固定长度的值，它由一个单向 Hash 函数对消息进行计算而产生。它将需要加密的明文转换成一串固定长度（比如128 位）的密文，这一串密文又称为数字指纹，它有固定的长度。不同的明文摘要成密文，它的结果总是不同的，而同样的明文它的摘要一定是一样的。

接收者通过接收到的消息采用相同的Hash重新计算，新产生的指纹与原指纹进行比较，就知道消息是否被篡改了。

一个Hash函数的好坏是通过碰撞的概率决定的，如果攻击者能够通过构造两个消息具有相同的Hash值，这样的 Hash 函数是很危险的。正常来说，安全Hash标准的输出长度至少为160位，这样才能保证它足够的安全。 现在使用的安全Hash编码法有 SHA、MD5 等方法。

### 5.1 Symmetric-Key Encryption
加密和解密使用同一密钥。在对称加密算法中，发送方将明文（原始数据）和加密密钥一起经过特殊加密算法处理后，生成复杂的加密密文进行发送，数据接收方收到密文后，若想读取原文，则需要使用加密使用的密钥及相同算法的逆算法对加密的密文进行解密，才能使其恢复成可读明文。它的优点是运算速度快；缺点是无法安全地将密钥传输给通信方。

![](/assets/img/blogs/2021-09-16/ske0.png)

### 5.1 Public-key cryptography / Asymmetric-Key Encryption
加密和解密使用不同的密钥。公开密钥所有人都可以获得，通信发送方获得接收方的公开密钥之后，就可以使用公开密钥进行加密，接收方收到通信内容后使用私有密钥解密。

非对称密钥除了用来加密，还可以用来签名。因为私有密钥无法被其他人获取，因此通信发送方使用其私有密钥进行签名，通信接收方使用发送方的公开密钥对签名进行解密，就能判断这个签名是否正确。它的优点是可以更安全地将公开密钥传输给通信发送方；它的缺点是运算速度慢。

![](/assets/img/blogs/2021-09-16/ake0.jpg)

### 6 常见的前后端鉴权方式
Session-Cookie

Token (JWT, SSO)

OAuth2.0

## 7. 防止第三方监听和劫持

### HTTPS (SSL/TLS)

![](/assets/img/blogs/2021-09-16/https0.png)

HTTPS步骤：

    1. 浏览器将自己支持的一套加密规则发送给网站。
    2. 网站从中选出一组加密算法和HASH算法，并将自己的身份信息以证书的形式发回给浏览器。证书里面包含了网站地址，加密公钥，以及证书的颁发机构等信息。
    3. 浏览器获得网站证书之后，验证证书的合法性：
        3.1 如果证书受信任，或者是用户接受了不受信的证书，浏览器会生成一串随机数的密码，并用证书中提供的公钥加密。
        3.2 使用约定好的HASH算法计算握手消息，并使用生成的随机数对消息进行加密，最后将之前生成的所有信息发送给网站。
    4. 网站接收浏览器发来的数据之后：
        4.1 使用自己的私钥将信息解密取出密码，使用密码解密浏览器发来的握手消息，并验证 HASH 是否与浏览器发来的一致。
        4.2 使用密码加密一段握手消息，发送给浏览器。
    5. 浏览器解密并计算握手消息的 HASH，如果与服务端发来的 HASH 一致，此时握手过程结束，之后所有的通信数据将由之前浏览器生成的随机密码并利用对称加密算法进行加密。
    
![](/assets/img/blogs/2021-09-16/https1.png)