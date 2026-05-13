export type Campaign = 'web' | 'vm'

export interface RawLead {
  business_name: string
  name_for_emails: string
  site: string
  email: string
  phone: string
  city: string
  country: string
  rating: string
  reviews: string
  description: string
  business_status: string
  full_address: string
}

export interface CleanedLead extends RawLead {
  _id: string
}

export interface RemovedLead extends RawLead {
  _reason: string
}

export interface CleanResult {
  clean: CleanedLead[]
  removed: RemovedLead[]
  stats: {
    total: number
    kept: number
    noEmail: number
    duplicates: number
  }
}

export interface GeneratedEmail {
  day: number
  subject: string
  body: string
}

export interface GeneratedLead {
  lead: CleanedLead
  niche: string
  template: number
  emails: GeneratedEmail[]
  demoHtml: string
  demoUrl: string | null
  reviewStatus: 'pending' | 'approved' | 'rejected'
}

export interface GenerateLeadRequest {
  lead: CleanedLead
  campaign: Campaign
  vapiPublicKey?: string
  vapiAssistantId?: string
}

export interface GenerateLeadResponse {
  success: boolean
  result?: GeneratedLead
  error?: string
}

export interface DeployDemoRequest {
  html: string
  businessName: string
}

export interface DeployDemoResponse {
  success: boolean
  url?: string
  error?: string
}

export interface ValidateResult {
  leadId: string
  businessName: string
  passed: boolean
  issues: string[]
}

export interface ExportRow {
  'Business Name': string
  Email: string
  Website: string
  City: string
  Niche: string
  'Demo URL': string
  'Subject 1': string
  'Body 1': string
  'Subject 2': string
  'Body 2': string
  'Subject 3': string
  'Body 3': string
  'Subject 4': string
  'Body 4': string
}
