import { TableProps, xValueProps, yValueProps } from '@/components/Visualize'
import { message } from 'antd'
import * as XLSX from 'xlsx'

const parse = async (props: { file: File; onSuccess: any; onError: any }) => {
  const { file, onSuccess, onError } = props
  const arrayBuffer = await file.arrayBuffer()
  const workbook = XLSX.read(arrayBuffer, {})
  const sheet1 = workbook.Sheets[workbook?.SheetNames[0]]
  let range = XLSX.utils.decode_range(sheet1['!ref'] as string)

  // 检查第一行的默认名称 --- x-name; y1-name; y2-name ...
  const row0 = range.s.r++
  for (let C = range.s.c; C <= range.e.c; ++C) {
    let cell_address = { c: C, r: row0 } //获取单元格地址
    let cell = XLSX.utils.encode_cell(cell_address) //根据单元格地址获取单元格
    const value = sheet1[cell].v
    if (C === 0) {
      if (value !== 'x-name') {
        message.error(`不存在'${value}', 是否为'x-name'?`)
        return onError()
      }
    } else {
      if (value !== `y${C}-name`) {
        message.error(`不存在'${value}', 是否为'y${C}-name'?`)
        return onError()
      }
    }
  }
  // 获取表格列名
  const data = {
    xAxis: {} as xValueProps,
    yAxis: [] as yValueProps[],
  } as TableProps
  const row1 = range.s.r++
  for (let C = range.s.c; C <= range.e.c; ++C) {
    let cell_address = { c: C, r: row1 } //获取单元格地址
    let cell = XLSX.utils.encode_cell(cell_address) //根据单元格地址获取单元格

    if (C === 0) {
      data.xAxis.name = sheet1[cell].v
      data.xAxis.values = []
    } else {
      data.yAxis[C - 1] = { name: sheet1[cell].v, values: [] }
    }
  }

  // 获取表格数值
  const row2 = range.s.r
  for (let R = range.s.r; R <= range.e.r; ++R) {
    let row_value = ''
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let cell_address = { c: C, r: R } //获取单元格地址
      let cell = XLSX.utils.encode_cell(cell_address) //根据单元格地址获取单元格
      if (sheet1[cell]) {
        // 如果出现乱码可以使用iconv-lite进行转码
        // row_value += iconv.decode(sheet1[cell].v, 'gbk') + ", ";
        row_value += sheet1[cell].v + ', '
        if (C === 0) {
          data.xAxis.values[R - row2] = sheet1[cell].v
        } else {
          data.yAxis[C - 1].values[R - row2] = sheet1[cell].v
        }
      } else {
        row_value += ', '
      }
    }
  }
  onSuccess()
  message.success('导入成功！')

  return data
}

export { parse }
