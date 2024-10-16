'use server'

import { db } from '@/db'
import { Customers, Invoices, Status } from '@/db/schema'
import { auth } from '@clerk/nextjs/server'
import { and, eq, isNull } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import Stripe from 'stripe'

const stripe = new Stripe(String(process.env.STRIPE_API_SECRET))

export async function createAction(formData: FormData) {
  const { userId, orgId } = auth()

  if (!userId) {
    return
  }

  const value = Math.floor(parseFloat(String(formData.get('value'))) * 100)
  const description = formData.get('description') as string
  const name = formData.get('name') as string
  const email = formData.get('email') as string

  const [customer] = await db
    .insert(Customers)
    .values({
      name,
      email,
      userId,
      organizationId: orgId || null,
    })
    .returning({
      id: Customers.id,
    })

  const results = await db
    .insert(Invoices)
    .values({
      value,
      description,
      userId,
      customerId: customer.id,
      status: 'open',
      organizationId: orgId || null,
    })
    .returning({
      id: Invoices.id,
    })

  redirect(`/invoices/${results[0].id}`)
}

export async function updateStatusAction(formData: FormData) {
  const { userId, orgId } = auth()

  if (!userId) {
    return
  }

  const id = formData.get('id') as string
  const status = formData.get('status') as Status

  if (orgId) {
    await db
      .update(Invoices)
      .set({ status })
      .where(
        and(eq(Invoices.id, parseInt(id)), eq(Invoices.organizationId, orgId))
      )
  } else {
    await db
      .update(Invoices)
      .set({ status })
      .where(
        and(
          eq(Invoices.id, parseInt(id)),
          isNull(Invoices.organizationId),
          eq(Invoices.userId, userId)
        )
      )
  }

  revalidatePath(`/invoices/${id}`, 'page')
}

export async function deleteInvoiceAction(formData: FormData) {
  const { userId, orgId } = auth()

  if (!userId) {
    return
  }

  const id = formData.get('id') as string

  if (orgId) {
    await db
      .delete(Invoices)
      .where(
        and(eq(Invoices.id, parseInt(id)), eq(Invoices.organizationId, orgId))
      )
  } else {
    await db
      .delete(Invoices)
      .where(
        and(
          eq(Invoices.id, parseInt(id)),
          isNull(Invoices.organizationId),
          eq(Invoices.userId, userId)
        )
      )
  }

  redirect('/dashboard')
}

export async function createPayment(formData: FormData) {
  const id = parseInt(formData.get('id') as string)

  const [result] = await db
    .select({
      status: Invoices.status,
      value: Invoices.value,
    })
    .from(Invoices)
    .where(eq(Invoices.id, id))
    .limit(1)

  console.log('result', result)
}
