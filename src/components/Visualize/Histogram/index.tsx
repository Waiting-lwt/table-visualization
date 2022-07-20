import { Card } from 'antd'
import * as echarts from 'echarts'
import { FC, useEffect, useRef, useState } from 'react'
import { TableProps, yValueProps } from '..'
import './index.less'
interface IProps {
  rawData: TableProps
}
const Histogram: FC<IProps> = ({ rawData }) => {
  const [xAxisData, setXAxisData] = useState<string[]>([])
  const [currHistogramData, setCurrHistogramData] = useState<any[]>([])
  const [listHistogramData, setlistHistogramData] = useState<any[]>([])
  const [histogramChart, setHistogramChart] = useState<echarts.ECharts>({} as echarts.ECharts)
  const [histogramOption, setHistogramOption] = useState<any>({})
  const [tabList, setTabList] = useState<any[]>()
  const histogramRef = useRef(null)
  useEffect(() => {
    if (rawData?.xAxis && rawData?.yAxis) {
      const { xAxis, yAxis } = rawData
      const xlen = xAxis.values.length

      const tabList_: any[] = []
      const xAxis_: string[] = []
      const listPieData_: any[] = []
      yAxis.forEach((yAxisItem: yValueProps, index: number) => {
        tabList_.push({ key: tabList_.length, tab: yAxisItem.name })
        listPieData_[index] = []
        for (let i = 0; i < xlen; i++) {
          const preVal = xAxis.values[i]
          preVal.length > 10 && (xAxis_[i] = `${preVal.substring(0, 10)}\n${preVal.substring(10)}`)
          listPieData_[index].push({ name: xAxis.values[i], value: yAxisItem.values[i] })
        }
      })
      setTabList(tabList_)
      setlistHistogramData(listPieData_)
      setXAxisData(xAxis_)
    }
  }, [rawData])
  useEffect(() => {
    if (listHistogramData.length) {
      setCurrHistogramData(listHistogramData[0])
    }
  }, [listHistogramData])
  useEffect(() => {
    if (xAxisData.length && JSON.stringify(histogramOption) != '{}') {
      histogramOption.xAxis.data = xAxisData
      histogramChart?.setOption?.(histogramOption)
    }
  }, [xAxisData])
  useEffect(() => {
    if (currHistogramData.length && JSON.stringify(histogramOption) != '{}') {
      histogramOption.series.forEach((serie: any) => {
        serie.data = currHistogramData
      })
      histogramChart?.setOption?.(histogramOption)
    }
  }, [currHistogramData])

  const initPieChart = () => {
    setHistogramChart(echarts.init(histogramRef?.current as any))
    setHistogramOption({
      tooltip: {},
      xAxis: {
        name: rawData.xAxis.name,
        data: xAxisData,
      },
      legend: {},
      yAxis: {},
      series: [
        {
          type: 'bar',
          data: currHistogramData,
          barWidth: '40%',
        },
      ],
    })
  }
  useEffect(() => {
    setTimeout(() => initPieChart())
  }, [])
  const onTabChange = (key: string) => {
    const index = Number(key)
    setCurrHistogramData(listHistogramData[index])
  }
  return (
    <Card title="柱形图" tabList={tabList} style={{ minWidth: 800 }} onTabChange={onTabChange}>
      <div id="visualize-histogram" ref={histogramRef}></div>
    </Card>
  )
}

export default Histogram
