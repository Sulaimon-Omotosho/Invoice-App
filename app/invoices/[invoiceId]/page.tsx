import ChangeStatusMenu from '@/components/ChangeStatusMenu'
import Container from '@/components/Container'
import MoreOptionsMenu from '@/components/MoreOptionsMenu'
import { Badge } from '@/components/ui/badge'
import { db } from '@/db'
import { Customers, Invoices } from '@/db/schema'
import { cn } from '@/lib/utils'
import { auth } from '@clerk/nextjs/server'

import { and, eq, isNull } from 'drizzle-orm'
import { notFound } from 'next/navigation'

const InvoiceIdPage = async ({ params }: { params: { invoiceId: string } }) => {
  const { userId, orgId } = auth()

  if (!userId) return

  const invoiceId = parseInt(params.invoiceId)

  if (isNaN(invoiceId)) {
    throw new Error('Invalid Invoice ID')
  }

  let result

  if (orgId) {
    ;[result] = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(
        and(eq(Invoices.id, invoiceId), eq(Invoices.organizationId, orgId))
      )
      .limit(1)
  } else {
    ;[result] = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(
        and(
          eq(Invoices.id, invoiceId),
          eq(Invoices.userId, userId),
          isNull(Invoices.organizationId)
        )
      )
      .limit(1)
  }

  if (!result) {
    notFound()
  }

  const invoice = {
    ...result.invoices,
    customer: result.customers,
  }

  return (
    <main className='h-full w-full'>
      <Container>
        <div className='flex justify-between mb-8'>
          <h1 className='flex items-center gap-4 text-3xl font-bold'>
            Invoice #{invoiceId}
            <Badge
              className={cn(
                'rounded-full capitalize',
                invoice.status === 'open' && 'bg-blue-500',
                invoice.status === 'paid' && 'bg-green-600',
                invoice.status === 'void' && 'bg-zinc-700',
                invoice.status === 'uncollectible' && 'bg-red-600'
              )}
            >
              {invoice.status}
            </Badge>
          </h1>
          <div className='flex gap-4'>
            <ChangeStatusMenu invoiceId={invoiceId} />
            <MoreOptionsMenu invoiceId={invoiceId} />
          </div>
        </div>
        <p className='text-3xl mb-3'>${(invoice.value / 100).toFixed(2)} </p>
        <p className='text-lg mb-8'>{invoice.description} </p>
        <h2 className='font-bold text-lg mb-4'>Billing Details</h2>
        <ul className='grid gap-2'>
          <li className='flex gap-4'>
            <strong className='block w-28 flex-shrink-0 font-medium text-sm'>
              Invoice ID
            </strong>
            <span>{invoiceId} </span>
          </li>
          <li className='flex gap-4'>
            <strong className='block w-28 flex-shrink-0 font-medium text-sm'>
              Invoice Date
            </strong>
            <span>{new Date(invoice.createTs).toLocaleDateString()}</span>
          </li>
          <li className='flex gap-4'>
            <strong className='block w-28 flex-shrink-0 font-medium text-sm'>
              Billing Name
            </strong>
            <span>{invoice.customer.name} </span>
          </li>
          <li className='flex gap-4'>
            <strong className='block w-28 flex-shrink-0 font-medium text-sm'>
              Billing Email
            </strong>
            <span>{invoice.customer.email} </span>
          </li>
        </ul>
      </Container>
    </main>
  )
}

export default InvoiceIdPage
