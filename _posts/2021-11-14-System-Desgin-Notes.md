---
layout: post
permalink: System-Design-Notes
---

## Design Job Scheduler
* 一次或多次调度
* 是否存

## Design Amazon S3

## Design Amazon price tracker

## Design alerting system for a server (sliding window)

## Scale on the Cloud

Many of today’s large scale concurrent systems rely on cloud computing platforms such as AWS or Google Cloud.

Describe how would you design a service using a common cloud computing platform such as AWS, to scale incrementally from supporting hundreds of users to millions of users.

For the purpose of the interview, assume the system generally receives user requests, does some processing, stores user data, and returns the results.


1) client - webs/apps -> CDN delivers for static
2) gateway - 1 machine -> sticky sessions - standby master-slave arc
3) app service - provide apis for users and get data from storage - 1 machine -> 1 standby machine: many hosts
4) cache - redis/haproxy
5) storage - nosql -> kv store (id, url_link_viedo,); blob storage to storage video themselves


for write-heavy service:
- 1M reqs for 1 machine; 1B users - at least 1000 machines - clusers of DB to handle problem -> partitioning/sharding
when 1 node is got updated, it will notify some other nodes -> gossiple protocols to do it (paxos/raft)



how handle conficts from diff users - google docs/ecommence

## Web Crawler
Web crawlers are among the most commonly used systems to aggregate large amounts of information. For instance, search engines like Google use crawlers to collect information from websites; similarly, news websites use crawlers to aggregate data sources.

How would you design a modern web crawler?

Use case:
We want crawl web pages
download the webpage
store the snapshot somewhere per page

One web page aaa.com
refer to bbb.com ccc.com
bbb.com refer to ddd.com

Assume the table can be stored on a single host
Table WebPageInfo
URL Updated LastCrawleTime Rank -> contents 去重（hashing比较，bloomfilter等），urls去重，hashset/hashmap即可
aaa.com                    1
bbb.com                    3
ccc.com                    2  

补充 - 同一个domains不同的urls，用queue或timer来防止traffic（politeness）
aaa.com/sub
aaa.com/sub2

A Crawler-> read from the WebPageInfo table
-> download the content of the web page
-> save the content to S3, get the S3 URL
-> save map webpageURL: S3 URL(snapshot) to a Table SnapShot

Crawler process
child process -> crawle URL 1
child process -> crawle URL 2
.....
child process -> crawle URL n

Select URL from WebPageInfo where (LastCrawleTime - now) < 1 hour and Updated=true limit 1

Sharding the WebPageInfo table by URLs, each WebPageInfo can have x URL information. Now we have x WebPageInfo tables

LoadBalancer -> Crawler cluster(1 to x).  URL: x 

Crawler cluster 
WebPageInfo Table partition
Crawler services
SnapShot Table partition 

Input URL output snapshot

Design API getSnapShot(URL)
Take the URL
find the SnapShot Table partition 
return the snapshot
tps of the API is very high
LB -> API -> cache -> read from table

Read robots.txt of the webpage
