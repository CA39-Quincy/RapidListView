interface RapidLayoutData {
    itemWidth: number,
    itemHeight: number,
    itemAnchorX: number,
    itemAnchorY: number,
    spacingX: number,
    spacingY: number,
    // 左右两边充填量
    paddingHorizontal: number,
    // 上下两边充填量
    paddingVertical: number,
    // 水平起始充填量
    paddingHorizontalStart: number,
    // 上下起始充填量
    paddingVerticalStart: number,
    contentWidth: number,
    rowItemNum: number,
    viewHeight: number,
    // 视图高显示数量，在屏幕外预加载显示一行
    viewHeightNum: number,
    contentHeight: number,
    showItemNum: number,
    // 是否为正方向 （水平从左到右，垂直从上到下 定为正方向）
    isPositiveDirection: boolean,
}
