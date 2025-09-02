"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { generateCoverLetter } from "./generateCoverLetter";
import { LoaderIcon } from "lucide-react";

const GenerateCoverLetterButton = ({ jobId }: { jobId: number }) => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = async () => {
    setError("");

    startTransition(async () => {
      const getCoverLetter = await generateCoverLetter(jobId);
      if (!getCoverLetter.success) {
        return setError(getCoverLetter.error || "An unknown error occurred");
      }
      router.refresh();
    });
  };

  return (
    <>
      <Button type="button" onClick={handleClick} disabled={isPending} className="min-w-[280px]">
        {isPending ? <LoaderIcon className="animate-spin" /> : "Generate Cover Letter Template"}
      </Button>

      {error && <p className="text-red-500">{error}</p>}
    </>
  );
};

export default GenerateCoverLetterButton;
