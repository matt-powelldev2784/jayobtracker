import { SignUp } from '@clerk/nextjs'

const SignUpPage = () => (
  <div className="flex justify-center items-center min-h-[70vh]">
    <SignUp
      path="/auth/sign-up"
      routing="path"
      signInUrl="/auth/sign-in"
      forceRedirectUrl="/view-jobs"
      appearance={{
        elements: {
          formButtonPrimary: "bg-primary text-white",
        },
      }}
    />
  </div>
);

export default SignUpPage
