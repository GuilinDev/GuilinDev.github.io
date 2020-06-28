---
permalink: Dependency-Inversion-Principle-framework
---
### Dependency Inversion Principle框架
> 以WinSCP举例，说明一个Remote file server client实现依赖反转原则的例子
为远程文件服务器（FTP，云存储...）实现一个客户端。可能将其视为一组抽象接口：

* 连接/断开连接（可能需要连接持久层）
* 文件夹/标签创建/重命名/删除/列表界面
* 文件创建/替换/重命名/删除/读取界面
* 档案搜寻
* 并发替换或删除解决方案
* 文件历史记录管理...

如果本地文件和远程文件都提供相同的抽象接口，则使用本地文件并完全实现Dependency Inversion Priciple的任何高级模块都将能够不加区别地访问本地和远程文件。

本地磁盘通常使用文件夹，远程存储可能使用文件夹和/或标签。如果可能，必须决定如何统一它们。

在远程文件上，我们可能只需要使用create或replace：远程文件更新不一定有意义，因为与本地文件随机更新相比，随机更新太慢了，实现起来可能非常复杂。
在远程文件上，我们可能需要部分读写（至少在远程文件模块内部，以便在通信中断后允许下载或上传恢复），但是不适应随机读取（除非使用了本地缓存）。

文件搜索可以是可插入的：文件搜索可以依赖于OS，或者特别是用于标记或全文搜索，可以通过不同的系统（嵌入式OS或单独提供）实现。

并发替换或删除可能会影响其他抽象接口。

在为每个概念性界面设计远程文件服务器客户端时，必须询问自己高级模块所需的服务水平（不一定是全部模块），不仅要了解如何实现远程文件服务器功能，还可能要如何制作文件。应用程序中的服务在已实施的文件服务（本地文件，现有的云客户端）和新的远程文件服务器客户端之间兼容。

设计所需的抽象接口后，远程文件服务器客户端应实现这些接口。并且由于您可能限制了本地文件上现有的某些本地功能（例如文件更新），因此您可能必须为本地或其他现有的使用过的远程文件访问模块编写适配器，每个模块都提供相同的抽象接口。您还必须编写自己的文件访问枚举器，以检索计算机上可用并配置的所有文件兼容系统。

完成后，您的应用程序将能够在本地或远程透明地保存其文档。或更简单地说，使用新文件访问接口的高级模块可以在本地或远程文件访问方案中模糊使用，从而使其可重用。

注意：许多操作系统已经开始实现这类功能。在此示例中，将模块视为一组抽象接口，并使其他模块适应该组接口，可以为许多文件存储系统提供通用接口。