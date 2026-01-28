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
  const getClassForDateCell = (day: number, month: number, year: number) => {
    let classes =
      "plasmo-border plasmo-border-gray-300 plasmo-p-1 plasmo-cursor-pointer plasmo-w-16 plasmo-h-12 "
    if (isToday(day, month, year)) {
      classes += "plasmo-bg-green-600"
    } else if (
      solarDate.get("date") === day &&
      solarDate.get("month") === month &&
      solarDate.get("year") === year
    ) {
      classes += "plasmo-bg-yellow-600"
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
      <div className="plasmo-flex plasmo-flex-col plasmo-flex-1 plasmo-gap-4">
        <div className="plasmo-text-lg plasmo-font-bold plasmo-text-center">
          Tháng {solarDate.month() + 1} Năm {solarDate.year()}
        </div>
        <div className="plasmo-text-9xl plasmo-font-bold plasmo-text-center">
          {solarDate.date()}
        </div>
        <div>
          <div className="plasmo-text-center plasmo-font-bold plasmo-mb-1">
            {dailyQuote?.content_vn}
          </div>
          <div className="plasmo-text-right">{dailyQuote?.author}</div>
        </div>
        <div className="plasmo-flex plasmo-flex-row">
          <div className="plasmo-flex-1 plasmo-text-center">
            <div>Tháng {lunarInfo?.lunar.monthName}</div>
            <div className="plasmo-text-3xl">{lunarInfo?.lunar.day}</div>
            <div>Năm {lunarInfo?.lunar.yearCanChi}</div>
          </div>
          <div className="plasmo-flex-1 plasmo-text-center">
            <div>Tháng {lunarInfo?.lunar.monthCanChi}</div>
            <div>Ngày {lunarInfo?.lunar.dayCanChi}</div>
            <div>
              Giờ {lunarInfo?.hour.canChi} ({lunarInfo?.hour.type})
            </div>
            <div>Tiết {lunarInfo?.solarTerm.name}</div>
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
        <div className="plasmo-flex plasmo-flex-row">
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
            className="plasmo-flex-1 plasmo-font-bold plasmo-text-center plasmo-text-xl plasmo-cursor-pointer"
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
        <div className="">
          <table className=" plasmo-border-collapse plasmo-border plasmo-border-gray-400">
            <thead>
              <tr className="plasmo-font-bold">
                <th className="plasmo-border plasmo-border-gray-300 plasmo-text-center">
                  T2
                </th>
                <th className="plasmo-border plasmo-border-gray-300 plasmo-text-center">
                  T3
                </th>
                <th className="plasmo-border plasmo-border-gray-300 plasmo-text-center">
                  T4
                </th>
                <th className="plasmo-border plasmo-border-gray-300 plasmo-text-center">
                  T5
                </th>
                <th className="plasmo-border plasmo-border-gray-300 plasmo-text-center">
                  T6
                </th>
                <th className="plasmo-border plasmo-border-gray-300 plasmo-text-center">
                  T7
                </th>
                <th className="plasmo-border plasmo-border-gray-300 plasmo-text-center">
                  CN
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from(
                { length: Math.ceil(datesCalendar.length / 7) },
                (_, weekIndex) => (
                  <tr key={weekIndex}>
                    {datesCalendar
                      .slice(weekIndex * 7, weekIndex * 7 + 7)
                      .map((dateItem, index) => (
                        <td
                          key={index}
                          className={getClassForDateCell(
                            dateItem.day,
                            dateItem.month,
                            dateItem.year
                          )}
                          onClick={() => {
                            onClickDate(
                              dateItem.day,
                              dateItem.month,
                              dateItem.year
                            )
                          }}>
                          <div className="plasmo-flex plasmo-flex-col plasmo-justify-between plasmo-h-full">
                            <div className="plasmo-font-bold plasmo-text-left">
                              {dateItem.month != solarDate.month()
                                ? dateItem.day + `/${dateItem.month + 1}`
                                : dateItem.day}
                            </div>
                            <div className="plasmo-text-right">
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
        <div
          className="plasmo-text-green-600 plasmo-font-bold plasmo-cursor-pointer"
          onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}>
          Tính năng nâng cao
        </div>
        <div className={showAdvancedFeatures ? "" : "plasmo-hidden"}>
          <div className="plasmo-mb-4">
            <label className="plasmo-font-medium">
              Di chuyển nhanh đến ngày dương
            </label>
            <input
              type="text"
              id="go-fast-solar"
              className="plasmo-peer plasmo-mt-0.5 plasmo-w-full plasmo-rounded plasmo-border-gray-300 plasmo-shadow-sm plasmo-sm:text-sm plasmo-p-2"
              placeholder="dd/mm/yyyy"
              value={goFastSolarInput}
              onChange={(e) => setGoFastSolarInput(e.target.value)}
            />
          </div>
          <div className="plasmo-flex plasmo-gap-4">
            <div className="plasmo-flex-1 plasmo-flex plasmo-flex-col">
              <label htmlFor="solar-convert" className="plasmo-font-medium">
                Nhập ngày dương
              </label>
              <input
                type="text"
                id="solar-convert"
                className="plasmo-peer plasmo-mt-0.5 plasmo-w-full plasmo-rounded plasmo-border-gray-300 plasmo-shadow-sm plasmo-sm:text-sm plasmo-p-2"
                placeholder="dd/mm/yyyy"
                value={convertSolarInput}
                onChange={(e) => setConvertSolarInput(e.target.value)}
              />
              <div className="plasmo-text-red-600 plasmo-font-bold plasmo-mt-2">
                {convertSolarOutput}
              </div>
            </div>
            <div className="plasmo-flex-1 plasmo-flex plasmo-flex-col">
              <label htmlFor="lunar-convert" className="plasmo-font-medium">
                Nhập ngày âm
              </label>
              <input
                type="text"
                id="lunar-convert"
                className="plasmo-peer plasmo-mt-0.5 plasmo-w-full plasmo-rounded plasmo-border-gray-300 plasmo-shadow-sm plasmo-sm:text-sm plasmo-p-2"
                placeholder="dd/mm/yyyy"
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
  )
}
