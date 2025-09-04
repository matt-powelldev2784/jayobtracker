import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignOutButton } from "@clerk/nextjs";

const SignOutPage = () => (
  <Card className="w-11/12 max-w-[700px] mt-8 pb-8 border-2 border-darkGrey rounded-2xl">
    <CardHeader className="bg-primary">
      <CardTitle className="text-center text-white">Log Out</CardTitle>
    </CardHeader>

    <CardDescription className="flexCol mt-2">
      <p className="text-darkGrey mb-4">Click the button below to log out</p>

      <SignOutButton redirectUrl="/">
        <Button className="w-11/12 mb-2" size="lg">
          Log Out
        </Button>
      </SignOutButton>
    </CardDescription>
  </Card>
);

export default SignOutPage
