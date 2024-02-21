'use client'
import { UserActionType } from '@prisma/client'

import { SensitiveDataClientUserAction } from '@/clientModels/clientUserAction/sensitiveDataClientUserAction'
import { USER_ACTION_ROW_CTA_INFO } from '@/components/app/userActionRowCTA/constants'
import { Button } from '@/components/ui/button'
import { NextImage } from '@/components/ui/image'
import { NFTSlug } from '@/utils/shared/nft'
import { NFT_CLIENT_METADATA } from '@/utils/web/nft'

type NFTDisplayProps = {
  userActions: SensitiveDataClientUserAction[]
}

type NFTImages = {
  name: string
  image: string
  width: number
  height: number
}

const ButtonWrapper = USER_ACTION_ROW_CTA_INFO[UserActionType.NFT_MINT].WrapperComponent

export function NFTDisplay({ userActions }: NFTDisplayProps) {
  let optInNftButton = true
  const userNfts: NFTImages[] = userActions.reduce(
    (acc: NFTImages[], action: SensitiveDataClientUserAction): NFTImages[] => {
      const nftSlug = action.nftMint?.nftSlug

      if (nftSlug) {
        const { name, image } = NFT_CLIENT_METADATA[nftSlug as NFTSlug]
        acc.push({ name, image: image.url, width: image.width, height: image.height })
      }

      if (nftSlug === 'swc-shield' && optInNftButton) optInNftButton = false

      return acc
    },
    [],
  )
  const numNfts = userNfts.length

  const emptySpots = 3 - (numNfts % 3)

  return (
    <>
      <div className="flex w-full flex-col items-center justify-between gap-4 sm:h-[992px] lg:h-[340px] lg:flex-row">
        {userNfts.map(nft => {
          const { name, image } = nft
          return (
            <NextImage
              alt={name}
              height={335}
              key={name}
              src={image}
              style={{ borderRadius: '24px' }}
              width={335}
            />
          )
        })}
        {Array.from({ length: emptySpots }, (_, index) => (
          <div
            className="box-content h-[320px] w-[320px] rounded-3xl bg-gray-100 md:h-[335px] md:w-[335px]"
            key={index}
          ></div>
        ))}
      </div>
      {optInNftButton ?? (
        <div className="m-4 flex justify-center">
          <ButtonWrapper>
            <Button>Mint Stand With Crypto Supporter NFT</Button>
          </ButtonWrapper>
        </div>
      )}
    </>
  )
}
