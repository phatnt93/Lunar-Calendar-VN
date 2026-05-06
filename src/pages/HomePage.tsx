import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/solid"
import { useStorage } from "@plasmohq/storage/hook"
import dayjs from "dayjs"
import { useEffect, useState } from "react"

import { EventFormModal } from "~components/EventFormModal"
import { type PersonalEvent } from "~types/personalEvent"
import { getCategories, type UserCategory } from "~utils/categories"
import { getDailyQuote, type DailyQuotationType } from "~utils/dailyQuotations"
import { authenticate } from "~utils/googleAuth"
import { fetchEvents, type CalendarEvent } from "~utils/googleCalendar"
import { dateFromString, getDatesForCalendar } from "~utils/helper"
import { type CountdownItem, getUpcomingEvents } from "~utils/countdown"
import LunarCalendar, { type FullInfoType } from "~utils/LunarCalendar"
import { isEventOnSolarDate } from "~utils/lunarEventResolver"
import { getAllEvents, triggerCloudSync } from "~utils/personalEvents"
import { ZodiacHorse } from "~utils/ZodiacImages"

export const HomePage = () => {
  const [quoteLang] = useStorage("quoteLang", "vn")
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
  const [goFastSolarError, setGoFastSolarError] = useState<string>("")
  const [convertSolarError, setConvertSolarError] = useState<string>("")
  const [convertLunarError, setConvertLunarError] = useState<string>("")
  const [personalEvents, setPersonalEvents] = useState<PersonalEvent[]>([])
  const [userCategories, setUserCategories] = useState<UserCategory[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<CountdownItem[]>([])
  const [showEventModal, setShowEventModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<PersonalEvent | null>(null)
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
    if (!goFastSolarInput) {
      setGoFastSolarError("")
      return
    }
    const parsedDate = dateFromString(goFastSolarInput)
    if (parsedDate.isValid()) {
      setSolarDate(parsedDate)
      setGoFastSolarError("")
    } else {
      setGoFastSolarError("Sai định dạng (VD: 20/11/2023)")
    }
  }, [goFastSolarInput])

  useEffect(() => {
    if (!convertSolarInput) {
      setConvertSolarOutput("")
      setConvertSolarError("")
      return
    }
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
      setConvertSolarError("")
    } else {
      setConvertSolarOutput("")
      setConvertSolarError("Sai định dạng (VD: 20/11/2023)")
    }
  }, [convertSolarInput])

  useEffect(() => {
    if (!convertLunarInput) {
      setConvertLunarOutput("")
      setConvertLunarError("")
      return
    }
    const convertLunarDate = dateFromString(convertLunarInput)
    if (convertLunarDate.isValid()) {
      const solar = LunarCalendar.convertLunar2Solar(
        convertLunarDate.get("date"),
        convertLunarDate.get("month") + 1,
        convertLunarDate.get("year")
      )
      if (solar) {
        setConvertLunarOutput(
          `Dương lịch: ${solar.day}/${solar.month}/${solar.year}`
        )
        setConvertLunarError("")
      } else {
        setConvertLunarOutput("")
        setConvertLunarError("Ngày âm lịch không hợp lệ")
      }
    } else {
      setConvertLunarOutput("")
      setConvertLunarError("Sai định dạng (VD: 20/11/2023)")
    }
  }, [convertLunarInput])

  const reloadPersonalEvents = async () => {
    const events = await getAllEvents()
    const cats = await getCategories()
    setPersonalEvents(events)
    setUserCategories(cats)
    
    const upcoming = await getUpcomingEvents(events, 4)
    setUpcomingEvents(upcoming)
  }

  useEffect(() => {
    reloadPersonalEvents()
    triggerCloudSync().then(() => {
      reloadPersonalEvents()
    })
  }, [])

  const getPersonalEventsForDate = (d: number, m: number, y: number): PersonalEvent[] => {
    return personalEvents.filter(ev => isEventOnSolarDate(ev, d, m + 1, y))
  }

  const [currentMonthEvents, setCurrentMonthEvents] = useState<CalendarEvent[]>([])
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    authenticate(false).then((t) => {
      if (t) setToken(t);
    });
  }, []);

  useEffect(() => {
    if (!token) {
      setCurrentMonthEvents([]);
      return;
    }
    const fetchMonthEvents = async () => {
      // Fetch events from the start of the currently viewed month to the end
      const startOfMonth = dayjs(new Date(solarDate.year(), solarDate.month(), 1)).toISOString();
      const endOfMonth = dayjs(new Date(solarDate.year(), solarDate.month() + 1, 0)).endOf('day').toISOString();

      const events = await fetchEvents(token, startOfMonth, endOfMonth);
      setCurrentMonthEvents(events);
    };
    fetchMonthEvents();
  }, [solarDate.month(), solarDate.year(), token])

  const handleLogin = async () => {
    const t = await authenticate(true);
    if (t) setToken(t);
  }

  const getEventsForDate = (d: number, m: number, y: number) => {
    const targetDateStr = dayjs(new Date(y, m, d)).format("YYYY-MM-DD");
    return currentMonthEvents.filter(event => {
      const startStr = event.start.dateTime || event.start.date;
      if (!startStr) return false;
      return startStr.startsWith(targetDateStr);
    });
  }

  return (
    <>
      <div className="plasmo-flex plasmo-flex-row plasmo-gap-4 plasmo-p-4 animate-fade-in">
        <div key={solarDate.toISOString()} className="plasmo-flex plasmo-flex-col plasmo-flex-1 plasmo-gap-2 plasmo-p-4 animate-slide-in">
          <div className="plasmo-text-sm plasmo-font-bold plasmo-text-center">
            Tháng {solarDate.month() + 1} Năm {solarDate.year()}
          </div>
          <div className="plasmo-flex">
            <div className="plasmo-flex-1"></div>
            <div className="plasmo-flex-1 plasmo-pr-4 plasmo-text-center plasmo-font-bold text-color-1 solar-date-number">
              {solarDate.date()}
            </div>
            <div className="plasmo-flex-1">
              <img src={ZodiacHorse} alt="" className="plasmo-w-full" />
            </div>
          </div>
          <div>
            <div className="plasmo-text-center plasmo-mb-1 plasmo-italic">
              {quoteLang === "en" ? dailyQuote?.content_en : quoteLang === "cn" ? dailyQuote?.content_cn : dailyQuote?.content_vn}
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
                Giờ {lunarInfo?.hour.canChi}{" "}
                <span className="font-size-11">({lunarInfo?.hour.type})</span>
              </div>
              <div className="">Tiết {lunarInfo?.solarTerm.name}</div>
            </div>
          </div>
          <div>
            <span className="plasmo-font-bold font-size-11">Giờ hoàng đạo: </span>
            {lunarInfo?.hours
              .filter((hour) => hour.isGood)
              .map((hour) => hour.name + ` (${hour.canChi})`)
              .join(", ")}
          </div>

          <div className="plasmo-mt-4 plasmo-border-t border-color-1 plasmo-pt-4">
            <div className="plasmo-flex plasmo-justify-between plasmo-items-center plasmo-mb-2">
              <div className="plasmo-font-bold text-color-2">Sự kiện trong ngày</div>
              {!token && (
                <button
                  onClick={handleLogin}
                  className="plasmo-text-xs plasmo-bg-blue-500 plasmo-text-white plasmo-px-2 plasmo-py-1 plasmo-rounded hover:plasmo-bg-blue-600 plasmo-transition-colors">
                  Kết nối Google
                </button>
              )}
            </div>
            <div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
              {getEventsForDate(solarDate.date(), solarDate.month(), solarDate.year()).length > 0 ? (
                getEventsForDate(solarDate.date(), solarDate.month(), solarDate.year()).map((ev, idx) => {
                  let timeStr = "Cả ngày";
                  if (ev.start.dateTime && ev.end.dateTime) {
                    timeStr = `${dayjs(ev.start.dateTime).format('HH:mm')} - ${dayjs(ev.end.dateTime).format('HH:mm')}`;
                  }
                  return (
                    <div 
                      key={ev.id} 
                      className="plasmo-bg-white plasmo-p-2 plasmo-rounded plasmo-shadow-sm plasmo-border-l-4 plasmo-border-blue-500 stagger-item hover-lift"
                      style={{ "--stagger-index": idx } as React.CSSProperties}>
                      <div className="plasmo-text-xs plasmo-text-gray-500">{timeStr}</div>
                      <div className="plasmo-text-sm plasmo-font-semibold plasmo-truncate text-color-1" title={ev.summary}>{ev.summary}</div>
                    </div>
                  )
                })
              ) : (
                <div className="plasmo-text-sm plasmo-italic text-color-3">Không có sự kiện nào.</div>
              )}
            </div>
          </div>

          {/* Ghi chú của tôi */}
          <div className="plasmo-mt-4 plasmo-border-t border-color-1 plasmo-pt-4">
            <div className="plasmo-flex plasmo-justify-between plasmo-items-center plasmo-mb-2">
              <div className="plasmo-font-bold text-color-2">Ghi chú của tôi</div>
              <button
                onClick={() => { setEditingEvent(null); setShowEventModal(true) }}
                className="plasmo-text-xs plasmo-bg-orange-500 plasmo-text-white plasmo-px-2 plasmo-py-1 plasmo-rounded hover:plasmo-bg-orange-600 plasmo-transition-colors">
                + Thêm
              </button>
            </div>
            <div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
              {getPersonalEventsForDate(solarDate.date(), solarDate.month(), solarDate.year()).length > 0 ? (
                getPersonalEventsForDate(solarDate.date(), solarDate.month(), solarDate.year()).map((ev, idx) => {
                  const cat = userCategories.find(c => c.id === ev.category) || userCategories[0];
                  return (
                    <div
                      key={ev.id}
                      onClick={() => { setEditingEvent(ev); setShowEventModal(true) }}
                      className="plasmo-bg-white plasmo-p-2 plasmo-rounded plasmo-shadow-sm plasmo-cursor-pointer stagger-item hover-lift"
                      style={{ borderLeft: `4px solid ${cat?.color || '#f97316'}`, "--stagger-index": idx } as React.CSSProperties}>
                      <div className="plasmo-text-xs plasmo-text-gray-500">
                        {cat?.label || 'Chưa phân loại'}
                        {ev.repeatType !== 'none' && <span className="plasmo-ml-1">🔁</span>}
                        {ev.dateType === 'lunar' && <span className="plasmo-ml-1">🌙</span>}
                      </div>
                      <div className="plasmo-text-sm plasmo-font-semibold plasmo-truncate text-color-1" title={ev.title}>
                        {ev.title}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="plasmo-text-sm plasmo-italic text-color-3">Chưa có ghi chú nào.</div>
              )}
            </div>
          </div>

          {/* Sắp tới */}
          <div className="plasmo-mt-4 plasmo-border-t border-color-1 plasmo-pt-4">
            <div className="plasmo-font-bold text-color-2 plasmo-mb-2">Sắp tới</div>
            <div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((item, idx) => (
                  <div 
                    key={`${item.name}-${idx}`} 
                    className="plasmo-bg-white plasmo-p-2 plasmo-rounded plasmo-shadow-sm plasmo-flex plasmo-justify-between plasmo-items-center stagger-item hover-lift"
                    style={{ "--stagger-index": idx } as React.CSSProperties}>
                    <div className="plasmo-flex-1 plasmo-min-w-0">
                      <div className="plasmo-text-sm plasmo-font-semibold plasmo-truncate text-color-1">
                        {item.isLunar && <span className="plasmo-mr-1">🌙</span>}
                        {item.name}
                      </div>
                      <div className="plasmo-text-xs plasmo-text-gray-500">
                        {dayjs(item.date).format("DD/MM")}
                      </div>
                    </div>
                    <div className="plasmo-text-right">
                      {item.daysLeft === 0 ? (
                        <span className="plasmo-text-xs plasmo-bg-red-100 plasmo-text-red-600 plasmo-px-2 plasmo-py-0.5 plasmo-rounded-full plasmo-font-bold">Hôm nay</span>
                      ) : (
                        <span className="plasmo-text-xs plasmo-bg-blue-100 plasmo-text-blue-600 plasmo-px-2 plasmo-py-0.5 plasmo-rounded-full">Còn {item.daysLeft} ngày</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="plasmo-text-sm plasmo-italic text-color-3">Không có sự kiện sắp tới.</div>
              )}
            </div>
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
                            className={`${getClassForDateCell(
                              dateItem.day,
                              dateItem.month,
                              dateItem.year,
                              index
                            )} calendar-cell`}
                            onClick={() => {
                              onClickDate(
                                dateItem.day,
                                dateItem.month,
                                dateItem.year
                              )
                            }}>
                            {/* Tooltip hiển thị nhanh sự kiện */}
                            {(getEventsForDate(dateItem.day, dateItem.month, dateItem.year).length > 0 || 
                              getPersonalEventsForDate(dateItem.day, dateItem.month, dateItem.year).length > 0) && (
                              <div className="calendar-tooltip">
                                <div className="plasmo-font-bold plasmo-mb-1 plasmo-border-b plasmo-border-gray-600">Sự kiện:</div>
                                <div className="plasmo-space-y-1">
                                  {getEventsForDate(dateItem.day, dateItem.month, dateItem.year).map(ev => (
                                    <div key={ev.id} className="plasmo-truncate plasmo-text-blue-300">• {ev.summary}</div>
                                  ))}
                                  {getPersonalEventsForDate(dateItem.day, dateItem.month, dateItem.year).map(ev => (
                                    <div key={ev.id} className="plasmo-truncate plasmo-text-orange-300">• {ev.title}</div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="plasmo-flex plasmo-flex-col plasmo-justify-between plasmo-h-full plasmo-relative">
                              <div className="plasmo-text-center">
                                {dateItem.month != solarDate.month() ? (
                                  <span className="plasmo-text-gray-300">
                                    {dateItem.day + `/${dateItem.month + 1}`}
                                  </span>
                                ) : (
                                  dateItem.day
                                )}
                              </div>
                              <div className="plasmo-flex plasmo-justify-between plasmo-items-end">
                                <div className="plasmo-flex plasmo-gap-1 plasmo-pl-1 plasmo-pb-0.5">
                                  {getEventsForDate(dateItem.day, dateItem.month, dateItem.year).length > 0 && (
                                    <div className="plasmo-w-1.5 plasmo-h-1.5 plasmo-rounded-full plasmo-bg-blue-500"></div>
                                  )}
                                  {getPersonalEventsForDate(dateItem.day, dateItem.month, dateItem.year).slice(0, 3).map((ev) => {
                                    const cat = userCategories.find(c => c.id === ev.category) || userCategories[0];
                                    return (
                                      <div 
                                        key={ev.id}
                                        className="plasmo-w-1.5 plasmo-h-1.5 plasmo-rounded-full"
                                        style={{ backgroundColor: cat?.color || '#f97316' }}
                                      />
                                    )
                                  })}
                                </div>
                                <div className="plasmo-text-right text-color-3 font-size-11 plasmo-pt-1">
                                  {dateItem.lunarDay === 1
                                    ? dateItem.lunarDay + "/" + dateItem.lunarMonth
                                    : dateItem.lunarDay}
                                </div>
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
                  placeholder="ngày/tháng/năm"
                  value={goFastSolarInput}
                  onChange={(e) => setGoFastSolarInput(e.target.value)}
                />
                {goFastSolarError && (
                  <div className="plasmo-text-red-500 plasmo-text-xs plasmo-mt-1">
                    {goFastSolarError}
                  </div>
                )}
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
                    placeholder="ngày/tháng/năm"
                    value={convertSolarInput}
                    onChange={(e) => setConvertSolarInput(e.target.value)}
                  />
                  {convertSolarError ? (
                    <div className="plasmo-text-red-500 plasmo-text-xs plasmo-mt-1">
                      {convertSolarError}
                    </div>
                  ) : (
                    <div className="plasmo-text-red-600 plasmo-font-bold plasmo-mt-2">
                      {convertSolarOutput}
                    </div>
                  )}
                </div>
                <div className="plasmo-flex-1 plasmo-flex plasmo-flex-col">
                  <label htmlFor="lunar-convert" className="plasmo-font-medium">
                    Ngày âm
                  </label>
                  <input
                    type="text"
                    id="lunar-convert"
                    className="plasmo-peer plasmo-mt-0.5 plasmo-w-full plasmo-rounded plasmo-border-gray-300 plasmo-shadow-sm plasmo-sm:text-sm plasmo-p-2 input-1"
                    placeholder="ngày/tháng/năm"
                    value={convertLunarInput}
                    onChange={(e) => setConvertLunarInput(e.target.value)}
                  />
                  {convertLunarError ? (
                    <div className="plasmo-text-red-500 plasmo-text-xs plasmo-mt-1">
                      {convertLunarError}
                    </div>
                  ) : (
                    <div className="plasmo-text-green-600 plasmo-font-bold plasmo-mt-2">
                      {convertLunarOutput}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal thêm/sửa ghi chú */}
      {showEventModal && (
        <EventFormModal
          solarDate={solarDate}
          editingEvent={editingEvent}
          onClose={() => { setShowEventModal(false); setEditingEvent(null) }}
          onSaved={reloadPersonalEvents}
        />
      )}
    </>
  )
}
