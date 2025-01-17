'use client'
import { useEffect } from 'react'
import { z } from 'zod'

import { DTSIAvatar } from '@/components/app/dtsiAvatar'
import { DTSIFormattedLetterGrade } from '@/components/app/dtsiFormattedLetterGrade'
import { Skeleton } from '@/components/ui/skeleton'
import {
  formatGetDTSIPeopleFromAddressNotFoundReason,
  useGetDTSIPeopleFromAddress,
} from '@/hooks/useGetDTSIPeopleFromAddress'
import { dtsiPersonFullName } from '@/utils/dtsi/dtsiPersonUtils'
import { convertDTSIStanceScoreToCryptoSupportLanguageSentence } from '@/utils/dtsi/dtsiStanceScoreUtils'
import { zodGooglePlacesAutocompletePrediction } from '@/validation/fields/zodGooglePlacesAutocompletePrediction'

export function DTSICongresspersonAssociatedWithFormAddress({
  address,
  onChangeDTSISlug,
  currentDTSISlugValue,
}: {
  address?: z.infer<typeof zodGooglePlacesAutocompletePrediction>
  currentDTSISlugValue: string
  onChangeDTSISlug: (slug: string) => void
}) {
  const res = useGetDTSIPeopleFromAddress(address?.description || '')
  useEffect(() => {
    if (
      res.data &&
      'dtsiPerson' in res.data &&
      res.data.dtsiPerson?.slug !== currentDTSISlugValue
    ) {
      onChangeDTSISlug(res.data.dtsiPerson.slug)
    } else if (currentDTSISlugValue && !res.data) {
      onChangeDTSISlug('')
    }
  }, [currentDTSISlugValue, onChangeDTSISlug, res.data])
  if (!address || res.isLoading) {
    return (
      <div className="flex gap-4">
        <Skeleton className="h-10 w-10 flex-shrink-0" />
        <div className="text-sm md:text-base">
          <p className="bold">Your representative</p>
          <p className="text-fontcolor-muted">
            {res.isLoading ? 'Loading...' : 'This will show up after you enter your address'}
          </p>
        </div>
      </div>
    )
  }
  if (!res.data || 'notFoundReason' in res.data) {
    return <div>{formatGetDTSIPeopleFromAddressNotFoundReason(res.data)}</div>
  }
  const person = res.data.dtsiPerson
  return (
    <div className="flex flex-row items-center gap-4 text-sm md:text-base">
      <div className="relative flex-shrink-0">
        <DTSIAvatar person={person} size={60} />
        <div className="absolute bottom-[-8px] right-[-8px]">
          <DTSIFormattedLetterGrade person={person} size={25} />
        </div>
      </div>
      <div>
        <div className="font-bold">Your representative is {dtsiPersonFullName(person)}</div>
        <div className="text-fontcolor-muted">
          {convertDTSIStanceScoreToCryptoSupportLanguageSentence(person)}
        </div>
      </div>
    </div>
  )
}
