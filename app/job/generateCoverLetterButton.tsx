"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { generateCoverLetter } from "./generateCoverLetter";
import { LoaderIcon } from "lucide-react";

const GenerateCoverLetterButton = ({ jobId }: { jobId: number }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = async () => {
    startTransition(async () => {
      await generateCoverLetter(jobId);
      router.refresh();
    });
  };

  return (
    <Button type="button" onClick={handleClick} disabled={isPending} className="min-w-[280px]">
      {isPending ? <LoaderIcon className="animate-spin" /> : "Generate Cover Letter Template"}
    </Button>
  );
};

export default GenerateCoverLetterButton;
