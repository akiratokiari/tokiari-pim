'use client' // Error components must be Client Components

import { Button } from '@/components/button'
import { WHOLESALE_ROUTE } from '@/constants/route'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({ errorMessage }: { errorMessage?: string }) {
  useEffect(() => {
    if (errorMessage) console.error(errorMessage)
  }, [errorMessage])

  return (
    <div>
      <div style={{ width: '100%', textAlign: 'center', marginBottom: '20px', marginTop: '20px' }}>
        予期せぬエラーが発生しました
      </div>
      <Link href={WHOLESALE_ROUTE}>
        <Button>トップに戻る</Button>
      </Link>
    </div>
  )
}
