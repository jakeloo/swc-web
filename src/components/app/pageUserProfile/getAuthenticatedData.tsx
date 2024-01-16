import { getClientAddress } from '@/clientModels/clientAddress'
import { getClientUser } from '@/clientModels/clientUser/clientUser'
import { getClientUserCryptoAddress } from '@/clientModels/clientUser/clientUserCryptoAddress'
import { getSensitiveDataClientUser } from '@/clientModels/clientUser/sensitiveDataClientUser'
import { getSensitiveDataClientUserAction } from '@/clientModels/clientUserAction/sensitiveDataClientUserAction'
import { queryDTSIPeopleBySlugForUserActions } from '@/data/dtsi/queries/queryDTSIPeopleBySlugForUserActions'
import { appRouterGetAuthUser } from '@/utils/server/appRouterGetAuthUser'
import { prismaClient } from '@/utils/server/prismaClient'
import 'server-only'

export async function getAuthenticatedData() {
  const authUser = await appRouterGetAuthUser()
  if (!authUser) {
    return null
  }
  const user = await prismaClient.user.findFirstOrThrow({
    where: {
      userCryptoAddresses: { some: { address: authUser.address } },
    },
    include: {
      userMergeAlertUserA: { include: { userB: { include: { primaryUserCryptoAddress: true } } } },
      userMergeAlertUserB: { include: { userA: { include: { primaryUserCryptoAddress: true } } } },
      primaryUserCryptoAddress: true,
      userCryptoAddresses: true,
      address: true,
      primaryUserEmailAddress: true,
      userActions: {
        include: {
          userActionDonation: true,
          userActionEmail: {
            include: {
              address: true,
              userActionEmailRecipients: true,
            },
          },
          userActionCall: true,
          nftMint: { include: { nft: true } },
          userActionOptIn: true,
        },
      },
    },
  })
  const dtsiSlugs = new Set<string>()
  user.userActions.forEach(userAction => {
    if (userAction.userActionCall) {
      dtsiSlugs.add(userAction.userActionCall.recipientDtsiSlug)
    } else if (userAction.userActionEmail) {
      userAction.userActionEmail.userActionEmailRecipients.forEach(userActionEmailRecipient => {
        dtsiSlugs.add(userActionEmailRecipient.dtsiSlug)
      })
    }
  })
  const dtsiPeople = await queryDTSIPeopleBySlugForUserActions(Array.from(dtsiSlugs)).then(
    x => x.people,
  )
  const { userActions, address, ...rest } = user
  const currentlyAuthenticatedUserCryptoAddress = user.userCryptoAddresses.find(
    x => x.address === authUser.address,
  )
  if (!currentlyAuthenticatedUserCryptoAddress) {
    throw new Error('Primary user crypto address not found')
  }
  return {
    ...getSensitiveDataClientUser(rest),
    // TODO show UX if this address is not the primary address
    currentlyAuthenticatedUserCryptoAddress: getClientUserCryptoAddress(
      currentlyAuthenticatedUserCryptoAddress,
    ),
    address: address && getClientAddress(address),
    userActions: userActions.map(record =>
      getSensitiveDataClientUserAction({ record, dtsiPeople }),
    ),
    mergeAlerts: [
      ...user.userMergeAlertUserA.map(
        ({ userB, hasBeenConfirmedByUserA, hasBeenConfirmedByUserB, userBId, ...mergeAlert }) => ({
          ...mergeAlert,
          hasBeenConfirmedByOtherUser: hasBeenConfirmedByUserB,
          hasBeenConfirmedByCurrentUser: hasBeenConfirmedByUserA,
          otherUser: getClientUser({ ...userB, isPubliclyVisible: true }),
        }),
      ),
      ...user.userMergeAlertUserB.map(
        ({ userA, hasBeenConfirmedByUserA, hasBeenConfirmedByUserB, userBId, ...mergeAlert }) => ({
          ...mergeAlert,
          hasBeenConfirmedByCurrentUser: hasBeenConfirmedByUserB,
          hasBeenConfirmedByOtherUser: hasBeenConfirmedByUserA,
          otherUser: getClientUser({ ...userA, isPubliclyVisible: true }),
        }),
      ),
    ],
  }
}

export type PageUserProfileUser = NonNullable<Awaited<ReturnType<typeof getAuthenticatedData>>>