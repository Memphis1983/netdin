import { Client, ID, TablesDB } from 'appwrite'

export type ProjectBrief = {
  name: string
  email: string
  company: string
  services: string[]
  budget: string
  timeline: string
  message: string
  consent: boolean
}

export const serviceOptions = ['Website development', 'Custom software', 'Brand identity', 'Automation']

export async function submitBrief(brief: ProjectBrief) {
  const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT
  const project = import.meta.env.VITE_APPWRITE_PROJECT_ID
  const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID
  const tableId = import.meta.env.VITE_APPWRITE_TABLE_ID

  if (!endpoint || !project || !databaseId || !tableId) {
    throw new Error('Online enquiries are not connected yet. Please email your brief to hello@netdin.com.')
  }

  const client = new Client().setEndpoint(endpoint).setProject(project)
  const tables = new TablesDB(client)

  try {
    await tables.createRow({
      databaseId,
      tableId,
      rowId: ID.unique(),
      data: { ...brief, source: 'netdin.com', consentVersion: '2026-09-11' },
      permissions: [],
    })
  } catch {
    throw new Error('Your brief could not be sent. Please try again, or email hello@netdin.com. Your details are still here.')
  }
}