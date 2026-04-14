import React from 'react'
import BookingsContent from './BookingsContent'
import BookingsByAdmin from './BookingsByAdmin'
import { Separator } from '@/components/ui/separator'

const BookingContentLayout = () => {
  return (
    <div>
        <div>
            <BookingsContent />
        </div>

        <Separator className="my-10"/>

        <h1 className='text-center text-red-700 underline'>adming booking Management functionality will be implemented here. this is just a ui</h1>

        <div>
            <BookingsByAdmin />
        </div>
    </div>
  )
}

export default BookingContentLayout