import { Button } from '@/components/ui/button'
import { SignOutButton } from '@clerk/nextjs'

const SignOutPage = () => (
  <SignOutButton redirectUrl="/">
    <Button className="mt-10" size="lg">
      Sign Out
    </Button>
  </SignOutButton>
)

export default SignOutPage
