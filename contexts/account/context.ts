import { UsersRowType } from '@/utils/supabase/type'
import { createContext } from 'react'

type Context = {
  account?: UsersRowType
  refresh: () => void
}

export const AccountContext = createContext<Context>({
  account: undefined,
  refresh() {}
})
