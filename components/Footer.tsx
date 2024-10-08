import Container from './Container'

const Footer = () => {
  return (
    <footer className='mt-12 mb-8'>
      <Container className='flex justify-between gap-4'>
        <p className='text-sm'>Invoice me &copy; {new Date().getFullYear()}</p>
        <p className='text-sm'>
          Created by Sulaimon Omotosho using Next.js, Xata and Clerk
        </p>
      </Container>
    </footer>
  )
}

export default Footer
