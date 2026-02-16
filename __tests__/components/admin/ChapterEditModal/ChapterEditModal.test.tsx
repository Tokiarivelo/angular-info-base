import { render, screen } from '@testing-library/react';
import ChapterEditModal from '../../../../components/admin/ChapterEditModal/ChapterEditModal';
import { useChapterEditModal } from '../../../../components/admin/ChapterEditModal/ChapterEditModal.hooks';

// Mock the hook
jest.mock(
  '../../../../components/admin/ChapterEditModal/ChapterEditModal.hooks'
);

// Mock child components
jest.mock('../../../../components/admin/ChapterRichContentEditor', () => ({
  __esModule: true,
  default: () => <div data-testid="chapter-rich-content-editor" />,
}));

jest.mock('../../../../components/admin/AIChapterChat', () => ({
  __esModule: true,
  default: () => <div data-testid="ai-chapter-chat" />,
}));

describe('ChapterEditModal', () => {
  beforeEach(() => {
    (useChapterEditModal as jest.Mock).mockReturnValue({
      title: 'Test Chapter',
      setTitle: jest.fn(),
      description: 'Test Description',
      setDescription: jest.fn(),
      imageUrl: '',
      setImageUrl: jest.fn(),
      isUploadingImage: false,
      imageUploadError: null,
      handleImageUpload: jest.fn(),
      handleRemoveImage: jest.fn(),
      isGeneratingImage: false,
      imageGenerationError: null,
      handleGenerateImage: jest.fn(),
      livePreviewUrl: '',
      setLivePreviewUrl: jest.fn(),
      content: [],
      setContent: jest.fn(),
      fileInputRef: { current: null },
      isImporting: false,
      importError: null,
      handleFileImport: jest.fn(),
      triggerFileImport: jest.fn(),
      isDragging: false,
      handleDragOver: jest.fn(),
      handleDragEnter: jest.fn(),
      handleDragLeave: jest.fn(),
      handleDrop: jest.fn(),
      getUpdateData: jest.fn(),
    });
  });

  it('renders "Live Preview URL" label with correct classes (no block, has flex)', () => {
    // Mock required props
    const props = {
      isOpen: true,
      onClose: jest.fn(),
      onSave: jest.fn(),
      courseId: 'course-123',
    };

    render(<ChapterEditModal {...props} />);

    // Find the label containing "Live Preview URL"
    const label = screen.getByText(/Live Preview URL/i).closest('label');

    expect(label).toBeTruthy();
    // It should have 'flex' class
    expect(label).toHaveClass('flex');
    // It should NOT have 'block' class
    expect(label).not.toHaveClass('block');
    // Other classes
    expect(label).toHaveClass('items-center');
    expect(label).toHaveClass('gap-2');
  });
});
