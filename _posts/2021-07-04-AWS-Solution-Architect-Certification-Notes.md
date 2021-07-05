---
layout: post
permalink: AWS-Solution-Architect-Certification-Notes
---
[Exam Introduction](https://aws.amazon.com/certification/certified-solutions-architect-associate/)

[考试大纲](https://d1.awsstatic.com/zh_CN/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Exam-Guide.pdf)

[考试样题](https://d1.awsstatic.com/zh_CN/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Sample-Questions.pdf)

## Introduction
![](/assets/img/blogs/2021-07-04/0_Domain.png)


## Compute
### [Amazon EC2](https://digitalcloud.training/certification-training/aws-solutions-architect-associate/compute/amazon-ec2/)

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

   ![](/assets/img/blogs/2021-07-04/2_ThreePricingModels.png)

    Dedicated Hosts vs Dedicated Instances
    
   ![](/assets/img/blogs/2021-07-04/3_DedicatedHostsinstances.png)
   
   Instance的类型，根据CPU/Memory/storage/networking capacity/各种flexibility来选择和区分
   
   ![](/assets/img/blogs/2021-07-04/4_InstanceTypes.png)
   
   Launching Instances
   
   * basic monitoring - 5 mins, changeable
   * can be shared or dedicated
  
   Amazon Machine Images(AMI)
   
   * launching are regional, can copy to other regions
   * Volumns attached instance: 
        * Elastic Block Store - persistent持久化存储，存储依赖于S3
        * instance store - ephemeral短暂存储，instance关闭则丢失数据，下次再用S3上的template创建
        
   Networking
   networking limits (per region or as specified)
   ![](/assets/img/blogs/2021-07-04/5_EC2Networking.png)
   
   IP Address
   
   * Public: instance启动和停止都会重新分配 in public subnets (VPC)
   * Private: 自动assign
   * Elastic IP: static IP，每个account最多5个IP per region by default
   * You can attach a network interface to an instance in a different subnet as long as its within the same AZ.
    
   ![](/assets/img/blogs/2021-07-04/6_IPs.png)
   
   Elastic Network Interfaces(ENI)
   
   * a logical networking component in a VPC that represents a virtural network card
    
   Enhanced Networking - Elastic network Adapter (ENA)
   
   * 增强网络由ENA具体实现，提供更高的带宽，更高的higher Packet-per-second每秒包数 performance
   * 目前AWS用的SR-IOV来实现增强网络
   * in VPC, only in certain instances, must launch HVM AMI with适当drivers
    
   Elastic Fabric Adapter (EFA)
   
   * 是上面ENA的基础上多了些能力
   * can handle IP traffic like ENA, also supports important access model commonly 称为 OS bypass
   * 通过EFA，HPC的应用并搭载Message passing Interface (MPI) and Machine Learning 可将NVIDIA Collective Communications Library (NCCL)可以scale up到数千个CPU或GPU
   * 作为EC2上的optional networking没有额外cost
    
   ENI vs ENA vs EFA
   
   * 使用ENI的时候： 这个是基础adapter type，无需HPC的时候使用，适用所有的instance types
   * 使用ENA的时候： 需要higher带宽和lower inter-instance延迟的时候，只支持HVM类型的instances
   * 使用EFA的时候： HPC w/ MPI和ML的时候，各个apps之间耦合比较多，适用于所有类型的instance types
    
   Placement Groups
   
   * 是个逻辑概念：
        * Cluster
        * Spread
        * Partition
   
   Identity and access Management(IAM) Roles
   
   * attach IAM role at launch time or any time by using AWS CLI, SDK or EC2 console
   * can be attached, modified and replaced
   * only one IAM role can be attached to an EC2 instance
   * IAM roles are universal and can be used in any region
    
   Bastion/Jump Hosts
   
   * EC2 instance可以被设置成Bastion/Jump Hosts堡垒/跳板机
   * 可通过ssh或rdp协议连接，需要配置安全组限制访问，HA自动扩缩容
   * 最佳实践是部署堡垒机在两个AZ，并使用自动缩扩容和弹性IP
    
   EC2 Migration
   
   * VM Import/Export是一个工具用来迁移VMwaare 微软 XEN等虚拟机到云上
   * 也可将EC2 instance转换回来，只能用API或者CLI，不能用console；创建images前需要停止机器
   * VM connector plugin for vCenter:
       * 步骤1 VMs to S3; 步骤2 converts into EC2 AMI; 可在vCenter中追踪
        
   Monitoring
   
   * EC2 instance的监控是每分钟，每一项检查返回pass or fail，所以监控都pass然后overall返回ok，否则为impaired
   * System层面上的检查（StatusCheckFailed_System）AWS会修复；Instance层面上的检查（StatusCheckFailed_Instance）需要用户自己修复
   * Status Check建立在EC2 instance上，可以disabled或者deleted，可以通过Amazon CloudWatch创建alerms，包括Recover/Stop/Terminate/Reboot instances
   * 最好是通过EC2来重启instance而不是OS（CloudWatch是Standard监测5分钟，detailed监测1分钟，可改变）
    
   Tags
   
   * 用来管理AWS asset各种内容（cost allocation, security, automation, many other users...）的标签
   * 自己定义tag的key和optional value
   * 通过AWS Config rules来创建，大部分资源的标签可以为50个
    
   Resource Groups
   
   * 上面tags定义的AWS asset的对应
    
   High Availability Approaches for Compute
   
   * Up-to-date AMIs are critical for rapid fail-over更新的AMI对故障转移很重要
   * AMIs可以在不同regions拷贝，选择水平扩展防止错误只延续到少部分集器
   * 只有Reserved Instances才能保证一定有资源（on demand和Spot不行）
   * 自动缩扩容Auto Scaling和弹性负载均衡Elastic Load Balancing通过维持最少instances可提供自动recovery
   * Route 53的health check也有自愈功能
    
   Migration
   
   * AWS Server Migration Service(SMS)用来做数千个on-premises的workloads，增量复制到live servers volumn中
   * 支持各种VMs和AWS之间的相互转换
   * Server Migration Connector被下载到on-premises vSphere or Hyper-V env.
   
    
### [Amazon Elastic Container Service (ECS)](https://digitalcloud.training/certification-training/aws-solutions-architect-associate/compute/amazon-ecs/)

### [AWS Lambda]()

### [Elastic Load Balancing]()

### [AWS Elastic Beanstalk]()

### [Elastic Block Store (EBS)]()

### [AWS Auto Scaling]()

