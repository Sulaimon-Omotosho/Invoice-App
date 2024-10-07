'use client'

import { createAction } from '@/lib/action'

import { startTransition, SyntheticEvent, useState } from 'react'
import Form from 'next/form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import SubmitButton from '@/components/SubmitButton'

const NewInvoicePage = () => {
  const [state, setState] = useState('ready')

  async function handleOnSubmit(event: SyntheticEvent) {
    if (state === 'pending') {
      event.preventDefault()
      return
    }
    setState('pending')
  }

  return (
    <main className='flex flex-col justify-center h-full gap-6 max-w-5xl mx-auto my-12'>
      <div className='flex justify-between'>
        <h1 className='text-3xl font-bold'>Create Invoice</h1>
      </div>

      <Form
        action={createAction}
        onSubmit={handleOnSubmit}
        className='grid gap-4 max-w-xs'
      >
        <div className=''>
          <Label htmlFor='name' className='block mb-2 font-semibold text-sm'>
            Billing Name
          </Label>
          <Input id='name' name='name' type='text' />
        </div>
        <div className=''>
          <Label htmlFor='email' className='block mb-2 font-semibold text-sm'>
            Billing Email
          </Label>
          <Input id='email' name='email' type='email' />
        </div>
        <div className=''>
          <Label htmlFor='value' className='block mb-2 font-semibold text-sm'>
            Value
          </Label>
          <Input id='value' name='value' type='text' />
        </div>
        <div className=''>
          <Label
            htmlFor='description'
            className='block mb-2 font-semibold text-sm'
          >
            Description
          </Label>
          <Textarea id='description' name='description' />
        </div>
        <div className=''>
          <SubmitButton />
        </div>
      </Form>
    </main>
  )
}

export default NewInvoicePage
