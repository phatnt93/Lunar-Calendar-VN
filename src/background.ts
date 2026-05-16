import dayjs from "dayjs"
import { Storage } from "@plasmohq/storage"
import { getUpcomingEvents } from "~utils/countdown"
import { getAllEvents } from "~utils/personalEvents"

const storage = new Storage()
const ALARM_NAME = "DAILY_EVENT_CHECK"

/**
 * Khởi tạo Alarm. Kiểm tra mỗi 30 phút để đảm bảo không lỡ khung giờ thông báo.
 */
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed - Setting up alarms")
  chrome.alarms.create(ALARM_NAME, {
    periodInMinutes: 30 
  })
  checkAndNotify()
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    checkAndNotify()
  }
})

/**
 * Kiểm tra các sự kiện sắp tới và gửi thông báo theo cấu hình
 */
async function checkAndNotify() {
  const notifyBeforeDays = (await storage.get<number>("notifyBeforeDays")) ?? 1
  const notifyTime = (await storage.get<string>("notifyTime")) ?? "08:00"
  
  const now = dayjs()
  const [targetHour, targetMinute] = notifyTime.split(":").map(Number)
  
  // Kiểm tra xem đã đến giờ thông báo chưa (trong khoảng 30 phút của target)
  const isCorrectTime = now.hour() === targetHour && now.minute() >= targetMinute && now.minute() < targetMinute + 30
  
  // Kiểm tra xem hôm nay đã thông báo chưa để tránh lặp lại
  const todayStr = now.format("YYYY-MM-DD")
  const lastNotifyDate = await storage.get<string>("lastNotifyDate")
  
  if (isCorrectTime && lastNotifyDate !== todayStr) {
    const personalEvents = await getAllEvents()
    const upcoming = await getUpcomingEvents(personalEvents, 20)
    
    // Tìm các sự kiện diễn ra trong khoảng [hôm nay, hôm nay + notifyBeforeDays]
    const eventsToNotify = upcoming.filter(item => {
      const eventDate = dayjs(item.date)
      const diffDays = eventDate.diff(now.startOf('day'), 'day')
      return diffDays >= 0 && diffDays <= notifyBeforeDays
    })

    for (const event of eventsToNotify) {
      const eventDate = dayjs(event.date)
      const diffDays = eventDate.diff(now.startOf('day'), 'day')
      
      let title = ""
      let message = ""

      if (diffDays === 0) {
        title = `Hôm nay: ${event.name}`
        message = "Sự kiện quan trọng diễn ra trong hôm nay. Đừng quên nhé!"
      } else {
        title = `Sắp tới (${diffDays} ngày nữa): ${event.name}`
        message = `Sự kiện sẽ diễn ra vào ngày ${eventDate.format("DD/MM")}.`
      }

      chrome.notifications.create({
        type: "basic",
        iconUrl: "assets/icon.png",
        title: title,
        message: message,
        priority: 2
      })
    }
    
    // Lưu lại ngày đã thông báo thành công
    await storage.set("lastNotifyDate", todayStr)
  }
}

/**
 * Lắng nghe message từ content script để hiển thị Quote khi khởi động trình duyệt
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "CHECK_STARTUP_QUOTE") {
    // Sử dụng chrome.storage.session để lưu trạng thái phiên làm việc hiện tại
    chrome.storage.session.get("hasShownStartupQuote").then((data) => {
      if (!data.hasShownStartupQuote) {
        chrome.storage.session.set({ hasShownStartupQuote: true }).then(() => {
          sendResponse({ showQuote: true })
        })
      } else {
        sendResponse({ showQuote: false })
      }
    })
    return true // Trả về true để chỉ định rằng phản hồi sẽ được gửi bất đồng bộ (async)
  }
})
