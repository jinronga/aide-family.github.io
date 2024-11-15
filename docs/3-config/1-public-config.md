---
sidebar_position: 1
---

# 公共配置

## 服务配置

```protobuf
// 服务配置
message Server {
  // 服务名称
  string name = 1;
  // 服务元数据
  map<string, string> metadata = 2;
  // 服务http地址
  string httpEndpoint = 3;
  // grpc地址
  string grpcEndpoint = 4;
  // 网络类型
  string network = 5;
  optional string secret = 6;
  //上线时间
  string startTime = 7;
  //在线时长
  string upTime = 8;
}
```

## HTTP服务配置

```protobuf
// http服务配置
message HTTPServer {
  // 网络类型
  string network = 1;
  // 服务地址
  string addr = 2;
  // 读写超时时间
  google.protobuf.Duration timeout = 3;
}
```

## GRPC服务配置

```protobuf
// grpc服务配置
message GRPCServer {
  // 网络类型
  string network = 1;
  // 服务地址
  string addr = 2;
  // 读写超时时间
  google.protobuf.Duration timeout = 3;
}
```

## 服务发现配置

```protobuf
// 服务注册发现配置
message Discovery {
  // 类型， 名称和数据源保持一致，例如etcd
  string driver = 1;
  // 数据源
  ETCD etcd = 2;
}
```

## etcd配置

```protobuf
// ETCD数据源配置
message ETCD {
  // 端点
  repeated string endpoints = 1;
  // 连接超时
  optional google.protobuf.Duration timeout = 2;
  // 用户名
  optional string username = 3;
  // 密码
  optional string password = 4;
}
```

## 日志配置

```protobuf
message Log {
  // default, slog, aliyun, zap
  string type = 1;
  // 日志级别
  string level = 2;

  // 阿里云日志
  optional AliYunLogConfig aliyun = 4;
  // zap日志
  optional ZapLogConfig zap = 5;
  // slog日志
  optional SLogConfig slog = 6;
  // loki日志
  optional LokiLogConfig loki = 7;
}
```

## 数据库配置

```protobuf
// 数据库配置
message Database {
  // 驱动， 支持gorm即可
  string driver = 1;
  // 数据库连接串
  string dsn = 2;
  // 是否开启调试
  bool debug = 3;
}
```

## 缓存配置

```protobuf
// 缓存配置
message Cache {
  //redis nuts-db  free
  string driver = 1;
  // redis配置
  Redis redis = 2;
  // nuts db配置
  NutsDB nutsDB = 3;
  // 内存缓存配置
  Free free = 4;
}
```

## 邮件发送配置

```protobuf
// 邮件发送配置
message EmailConfig {
  // 用户
  string user = 1;
  // 发送的邮箱密码
  string pass = 2;
  // 发送的邮箱服务器
  string host = 3;
  // 发送的邮箱端口
  uint32 port = 4;
}
```

## 链路追踪配置

```protobuf
// 链路追踪配置
message Tracer {
  // 驱动， 支持jaeger
  string driver = 1;
  // jaeger配置
  Jaeger jaeger = 2;
}
```

## 通知接收对象配置

```protobuf
message Receiver {
  repeated ReceiverHook hooks = 1;

  repeated ReceiverPhone phones = 2;

  repeated ReceiverEmail emails = 3;

  EmailConfig emailConfig = 4;
}
```

## 微服务配置

```protobuf
// 微服务配置
message MicroServer {
  // 服务地址
  string endpoint = 1;
  // 密钥
  optional string secret = 2;
  // 超时时间
  optional google.protobuf.Duration timeout = 3;
  // 网络类型， http, https, grpc
  string network = 4;
  // node版本
  string nodeVersion = 5;
  // name 服务名
  string name = 6;
}
```