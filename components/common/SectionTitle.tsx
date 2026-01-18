import React from 'react'

function SectionTitle({title}: {title:string}) {
  return (
    <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">{title}</p>
        <div className="w-28 h-0.5 bg-primary my-5" />
      </div>
  )
}

export default SectionTitle