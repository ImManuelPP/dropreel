import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

import type { TemplateEntry } from './registry'

interface QuoteNotificationProps {
  id?: string
  name?: string
  email?: string
  brand?: string
  needs?: string
  budget?: string
}

function Field({ label, value }: { label: string; value?: string | undefined }) {
  return (
    <Section style={{ marginBottom: '12px' }}>
      <Text
        style={{
          margin: 0,
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#6b7280',
        }}
      >
        {label}
      </Text>
      <Text style={{ margin: '4px 0 0', fontSize: '15px', color: '#111827' }}>
        {value || '—'}
      </Text>
    </Section>
  )
}

function QuoteNotification({ id, name, email, brand, needs, budget }: QuoteNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>New quote request from {name || 'a visitor'} ({brand || 'brand not provided'})</Preview>
      <Body style={{ margin: 0, backgroundColor: '#f4f4f5', fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <Container
          style={{
            margin: '32px auto',
            maxWidth: '520px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '32px',
            border: '1px solid #e4e4e7',
          }}
        >
          <Heading style={{ margin: '0 0 8px', fontSize: '20px', color: '#111827' }}>
            New quote request
          </Heading>
          <Text style={{ margin: '0 0 24px', fontSize: '13px', color: '#6b7280' }}>
            Submitted via the Droppreel contact form{id ? ` · ${id}` : ''}
          </Text>
          <Hr style={{ borderColor: '#e4e4e7', margin: '0 0 24px' }} />
          <Field label="Name" value={name} />
          <Field label="Email" value={email} />
          <Field label="Brand" value={brand || '(not provided)'} />
          <Field label="What they need" value={needs} />
          <Field label="Budget note" value={budget || undefined} />
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: QuoteNotification,
  subject: (data: Record<string, any>) =>
    `New quote request — ${data['brand'] || 'No brand provided'} (${data['name'] || 'Unknown'})`,
  displayName: 'Quote request notification',
  to: 'srpareja20@gmail.com',
  previewData: {
    id: 'preview-123',
    name: 'Jane Doe',
    email: 'jane@example.com',
    brand: 'Acme Store',
    needs: 'Three UGC-style VSLs per week for TikTok ads.',
    budget: 'Around $2k/month',
  },
} satisfies TemplateEntry
