import { SignIn } from '@clerk/nextjs'

const SignInPage = () => (
  <div className="pt-8 pb-24">
    <SignIn forceRedirectUrl="/view-jobs" />
  </div>
);

export default SignInPage
