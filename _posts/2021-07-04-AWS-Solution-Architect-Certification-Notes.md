---
layout: post
permalink: AWS-Solution-Architect-Certification-Notes
---
## 0 Introduction
![](/assets/img/blogs/2021-07-04/000_Domain.png)

[Exam Introduction](https://aws.amazon.com/certification/certified-solutions-architect-associate/)

[考试大纲](https://d1.awsstatic.com/zh_CN/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Exam-Guide.pdf)

[考试样题](https://d1.awsstatic.com/zh_CN/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Sample-Questions.pdf)

## 1 Compute
### 1.1 [Amazon EC2](https://digitalcloud.training/certification-training/aws-solutions-architect-associate/compute/amazon-ec2/)

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

   ![](/assets/img/blogs/2021-07-04/001_StandardConvertible.png)

    EC2的三种Pricing models

   ![](/assets/img/blogs/2021-07-04/002_ThreePricingModels.png)

    Dedicated Hosts vs Dedicated Instances
    
   ![](/assets/img/blogs/2021-07-04/003_DedicatedHostsinstances.png)
   
   Instance的类型，根据CPU/Memory/storage/networking capacity/各种flexibility来选择和区分
   
   ![](/assets/img/blogs/2021-07-04/004_InstanceTypes.png)
   
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
   ![](/assets/img/blogs/2021-07-04/005_EC2Networking.png)
   
   IP Address
   
   * Public: instance启动和停止都会重新分配 in public subnets (VPC)
   * Private: 自动assign
   * Elastic IP: static IP，每个account最多5个IP per region by default
   * You can attach a network interface to an instance in a different subnet as long as its within the same AZ.
    
   ![](/assets/img/blogs/2021-07-04/006_IPs.png)
   
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
   
    
### 1.2 [Amazon Elastic Container Service (ECS)](https://digitalcloud.training/certification-training/aws-solutions-architect-associate/compute/amazon-ecs/)

   * ECS是high scalable, high performance container management service,对EC2 instances进行容器管理，类似别的容器管理service
   * ECS同EC2都有security groups, Elastic Load Balancing, EBS volumes and IAM roles等
   * ECS不用额外cost，只付EC2 instances和EBS volumes的钱，用Elastic Beanstalk来处理ECS和LB 自动缩扩容，监控等，placing your containers across your cluster.
   * ECS提供Blox，一种容器管理和编排工具
   
   ECS(针对docker等) vs EKS(针对K8s)
   
   ![](/assets/img/blogs/2021-07-04/007_ECS_EKS.png)
   
   Launch Types - ECS的Launch Types决定host时的type of infrastructure，共两种,Amazon EC2（自己搞，只支持EC2 Launch Type）和Amazon Fargate（serverless相关，只支持容器container image）
   
   ![](/assets/img/blogs/2021-07-04/008_ECSLaunchTypes.png)
   
   ![](/assets/img/blogs/2021-07-04/009_ECSLaunchTypes2.png)
   
   ECS相关术语
   
   ![](/assets/img/blogs/2021-07-04/010_ECSTerms2.png)
   
   Images
   
   * 类似Docker的image，只读，从Dockerfile创建，images存储在registry中例如Docker Hub或者AWS Elastic Container Registry(ECR)
   * 可使用Docker CLI
   
   Tasks
   
   * ECS上运行Docker容器的任务，一个task可定义一个或多个容器，最多10个
   * 需要利用ECS来run
   
   Clusters
   
   * ECS clusters是一个逻辑概念，cluser可以包含tasks using Fargate/EC2的启动类型
   * clusers are region specific
   * 同样有IAM roles这些
   
   Service Scheduler
   
   * Service Scheduler
   * Custom Scheduler
   
   ECS Container Agent
   
   * 连接ECS和clusers
   * container agentzaimeige ECS cluster的infrastructure上运行
   * 非Linux的instances上需要手动安装ECS agent
   
   ECS Auto Scaling
   
   Service Auto Scaling
   * 利用Application Auto Scaling service来自动缩扩容
   * Target Trackiing Scaling Policies
   * Step Scaling Policies
   
   Cluser Auto Scaling
   * 2019出来的新功能，SAA-C02肯定有
   * A Capacity Provider can be associated with an EC2 Auto Scaling Group (ASG)
        * managed scaling
        * managed instance termination protection
   
   Security/SLA
   * EC2 通过IAM访问ECS
   * 安全组等都是在container level上
   
   Limits
   * Default soft limits
        * Clusters per region = 1000
        * Instances per region = 1000
        * Services per region = 500
   * Hard limits:
        * 1 LB per service
        * 1000 tasks per service(desired count)
        * Max 10 containers per task definition
        * Max 10 tasks per instance
        
   Pricing
   * EC2 Launch Types - 没有额外费用，只付EC2资源费用包括instances，EBS volumes和LB
  
   * Fargate - 需要额外付容器中的vCPU和内存费用
   

### 1.3 [AWS Lambda](https://digitalcloud.training/certification-training/aws-solutions-architect-associate/compute/aws-lambda/)

   AWS Lambda让应用没有provisioning和managing servers(AWS负责)，funtional triggered by events，不能log in到运行lambda的compute instances中去，也不能自定义操作系统和runtime语言
   
   Lambda自定义内存，为event驱动，包括Lambda function(custom codes and dependencies), Event Sources(SNS or custom services，用来产生时间trigger lambda function), Downstream resources (DynomoDB or S3), log Streams
   
   trigger Lambda的事件包括各种别的services例如s3/DynomoDB/Kinesis Data Steams/Simple Notification Service(SNS)/Simple Email Service 等等等等事件，还可以是on demand，Http requests等，functions之间可以互相trigger；非stream events类似于批处理
   
   * Lambda functions支持各种语言，存储在S3 and encrypt it at rest
   
   * Continuous scaling – scales out not up, 1 event = 1 function，GLOBALLY运行
   
   * 需要在VPC中创建NAT来和外部endpoint交流，每个lambda function都有一个unique Amazon Resource Name(ARN)并且不能修改
   
   Building Lambda Apps
   * 管理工具，AWS Serverless Application Model (AWS SAM)
   * SAM是个标准，用AWS CloudFormation
   * 可以用AWS CodePipeline和CodeDeploy来自动化Lambda，追踪则用AWS X-Ray
   
   Lambda@Edge
   * Globally运行代码而无需Provisioning 或者 managed servers，instead使用cloudFront来处理请求和回应
   
   Limits
   * 内存 - 最低128MB，最高3008MB，没64MB为一增量
   * 瞬时disk容量 - 512MB
   * file descriptors的数量 - 1024
   * 进程和线程的数量 - 1024
   * 每个请求的最大执行数 - 900秒
   * 每个账户的并发执行数 - 1000
   
   Operations and monitoring
   * 通过CloudWatch，Lambda可以自己检测和report各种metrics
   * AWS Lambda Console可以看到各种
   * X-Ray可以看整个上下游
   * Lambda也整合了CloudTrail用来抓取API calls并deliver logs
   
   Charges
   * prices based on 请求数量，前1M是免费的，然后$0.2没million
   * 也看duration，用了多久和内存多大等
   
    

### 1.4 [Elastic Load Balancing]()

### 1.5 [AWS Elastic Beanstalk]()

### 1.6 [Elastic Block Store (EBS)]()

### 1.7 [AWS Auto Scaling]()


