import React from 'react'
import { Link } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'

const ListingItem = ({listing}) => {
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
        <Link to={`/listing/${listing._id}`}>
        <img className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300' src={listing.imageUrls[0]} alt='listing-image'></img>
        <div className='p-3 flex flex-col gap-3 w-full'>
            <p className='text-lg font-semibold text-slate-700 truncate'>{listing.name}</p>
            <div className='flex items-center gap-1'>
                <MdLocationOn className='text-green-700 text-xl'/>
                <p className='text-sm text-gray-600 truncate'>{listing.address}</p>
            </div>
            <p className='line-clamp-2 text-sm text-gray-600'>{listing.description}</p>
            <p className='text-slate-500 mt-2 font-semibold'>
            ₹{" "}
                {listing.offer?listing.discountPrice.toLocaleString('en-US'):listing.regularPrice.toLocaleString('en-US')}{
                    listing.type==='rent'&&' /month'
                }
            </p>
            <div className='text-slate-700 flex gap-4'>
                <div className='font-bold text-sm'>
                    {listing.bedroom>1?`${listing.bedroom} beds`:`${listing.bedroom} bed`}
                </div>
                <div className='font-bold text-sm'>
                    {listing.bathroom>1?`${listing.bathroom} baths`:`${listing.bathroom} bath`}
                </div>
            </div>
        </div>
        </Link>
    </div>
  )
}

export default ListingItem