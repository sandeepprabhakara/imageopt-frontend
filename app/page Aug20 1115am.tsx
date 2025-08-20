// app/page.tsx

"use client";

import { useState } from "react";
import { PromptStep } from "@/components/prompt-step";
import { RatingStep } from "@/components/rating-step";
import { FinalImageStep } from "@/components/final-image-step";
import { generateInitialImages, generateFinalImage, ImageResponse } from "@/lib/api";

// --- DEFAULT VALUES FOR THE FORM ---
const defaultBasePrompt = `Project Brief: OPDIVO Qvantig Advertisement
Core Concept: The image presents a clean, professional advertisement for OPDIVO Qvantig. The central visual is a photorealistic syringe, positioned horizontally. Instead of being filled with liquid, the glass barrel contains a warm, inviting scene of an elderly couple relaxing in their living room, symbolizing the quality of life the treatment aims to provide.
Layout & Branding:
Top Left: The branding "OPDIVO Qvantig™" is prominent in a bold, dark blue sans-serif font, with a signature orange swoosh. Below this, in a smaller grey font, are the generic name ("nivolumab + hyaluronidase-nvhy") and "dosage details".
Key Visual Elements:
The Syringe: This is the hero element. It must look sterile and high-tech. The glass barrel is perfectly clear, containing the miniature scene. The left end shows an abstract blend of orange, black, and teal colors representing the medication. The right end features a detailed, translucent teal plastic hub and a sharp, metallic needle.
The Miniature Scene: Inside the syringe, depict an elderly couple sitting comfortably on a beige sofa in a bright, modern living room. The scene should feel warm and happy, using natural tones with pops of orange and blue in the pillows to connect with the branding colors.`;

const defaultAttributes = [
    { "typography": "The overall feel of the text is modern, clean, and clinical.", "background and color palette": "The background is a simple, soft gradient of light grey and pale blue, creating a clean, clinical feel.", "overall mood": "The final image must balance a sterile, professional aesthetic with a message of warmth, hope, and a return to normal life." },
    { "typography": "The typography has a humanistic and accessible feel, using a slightly rounded sans-serif font.", "background and color palette": "The background is a warm, creamy off-white with a soft, out-of-focus golden light.", "overall mood": "The final image feels overwhelmingly optimistic and reassuring." },
    { "typography": "The text is bold, confident, and authoritative, using an impactful, sharp sans-serif font.", "background and color palette": "The background is a solid, deep navy blue, creating a high-contrast, premium look.", "overall mood": "The final image conveys a message of power, confidence, and cutting-edge science." }
];

export default function Home() {
  const [appStep, setAppStep] = useState("prompt");
  const [isLoading, setIsLoading] = useState(false);
  const [initialImages, setInitialImages] = useState<ImageResponse[]>([]);
  const [finalImageUrl, setFinalImageUrl] = useState("");

  // NEW: State for the editable prompt and attributes, initialized with defaults
  const [basePrompt, setBasePrompt] = useState(defaultBasePrompt);
  const [attributes, setAttributes] = useState(defaultAttributes);

  const handleInitialGeneration = async () => {
    setIsLoading(true);
    try {
      // Now we pass the current state of the attributes to the API
      const images = await generateInitialImages(basePrompt, attributes);
      setInitialImages(images);
      setAppStep("rating");
    } catch (error) {
      console.error(error);
      alert("There was an error generating the images. Please check the console.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalGeneration = async (feedbackData: any[]) => {
    setIsLoading(true);
    try {
      const finalUrl = await generateFinalImage(basePrompt, feedbackData);
      setFinalImageUrl(finalUrl);
      setAppStep("final");
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
          <PromptStep
            basePrompt={basePrompt}
            setBasePrompt={setBasePrompt}
            attributes={attributes}
            setAttributes={setAttributes}
            onSubmit={handleInitialGeneration}
            isLoading={isLoading}
          />
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