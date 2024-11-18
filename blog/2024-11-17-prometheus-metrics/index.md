---
title: "Prometheus 指标类型详解"
date: 2024-11-17
authors: ['wutong']
description: "深入理解 Prometheus 的四种核心指标类型及其使用场景"
tags: ["Prometheus", "Metrics", "监控", "可观测性"]
---

# Prometheus 指标类型详解

在 Prometheus 生态系统中，指标（Metrics）是最基础的数据类型。理解不同类型的指标及其适用场景，对于构建有效的监控系统至关重要。本文将详细介绍 Prometheus 的四种核心指标类型。

## Counter（计数器）

### 定义
Counter 是一个只增不减的累计指标。它的值只能增加或在重启时重置为零。

### 特点
- 单调递增
- 只能增加或重置为零
- 常用于计数场景

### 使用场景
```promql
# 常见的 Counter 指标
http_requests_total         # HTTP 请求总数
node_network_receive_bytes  # 网络接收字节数
errors_total               # 错误总数
```

### 最佳实践
```promql
# 计算速率（每秒请求数）
rate(http_requests_total[5m])

# 计算一段时间内的增量
increase(http_requests_total[1h])
```

## Gauge（仪表盘）

### 定义
Gauge 是可以任意上下波动的指标，可增可减。

### 特点
- 可增可减
- 反映瞬时状态
- 适合记录当前状态

### 使用场景
```promql
# 常见的 Gauge 指标
node_memory_MemAvailable_bytes  # 可用内存
node_cpu_usage_percent         # CPU 使用率
temperature_celsius            # 温度
```

### 最佳实践
```promql
# 直接使用当前值
node_memory_MemAvailable_bytes

# 计算变化率
delta(temperature_celsius[1h])
```

## Histogram（直方图）

### 定义
Histogram 对观察值进行采样，并将其计入可配置的桶（bucket）中，同时提供所有观察值的总和。

### 特点
- 包含多个桶计数
- 自动计算总和和样本数
- 支持分位数计算

### 组成部分
```promql
# 一个 Histogram 指标会自动生成以下数据：
<basename>_bucket{le="<upper inclusive bound>"}  # 桶计数
<basename>_sum                                   # 所有观察值的总和
<basename>_count                                 # 观察值的总数
```

### 使用场景
```promql
# HTTP 请求延迟分布
http_request_duration_seconds_bucket{le="0.1"}  # 100ms 内的请求数
http_request_duration_seconds_sum               # 总延迟时间
http_request_duration_seconds_count             # 总请求数

# 计算 P90 延迟
histogram_quantile(0.9, 
  rate(http_request_duration_seconds_bucket[5m])
)
```

## Summary（摘要）

### 定义
Summary 类似于 Histogram，但它直接在客户端计算分位数。

### 特点
- 客户端计算分位数
- 提供总和和计数
- 配置固定的分位数

### 组成部分
```promql
# 一个 Summary 指标会自动生成：
<basename>{quantile="<φ>"}  # φ-分位数值
<basename>_sum              # 所有观察值的总和
<basename>_count            # 观察值的总数
```

### 使用场景
```promql
# 应用响应时间
http_request_duration_seconds{quantile="0.95"}  # P95 延迟
http_request_duration_seconds_sum               # 总延迟
http_request_duration_seconds_count             # 总请求数
```

## 指标类型选择建议

1. **Counter 适用于**：
   - 请求计数
   - 错误计数
   - 任务完成数

2. **Gauge 适用于**：
   - 内存使用量
   - 温度
   - 当前并发连接数

3. **Histogram 适用于**：
   - 请求延迟
   - 响应大小
   - 需要计算分位数的场景

4. **Summary 适用于**：
   - 需要精确分位数的场景
   - 客户端计算分位数的场景

## 最佳实践

### 1. 命名规范
```promql
# 好的命名示例
http_requests_total
http_request_duration_seconds
node_memory_usage_bytes
```

### 2. 标签使用
```promql
# 合理使用标签
http_requests_total{method="GET", status="200", path="/api/v1/users"}
```

### 3. 单位规范
- 使用基本单位（秒、字节等）
- 在指标名称中包含单位信息

## 总结

选择合适的指标类型对于构建有效的监控系统至关重要：

- Counter 适合累计型数据
- Gauge 适合状态型数据
- Histogram 适合需要分析分布的数据
- Summary 适合需要客户端计算分位数的场景

理解这些指标类型的特点和使用场景，可以帮助我们更好地设计监控系统。

## 参考资料

- [Prometheus 指标类型文档](https://prometheus.io/docs/concepts/metric_types/)
- [Prometheus 最佳实践](https://prometheus.io/docs/practices/naming/)
- [Histogram vs Summary](https://prometheus.io/docs/practices/histograms/) 