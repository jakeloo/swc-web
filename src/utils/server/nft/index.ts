import { prismaClient } from '@/utils/server/prismaClient'
import { $Enums, NFTCurrency, UserAction, UserActionType, UserCryptoAddress } from '@prisma/client'
import {
  CallYourRepresentativeSept11ThirdWebNFT,
  NFTInformation,
  SWCShieldThirdWebNFT,
} from '@/utils/server/airdrop/nfts'
import { getLogger } from '@/utils/shared/logger'
import NFTMintStatus = $Enums.NFTMintStatus
import { inngest } from '@/inngest/inngest'
import { AIRDROP_NFT_INNGEST_EVENT_NAME } from '@/inngest/functions/airdropNFT'

const USER_ACTION_WITH_NFT = [UserActionType.OPT_IN, UserActionType.CALL]

const USER_ACTION_TO_NFT_INFORMATION: { [key: string]: NFTInformation } = {}
USER_ACTION_TO_NFT_INFORMATION[UserActionType.OPT_IN] = SWCShieldThirdWebNFT
USER_ACTION_TO_NFT_INFORMATION[UserActionType.CALL] = CallYourRepresentativeSept11ThirdWebNFT

const logger = getLogger(`airdrop`)

export async function claimNFT(userAction: UserAction, userCryptoAddress: UserCryptoAddress) {
  logger.info('Triggered')
  const nft = USER_ACTION_TO_NFT_INFORMATION[userAction.actionType]
  if (nft === null) {
    return
  }

  logger.info('nft found')
  if (await userAlreadyClaimedNFT(userAction.userId, nft.slug)) {
    logger.info('nft already requested or claimed')
    return
  }

  logger.info('cryptoAddress id: ' + userCryptoAddress.id)
  const userMintAction = await prismaClient.userAction.create({
    data: {
      user: { connect: { id: userAction.userId } },
      actionType: UserActionType.NFT_MINT,
      userCryptoAddress: { connect: { id: userCryptoAddress.id } },
      campaignName: userAction.campaignName,
      nftMint: {
        create: {
          nftSlug: nft.slug,
          status: NFTMintStatus.REQUESTED,
          costAtMint: 0.0,
          contractAddress: nft.contractAddress,
          costAtMintCurrencyCode: NFTCurrency.ETH,
          transactionHash: '',
          costAtMintUsd: '0',
        },
      },
    },
    include: {
      nftMint: true,
    },
  })

  await inngest.send({
    name: AIRDROP_NFT_INNGEST_EVENT_NAME,
    data: {
      userAction: userMintAction.nftMint,
      walletAddress: userCryptoAddress.cryptoAddress,
    },
  })
}

async function userAlreadyClaimedNFT(userId: string, nftSlug: string) {
  logger.info('userAlreadyClaimedNFT triggered')
  const userActions = await prismaClient.userAction.findFirst({
    where: {
      userId: userId,
      nftMint: {
        nftSlug: nftSlug,
        status: { in: [NFTMintStatus.CLAIMED, NFTMintStatus.REQUESTED] },
      },
    },
  })
  return userActions !== null
}

export async function updateMinNFTStatus(
  mintNftId: string,
  nftMintStatus: NFTMintStatus,
  transactionHash: string,
) {
  await prismaClient.nFTMint.update({
    where: {
      id: mintNftId,
    },
    data: {
      status: nftMintStatus,
      transactionHash: transactionHash,
    },
  })
}

export async function mintPastActions(userId: string, userCryptoAddress: UserCryptoAddress) {
  for (const actionType of USER_ACTION_WITH_NFT) {
    const action = await prismaClient.userAction.findFirst({
      where: {
        userId: userId,
        actionType: actionType,
      },
    })

    if (action !== null) {
      logger.info('mint past actions:' + action.actionType)
      await claimNFT(action, userCryptoAddress)
    }
  }
}
