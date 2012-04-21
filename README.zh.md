node-kickstart
==============

fork 这个项目来开启一个新项目.

为什么要创建这个项目?
--------

### 性能

大多数的nodejs项目使用express, 并使用express来创建项目的基本骨架. 但经过测试, 这样的代码运行效率较低. 
本项目希望能够使代码的运行效率接近于node helloworld的性能.

### 结构

而若不使用类似express的框架, 直接编写使用`http.createServer(fn)`来编写代码, 则容易出现代码混乱难以维护的情况.

### 浏览器端渲染

传统开发方式使用服务器端模板渲染, 而模板渲染的损耗甚大.
模板文件静态化, 动态数据以API获取, 使用浏览器端渲染以分散服务器压力是非常有效的优化方案.

### cookie, session, querystring, body 按需解析

express, connnect 中间件默认对所有请求解析cookie, 加载session, 解析querystring, 解析 body, 
在许多的请求中, 这些解析并无必要.

### 工具

本项目可能会包含以下的工具

* deploy
* init.d
* cluster

LICENSE
========

This software is licensed under the MIT License.

Copyright (C) 2012 by <Gui Lin>guileen@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated 
documentation files (the "Software"), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial 
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT 
NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.