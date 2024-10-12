import {
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/nextjs'
import Container from './Container'
import Link from 'next/link'

const Header = () => {
  return (
    <div className='mt-8 mb-12'>
      <Container>
        <div className='flex justify-between items-center gap-4'>
          <div className='flex items-center gap-4'>
            <h1 className='font-bold'>
              <Link href='/dashboard'>Invoice Me</Link>
            </h1>
            <span className='text-slate-300'>/</span>
            <SignedIn>
              <span className='-ml-2'>
                <OrganizationSwitcher afterCreateOrganizationUrl='/dashboard' />
              </span>
            </SignedIn>
          </div>
          <div className=''>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Header
