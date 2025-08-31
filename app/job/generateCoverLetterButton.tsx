"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { generateCoverLetter } from "./generateCoverLetter";

export default function GenerateCoverLetterButton({ jobId }: { jobId: number }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = async () => {
    startTransition(async () => {
      await generateCoverLetter(jobId);
      router.refresh();
    });
  };

  return (
    <Button type="button" onClick={handleClick} disabled={isPending}>
      {isPending ? "Generating..." : "Generate Cover Letter Template"}
    </Button>
  );
}
