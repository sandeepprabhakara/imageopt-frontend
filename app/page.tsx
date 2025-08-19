// app/page.tsx

"use client";

import { useState } from "react";
import { PromptStep } from "@/components/prompt-step";
import { RatingStep } from "@/components/rating-step";
import { FinalImageStep } from "@/components/final-image-step";
import { generateInitialImages, generateFinalImage, ImageResponse } from "@/lib/api";

const initialAttributes = [
    { "typography": "The overall feel of the text is modern, clean, and clinical.", "background and color palette": "The background is a simple, soft gradient of light grey and pale blue, creating a clean, clinical feel.", "overall mood": "The final image must balance a sterile, professional aesthetic with a message of warmth, hope, and a return to normal life." },
    { "typography": "The typography has a humanistic and accessible feel, using a slightly rounded sans-serif font.", "background and color palette": "The background is a warm, creamy off-white with a soft, out-of-focus golden light.", "overall mood": "The final image feels overwhelmingly optimistic and reassuring." },
    { "typography": "The text is bold, confident, and authoritative, using an impactful, sharp sans-serif font.", "background and color palette": "The background is a solid, deep navy blue, creating a high-contrast, premium look.", "overall mood": "The final image conveys a message of power, confidence, and cutting-edge science." }
];

export default function Home() {
  const [appStep, setAppStep] = useState("prompt");
  const [isLoading, setIsLoading] = useState(false);
  const [initialImages, setInitialImages] = useState<ImageResponse[]>([]);
  const [basePrompt, setBasePrompt] = useState("");
  const [finalImageUrl, setFinalImageUrl] = useState(""); // NEW: State for the final image URL

  const handleInitialGeneration = async (prompt: string) => {
    setIsLoading(true);
    setBasePrompt(prompt);
    try {
      const images = await generateInitialImages(prompt, initialAttributes);
      setInitialImages(images);
      setAppStep("rating");
    } catch (error) {
      console.error(error);
      alert("There was an error generating the images. Please check the console.");
    } finally {
      setIsLoading(false);
    }
  };

  // NEW: Handler function for the final generation step
  const handleFinalGeneration = async (feedbackData: any[]) => {
    setIsLoading(true);
    try {
      const finalUrl = await generateFinalImage(basePrompt, feedbackData);
      setFinalImageUrl(finalUrl);
      setAppStep("final"); // Move to the final step
    } catch (error) {
      console.error(error);
      alert("There was an error generating the final image. Please check the console.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-12 bg-gray-50">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-2">Image Optimizer AI</h1>
        <p className="text-center text-gray-600 mb-8">
          Refine your vision. Let AI generate the perfect image based on your feedback.
        </p>

        {appStep === "prompt" && (
          <PromptStep onSubmit={handleInitialGeneration} isLoading={isLoading} />
        )}

        {appStep === "rating" && (
          <RatingStep
            images={initialImages}
            onSubmit={handleFinalGeneration}
            isLoading={isLoading}
          />
        )}

        {appStep === "final" && (
          <FinalImageStep imageUrl={finalImageUrl} />
        )}
      </div>
    </main>
  );
}