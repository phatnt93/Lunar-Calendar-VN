import cssText from "data-text:~style.css"
import dayjs from "dayjs"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import LunarCalendar, { type FullInfoType } from "~utils/LunarCalendar"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

/**
 * Generates a style element with adjusted CSS to work correctly within a Shadow DOM.
 *
 * Tailwind CSS relies on `rem` units, which are based on the root font size (typically defined on the <html>
 * or <body> element). However, in a Shadow DOM (as used by Plasmo), there is no native root element, so the
 * rem values would reference the actual page's root font size—often leading to sizing inconsistencies.
 *
 * To address this, we:
 * 1. Replace the `:root` selector with `:host(plasmo-csui)` to properly scope the styles within the Shadow DOM.
 * 2. Convert all `rem` units to pixel values using a fixed base font size, ensuring consistent styling
 *    regardless of the host page's font size.
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

  useEffect(() => {
    const today = dayjs()
    const lc = LunarCalendar.getFullInfo(
      today.date(),
      today.month() + 1,
      today.year()
    )
    setLunarInfo(lc)
  }, [])

  if (!lunarInfo) return null

  return (
    <div className="plasmo-fixed plasmo-bottom-4 plasmo-right-4 plasmo-z-[9999]">
      {isOpen ? (
        <div className="plasmo-bg-[#ffe6ad] plasmo-border-2 plasmo-border-[#d4b48a] plasmo-rounded-xl plasmo-p-4 plasmo-shadow-lg plasmo-w-64 plasmo-text-center">
          <div className="plasmo-flex plasmo-justify-between plasmo-items-center plasmo-mb-2">
            <span className="plasmo-font-bold text-color-2">Lịch Vạn Niên</span>
            <button
              onClick={() => setIsOpen(false)}
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
          onClick={() => setIsOpen(true)}
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
