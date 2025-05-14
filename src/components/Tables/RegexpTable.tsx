'use client'
import { Text } from '@mantine/core'
import React from 'react'

interface RegexpTablePropsType {
  data: any[]
}

const RegexpTable = (props: RegexpTablePropsType) => {
  const { data } = props
  return (
    <div>
      <Text>Generated Regular expression: <b> {data[0]?.regexp} </b> </Text>

    </div>
  )
}

export default RegexpTable
