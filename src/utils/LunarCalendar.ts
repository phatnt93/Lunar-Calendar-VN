/**
 * LunarCalendar Class for JavaScript/React
 *
 * Thuật toán tính âm lịch Việt Nam
 * Dựa trên tài liệu của Hồ Ngọc Đức
 * @link https://www.xemamlich.uhm.vn/calrules.html
 *
 * Quy luật của âm lịch Việt Nam:
 * 1. Ngày đầu tiên của tháng âm lịch là ngày chứa điểm Sóc (New Moon)
 * 2. Một năm bình thường có 12 tháng âm lịch, một năm nhuận có 13 tháng
 * 3. Đông chí luôn rơi vào tháng 11 âm lịch
 * 4. Trong năm nhuận, tháng đầu tiên không có Trung khí sau Đông chí là tháng nhuận
 * 5. Việc tính toán dựa trên kinh tuyến 105° đông (múi giờ +7 GMT)
 */

export type FullInfoType = {
  solar: {
    day: number
    month: number
    year: number
    dayOfWeek: number
    dayOfWeekName: string
  }
  lunar?: {
    day: number
    month: number
    year: number
    isLeap: boolean
    monthName: string
    dayCanChi: string
    monthCanChi: string
    yearCanChi: string
  }
  solarTerm: SolarTermInfoType
  hour: HourInfoType
  hours: HourInfoType[]
  jd: number
}

export type SolarTermInfoType = {
  index: number
  name: string
  longitude: string
  isMajor: boolean
}

export type SolarTermDateType = {
  day: number
  month: number
  year: number
}

export type HourInfoType = {
  index: number
  name: string
  range: string
  canChi: string
  isGood: boolean
  type: string
}

class LunarCalendar {
  /**
   * Múi giờ Việt Nam (GMT+7)
   */
  static TIMEZONE = 7.0

  /**
   * Các tên Can
   */
  static CAN = [
    "Giáp",
    "Ất",
    "Bính",
    "Đinh",
    "Mậu",
    "Kỷ",
    "Canh",
    "Tân",
    "Nhâm",
    "Quý"
  ]

  /**
   * Các tên Chi
   */
  static CHI = [
    "Tý",
    "Sửu",
    "Dần",
    "Mão",
    "Thìn",
    "Tỵ",
    "Ngọ",
    "Mùi",
    "Thân",
    "Dậu",
    "Tuất",
    "Hợi"
  ]

  /**
   * Tên các tháng âm lịch
   */
  static LUNAR_MONTHS = [
    "",
    "Giêng",
    "Hai",
    "Ba",
    "Tư",
    "Năm",
    "Sáu",
    "Bảy",
    "Tám",
    "Chín",
    "Mười",
    "Mười Một",
    "Chạp"
  ]

  /**
   * Tên các ngày trong tuần
   */
  static DAY_OF_WEEK = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy"
  ]

  /**
   * 24 Tiết khí (Solar Terms)
   * Mỗi cặp gồm: Tiết khí (Minor) và Trung khí (Major)
   */
  static SOLAR_TERMS = [
    "Xuân phân", // 0 - Vernal Equinox (Mar 20-21)
    "Thanh minh", // 1 - Pure Brightness (Apr 4-5)
    "Cốc vũ", // 2 - Grain Rain (Apr 19-21)
    "Lập hạ", // 3 - Start of Summer (May 5-7)
    "Tiểu mãn", // 4 - Grain Buds (May 20-22)
    "Mang chủng", // 5 - Grain in Ear (Jun 5-7)
    "Hạ chí", // 6 - Summer Solstice (Jun 21-22)
    "Tiểu thử", // 7 - Minor Heat (Jul 6-8)
    "Đại thử", // 8 - Major Heat (Jul 22-24)
    "Lập thu", // 9 - Start of Autumn (Aug 7-9)
    "Xử thử", // 10 - Limit of Heat (Aug 22-24)
    "Bạch lộ", // 11 - White Dew (Sep 7-9)
    "Thu phân", // 12 - Autumnal Equinox (Sep 22-24)
    "Hàn lộ", // 13 - Cold Dew (Oct 7-9)
    "Sương giáng", // 14 - Descent of Frost (Oct 23-24)
    "Lập đông", // 15 - Start of Winter (Nov 7-8)
    "Tiểu tuyết", // 16 - Minor Snow (Nov 22-23)
    "Đại tuyết", // 17 - Major Snow (Dec 6-8)
    "Đông chí", // 18 - Winter Solstice (Dec 21-23)
    "Tiểu hàn", // 19 - Minor Cold (Jan 5-7)
    "Đại hàn", // 20 - Major Cold (Jan 20-21)
    "Lập xuân", // 21 - Start of Spring (Feb 3-5)
    "Vũ thủy", // 22 - Rain Water (Feb 18-20)
    "Kinh trập" // 23 - Awakening of Insects (Mar 5-7)
  ]

  /**
   * 12 Giờ trong ngày (Địa Chi Giờ)
   */
  static HOURS = [
    { name: "Tý", range: "23:00 - 01:00", startHour: 23 },
    { name: "Sửu", range: "01:00 - 03:00", startHour: 1 },
    { name: "Dần", range: "03:00 - 05:00", startHour: 3 },
    { name: "Mão", range: "05:00 - 07:00", startHour: 5 },
    { name: "Thìn", range: "07:00 - 09:00", startHour: 7 },
    { name: "Tỵ", range: "09:00 - 11:00", startHour: 9 },
    { name: "Ngọ", range: "11:00 - 13:00", startHour: 11 },
    { name: "Mùi", range: "13:00 - 15:00", startHour: 13 },
    { name: "Thân", range: "15:00 - 17:00", startHour: 15 },
    { name: "Dậu", range: "17:00 - 19:00", startHour: 17 },
    { name: "Tuất", range: "19:00 - 21:00", startHour: 19 },
    { name: "Hợi", range: "21:00 - 23:00", startHour: 21 }
  ]

  /**
   * Giờ Hoàng Đạo (Good Hours) theo ngày
   * Mỗi ngày có 6 giờ tốt và 6 giờ xấu
   * Dựa theo Can của ngày
   */
  static GOOD_HOURS_BY_DAY_CAN = {
    0: [0, 2, 4, 6, 8, 10], // Ngày Giáp: Tý, Dần, Thìn, Ngọ, Thân, Tuất
    1: [1, 3, 5, 7, 9, 11], // Ngày Ất: Sửu, Mão, Tỵ, Mùi, Dậu, Hợi
    2: [0, 2, 4, 6, 8, 10], // Ngày Bính: Tý, Dần, Thìn, Ngọ, Thân, Tuất
    3: [1, 3, 5, 7, 9, 11], // Ngày Đinh: Sửu, Mão, Tỵ, Mùi, Dậu, Hợi
    4: [0, 2, 4, 6, 8, 10], // Ngày Mậu: Tý, Dần, Thìn, Ngọ, Thân, Tuất
    5: [1, 3, 5, 7, 9, 11], // Ngày Kỷ: Sửu, Mão, Tỵ, Mùi, Dậu, Hợi
    6: [0, 2, 4, 6, 8, 10], // Ngày Canh: Tý, Dần, Thìn, Ngọ, Thân, Tuất
    7: [1, 3, 5, 7, 9, 11], // Ngày Tân: Sửu, Mão, Tỵ, Mùi, Dậu, Hợi
    8: [0, 2, 4, 6, 8, 10], // Ngày Nhâm: Tý, Dần, Thìn, Ngọ, Thân, Tuất
    9: [1, 3, 5, 7, 9, 11] // Ngày Quý: Sửu, Mão, Tỵ, Mùi, Dậu, Hợi
  }

  /**
   * Hàm INT: lấy số nguyên lớn nhất không vượt quá x
   */
  static INT(x: number) {
    return Math.floor(x)
  }

  /**
   * Chuyển đổi ngày/tháng/năm thành số ngày Julius
   */
  static jdFromDate(dd: number, mm: number, yyyy: number) {
    const a = this.INT((14 - mm) / 12)
    const y = yyyy + 4800 - a
    const m = mm + 12 * a - 3

    let jd =
      dd +
      this.INT((153 * m + 2) / 5) +
      365 * y +
      this.INT(y / 4) -
      this.INT(y / 100) +
      this.INT(y / 400) -
      32045

    if (jd < 2299161) {
      jd = dd + this.INT((153 * m + 2) / 5) + 365 * y + this.INT(y / 4) - 32083
    }

    return jd
  }

  /**
   * Chuyển đổi số ngày Julius thành ngày/tháng/năm
   * @return [day, month, year]
   */
  static jdToDate(jd: number): [number, number, number] {
    let a: number, b: number, c: number

    if (jd > 2299160) {
      a = jd + 32044
      b = this.INT((4 * a + 3) / 146097)
      c = a - this.INT((b * 146097) / 4)
    } else {
      b = 0
      c = jd + 32082
    }

    const d = this.INT((4 * c + 3) / 1461)
    const e = c - this.INT((1461 * d) / 4)
    const m = this.INT((5 * e + 2) / 153)

    const day = e - this.INT((153 * m + 2) / 5) + 1
    const month = m + 3 - 12 * this.INT(m / 10)
    const year = b * 100 + d - 4800 + this.INT(m / 10)

    return [day, month, year]
  }

  /**
   * Tính ngày Sóc (New Moon) thứ k
   */
  static getNewMoonDay(k: number, timeZone = this.TIMEZONE) {
    const T = k / 1236.85
    const T2 = T * T
    const T3 = T2 * T
    const dr = Math.PI / 180

    let Jd1 =
      2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3
    Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr)

    const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3
    const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3
    const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3

    let C1 =
      (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M)
    C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr)
    C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr)
    C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr))
    C1 =
      C1 -
      0.0074 * Math.sin(dr * (M - Mpr)) +
      0.0004 * Math.sin(dr * (2 * F + M))
    C1 =
      C1 -
      0.0004 * Math.sin(dr * (2 * F - M)) -
      0.0006 * Math.sin(dr * (2 * F + Mpr))
    C1 =
      C1 +
      0.001 * Math.sin(dr * (2 * F - Mpr)) +
      0.0005 * Math.sin(dr * (2 * Mpr + M))

    let deltat
    if (T < -11) {
      deltat =
        0.001 +
        0.000839 * T +
        0.0002261 * T2 -
        0.00000845 * T3 -
        0.000000081 * T * T3
    } else {
      deltat = -0.000278 + 0.000265 * T + 0.000262 * T2
    }

    const JdNew = Jd1 + C1 - deltat
    return this.INT(JdNew + 0.5 + timeZone / 24)
  }

  /**
   * Tính tọa độ mặt trời (Sun Longitude)
   */
  static getSunLongitude(jdn: number, timeZone = this.TIMEZONE) {
    const T = (jdn - 2451545.5 - timeZone / 24) / 36525
    const T2 = T * T
    const dr = Math.PI / 180

    const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2
    const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2

    let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M)
    DL =
      DL +
      (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) +
      0.00029 * Math.sin(dr * 3 * M)

    let L = L0 + DL
    L = L * dr
    L = L - Math.PI * 2 * this.INT(L / (Math.PI * 2))

    return this.INT((L / Math.PI) * 6)
  }

  /**
   * Tìm ngày bắt đầu tháng 11 âm lịch
   */
  static getLunarMonth11(yy: number, timeZone = this.TIMEZONE) {
    const off = this.jdFromDate(31, 12, yy) - 2415021
    const k = this.INT(off / 29.530588853)
    let nm = this.getNewMoonDay(k, timeZone)
    const sunLong = this.getSunLongitude(nm, timeZone)

    if (sunLong >= 9) {
      nm = this.getNewMoonDay(k - 1, timeZone)
    }

    return nm
  }

  /**
   * Xác định vị trí tháng nhuận
   */
  static getLeapMonthOffset(a11: number, timeZone = this.TIMEZONE) {
    const k = this.INT((a11 - 2415021.076998695) / 29.530588853 + 0.5)
    let last = 0
    let i = 1

    let arc = this.getSunLongitude(
      this.getNewMoonDay(k + i, timeZone),
      timeZone
    )

    do {
      last = arc
      i++
      arc = this.getSunLongitude(this.getNewMoonDay(k + i, timeZone), timeZone)
    } while (arc !== last && i < 14)

    return i - 1
  }

  /**
   * Chuyển đổi dương lịch sang âm lịch
   */
  static convertSolar2Lunar(
    dd: number,
    mm: number,
    yyyy: number,
    timeZone = this.TIMEZONE
  ): { day: number; month: number; year: number; isLeap: boolean } {
    const dayNumber = this.jdFromDate(dd, mm, yyyy)
    const k = this.INT((dayNumber - 2415021.076998695) / 29.530588853)
    let monthStart = this.getNewMoonDay(k + 1, timeZone)

    if (monthStart > dayNumber) {
      monthStart = this.getNewMoonDay(k, timeZone)
    }

    let a11 = this.getLunarMonth11(yyyy, timeZone)
    let b11 = a11
    let lunarYear

    if (a11 >= monthStart) {
      lunarYear = yyyy
      a11 = this.getLunarMonth11(yyyy - 1, timeZone)
    } else {
      lunarYear = yyyy + 1
      b11 = this.getLunarMonth11(yyyy + 1, timeZone)
    }

    const lunarDay = dayNumber - monthStart + 1
    const diff = this.INT((monthStart - a11) / 29)
    let lunarLeap = false
    let lunarMonth = diff + 11

    if (b11 - a11 > 365) {
      const leapMonthDiff = this.getLeapMonthOffset(a11, timeZone)
      if (diff >= leapMonthDiff) {
        lunarMonth = diff + 10
        if (diff === leapMonthDiff) {
          lunarLeap = true
        }
      }
    }

    if (lunarMonth > 12) {
      lunarMonth = lunarMonth - 12
    }

    if (lunarMonth >= 11 && diff < 4) {
      lunarYear -= 1
    }

    return {
      day: lunarDay,
      month: lunarMonth,
      year: lunarYear,
      isLeap: lunarLeap
    }
  }

  /**
   * Chuyển đổi âm lịch sang dương lịch
   */
  static convertLunar2Solar(
    lunarDay: number,
    lunarMonth: number,
    lunarYear: number,
    lunarLeap = false,
    timeZone = this.TIMEZONE
  ) {
    let a11: number, b11: number

    if (lunarMonth < 11) {
      a11 = this.getLunarMonth11(lunarYear - 1, timeZone)
      b11 = this.getLunarMonth11(lunarYear, timeZone)
    } else {
      a11 = this.getLunarMonth11(lunarYear, timeZone)
      b11 = this.getLunarMonth11(lunarYear + 1, timeZone)
    }

    let off = lunarMonth - 11
    if (off < 0) {
      off += 12
    }

    if (b11 - a11 > 365) {
      const leapOff = this.getLeapMonthOffset(a11, timeZone)
      let leapMonth = leapOff - 2
      if (leapMonth < 0) {
        leapMonth += 12
      }

      if (lunarLeap && lunarMonth !== leapMonth) {
        return null
      } else if (lunarLeap || off >= leapOff) {
        off += 1
      }
    }

    const k = this.INT(0.5 + (a11 - 2415021.076998695) / 29.530588853)
    const monthStart = this.getNewMoonDay(k + off, timeZone)

    const [day, month, year] = this.jdToDate(monthStart + lunarDay - 1)

    return { day, month, year }
  }

  /**
   * Tính Can Chi
   */
  static getYearCan(year: number) {
    return this.CAN[(year + 6) % 10]
  }

  static getYearChi(year: number) {
    return this.CHI[(year + 8) % 12]
  }

  static getYearCanChi(year: number) {
    return `${this.getYearCan(year)} ${this.getYearChi(year)}`
  }

  static getDayCan(jd: number) {
    return this.CAN[(jd + 9) % 10]
  }

  static getDayChi(jd: number) {
    return this.CHI[(jd + 1) % 12]
  }

  static getDayCanChi(jd: number) {
    return `${this.getDayCan(jd)} ${this.getDayChi(jd)}`
  }

  static getMonthCan(month: number, year: number) {
    return this.CAN[(year * 12 + month + 3) % 10]
  }

  static getMonthChi(month: number) {
    return this.CHI[(month + 1) % 12]
  }

  static getMonthCanChi(month: number, year: number) {
    return `${this.getMonthCan(month, year)} ${this.getMonthChi(month)}`
  }

  static getDayOfWeek(jd: number) {
    return (jd + 1) % 7
  }

  static getDayOfWeekName(jd: number) {
    return this.DAY_OF_WEEK[this.getDayOfWeek(jd)]
  }

  /**
   * Lấy thông tin đầy đủ
   */
  static getFullInfo(dd: number, mm: number, yyyy: number): FullInfoType {
    const lunar = this.convertSolar2Lunar(dd, mm, yyyy)
    const jd = this.jdFromDate(dd, mm, yyyy)

    let monthName = this.LUNAR_MONTHS[lunar.month]
    if (lunar.isLeap) {
      monthName = `${monthName} (Nhuận)`
    }

    return {
      solar: {
        day: dd,
        month: mm,
        year: yyyy,
        dayOfWeek: this.getDayOfWeek(jd),
        dayOfWeekName: this.getDayOfWeekName(jd),
      },
      lunar: {
        day: lunar.day,
        month: lunar.month,
        year: lunar.year,
        isLeap: lunar.isLeap,
        monthName: monthName,
        dayCanChi: this.getDayCanChi(jd),
        monthCanChi: this.getMonthCanChi(lunar.month, lunar.year),
        yearCanChi: this.getYearCanChi(lunar.year)
      },
      solarTerm: this.getSolarTermInfo(dd, mm, yyyy),
      hour: this.getHourInfo(dd, mm, yyyy, new Date().getHours()),
      hours: this.getHoursInfo(dd, mm, yyyy),
      jd: jd
    }
  }

  /**
   * Format ngày âm lịch
   */
  static formatLunarDate(info: FullInfoType) {
    const { lunar, solar } = info

    return (
      `${solar.dayOfWeekName}, ngày ${String(solar.day).padStart(2, "0")}/${String(solar.month).padStart(2, "0")}/${solar.year}\n` +
      `Âm lịch: ngày ${lunar.day} tháng ${lunar.monthName} năm ${lunar.yearCanChi}\n` +
      `Ngày ${lunar.dayCanChi}, tháng ${lunar.monthCanChi}`
    )
  }

  /**
   * Chuyển từ Date object
   */
  static convertDateToLunar(date: Date) {
    return this.convertSolar2Lunar(
      date.getDate(),
      date.getMonth() + 1,
      date.getFullYear()
    )
  }

  /**
   * Lấy thông tin hôm nay
   */
  static getToday() {
    const today = new Date()
    return this.getFullInfo(
      today.getDate(),
      today.getMonth() + 1,
      today.getFullYear()
    )
  }

  /**
   * Tính chính xác độ hoàng đạo của mặt trời (0-360 độ)
   *
   * @param {number} jdn - Số ngày Julius
   * @param {number} timeZone - Múi giờ
   * @returns {number} Độ hoàng đạo (0-360)
   */
  static getSunLongitudeExact(
    jdn: number,
    timeZone: number = this.TIMEZONE
  ): number {
    const T = (jdn - 2451545.5 - timeZone / 24) / 36525
    const T2 = T * T
    const dr = Math.PI / 180

    const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2
    const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2

    let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M)
    DL =
      DL +
      (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) +
      0.00029 * Math.sin(dr * 3 * M)

    let L = L0 + DL
    L = L - 360 * this.INT(L / 360)

    return L
  }

  /**
   * Tính tiết khí từ độ hoàng đạo
   *
   * @param {number} jdn - Số ngày Julius
   * @param {number} timeZone - Múi giờ
   * @returns {number} Index của tiết khí (0-23)
   */
  static getSolarTerm(jdn: number, timeZone: number = this.TIMEZONE): number {
    const longitude = this.getSunLongitudeExact(jdn, timeZone)
    // Mỗi tiết khí cách nhau 15 độ, bắt đầu từ Xuân phân (0 độ)
    return this.INT(longitude / 15)
  }

  /**
   * Lấy thông tin chi tiết về tiết khí tại một ngày
   *
   * @param {number} dd - Ngày
   * @param {number} mm - Tháng
   * @param {number} yyyy - Năm
   * @param {number} timeZone - Múi giờ
   * @returns {SolarTermInfoType} Thông tin tiết khí
   */
  static getSolarTermInfo(
    dd: number,
    mm: number,
    yyyy: number,
    timeZone: number = this.TIMEZONE
  ): SolarTermInfoType {
    const jd = this.jdFromDate(dd, mm, yyyy)
    const termIndex = this.getSolarTerm(jd, timeZone)
    const longitude = this.getSunLongitudeExact(jd, timeZone)

    return {
      index: termIndex,
      name: this.SOLAR_TERMS[termIndex],
      longitude: longitude.toFixed(2),
      isMajor: termIndex % 2 === 0 // Trung khí (chẵn), Tiết khí (lẻ)
    }
  }

  /**
   * Tìm ngày bắt đầu của một tiết khí trong năm
   *
   * @param {number} termIndex - Index tiết khí (0-23)
   * @param {number} year - Năm
   * @param {number} timeZone - Múi giờ
   * @returns {SolarTermDateType|null} {day, month, year}
   */
  static getSolarTermDate(
    termIndex: number,
    year: number,
    timeZone: number = this.TIMEZONE
  ): SolarTermDateType | null {
    // Ước lượng ngày bắt đầu dựa trên tiết khí
    const approxMonth = this.INT(termIndex / 2) + 3
    let month = approxMonth > 12 ? approxMonth - 12 : approxMonth
    let searchYear = approxMonth > 12 ? year + 1 : year

    // Tìm kiếm trong khoảng 45 ngày
    for (let day = 1; day <= 31; day++) {
      try {
        const jd = this.jdFromDate(day, month, searchYear)
        const term = this.getSolarTerm(jd, timeZone)

        if (term === termIndex) {
          // Kiểm tra xem đây có phải ngày đầu tiên của tiết khí không
          const prevJd = jd - 1
          const prevTerm = this.getSolarTerm(prevJd, timeZone)

          if (prevTerm !== termIndex) {
            return { day, month, year: searchYear }
          }
        }
      } catch (e) {
        // Ngày không hợp lệ, chuyển sang tháng sau
        if (day > 28) {
          day = 0
          month++
          if (month > 12) {
            month = 1
            searchYear++
          }
        }
      }
    }

    return null
  }

  /**
   * Lấy index giờ từ giờ trong ngày (0-23)
   *
   * @param {number} hour - Giờ (0-23)
   * @returns {number} Index giờ hoàng đạo (0-11)
   */
  static getHourIndex(hour: number): number {
    if (hour === 23) return 0 // Giờ Tý
    return this.INT((hour + 1) / 2)
  }

  /**
   * Lấy Chi của giờ
   *
   * @param {number} hour - Giờ (0-23)
   * @returns {string} Tên Chi
   */
  static getHourChi(hour: number): string {
    const hourIndex = this.getHourIndex(hour)
    return this.CHI[hourIndex]
  }

  /**
   * Tính Can của giờ dựa vào Can của ngày
   * Công thức: Can giờ = (Can ngày * 2 + giờ index) % 10
   *
   * @param {number} hour - Giờ (0-23)
   * @param {number} jd - Số ngày Julius
   * @returns {string} Tên Can
   */
  static getHourCan(hour: number, jd: number): string {
    const dayCan = (jd + 9) % 10
    const hourIndex = this.getHourIndex(hour)
    const canIndex = (dayCan * 2 + hourIndex) % 10
    return this.CAN[canIndex]
  }

  /**
   * Lấy Can Chi của giờ
   *
   * @param {number} hour - Giờ (0-23)
   * @param {number} jd - Số ngày Julius
   * @returns {string} Can Chi của giờ
   */
  static getHourCanChi(hour: number, jd: number): string {
    return `${this.getHourCan(hour, jd)} ${this.getHourChi(hour)}`
  }

  /**
   * Kiểm tra giờ có phải giờ hoàng đạo (giờ tốt) không
   *
   * @param {number} hour - Giờ (0-23)
   * @param {number} jd - Số ngày Julius
   * @returns {boolean} True nếu là giờ tốt
   */
  static isGoodHour(hour: number, jd: number): boolean {
    const dayCan = (jd + 9) % 10
    const hourIndex = this.getHourIndex(hour)
    const goodHours = this.GOOD_HOURS_BY_DAY_CAN[dayCan]
    return goodHours.includes(hourIndex)
  }

  /**
   * Lấy danh sách các giờ hoàng đạo (giờ tốt) trong ngày
   *
   * @param {number} jd - Số ngày Julius
   * @returns {Array} Danh sách giờ tốt
   */
  static getGoodHours(jd: number): Array<any> {
    const dayCan = (jd + 9) % 10
    const goodHourIndexes = this.GOOD_HOURS_BY_DAY_CAN[dayCan]

    return goodHourIndexes.map((index) => ({
      index: index,
      name: this.CHI[index],
      range: this.HOURS[index].range,
      canChi: this.getHourCanChi(this.HOURS[index].startHour, jd)
    }))
  }

  static getHourInfo(dd: number, mm: number, yyyy: number, hour: number): HourInfoType {
    const jd = this.jdFromDate(dd, mm, yyyy)
    const isGood = this.isGoodHour(hour, jd)
    const canChi = this.getHourCanChi(hour, jd)
    const hourIndex = this.getHourIndex(hour)
    const hourData = this.HOURS[hourIndex]
    return {
      index: hourIndex,
      name: hourData.name,
      range: hourData.range,
      canChi: canChi,
      isGood: isGood,
      type: isGood ? "Hoàng đạo" : "Hắc đạo"
    }
  }

  /**
   * Lấy thông tin chi tiết về tất cả 12 giờ trong ngày
   *
   * @param {number} dd - Ngày
   * @param {number} mm - Tháng
   * @param {number} yyyy - Năm
   * @returns {Array<HourInfoType>} Danh sách thông tin 12 giờ
   */
  static getHoursInfo(
    dd: number,
    mm: number,
    yyyy: number
  ): Array<HourInfoType> {
    const jd = this.jdFromDate(dd, mm, yyyy)

    return this.HOURS.map((hour, index) => {
      const isGood = this.isGoodHour(hour.startHour, jd)
      const canChi = this.getHourCanChi(hour.startHour, jd)

      return {
        index: index,
        name: hour.name,
        range: hour.range,
        canChi: canChi,
        isGood: isGood,
        type: isGood ? "Hoàng đạo" : "Hắc đạo"
      }
    })
  }
}

export default LunarCalendar
