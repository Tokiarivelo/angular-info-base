'use client';

import { useState, useEffect } from 'react';
import { Screenshot } from '@/types/chapter.types';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import {
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  FileImage,
  Maximize,
} from 'lucide-react';
import ImageUploadPreviewModal from './ImageUploadPreviewModal';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface ChapterScreenshotUploadProps {
  screenshots: Screenshot[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  isUploading: boolean;
  uploadError: string | null;
  isPending: boolean;
}

export default function ChapterScreenshotUpload({
  screenshots,
  onUpload,
  onRemove,
  isUploading,
  uploadError,
  isPending,
}: ChapterScreenshotUploadProps) {
  const t = useTranslations('chapterProgress.screenshots');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-select the last screenshot (newest) if none selected
  useEffect(() => {
    if (screenshots.length > 0) {
      // If currently selected ID is invalid (removed) or no selection, select the last one
      const exists = screenshots.find((s) => s.id === selectedId);
      if (!selectedId || !exists) {
        setSelectedId(screenshots[screenshots.length - 1].id);
      }
    } else {
      setSelectedId(null);
    }
  }, [screenshots, selectedId]);

  const selectedScreenshot = screenshots.find((s) => s.id === selectedId);

  const handleModalConfirm = async (file: File) => {
    // Create a synthetic event to match the expected handler signature
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    const syntheticEvent = {
      target: {
        files: dataTransfer.files,
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await onUpload(syntheticEvent);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col h-full bg-[#1e1e1e] border border-[#3e3e42] rounded-lg shadow-2xl overflow-hidden text-[#d4d4d4] font-sans">
        {/* Toolbar / Header */}
        <div className="h-12 bg-[#2d2d2d] border-b border-[#1e1e1e] flex items-center justify-between px-4 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-sm tracking-wide text-gray-200">
              {t('title')}
            </span>
            <span className="text-xs text-gray-500 bg-[#1e1e1e] px-2 py-0.5 rounded-full border border-[#3e3e42]">
              {screenshots.length} / 10
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Upload Action - Triggers Modal */}
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={isUploading || isPending}
              className={`flex items-center gap-2 px-3 py-1.5 bg-[#0078d4] hover:bg-[#006cc1] text-white text-xs font-semibold rounded cursor-pointer transition-colors ${
                isUploading || isPending ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isUploading ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              <span>{t('uploadPrompt')}</span>
            </button>

            <div className="h-4 w-px bg-[#3e3e42] mx-1" />

            <button
              id="main-zoom-in"
              className="p-1.5 hover:bg-[#3e3e42] rounded text-gray-400 hover:text-white transition-colors"
              title="Zoom In"
              disabled={!selectedScreenshot}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              id="main-zoom-reset"
              className="p-1.5 hover:bg-[#3e3e42] rounded text-gray-400 hover:text-white transition-colors"
              title="Reset Zoom"
              disabled={!selectedScreenshot}
            >
              <Maximize className="w-4 h-4" />
            </button>
            <button
              id="main-zoom-out"
              className="p-1.5 hover:bg-[#3e3e42] rounded text-gray-400 hover:text-white transition-colors"
              title="Zoom Out"
              disabled={!selectedScreenshot}
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            {selectedScreenshot && (
              <button
                onClick={() => onRemove(selectedScreenshot.id)}
                className="p-1.5 hover:bg-[#3e3e42] hover:text-red-400 rounded text-gray-400 transition-colors ml-1"
                title="Delete current page"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar (Pellicule / Thumbnails) */}
          <div className="w-48 bg-[#252526] border-r border-[#1e1e1e] flex flex-col">
            <div className="overflow-y-auto flex-1 p-3 space-y-4 scrollbar-thin scrollbar-thumb-[#424242] scrollbar-track-transparent">
              {screenshots.map((s, idx) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className={`group relative cursor-pointer flex flex-col items-center gap-1.5 ${selectedId === s.id ? 'opacity-100' : 'opacity-60 hover:opacity-90'}`}
                >
                  <div
                    className={`relative w-full aspect-[3/4] bg-black rounded shadow-sm border-2 transition-all overflow-hidden ${
                      selectedId === s.id
                        ? 'border-[#0078d4] ring-2 ring-[#0078d4]/20'
                        : 'border-transparent group-hover:border-[#3e3e42]'
                    }`}
                  >
                    <Image
                      src={s.url}
                      alt={`Page ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />

                    {/* Page Number Badge */}
                    <div
                      className={`absolute bottom-1 right-1 px-1.5 py-0.5 text-[10px] font-bold rounded shadow-sm z-10 ${
                        selectedId === s.id
                          ? 'bg-[#0078d4] text-white'
                          : 'bg-black/60 text-gray-300'
                      }`}
                    >
                      {idx + 1}
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty State in Sidebar */}
              {screenshots.length === 0 && (
                <div className="text-center py-8 text-xs text-gray-500 italic">
                  Empty
                </div>
              )}
            </div>
          </div>

          {/* Main Content (Large Preview) */}
          <div className="flex-1 bg-[#1e1e1e] relative overflow-hidden flex flex-col items-center justify-center p-0">
            {/* Using overflow-hidden on parent and TransformWrapper handles the rest */}
            {selectedScreenshot ? (
              <TransformWrapper
                initialScale={1}
                minScale={0.5}
                maxScale={4}
                centerOnInit
                limitToBounds={false}
              >
                {({ zoomIn, zoomOut, resetTransform }) => (
                  <>
                    <MainViewControlBinder
                      zoomIn={zoomIn}
                      zoomOut={zoomOut}
                      reset={resetTransform}
                    />
                    <TransformComponent
                      wrapperStyle={{ width: '100%', height: '100%' }}
                      contentStyle={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem',
                      }}
                    >
                      <div className="relative shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-white transition-transform duration-200">
                        {/* Simulated PDF Page Look */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={selectedScreenshot.url}
                          alt="Full Preview"
                          className="max-w-full max-h-[calc(100vh-250px)] w-auto h-auto object-contain block"
                        />
                      </div>
                    </TransformComponent>
                  </>
                )}
              </TransformWrapper>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-500 opacity-60 bg-[#252526] p-8 rounded-xl border border-[#2d2d2d] border-dashed m-12">
                <FileImage className="w-16 h-16 mb-4 stroke-1" />
                <p className="text-lg font-medium">{t('uploadPrompt')}</p>
                <p className="text-sm mt-2 max-w-xs text-center text-gray-400">
                  Upload screenshots to prove your completion of the chapter.
                </p>
              </div>
            )}

            {uploadError && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-900/90 text-red-100 px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 z-50">
                {uploadError}
              </div>
            )}
          </div>
        </div>
      </div>

      <ImageUploadPreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleModalConfirm}
        isPending={isUploading || isPending}
      />
    </>
  );
}

// Helper to bind external buttons to Main View Zoom controls
function MainViewControlBinder({
  zoomIn,
  zoomOut,
  reset,
}: {
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
}) {
  useEffect(() => {
    const btnIn = document.getElementById('main-zoom-in');
    const btnOut = document.getElementById('main-zoom-out');
    const btnReset = document.getElementById('main-zoom-reset');

    const handleIn = (e: Event) => {
      e.preventDefault();
      zoomIn();
    };
    const handleOut = (e: Event) => {
      e.preventDefault();
      zoomOut();
    };
    const handleReset = (e: Event) => {
      e.preventDefault();
      reset();
    };

    btnIn?.addEventListener('click', handleIn);
    btnOut?.addEventListener('click', handleOut);
    btnReset?.addEventListener('click', handleReset);

    return () => {
      btnIn?.removeEventListener('click', handleIn);
      btnOut?.removeEventListener('click', handleOut);
      btnReset?.removeEventListener('click', handleReset);
    };
  }, [zoomIn, zoomOut, reset]);

  return null;
}
