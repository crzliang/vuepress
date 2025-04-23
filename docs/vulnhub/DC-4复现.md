---
title: DC-4复现
tags: 
  - vulnhub
  - 渗透测试
permalink: /archives/54088/
createTime: 2022-06-05 17:07:26
---

# DC-4复现

# 描述

> DC-4 是另一个特意建造的易受攻击的实验室，旨在获得渗透测试领域的经验。
>
> 与之前的 DC 版本不同，这个版本主要是为初学者/中级者设计的。只有一个标志，但从技术上讲，有多个入口点，就像上次一样，没有线索。
>
> 必须具备 Linux 技能和熟悉 Linux 命令行，以及一些基本渗透测试工具的经验。
>
> 对于初学者来说，谷歌可以提供很大的帮助，但你可以随时在@DCAU7 上给我发推文，寻求帮助，让你重新开始。但请注意：我不会给你答案，相反，我会给你一个关于如何前进的想法。

# 开始

## 信息收集

- 扫描C段找到目标ip

![image-20220605150821243](https://img.crzliang.cn/img/image-20220605150821243.png)

- 发现目标机器只开放了80和22端口

![image-20220605154759595](https://img.crzliang.cn/img/image-20220605154759595.png)

## 漏洞挖掘

- 访问ip

![image-20220605160550758](https://img.crzliang.cn/img/image-20220605160550758.png)

- 弄到burp里爆破，具体过程可以看我的pikachu题解里有，得到了账号密码

![image-20220605160636082](https://img.crzliang.cn/img/image-20220605160636082.png)

- 登录后能看到有三个执行命令

![image-20220605161848892](https://img.crzliang.cn/img/image-20220605161848892.png)

- 抓包后发现，执行的方式是直接发送执行的命令到后端进行执行

![](https://img.crzliang.cn/img/image-20220605161703586.png)

- 那就先看看我们拥有什么权限

![image-20220605162110179](https://img.crzliang.cn/img/image-20220605162110179.png)

- 那我们尝试进行反弹shell

![image-20220605162334426](https://img.crzliang.cn/img/image-20220605162334426.png)

## 提权

- 我们可以看到该靶机上有python，那我们就可以切换交互式shell

![image-20220605162839358](https://img.crzliang.cn/img/image-20220605162839358.png)

- 在一番寻找中找到一份备份的密码本，那就拷贝一份

![image-20220605163206942](https://img.crzliang.cn/img/image-20220605163206942.png)

- 利用hydra进行爆破

![image-20220605164824364](https://img.crzliang.cn/img/image-20220605164824364.png)

- 登录后看到有一个mbox，查看得到以下内容，然而并没有什么用

![image-20220605165441140](https://img.crzliang.cn/img/image-20220605165441140.png)

- 经过一番寻找，最终找到了一份jim得邮件，得到了charles的密码

![image-20220605170043889](https://img.crzliang.cn/img/image-20220605170043889.png)

- 直接切换用户到chaeles

![image-20220605170143176](https://img.crzliang.cn/img/image-20220605170143176.png)

- 查看可以使用的root权限命令

![image-20220605170305539](https://img.crzliang.cn/img/image-20220605170305539.png)

- 根据提示可以利用teehee添加一个root权限的账号

`echo "admin::0:0:::/bin/bash" | sudo teehee -a /etc/passwd`

- 提权成功

![image-20220605170549411](https://img.crzliang.cn/img/image-20220605170549411.png)

## 获取flag

![image-20220605170703049](https://img.crzliang.cn/img/image-20220605170703049.png)