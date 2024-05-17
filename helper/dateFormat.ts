import dayjs from "dayjs"
import isBetween from "dayjs/plugin/isBetween"

dayjs.extend(isBetween)

export const formatDate = (value: Date | dayjs.Dayjs | string) => {
  return dayjs(value).format("YYYY/MM/DD")
}

export const formatMonth = (value: Date | dayjs.Dayjs | string) => {
  return dayjs(value).format("YYYY年MM月")
}

export const formatYear = (value: Date | dayjs.Dayjs | string) => {
  return dayjs(value).format("YYYY年")
}

export const formatDateTime = (value: Date | dayjs.Dayjs | string) => {
  return dayjs(value).format("YYYY/MM/DD HH:mm")
}

export const toDate = (value: Date | dayjs.Dayjs | string) => {
  return dayjs(value).toDate()
}

export const isProgress = (startedAt: string | Date, endedAt: string | Date) => {
  return dayjs().isBetween(startedAt, endedAt)
}

export const nowToString = () => {
  return dayjs().format("YYYY-MM-DD HH:mm:ss")
}
