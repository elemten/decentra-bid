'use client';
import { useEffect, useState } from 'react';
import { readContract, toTokens } from 'thirdweb'
import { getBidersContractByAddress } from '@/utils/contract';
import { biddersContractAddress } from '@/utils/contractsAddress';
import AuctionCard from './AuctionCard';

function CurrentAuctions() {
    const [auctions, setAuctions] = useState<any[]>([])
    const [reload, setReload] = useState(false)
    const getAuctions = async () => {
        let i = 1
        const fetchedAuctions: any[] = [] 
        
        while (true) {
            const auction = await readContract({
                contract: getBidersContractByAddress(biddersContractAddress),
                method: 'auctions',
                params: [BigInt(i)]
            })
            if (Number(toTokens(auction[7], 18)) === 0) {
                break
            }
            
            fetchedAuctions.push(auction)
            i++
        }

        setAuctions(fetchedAuctions)
    }

    useEffect(() => {
        getAuctions()
    }, [reload])

    return ( 
        <div className='flex flex-col gap-10 w-full mt-10 justify-center'>
            <h1 className='font-bold text-2xl text-primary text-center'>Current Auctions</h1>
            <div className='flex flex-col w-full'>
                <div className='flex flex-wrap gap-10 justify-center align-middle items-center'>
                    {auctions.map((auction, index) => (
                        
                         <AuctionCard key={index} auction={auction} auctionId={index+1}/>
                       
                       
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CurrentAuctions
