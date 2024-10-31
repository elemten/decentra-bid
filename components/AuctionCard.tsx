'use client'
import { Card, CardHeader, CardBody,Image, Snippet, Button } from '@nextui-org/react'
import Link from 'next/link'
import React from 'react'
import { toTokens, toUnits } from 'thirdweb'

function AuctionCard({auction,auctionId}:{auction:any,auctionId:number}) {
  return (
   <div className=' flex flex-row gap-5 bg-primary-300  rounded-lg  max-w-[500px] overflow-hidden'>
    <div>
      <Image src={auction[2]} className=' w-full rounded-none  h-full'
      classNames={{
        img:'min-h-[350px]'
      }}
      />
    </div>
    <div className='flex flex-col gap-2 text-primary-50 max-w-[250px] p-4 '>
        <h1 className=' text-primary text-xl font-bold'>{auction[0]}</h1>
        <p className=' text-primary-50 w-full max-h-[70px] overflow-scroll'>{auction[1]}</p>
        <div className='flex flex-col gap-2'>
        <h2 className=' text-primary font-bold'>Seller</h2>
        <Snippet codeString={auction[3]} color='primary'>{String(auction[3])?.slice(0,10)+'...'+String(auction[3])?.slice(39)}</Snippet>
        </div>
        <div className='flex flex-col gap-2 mb-2'>
        <h2 className='text-primary font-bold' >Starting Bid</h2>
        <p className=''>{toTokens(auction[4],18)} Matic</p>
        </div>
        <Button color='primary' variant='bordered' fullWidth as={Link}  href={`/details/${auctionId}`}>View More</Button>
       
        
    </div>
   </div>
  )
}

export default AuctionCard