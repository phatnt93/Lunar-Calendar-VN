import { Storage } from "@plasmohq/storage"

const storage = new Storage()

export type UserCategory = {
  id: string
  label: string
  color: string
}

export const PRESET_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#f59e0b", // amber
  "#10b981", // green
  "#3b82f6", // blue
  "#6366f1", // indigo
  "#a855f7", // violet
  "#ec4899", // pink
  "#6b7280", // gray
]

const DEFAULT_CATEGORIES: UserCategory[] = [
  { id: "family", label: "Gia đình", color: "#ef4444" },
  { id: "work", label: "Công việc", color: "#3b82f6" },
  { id: "personal", label: "Cá nhân", color: "#a855f7" },
  { id: "health", label: "Sức khỏe", color: "#10b981" },
  { id: "spiritual", label: "Tâm linh", color: "#f59e0b" },
  { id: "other", label: "Khác", color: "#6b7280" }
]

const CATEGORIES_KEY = "user_categories"

export const getCategories = async (): Promise<UserCategory[]> => {
  const categories = await storage.get<UserCategory[]>(CATEGORIES_KEY)
  return categories || DEFAULT_CATEGORIES
}

export const addCategory = async (label: string, color: string): Promise<void> => {
  const categories = await getCategories()
  const newCat: UserCategory = {
    id: `cat-${Date.now()}`,
    label,
    color
  }
  await storage.set(CATEGORIES_KEY, [...categories, newCat])
}

export const deleteCategory = async (id: string): Promise<void> => {
  const categories = await getCategories()
  await storage.set(CATEGORIES_KEY, categories.filter(c => c.id !== id))
}
