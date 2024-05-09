import { APP_URL } from '@/constants/app'

export const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return APP_URL
  } else {
    return 'http://localhost:3000'
  }
}
