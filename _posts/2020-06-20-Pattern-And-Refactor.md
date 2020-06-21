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

组合模式的主要优点如下：

* 组合模式可以清楚地定义分层次的复杂对象，表示对象的全部或部分层次，它让客户端忽略了层次的差异，方便对整个层次结构进行控制。
* 客户端可以一致地使用一个组合结构或其中单个对象，不必关心处理的是单个对象还是整个组合结构，简化了客户端代码。
* 在组合模式中增加新的容器构件和叶子构件都很方便，无须对现有类库进行任何修改，符合“开闭原则”。
* 组合模式为树形结构的面向对象实现提供了一种灵活的解决方案，通过叶子对象和容器对象的递归组合，可以形成复杂的树形结构，但对树形结构的控制却非常简单。

组合模式的主要缺点如下：

* 使得设计更加复杂，客户端需要花更多时间理清类之间的层次关系。
* 在增加新构件时很难对容器中的构件类型进行限制。

适用场景：
* 在具有整体和部分的层次结构中，希望通过一种方式忽略整体与部分的差异，客户端可以一致地对待它们。
* 在一个使用面向对象语言开发的系统中需要处理一个树形结构。
* 在一个系统中能够分离出叶子对象和容器对象，而且它们的类型不固定，需要增加一些新的类型。

![组合模式实现](/assets/img/blogs/2020-06-20/compositePatternAWT.png)
大体设计代码如下
```java
import javax.swing.*;
import java.awt.*;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;

import javax.swing.ImageIcon;


public class MyFrame extends Frame {
    public MyFrame(String title) {
        super(title);
    }

    public static void main(String[] args) {
        MyFrame frame = new MyFrame("This is a Window Form");

        /**
         * 定义顶部Logo
         */
        JLabel imgLabel = new JLabel(new ImageIcon("logo.png"));
        frame.add(imgLabel, BorderLayout.NORTH);

        /**
         * 定义底部按钮
         */
        JPanel buttons = new JPanel();
        JButton buttonLogin = new JButton("Login");
        JButton buttonRegister = new JButton("Register");
        buttons.add(buttonLogin);
        buttons.add(buttonRegister);
        frame.add(buttons, BorderLayout.SOUTH);


        TextField textField = new TextField("This is an AWT TextField!");


        Label labelFrame = new Label("");
        frame.add(labelFrame, BorderLayout.CENTER);

        /**
         * 定义一个 Panel，在Panel中添加四个构件，然后再把Panel添加到Frame中去
         */
        // 面板
        Panel panel = new Panel();
        panel.setBackground(Color.pink);
        // 用户输入框
        Label lableUsername = new Label("Username");
        TextField textFieldUsername = new TextField("", 20);
        panel.add(lableUsername);
        panel.add(textFieldUsername);
        // 密码输入框
        Label lablePassword = new Label("Password");
        TextField textFieldPassword = new TextField("", 20);
        panel.add(lablePassword);
        panel.add(textFieldPassword);
        // 记住密码单选框
        Checkbox chkUsername = new Checkbox("Remember Username");
        panel.add(chkUsername);
        // 找回密码链接
        JLabel hyperlink = new JLabel("Forget Password?");
        panel.add(hyperlink);
        // 将panel加入到frame当中
        frame.add(panel, BorderLayout.CENTER);

        // 设置Frame的属性
        frame.setSize(500, 300);
        frame.setBackground(Color.orange);
        // 设置点击关闭事件
        frame.addWindowListener(new WindowAdapter() {
            @Override
            public void windowClosing(WindowEvent e) {
                System.exit(0);
            }
        });
        frame.setVisible(true);
    }
}
```