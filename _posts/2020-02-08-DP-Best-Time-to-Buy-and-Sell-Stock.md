---
layout: post_layout
title: DP - Best Time to Buy and Sell Stock
time: 02-08-2020 Saturday
location: Boston, USA
pulished: true
excerpt_separator: "```"
---
Here I am introducing all the "Best time to Buy and Sell Stock" coding questions in leetcode:
1. 121 - Best Time to Buy and Sell Stock
2. 122 - Best Time to Buy and Sell Stock II
3. 123 - Best Time to Buy and Sell Stock III
4. 309 - Best Time to Buy and Sell Stock with Cooldown
5. 188 - Best Time to Buy and Sell Stock IV
6. 714 - Best Time to Buy and Sell Stock with Transaction Fee

> [7, 1, 5, 3, 6, 4]

Inside an integer array, each element stands for one price of the stock, and with different buy/sell strategies, to get best benefits.

121 can only buy once

122 can buy unlimited times

123 can only buy twice (can't have two stocks at the same time and need to sell before the second buying)

309 have cool down so cannot buy stock the second day right after selling it

188 similar to 123, but can do k times transactions

714 how to maximize benefits with transaction fees

首先看121，只能买一次，买一次的收益就是负的价格，比如在第一天买的收益胃-7，在第二天买的收益为-1，如此可以去找到最低的价格买进来，然后在这个最低价格后面找到一个最高的价格卖出去，在题目中就是在1的位置买入（收益为-1），在6的位置卖出（收益为+6），将二者收益加在一起，最后的结果为5，这就是买一次和卖一次的最大收益。
不考虑泛型的动态规划，就是写一次遍历，记录最小值，然后把这个最小值后面的值挨个来减去这个最小值，来更新全局最大的profit，也就是答案。
122类似，只要前一天的价格比当天价格大，就不买了，否则买下来，第二天卖出去即可获得收益，然后把每次买卖的收益加起来即可，例子[7, 1, 5, 3, 6, 4]，在1的时候买，6的时候卖；3的时候买，6的时候卖，即可。
123和188则是在122的基础上加上2次和k次的区别，309则是卖掉后第二天不能直接买的限制。

所有的题目可以通过一个DP方程，不同题目只需细微的修改，即可求解。