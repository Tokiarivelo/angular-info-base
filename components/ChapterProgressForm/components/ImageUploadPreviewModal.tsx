'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import {
  X,
  Upload,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  Move,
  Maximize,
} from 'lucide-react';

interface ImageUploadPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (file: File) => void;
  isPending: boolean;
}

export default function ImageUploadPreviewModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: ImageUploadPreviewModalProps) {
  const t = useTranslations('chapterProgress.screenshots');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleClear = useCallback(() => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }, [previewUrl]);

  const handleConfirm = () => {
    if (file) {
      onConfirm(file);
    }
  };

  // Cleanup on unmount or close
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // If modal closed, clear state
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(handleClear, 300); // clear after animation
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[85vh] bg-[#1e1e1e] rounded-xl flex flex-col shadow-2xl border border-[#3e3e42] overflow-hidden m-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d2d2d] bg-[#252526]">
          <h3 className="text-lg font-semibold text-gray-200">
            {file
              ? t('previewTitle', { defaultMessage: 'Preview Selection' })
              : t('uploadTitle', { defaultMessage: 'Upload Screenshot' })}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#3e3e42] rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative bg-[#1e1e1e] flex flex-col">
          {!file ? (
            <div
              {...getRootProps()}
              className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed m-8 rounded-xl transition-all cursor-pointer ${
                isDragActive
                  ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
                  : 'border-[#3e3e42] hover:border-blue-500/50 hover:bg-[#2d2d2d]'
              }`}
            >
              <input {...getInputProps()} />
              <div className="w-20 h-20 bg-[#2d2d2d] rounded-full flex items-center justify-center mb-6 shadow-lg">
                <Upload
                  className={`w-10 h-10 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`}
                />
              </div>
              <p className="text-xl font-medium text-gray-300">
                {isDragActive
                  ? 'Drop image here...'
                  : 'Drag & drop your screenshot'}
              </p>
              <p className="text-sm text-gray-500 mt-2">or click to browse</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Controls Bar */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-[#2d2d2d]/90 backdrop-blur border border-[#3e3e42] p-2 rounded-full shadow-lg">
                <button
                  id="zoom-out-btn"
                  className="p-2 hover:bg-[#3e3e42] rounded-full text-gray-300 hover:text-white transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <button
                  id="zoom-reset-btn"
                  className="p-2 hover:bg-[#3e3e42] rounded-full text-gray-300 hover:text-white transition-colors"
                  title="Reset"
                >
                  <Maximize className="w-4 h-4" />
                </button>
                <button
                  id="zoom-in-btn"
                  className="p-2 hover:bg-[#3e3e42] rounded-full text-gray-300 hover:text-white transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>

                <div className="w-px h-6 bg-[#3e3e42] mx-1" />

                <button
                  onClick={handleClear}
                  className="p-2 hover:bg-red-900/30 text-red-400 hover:text-red-300 rounded-full transition-colors"
                  title="Change Image"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Zoom Area */}
              <div className="flex-1 w-full h-full overflow-hidden cursor-move bg-[#111111] relative flex items-center justify-center">
                {/* Grid pattern background */}
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(#4d4d4d 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />

                <div className="w-full h-full flex items-center justify-center">
                  <TransformWrapper
                    initialScale={0.9}
                    minScale={0.5}
                    maxScale={4}
                    centerOnInit
                    limitToBounds={false}
                  >
                    {({ zoomIn, zoomOut, resetTransform }) => (
                      <>
                        {/* Control Bindings - Hidden hack to connect external buttons to internal transform state */}
                        <ControlBinder
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
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={previewUrl!}
                            alt="Preview"
                            className="max-w-[90%] max-h-[90%] object-contain shadow-2xl rounded-sm ring-1 ring-white/10"
                          />
                        </TransformComponent>
                      </>
                    )}
                  </TransformWrapper>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="h-16 px-6 border-t border-[#2d2d2d] bg-[#252526] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!file || isPending}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-blue-500/20"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Confirm Upload</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper to bind external buttons to TransformWrapper controls
function ControlBinder({
  zoomIn,
  zoomOut,
  reset,
}: {
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
}) {
  useEffect(() => {
    const btnIn = document.getElementById('zoom-in-btn');
    const btnOut = document.getElementById('zoom-out-btn');
    const btnReset = document.getElementById('zoom-reset-btn');

    btnIn?.addEventListener('click', () => zoomIn());
    btnOut?.addEventListener('click', () => zoomOut());
    btnReset?.addEventListener('click', () => reset());

    return () => {
      btnIn?.removeEventListener('click', () => zoomIn());
      btnOut?.removeEventListener('click', () => zoomOut());
      btnReset?.removeEventListener('click', () => reset());
    };
  }, [zoomIn, zoomOut, reset]); // Dependencies are functions from Render Props, stable enough

  return null;
}
