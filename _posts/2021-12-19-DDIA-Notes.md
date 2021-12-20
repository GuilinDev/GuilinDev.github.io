---
layout: post
permalink: ddia-notes
---

# DDIA Review Notes

## Chapter 1 - Reliable, Scalable and Maintainable

#### 1
In this chapter we are gonna learn how to build software systems that deal withlarge amount of data and how to build them in a reliable way. 

#### 2
so first let's find out is your use case a data intensive use case, do you need an application that is data intensive, so if an application uses a lot of data or it generates a lot of data and if the complexity of the data changes very quickly, and the speed of change of that data also increases quickly. if either of these is true for you, then you have a data intensive use case, typically big websites like LinkedIn Facebook
Google they are data intensive, they have millions of users coming and using their websites daily, and so to build such a system requires very different skill sets. 

#### 3
a typical data intensive application looks like this this, typical components in architecture:

1) so that we have users here 

2) there could be millions of them using the system at the same time there is a API server, typically we have traffic layers in between which do load balancing, once a load is balanced because there are millions of users coming in, 

3) it hits the application logic or application servers, assuming the authentication authorization and everything passes, 

4) the application code from the client request checks if the request can be served out of a cache, a cache eyes quick for leads and if it is so and if it's a read request then it can return back really quickly 

5) if there is a cache miss and there is a write then the primary database is updated 

6) when the primary database is updated by the application code, there is a change capture mechanism, and there is more code in the application layer to capture changes in the data systems to update the cache, so that parts that are invalid are changed

7) it also updates the index with new information 

8) there are certain use cases like if you are searching for someone on LinkedIn then it or searching for a job on LinkedIn, then it calls full text index, helps with quick lookups of large amount of data. it's stored in ways that are efficient for searches based on keywords or based on facets 

again 4) so the application code as you see is the glue between the cache the primary database and the index, 

9) also the application code emits messages is to handle asynchronous system logic for example sending an email, then it sends a message to the
message queue something like Kafka, and asynchronously process and sends out an email.

so these are the big components, that you will typically see in every big data intensive websites or applications, 

#### 4
1) to quickly summarize the database is the source of truth, Oracle mysql some examples 2) caches for temporarily storing inexpensive operation and helps speed up leads so memcache Redis Couchbase etc 3) full-text indexes force quickly searching by keyword or filter, apache Lucene is a very common example 3) message queues like Kafka, for message passing between processes on different machines, 4) stream processing for near real-time data aggregation like Samza and spark, 5) batch processing for large amount of data processing in chunk, like a patch spark in Hadoop 6) and then there is application code, and as you saw it's the glue, it's the connective tissue between most of these components 

#### 5
so the role of the application developer is to design data systems for reliability scalability, and maintainability, 

#### 3
as you can see the system is designed in such a way, that there are use cases that are served out of the cache use cases set out database use cases from the index, and there are systems that don't require instant response, and they can be asynchronously with the delay, you use an asynchronous systems for it. so these systems have to actually be reliable, scalable and maintainable.

#### 6
so let's get into what each of these terms mean, so reliability is 1) fault tolerance from human software or Hardware faults, 2) the system should be able to ensure that there is no unauthorized access, and that the output is expected as per design and the performance is good enough for application to be usable, 3) deliberately doing chaos testing helps with finding out issues in the system hardware 4) components also fail on a regular cadence, so designing for full machine failures is very important as part of reliability 5) bugs need to be fixed in court as early in the process as possible, ideally before the commit goes through into the production systems 6) and there should be system that to monitor and test before it goes to production, so automating tests and staging testing environments help with making sure that your code is reliable 7) and there also needs to be a way to quickly roll back, because you can do all of these things but if we cannot roll back, your change if a failure does happen if you miss something, then it's a problem 

so reliable systems are the basic need, because based on this the company's revenue is dependent the legal compliance based on certain laws, and
also productivity or the users using your system, so reliability is a very important pillar, for the application developer to keep in mind 

#### 7
next stop scalability, 1) scalability ensure systems can scale with higher traffic volume and complexity of the new system that gets added over time 2) describing the traffic load with peak number of reads/writes, and simultaneous users will help you model the system for scalability, based on how heavy your read or write traffic patterns is, you can either front load or back load the processing on off the request, so if certain requests you there is time sensitivity, and so you cannot front-load some of the heavy processing 3) capacity planning is part of scalability, and it's best to do capacity uplifts regularly based on traffic growth, 4) online systems care more about response time so if users waiting for certain things to get done, and responses to spawns time is more important, but an offline system where insights are generated can be done offline and they deal with throughput mainly 5) remember the end users response time includes your server response time, so it's important to mantain it, monitor server response time but a lot of network is between the large systems in between, so end-to-end user monitoring
for both system performance and procede performance is quite critical when you think of scalability 6) and dealing with ninety at 95th percentile is a good way to measure, service level agreements and service level objectives, there are two main techniques for scaling, scaling up
where you take on and buy more powerful beefy machines, and scaling out distribute load across smaller/less heavier machines in a horizontal way

so that's scalability, scalability is critical for your growth, reliability is the foundation, scalability it helps you grow, 

#### 8
and then you can only grow if the code is maintainable, 1) so ensuring that as we add new people to work on building new and new applications logic, 2) and newer new features the productivity of your developers our impact 3) so there are three questions you can ask to check if your
systems are maintainable, so is it operable, is it easy to get system up and running, and monitor the systems health; and if it's easy to configure and override certain times, the default behavior might not works, with system need to be testable, so easy to operate and maintain it should be simple easy to understand and ramp up, 4) so there should be use of good design patterns good documentation and use of clean code
techniques, so that new people can quickly ramp up 5) based on existing good patterns and should be evolvable, is it easy to change your system for from issues that come up or for adding new features, regularly refactoring your code and making sure you use better and better abstractions
helps you to get more people to contribute to your codebase, and regularly reducing code debt another critical thing 

#### 9
and then remember there is no one magic solution for building a high scalable system for everyone, there are the systems that we have looked into for what what kind of components go into a data intensive app, and based on your use case your solution will be custom to your needs, so as long as you have good idea about some of these key pillars look into like reliability scalability and maintainability, you will build the right systems and in next all chapters, we are gonna get to becoming the master of building a high scale data intensive application, that can handle millions of users at scale, thanks.

## Chapter 2 - Data Models - Designing Data Intensive applications book review

