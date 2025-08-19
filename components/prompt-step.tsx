// components/prompt-step.tsx

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PromptStepProps {
  basePrompt: string;
  setBasePrompt: (value: string) => void;
  attributes: any[];
  setAttributes: (value: any[]) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function PromptStep({ basePrompt, setBasePrompt, attributes, setAttributes, onSubmit, isLoading }: PromptStepProps) {

  // Handler for changing an attribute's value (the description)
  const handleAttributeValueChange = (optionIndex: number, attrName: string, newValue: string) => {
    const newAttributes = [...attributes];
    newAttributes[optionIndex] = { ...newAttributes[optionIndex], [attrName]: newValue };
    setAttributes(newAttributes);
  };

  // Handler for changing an attribute's name (the key)
  const handleAttributeNameChange = (optionIndex: number, oldAttrName: string, newAttrName: string) => {
    const newAttributes = [...attributes];
    const oldOption = newAttributes[optionIndex];
    const newOption = Object.fromEntries(
      Object.entries(oldOption).map(([key, value]) => (key === oldAttrName ? [newAttrName, value] : [key, value]))
    );
    newAttributes[optionIndex] = newOption;
    setAttributes(newAttributes);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Step 1: Describe Your Vision</CardTitle>
          <CardDescription>Start with a detailed core concept. This will be the foundation for all generated images.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            id="base-prompt"
            rows={10}
            value={basePrompt}
            onChange={(e) => setBasePrompt(e.target.value)}
            disabled={isLoading}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Define Creative Directions</CardTitle>
          <CardDescription>Provide three distinct variations for the AI to explore. You can edit both the attribute names and their descriptions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="option-1">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="option-1">Option 1</TabsTrigger>
              <TabsTrigger value="option-2">Option 2</TabsTrigger>
              <TabsTrigger value="option-3">Option 3</TabsTrigger>
            </TabsList>

            {attributes.map((option, optionIndex) => (
              <TabsContent key={optionIndex} value={`option-${optionIndex + 1}`} className="space-y-4 pt-4">
                {Object.entries(option).map(([attrName, attrValue]) => (
                  <div key={attrName} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start">
                    <Input
                      value={attrName}
                      onChange={(e) => handleAttributeNameChange(optionIndex, attrName, e.target.value)}
                      className="md:col-span-1 font-semibold"
                      disabled={isLoading}
                    />
                    <Textarea
                      value={attrValue as string}
                      onChange={(e) => handleAttributeValueChange(optionIndex, attrName, e.target.value)}
                      className="md:col-span-2"
                      rows={3}
                      disabled={isLoading}
                    />
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Button
        className="w-full"
        size="lg"
        onClick={onSubmit}
        disabled={isLoading || !basePrompt}
      >
        {isLoading ? "Generating..." : "Generate Initial Images"}
      </Button>
    </div>
  );
}