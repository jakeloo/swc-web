// Final interfaces are TBD - this is currently all known fields.
interface CoinbaseCommercePaymentDetails {
  network: string
  transaction_id: string
  status?: string
  detected_at?: string
  value?: {
    local: { amount: string; currency: string }
    crypto: { amount: string; currency: string }
  }
  block?: {
    height: number
    hash: string
    confirmations_accumulated: number
    confirmations_required: number
  }
  payer_addresses?: string[]
}

interface CoinbaseCommercePaymentTimeline {
  time: string
  status: string
  payment?: CoinbaseCommercePaymentDetails
}

interface CoinbaseCommercePaymentEventData {
  code: string
  id: string
  resource: string
  name: string
  description: string
  hosted_url: string
  created_at: string
  confirmed_at?: string
  expires_at: string
  support_email: string
  timeline: CoinbaseCommercePaymentTimeline[]
  metadata: Record<string, string> // Includes custom fields sent through "create charge" API request.
  payment_threshold: {
    overpayment_absolute_threshold: { amount: string; currency: string }
    overpayment_relative_threshold: string
    underpayment_absolute_threshold: { amount: string; currency: string }
    underpayment_relative_threshold: string
  }
  pricing: {
    local: { amount: string; currency: string }
  }
  pricing_type: string
  payments: CoinbaseCommercePaymentDetails[]
  exchange_rates: Record<string, string>
  local_exchange_rates: Record<string, string>
  pwcb_only: boolean
  offchain_eligible: boolean
  coinbase_managed_merchant: boolean
  collected_email: boolean
  fee_rate: number
}

interface CoinbaseCommercePaymentEvent {
  id: string
  resource: string
  type: string
  api_version: string
  created_at: string
  data: CoinbaseCommercePaymentEventData
}

export interface CoinbaseCommercePayment {
  id: string
  scheduled_for: string
  attempt_number: number
  event: CoinbaseCommercePaymentEvent
}
