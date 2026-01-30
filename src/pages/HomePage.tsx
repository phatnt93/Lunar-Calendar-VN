import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/solid"
import dayjs from "dayjs"
import { useEffect, useState } from "react"

import { getDailyQuote, type DailyQuotationType } from "~utils/dailyQuotations"
import { dateFromString, getDatesForCalendar } from "~utils/helper"
import LunarCalendar, { type FullInfoType } from "~utils/LunarCalendar"
import { ZodiacHorse } from "~utils/ZodiacImages"

export const HomePage = () => {
  const [solarDate, setSolarDate] = useState(dayjs())
  const [lunarInfo, setLunarInfo] = useState<FullInfoType | null>(null)
  const [datesCalendar, setDatesCalendar] = useState<
    {
      day: number
      month: number
      year: number
      lunarDay: number
      lunarMonth: number
      lunarYear: number
    }[]
  >([])
  const [dailyQuote, setDailyQuote] = useState<DailyQuotationType | null>(null)
  const [convertSolarInput, setConvertSolarInput] = useState<string>("")
  const [convertSolarOutput, setConvertSolarOutput] = useState<string>("")
  const [convertLunarInput, setConvertLunarInput] = useState<string>("")
  const [convertLunarOutput, setConvertLunarOutput] = useState<string>("")
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false)
  const [goFastSolarInput, setGoFastSolarInput] = useState<string>("")
  const isToday = (day: number, month: number, year: number) => {
    const dateNow = dayjs()
    return (
      day === dateNow.date() &&
      month === dateNow.month() &&
      year === dateNow.year()
    )
  }
  const onClickDate = (day: number, month: number, year: number) => {
    setSolarDate(dayjs(new Date(year, month, day)))
  }
  const getClassForDateCell = (
    day: number,
    month: number,
    year: number,
    index: number
  ) => {
    let classes = "plasmo-cursor-pointer plasmo-w-16 plasmo-h-8 plasmo-p-1 "
    if (index === 5 || index === 6) {
      classes += " plasmo-text-red-600 "
    }
    if (isToday(day, month, year)) {
      classes += "bg-3 current-day"
    } else if (
      solarDate.get("date") === day &&
      solarDate.get("month") === month &&
      solarDate.get("year") === year
    ) {
      classes += "bg-4 selected-day"
    }
    return classes
  }
  const onGoToToday = () => {
    const today = dayjs()
    setSolarDate(today)
  }
  const onGoToPreviousDay = () => {
    setSolarDate(solarDate.subtract(1, "day"))
  }
  const onGoToNextDay = () => {
    setSolarDate(solarDate.add(1, "day"))
  }
  const onGoToPreviousMonth = () => {
    setSolarDate(solarDate.subtract(1, "month"))
  }
  const onGoToNextMonth = () => {
    setSolarDate(solarDate.add(1, "month"))
  }
  useEffect(() => {
    const lc = LunarCalendar.getFullInfo(
      solarDate.get("date"),
      solarDate.get("month") + 1,
      solarDate.get("year")
    )
    setLunarInfo(lc)
    const dates = getDatesForCalendar(solarDate.year(), solarDate.month())
    const datesWithLunar = dates.map((date) => {
      const lunar = LunarCalendar.convertSolar2Lunar(
        date.day,
        date.month + 1,
        date.year
      )
      return {
        ...date,
        lunarDay: lunar.day,
        lunarMonth: lunar.month,
        lunarYear: lunar.year
      }
    })
    setDatesCalendar(datesWithLunar)
    const dailyQuoteItem = getDailyQuote(solarDate)
    setDailyQuote(dailyQuoteItem)
  }, [solarDate])

  useEffect(() => {
    const parsedDate = dateFromString(goFastSolarInput)
    if (parsedDate.isValid()) {
      setSolarDate(parsedDate)
    } else {
      // Invalid date input; do nothing or show error if needed
    }
  }, [goFastSolarInput])

  useEffect(() => {
    const convertSolarDate = dateFromString(convertSolarInput)
    if (convertSolarDate.isValid()) {
      const lunar = LunarCalendar.convertSolar2Lunar(
        convertSolarDate.get("date"),
        convertSolarDate.get("month") + 1,
        convertSolarDate.get("year")
      )
      setConvertSolarOutput(
        `Âm lịch: ${lunar.day}/${lunar.month}/${lunar.year}`
      )
    } else {
      setConvertSolarOutput("")
    }
  }, [convertSolarInput])

  useEffect(() => {
    const convertLunarDate = dateFromString(convertLunarInput)
    if (convertLunarDate.isValid()) {
      const solar = LunarCalendar.convertLunar2Solar(
        convertLunarDate.get("date"),
        convertLunarDate.get("month") + 1,
        convertLunarDate.get("year")
      )
      setConvertLunarOutput(
        `Dương lịch: ${solar.day}/${solar.month}/${solar.year}`
      )
    } else {
      setConvertLunarOutput("")
    }
  }, [convertLunarInput])
  return (
    <div className="plasmo-flex plasmo-flex-row plasmo-gap-4 plasmo-p-4">
      <div className="plasmo-flex plasmo-flex-col plasmo-flex-1 plasmo-gap-2 plasmo-p-4">
        <div className="plasmo-text-sm plasmo-font-bold plasmo-text-center">
          Tháng {solarDate.month() + 1} Năm {solarDate.year()}
        </div>
        <div className="plasmo-flex">
          <div className="plasmo-flex-1 plasmo-flex plasmo-justify-end plasmo-items-center plasmo-mr-4 plasmo-font-bold text-color-1 solar-date-number">
            {solarDate.date()}
          </div>
          <div className="zodiac-img">
            <img src={ZodiacHorse} alt="" className="plasmo-w-full" />
          </div>
        </div>
        <div>
          <div className="plasmo-text-center plasmo-mb-1 plasmo-italic">
            {dailyQuote?.content_vn}
          </div>
          <div className="plasmo-text-right plasmo-font-light">
            <span>-&#9884;- </span>
            {dailyQuote?.author}
            <span> -&#9884;-</span>
          </div>
        </div>
        <div className="plasmo-flex plasmo-flex-row">
          <div className="plasmo-flex-1 plasmo-text-center">
            <div className="plasmo-mb-1">
              Tháng {lunarInfo?.lunar.monthName}
            </div>
            <div className="plasmo-text-5xl plasmo-font-bold plasmo-mb-1">
              {lunarInfo?.lunar.day}
            </div>
            <div className="">Năm {lunarInfo?.lunar.yearCanChi}</div>
          </div>
          <div className="plasmo-flex-1 plasmo-text-center">
            <div className="">Tháng {lunarInfo?.lunar.monthCanChi}</div>
            <div className="">Ngày {lunarInfo?.lunar.dayCanChi}</div>
            <div className="">
              Giờ {lunarInfo?.hour.canChi}
              <br />({lunarInfo?.hour.type})
            </div>
            <div className="">Tiết {lunarInfo?.solarTerm.name}</div>
          </div>
        </div>
        <div>
          <span className="plasmo-font-bold">Giờ hoàng đạo: </span>
          {lunarInfo?.hours
            .filter((hour) => hour.isGood)
            .map((hour) => hour.name + ` (${hour.canChi})`)
            .join(", ")}
        </div>
      </div>
      <div className="plasmo-flex plasmo-flex-col plasmo-flex-1 plasmo-gap-4">
        <div className="">
          <div className="plasmo-flex plasmo-flex-row plasmo-pt-2 plasmo-pb-1">
            <div className="plasmo-flex-1 plasmo-flex plasmo-flex-row plasmo-gap-2">
              <ChevronDoubleLeftIcon
                className="plasmo-size-6 plasmo-cursor-pointer"
                onClick={onGoToPreviousMonth}
              />
              <ChevronLeftIcon
                className="plasmo-size-6 plasmo-cursor-pointer"
                onClick={onGoToPreviousDay}
              />
            </div>
            <div
              className="plasmo-flex-1 plasmo-font-bold plasmo-text-center plasmo-text-lg plasmo-cursor-pointer text-color-1"
              onClick={onGoToToday}>
              Hôm nay
            </div>
            <div className="plasmo-flex-1 plasmo-flex plasmo-flex-row plasmo-justify-end plasmo-gap-2">
              <ChevronRightIcon
                className="plasmo-size-6 plasmo-cursor-pointer"
                onClick={onGoToNextDay}
              />
              <ChevronDoubleRightIcon
                className="plasmo-size-6 plasmo-cursor-pointer"
                onClick={onGoToNextMonth}
              />
            </div>
          </div>
          <table className="plasmo-border-collapse">
            <thead className="bg-1">
              <tr className="plasmo-font-bold plasmo-h-8">
                <th className="plasmo-text-center text-color-2">T2</th>
                <th className="plasmo-text-center text-color-2">T3</th>
                <th className="plasmo-text-center text-color-2">T4</th>
                <th className="plasmo-text-center text-color-2">T5</th>
                <th className="plasmo-text-center text-color-2">T6</th>
                <th className="plasmo-text-center text-color-2">T7</th>
                <th className="plasmo-text-center text-color-2">CN</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(
                { length: Math.ceil(datesCalendar.length / 7) },
                (_, weekIndex) => (
                  <tr
                    key={weekIndex}
                    className="plasmo-border-b border-color-1">
                    {datesCalendar
                      .slice(weekIndex * 7, weekIndex * 7 + 7)
                      .map((dateItem, index) => (
                        <td
                          key={index}
                          className={getClassForDateCell(
                            dateItem.day,
                            dateItem.month,
                            dateItem.year,
                            index
                          )}
                          onClick={() => {
                            onClickDate(
                              dateItem.day,
                              dateItem.month,
                              dateItem.year
                            )
                          }}>
                          <div className="plasmo-flex plasmo-flex-col plasmo-justify-between plasmo-h-full">
                            <div className="plasmo-text-center">
                              {dateItem.month != solarDate.month()
                                ? dateItem.day + `/${dateItem.month + 1}`
                                : dateItem.day}
                            </div>
                            <div className="plasmo-text-right text-color-3 font-size-11 plasmo-pt-1">
                              {dateItem.lunarDay === 1
                                ? dateItem.lunarDay + "/" + dateItem.lunarMonth
                                : dateItem.lunarDay}
                            </div>
                          </div>
                        </td>
                      ))}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        <div>
          <div
            className="text-color-2 plasmo-font-bold plasmo-cursor-pointer"
            onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}>
            Tính năng nâng cao
            <span className="plasmo-text-lg">
              {showAdvancedFeatures ? "▲" : "▼"}
            </span>
          </div>
          <div className={showAdvancedFeatures ? "" : "plasmo-hidden"}>
            <div className="plasmo-mb-4">
              <label className="plasmo-font-medium">
                Chuyển đến ngày dương
              </label>
              <input
                type="text"
                id="go-fast-solar"
                className="plasmo-peer plasmo-mt-0.5 plasmo-w-full plasmo-rounded plasmo-border-gray-300 plasmo-shadow-sm plasmo-sm:text-sm plasmo-p-2 input-1"
                placeholder="Ngày/Tháng/Năm"
                value={goFastSolarInput}
                onChange={(e) => setGoFastSolarInput(e.target.value)}
              />
            </div>
            <div className="plasmo-font-bold">Tra cứu ngày Âm - Dương</div>
            <div className="plasmo-flex plasmo-gap-4">
              <div className="plasmo-flex-1 plasmo-flex plasmo-flex-col">
                <label htmlFor="solar-convert" className="plasmo-font-medium">
                  Ngày dương
                </label>
                <input
                  type="text"
                  id="solar-convert"
                  className="plasmo-peer plasmo-mt-0.5 plasmo-w-full plasmo-rounded plasmo-border-gray-300 plasmo-shadow-sm plasmo-sm:text-sm plasmo-p-2 input-1"
                  placeholder="Ngày/Tháng/Năm"
                  value={convertSolarInput}
                  onChange={(e) => setConvertSolarInput(e.target.value)}
                />
                <div className="plasmo-text-red-600 plasmo-font-bold plasmo-mt-2">
                  {convertSolarOutput}
                </div>
              </div>
              <div className="plasmo-flex-1 plasmo-flex plasmo-flex-col">
                <label htmlFor="lunar-convert" className="plasmo-font-medium">
                  Ngày âm
                </label>
                <input
                  type="text"
                  id="lunar-convert"
                  className="plasmo-peer plasmo-mt-0.5 plasmo-w-full plasmo-rounded plasmo-border-gray-300 plasmo-shadow-sm plasmo-sm:text-sm plasmo-p-2 input-1"
                  placeholder="Ngày/Tháng/Năm"
                  value={convertLunarInput}
                  onChange={(e) => setConvertLunarInput(e.target.value)}
                />
                <div className="plasmo-text-green-600 plasmo-font-bold plasmo-mt-2">
                  {convertLunarOutput}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
