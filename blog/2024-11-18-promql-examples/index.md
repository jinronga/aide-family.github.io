---
title: "PromQL 常用查询语句示例"
date: 2024-11-18
authors: ['wutong']
description: "收集整理 Prometheus 监控中最常用的 PromQL 查询语句示例"
tags: ["Prometheus", "PromQL", "监控", "可观测性"]
---

# PromQL 常用查询语句示例

本文收集整理了在 Prometheus 监控中最常用的 PromQL 查询语句，方便日常查询和告警规则编写时参考。

## 系统监控

### CPU 相关查询

```promql
# CPU 使用率
100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# CPU 各个状态占比
rate(node_cpu_seconds_total[5m]) * 100

# 按核心统计 CPU 使用率
avg by (cpu) (rate(node_cpu_seconds_total{mode!="idle"}[5m]) * 100)

# CPU 负载
node_load1  # 1分钟负载
node_load5  # 5分钟负载
node_load15 # 15分钟负载
```

### 内存相关查询

```promql
# 内存使用率
(1 - node_memory_MemAvailable_bytes/node_memory_MemTotal_bytes) * 100

# 可用内存
node_memory_MemAvailable_bytes / 1024 / 1024 / 1024

# 内存使用量前五的进程
topk(5, sum by (name) (container_memory_usage_bytes{container!=""}))

# Swap 使用率
(1 - node_memory_SwapFree_bytes/node_memory_SwapTotal_bytes) * 100
```

### 磁盘相关查询

```promql
# 磁盘使用率
100 - ((node_filesystem_avail_bytes * 100) / node_filesystem_size_bytes)

# 磁盘读写速率
rate(node_disk_read_bytes_total[5m])
rate(node_disk_written_bytes_total[5m])

# 磁盘 IO 使用率
rate(node_disk_io_time_seconds_total[5m]) * 100

# 预测磁盘满的时间（小时）
predict_linear(node_filesystem_free_bytes[1h], 4 * 3600) < 0
```

### 网络相关查询

```promql
# 网络接口流量
rate(node_network_receive_bytes_total[5m])
rate(node_network_transmit_bytes_total[5m])

# 网络接口错误率
rate(node_network_receive_errs_total[5m])
rate(node_network_transmit_errs_total[5m])

# TCP 连接状态
node_netstat_Tcp_CurrEstab
```

## 容器监控

### 容器资源使用

```promql
# 容器 CPU 使用率
sum(rate(container_cpu_usage_seconds_total{container!=""}[5m])) by (container) * 100

# 容器内存使用量（GB）
sum(container_memory_usage_bytes{container!=""}) by (container) / 1024^3

# 容器网络 IO
sum(rate(container_network_receive_bytes_total[5m])) by (container)
sum(rate(container_network_transmit_bytes_total[5m])) by (container)
```

## 应用监控

### HTTP 服务监控

```promql
# 请求速率（QPS）
sum(rate(http_requests_total[5m])) by (handler)

# 错误率
sum(rate(http_requests_total{status=~"5.."}[5m])) 
  / 
sum(rate(http_requests_total[5m])) * 100

# 平均响应时间
rate(http_request_duration_seconds_sum[5m]) 
  / 
rate(http_request_duration_seconds_count[5m])

# P90/P95/P99 延迟
histogram_quantile(0.90, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
```

### JVM 监控

```promql
# 堆内存使用率
jvm_memory_bytes_used{area="heap"} 
  / 
jvm_memory_bytes_max{area="heap"} * 100

# GC 次数
rate(jvm_gc_collection_seconds_count[5m])

# GC 耗时
rate(jvm_gc_collection_seconds_sum[5m])

# 线程数
jvm_threads_current
```

## 告警规则示例

### 系统告警

```promql
# CPU 使用率过高
100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80

# 内存使用率过高
(1 - node_memory_MemAvailable_bytes/node_memory_MemTotal_bytes) * 100 > 90

# 磁盘使用率过高
100 - ((node_filesystem_avail_bytes * 100) / node_filesystem_size_bytes) > 85

# 磁盘将在 4 小时内满
predict_linear(node_filesystem_free_bytes[1h], 4 * 3600) < 0
```

### 应用告警

```promql
# 服务实例不可用
up{job="my-service"} == 0

# 错误率过高
sum(rate(http_requests_total{status=~"5.."}[5m])) 
  / 
sum(rate(http_requests_total[5m])) * 100 > 5

# 响应延迟过高
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le)) > 1
```

## 性能优化查询

```promql
# 查找高基数的指标
topk(10, count by (__name__) ({__name__=~".+"}))

# 查找最活跃的 targets
topk(10, count by (job) (up))

# 查找采集速率最高的指标
topk(10, rate(prometheus_tsdb_head_samples_appended_total[5m]))
```

## 高级监控场景

### Kubernetes 集群监控

```promql
# 节点 Ready 状态
kube_node_status_condition{condition="Ready",status="true"}

# Pod 运行状态统计
sum by (namespace) (kube_pod_status_phase{phase="Running"})

# 容器重启次数
sum by (namespace, pod) (kube_pod_container_status_restarts_total)

# 节点资源压力
sum by (node) (
  kube_pod_container_resource_requests{resource="cpu"} 
) / sum by (node) (
  kube_node_status_allocatable{resource="cpu"}
) * 100

# 命名空间资源配额使用率
sum by (namespace) (
  kube_resourcequota{type="used"}
) / sum by (namespace) (
  kube_resourcequota{type="hard"}
) * 100
```

### 数据库监控

#### MySQL 监控
```promql
# 连接数使用率
mysql_global_status_threads_connected 
  / 
mysql_global_variables_max_connections * 100

# 慢查询统计
rate(mysql_global_status_slow_queries[5m])

# InnoDB 缓冲池使用率
mysql_global_status_innodb_buffer_pool_pages_total 
  - 
mysql_global_status_innodb_buffer_pool_pages_free

# 事务统计
rate(mysql_global_status_commands_total{command="commit"}[5m])
```

#### Redis 监控
```promql
# 内存使用率
redis_memory_used_bytes / redis_memory_max_bytes * 100

# 命令执行率
rate(redis_commands_total[5m])

# 键过期率
rate(redis_expired_keys_total[5m])

# 连接数
redis_connected_clients
```

### 消息队列监控

#### RabbitMQ 监控
```promql
# 队列消息堆积
rabbitmq_queue_messages_ready

# 消费者数量
rabbitmq_queue_consumers

# 消息处理率
rate(rabbitmq_queue_messages_delivered_total[5m])

# 未确认消息数
rabbitmq_queue_messages_unacknowledged
```

#### Kafka 监控
```promql
# 主题消息率
rate(kafka_topic_partition_current_offset[5m])

# 消费组延迟
sum by (topic) (
  kafka_consumergroup_lag
)

# Broker 活跃连接数
kafka_server_socket_server_metrics_connection_count

# 副本同步延迟
kafka_replica_lag
```

### 网关和代理监控

#### Nginx 监控
```promql
# 请求处理率
rate(nginx_http_requests_total[5m])

# 活跃连接数
nginx_connections_active

# 错误率
sum(rate(nginx_http_requests_total{status=~"5.."}[5m])) 
  / 
sum(rate(nginx_http_requests_total[5m])) * 100

# 上游响应时间
histogram_quantile(0.95, 
  rate(nginx_upstream_response_time_seconds_bucket[5m])
)
```

### 应用性能监控

#### 服务依赖监控
```promql
# 服务调用错误率
sum by (service) (
  rate(service_calls_total{result="error"}[5m])
) / sum by (service) (
  rate(service_calls_total[5m])
) * 100

# 服务依赖可用性
sum by (dependency) (
  rate(dependency_up[5m])
)

# 外部服务调用延迟
histogram_quantile(0.95,
  rate(external_service_response_time_bucket[5m])
)
```

#### 缓存性能监控
```promql
# 缓存命中率
sum(rate(cache_hits_total[5m])) 
  / 
sum(rate(cache_requests_total[5m])) * 100

# 缓存过期率
rate(cache_evictions_total[5m])

# 缓存延迟分布
histogram_quantile(0.99,
  rate(cache_operation_duration_seconds_bucket[5m])
)
```

### 日志相关监控

```promql
# 错误日志率
rate(log_messages_total{level="error"}[5m])

# 按照服务统计错误数
sum by (service) (
  increase(log_errors_total[1h])
)

# 日志写入延迟
histogram_quantile(0.95,
  rate(log_write_duration_seconds_bucket[5m])
)
```

### 安全监控

```promql
# 认证失败次数
rate(auth_failures_total[5m])

# IP 封禁次数
increase(ip_blacklist_total[1h])

# HTTPS 证书过期时间（天）
(
  ssl_certificate_expiry_timestamp_seconds 
  - 
  time()
) / 86400

# 异常登录尝试
sum by (user) (
  rate(failed_login_attempts_total[5m])
)
```

## 高级告警规则

### 趋势预测告警
```promql
# 预测 4 小时后的值是否超过阈值
predict_linear(
  http_requests_total[1h], 
  4 * 3600
) > 1000

# 异常值检测
abs(
  rate(http_requests_total[5m])
  - 
  avg_over_time(rate(http_requests_total[5m])[1h:5m])
) > 2
```

### 复合告警条件
```promql
# CPU 和内存同时高负载
(
  instance:cpu_usage:rate5m > 80
  and
  instance:memory_usage:ratio > 80
)

# 服务多项指标异常
(
  service:error_rate:5m > 1
  and
  service:latency:p95_5m > 0.5
  and
  service:success_rate:5m < 99
)
```

## 最佳实践补充

### 查询优化进阶
1. **使用子查询优化复杂计算**
```promql
# 优化前
sum(rate(http_requests_total[5m])) / sum(rate(http_requests_total[5m]))

# 优化后
sum(rate(http_requests_total[5m])) 
  / 
group(sum(rate(http_requests_total[5m])))
```

2. **使用 recording rules 优化常用查询**
```promql
# 记录规则示例
rules:
  - record: job:http_errors:rate5m
    expr: sum by (job) (rate(http_requests_total{status=~"5.."}[5m]))
```

### 微服务监控

#### 服务网格监控
```promql
# 服务间调用延迟
histogram_quantile(0.95,
  sum(rate(istio_request_duration_milliseconds_bucket[5m])) by (source_app, destination_app, le)
)

# 服务错误率
sum(rate(istio_requests_total{response_code=~"5.*"}[5m])) by (destination_service) 
  / 
sum(rate(istio_requests_total[5m])) by (destination_service) * 100

# 服务重试率
sum(rate(istio_requests_total{response_flags="RR"}[5m])) by (destination_service)
  /
sum(rate(istio_requests_total[5m])) by (destination_service) * 100

# 断路器开启次数
increase(istio_circuit_breaker_open_total[5m])
```

#### 链路追踪相关
```promql
# 追踪采样率
sum(rate(spans_sampled_total[5m])) 
  / 
sum(rate(spans_total[5m])) * 100

# 追踪延迟分布
histogram_quantile(0.95, sum(rate(trace_duration_seconds_bucket[5m])) by (service, le))

# 追踪错误率
sum(rate(spans_errors_total[5m])) by (service)
  /
sum(rate(spans_total[5m])) by (service) * 100
```

### 云原生组件监控

#### Etcd 监控
```promql
# Leader 选举状态
etcd_server_is_leader

# 写入延迟
histogram_quantile(0.99, rate(etcd_disk_wal_fsync_duration_seconds_bucket[5m]))

# 数据库大小
etcd_debugging_mvcc_db_total_size_in_bytes

# Raft 提案失败率
rate(etcd_server_proposals_failed_total[5m])
  /
rate(etcd_server_proposals_committed_total[5m]) * 100
```

#### CoreDNS 监控
```promql
# DNS 查询率
sum(rate(coredns_dns_requests_total[5m])) by (zone)

# 查询延迟
histogram_quantile(0.95, sum(rate(coredns_dns_request_duration_seconds_bucket[5m])) by (zone, le))

# 错误率
sum(rate(coredns_dns_responses_total{rcode!="NOERROR"}[5m])) 
  / 
sum(rate(coredns_dns_responses_total[5m])) * 100
```

### 存储系统监控

#### Elasticsearch 监控
```promql
# 集群状态
elasticsearch_cluster_health_status{color="green"}

# 索引写入延迟
rate(elasticsearch_index_stats_indexing_index_time_seconds_total[5m])
  /
rate(elasticsearch_index_stats_indexing_index_total[5m])

# JVM 堆使用率
elasticsearch_jvm_memory_used_bytes{area="heap"}
  /
elasticsearch_jvm_memory_max_bytes{area="heap"} * 100

# 搜索延迟
rate(elasticsearch_indices_search_fetch_time_seconds[5m])
  /
rate(elasticsearch_indices_search_fetch_total[5m])
```

#### MongoDB 监控
```promql
# 连接数
mongodb_connections{state="current"}

# 操作延迟
rate(mongodb_op_latencies_latency_total[5m])
  /
rate(mongodb_op_latencies_ops_total[5m])

# 复制延迟
mongodb_replset_member_optime_date{state="SECONDARY"}
  -
mongodb_replset_member_optime_date{state="PRIMARY"}

# 慢查询数
rate(mongodb_mongod_metrics_query_executor_total{state="scanned_objects"}[5m])
```

### 网络监控进阶

#### 网络质量监控
```promql
# 网络延迟
avg_over_time(ping_average_response_ms[5m])

# 丢包率
rate(ping_loss_count[5m])
  /
rate(ping_count[5m]) * 100

# 网络抖动
stddev_over_time(ping_average_response_ms[5m])
```

#### 协议监控
```promql
# TCP 重传率
rate(node_netstat_Tcp_RetransSegs[5m])
  /
rate(node_netstat_Tcp_OutSegs[5m]) * 100

# TCP 连接状态分布
node_netstat_Tcp_CurrEstab

# UDP 缓冲区溢出
rate(node_netstat_Udp_RcvbufErrors[5m])
```

### 自定义业务监控

#### 业务指标监控
```promql
# 订单处理速率
rate(business_orders_processed_total[5m])

# 支付成功率
sum(rate(payment_transactions_total{status="success"}[5m]))
  /
sum(rate(payment_transactions_total[5m])) * 100

# 用户会话数
sum(rate(user_sessions_total{status="active"}[5m]))

# 业务错误分布
topk(10, sum by (error_type) (rate(business_errors_total[1h])))
```

#### 用户体验监控
```promql
# 页面加载时间
histogram_quantile(0.95, sum(rate(page_load_time_seconds_bucket[5m])) by (page, le))

# JS 错误率
sum(rate(frontend_errors_total[5m])) by (error_type)

# API 响应时间
histogram_quantile(0.99, sum(rate(api_response_time_seconds_bucket[5m])) by (api, le))
```

### 高级告警场景

#### 智能告警
```promql
# 动态阈值告警
abs(
  rate(http_requests_total[5m])
  - 
  avg_over_time(rate(http_requests_total[5m])[1d:5m])
) > stddev_over_time(rate(http_requests_total[5m])[1d:5m]) * 3

# 季节性感知告警
(
  rate(http_requests_total[5m])
  / 
  avg_over_time(rate(http_requests_total[5m] offset 7d)[1h:5m])
) > 2
```

#### 多维度告警
```promql
# 服务质量综合告警
(
  service:error_rate:5m > 1
  and
  service:latency:p95_5m > 0.5
  and
  service:success_rate:5m < 99
  and
  service:traffic:rate5m > 10
)

# 资源饱和度告警
(
  instance:cpu_usage:rate5m > 80
  or
  instance:memory_usage:ratio > 80
  or
  instance:disk_usage:ratio > 85
)
  and
  instance:load1 > count(instance:cpu_cores) by (instance)
```