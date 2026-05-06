import LunarCalendar from "./LunarCalendar"
import type { PersonalEvent } from "~types/personalEvent"

/**
 * Kiểm tra xem một sự kiện cá nhân (có thể là âm lịch và lặp lại)
 * có khớp với một ngày dương lịch cụ thể hay không.
 */
export const isEventOnSolarDate = (
  event: PersonalEvent,
  solarDay: number,
  solarMonth: number,
  solarYear: number
): boolean => {
  const lunar = LunarCalendar.convertSolar2Lunar(solarDay, solarMonth, solarYear)

  // 1. Nếu là sự kiện Âm lịch
  if (event.dateType === "lunar") {
    if (!event.lunarDate) return false

    // Parse ngày âm lịch gốc của sự kiện (DD/MM/YYYY)
    const [eDay, eMonth] = event.lunarDate.split("/").map(Number)

    switch (event.repeatType) {
      case "none":
        // Đã được xử lý bởi solarDate mapping trong personalEvents.ts
        // Nhưng để chắc chắn, kiểm tra khớp chính xác ngày âm/tháng âm/năm âm
        const [,, eYear] = event.lunarDate.split("/").map(Number)
        return (
          lunar.day === eDay &&
          lunar.month === eMonth &&
          lunar.year === eYear
        )
      case "daily":
        return true
      case "weekly":
        // TODO: Weekly for lunar is rare, use solar day of week
        return false 
      case "monthly":
        return lunar.day === eDay
      case "yearly":
        return lunar.day === eDay && lunar.month === eMonth
      default:
        return false
    }
  }

  // 2. Nếu là sự kiện Dương lịch (Đã được xử lý phần lớn ở getEventsForSolarDate, 
  // nhưng ta gộp chung logic vào đây để HomePage dễ dùng)
  const [evY, evM, evD] = event.solarDate.split("-").map(Number)
  
  // Không hiển thị nếu chưa tới ngày bắt đầu
  if (solarYear < evY) return false
  if (solarYear === evY && solarMonth < evM) return false
  if (solarYear === evY && solarMonth === evM && solarDay < evD) return false

  switch (event.repeatType) {
    case "none":
      return solarDay === evD && solarMonth === evM && solarYear === evY
    case "daily":
      return true
    case "weekly":
      // So sánh thứ trong tuần
      const targetDate = new Date(solarYear, solarMonth - 1, solarDay)
      const startDate = new Date(evY, evM - 1, evD)
      return targetDate.getDay() === startDate.getDay()
    case "monthly":
      return solarDay === evD
    case "yearly":
      return solarDay === evD && solarMonth === evM
    default:
      return false
  }
}
