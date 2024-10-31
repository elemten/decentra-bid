"use client";
import { getBidersContractByAddress } from "@/utils/contract";
import { biddersContractAddress } from "@/utils/contractsAddress";
import React, { useEffect } from "react";
import { Button, Image, Snippet, Input } from "@nextui-org/react";
import { prepareContractCall, PreparedTransaction, readContract, toTokens, toUnits } from "thirdweb";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { printCountdown } from "@/utils/countDown";
import toast from "react-hot-toast";

function Page({ params }: { params: { auctionId: string } }) {
  const activeAccount = useActiveAccount();
  const [isLoading, setIsLoading] = React.useState(true);
  const [auction, setAuction] = React.useState<any>();
  const [topBids, setTopBids] = React.useState<readonly [{ bidderAddress: string; bidAmount: bigint; }, { bidderAddress: string; bidAmount: bigint; }, { bidderAddress: string; bidAmount: bigint; }]>();
  const [bidValue, setBidValue] = React.useState<number>(0);
  const {mutateAsync:sendBidTransaction,isPending}=useSendAndConfirmTransaction()
  const {mutateAsync:sendFinalizeTransaction,isPending:finalizePending}=useSendAndConfirmTransaction()

  const getAuction = async () => {
    setIsLoading(true);
    const auction = await readContract({
      contract: getBidersContractByAddress(biddersContractAddress),
      method: "auctions",
      params: [BigInt(params.auctionId)],
    });
    setAuction(auction);
    setIsLoading(false);
  };
  const getTopBids = async () => {
    let i = 0;
    const bid = await readContract({
      contract: getBidersContractByAddress(biddersContractAddress),
      method: "getTopBidders",
      params: [BigInt(params.auctionId)],
    });
    setTopBids(bid);
  }
  const setBid=async()=>{
    try{

      if(!activeAccount){
        toast.error('Please connect wallet')
        return
      }
      if(!bidValue){
        toast.error('Please enter a bid value')
        return
      }
      if(bidValue<Number(toTokens(auction[5],18))){
        toast.error('Bid value should be greater than current highest bid')
        return
      }

      const transaction = prepareContractCall({
        contract: getBidersContractByAddress(biddersContractAddress),
        method: "placeBid",
        value: toUnits(String(bidValue),18),
        params: [BigInt(params.auctionId)],
      })
      await sendBidTransaction(transaction as PreparedTransaction,{
        onSuccess(){
          toast.success('Bid Placed Successfully')
          getAuction();
          getTopBids();
        },
        onError(){
          toast.error('Error Placing Bid')
        }
      })
    }
    catch(e){
      console.log(e)
    }
    

  }
  const finalizeAuction = async () => {
    try{
      const transaction = prepareContractCall({
        contract: getBidersContractByAddress(biddersContractAddress),
        method: "finalizeAuction",
        params: [BigInt(params.auctionId)],
      })
      await sendFinalizeTransaction(transaction as PreparedTransaction,{
        onSuccess(){
          toast.success('Auction Finalized Successfully')
          getAuction();
          getTopBids();
        },
        onError(){
          toast.error('Error Finalizing Auction')
        }
      })
    }
    catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    getAuction();
    getTopBids()
  }, [activeAccount?.address]);
  return (
    <>
      {isLoading ? (
        <div className="flex flex-col w-full h-screen align-middle justify-center items-center">
          <h1 className=" text-primary animate-bounce text-3xl font-light">
            Loading Auction
          </h1>
        </div>
      ) : (
        <div className="flex flex-col w-full justify-center items-center align-middle mt-20">
          <div className="flex flex-row w-full justify-start gap-20">
            <div className=" leftSide ">
              <Image
                src={auction[2]}
                className=""
                classNames={{
                  img: "min-h-[500px] min-w-[400px]",
                }}
              />
            </div>
            <div className="rightSide flex flex-col gap-5 p-10 text-primary-200">
              <h1 className=" text-primary text-2xl font-bold">{auction[0]}</h1>
              <p>
                {auction[1]}
              </p>
              <div className="flex flex-col gap-2">
                <h2 className=" text-primary font-bold">Seller</h2>
                <Snippet color="primary">{String(auction[3])}</Snippet>
              </div>
              <div className=" flex flex-row w-full justify-between items-center  align-middle">
                <div className=" flex flex-col justify-center gap-2">
                  <h1 className=" text-primary font-bold">NFT Address</h1>
                  <Snippet color="primary">{String(auction[10])}</Snippet>
                </div>
                <div className=" flex flex-col justify-center gap-2">
                  <h1 className="text-primary font-bold">Token ID</h1>
                  <p className=" text-center">{Number(auction[11])}</p>
                </div>
              </div>
                <div className="flex flex-row justify-between w-full">
                <div className=" flex flex-col">
                <h2 className=" text-primary font-bold">Starting Bid</h2>
                <p className=" font-bold text-2xl">
                  {toTokens(auction[4], 18)} ETH
                </p>
              </div>
              <div className="flex flex-col">
                  {Number(auction[7]) * 1000 > Date.now() ? <>
            {printCountdown(
                `timer`,
                new Date(
                  Number(auction[7]) * 1000
                ).toString()
            )}
            <h1 className='text-primary font-bold'>Time left </h1>
            <p className="text-xl font-bold w-full" id={`timer`}>
                {" "}
            </p>
        </>
            :
            <>
            <h1 className=" text-danger font-bold text-xl">Auction Ended</h1>
            {
               (activeAccount?.address == auction[6] || activeAccount?.address == auction[3]) && !auction[8] ?
                <Button color="primary" isLoading={finalizePending} onClick={async ()=>await finalizeAuction() }>Finalize Bid</Button>
                :
                ''
            }
            </>
        }
              </div>
                </div>
              
              <div className=" flex flex-row w-full">
                <Input
                  placeholder="Place Your Bid Here"
                  title="Your Bid"
                  label="Your Bid"
                  type="number"
                  endContent="ETH"
                  classNames={{
                    mainWrapper: "rounded-r-none",
                    base: "rounded-r-none",
                    inputWrapper: "rounded-r-none",
                    input: "rounded-r-none",
                    
                  }}
                  defaultValue={String(Number(toTokens(auction[5],18))+0.1)}
                  onChange={(e) => setBidValue(Number(e?.target?.value))}
                />
                <Button
                  className=" rounded-l-none min-h-full"
                  color="primary"
                  variant="solid"
                  isDisabled={!bidValue || auction[8]}
                  isLoading={isPending}
                  onClick={async ()=>await setBid()}
                >
                  Place Bid
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full justify-center gap-8">
            <h1 className=" text-primary text-2xl font-bold">TOP 3 BIDS</h1>
            <div className=" flex flex-col gap-3">
              <div className=" flex flex-row w-full justify-between items-center">
                <h1 className=" text-primary font-bold">Bidder</h1>
                <h1 className=" text-primary font-bold">Bid Amount</h1>
              </div>
              {topBids?.map((bid, index) => (
                <div key={index} className=" flex flex-row w-full justify-between items-center">
                <Snippet color="primary">{String(bid.bidderAddress)}</Snippet>
                <p className=" text-primary-200">{toTokens(bid.bidAmount,18)} ETH</p>
              </div>
              ))
              }
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Page;
