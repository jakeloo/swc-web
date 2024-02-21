import { NFTSlug } from '@/utils/shared/nft'

export interface NFTClientMetadata {
  name: string
  image: { url: string; width: number; height: number; alt: string }
}
export const NFT_CLIENT_METADATA: Record<NFTSlug, NFTClientMetadata> = {
  [NFTSlug.SWC_SHIELD]: {
    name: 'SWC Shield',
    image: {
      url: '/nfts/membership-shield-nft.png',
      width: 512,
      height: 512,
      alt: 'SWC Shield',
    },
  },
  [NFTSlug.CALL_REPRESENTATIVE_SEPT_11]: {
    name: 'Call Representative Sept 11',
    image: {
      url: '/nfts/call.gif',
      width: 160,
      height: 160,
      alt: 'A rotating phone with the text "I called congress" below it',
    },
  },
  [NFTSlug.I_VOTED]: {
    name: 'I Voted',
    image: {
      url: '/nfts/i-voted-nft.png',
      width: 160,
      height: 160,
      alt: 'circular image with a robotic woman with the text "I\'m a voter" on top of it',
    },
  },
}
