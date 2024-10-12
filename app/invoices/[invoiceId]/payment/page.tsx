import ChangeStatusMenu from '@/components/ChangeStatusMenu'
import Container from '@/components/Container'
import MoreOptionsMenu from '@/components/MoreOptionsMenu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { db } from '@/db'
import { Customers, Invoices } from '@/db/schema'
import { createPayment } from '@/lib/action'
import { cn } from '@/lib/utils'
import { auth } from '@clerk/nextjs/server'

import { and, eq, isNull } from 'drizzle-orm'
import { Check, CreditCard } from 'lucide-react'
import { notFound } from 'next/navigation'

const PaymentPage = async ({ params }: { params: { invoiceId: string } }) => {
  const invoiceId = parseInt(params.invoiceId)

  if (isNaN(invoiceId)) {
    throw new Error('Invalid Invoice ID')
  }

  const [result] = await db
    .select({
      id: Invoices.id,
      status: Invoices.status,
      createTs: Invoices.createTs,
      description: Invoices.description,
      value: Invoices.value,
      name: Customers.name,
    })
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(eq(Invoices.id, invoiceId))
    .limit(1)

  if (!result) {
    notFound()
  }

  const invoice = {
    ...result,
    customer: {
      name: result.name,
    },
  }

  return (
    <main className='h-full w-full'>
      <Container>
        <div className='grid grid-cols-2'>
          <div className=''>
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
              <div className='flex gap-4'></div>
            </div>
            <p className='text-3xl mb-3'>
              ${(invoice.value / 100).toFixed(2)}{' '}
            </p>
            <p className='text-lg mb-8'>{invoice.description} </p>
          </div>
          <div className=''>
            <h2 className='text-xl font-bold mb-4'>Manage Invoice</h2>
            {invoice.status === 'open' && (
              <form action={createPayment}>
                <input type='hidden' name='id' value={invoiceId} />
                <Button className='flex gap-2 bg-green-700 font-bold'>
                  <CreditCard className='w-5 h-auto' /> Make Payment
                </Button>
              </form>
            )}
            {invoice.status === 'paid' && (
              <p className='flex gap-2 items-center text-xl font-bold'>
                <Check className='w-8 h-auto bg-green-600 rounded-full text-white p-2' />{' '}
                Invoice Paid
              </p>
            )}
          </div>
        </div>

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
        </ul>
      </Container>
    </main>
  )
}

export default PaymentPage
