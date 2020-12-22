# RapidListView

这是一个基于**Cocos Creator 2.x**版本开发的**滚动视图**优化组件，2.x版本基本适用，C3D和1.x版本未进行适配测试。

## 功能特性支持

- 布局类型：单行、单列、网格
- Item节点分层，最大化优化DrawCall数量
- Item动态宽高，注意**仅支持单行单列**的布局类型

## 使用注意事项

## 使用说明

1. 创建一个`ScrollView`组件节点，先不要手动修改该节点的参数。
2. 将 `RapidListView` 组件挂载到`ScrollView`节点上。
3. 设置`ScrollView`节点和`view`节点的`Size`，对于**宽高**属性自行在`Node`组件中设定，不设限制。
4. 设置`ScrollView`节点的**锚点**，在 `RapidListView` 组件属性中的``