import { Card, Checkbox, Col, Row } from 'antd'
import * as echarts from 'echarts'
import { FC, useEffect, useRef, useState } from 'react'
import { TableProps, yValueProps } from '..'
import './index.less'

interface IProps {
  rawData: TableProps
}
const SingleVisual: FC<IProps> = ({ rawData }) => {
  const mapType = new Map([
    ['bar', '柱形图'],
    ['line', '折线图'],
  ])
  const [xAxisData, setXAxisData] = useState<string[]>([])
  const [yAxisData, setYAxisData] = useState<any[]>([])
  const [listYAxisData, setlistYAxisData] = useState<any[]>([])
  const [chart, setChart] = useState<echarts.ECharts>({} as echarts.ECharts)
  const [option, setOption] = useState<any>({})
  const [tabList, setTabList] = useState<any[]>()
  const [type, setType] = useState<string[]>(['bar'])
  const chartRef = useRef(null)
  const initPieChart = () => {
    const initOption = {
      xAxis: {
        name: rawData.xAxis.name,
        data: xAxisData,
      },
      yAxis: {},
      tooltip: {},
      series: [],
    }
    const initChart = echarts.init(chartRef?.current as any)
    // const pieOption_ = chartOptionBind(initChart, initOption)
    setChart(initChart)
    setOption(initOption)
  }
  useEffect(() => {
    initPieChart()
  }, [])

  useEffect(() => {
    if (rawData?.xAxis && rawData?.yAxis) {
      const { xAxis, yAxis } = rawData
      const xlen = xAxis.values.length

      const tabList_: any[] = []
      const xAxis_: string[] = []
      const listYAxisData_: any[] = []
      yAxis.forEach((yAxisItem: yValueProps, index: number) => {
        tabList_.push({ key: tabList_.length, tab: yAxisItem.name })
        listYAxisData_[index] = []
        for (let i = 0; i < xlen; i++) {
          const preVal = xAxis.values[i]
          preVal.length > 10 && (xAxis_[i] = `${preVal.substring(0, 10)}\n${preVal.substring(10)}`)
          listYAxisData_[index].push({ name: xAxis.values[i], value: yAxisItem.values[i] })
        }
      })
      setTabList(tabList_)

      setlistYAxisData(listYAxisData_)
      setXAxisData(xAxis_)
    }
  }, [rawData])

  useEffect(() => {
    if (listYAxisData.length) {
      setYAxisData(listYAxisData[0])
    }
  }, [listYAxisData])
  useEffect(() => {
    if (xAxisData.length && JSON.stringify(option) != '{}') {
      chart.setOption({
        xAxis: {
          name: rawData.xAxis.name,
          data: xAxisData,
        },
        yAxis: {},
      })
    }
  }, [xAxisData])
  useEffect(() => {
    if (type && JSON.stringify(option) != '{}') {
      const series_: any[] = []
      type.forEach((type_) => {
        series_.push({
          type: type_,
          data: yAxisData,
          barWidth: '40%',
        })
      })
      chart.clear()
      setTimeout(() => {
        chart.setOption({
          xAxis: {
            name: rawData.xAxis.name,
            data: xAxisData,
          },
          yAxis: {},
          tooltip: {},
          series: series_,
        })
      })
    }
  }, [type])
  useEffect(() => {
    if (yAxisData.length && JSON.stringify(option) != '{}') {
      const series_: any[] = []
      type.forEach((type_) => {
        series_.push({
          type: type_,
          data: yAxisData,
          barWidth: '40%',
        })
      })
      setTimeout(() => {
        chart.setOption({
          xAxis: {
            name: rawData.xAxis.name,
            data: xAxisData,
          },
          yAxis: {},
          tooltip: {},
          series: series_,
        })
      })
    }
  }, [yAxisData])

  const onTabChange = (key: string) => {
    const index = Number(key)
    setYAxisData(listYAxisData[index])
  }

  return (
    <Card
      title={type.map((key) => mapType.get(key))}
      tabList={tabList}
      style={{ minWidth: 800 }}
      onTabChange={onTabChange}
    >
      <Checkbox.Group
        style={{
          width: '100%',
        }}
        onChange={(values) => {
          setType(values as string[])
        }}
        value={type}
      >
        <Row>
          <>
            {Array.from(mapType.entries()).map(([key, value]) => {
              return (
                <Col span={4}>
                  <Checkbox value={key}>{value}</Checkbox>
                </Col>
              )
            })}
          </>
        </Row>
      </Checkbox.Group>
      <div id="visualize" ref={chartRef}></div>
    </Card>
  )
}

export default SingleVisual
