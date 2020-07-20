interface RapidLayoutData {
    spacingX: number,
    spacingY: number,
    // 左右两边充填量
    paddingHorizontal: number,
    // 上下两边充填量
    paddingVertical: number,
    contentWidth: number,
    rowItemNum: number,
    viewHeight: number,
    contentHeight: number,
    showItemNum: number,
    // 是否为正方向 （水平从左到右，垂直从上到下 定为正方向）
    isPositiveDirection: boolean,
}
