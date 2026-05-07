import { useStorage } from "@plasmohq/storage/hook"
import cssText from "data-text:~style.css"
import dayjs from "dayjs"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState, useRef } from "react"

import LunarCalendar, { type FullInfoType } from "~utils/LunarCalendar"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

/**
 * Generates a style element with adjusted CSS to work correctly within a Shadow DOM.
 */
export const getStyle = (): HTMLStyleElement => {
  const baseFontSize = 16

  let updatedCssText = cssText.replaceAll(":root", ":host(plasmo-csui)")
  const remRegex = /([\d.]+)rem/g
  updatedCssText = updatedCssText.replace(remRegex, (match, remValue) => {
    const pixelsValue = parseFloat(remValue) * baseFontSize

    return `${pixelsValue}px`
  })

  const styleElement = document.createElement("style")

  styleElement.textContent = updatedCssText

  return styleElement
}

const PlasmoOverlay = () => {
  const [lunarInfo, setLunarInfo] = useState<FullInfoType | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  
  // Cấu hình hiển thị widget
  const [showWidget] = useStorage("showWidget", true)
  
  // Lưu vị trí widget (mặc định cách góc dưới phải 16px)
  // Vị trí lưu trong storage
  const [pos, setPos] = useStorage("widget-pos", { bottom: 16, right: 16 })
  
  // Vị trí hiển thị tức thời (để kéo mượt mà không bị giới hạn quota storage)
  const [localPos, setLocalPos] = useState({ bottom: 16, right: 16 })
  
  const [isDragging, setIsDragging] = useState(false)
  const dragStartPos = useRef({ x: 0, y: 0, bottom: 0, right: 0 })
  const hasMoved = useRef(false) // Theo dõi xem có thực sự di chuyển không

  // Cập nhật localPos khi pos từ storage thay đổi (ví dụ từ tab khác)
  useEffect(() => {
    if (!isDragging) {
      setLocalPos(pos)
    }
  }, [pos, isDragging])

  useEffect(() => {
    const today = dayjs()
    const lc = LunarCalendar.getFullInfo(
      today.date(),
      today.month() + 1,
      today.year()
    )
    setLunarInfo(lc)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    hasMoved.current = false // Reset trạng thái di chuyển
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      bottom: localPos.bottom,
      right: localPos.right
    }
    // Không preventDefault ở đây để các sự kiện click vẫn có thể hoạt động
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const deltaX = dragStartPos.current.x - e.clientX
      const deltaY = dragStartPos.current.y - e.clientY
      
      // Nếu di chuyển hơn 5px thì coi là đang kéo (drag)
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        hasMoved.current = true
      }

      if (!hasMoved.current) return

      let newBottom = dragStartPos.current.bottom + deltaY
      let newRight = dragStartPos.current.right + deltaX

      const padding = 10
      newBottom = Math.max(padding, Math.min(window.innerHeight - 60, newBottom))
      newRight = Math.max(padding, Math.min(window.innerWidth - 60, newRight))

      // Chỉ cập nhật state local để UI mượt mà
      setLocalPos({ bottom: newBottom, right: newRight })
    }

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false)
        // Chỉ lưu vào storage khi kết thúc thao tác kéo
        if (hasMoved.current) {
          setPos(localPos)
        }
      }
    }

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, localPos])

  if (!showWidget) return null
  if (!lunarInfo) return null

  return (
    <div 
      className="plasmo-fixed plasmo-z-[9999]"
      style={{ 
        bottom: `${localPos.bottom}px`, 
        right: `${localPos.right}px`,
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        touchAction: "none"
      }}
      onMouseDown={handleMouseDown}
    >
      {isOpen ? (
        <div className="plasmo-bg-[#ffe6ad] plasmo-border-2 plasmo-border-[#d4b48a] plasmo-rounded-xl plasmo-p-4 plasmo-shadow-lg plasmo-w-64 plasmo-text-center">
          <div className="plasmo-flex plasmo-justify-between plasmo-items-center plasmo-mb-2">
            <span className="plasmo-font-bold text-color-2">Lịch Vạn Niên</span>
            <button
              onClick={(e) => { 
                e.stopPropagation(); 
                if (!hasMoved.current) setIsOpen(false) 
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className="plasmo-text-gray-500 hover:plasmo-text-gray-700 plasmo-font-bold">
              ✕
            </button>
          </div>
          <div className="plasmo-text-sm plasmo-font-medium plasmo-text-gray-600 plasmo-uppercase plasmo-mb-1">
            Tháng {lunarInfo.solar.month} Năm {lunarInfo.solar.year}
          </div>
          <div className="plasmo-text-6xl plasmo-font-bold plasmo-text-gray-800 plasmo-mb-2">
            {lunarInfo.solar.day}
          </div>

          <div className="plasmo-border-t plasmo-border-gray-300 plasmo-my-3"></div>

          <div className="plasmo-text-xl plasmo-font-bold text-color-1">
            Âm lịch: {lunarInfo.lunar?.day}/{lunarInfo.lunar?.month}
          </div>
          <div className="plasmo-text-sm plasmo-font-medium plasmo-mt-1 text-color-2">
            Tháng {lunarInfo.lunar?.monthName}
          </div>
          <div className="plasmo-text-xs plasmo-text-gray-500 plasmo-mt-1">
            Năm {lunarInfo.lunar?.yearCanChi}
          </div>
        </div>
      ) : (
        <button
          onClick={(e) => {
            // Chỉ mở rộng nếu không phải là thao tác kéo
            if (!hasMoved.current) {
              setIsOpen(true)
            }
          }}
          className="plasmo-w-14 plasmo-h-14 plasmo-bg-white plasmo-border plasmo-border-gray-200 plasmo-rounded-xl plasmo-shadow-lg plasmo-flex plasmo-flex-col plasmo-items-center hover:plasmo-bg-gray-50 plasmo-transition-colors plasmo-overflow-hidden"
          title="Xem Lịch Âm">
          <div className="plasmo-w-full plasmo-bg-[#c01800] plasmo-h-1.5"></div>
          <div className="plasmo-flex-1 plasmo-flex plasmo-flex-col plasmo-items-center plasmo-justify-center plasmo-pb-0.5">
            <span className="plasmo-font-bold plasmo-text-xl plasmo-text-gray-800 plasmo-leading-none">
              {lunarInfo.solar.day}
            </span>
            <span className="plasmo-text-[10px] plasmo-font-medium plasmo-text-[#c01800] plasmo-mt-1 plasmo-leading-none">
              {lunarInfo.lunar?.day}/{lunarInfo.lunar?.month} ÂL
            </span>
          </div>
        </button>
      )}
    </div>
  )
}

export default PlasmoOverlay
