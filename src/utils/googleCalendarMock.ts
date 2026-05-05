import dayjs from "dayjs";

export type CalendarEvent = {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string; // ISO 8601
    date?: string; // YYYY-MM-DD for all-day events
  };
  end: {
    dateTime?: string;
    date?: string;
  };
};

/**
 * Tạo dữ liệu giả lập cho Google Calendar
 * @param year Năm
 * @param month Tháng (0-11)
 */
export const getMockEvents = (year: number, month: number): CalendarEvent[] => {
  const events: CalendarEvent[] = [];

  // Sự kiện cả ngày vào mùng 10
  events.push({
    id: `mock-1-${year}-${month}`,
    summary: "Sinh nhật sếp",
    start: { date: dayjs(new Date(year, month, 10)).format("YYYY-MM-DD") },
    end: { date: dayjs(new Date(year, month, 11)).format("YYYY-MM-DD") }
  });

  // Sự kiện có giờ giấc vào ngày 15
  const day15 = dayjs(new Date(year, month, 15));
  events.push({
    id: `mock-2-${year}-${month}`,
    summary: "Họp Weekly Sync",
    start: { dateTime: day15.hour(14).minute(0).toISOString() },
    end: { dateTime: day15.hour(15).minute(30).toISOString() }
  });

  events.push({
    id: `mock-3-${year}-${month}`,
    summary: "Phỏng vấn ứng viên",
    start: { dateTime: day15.hour(9).minute(0).toISOString() },
    end: { dateTime: day15.hour(10).minute(0).toISOString() }
  });

  // Sự kiện cho ngày hôm nay (nếu xem tháng hiện tại)
  const today = dayjs();
  if (today.month() === month && today.year() === year) {
    events.push({
      id: `mock-4-${year}-${month}`,
      summary: "Mua sắm cuối tuần",
      start: { dateTime: today.hour(18).minute(0).toISOString() },
      end: { dateTime: today.hour(20).minute(0).toISOString() }
    });
  }

  return events;
}
