import { Card, Text } from '@mantine/core';
import React from 'react'
interface ContentsCardPropsType {
 data: any[]   
}
const ContentsCard = (props: ContentsCardPropsType) => {
    const { data } = props;
    return (
        <>
            {data?.map((indvNews) => (
                <Card key={indvNews.id}>
                    <Text>{indvNews.title}</Text>
                    <Text>{indvNews.content.trim().slice(0, 200)}</Text>
                    <a href={indvNews.link} target='_blank' rel='noopener noreferrer'>Link</a>
                </Card>
            ))}
        </>
    );
}

export default ContentsCard