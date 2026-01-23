'use client';

import 'ckeditor5/ckeditor5.css';

import { useEffect, useRef, useState, memo } from 'react';

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
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [EditorComponent, setEditorComponent] = useState<any>(null);

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
        // This is the correct approach for CKEditor 5 v47+ to avoid plugin conflicts
        // NOTE: Do NOT include Undo separately - it's already part of Essentials
        class CustomEditor extends ClassicEditor {
          public static builtinPlugins = [
            Essentials, // Includes: Clipboard, Enter, SelectAll, ShiftEnter, Typing, Undo
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
            licenseKey: 'GPL', // Use 'GPL' for open-source projects, or your commercial license key
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
        const EditorWrapper = ({ editorData, onEditorChange }: any) => (
          <CKEditor
            editor={CustomEditor as any}
            data={editorData}
            onReady={(editor: any) => {
              editorRef.current = editor;
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
      // Destroy editor instance on unmount
      if (editorRef.current) {
        editorRef.current.destroy().catch((error: any) => {
          console.error('Error destroying editor:', error);
        });
      }
    };
  }, []); // Only run once on mount

  if (!editorLoaded || !EditorComponent) {
    return (
      <div className="animate-pulse h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
    );
  }

  return <EditorComponent editorData={data} onEditorChange={onChange} />;
});

export default RichTextEditor;
