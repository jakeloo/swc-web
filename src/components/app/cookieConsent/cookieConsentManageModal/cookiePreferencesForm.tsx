import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { GenericErrorFormValues } from '@/utils/web/formUtils'
import {
  CookieConsentPermissions,
  OptionalCookieConsentTypes,
  zodManageCookieConsent,
} from '@/components/app/cookieConsent/cookieConsent.constants'
import {
  Form,
  FormControl,
  FormErrorMessage,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { CheckboxProps } from '@radix-ui/react-checkbox'
import InfoBadge from '@/components/ui/infoBadge'
import { Button } from '@/components/ui/button'

export interface CookiePreferencesFormProps {
  onSubmit: (accepted: CookieConsentPermissions) => void
}

type FormValues = z.infer<typeof zodManageCookieConsent> & GenericErrorFormValues

const FIELDS_CONFIG = [
  {
    key: OptionalCookieConsentTypes.PERFORMANCE,
    label: 'Performance',
    helpText:
      'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site. All information these cookies collect is aggregated and therefore anonymous. If you do not allow these cookies we will not know when you have visited our site, and will not be able to monitor its performance.',
  },
  {
    key: OptionalCookieConsentTypes.FUNCTIONAL,
    label: 'Functional',
    helpText:
      'These cookies enable us to remember choices you have made in the past in order to provide enhanced functionality and personalization (e.g., what language you prefer). If you do not allow these cookies then some or all of these services may not function properly.',
  },
  {
    key: OptionalCookieConsentTypes.TARGETING,
    label: 'Targeting',
    helpText:
      'Analytical cookies are used to understand how visitors interact with the website. These cookies help provide information on metrics such as the number of visitors, bounce rate, traffic source, etc. Personal information obtained from these cookies may be shared with third party analytics partners.',
  },
]

export function CookiePreferencesForm({ onSubmit }: CookiePreferencesFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(zodManageCookieConsent),
    defaultValues: {
      [OptionalCookieConsentTypes.PERFORMANCE]: true,
      [OptionalCookieConsentTypes.FUNCTIONAL]: true,
      [OptionalCookieConsentTypes.TARGETING]: true,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold md:text-base">Manage Cookies:</h3>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-[repeat(2,minmax(max-content,1fr))]">
          <CheckboxField
            label="Strictly necessary Cookies"
            helpText="These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in or filling in forms. These also include cookies we may rely on for fraud prevention. You can set your browser to block or alert you about these cookies, but some parts of the site will not then work."
            checked
            disabled
          />

          {FIELDS_CONFIG.map(({ key, label, helpText }) => (
            <FormField
              key={key}
              control={form.control}
              name={key}
              render={({ field: { value, onChange, ...field } }) => (
                <CheckboxField
                  label={label}
                  helpText={helpText}
                  {...field}
                  checked={value}
                  onCheckedChange={onChange}
                />
              )}
            />
          ))}
        </div>

        <Button type="submit" size="lg" className="mt-4 w-full">
          Save
        </Button>
      </form>
    </Form>
  )
}

interface CheckboxFieldProps extends CheckboxProps {
  label: string
  helpText: string
}

function CheckboxField({ label, helpText, ...props }: CheckboxFieldProps) {
  return (
    <FormItem>
      <label className="flex cursor-pointer items-center gap-2">
        <FormControl>
          <Checkbox {...props} />
        </FormControl>
        <p>{label}</p>
        <InfoBadge>{helpText}</InfoBadge>
      </label>
    </FormItem>
  )
}