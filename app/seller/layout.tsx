import SideBar from '@/components/seller/Sidebar'
/* eslint-disable @typescript-eslint/no-explicit-any*/


function layout({children}:{children:any}) {
  return (
    <div className='flex w-full overflow-hidden'>
      <SideBar />
    {children}
    </div>
  )
}

export default layout
