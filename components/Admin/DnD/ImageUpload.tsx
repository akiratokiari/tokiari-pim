import React, { FC, useEffect, useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy
} from '@dnd-kit/sortable'
import { EditableItem } from './components/EditableItem'
import { Button, Card, Upload, message } from 'antd'
import { v4 as uuid } from 'uuid'

import { UploadOutlined } from '@ant-design/icons'
import ImgCrop from 'antd-img-crop'
import { createClient } from '@/utils/supabase/client'
import { getImageUrl } from '@/helper/getImageUrl'

type Props = {
  onChange?: (e: any) => void
  file: file[]
  type?: 'thumbnail' | 'gallery'
}
type file = {
  name: string
  status: string
  uid: string
  url: string
}

export const ImageUpload: FC<Props> = ({ onChange, file, type = 'gallery' }) => {
  const [isUploading, setIsUploading] = useState(false)
  const [items, setItems] = useState(file)
  const supabase = createClient()
  const cardTitle = type === 'gallery' ? 'ギャラリー' : `サムネイル（${items.length}/4）`

  useEffect(() => {
    onChange &&
      onChange(
        items.map((file) => {
          return file.url
        })
      )
  }, [items])

  useEffect(() => {
    setItems(file)
  }, [file])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )
  const [activeId, setActiveId] = useState(null)

  const onRemove = async (uid: any) => {
    const newFileList = items.filter((f) => f.uid !== uid)
    setItems(newFileList)
  }

  const customRequest = async (info: any) => {
    setIsUploading(true)
    const extension = info.file.name.split('.').pop()
    const filename = uuid() + '.' + extension

    const { data, error } = await supabase.storage.from('products').upload(filename, info.file, {
      cacheControl: '3600',
      upsert: false
    })

    if (error) {
      void message.error('予期せぬエラーが発生しました')
    }
    if (data && data.path) {
      const file = {
        uid: uuid(),
        name: data?.path,
        status: 'done',
        url: getImageUrl(data.path, 'products')
      }
      setItems([...items, file])
      void message.success('画像がアップロードされました')
    }

    setIsUploading(false)
  }

  return (
    <Card
      title={cardTitle}
      extra={[
        <ImgCrop key="upload" rotationSlider quality={1} aspect={3 / 2}>
          <Upload
            style={{ visibility: 'hidden' }}
            maxCount={1}
            accept="image/*"
            customRequest={customRequest}
            disabled={isUploading}
            fileList={[]}
          >
            <Button disabled={isUploading} icon={<UploadOutlined />}>
              画像をアップロードする
            </Button>
          </Upload>
        </ImgCrop>
      ]}
    >
      <Card>
        <DndContext
          onDragStart={handleDragStart}
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((item) => {
              return item.uid
            })}
            strategy={rectSortingStrategy}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {items.map((id) => (
                <span key={id.uid} style={{ padding: 8 }}>
                  <EditableItem
                    key={id.uid}
                    id={id.uid}
                    url={id.url}
                    isSelected={activeId === id.uid ? true : false}
                    onRemove={(e) => onRemove(e)}
                  >
                    <img alt="example" style={{ width: 100 }} src={id.url} />
                  </EditableItem>
                </span>
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeId ? (
              <EditableItem key={activeId} id={activeId} isSelected={null}>
                <img
                  style={{ width: 100 }}
                  src={items.find((item) => item.uid === activeId)?.url}
                />
              </EditableItem>
            ) : null}
          </DragOverlay>
        </DndContext>
      </Card>
    </Card>
  )

  function handleDragStart(event: any) {
    setActiveId(event.active.id)
  }

  function handleDragEnd(event: any) {
    const { active, over } = event

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.uid === active.id)
        const newIndex = items.findIndex((item) => item.uid === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
    setActiveId(null)
  }
}
