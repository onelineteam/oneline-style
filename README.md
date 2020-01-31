# `style`

@oneline/style 是oneline的基础样式类库, 用于组装不同组件或者业务代码的基础.

## 使用

```JavaScript
import '@oneline/style/dist/index.css'
```

```css
@import '@oneline/style/dist/index.css'
```

## 说明

样式库以 `ol` 作为class名称的前缀.

### 大小样式

类名|作用|描述
--|--|--
ol-fs| font-size | 文字大小
ol-w | width | 宽度
ol-h  | height | 高度
ol-p | padding | 内间距
ol-m | margin | 外间距
ol-lh | line-height | 行高

### 布局样式

类名 | 作用 | 描述
- | - | -
ol-layout-h | 水平布局 | 水平方式布局
ol-layout-v | 垂直布局 | 垂直方式布局
ol-layout-g | 格子布局 | 格子方式布局
ol-ps-ab | 绝对定位 | 相对body定位
ol-ps-rt | 相对定位 | 相对父元素定位
ol-ps-fx | fixed定位 | 相对于可视窗口定位

### 外部样式

类名 | 解释 | 描述
- | - | -
ol-c | color | 文字颜色
ol-bg-c | background-color | 背景颜色
ol-b | border | 边框
ol-br | border-radius | 边框圆角
ol-block | display: block | 块元素
ol-inline | display: inline-block | 行内元素
ol-hover | ::hover && ::active | 鼠标悬停样式





