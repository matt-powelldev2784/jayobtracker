import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TriangleAlert } from "lucide-react";
import { LinkButton } from "./button";

type ErrorCardProps = {
  message: string;
};

const ErrorCard = ({ message }: ErrorCardProps) => {
  return (
    <Card className="w-11/12 max-w-[700px] mt-8 pb-8">
      <CardHeader className="bg-primary">
        <TriangleAlert className="h-16 w-16 text-white" />
        <CardTitle className="text-center text-white">Error</CardTitle>
      </CardHeader>

      <CardDescription className="flex flex-col items-center gap-4 text-center">
        <div>
          <CardTitle className="text-center text-black font-normal">
            The application has encountered an Error. Please try again later.
          </CardTitle>
          <p className="text-secondary">Error Message: {message}</p>
        </div>

        <LinkButton href="/" className="text-white visited:text-white mt-4" variant="default">
          Goto Home Page
        </LinkButton>
      </CardDescription>
    </Card>
  );
};

export default ErrorCard;
