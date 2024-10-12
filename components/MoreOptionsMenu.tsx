import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { CreditCard, Ellipsis, Trash2, X } from 'lucide-react'
import { deleteInvoiceAction } from '@/lib/action'
import DeleteDialog from './DeleteDialog'
import { DialogClose } from '@radix-ui/react-dialog'
import Link from 'next/link'

const MoreOptionsMenu = async ({ invoiceId }: { invoiceId: number }) => {
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' className='flex items-center gap-2'>
            <span className='sr-only'>More Options</span>
            <Ellipsis className='w-4 h-auto' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <DialogTrigger asChild>
              <button className='flex gap-2 items-center'>
                <Trash2 className='w-4 h-auto' /> Delete Invoice
              </button>
            </DialogTrigger>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href={`/invoices/${invoiceId}/payment`}
              className='flex gap-2 items-center'
            >
              <CreditCard className='w-4 h-auto' />
              Payment
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className='flex flex-col gap-4 items-center'>
        <DialogHeader className='flex flex-col items-center'>
          <DialogTitle className='text-2xl'>Delete Invoice?</DialogTitle>
          <DialogDescription className='text-center'>
            This action cannot be undone. This will permanently delete this
            invoice and remove the data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <form action={deleteInvoiceAction}>
            <input type='hidden' name='id' value={invoiceId} />
            <Button variant='destructive' className='flex gap-2 items-center'>
              <Trash2 className='w-4 h-auto' /> Delete Invoice
            </Button>
          </form>
          <DialogClose asChild>
            <Button variant='outline' className='flex gap-2 items-center'>
              <X className='w-4 h-auto' /> Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default MoreOptionsMenu
