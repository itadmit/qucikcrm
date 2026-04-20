"use client"

import { useState, useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import { Plus, MoreHorizontal, X, GripVertical, Trash2 } from "lucide-react"
import { TaskBoardCard, TaskItem, ITEM_TYPE } from "./TaskBoardCard"
import { Button } from "@/components/ui/button"

export const COLUMN_TYPE = "COLUMN"

export interface ColumnData {
  id: string
  name: string
  color: string
  status: string
  position: number
}

interface DragItem {
  type: string
  id: string
  columnId: string | null
  index: number
}

interface ColumnDragItem {
  type: string
  id: string
  index: number
}

interface TaskBoardColumnProps {
  column: ColumnData
  columnIndex: number
  tasks: TaskItem[]
  onMoveCard: (dragId: string, targetColumnId: string, targetIndex: number) => void
  onDropEnd: () => void
  onDeleteTask: (taskId: string) => void
  onQuickAdd: (columnId: string, title: string) => void
  onEditColumn: (column: ColumnData) => void
  onClickTask: (taskId: string) => void
  onMoveColumn: (dragIndex: number, hoverIndex: number) => void
  onColumnDropEnd: () => void
  onDeleteColumn: (columnId: string) => void
  canDelete: boolean
}

export function TaskBoardColumn({
  column,
  columnIndex,
  tasks,
  onMoveCard,
  onDropEnd,
  onDeleteTask,
  onQuickAdd,
  onEditColumn,
  onClickTask,
  onMoveColumn,
  onColumnDropEnd,
  onDeleteColumn,
  canDelete,
}: TaskBoardColumnProps) {
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const columnRef = useRef<HTMLDivElement>(null)

  const [{ isOver: isCardOver, canDrop: canCardDrop }, cardDrop] = useDrop<DragItem, void, { isOver: boolean; canDrop: boolean }>({
    accept: ITEM_TYPE,
    drop: () => {
      onDropEnd()
    },
    hover(item) {
      if (tasks.length === 0 && item.columnId !== column.id) {
        onMoveCard(item.id, column.id, 0)
        item.columnId = column.id
        item.index = 0
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  const [{ isDragging }, columnDrag, preview] = useDrag<ColumnDragItem, void, { isDragging: boolean }>({
    type: COLUMN_TYPE,
    item: () => ({ type: COLUMN_TYPE, id: column.id, index: columnIndex }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [{ isOver: isColumnOver }, columnDrop] = useDrop<ColumnDragItem, void, { isOver: boolean }>({
    accept: COLUMN_TYPE,
    hover(item, monitor) {
      if (!columnRef.current) return
      const dragIndex = item.index
      const hoverIndex = columnIndex
      if (dragIndex === hoverIndex) return

      const hoverBoundingRect = columnRef.current.getBoundingClientRect()
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2
      const clientOffset = monitor.getClientOffset()
      if (!clientOffset) return
      const hoverClientX = clientOffset.x - hoverBoundingRect.left

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return

      onMoveColumn(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
    drop: () => {
      onColumnDropEnd()
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  preview(columnDrop(cardDrop(columnRef)))

  const handleAddCard = () => {
    const title = newCardTitle.trim()
    if (!title) return
    onQuickAdd(column.id, title)
    setNewCardTitle("")
    setIsAddingCard(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAddCard()
    }
    if (e.key === 'Escape') {
      setIsAddingCard(false)
      setNewCardTitle("")
    }
  }

  return (
    <div
      ref={columnRef}
      className={`flex-shrink-0 w-[290px] flex flex-col max-h-full rounded-2xl border transition-all duration-200 ${
        isDragging ? 'opacity-30 scale-95' : ''
      } ${isCardOver && canCardDrop
          ? 'bg-violet-50/70 border-violet-200 ring-2 ring-violet-300/60'
          : 'bg-white border-zinc-200/70'
      } ${isColumnOver ? 'ring-2 ring-zinc-900/20' : ''}`}
    >
      <div className="rounded-t-2xl px-3 pt-3 pb-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <div
              ref={(node) => { columnDrag(node) }}
              className="cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-zinc-100 text-zinc-300 hover:text-zinc-500 transition-colors shrink-0"
              title="גרור לשינוי סדר"
            >
              <GripVertical className="w-3.5 h-3.5" />
            </div>
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: column.color }}
            />
            <h3 className="text-sm font-semibold text-zinc-900 truncate">{column.name}</h3>
            <span className="text-[10px] text-zinc-500 font-bold bg-zinc-100 min-w-[20px] text-center px-1.5 py-0.5 rounded-md tabular-nums shrink-0">
              {tasks.length}
            </span>
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            {canDelete && (
              <button
                onClick={() => onDeleteColumn(column.id)}
                className="p-1 rounded-md hover:bg-rose-50 text-zinc-400 hover:text-rose-600 transition-colors"
                title="מחק עמודה"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => onEditColumn(column)}
              className="p-1 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1.5 min-h-[60px] scrollbar-thin">
        {tasks.map((task, index) => (
          <TaskBoardCard
            key={task.id}
            task={task}
            index={index}
            columnId={column.id}
            onDelete={onDeleteTask}
            onMoveCard={onMoveCard}
            onClickTask={onClickTask}
          />
        ))}

        {tasks.length === 0 && !isCardOver && (
          <div className="text-center py-10 text-[11px] text-zinc-400 border border-dashed border-zinc-200 rounded-xl mx-1">
            גרור כרטיסים לכאן
          </div>
        )}
      </div>

      <div className="px-2 pb-2">
        {isAddingCard ? (
          <div className="space-y-2">
            <textarea
              ref={inputRef}
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="הזן כותרת למשימה..."
              className="w-full p-2.5 text-sm rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 outline-none resize-none bg-white"
              rows={2}
              autoFocus
            />
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                onClick={handleAddCard}
                className="text-xs h-8 px-3 bg-zinc-900 hover:bg-zinc-800 text-white"
              >
                הוסף כרטיס
              </Button>
              <button
                onClick={() => { setIsAddingCard(false); setNewCardTitle("") }}
                className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingCard(true)}
            className="flex items-center gap-1.5 w-full px-3 py-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            הוסף כרטיס
          </button>
        )}
      </div>
    </div>
  )
}
