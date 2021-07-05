---
layout: post
permalink: AWS-Solution-Architect-Certification-Notes
---
[Exam Introduction](https://aws.amazon.com/certification/certified-solutions-architect-associate/)
[考试大纲](https://d1.awsstatic.com/zh_CN/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Exam-Guide.pdf)
[考试样题](https://d1.awsstatic.com/zh_CN/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Sample-Questions.pdf)

### Introduction
![](/assets/img/blogs/2021-07-04/0_Domain.png)


### Compute
#### Amazon EC2
    * each virtual is known as "instance"
    * limited to running up to a tatal of 20 on-demand instances acroos the instance family, purchasing 20 reserved instances
    * public key/private key for securely connection
    * Metadata and User Data (16 kb, not encrypted)
    * Billing and provisioning
        * On Demand: per hours, no upfront cost, good for auto scaling groups and unpredictable workloads, good for dev/test
        * Spot: 利用unused EC2 capacity, 90 discount, 无需bid for new pricing model, 可以用RequestSpotFleet() API来启动几千个以免中断（还可以设置提前notice），每个instance family， instance size， AZ都是分离的Spot pool，适用于big data，CICD，web servers, HPC 容器化workloads等
        * Reserved：比on demand要打折很多，有upfront，同个region下可以改变AZ，根据是否运行收费，可以在Marketplace中出售
            * Standard：1～3年
            * Scheduled：适用于predicatable recurring的任务
            * Convertible： 

    ![](/assets/img/blogs/2021-07-04/1_StandardConvertible.png)

    EC2的三种Pricing models

    ![](/assets/img/blogs/2021-07-04/1_StandardConvertible.png)