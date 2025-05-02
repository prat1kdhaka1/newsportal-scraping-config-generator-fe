import React from 'react'
import CustomTable from './CustomTable';

interface DashboardPropsType {
  data: any[]
}

const DashboardComponent = (props: DashboardPropsType) => {
  const { data } = props;

  return (
    <>
      <CustomTable data={data} />
    </>
  )
}

export default DashboardComponent
