import { ColorArray } from '@/constants/color'
import style from './style.module.css'
import { ProductVariantWithRelation } from '@/utils/supabase/type'
import { Dispatch, FC, SetStateAction } from 'react'

type Props = {
  variants: ProductVariantWithRelation[]
  currentColor: string
  setCurrentColor: Dispatch<SetStateAction<string | undefined>>
}

export const ProductColorSelector: FC<Props> = ({ variants, currentColor, setCurrentColor }) => {
  return (
    <div className={style.body}>
      {variants.map((v) => {
        const colorData = ColorArray.find((c) => c.value === v.color)
        return (
          <button
            key={v.id}
            onClick={() => setCurrentColor(colorData?.value)}
            className={`${style.button} ${currentColor === colorData?.value && style.active}`}
            style={{ backgroundColor: `${colorData?.hex}` }}
          />
        )
      })}
    </div>
  )
}
