import {
  forwardRef,
  memo,
} from 'react'
import {
  RiSendPlane2Fill,
} from '@remixicon/react'
import type {
  EnableType,
} from '../../types'
import type { Theme } from '../../embedded-chatbot/theme/theme-context'
import Button from '@/app/components/base/button'
import { FileUploaderInChatInput } from '@/app/components/base/file-uploader'
import type { FileUpload } from '@/app/components/base/features/types'
import cn from '@/utils/classnames'

type OperationProps = {
  fileConfig?: FileUpload
  speechToTextConfig?: EnableType
  onShowVoiceInput?: () => void
  onSend: () => void
  theme?: Theme | null
}
const Operation = forwardRef<HTMLDivElement, OperationProps>(({
  fileConfig,
  speechToTextConfig,
  onShowVoiceInput,
  onSend,
  theme,
}, ref) => {
  return (
    <div
      className={cn(
        'shrink-0 flex items-center justify-end',
      )}
    >
      <div
        className='flex items-center pl-1'
        ref={ref}
      >

        <div className='flex items-center space-x-1'>
          {fileConfig?.enabled && <FileUploaderInChatInput fileConfig={fileConfig} />}
        </div>
        <Button
          className='px-2 w-9 !min-h-[34px]'
          variant='primary'
          onClick={onSend}
          style={
            theme
              ? {
                backgroundColor: theme.primaryColor,
              }
              : {}
          }
        >
          <RiSendPlane2Fill className='w-5 h-5' />
        </Button>
      </div>
    </div>
  )
})
Operation.displayName = 'Operation'

export default memo(Operation)
