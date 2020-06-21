---
permalink: File-System
---

### 组合模式 + 树形结构
树形结构不论在生活中或者是开发中都是一种非常常见的结构，一个容器对象（如文件夹）下可以存放多种不同的叶子对象或者容器对象，容器对象与叶子对象之间属性差别可能非常大。

由于容器对象和叶子对象在功能上的区别，在使用这些对象的代码中必须有区别地对待容器对象和叶子对象，而实际上大多数情况下我们希望一致地处理它们，因为对于这些对象的区别对待将会使得程序非常复杂。

组合模式为解决此类问题而诞生，它可以让叶子对象和容器对象的使用具有一致性。

组合模式(Composite Pattern)：组合多个对象形成树形结构以表示具有 “整体—部分” 关系的层次结构。组合模式对单个对象（即叶子对象）和组合对象（即容器对象）的使用具有一致性，组合模式又可以称为 “整体—部分”(Part-Whole) 模式，它是一种对象结构型模式。

由于在软件开发中存在大量的树形结构，因此组合模式是一种使用频率较高的结构型设计模式，Java SE中的AWT和Swing包的设计就基于组合模式。

除此以外，在XML解析、组织结构树处理、文件系统设计等领域，组合模式都得到了广泛应用。

### 角色

Component（抽象构件）：它可以是接口或抽象类，为叶子构件和容器构件对象声明接口，在该角色中可以包含所有子类共有行为的声明和实现。在抽象构件中定义了访问及管理它的子构件的方法，如增加子构件、删除子构件、获取子构件等。

Leaf（叶子构件）：它在组合结构中表示叶子节点对象，叶子节点没有子节点，它实现了在抽象构件中定义的行为。对于那些访问及管理子构件的方法，可以通过异常等方式进行处理。

Composite（容器构件）：它在组合结构中表示容器节点对象，容器节点包含子节点，其子节点可以是叶子节点，也可以是容器节点，它提供一个集合用于存储子节点，实现了在抽象构件中定义的行为，包括那些访问及管理子构件的方法，在其业务方法中可以递归调用其子节点的业务方法。

组合模式的关键是定义了一个抽象构件类，它既可以代表叶子，又可以代表容器，而客户端针对该抽象构件类进行编程，无须知道它到底表示的是叶子还是容器，可以对其进行统一处理。同时容器对象与抽象构件类之间还建立一个聚合关联关系，在容器对象中既可以包含叶子，也可以包含容器，以此实现递归组合，形成一个树形结构。

### 示例

我们来实现一个简单的目录树，有文件夹和文件两种类型，首先需要一个抽象构件类，声明了文件夹类和文件类需要的方法
```java 
package designPatterns.composite;

/**
 * 抽象构件类，声明了文件夹类和文件类需要的方法
 */
public abstract class Component {
    /**
     * get Component name
     * @return
     */
    public String getName() {
        throw new UnsupportedOperationException("Not support getName operation");
    }
    /**
     * get component content
     * @return
     */
    public String getContent() {
        throw new UnsupportedOperationException("Not support getContent operation");
    }

    /**
     * Add component
     * @param component
     */
    public void add(Component component) {
        throw new UnsupportedOperationException("Not support add operation");
    }

    /**
     * Remove component
     * @param component
     */
    public void remove(Component component) {
        throw new UnsupportedOperationException("Not support remove operation");
    }

    /**
     * Print all components
     */
    public void print() {
        throw new UnsupportedOperationException("Not support print operation");
    }
}

```
实现一个文件夹类 Folder，继承 Component，定义一个 List<Component> 类型的componentList属性，用来存储该文件夹下的文件和子文件夹，并实现 getName、add、remove、print等方法
```java 
import java.util.ArrayList;
import java.util.List;

public class Folder extends Component {
    private String name;
    private List<Component> componentList = new ArrayList<Component>();

    public Folder(String name) {
        this.name = name;
    }

    @Override
    public String getName() {
        return this.name;
    }

    @Override
    public void add(Component component) {
        this.componentList.add(component);
    }

    @Override
    public void remove(Component component) {
        this.componentList.remove(component);
    }

    @Override
    public void print() {
        System.out.println(this.getName());
        for (Component component : this.componentList) {
            component.print();
        }
    }
}
```
文件类 File，继承Component父类，实现 getName、print、getContent等方法
```java 
public class File extends Component {
    private String name;
    private String content;

    public File(String name, String content) {
        this.name = name;
        this.content = content;
    }

    @Override
    public String getName() {
        return this.name;
    }

    @Override
    public String getContent() {
        return this.content;
    }

    @Override
    public void print() {
        System.out.println(this.getName());
    }
}

```
创建各个文件夹和相应文件，进行测试
```java 
public class TestComposite {
    public static void main(String[] args) {
        /**
         * dsFolder >> codeFolder >> srcFolder
         */
        // 创建一个folder
        Folder dsFolder = new Folder("top Folder");
        // 添加两个文件
        File note1 = new File("Note1.md","This is inside note1 file");
        File note2 = new File("Note2.md","This is inside note2 file");
        dsFolder.add(note1);
        dsFolder.add(note2);

        // 创建另两个folder，其中src是子folder
        Folder codeFolder = new Folder("code Folder");
        File readme = new File("README.md", "This is Readme file");
        Folder srcFolder = new Folder("src Folder");
        File code1 = new File("code1.java", "Arrays.sort()");

        srcFolder.add(code1);
        codeFolder.add(srcFolder);
        codeFolder.add(readme);
        dsFolder.add(codeFolder);

        dsFolder.print();
    }
}
```
输出结果
```text
top Folder
Note1.md
Note2.md
code Folder
src Folder
code1.java
README.md
```
输出正常，不过有个小问题，从输出看不出它们的层级结构，为了体现出它们之间的层级关系，我们需要改造一下 Folder 类，增加一个 level 属性，并修改 print 方法
```java 
import java.util.ArrayList;
import java.util.List;

public class Folder extends Component {
    private String name;
    private List<Component> componentList = new ArrayList<>();
    public Integer level;

    public Folder(String name) {
        this.name = name;
    }

    @Override
    public String getName() {
        return this.name;
    }

    @Override
    public void add(Component component) {
        this.componentList.add(component);
    }

    @Override
    public void remove(Component component) {
        this.componentList.remove(component);
    }

    @Override
    public void print() {
        System.out.println(this.getName()); // 打印component名字
        if (this.level == null) {
            this.level = 1;
        }
        String prefix = "";
        for (int i = 0; i < this.level; i++) {
            prefix += "\t- ";
        }
        // 打印List中的components
        for (Component component : componentList) {
            if (component instanceof Folder) {
                ((Folder)component).level = this.level + 1;
            }
            System.out.print(prefix); // 打印缩进
            component.print();
        }
        this.level = null;
    }
}
```
现在的输出就有相应的层级结构
```text
top Folder
	- Note1.md
	- Note2.md
	- code Folder
	- 	- src Folder
	- 	- 	- code1.java
	- 	- README.md
```
文件系统类图
![文件系统类图](/assets/img/blogs/2020-06-21/FileSystemClassDiagram.png)

在这里父类 Component 是一个抽象构件类，Folder 类是一个容器构件类，File 是一个叶子构件类，Folder 和 File 继承了 Component，Folder 与 Component 又是聚合关系