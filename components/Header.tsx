import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Container from './Container'
import Link from 'next/link'

const Header = () => {
  return (
    <header className='mt-8 mb-12'>
      <Container>
        <div className='flex justify-between items-center gap-4'>
          <h1 className='font-bold'>
            <Link href='/dashboard'>Invoice Me</Link>
          </h1>
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
    </header>
  )
}

export default Header
