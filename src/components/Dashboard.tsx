import React from 'react'
import WebsiteTable from './Tables/WebsiteTable';

interface DashboardPropsType {
  data: any[]
}

const DashboardComponent = (props: DashboardPropsType) => {
  const { data } = props;

  return (
    <>
      <WebsiteTable data={data} />
    </>
  )
}

export default DashboardComponent
