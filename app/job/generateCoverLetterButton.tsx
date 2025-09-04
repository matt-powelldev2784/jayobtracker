"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { generateCoverLetter } from "./generateCoverLetter";
import { LoaderIcon } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { GptModel } from "@/ts/gptModel";

type ModelOption = {
  value: GptModel;
  label: string;
};

const modelOptions: ModelOption[] = [
  { value: "gpt-5", label: "GPT-5" },
  { value: "gpt-4o", label: "GPT-4o" },
];

const GenerateCoverLetterButton = ({ jobId }: { jobId: number }) => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [gptModel, setGptModel] = useState<GptModel>("gpt-5");
  const router = useRouter();

  const setGPTModel = (value: GptModel) => {
    setGptModel(value);
  };

  const handleClick = async () => {
    setError("");
    startTransition(async () => {
      const getCoverLetter = await generateCoverLetter({ jobId, gptModel });
      if (!getCoverLetter.success) {
        return setError(getCoverLetter.error || "An unknown error occurred");
      }
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-2 items-center w-full">
      <label htmlFor="gpt-model" className="font-medium text-sm text-muted-foreground mb-1">
        Select AI Model
      </label>
      <Select value={gptModel} onValueChange={setGPTModel} disabled={isPending}>
        <SelectTrigger className="w-full bg-white focus-visible:ring-1 max-w-[300px]">
          <SelectValue placeholder="Select model" />
        </SelectTrigger>
        <SelectContent>
          {modelOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {gptModel === "gpt-5" && (
        <p className="text-xs text-muted-foreground bg-yellow-50 border border-yellow-200 rounded px-3 py-2 mb-2 w-full max-w-lg text-center">
          The cover letter may take a few minutes to generate using the GPT-5 model.
          <br />
          <span className="font-semibold">If you are in a hurry, please select GPT-4o.</span>
        </p>
      )}

      <Button type="button" onClick={handleClick} disabled={isPending} className="min-w-[280px] w-[300px]">
        {isPending ? <LoaderIcon className="animate-spin" /> : "Generate Cover Letter Template"}
      </Button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default GenerateCoverLetterButton;