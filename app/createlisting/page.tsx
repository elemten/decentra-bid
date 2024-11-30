'use client'
import { Button, DatePicker, Input } from '@nextui-org/react';
import React from 'react';
import { pinata } from "@/utils/config";
import { useActiveAccount, useSendAndConfirmTransaction } from 'thirdweb/react';
import { prepareContractCall, PreparedTransaction, toUnits } from 'thirdweb';
import { getBidersContractByAddress, getErc721ContractByAddress } from '@/utils/contract';
import { biddersContractAddress } from '@/utils/contractsAddress';
import { SelectorIcon } from '@/utils/SelectorIcon';
import toast from 'react-hot-toast';
import {now, getLocalTimeZone} from "@internationalized/date";
import { approve } from 'thirdweb/extensions/erc721';
import {ethers} from 'ethers';
import { useRouter } from 'next/navigation';


function CreateListingPage() {
   const router=useRouter();
    const [auctionImage,setAuctionImage]=React.useState<File>()
    const [uploading, setUploading] = React.useState(false);
    const {mutateAsync:sendCreateListingTransaction,isPending:listingPending}= useSendAndConfirmTransaction()
    const [nftContractAddress,setNftContractAddress]=React.useState('')
    const [tokenId,setTokenId]=React.useState('')
    const [auctionName,setAuctionName]=React.useState('')
    const [auctionDescription,setAuctionDescription]=React.useState('')
    const [startingBid,setStartingBid]=React.useState('')
    const [endDate,setEndDate]=React.useState('')
    const activeAcount = useActiveAccount()


    const uploadImage = async () => {
      setUploading(true);
        if (!auctionImage) {
          alert("No file selected");
          return;
        }
        try {
          const keyRequest = await fetch("/api/key");
			const keyData = await keyRequest.json();
			const upload = await pinata.upload.file(auctionImage).key(keyData.JWT);
			const ipfsUrl = await pinata.gateways.convert(upload.IpfsHash)
         setUploading(false);
          return ipfsUrl
        } catch (e) {
          console.log(e);
          setUploading(false);
          toast.error('Error uploading image')
        }
      };

      const createAuction = async () => {

        try{
          const imageUrl = await uploadImage();
          if (!imageUrl) {
              toast.error('Error uploading image')
            return;
          }
          const approvalTransaction = prepareContractCall({
            contract:getErc721ContractByAddress(nftContractAddress),
            method:'approve',
            params:[biddersContractAddress,ethers.toBigInt(tokenId)]
          })
          await sendCreateListingTransaction(approvalTransaction as PreparedTransaction,{
              onSuccess:()=>toast.success('NFT Approved'),
              onError:()=>toast.error('Error approving')
          })
  
          const creatAuctionTransaction = prepareContractCall({
              contract: getBidersContractByAddress(biddersContractAddress),
              method:'createAuction',
              params:[
                  nftContractAddress,
                  ethers.toBigInt(tokenId),
                  auctionName,
                  auctionDescription,
                  imageUrl,
                  toUnits(startingBid,18),
                  ethers.toBigInt(endDate)
              ]
          })
          await sendCreateListingTransaction(creatAuctionTransaction as PreparedTransaction,{
              onSuccess:()=>{toast.success('Auction created')
                router.push("/")
              }
              ,
              onError:()=>toast.error('Error creating auction')
          })
          
        }
        catch(e){
            console.log(e)
            toast.error('Error creating auction')
        }
        


      }

     
     
      


  return (
    <div className='flex flex-col mt-20 justify-center w-full'>
        <h1 className=' text-3xl font-bold  text-primary-200'>Create Auction</h1>
        <div className='flex flex-col mt-10 w-1/2 gap-5'>
            
            <Input
            color='primary'
            placeholder='NFT Contract Address'
            title='NFT Contract Address'
            label={'NFT Contract Address'}
            onChange={(e)=>setNftContractAddress(e.target.value)}
            />

            <Input
            color='primary'
            placeholder='Token ID'
            title='Token ID'
            label={'Token ID'}
            onChange={(e)=>setTokenId(e.target.value)}
            />

            <Input
            color='primary' 
            placeholder='Auction Name'
            title='Auction Name'
            label={'Auction Name'}
            onChange={(e)=>setAuctionName(e.target.value)}
            />
            <Input
            color='primary'
            placeholder='Auction Description'
            title='Auction Description'
            label={'Auction Description'}
            onChange={(e)=>setAuctionDescription(e.target.value)}
            />
            <Input
            color='primary'
            type='file'
            title='Auction Image'
            label={'Auction Image'}
            onChange={(e)=>setAuctionImage(e?.target?.files && e.target.files[0] ? e.target.files[0] : undefined)}
            />
            <Input
            color='primary'
            type='number'
            title='Starting Bid'
            label={'Starting Bid'}
            onChange={(e)=>setStartingBid(e.target.value)}
            />
           <DatePicker 
           color='primary'
        label="Birth date"
        selectorIcon={<SelectorIcon />}
        hideTimeZone
        showMonthAndYearPickers
        defaultValue={now(getLocalTimeZone())}
        onChange={(value)=>{
            setEndDate(String(Math.floor(new Date(value.toAbsoluteString()).getTime()/1000)))}}
      />



            <Button 
            color='primary'
            isDisabled = {!activeAcount?.address}
            isLoading={uploading || listingPending}
            onClick={async ()=>await createAuction()}
            > Create Auction</Button>

            

        </div>
    </div>
  )
}

export default CreateListingPage