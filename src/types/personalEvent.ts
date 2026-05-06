// src/types/personalEvent.ts

export type EventDateType = "solar" | "lunar"
export type EventRepeatType = "none" | "daily" | "weekly" | "monthly" | "yearly"

export type PersonalEvent = {
  id: string // uuid
  title: string
  description?: string
  dateType: EventDateType
  solarDate: string // YYYY-MM-DD
  lunarDate?: string // DD/MM/YYYY
  category: string // Category ID
  repeatType: EventRepeatType
  reminderBeforeDays?: number
  googleEventId?: string // Link to Google Calendar event
  createdAt: string
  updatedAt: string
}

export type EventCategory =
  | "family"
  | "work"
  | "personal"
  | "health"
  | "spiritual"
  | "other"

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  family: "Gia đình",
  work: "Công việc",
  personal: "Cá nhân",
  health: "Sức khỏe",
  spiritual: "Tâm linh",
  other: "Khác",
}

export const CATEGORY_COLORS: Record<EventCategory, string> = {
  family: "#ef4444", // red-500
  work: "#3b82f6", // blue-500
  personal: "#a855f7", // violet-500
  health: "#10b981", // green-500
  spiritual: "#f59e0b", // amber-500
  other: "#6b7280", // gray-500
}
