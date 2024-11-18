---
title: "PromQL 实用指南"
date: 2024-11-16
authors: ['wutong']
description: "详细介绍 Prometheus 查询语言(PromQL)的常见用法和实战技巧"
tags: ["Prometheus", "PromQL", "监控", "可观测性"]
---

# PromQL 实用指南：常见查询和最佳实践

在云原生时代，Prometheus 已经成为了监控领域的事实标准。而掌握其查询语言 PromQL 的使用，对于日常运维和问题排查至关重要。本文将介绍 PromQL 的常见用法和实战技巧。

## 基础查询语法

### 1. 简单查询

最基本的查询就是直接使用指标名称：

```promql
# 查询所有 HTTP 请求总数
http_requests_total

# 带标签的精确匹配查询
http_requests_total{status="200", method="GET"}
```

### 2. 标签匹配操作符

PromQL 提供了四种标签匹配操作符：

- `=`：完全相等
- `!=`：不等于
- `=~`：正则匹配
- `!~`：正则不匹配

示例：

```promql
# 匹配所有 2xx 状态码的请求
http_requests_total{status=~"2.."}

# 匹配除了 POST 以外的所有请求方法
http_requests_total{method!="POST"}
```

### 3. 时间范围查询

在 Prometheus 中，我们经常需要查询一段时间内的数据：

```promql
# 查询最近 5 分钟的数据
http_requests_total{status="200"}[5m]

# 查询 1 小时前的 5 分钟数据
http_requests_total{status="200"}[5m] offset 1h
```

## 常用函数和运算符

### 1. rate() 和 irate()

这两个函数用于计算计数器（counter）类型指标的变化率：

```promql
# 计算请求速率（每秒）
rate(http_requests_total[5m])

# 计算瞬时速率
irate(http_requests_total[5m])
```

### 2. 聚合运算符

```promql
# 计算所有实例的请求总和
sum(http_requests_total)

# 按照应用名称分组计算平均值
avg by(app) (http_requests_total)

# 查找最大值前 3 名
topk(3, http_requests_total)
```

## 实用监控场景

### 1. 服务可用性监控

```promql
# 服务可用性百分比
(1 - (
  sum(increase(http_requests_total{status=~"5.."}[5m])) /
  sum(increase(http_requests_total[5m]))
)) * 100

# 服务响应时间 P99
histogram_quantile(0.99, 
  sum(rate(http_request_duration_seconds_bucket[5m])) by (le)
)
```

### 2. 资源使用监控

```promql
# CPU 使用率
100 - (
  avg by(instance) (
    rate(node_cpu_seconds_total{mode="idle"}[5m])
  ) * 100
)

# 内存使用率
(
  node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes
) / node_memory_MemTotal_bytes * 100

# 磁盘使用率
(
  node_filesystem_size_bytes - node_filesystem_free_bytes
) / node_filesystem_size_bytes * 100
```

### 3. 容器监控

```promql
# 容器 CPU 使用率
sum(
  rate(container_cpu_usage_seconds_total{container!=""}[5m])
) by (container) * 100

# 容器内存使用量（GB）
sum(
  container_memory_usage_bytes{container!=""}
) by (container) / 1024^3
```

## 性能优化技巧

1. **查询优化**
   - 使用精确的标签匹配而不是正则表达式
   - 避免使用过长的时间范围
   - 合理使用聚合操作

2. **数据采集优化**
   ```promql
   # 使用记录规则预计算常用查询
   record: job:http_requests:rate5m
   expr: rate(http_requests_total[5m])
   ```

## 常见问题排查

### 1. 数据缺失检查

```promql
# 检查时间序列是否存在
absent(up{job="my-service"})

# 检查采集目标状态
up{job="my-service"} == 0
```

### 2. 数据异常分析

```promql
# 检查速率异常
rate(http_requests_total[5m]) > 100

# 检查延迟异常
histogram_quantile(0.95, http_request_duration_seconds_bucket) > 1
```

## 最佳实践

1. **命名规范**
   - 使用有意义的指标名称
   - 保持标签命名的一致性
   - 避免过多的标签维度

2. **查询设计**
   - 优先使用 `rate()` 而不是 `irate()`
   - 合理使用记录规则
   - 避免复杂的嵌套查询

3. **告警设计**
   - 设置合理的告警阈值
   - 使用告警聚合减少噪音
   - 提供清晰的告警描述

## 总结

PromQL 是一个强大的查询语言，掌握它需要：

- 深入理解基本概念
- 熟练运用常用函数
- 注意查询性能优化
- 遵循最佳实践

通过本文的介绍和示例，希望能帮助你更好地使用 PromQL 进行系统监控和问题诊断。

## 参考资料

- [Prometheus 官方文档](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [PromQL 最佳实践](https://prometheus.io/docs/practices/rules/)
- [Prometheus 查询优化](https://prometheus.io/docs/practices/instrumentation/)
```