import React from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog'
import { CookieConsentPermissions } from '@/components/app/cookieConsent/cookieConsent.constants'
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
  DrawerHeader,
} from '@/components/ui/drawer'
import { useIsMobile } from '@/hooks/useIsMobile'
import { cn } from '@/utils/web/cn'
import { useDialog } from '@/hooks/useDialog'

import { CookiePreferencesForm } from './cookiePreferencesForm'
import { DialogProps } from '@radix-ui/react-dialog'

export interface ManageCookiesModalProps {
  onSubmit: (accepted: CookieConsentPermissions) => void
}

export default function ManageCookiesModal({ onSubmit }: ManageCookiesModalProps) {
  const dialogProps = useDialog(false)
  const {
    isMobile,
    Container,
    ContainerTrigger,
    ContainerContent,
    ContainerHeader,
    ContainerTitle,
  } = useParentComponent()

  const handleManageCookiesSubmit = (values: CookieConsentPermissions) => {
    onSubmit(values)
    dialogProps.onOpenChange(false)
  }

  return (
    <Container {...dialogProps}>
      <ContainerTrigger asChild>
        <Button variant="link" className="p-0 font-bold">
          Manage cookies
        </Button>
      </ContainerTrigger>
      <ContainerContent>
        <ContainerHeader>
          <ContainerTitle>Cookie Preferences</ContainerTitle>
        </ContainerHeader>
        <div
          className={cn('space-y-6', {
            'p-8': isMobile,
          })}
        >
          <p>
            When you visit our website, we may store cookies on your browser to ensure the basic
            functionalities of the website, ensure your security, and to enhance your online
            experience, by helping us better understand user behavior and inform us about which
            parts of our website you have visited. Personal information, such as IP addresses or
            device identifiers, collected from our own and third-party cookies may be disclosed to
            our third-party partners, including our analytics partners. Blocking some types of
            cookies may impact your experience on the site. For more information, visit our Privacy
            Policy.
          </p>
          <CookiePreferencesForm onSubmit={handleManageCookiesSubmit} />
        </div>
      </ContainerContent>
    </Container>
  )
}

function useParentComponent() {
  const isMobile = useIsMobile()

  return React.useMemo(
    () => ({
      isMobile,
      Container: isMobile ? Drawer : Dialog,
      ContainerTrigger: isMobile ? DrawerTrigger : DialogTrigger,
      ContainerContent: isMobile
        ? DrawerContent
        : (props: DialogProps) => <DialogContent {...props} className="max-w-lg" />,
      ContainerHeader: isMobile ? DrawerHeader : DialogHeader,
      ContainerTitle: isMobile ? DrawerTitle : DialogTitle,
    }),
    [isMobile],
  )
}