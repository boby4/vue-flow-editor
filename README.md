# Flow Editor

基于 Vue 3 的可视化流程编辑器，面向 WhatsApp 等渠道的消息自动化场景。通过画布拖拽、连线与右侧配置面板，快速搭建「触发器 → 步骤」工作流。

## 功能概览

- **触发器（Trigger）**：支持 WhatsApp URL 触发器，可配置预填消息（Pre-filled message），支持添加多个触发器
- **步骤节点**：
  - **Send message**：发送文本消息
  - **Condition**：条件分支（Yes / No）
  - **Custom node**：自定义节点（图标、标题、描述、内容）
  - **Step picker**：占位节点，用于选择下一步类型
- **画布操作**：
  - 拖拽移动节点
  - 端口连线（`then` / `yes` / `no` → `in`）
  - 选中连线后删除（工具栏或 `Delete` / `Backspace`）
  - 缩放、适应视图
  - 工具栏快速添加节点
- **配置面板**：选中触发器或步骤后，在左侧面板编辑详细配置
- **草稿与发布**：
  - 保存草稿到 `localStorage`
  - 发布前校验流程完整性

## 技术栈

| 类别 | 技术 |
| --- | --- |
| 框架 | Vue 3 + TypeScript |
| 构建 | Vite 8 |
| 状态管理 | Pinia |
| 路由 | Vue Router 5 |
| UI 组件 | Element Plus |
| 图编辑 | AntV X6 + @antv/x6-vue-shape |
| 测试 | Vitest |

## 环境要求

- Node.js >= 18（推荐 20+）
- pnpm / npm / yarn 均可

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务
pnpm dev
```

浏览器访问 [http://localhost:5173](http://localhost:5173)。

### 其他脚本

```bash
# 类型检查 + 生产构建
pnpm build

# 预览构建产物
pnpm preview

# 运行测试
pnpm test

# 监听模式运行测试
pnpm test:watch
```

## 路由

| 路径 | 说明 |
| --- | --- |
| `/` | 重定向到 `/flows` |
| `/flows` | 新建流程 |
| `/flows/:id` | 编辑已保存的流程（从 `localStorage` 加载） |

保存草稿后会自动跳转到 `/flows/{id}`。

## 项目结构

```text
src/
├── api/
│   └── flowStorage.ts       # localStorage 读写（草稿 / 发布 / 列表）
├── flow/
│   ├── constants/
│   │   └── nodeMeta.ts      # 节点尺寸、默认配置、步骤选项
│   ├── graph/               # X6 图实例、节点注册、同步、事件绑定
│   ├── layout/              # 自动布局与节点定位
│   ├── nodes/               # Vue 节点组件（Trigger / StepPicker / …）
│   ├── store/
│   │   └── flowEditor.ts    # Pinia 状态与业务 actions
│   ├── types/
│   │   └── flow.ts          # FlowDocument 等核心类型
│   └── validation.ts        # 发布前校验
├── router/
├── styles/
└── views/
    └── flow-editor/         # 编辑器页面与配置表单
tests/                       # Vitest 单元测试
```

## 数据模型

核心数据结构为 `FlowDocument`：

```ts
interface FlowDocument {
  id: string
  title: string
  status: 'draft' | 'published'
  channelName: string
  updatedAt: string
  version: number
  triggers: TriggerItem[]
  steps: Record<string, FlowStep>
  edges: FlowEdge[]
  rootStepId: string | null
  triggerPosition: { x: number; y: number }
}
```

- 触发器节点在画布上使用虚拟 ID：`__trigger__`
- 连线由 `sourceId`、`sourcePort`、`targetId`、`targetPort` 描述
- 条件节点出口端口为 `yes` / `no`，其他步骤为 `then`

数据持久化键名格式：`flow-editor:{flowId}`，存储在浏览器 `localStorage`。

## 使用说明

### 新建流程

1. 访问 `/flows`，自动创建空白流程
2. 在 **When...** 触发器节点配置 WhatsApp URL 预填消息
3. 点击 **+ Add new trigger** 可添加更多触发器
4. 在 **Choose first step** 节点选择步骤类型，或从左上角 **+ Add node** 添加节点
5. 拖拽节点调整位置，从右侧端口拖出连线
6. 点击节点或连线进行选中与配置 / 删除

### 保存与发布

- **Save as draft**：保存为草稿，状态为 `draft`
- **Publish**：校验通过后发布，版本号 `version` 自增，状态为 `published`

发布校验规则：

- 至少有一个触发器
- 所有触发器的 Pre-filled message 不能为空
- 不能存在未选择的 step-picker 节点
- 自定义节点的标题和内容不能同时为空

## 架构说明

```text
FlowEditorPage
  ├── Pinia Store (document / selected / isDirty)
  ├── useFlowGraph
  │     ├── createGraph (X6 实例)
  │     ├── rebuildGraph / patchGraphData (文档 → 画布同步)
  │     └── bindGraphEvents (拖拽、连线、删除)
  └── NodeConfigPanel (选中项 → 配置表单)
```

文档变更分两层同步：

1. **结构变更**（节点增删、类型变化、连线拓扑变化）→ `rebuildGraph`
2. **数据变更**（标签、配置文案等）→ `patchGraphData`

## 开发扩展

### 新增一种步骤类型

1. 在 `src/flow/types/flow.ts` 扩展 `StepType` 与配置类型
2. 在 `src/flow/constants/nodeMeta.ts` 补充默认配置与尺寸
3. 新建 `src/flow/nodes/XxxNode.vue` 并在 `registerNodes.ts` 注册
4. 在 `StepPickerNode` / `AddNodeToolbar` 的选项中加入新类型
5. 新增对应配置表单并在 `NodeConfigPanel.vue` 中挂载
6. 在 `flowEditor.ts` 的 `pickStepType` / `updateStepConfig` 等逻辑中处理

### 替换持久化后端

当前 `src/api/flowStorage.ts` 为本地存储实现。接入 API 时，保持 `saveDraft` / `loadFlow` / `publishFlow` / `listFlows` 的函数签名不变，在 store 层即可无缝切换。

## 测试

```bash
pnpm test
```

测试覆盖：

- `tests/store/flowEditor.test.ts` — Store 行为（创建、步骤替换、连线、触发器）
- `tests/graph/graphSignature.test.ts` — 图结构签名
- `tests/layout/` — 布局与定位

## License

Private — 仅供项目内部使用。
