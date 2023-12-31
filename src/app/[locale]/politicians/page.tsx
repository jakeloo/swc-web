import { DTSIClientPersonDataTable } from '@/components/app/dtsiClientPersonDataTable'
import { DTSIPersonCard } from '@/components/app/dtsiPersonCard'
import { Button } from '@/components/ui/button'
import { PageSubTitle } from '@/components/ui/pageSubTitle'
import { PageTitle } from '@/components/ui/pageTitleText'
import { queryDTSIHomepagePeople } from '@/data/dtsi/queries/queryDTSIHomepagePeople'
import { PageProps } from '@/types'
import { groupAndSortDTSIPeopleByCryptoStance } from '@/utils/dtsi/dtsiPersonUtils'
import { generateMetadataDetails } from '@/utils/server/metadataUtils'
import { Metadata } from 'next'

export const revalidate = 3600
export const dynamic = 'error'

type Props = PageProps

const title = 'Where politicians stand on crypto'
const description = `Ask your politician to be pro-crypto. Here's where they stand now.`
export async function generateMetadata(_props: Props): Promise<Metadata> {
  return generateMetadataDetails({
    title,
    description,
  })
}

export default async function PoliticiansHomepage({ params }: PageProps) {
  const { locale } = params
  const [dtsiHomepagePeople] = await Promise.all([queryDTSIHomepagePeople()])
  const groupedDTSIHomepagePeople = groupAndSortDTSIPeopleByCryptoStance(dtsiHomepagePeople.people)
  return (
    <div className="container">
      <section className="mb-24 space-y-7 text-center">
        <PageTitle>{title}</PageTitle>
        <PageSubTitle>{description}</PageSubTitle>
        <div>
          <Button>Find your representative (TODO)</Button>
        </div>
      </section>
      <section className="mb-24 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <h3 className="mb-4 text-center text-xl font-bold text-green-600">Pro-crypto</h3>
          <div className="space-y-3">
            {groupedDTSIHomepagePeople.proCrypto.map(person => (
              <DTSIPersonCard locale={locale} key={person.id} person={person} />
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-center text-xl font-bold text-red-600">Anti-crypto</h3>
          <div className="space-y-3">
            {/* TODO replace with anti-crypto once we get the gql endpoint working as expected */}
            {groupedDTSIHomepagePeople.antiCrypto.map(person => (
              <DTSIPersonCard locale={locale} key={person.id} person={person} />
            ))}
          </div>
        </div>
      </section>
      <section>
        <h3 className="mb-4 text-center text-xl font-bold">Politicians</h3>
        <DTSIClientPersonDataTable locale={locale} />
      </section>
    </div>
  )
}