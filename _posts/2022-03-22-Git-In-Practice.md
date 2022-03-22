---
layout: post
permalink: git-in-practice
---

## Git常用技巧

### 修改已经push到remote branch的commit信息
有时候需要修改之前已经push到remote branch的commit信息，例如commit中的名字拼错了ticket的名字，需要修改以满足Jira Key的要求。

#### Most recent commit
直接弹出最近push的commit，弹出editor后修改message然后强制提交
```shell
git commit --amend
git push -f
```

#### Not most recent commit
先找到哪一个commit需要修改
```shell
git log
```
将当前的branch变基去需要修改的commit
```shell
git rebase -i HEAD~5 # 5是从头开始数（1开始）的倒数第5个commit，也可以用hash串
```
注意弹出的editor中，有一行commet是 # r, reword = use commit, but edit the commit message,这一行是我们需要的，将对应commit最前面的
**pick**改为**r**，这时候后面的信息可改可不改，因为这行信息会被ignore掉，下一个页面会改。将当前editor存储然后退出。

这时候会跳到另外一个editor，这时候修改对应的commit的message，然后保存退出。

强制提交
```shell
git push -f
```