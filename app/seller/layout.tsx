import SideBar from '@/components/seller/Sidebar'
import React from 'react'

function layout({children}) {
  return (
    <div className='flex w-full overflow-hidden'>
      <SideBar />
    {children}
    </div>
  )
}

export default layout
