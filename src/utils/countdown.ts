import dayjs from "dayjs"
import { isEventOnSolarDate } from "./lunarEventResolver"
import type { PersonalEvent } from "~types/personalEvent"

export type CountdownItem = {
  name: string
  date: string // YYYY-MM-DD
  daysLeft: number
  type: "holiday" | "personal"
  isLunar: boolean
}

/**
 * Tìm lần xuất hiện tiếp theo của các ngày lễ và sự kiện cá nhân.
 */
export const getUpcomingEvents = async (
  personalEvents: PersonalEvent[],
  limit: number = 5
): Promise<CountdownItem[]> => {
  const today = dayjs().startOf("day")
  const results: CountdownItem[] = []

  // Xử lý Sự kiện Cá nhân (Personal Events)
  // Chỉ lấy các sự kiện lặp lại hoặc sự kiện đơn lẻ trong tương lai
  for (const ev of personalEvents) {
    let nextSolar: dayjs.Dayjs | null = null

    if (ev.repeatType === "none") {
      const date = dayjs(ev.solarDate)
      if (date.isSame(today) || date.isAfter(today)) {
        nextSolar = date
      }
    } else {
      // Đối với sự kiện lặp lại, ta tìm ngày tiếp theo tính từ hôm nay
      // Quét trong 366 ngày tới để tìm ngày khớp đầu tiên
      for (let i = 0; i <= 366; i++) {
        const target = today.add(i, "day")
        if (isEventOnSolarDate(ev, target.date(), target.month() + 1, target.year())) {
          nextSolar = target
          break
        }
      }
    }

    if (nextSolar) {
      results.push({
        name: ev.title,
        date: nextSolar.format("YYYY-MM-DD"),
        daysLeft: nextSolar.diff(today, "day"),
        type: "personal",
        isLunar: ev.dateType === "lunar"
      })
    }
  }

  // Sắp xếp theo ngày gần nhất
  return results
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, limit)
}
