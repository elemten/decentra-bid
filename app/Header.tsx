'use client'
import Link from "next/link";
import { sepolia } from "thirdweb/chains";
import { ConnectButton } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { createThirdwebClient } from "thirdweb";
import { PixelifySans } from "./layout";

export default function Header() {
    const thirdWebClient = createThirdwebClient({ clientId: 'f76f50283af21db4ef0e6eec33b378eb' });
    const wallets = [
     createWallet("io.metamask"),
   ];
    return (
    <div className="flex flex-col w-full gap-2 justify-center mt-4">
        <div className=" logo w-full text-center ">
          <Link className={` text-primary font-bold text-4xl ${PixelifySans.className}`  }  href={'/'}>Decentra Bid</Link>
        </div>
        <div className=" flex flex-row w-full gap-5 justify-center items-center align-middle">
          <Link  href={'/createlisting'} className=" text-primary">Create new Auction</Link>
          <ConnectButton
            client={thirdWebClient}
            chain={sepolia}
            autoConnect
            wallets={wallets}
            theme={'dark'}
            detailsButton={{
              className:" !bg-primary !h-12 !text-md hover:!bg-primary  !font-semibold  !rounded-md",
            }}
            connectButton={
              {
                label: 'Connect Wallet',
                className: ' !text-primary !bg-transparent !h-12 !text-md hover:!bg-transparent hover:!text-primary !font-semibold  !rounded-md',
              }
            }
            />
        </div>
    </div>
    )
}