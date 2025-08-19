// components/prompt-step.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface PromptStepProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

export function PromptStep({ onSubmit, isLoading }: PromptStepProps) {
  const [prompt, setPrompt] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 1: Describe Your Vision</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="base-prompt" className="block text-sm font-medium text-gray-700 mb-1">
            Describe the core concept of the image you want to create.
          </label>
          <Textarea
            id="base-prompt"
            rows={10}
            placeholder="e.g., Project Brief: OPDIVO Qvantig Advertisement..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <Button
          className="w-full"
          onClick={() => onSubmit(prompt)}
          disabled={isLoading || !prompt}
        >
          {isLoading ? "Generating..." : "Generate Initial Images"}
        </Button>
      </CardContent>
    </Card>
  );
}