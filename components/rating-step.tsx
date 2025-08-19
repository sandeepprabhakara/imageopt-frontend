// components/rating-step.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ImageResponse } from "@/lib/api";
import Image from "next/image";

interface RatingStepProps {
  images: ImageResponse[];
  onSubmit: (feedbackData: any[]) => void;
  isLoading: boolean;
}

export function RatingStep({ images, onSubmit, isLoading }: RatingStepProps) {
  // Create a state to hold the ratings for all images
  const [ratings, setRatings] = useState(() =>
    images.map(() => ({
      typography: 3,
      "background and color palette": 3,
      "overall mood": 3,
    }))
  );

  // Function to update the rating for a specific image and attribute
  const handleRatingChange = (imageIndex: number, attribute: string, value: number) => {
    const newRatings = [...ratings];
    newRatings[imageIndex] = { ...newRatings[imageIndex], [attribute]: value };
    setRatings(newRatings);
  };

  const handleSubmit = () => {
    // Combine the original attributes with the new ratings
    const feedbackData = images.map((imageInfo, index) => ({
      attributes: imageInfo.attributes,
      ratings: ratings[index],
    }));
    onSubmit(feedbackData);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">Step 2: Rate the Initial Options</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {images.map((imageInfo, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="aspect-video relative rounded-t-md overflow-hidden">
                <Image src={imageInfo.imageUrl} alt={`Generated Option ${index + 1}`} fill className="object-cover" />
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium">Typography</label>
                <Slider
                  value={[ratings[index].typography]}
                  onValueChange={(value) => handleRatingChange(index, "typography", value[0])}
                  max={5} step={1} disabled={isLoading}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Background</label>
                <Slider
                  value={[ratings[index]["background and color palette"]]}
                  onValueChange={(value) => handleRatingChange(index, "background and color palette", value[0])}
                  max={5} step={1} disabled={isLoading}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Overall Mood</label>
                <Slider
                  value={[ratings[index]["overall mood"]]}
                  onValueChange={(value) => handleRatingChange(index, "overall mood", value[0])}
                  max={5} step={1} disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button className="w-full" size="lg" onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Generating Final Image..." : "Create Final Image"}
      </Button>
    </div>
  );
}