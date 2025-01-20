---
sidebar_position: 8
---

# 监控大盘

监控大盘是用于展示监控数据的图表，包括但不限于Grafana的一些外部图表链接，支持iframe嵌入即可。

## 新建监控大盘

1. 登录Moon控制台，选择左侧菜单中的“团队管理-大盘管理”。
2. 在“监控大盘”页面，单击页面右上角的“添加”按钮。
3. 在弹出的“新建监控大盘”窗口中，填写监控大盘名称、状态、监控大盘描述，并单击“确定”按钮。
4. 颜色字段为大盘title在监控大盘的Tab页的背景颜色

![新建监控大盘](./img/monitor-dashboard/monitor-dashboard-create.png)

## 编辑监控大盘

1. 登录Moon控制台，选择左侧菜单中的“团队管理-大盘管理”。
2. 在“监控大盘”页面，选择需要编辑的监控大盘，点击更多按钮，选择编辑。

![编辑监控大盘](./img/monitor-dashboard/monitor-dashboard-edit.png)

3. 在弹出的“编辑监控大盘”窗口中，填写监控大盘名称、状态、监控大盘描述，并单击“确定”按钮。

## 启用、禁用

1. 登录Moon控制台，选择左侧菜单中的“团队管理-大盘管理”。
2. 在“监控大盘”页面，选择需要启用的监控大盘，点击更多按钮，选择启用。
3. 在“监控大盘”页面，选择需要启用的监控大盘，点击更多按钮，选择禁用。
4. 被禁用的大盘，不会在监控大盘列表中展示。

## 图表管理

1. 登录Moon控制台，选择左侧菜单中的“团队管理-大盘管理”。
2. 在“监控大盘”页面，选择需要启用的监控大盘，点击更多按钮，选择图表管理。

![图表管理](./img/monitor-dashboard/monitor-dashboard-chart.png)

3. 在弹出的“图表管理”新窗口中，可以查看图表的详细信息。
4. 每个大盘都可以拥有多个图表，图表可以排序、预览、编辑、删除。

## 图表管理-添加图表

1. 在图表管理页面，点击“添加”按钮。
2. 在弹出的“添加图表”新窗口中，填写图表名称、图表类型、图表描述，并单击“确定”按钮。

![添加图表](./img/monitor-dashboard/monitor-dashboard-chart-add.png)

注意： 

1. 图表类型支持iframe嵌入，支持iframe嵌入的图表都可以添加。
2. 图表宽度为(0-24)，采用栅格系统, 一整行被平均划分为24份，例如：`12`占半行、`18`占18份、`24`占一整行。
3. 高度为css样式，例如：`100%`、 `300px`都是OK的。

## 图表管理-编辑图表

1. 在图表管理页面，选择需要编辑的图表，点击`···`， 选择“编辑”按钮。
2. 在弹出的“编辑图表”新窗口中，填写图表名称、图表类型、图表描述，并单击“确定”按钮。

![编辑图表](./img/monitor-dashboard/monitor-dashboard-chart-edit.png)

## 图表管理-排序

1. 在图表管理页面，选择需要排序的图表，点击`···`， 选择`上移`、`下移`、`置顶`、`置底`可调整图表在大盘中排布的顺序。

![排序](./img/monitor-dashboard/monitor-dashboard-chart-sort.png)

## 图表管理-预览

1. 在图表管理页面，选择需要预览的图表，点击`预览`按钮。
2. 在弹出的“预览图表”新窗口中，可以查看图表在大盘中真实展示效果。

![预览](./img/monitor-dashboard/monitor-dashboard-chart-preview.png)

## 大盘使用

1. 登录Moon控制台，选择左侧菜单中的“实时监控-监控大盘”。
2. 在“监控大盘”页面，选择需要使用的大盘，点击`添加`按钮。
3. 在弹出的“仪表板”新窗口中，绑定你关注的监控大盘列表。

![使用](./img/monitor-dashboard/monitor-dashboard-use.png)

注意：

1. 每个用户都可以绑定多个监控大盘，绑定后，用户在实时监控-监控大盘页面，可以查看所有绑定的监控大盘。
2. 被禁用的大盘，不会在监控大盘列表中展示。
3. 大盘中被禁用的图表，不会在监控大盘中展示。

![监控大盘](./img/monitor-dashboard/monitor-dashboard-use-preview.png)

## 在监控大盘中使用需要认证的图表

### 方法 1：将认证信息嵌入 iframe 的 URL 中

```html
<iframe src="https://username:password@grafana.example.com/d/your-dashboard-id?orgId=1" width="100%" height="600"></iframe>
```

其中：

* username：您的 Grafana 用户名
* password：您的 Grafana 密码
* grafana.example.com：Grafana 的域名或 IP 地址
* your-dashboard-id：要嵌入的仪表板 ID

### 方法 2：使用代理服务器进行认证

如果浏览器不允许在 iframe URL 中直接包含用户名和密码（出于安全原因），您可以在服务器端设置一个代理，来处理认证过程。

1. 配置代理服务器： 在您的 Web 服务器（如 Nginx 或 Apache）上配置代理，将请求转发到 Grafana 服务器，并附加 Basic Auth 头部。

假设您的 Web 服务器是 Nginx，您可以按如下方式配置：

```nginx
location /grafana/ {
    proxy_set_header Authorization "Basic <base64-encoded-credentials>";
    proxy_pass http://grafana.example.com/;
}
```

其中，`<base64-encoded-credentials>` 是您的用户名和密码经过 Base64 编码后的字符串（例如，username:password）。

2. 修改 iframe URL： 在您的 iframe 中，指向您 Web 服务器上配置的代理 URL，而不是直接指向 Grafana：

```html
<iframe src="https://your-web-server/grafana/d/your-dashboard-id?orgId=1" width="100%" height="600"></iframe>
```

### 方法 3：使用 Bearer Token（推荐）

如果 Grafana 支持基于 Bearer Token 的认证（比如 API Token），您可以通过添加 HTTP 头部的方式来进行认证。使用这种方法需要在服务器端进行设置。

1. 生成 API Token：登录到 Grafana 后端，在 Configuration -> API Keys 中创建一个 API Token。

2. 修改代理配置：在代理服务器上配置，将该 Token 添加到请求头中。

如果使用 Nginx，可以这样做：

```nginx
location /grafana/ {
    proxy_set_header Authorization "Bearer <your-api-token>";
    proxy_pass http://grafana.example.com/;
}
```

3. 修改 iframe URL：

同样，您只需将 iframe URL 指向您设置的代理服务器：

```html
<iframe src="https://your-web-server/grafana/d/your-dashboard-id?orgId=1" width="100%" height="600"></iframe>
```

这种方法不仅安全，而且灵活，可以方便地在不同环境中使用。