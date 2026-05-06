import dayjs from "dayjs"
import type { PersonalEvent } from "~types/personalEvent"

const STORAGE_KEY = "personal_events"

/** Lấy toàn bộ sự kiện cá nhân từ chrome.storage.local */
export const getAllEvents = (): Promise<PersonalEvent[]> => {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      resolve(result[STORAGE_KEY] ?? [])
    })
  })
}

/** Lưu toàn bộ danh sách (ghi đè) */
const saveAllEvents = (events: PersonalEvent[]): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEY]: events }, resolve)
  })
}

/** Thêm sự kiện mới */
export const addEvent = async (event: PersonalEvent): Promise<void> => {
  const events = await getAllEvents()
  events.push(event)
  await saveAllEvents(events)
}

/** Cập nhật sự kiện theo id */
export const updateEvent = async (
  id: string,
  data: Partial<PersonalEvent>
): Promise<void> => {
  const events = await getAllEvents()
  const idx = events.findIndex((e) => e.id === id)
  if (idx !== -1) {
    events[idx] = { ...events[idx], ...data, updatedAt: new Date().toISOString() }
    await saveAllEvents(events)
  }
}

/** Xoá sự kiện theo id */
export const deleteEvent = async (id: string): Promise<void> => {
  const events = await getAllEvents()
  await saveAllEvents(events.filter((e) => e.id !== id))
}

/**
 * Lấy sự kiện theo ngày dương cụ thể.
 * Bao gồm cả sự kiện không lặp lại và sự kiện lặp lại (theo dương lịch).
 * Sự kiện âm lịch lặp lại sẽ được xử lý riêng (Batch 2).
 */
export const getEventsForSolarDate = (
  solarDateStr: string,
  allEvents: PersonalEvent[]
): PersonalEvent[] => {
  const targetDate = dayjs(solarDateStr)

  return allEvents.filter((e) => {
    // Chỉ xử lý các sự kiện được tạo theo dương lịch ở đây
    // Hoặc các sự kiện âm lịch nhưng không lặp lại (hiển thị đúng ngày đó)
    if (e.dateType === "lunar" && e.repeatType !== "none") return false

    const eventDate = dayjs(e.solarDate)

    // Nếu là sự kiện trong quá khứ hoặc tương lai (nhưng chưa tới ngày bắt đầu)
    if (targetDate.isBefore(eventDate, "day")) return false

    switch (e.repeatType) {
      case "none":
        return targetDate.isSame(eventDate, "day")
      case "daily":
        return true
      case "weekly":
        return targetDate.day() === eventDate.day()
      case "monthly":
        return targetDate.date() === eventDate.date()
      case "yearly":
        return (
          targetDate.date() === eventDate.date() &&
          targetDate.month() === eventDate.month()
        )
      default:
        return false
    }
  })
}

/** Generate unique id */
export const generateId = (): string => {
  return `pe-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}
