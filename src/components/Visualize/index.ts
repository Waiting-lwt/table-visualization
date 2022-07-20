export { default as Histogram } from './Histogram'
export { default as SingleVisual } from './SingleVisual'
export { default as Pie } from './Pie'
export interface xValueProps {
  name: string
  values: Array<string>
}
export interface yValueProps {
  name: string
  values: Array<number>
}
export interface TableProps {
  xAxis: xValueProps // 自变量
  yAxis: yValueProps[] // 因变量们
}
