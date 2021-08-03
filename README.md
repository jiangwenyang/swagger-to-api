# Swagger To API
自动获取Swagger文档并根据模板生成API

模板参考 [Hygen](https://www.hygen.io/)

## 特性

* 支持Workspace
* 自动生成Hygen模板
* 根据分类对API进行分组选择
* 批量生成API

## 使用

### 配置

插件支持vscode配置或者使用项目配置文件，项目配置文件优先级更高。

支持以下配置方式：

- 项目根目录下的package.json中定义swagger字段
- 项目根目录下的 swaggerrc.[json|yaml|yml|js|cjs]文件
- 项目根目录下的 swagger.[config.js|config.cjs]文件

#### 示例

`.swaggerrc.json`

```json
{
  "services": [
    {
      "name": "user",
      "url": "http://36.110.47.222:28172/user/v2/api-docs"
    }
  ]
}
```

#### 字段

##### `services`

配置服务

- `services[n].name` Swagger名称
- `service[n].url` Swagger地址

### 命令

提供`swagger-to-api.init` 和 `swagger-to-api.gen` 两个命令分别用于生成模板和生成API。使用快捷键 `Ctrl+Shift+P` (Mac对应 `Command+Shift+p`) 打开命令输入框输入对应命令

- `swagger-to-api.init` 

  如果当前项目还没有`_tepmlates` 目录模板，则使用此命令生成默认的模板文件。

  

-  `swagger-to-api.gen` 

  选择对应的API并生成API到对应的文件（需要保证文件存在）


## TODO

- [ ] 自动生成API文件引用
