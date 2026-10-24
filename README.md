# 栖页 · 网站收藏

仿照 `qipage` 参考页实现的分组网站首页。点击右上角编辑按钮，当前页面的分组和网站卡片直接进入编辑状态，
可修改分组名称和图标、添加和编辑网站名称 / 地址 / 图标 / 说明，并调整顺序或删除。
点击“保存配置”后，按分组写入 Cloudflare D1 并返回浏览状态；所有已登录用户共享同一份首页配置。取消编辑可放弃未保存的修改。

分组和网站均通过图标选择器直接选择图标，内置 60 个图标，分为常用、办公开发、生活娱乐和网站品牌四类。
选择面板以浮层显示，不撑开页面；候选项只显示图标，悬停可查看名称，点击外部或按 Esc 关闭。
选择后立即预览，保存后写入 D1。已有的 Emoji 或图片图标仍可显示。网站地址必须使用 http/https。

## 本地开发

```sh
bun install
bunx wrangler d1 execute cf-worker-qi --local --file sql/001-create-navigation-config.sql
bun run dev
```

初始化 SQL 会在空表中写入参考页的 3 个分组和 12 个示例网站。页面始终直接读取 D1，清空所有分组后保存则保留空首页。开发模式沿用项目现有的登录绕过，仅用于本地开发。

```sh
bun run build
bun run preview
```

`preview` 使用现有认证流程；需通过项目配置的认证服务登录。数据库绑定保持为 `DB`，认证 KV 绑定保持为 `authdata`。

## 正式环境初始化

先由维护者明确确认并执行以下 SQL，再按现有流程部署：

```sh
bunx wrangler d1 execute cf-worker-qi --remote --file sql/001-create-navigation-config.sql
bun run deploy
```

开发过程不会自动执行正式 SQL 或部署。只需执行 `001-create-navigation-config.sql` 即可创建分组表、排序索引并写入示例数据。

## 数据保存结构

`navigation_groups` 每条记录对应一个分组：

| 字段 | 用途 |
| --- | --- |
| `id` | 分组唯一标识 |
| `name` | 分组名称 |
| `icon` | 分组图标 |
| `sort_order` | 分组顺序，从 0 开始，按升序展示 |
| `sites_json` | 该分组下所有网站的 JSON 数组，数组顺序就是网站顺序 |
| `updated_at` | 最后保存时间 |

每个网站在 `sites_json` 中包含 `id`、`name`、`url`、`icon` 和 `description`。调整网站顺序时更新数组顺序，调整分组顺序时更新各条记录的 `sort_order`。

保存时依次新增或更新各分组，再删除未保留的分组。接口仅接收和返回 `groups`。
清空分组后保存会保留空首页，页面不会自动恢复示例数据。

初始化 SQL 只创建 `navigation_groups` 和排序索引。表为空时写入示例数据，表已有内容时保留现有数据。
手动对空表重新执行初始化 SQL 会重新写入示例收藏。

## 验证

构建使用 `bun run build`。前端验收仅使用 ego-browser，覆盖参考首页、配置增删改 / 调整顺序、保存刷新恢复、非法地址校验、取消未保存修改，以及移动端布局。后端使用本地 D1 验证按分组写入、排序和空配置持久化。
