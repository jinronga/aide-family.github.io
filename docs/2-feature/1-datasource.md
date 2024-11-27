---
sidebar_position: 1
---

# 数据源

系统定义了四种数据类型：日志、指标、事件、 链路。 每种数据类型可以有多种数据存储器。 以这种形式，可以轻松实现数据类型的统一查询、分析、告警、可视化等。

## 类型

### 日志（Log）

实现统一的日志查询接口，以支持多种日志存储器。 在平台配置统一的日志策略完成日志类型数据的查询、分析、告警、可视化等。

### 指标（Metric）

实现统一的指标查询接口，以支持多种指标存储器。 在平台配置统一的指标策略完成指标类型数据的查询、分析、告警、可视化等。

### 事件（Event）

实现统一的事件查询接口，以支持多种事件存储器。 在平台配置统一的事件策略完成事件类型数据的查询、分析、告警、可视化等。

## 存储器

### prometheus

[prometheus](https://prometheus.io/)

### victoriametrics

[victoriametrics](https://victoriametrics.com/)

### elasticsearch

[elasticsearch](https://www.elastic.co/cn/products/elasticsearch)

### loki

[loki](https://grafana.com/oss/loki/)

### kafka

[kafka](https://kafka.apache.org/)

### rocketmq

[rocketmq](https://rocketmq.apache.org/)

### mqtt

[mqtt](https://mqtt.org/)
