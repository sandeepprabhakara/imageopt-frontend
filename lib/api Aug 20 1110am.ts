// lib/api.ts

// This defines the structure of the data we expect from the backend
export interface ImageResponse {
  imageUrl: string;
  attributes: {
    typography: string;
    "background and color palette": string;
    "overall mood": string;
  };
}

// This function calls our FastAPI backend's /generate-initial-images endpoint
export async function generateInitialImages(basePrompt: string, attributes: any[]): Promise<ImageResponse[]> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const response = await fetch(`${apiBaseUrl}/generate-initial-images`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      base_prompt: basePrompt,
      attributes: attributes,
    }),
  });

  if (!response.ok) {
    // If the server responds with an error, we'll throw an error
    throw new Error('Failed to generate images');
  }

  return response.json();
}



// lib/api.ts

// ... (the existing ImageResponse interface and generateInitialImages function are at the top) ...

// NEW: Define the structure of the data we will send for the final image
interface FeedbackItem {
  attributes: any;
  ratings: {
    typography: number;
    "background and color palette": number;
    "overall mood": number;
  };
}

// NEW: The function to call our final generation endpoint
export async function generateFinalImage(basePrompt: string, feedbackData: FeedbackItem[]): Promise<string> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const response = await fetch(`${apiBaseUrl}/generate-final-image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      base_prompt: basePrompt,
      feedback_data: feedbackData,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate the final image');
  }

  const result = await response.json();
  return result.finalImageUrl;
}