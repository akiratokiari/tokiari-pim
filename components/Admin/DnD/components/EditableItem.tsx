import React, { FC, ReactNode, useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Modal, Popconfirm, message } from "antd"
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons"

type Props = {
  key: string
  id: string
  url?: string
  isSelected: boolean | null
  children: ReactNode
  onRemove?: (e: any) => void
}

export const EditableItem: FC<Props> = ({ key, id, isSelected, children, onRemove, url }) => {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState("")
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: id,
  })

  let bg = {}
  if (isSelected) {
    bg = { opacity: 0.5 }
  }
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "move",
    "--translate-x": `${transform?.x ?? 0}px`,
    "--translate-y": `${transform?.y ?? 0}px`,
    ...bg,
  }

  const handleCancel = () => setPreviewOpen(false)

  const handlePreview = () => {
    setPreviewImage(url ? url : "")
    setPreviewOpen(true)
  }

  const confirm = () => {
    onRemove && onRemove(id)
    void message.success("削除しました")
  }

  return (
    <div style={{ display: "column" }}>
      <div
        key={key}
        id={String(id)}
        aria-label="Draggable"
        data-cypress="draggable-item"
        ref={setNodeRef}
        style={
          {
            ...style,
          } as React.CSSProperties
        }
        {...attributes}
      >
        <span {...listeners}>{children}</span>
        <div
          style={{
            width: 100,
            height: 30,
            display: "flex",
            justifyContent: "space-around",
            cursor: "pointer",
          }}
        >
          <EyeOutlined onClick={handlePreview} />
          <Popconfirm
            title="画像を削除します"
            onConfirm={confirm}
            onCancel={() => {}}
            okText="削除"
            okButtonProps={{ danger: true }}
            cancelText="キャンセル"
          >
            <DeleteOutlined />
          </Popconfirm>
        </div>
      </div>
      <Modal open={previewOpen} title={<br />} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  )
}
