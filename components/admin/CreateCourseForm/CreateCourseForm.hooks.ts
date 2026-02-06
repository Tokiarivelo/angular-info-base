'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createCourse } from '@/lib/actions';
import { GeneratedCourseMetadata } from '@/lib/ai/prompts/course';

export type AIModel = { id: string; name: string };

export function useCreateCourseForm() {
  const [isPending, startTransition] = useTransition();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] =
    useState<GeneratedCourseMetadata | null>(null);

  const [models, setModels] = useState<AIModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(true);

  const router = useRouter();

  const fetchModels = async () => {
    setIsLoadingModels(true);
    try {
      // Add timestamp to prevent caching
      const response = await fetch(`/api/ai/models?t=${Date.now()}`);
      const data = await response.json();

      if (data && Array.isArray(data)) {
        setModels(data);
      }
    } catch (error) {
      console.error('Failed to fetch AI models:', error);
    } finally {
      setIsLoadingModels(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleCreateCourse = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await createCourse(formData);
        router.push('/admin/courses');
      } catch (error) {
        console.error('Failed to create course:', error);
      }
    });
  };

  const generateCourseMetadata = async (
    topic: string,
    model?: string,
    file?: File | null,
    targetTechnology?: string,
    instructions?: string,
    generationLanguage?: 'en' | 'fr'
  ) => {
    if (!topic.trim() && !file) return;

    setIsGenerating(true);
    try {
      let response;

      if (file) {
        const formData = new FormData();
        formData.append('topic', topic);
        if (model) formData.append('model', model);
        if (targetTechnology)
          formData.append('targetTechnology', targetTechnology);
        if (instructions) formData.append('instructions', instructions);
        if (generationLanguage)
          formData.append('generationLanguage', generationLanguage);
        formData.append('file', file);

        response = await fetch('/api/ai/generate-course-metadata', {
          method: 'POST',
          body: formData,
        });
      } else {
        response = await fetch('/api/ai/generate-course-metadata', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            topic,
            model,
            targetTechnology,
            instructions,
            generationLanguage,
          }),
        });
      }

      const result = await response.json();

      if (result.success && result.data) {
        setGeneratedData(result.data);
      } else {
        console.error('Failed to generate course metadata:', result.error);
        if (result.error) {
          alert(`AI Generation Failed: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('Error calling AI API:', error);
      alert('Error calling AI API. Check console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isPending,
    isGenerating,
    generatedData,
    models,
    isLoadingModels,
    handleCreateCourse,
    generateCourseMetadata,
    setGeneratedData, // Exported to allow manual clearing/overriding if needed
    fetchModels,
  };
}
