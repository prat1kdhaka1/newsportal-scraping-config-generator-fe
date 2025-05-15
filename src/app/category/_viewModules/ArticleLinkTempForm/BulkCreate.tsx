"use client";
import React, { useEffect, useState } from 'react'

import { Box, Button, Checkbox, Loader, Pagination, Space, Stack, TextInput, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { getArticleLinkTempListAPI } from '@/lib/api/endpoints/article-links-temp';
import { bulkCreateArticleLinksAPI } from '@/lib/api/endpoints/article-links';

interface ArticleLink {
  id: string;
  name: string;
  url: string;
  is_active: boolean;
}

interface UpdateArticleLinkFormProps {
  close: () => void;
  category_id: string;
}



const BulkCreateArticleLinkForm = ({ close, category_id }: UpdateArticleLinkFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fields, setFields] = useState<ArticleLink[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');
  
  const limit = 50;



  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const skip = (currentPage - 1) * limit;
        const res = await getArticleLinkTempListAPI(category_id, skip, limit);
        setFields(res.data);
        setTotalRows(res.total_rows)
      } catch (err) {
        console.error('Failed to fetch article links:', err);
        notifications.show({
          title: 'Error',
          color: 'red',
          message: 'Failed to fetch article links',
          position: 'top-right',
          autoClose: 3000
        });
      }
      setIsLoading(false);
    };

    fetchData();
  }, [currentPage, category_id, setIsLoading]);


  const getItemKey = (id: string) => id;

  const handleCheckboxChange = (id: string, url: string, isChecked: boolean) => {
    setSelectedUrls(prev => {
      const newSelected = new Set(prev);
      const itemKey = getItemKey(id);
      
      if (isChecked) {
        newSelected.add(JSON.stringify({ id: itemKey, url }));
      } else {
        // Find and remove the item with this id
        for (const item of newSelected) {
          const parsed = JSON.parse(item);
          if (parsed.id === itemKey) {
            newSelected.delete(item);
            break;
          }
        }
      }
      return newSelected;
    });
    setError('');
  };

  const isItemSelected = (id: string) => {
    const itemKey = getItemKey(id);
    return Array.from(selectedUrls).some(item => JSON.parse(item).id === itemKey);
  };

  const handleSubmit = async () => {
    if (selectedUrls.size < 5) {
      setError('Please select at least 5 URLs');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        category_id,
        urls: Array.from(selectedUrls).map(item => JSON.parse(item).url)
      };


      await bulkCreateArticleLinksAPI(payload);

      close();
      notifications.show({
        title: 'Success',
        color: 'green',
        message: 'Article links have been saved successfully',
        position: 'top-right',
        autoClose: 3000
      });
    } catch (err) {
      console.error('Failed to save article links:', err);
      notifications.show({
        title: 'Error',
        color: 'red',
        message: 'Failed to save article links. Please try again.',
        position: 'top-right',
        autoClose: 5000
      });
    } finally {
      setSaving(false);
    }
  }


  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box p="lg" bg="var(--mantine-color-gray-light)">
      <Stack>
        <Title order={4}>Extracted Article Link URLs</Title>
        {error && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        <div style={{ marginBottom: '1rem' }}>
          Selected: {selectedUrls.size} URL(s)
        </div>
        {fields.map((item) => (
          <div key={item.id}>
            <TextInput
              label="URL"
              w={'100%'}
              value={item.url}
              readOnly
              styles={{
                input: {
                  backgroundColor: 'var(--mantine-color-gray-0)',
                  '&:readOnly': {
                    cursor: 'default',
                    borderStyle: 'dashed',
                  },
                },
              }}
            />
            <Space h={10} />
            <Checkbox
              label="Select this article link"
              checked={isItemSelected(item.id)}
              onChange={(e) => handleCheckboxChange(item.id, item.url, e.currentTarget.checked)}
            />
          </div>
        ))}
        <Pagination 
          total={Math.ceil(totalRows / limit)} 
          value={currentPage} 
          onChange={setCurrentPage} 
          withControls={true}
          mt="md"
        />
        <Button 
          onClick={handleSubmit} 
          mt="md" 
          loading={saving}
          disabled={selectedUrls.size < 5}
        >
          Save {selectedUrls.size > 0 ? `(${selectedUrls.size} selected)` : ''}
        </Button>
      </Stack>
    </Box>
  );
}

export default BulkCreateArticleLinkForm
