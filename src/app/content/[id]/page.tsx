import { getContentByIdAPI } from "@/lib/api/endpoints/content";
import { Box } from "@mantine/core";

export default async function ContentPage({ params }: { params: { id: string } }) {
    const idParam = await params;
    
    const res = await getContentByIdAPI(idParam.id);
    const content = res.data;

    return (
        <>
            
            <h1 className="text-2xl font-bold p-3">{content.title}</h1>
            <Box p="lg"><p>{content.content}</p></Box>
            <a className="p-3" href={content.link} target="_blank" rel="noopener noreferrer">Link</a>
        </>
    )
}