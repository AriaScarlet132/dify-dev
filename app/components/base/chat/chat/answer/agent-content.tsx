import type { FC } from 'react'
import { memo } from 'react'
import type {
  ChatItem,
} from '../../types'
import { Markdown } from '@/app/components/base/markdown'
import { FileList } from '@/app/components/base/file-uploader'
import { getProcessedFilesFromResponse } from '@/app/components/base/file-uploader/utils'

type AgentContentProps = {
  item: ChatItem
  responding?: boolean
}
const AgentContent: FC<AgentContentProps> = ({
  item,
  responding,
}) => {
  const {
    annotation,
    agent_thoughts,
  } = item

  if (annotation?.logAnnotation)
    return <Markdown content={annotation?.logAnnotation.content || ''} />

  return (
    <div>
      {agent_thoughts?.map((thought, index) => (
        <div key={index} className='px-2 py-1'>
          {thought.thought && (
            <Markdown content={thought.thought} />
          )}
          {/* {item.tool} */}
          {/* perhaps not use tool */}
          {/* todo-mark 这个代码块就是agent的思考或者工具调用过程 */}
          {/* {!!thought.tool && (
            <Thought
              thought={thought}
              isFinished={!!thought.observation || !responding}
            />
          )} */}

          {
            !!thought.message_files?.length && (
              <FileList
                files={getProcessedFilesFromResponse(thought.message_files.map((item: any) => ({ ...item, related_id: item.id })))}
                showDeleteAction={false}
                showDownloadAction={true}
                canPreview={true}
              />
            )
          }
        </div>
      ))}
    </div>
  )
}

export default memo(AgentContent)
