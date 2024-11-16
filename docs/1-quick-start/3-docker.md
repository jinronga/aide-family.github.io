---
sidebar_position: 3
---

# Docker 部署

:::tip 提示
本文档仅适用于 Docker 部署，其他部署方式请参考官方文档。
:::

## 准备工作

### 目录结构

```
└── moon
    ├── docker-compose.yaml
    ├── houyi
    │   └── config.yaml
    ├── palace
    │   └── config.yaml
    └── rabbit
        └── config.yaml
```

### docker-compose

```yaml
version: "3.8"
services:
  palace:
    image:  docker.cloudimages.asia/aidemoonio/palace:latest
    container_name: moon_palace
    ports:
      - "8000:8000"
      - "9000:9000"
    volumes:
      - ./palace:/data/conf

  houyi:
    image:  docker.cloudimages.asia/aidemoonio/houyi:latest
    container_name: moon_houyi
    ports:
      - "8001:8001"
      - "9001:9001"
    volumes:
      - ./houyi:/data/conf

  rabbit:
    image: docker.cloudimages.asia/aidemoonio/rabbit:latest
    container_name: moon_rabbit
    ports:
      - "8002:8002"
      - "9002:9002"
    volumes:
      - ./rabbit:/data/conf

  # 如需使用域名，请将web和palace解析到统一域名下，/api解析到palace
  web:
    image: docker.cloudimages.asia/aidemoonio/moon-frontend:latest
    container_name: web
    ports:
      - "5173:80"
```

## 启动服务

:::tip 提示
请根据实际情况修改 `docker-compose.yaml` 文件中的镜像名称和端口映射。

因为前端服务和后端服务在不同的容器中，后端API是通过window.location.origin获取的，所以默认是

http://localhost:5173 => http://localhost:8000/api

如果需要使用域名，请将web和palace解析到统一域名下，/api解析到palace。
:::

```shell
docker-compose up -d
```

## 查看服务状态

```shell
docker-compose ps
```

## 访问服务

- 前端服务：http://localhost:5173
- 后端服务：http://localhost:8000/api

**[创建告警策略并告警](https://aide-family.github.io/blog/new-strategy)**

## 查看服务日志

```shell
docker-compose logs -f [service_name]
```

## 重启服务

```shell
docker-compose restart [service_name]
```

## 停止服务

```shell
docker-compose down
```