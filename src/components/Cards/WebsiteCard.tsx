import { Card, Text } from '@mantine/core';
import React from 'react'

interface WebsiteType {
  id: string;
  name: string;
  url: string;
  is_active: boolean;
}

const WebsiteCard = (props: WebsiteType) => {
  const { id, name, url, is_active } = props;
  return (
    <Card
      p={'lg'}>
      <Text>{name}</Text>
      <Text>{url}</Text>
      <Text>{is_active ? 'Active' : 'Inactive'}</Text>
    </Card>
  )
}

export default WebsiteCard
