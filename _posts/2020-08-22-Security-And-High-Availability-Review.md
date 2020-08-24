---
permalink: Security-And-High-Availability-Review
---

## 软件安全性 
包括以下实践
* 身份验证机制和授权Authentication Mechanism & Authorization - 设计安全的系统，防止用户更改身份后无需验证身份，多因素身份验证，安全控制机制，资源授权和文件数据库权限等；
* 数据校验Data validation - 包括集中式验证机制，将数据转换为规范形式，实现语言级别类型来捕获有关数据有效性的假设等等；
* 加密Cryptography - 保护数据免遭未经授权的修改，验证数据源等；
* 识别敏感数Identifying & Handling Sensitive Data - 有些数据跟普通数据不用，要适合相关法规，公司政策，用户期望等，数据的敏感度包括访问控制机制（文件/内存/数据库保护机制），
用于保护数据的机密和完整性的密码学，冗余备份保持数据可用性等；
* 第三方风险 - 主要是集成威胁和兼容性问题；
* 日志监控 - 这个对安全性很重要，通过日志监控曼珠一些安全标准例如FIPS，HIPAA等；
* 考虑以下威胁：
    * 防注入Injection prevention
    * 验证和Session管理 Broken Authentication and Session Management
    * 跨站点脚本攻击 Cross-Site Scripting
    * Broken Access Control
    * 安全配置问题 Security Misconfiguration
    * 敏感数据泄露 Sensitive Data Exposure
    * 跨站请求伪造 Cross-Site Request Forgery (CSRF)
    * 已知漏洞组件 Using Components with Known Vulnerabilities
    * 等等

## 软件高可用性

在[<Transaction Across DataCenter>](https://snarfed.org/transactions_across_datacenters_io.html)中看到一幅图，如下：

![](/assets/img/blogs/2020-08-22/Transaction-Across-DataCenter.jpg)

觉得可以概况高可用系统中的解决方案了。