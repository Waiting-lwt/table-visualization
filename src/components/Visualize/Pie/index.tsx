import { Card } from 'antd'
import * as echarts from 'echarts'
import { FC, useEffect, useRef, useState } from 'react'
import { yValueProps, TableProps } from '..'
import './index.less'


interface IProps {
  rawData: TableProps
}
const Pie: FC<IProps> = ({ rawData }) => {
  const [currPieData, setCurrPieData] = useState<any[]>([])
  const [listPieData, setlistPieData] = useState<any[]>([])
  const [pieChart, setPieChart] = useState<echarts.ECharts>({} as echarts.ECharts)
  const [pieOption, setPieOption] = useState<any>({})
  const [tabList, setTabList] = useState<any[]>()
  const pieRef = useRef(null)
  const initPieChart = () => {
    setPieChart(echarts.init(pieRef?.current as any))
    setPieOption({
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {d}%',
      },
      legend: {
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        orient: 'horizontal',
        top: 'bottom',
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          hoverAnimation: true,
          data: currPieData,
          itemStyle: {
            normal: {
              label: {
                show: true,
                formatter: '{b} : {d}%',
              },
              labelLine: { show: true },
            },
          },
        },
      ],
    })
    console.log(pieChart, pieOption)
  }
  useEffect(() => {
    initPieChart()
  }, [])
  useEffect(() => {
    if (rawData && rawData?.xAxis && rawData?.yAxis) {
      const { xAxis, yAxis } = rawData
      const xlen = xAxis.values.length

      const tabList_: any[] = []
      const listPieData_: any[] = []
      yAxis.forEach((yAxisItem: yValueProps, index: number) => {
        tabList_.push({ key: tabList_.length, tab: yAxisItem.name })
        listPieData_[index] = []
        for (let i = 0; i < xlen; i++) {
          listPieData_[index].push({ name: xAxis.values[i], value: yAxisItem.values[i] })
        }
      })
      setTabList(tabList_)
      setlistPieData(listPieData_)
    }
  }, [rawData])
  useEffect(() => {
    if (listPieData.length) {
      setCurrPieData(listPieData[0])
    }
  }, [listPieData])
  useEffect(() => {
    if (JSON.stringify(pieOption) != '{}') {
      pieOption.series[0].data = currPieData
      pieChart?.setOption?.(pieOption)
    }
  }, [currPieData])

  const onTabChange = (key: string) => {
    const index = Number(key)
    setCurrPieData(listPieData[index])
  }
  return (
    <Card title="饼图" tabList={tabList} style={{ minWidth: 800 }} onTabChange={onTabChange}>
      <div id="visualize-pie" ref={pieRef}></div>
    </Card>
  )
}

export default Pie
