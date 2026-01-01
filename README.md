# xianshiquzhuan-app
闲时趣赚 - 企业级悬赏任务平台系统源码 | FastAdmin + ThinkPHP + uni-app 任务众包系统 uni-app 源码
# 闲时趣赚 (XianShiQuZhuan) - Client Side Source Code

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-uni--app-42b983.svg" alt="uni-app">
  <img src="https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20H5%20%7C%20WeChat-blue.svg" alt="Platforms">
  <img src="https://img.shields.io/badge/License-Frontend_Open_Source-green.svg" alt="License">
  <a href="#-get-full-version-获取完整版"><img src="https://img.shields.io/badge/Backend-Commercial_Available-orange.svg" alt="Buy Backend"></a>
</p>

## 📖 Introduction (项目介绍)

**本项目为 [闲时趣赚] 系统的用户端/前端完整源码。**

这是一个基于 **uni-app** 开发的企业级悬赏任务平台前端工程。代码结构清晰，采用了模块化开发，支持编译发布到 iOS、Android、H5 以及微信小程序等多个平台。

您可以自由浏览、研究本前端代码以评估代码质量和 UI 交互细节。

> ⚠️ **注意**：本仓库**仅包含前端源码**。完整的业务逻辑依赖于后端 API 服务（基于 FastAdmin + ThinkPHP 开发）。
> 
> 如需获取**后端源码、数据库脚本及商业授权**，请查看下方的 [🛒 获取完整版](#-get-full-version-获取完整版)。

---

## 📱 Features Preview (功能预览)

本前端项目完整实现了以下业务流程的 UI 与交互逻辑：

* **用户体系**：登录/注册/忘记密码/个人中心/实名认证页面
* **任务大厅**：任务分类筛选/搜索/详情页/推荐列表
* **业务流程**：报名任务/提交凭证/审核状态反馈
* **财务模块**：钱包界面/充值提现/收支明细
* **营销推广**：邀请海报生成/团队管理/分销数据展示

<img width="3172" height="2458" alt="图像-1767256210313" src="https://github.com/user-attachments/assets/93e5d460-bd78-4d50-b114-d0381ff11de3" />

---

## 🛠️ Tech Stack (技术栈)

### Frontend (本仓库包含)
* **Framework**: [uni-app](https://uniapp.dcloud.io/) (Vue 2.x)
* **UI Library**: uView UI / 自定义组件
* **Network**: 封装好的 Request 请求库 (拦截器/Token管理)
* **Tools**: HBuilderX

### Backend (商业版包含)
* **Core**: ThinkPHP 5.0 + FastAdmin
* **Database**: MySQL 5.7+
* **Cache**: Redis
* **Auth**: JWT / Session
* **Payment**: 微信支付 / 支付宝原生 SDK 集成

---

## 🚀 Quick Start (运行前端)

虽然缺少后端 API，您仍可以运行前端项目查看 UI 结构：

1.  **环境准备**：下载安装 [HBuilderX](https://www.dcloud.io/hbuilderx.html)。
2.  **导入项目**：打开 HBuilderX -> 文件 -> 导入 -> 从本地目录导入 -> 选择本项目文件夹。
3.  **安装依赖**：
    ```bash
    npm install
    ```
4.  **运行预览**：
    * 点击菜单栏 `运行` -> `运行到浏览器` -> `Chrome`。
    * 或者 `运行` -> `运行到小程序模拟器`。

> *提示：由于缺少后端 API 支持，部分网络请求会报错或显示加载中，这是正常现象。*

---

## 📦 Get Full Version (获取完整版)

如果您希望运营自己的任务平台，或需要完整的后端源码进行二次开发，请联系我们购买**商业授权版**。

### 商业版交付内容：
| 模块 | 内容说明 |
| :--- | :--- |
| **服务端源码** | 完整的 FastAdmin + ThinkPHP 后端代码 (无加密) |
| **数据库** | 完整 SQL 结构文件 + 初始数据 + 数据字典 |
| **部署文档** | 包含宝塔面板部署教程、支付配置教程、环境搭建指南 |
| **API 文档** | 详细的前后端接口定义文档 |
| **技术支持** | 提供部署协助与 Bug 修复支持 |

### 📞 Contact Us (联系购买)

请通过以下方式联系获取演示账号、报价及合同细节：

* **微信 (WeChat)**: `yxdr_2020` (推荐)
* **QQ**: `192339035`

---

## ⚖️ License & Disclaimer (声明)

1.  本仓库的前端代码供学习与技术交流使用。
2.  **严禁**在未获得后端商业授权的情况下，将本前端代码用于任何商业运营项目。
3.  我们保留对非法盗用代码行为追究法律责任的权利。

Copyright (c) 2026 途启科技. All rights reserved.
