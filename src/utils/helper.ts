
import dayjs from "dayjs";
dayjs.extend(require("dayjs/plugin/customParseFormat"))

/**
 * Lấy danh sách các ngày trong tháng để hiển thị trên lịch. Bao gồm cả các ngày từ tháng trước và tháng sau để lấp đầy các ô trống.
 * @param year Năm dương lịch
 * @param month Tháng dương lịch (0-11) 
 */
export const getDatesForCalendar = (year: number, month: number): {day: number, month: number, year: number}[] => {
    const dates: {day: number, month: number, year: number}[] = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    let startDayOfWeek = firstDayOfMonth.getDay(); // 0 (Chủ nhật) - 6 (Thứ bảy)
    
    // Chuyển đổi để Thứ 2 là ngày đầu tuần (0 = Thứ 2, 6 = Chủ nhật)
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
    
    const daysInMonth = lastDayOfMonth.getDate();
    // Ngày từ tháng trước
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
        dates.push({ day: prevMonthLastDay - i, month: (month - 1 + 12) % 12, year: month === 0 ? year - 1 : year });
    }
    // Ngày trong tháng hiện tại
    for (let day = 1; day <= daysInMonth; day++) {
        dates.push({ day, month, year });
    }
    // Ngày từ tháng sau
    const totalCells = 42; // 6 hàng x 7 cột
    const nextMonthDays = totalCells - dates.length;
    for (let day = 1; day <= nextMonthDays; day++) {
        dates.push({ day, month: (month + 1) % 12, year: month === 11 ? year + 1 : year });
    }
    return dates;
}

/**
 * 
 * @param dateStr Chuỗi ngày tháng
 * @param format Định dạng ngày tháng có thể nhận, ví dụ: ["DD/MM/YYYY", "D/M/YYYY", "DD/M/YYYY", "D/MM/YYYY"]
 * @returns 
 */
export const dateFromString = (dateStr: string, format: string[] = ["DD/MM/YYYY", "D/M/YYYY", "DD/M/YYYY", "D/MM/YYYY"]) => {
    return dayjs(dateStr, format)
}

export const validDateFormat = (dateStr: string, format: string[] = ["DD/MM/YYYY", "D/M/YYYY", "DD/M/YYYY", "D/MM/YYYY"]) => {
    return dayjs(dateStr, format).isValid()
}