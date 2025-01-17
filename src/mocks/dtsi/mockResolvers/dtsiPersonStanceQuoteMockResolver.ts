import { faker } from '@faker-js/faker'

import { DTSI_PersonStanceQuoteResolvers } from '@/data/dtsi/generated'
import { MOCK_RICH_TEXT } from '@/mocks/misc/mockRichText'

export const dtsiPersonStanceQuoteMockResolver = (): Partial<DTSI_PersonStanceQuoteResolvers> => ({
  sourceUrl: () => faker.internet.url(),
  richTextDescription: () => MOCK_RICH_TEXT,
})
