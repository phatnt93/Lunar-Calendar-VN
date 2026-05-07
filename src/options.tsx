import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import "~style.css"

import { authenticate, removeCachedAuthToken } from "~utils/googleAuth"
import { getAllEvents, saveAllEvents, triggerCloudSync } from "~utils/personalEvents"

function OptionsIndex() {
  const [quoteLang, setQuoteLang] = useStorage("quoteLang", "vn")
  const [notifyBeforeDays, setNotifyBeforeDays] = useStorage(
    "notifyBeforeDays",
    1
  )
  const [notifyTime, setNotifyTime] = useStorage("notifyTime", "08:00")
  const [showWidget, setShowWidget] = useStorage("showWidget", true)
  const [token, setToken] = useState<string | null>(null)
  const [importStatus, setImportStatus] = useState<string>("")

  useEffect(() => {
    authenticate(false).then((t) => {
      if (t) setToken(t)
    })
  }, [])

  const handleLogin = async () => {
    const t = await authenticate(true)
    if (t) {
      setToken(t)
      setImportStatus("Đang đồng bộ với tài khoản Google...")
      await triggerCloudSync()
      setImportStatus("Đồng bộ hoàn tất!")
      setTimeout(() => setImportStatus(""), 3000)
    }
  }

  const handleLogout = async () => {
    if (token) {
      await removeCachedAuthToken(token)
      setToken(null)
    }
  }

  const handleExport = async () => {
    try {
      const events = await getAllEvents()
      const data = JSON.stringify(events, null, 2)
      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `lunar_calendar_backup_${new Date().toISOString().split("T")[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export failed:", error)
      alert("Xuất dữ liệu thất bại!")
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string
        const importedEvents = JSON.parse(content)

        if (!Array.isArray(importedEvents)) {
          throw new Error("Định dạng file không hợp lệ")
        }

        // Validate basic structure
        if (importedEvents.length > 0 && !importedEvents[0].id) {
          throw new Error("Dữ liệu không đúng cấu trúc")
        }

        if (
          confirm(
            `Bạn có chắc chắn muốn nhập ${importedEvents.length} sự kiện? Dữ liệu hiện tại sẽ bị thay thế.`
          )
        ) {
          await saveAllEvents(importedEvents)
          setImportStatus("Nhập dữ liệu thành công!")
          setTimeout(() => setImportStatus(""), 3000)
        }
      } catch (error) {
        console.error("Import failed:", error)
        setImportStatus("Lỗi: File không hợp lệ")
      }
    }
    reader.readAsText(file)
    // Reset input
    e.target.value = ""
  }

  return (
    <div className="plasmo-p-8 plasmo-min-h-screen bg-2">
      <div className="plasmo-max-w-2xl plasmo-mx-auto plasmo-bg-white plasmo-p-6 plasmo-rounded-xl plasmo-shadow">
        <h1 className="plasmo-text-2xl plasmo-font-bold text-color-1 plasmo-mb-6">
          Cài đặt (Settings)
        </h1>

        <div className="plasmo-space-y-6">
          <div>
            <h2 className="plasmo-text-lg plasmo-font-semibold plasmo-mb-3 text-color-2">
              Ngôn ngữ trích dẫn (Quote Language)
            </h2>
            <div className="plasmo-flex plasmo-flex-col plasmo-gap-3">
              <label className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-cursor-pointer">
                <input
                  type="radio"
                  name="quoteLang"
                  value="vn"
                  checked={quoteLang === "vn"}
                  onChange={(e) => setQuoteLang(e.target.value)}
                  className="plasmo-w-4 plasmo-h-4 plasmo-accent-[#c01800]"
                />
                <span className="plasmo-text-gray-700">Tiếng Việt</span>
              </label>
              {/* <label className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-cursor-pointer">
                <input
                  type="radio"
                  name="quoteLang"
                  value="en"
                  checked={quoteLang === "en"}
                  onChange={(e) => setQuoteLang(e.target.value)}
                  className="plasmo-w-4 plasmo-h-4 plasmo-accent-[#c01800]"
                />
                <span className="plasmo-text-gray-700">English</span>
              </label>
              <label className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-cursor-pointer">
                <input
                  type="radio"
                  name="quoteLang"
                  value="cn"
                  checked={quoteLang === "cn"}
                  onChange={(e) => setQuoteLang(e.target.value)}
                  className="plasmo-w-4 plasmo-h-4 plasmo-accent-[#c01800]"
                />
                <span className="plasmo-text-gray-700">中文 (Chinese)</span>
              </label> */}
            </div>
          </div>

          <div className="plasmo-border-t plasmo-border-gray-200 plasmo-pt-6">
            <h2 className="plasmo-text-lg plasmo-font-semibold plasmo-mb-3 text-color-2">
              Thông báo & Nhắc nhở
            </h2>
            <div className="plasmo-space-y-4">
              <div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
                <label className="plasmo-text-sm plasmo-text-gray-600">
                  Nhắc trước bao nhiêu ngày?
                </label>
                <select
                  value={notifyBeforeDays}
                  onChange={(e) =>
                    setNotifyBeforeDays(parseInt(e.target.value))
                  }
                  className="plasmo-p-2 plasmo-border plasmo-rounded-lg plasmo-bg-gray-50 focus:plasmo-outline-none focus:plasmo-ring-2 focus:plasmo-ring-[#c01800]">
                  <option value={0}>Chỉ ngày diễn ra</option>
                  <option value={1}>Trước 1 ngày</option>
                  <option value={2}>Trước 2 ngày</option>
                  <option value={3}>Trước 3 ngày</option>
                  <option value={5}>Trước 5 ngày</option>
                  <option value={7}>Trước 1 tuần</option>
                </select>
              </div>

              <div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
                <label className="plasmo-text-sm plasmo-text-gray-600">
                  Thời gian thông báo hàng ngày
                </label>
                <input
                  type="time"
                  value={notifyTime}
                  onChange={(e) => setNotifyTime(e.target.value)}
                  className="plasmo-p-2 plasmo-border plasmo-rounded-lg plasmo-bg-gray-50 focus:plasmo-outline-none focus:plasmo-ring-2 focus:plasmo-ring-[#c01800]"
                />
                <p className="plasmo-text-xs plasmo-text-gray-400 italic">
                  Hệ thống sẽ kiểm tra và gửi thông báo vào khung giờ này mỗi
                  ngày.
                </p>
              </div>

              <div className="plasmo-flex plasmo-items-center plasmo-justify-between plasmo-pt-2">
                <label className="plasmo-text-sm plasmo-text-gray-600">Hiển thị lịch thu nhỏ (Widget) trên web</label>
                <input 
                  type="checkbox" 
                  checked={showWidget}
                  onChange={(e) => setShowWidget(e.target.checked)}
                  className="plasmo-w-5 plasmo-h-5 plasmo-accent-[#c01800] plasmo-cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="plasmo-border-t plasmo-border-gray-200 plasmo-pt-6">
            <h2 className="plasmo-text-lg plasmo-font-semibold plasmo-mb-3 text-color-2">
              Quản lý dữ liệu (Backup & Restore)
            </h2>
            <div className="plasmo-flex plasmo-flex-col plasmo-gap-3">
              <p className="plasmo-text-sm plasmo-text-gray-500">
                Sao lưu các ghi chú cá nhân của bạn ra file JSON hoặc khôi phục
                từ bản sao lưu trước đó.
              </p>
              <div className="plasmo-flex plasmo-gap-3">
                <button
                  onClick={handleExport}
                  className="plasmo-flex-1 plasmo-bg-emerald-600 plasmo-text-white plasmo-px-4 plasmo-py-2 plasmo-rounded-lg hover:plasmo-bg-emerald-700 plasmo-transition-colors">
                  Xuất dữ liệu (.json)
                </button>
                <label className="plasmo-flex-1">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="plasmo-hidden"
                    id="import-input"
                  />
                  <span className="plasmo-block plasmo-text-center plasmo-cursor-pointer plasmo-bg-amber-600 plasmo-text-white plasmo-px-4 plasmo-py-2 plasmo-rounded-lg hover:plasmo-bg-amber-700 plasmo-transition-colors">
                    Khôi phục dữ liệu
                  </span>
                </label>
              </div>
              {importStatus && (
                <p
                  className={`plasmo-text-xs ${importStatus.includes("thành công") ? "plasmo-text-green-600" : "plasmo-text-red-600"}`}>
                  {importStatus}
                </p>
              )}
            </div>
          </div>

          <div className="plasmo-border-t plasmo-border-gray-200 plasmo-pt-6">
            <h2 className="plasmo-text-lg plasmo-font-semibold plasmo-mb-3 text-color-2">
              Tài khoản Google Calendar
            </h2>
            <div className="plasmo-flex plasmo-items-center plasmo-gap-4">
              {token ? (
                <>
                  <span className="plasmo-text-green-600 plasmo-font-medium">
                    Đã kết nối
                  </span>
                  <button
                    onClick={handleLogout}
                    className="plasmo-bg-red-500 plasmo-text-white plasmo-px-4 plasmo-py-2 plasmo-rounded-lg hover:plasmo-bg-red-600 plasmo-transition-colors">
                    Ngắt kết nối
                  </button>
                </>
              ) : (
                <>
                  <span className="plasmo-text-gray-500">Chưa kết nối</span>
                  <button
                    onClick={handleLogin}
                    className="plasmo-bg-blue-500 plasmo-text-white plasmo-px-4 plasmo-py-2 plasmo-rounded-lg hover:plasmo-bg-blue-600 plasmo-transition-colors">
                    Kết nối ngay
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OptionsIndex
