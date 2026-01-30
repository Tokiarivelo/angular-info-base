'use client';

import 'ckeditor5/ckeditor5.css';

import { useEffect, useRef, useState, memo, useCallback } from 'react';
import { ImproveSelectionModal } from './BlockAIActions';
import { Sparkles } from 'lucide-react';

interface RichTextEditorProps {
  data: string;
  onChange: (data: string) => void;
  placeholder?: string;
}

// Memoize the component to prevent unnecessary re-renders
const RichTextEditor = memo(function RichTextEditor({
  data,
  onChange,
}: RichTextEditorProps) {
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [EditorComponent, setEditorComponent] = useState<any>(null);

  // AI selection improvement state
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [showImproveModal, setShowImproveModal] = useState(false);
  const [floatingMenuPosition, setFloatingMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  // Handle selection in the editor
  const handleEditorReady = useCallback((editor: any) => {
    editorRef.current = editor;

    // Listen for selection changes
    editor.model.document.selection.on('change:range', () => {
      const selection = editor.model.document.selection;
      const range = selection.getFirstRange();

      if (!selection.isCollapsed && range) {
        // Get the selected text
        let text = '';
        for (const item of range.getItems()) {
          if (item.is('$textProxy')) {
            text += item.data;
          }
        }

        if (text.trim()) {
          setSelectedText(text);

          // Get selection position for floating menu
          try {
            const domSelection = window.getSelection();
            if (domSelection && domSelection.rangeCount > 0) {
              const domRange = domSelection.getRangeAt(0);
              const rect = domRange.getBoundingClientRect();
              const containerRect =
                containerRef.current?.getBoundingClientRect();

              if (containerRect) {
                setFloatingMenuPosition({
                  top: rect.top - containerRect.top - 40, // Above selection
                  left: rect.left - containerRect.left + rect.width / 2,
                });
              }
            }
          } catch {
            // Fallback if DOM selection fails
            setFloatingMenuPosition(null);
          }
        } else {
          setSelectedText(null);
          setFloatingMenuPosition(null);
        }
      } else {
        setSelectedText(null);
        setFloatingMenuPosition(null);
      }
    });
  }, []);

  // Apply improved text to the editor - INSERT HTML PROPERLY
  const handleApplyImprovement = useCallback((improvedText: string) => {
    if (editorRef.current) {
      const editor = editorRef.current;

      editor.model.change(() => {
        const selection = editor.model.document.selection;
        if (!selection.isCollapsed) {
          // Delete the current selection
          editor.model.deleteContent(selection);

          // Parse HTML and insert as proper content (not plain text)
          const viewFragment = editor.data.processor.toView(improvedText);
          const modelFragment = editor.data.toModel(viewFragment);
          editor.model.insertContent(modelFragment);
        }
      });

      setSelectedText(null);
      setFloatingMenuPosition(null);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Dynamically import CKEditor modules only on client side
    const loadEditor = async () => {
      try {
        const [{ CKEditor }, ckeditor5Module] = await Promise.all([
          import('@ckeditor/ckeditor5-react'),
          import('ckeditor5'),
        ]);

        if (!isMounted) return;

        const {
          ClassicEditor,
          Essentials,
          Bold,
          Italic,
          Font,
          Link,
          List,
          Paragraph,
          BlockQuote,
          Heading,
          Autoformat,
          Indent,
        } = ckeditor5Module;

        // Create a custom editor class with plugins registered as builtinPlugins
        class CustomEditor extends ClassicEditor {
          public static builtinPlugins = [
            Essentials,
            Paragraph,
            Heading,
            Bold,
            Italic,
            Font,
            Link,
            List,
            BlockQuote,
            Autoformat,
            Indent,
          ];

          public static defaultConfig = {
            licenseKey: 'GPL',
            toolbar: {
              items: [
                'heading',
                '|',
                'bold',
                'italic',
                'fontColor',
                'fontBackgroundColor',
                'link',
                'bulletedList',
                'numberedList',
                '|',
                'outdent',
                'indent',
                '|',
                'blockQuote',
                'undo',
                'redo',
              ],
            },
          };
        }

        // Create a wrapper component with the loaded modules
        const EditorWrapper = ({
          editorData,
          onEditorChange,
          onReadyCallback,
        }: any) => (
          <CKEditor
            editor={CustomEditor as any}
            data={editorData}
            onReady={(editor: any) => {
              onReadyCallback(editor);
            }}
            onChange={(event: any, editor: any) => {
              const content = editor.getData();
              onEditorChange(content);
            }}
          />
        );

        setEditorComponent(() => EditorWrapper);
        setEditorLoaded(true);
      } catch (error) {
        console.error('Failed to load CKEditor:', error);
      }
    };

    loadEditor();

    return () => {
      isMounted = false;
      if (editorRef.current) {
        editorRef.current.destroy().catch((error: any) => {
          console.error('Error destroying editor:', error);
        });
      }
    };
  }, []);

  if (!editorLoaded || !EditorComponent) {
    return (
      <div className="animate-pulse h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <EditorComponent
        editorData={data}
        onEditorChange={onChange}
        onReadyCallback={handleEditorReady}
      />

      {/* Floating AI Menu - appears near selection */}
      {selectedText && floatingMenuPosition && (
        <div
          className="absolute z-20 transform -translate-x-1/2 animate-fade-in"
          style={{
            top: `${floatingMenuPosition.top}px`,
            left: `${floatingMenuPosition.left}px`,
          }}
        >
          <div className="flex items-center gap-1 px-2 py-1.5 bg-gray-900 dark:bg-gray-800 rounded-lg shadow-xl border border-gray-700">
            <button
              onClick={() => setShowImproveModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-medium rounded-md hover:from-purple-700 hover:to-blue-700 transition-all"
              title="Improve with AI"
            >
              <Sparkles className="w-3 h-3" />
              AI Improve
            </button>
          </div>
          {/* Arrow pointing down */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-1.5">
            <div className="w-3 h-3 bg-gray-900 dark:bg-gray-800 rotate-45 border-r border-b border-gray-700"></div>
          </div>
        </div>
      )}

      {/* Fallback button in corner when floating menu can't be positioned */}
      {selectedText && !floatingMenuPosition && (
        <div className="absolute right-2 top-2 z-10">
          <button
            onClick={() => setShowImproveModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-medium rounded-full shadow-lg hover:shadow-xl transition-all"
            title="Improve selected text with AI"
          >
            <Sparkles className="w-3 h-3" />
            AI Improve
          </button>
        </div>
      )}

      {/* Improve Selection Modal */}
      {showImproveModal && selectedText && (
        <ImproveSelectionModal
          selectedText={selectedText}
          onApply={handleApplyImprovement}
          onClose={() => setShowImproveModal(false)}
        />
      )}
    </div>
  );
});

export default RichTextEditor;
