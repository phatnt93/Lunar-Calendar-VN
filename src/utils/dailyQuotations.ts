import DailyQuotations from "assets/daily_quotations.json";
import dayjs from "dayjs";
import dayOfYear from 'dayjs/plugin/dayOfYear';
dayjs.extend(dayOfYear);

export type DailyQuotationType = {
    content_vn: string
    content_en: string
    content_cn: string
    author: string
};

export const getDailyQuote = (date: dayjs.Dayjs): DailyQuotationType => {
    const dayOfYear = date.dayOfYear();
    return DailyQuotations[dayOfYear] || null;
}