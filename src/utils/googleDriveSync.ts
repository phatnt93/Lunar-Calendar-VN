import type { PersonalEvent } from "~types/personalEvent"

const FILE_NAME = "lunar_calendar_notes.json"

/**
 * Tìm file backup trong AppData folder
 */
async function findFile(token: string): Promise<string | null> {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=name='${FILE_NAME}'&spaces=appDataFolder`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  )
  const data = await response.json()
  return data.files && data.files.length > 0 ? data.files[0].id : null
}

/**
 * Tải nội dung file từ Cloud
 */
async function downloadFile(token: string, fileId: string): Promise<PersonalEvent[]> {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  )
  if (!response.ok) return []
  return await response.json()
}

/**
 * Tạo mới hoặc cập nhật file trên Cloud
 */
async function saveFile(token: string, events: PersonalEvent[], fileId: string | null): Promise<void> {
  const metadata = {
    name: FILE_NAME,
    parents: ["appDataFolder"]
  }

  const boundary = "foo_bar_baz"
  const delimiter = `\r\n--${boundary}\r\n`
  const closeDelimiter = `\r\n--${boundary}--`

  const body = 
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    JSON.stringify(events) +
    closeDelimiter

  const url = fileId 
    ? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`
    : `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`
  
  const method = fileId ? "PATCH" : "POST"

  await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": `multipart/related; boundary=${boundary}`
    },
    body
  })
}

/**
 * Hợp nhất dữ liệu Local và Cloud dựa trên updatedAt
 */
function mergeEvents(local: PersonalEvent[], cloud: PersonalEvent[]): PersonalEvent[] {
  const map = new Map<string, PersonalEvent>()
  
  // Nạp dữ liệu local
  local.forEach(e => map.set(e.id, e))
  
  // Hợp nhất dữ liệu cloud
  cloud.forEach(cloudEvent => {
    const localEvent = map.get(cloudEvent.id)
    if (!localEvent || (cloudEvent.updatedAt || "") > (localEvent.updatedAt || "")) {
      map.set(cloudEvent.id, cloudEvent)
    }
  })

  return Array.from(map.values())
}

/**
 * Thực hiện đồng bộ hóa toàn diện
 */
export async function performSync(token: string, localEvents: PersonalEvent[]): Promise<PersonalEvent[]> {
  try {
    const fileId = await findFile(token)
    let cloudEvents: PersonalEvent[] = []
    
    if (fileId) {
      cloudEvents = await downloadFile(token, fileId)
    }

    const merged = mergeEvents(localEvents, cloudEvents)
    
    // Nếu có sự thay đổi hoặc chưa có file trên cloud, hãy cập nhật cloud
    // Để đơn giản và đảm bảo, chúng ta luôn đẩy bản hợp nhất mới nhất lên cloud
    await saveFile(token, merged, fileId)
    
    return merged
  } catch (error) {
    console.error("Sync failed:", error)
    throw error
  }
}
