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
   

### [Amazon Elastic Container Service (ECS)]()

### Amazon Elastic Container Service (ECS)

### Amazon Elastic Container Service (ECS)

### Amazon Elastic Container Service (ECS)

### Amazon Elastic Container Service (ECS)

### Amazon Elastic Container Service (ECS)

