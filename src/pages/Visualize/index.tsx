import { Histogram, SingleVisual, Pie, TableProps } from '@/components/Visualize'
import * as excel from '@/utils/excel'
import { PageContainer } from '@ant-design/pro-components'
import { Access, useAccess } from '@umijs/max'
import { Button, Upload } from 'antd'
import { FC, useEffect, useState } from 'react'
import './index.less'
// import styles from './index.less'

const VisualizePage: FC = () => {
  const [excelName, setExcelName] = useState<string>('')
  const [rawData, setRawData] = useState<TableProps>({} as TableProps)
  const access = useAccess()
  const readTable = async (props: { file: File; onSuccess: any; onError: any }) => {
    const data = await excel.parse(props)
    setExcelName(props.file.name)
    setRawData(data)
  }
  useEffect(() => {
    excelName && localStorage.setItem('excelName', excelName)
    JSON.stringify(rawData) != '{}' && localStorage.setItem('rawData', JSON.stringify(rawData))
  }, [excelName, rawData])
  useEffect(() => {
    const excelNameStr = localStorage.getItem('excelName')
    const rawDataStr = localStorage.getItem('rawData')
    excelNameStr && setExcelName(excelNameStr)
    rawDataStr && setRawData(JSON.parse(rawDataStr))
  }, [])
  return (
    <PageContainer
      header={{
        title: '表格可视化',
      }}
    >
      <Access accessible={access.canSeeAdmin}>
        <Upload id="upload-excel" customRequest={readTable as any} accept={'.xlsx,.xls,.csv'} showUploadList={false}>
          <Button>导入表格</Button>
          <label htmlFor="upload-excel">{excelName}</label>
        </Upload>
        {JSON.stringify(rawData) != '{}' && (
          <>
            <Pie rawData={rawData}></Pie>
            <Histogram rawData={rawData}></Histogram>
            <SingleVisual rawData={rawData}></SingleVisual>
          </>
        )}
      </Access>
    </PageContainer>
  )
}

export default VisualizePage
