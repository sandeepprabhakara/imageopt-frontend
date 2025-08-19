// components/final-image-step.tsx

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface FinalImageStepProps {
  imageUrl: string;
}

export function FinalImageStep({ imageUrl }: FinalImageStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Step 3: Your Final Image</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="bg-gray-200 aspect-video rounded-md flex items-center justify-center relative overflow-hidden">
          {imageUrl ? (
            <Image src={imageUrl} alt="Final Generated Image" fill className="object-contain" />
          ) : (
            <p className="text-gray-500">Loading final image...</p>
          )}
        </div>

        {/* --- THIS IS THE CORRECTED SECTION --- */}
        <div className="grid grid-cols-2 gap-4">
          {/* The <a> tag no longer needs w-full, as the grid handles the width */}
          <a href={imageUrl} download={`final-image-${Date.now()}.png`}>
            <Button className="w-full" disabled={!imageUrl}>
              Download Image
            </Button>
          </a>

          {/* This button also no longer needs w-full */}
          <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
            Start Over
          </Button>
        </div>
        {/* --- END OF CORRECTION --- */}

      </CardContent>
    </Card>
  );
}