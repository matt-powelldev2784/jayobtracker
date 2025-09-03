import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TriangleAlert } from "lucide-react";
import { LinkButton } from "./button";

type ErrorCardProps = {
  message: string;
};

const ErrorCard = ({ message }: ErrorCardProps) => {
  return (
    <Card className="w-11/12 max-w-[700px] mt-8 pb-8 border-2 border-2-secondary rounded-2xl">
      <CardHeader className="bg-primary p-4">
        <TriangleAlert className="h-16 w-16 text-white" />
        <CardTitle className="text-center text-white">Error</CardTitle>
      </CardHeader>

      <CardDescription className="flex flex-col items-center gap-4 text-center">
        <div>
          <CardTitle className="text-center text-black font-normal px-2">
            The application has encountered an Error. Please try again later.
          </CardTitle>
          <p className="text-secondary px-2">Error Message: {message}</p>
        </div>

        <LinkButton href="/" className="text-white visited:text-white mt-4" variant="default">
          Goto Home Page
        </LinkButton>
      </CardDescription>
    </Card>
  );
};

export default ErrorCard;
