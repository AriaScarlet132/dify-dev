'use client'

import type { FC } from 'react'
import { init } from 'emoji-mart'
import data from '@emoji-mart/data'
import classNames from '@/utils/classnames'
import type { AppIconType } from '@/types/app'
import icon_jy_1 from './jinyuan-1.jpg'

init({ data })

export type AnswerIconProps = {
  iconType?: AppIconType | null
  icon?: string | null
  background?: string | null
  imageUrl?: string | null
}

const AnswerIcon: FC<AnswerIconProps> = ({
  iconType,
  icon,
  background,
  imageUrl,
}) => {
  const wrapperClassName = classNames(
    'flex',
    'items-center',
    'justify-center',
    'w-full',
    'h-full',
    'rounded-full',
    'border-[0.5px]',
    'border-black/5',
    'text-xl',
  )
  const isValidImageIcon = iconType === 'image' && imageUrl
  return <div
    className={wrapperClassName}
    style={{ background: background || '#D5F5F6' }}
  >
    {true
      && <img src={icon_jy_1.src} className="w-full h-full rounded-full" alt="answer icon" />
    }
  </div>
}

export default AnswerIcon
