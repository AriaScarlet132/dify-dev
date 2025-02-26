// GENERATE BY script
// DON NOT EDIT IT MANUALLY

import * as React from 'react'
// import data from './User.json'
// import IconBase from '@/app/components/base/icons/IconBase'
import type { IconBaseProps, IconData } from '@/app/components/base/icons/IconBase'

import imageUrl from './User.png'

// const Icon = React.forwardRef<React.MutableRefObject<SVGElement>, Omit<IconBaseProps, 'data'>>((
//   props,
//   ref,
// ) => <IconBase {...props} ref={ref} data={data as IconData} />)

// Icon.displayName = 'User'

// export default Icon


// 使用 React.forwardRef 创建一个 img 组件
const Icon = React.forwardRef<HTMLImageElement, Omit<IconBaseProps, 'data'>>((props, ref) => (
  <img
    src={imageUrl.src} // 使用导入的图片路径
    className="w-full h-full rounded-full" 
    alt="User" // 添加 alt 属性，描述图片内容
  />
));

Icon.displayName = 'User';

export default Icon;
