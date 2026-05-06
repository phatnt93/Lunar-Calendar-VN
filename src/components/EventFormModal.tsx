import dayjs from "dayjs"
import { useEffect, useState } from "react"

import {
  type EventDateType,
  type EventRepeatType,
  type PersonalEvent
} from "~types/personalEvent"
import { addCategory, getCategories, PRESET_COLORS, type UserCategory } from "~utils/categories"
import { authenticate } from "~utils/googleAuth"
import { createGoogleEvent, deleteGoogleEvent, updateGoogleEvent } from "~utils/googleCalendar"
import LunarCalendar from "~utils/LunarCalendar"
import { addEvent, deleteEvent, generateId, updateEvent } from "~utils/personalEvents"

type Props = {
  solarDate: ReturnType<typeof dayjs>
  editingEvent?: PersonalEvent | null
  onClose: () => void
  onSaved: () => void
}

export const EventFormModal = ({ solarDate, editingEvent, onClose, onSaved }: Props) => {
  const lunarInfo = LunarCalendar.convertSolar2Lunar(
    solarDate.date(),
    solarDate.month() + 1,
    solarDate.year()
  )
  const lunarDateStr = `${lunarInfo.day}/${lunarInfo.month}/${lunarInfo.year}`
  const solarDateStr = solarDate.format("YYYY-MM-DD")

  const [title, setTitle] = useState(editingEvent?.title ?? "")
  const [description, setDescription] = useState(editingEvent?.description ?? "")
  const [category, setCategory] = useState<string>(editingEvent?.category ?? "personal")
  const [dateType, setDateType] = useState<EventDateType>(editingEvent?.dateType ?? "solar")
  const [repeatType, setRepeatType] = useState<EventRepeatType>(editingEvent?.repeatType ?? "none")
  const [syncGoogle, setSyncGoogle] = useState(!!editingEvent?.googleEventId)
  const [error, setError] = useState("")

  const [userCategories, setUserCategories] = useState<UserCategory[]>([])
  const [isAddingCat, setIsAddingCat] = useState(false)
  const [newCatLabel, setNewCatLabel] = useState("")
  const [newCatColor, setNewCatColor] = useState("#3b82f6")

  useEffect(() => {
    const loadCategories = async () => {
      const cats = await getCategories()
      setUserCategories(cats)
      if (!editingEvent && cats.length > 0) {
        setCategory(cats[0].id)
      }
    }
    loadCategories()
  }, [])

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title)
      setDescription(editingEvent.description ?? "")
      setCategory(editingEvent.category)
      setDateType(editingEvent.dateType)
      setRepeatType(editingEvent.repeatType)
      setSyncGoogle(!!editingEvent.googleEventId)
    }
  }, [editingEvent])

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề")
      return
    }

    let googleId = editingEvent?.googleEventId
    const now = new Date().toISOString()

    // Handle Google Sync
    if (syncGoogle && dateType === "solar") {
      const token = await authenticate(true)
      if (token) {
        const gEvent = {
          summary: title.trim(),
          description: description.trim(),
          start: { date: solarDateStr },
          end: { date: solarDateStr },
          // Simple recurrence for Google
          recurrence: repeatType !== "none" ? [
            `RRULE:FREQ=${repeatType === "daily" ? "DAILY" : repeatType === "weekly" ? "WEEKLY" : repeatType === "monthly" ? "MONTHLY" : "YEARLY"}`
          ] : undefined
        }

        if (googleId) {
          await updateGoogleEvent(token, googleId, gEvent)
        } else {
          const created = await createGoogleEvent(token, gEvent)
          if (created) googleId = created.id
        }
      }
    } else if (!syncGoogle && googleId) {
      // If user unchecked sync, we might want to delete it from Google
      const token = await authenticate(false)
      if (token) {
        await deleteGoogleEvent(token, googleId)
        googleId = undefined
      }
    }

    if (editingEvent) {
      await updateEvent(editingEvent.id, {
        title: title.trim(),
        description: description.trim(),
        category,
        dateType,
        repeatType,
        googleEventId: googleId,
        updatedAt: now
      })
    } else {
      const newEvent: PersonalEvent = {
        id: generateId(),
        title: title.trim(),
        description: description.trim(),
        category,
        dateType,
        solarDate: solarDateStr,
        lunarDate: lunarDateStr,
        repeatType,
        googleEventId: googleId,
        createdAt: now,
        updatedAt: now
      }
      await addEvent(newEvent)
    }
    onSaved()
    onClose()
  }

  const handleDelete = async () => {
    if (editingEvent && confirm(`Xoá sự kiện "${editingEvent.title}"?`)) {
      if (editingEvent.googleEventId) {
        const token = await authenticate(false)
        if (token) {
          await deleteGoogleEvent(token, editingEvent.googleEventId)
        }
      }
      await deleteEvent(editingEvent.id)
      onSaved()
      onClose()
    }
  }

  const handleAddCategory = async () => {
    if (!newCatLabel.trim()) return
    await addCategory(newCatLabel.trim(), newCatColor)
    const cats = await getCategories()
    setUserCategories(cats)
    setCategory(cats[cats.length - 1].id)
    setIsAddingCat(false)
    setNewCatLabel("")
  }

  return (
    <div
      className="plasmo-fixed plasmo-inset-0 plasmo-bg-black/40 plasmo-flex plasmo-items-center plasmo-justify-center plasmo-z-50"
      onClick={onClose}>
      <div
        className="plasmo-bg-white plasmo-rounded-xl plasmo-shadow-2xl plasmo-p-5 plasmo-w-80 plasmo-flex plasmo-flex-col plasmo-gap-3"
        onClick={(e) => e.stopPropagation()}>

        <div className="plasmo-flex plasmo-justify-between plasmo-items-center">
          <div className="plasmo-font-bold plasmo-text-base text-color-1">
            {editingEvent ? "Sửa ghi chú" : "Thêm ghi chú"}
          </div>
          <button onClick={onClose} className="plasmo-text-gray-400 hover:plasmo-text-gray-600 plasmo-text-lg plasmo-leading-none">✕</button>
        </div>

        <div className="plasmo-text-xs plasmo-text-gray-500 plasmo-bg-gray-50 plasmo-rounded plasmo-px-2 plasmo-py-1">
          🗓 Dương: <strong>{solarDate.format("DD/MM/YYYY")}</strong>
          &nbsp;·&nbsp;
          🌙 Âm: <strong>{lunarDateStr}</strong>
        </div>

        <div>
          <label className="plasmo-text-sm plasmo-font-medium plasmo-text-gray-700">Tiêu đề *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setError("") }}
            placeholder="VD: Sinh nhật mẹ"
            className="plasmo-mt-1 plasmo-w-full plasmo-border plasmo-border-gray-300 plasmo-rounded-lg plasmo-px-3 plasmo-py-2 plasmo-text-sm focus:plasmo-outline-none focus:plasmo-ring-2 focus:plasmo-ring-orange-400"
          />
          {error && <div className="plasmo-text-red-500 plasmo-text-xs plasmo-mt-1">{error}</div>}
        </div>

        <div>
          <label className="plasmo-text-sm plasmo-font-medium plasmo-text-gray-700">Danh mục</label>
          <div className="plasmo-flex plasmo-gap-2">
            {!isAddingCat ? (
              <>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="plasmo-mt-1 plasmo-flex-1 plasmo-border plasmo-border-gray-300 plasmo-rounded-lg plasmo-px-3 plasmo-py-2 plasmo-text-sm focus:plasmo-outline-none focus:plasmo-ring-2 focus:plasmo-ring-orange-400">
                  {userCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
                <button
                  onClick={() => setIsAddingCat(true)}
                  className="plasmo-mt-1 plasmo-px-3 plasmo-bg-gray-100 plasmo-rounded-lg plasmo-text-sm hover:plasmo-bg-gray-200">
                  +
                </button>
              </>
            ) : (
              <div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
                <div className="plasmo-flex plasmo-gap-2">
                  <input
                    type="text"
                    value={newCatLabel}
                    onChange={(e) => setNewCatLabel(e.target.value)}
                    placeholder="Tên danh mục"
                    className="plasmo-flex-1 plasmo-border plasmo-border-gray-300 plasmo-rounded-lg plasmo-px-3 plasmo-py-1 plasmo-text-sm"
                  />
                  <input
                    type="color"
                    value={newCatColor}
                    onChange={(e) => setNewCatColor(e.target.value)}
                    className="plasmo-w-8 plasmo-h-8 plasmo-p-0.5 plasmo-rounded plasmo-border plasmo-border-gray-200 plasmo-cursor-pointer"
                  />
                </div>
                <div className="plasmo-flex plasmo-flex-wrap plasmo-gap-1.5">
                  {PRESET_COLORS.map((clr) => (
                    <button
                      key={clr}
                      onClick={() => setNewCatColor(clr)}
                      className={`plasmo-w-5 plasmo-h-5 plasmo-rounded-full plasmo-border ${newCatColor === clr ? 'plasmo-border-black' : 'plasmo-border-transparent'}`}
                      style={{ backgroundColor: clr }}
                    />
                  ))}
                </div>
                <div className="plasmo-flex plasmo-gap-2">
                  <button onClick={handleAddCategory} className="plasmo-flex-1 plasmo-bg-blue-500 plasmo-text-white plasmo-text-xs plasmo-py-1.5 plasmo-rounded-lg hover:plasmo-bg-blue-600">Thêm</button>
                  <button onClick={() => setIsAddingCat(false)} className="plasmo-flex-1 plasmo-bg-gray-100 plasmo-text-gray-600 plasmo-text-xs plasmo-py-1.5 plasmo-rounded-lg hover:plasmo-bg-gray-200">Huỷ</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="plasmo-flex plasmo-gap-3">
          <div className="plasmo-flex-1">
            <label className="plasmo-text-sm plasmo-font-medium plasmo-text-gray-700">Theo ngày</label>
            <select
              value={dateType}
              onChange={(e) => setDateType(e.target.value as EventDateType)}
              className="plasmo-mt-1 plasmo-w-full plasmo-border plasmo-border-gray-300 plasmo-rounded-lg plasmo-px-2 plasmo-py-2 plasmo-text-sm focus:plasmo-outline-none focus:plasmo-ring-2 focus:plasmo-ring-orange-400">
              <option value="solar">Dương lịch</option>
              <option value="lunar">Âm lịch</option>
            </select>
          </div>
          <div className="plasmo-flex-1">
            <label className="plasmo-text-sm plasmo-font-medium plasmo-text-gray-700">Lặp lại</label>
            <select
              value={repeatType}
              onChange={(e) => setRepeatType(e.target.value as EventRepeatType)}
              className="plasmo-mt-1 plasmo-w-full plasmo-border plasmo-border-gray-300 plasmo-rounded-lg plasmo-px-2 plasmo-py-2 plasmo-text-sm focus:plasmo-outline-none focus:plasmo-ring-2 focus:plasmo-ring-orange-400">
              <option value="none">Không</option>
              <option value="daily">Hằng ngày</option>
              <option value="weekly">Hằng tuần</option>
              <option value="monthly">Hằng tháng</option>
              <option value="yearly">Hằng năm</option>
            </select>
          </div>
        </div>

        <div>
          <label className="plasmo-text-sm plasmo-font-medium plasmo-text-gray-700">Mô tả</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ghi chú thêm..."
            rows={2}
            className="plasmo-mt-1 plasmo-w-full plasmo-border plasmo-border-gray-300 plasmo-rounded-lg plasmo-px-3 plasmo-py-2 plasmo-text-sm focus:plasmo-outline-none focus:plasmo-ring-2 focus:plasmo-ring-orange-400 plasmo-resize-none"
          />
        </div>

        {/* Google Sync Checkbox */}
        {dateType === "solar" && (
          <div className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-mt-1">
            <input
              type="checkbox"
              id="sync-google"
              checked={syncGoogle}
              onChange={(e) => setSyncGoogle(e.target.checked)}
              className="plasmo-w-4 plasmo-h-4 plasmo-accent-orange-500"
            />
            <label htmlFor="sync-google" className="plasmo-text-sm plasmo-text-gray-700 plasmo-cursor-pointer">
              Đồng bộ Google Calendar
            </label>
          </div>
        )}

        <div className="plasmo-flex plasmo-gap-2 plasmo-pt-1">
          {editingEvent && (
            <button
              onClick={handleDelete}
              className="plasmo-text-sm plasmo-text-red-500 hover:plasmo-text-red-700 plasmo-border plasmo-border-red-300 plasmo-rounded-lg plasmo-px-3 plasmo-py-2 plasmo-transition-colors">
              Xoá
            </button>
          )}
          <button
            onClick={onClose}
            className="plasmo-flex-1 plasmo-text-sm plasmo-text-gray-600 plasmo-border plasmo-border-gray-300 plasmo-rounded-lg plasmo-py-2 hover:plasmo-bg-gray-50 plasmo-transition-colors">
            Huỷ
          </button>
          <button
            onClick={handleSave}
            className="plasmo-flex-1 plasmo-text-sm plasmo-text-white plasmo-bg-orange-500 plasmo-rounded-lg plasmo-py-2 hover:plasmo-bg-orange-600 plasmo-font-medium plasmo-transition-colors">
            Lưu
          </button>
        </div>
      </div>
    </div>
  )
}

