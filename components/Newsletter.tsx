import React from 'react'

function Newsletter() {
  return (
    <div className='pt-32 pb-56'>
      <div className='flex flex-col items-center gap-7'>
        <div className='text-center flex flex-col gap-2'>
            <h2 className='font-semibold text-3xl text-foreground'>Subscribe now & get 20% off</h2>
            <p className='text-foreground'>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
        </div>

        <div className='flex max max-w-2xl w-full mx-auto'>
            <input 
            type="text" 
            className='p-3 outline-none flex-1 border rounded-l-sm'
            placeholder='Enter your email ID'
            />
            <button className='cursor-pointer bg-orange-600 text-white px-8 lg:px-15 py-4 rounded-md rounded-l-none font-semibold'>Subscribe</button>
        </div>
      </div>
    </div>
  )
}

export default Newsletter
