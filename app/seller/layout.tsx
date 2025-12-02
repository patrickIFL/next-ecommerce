import SideBar from '@/components/seller/Sidebar'
/* eslint-disable @typescript-eslint/no-explicit-any*/


function layout({children}:{children:any}) {
  return (
    <div className='flex w-full'>
      <SideBar />
    {children}
    </div>
  )
}

export default layout
