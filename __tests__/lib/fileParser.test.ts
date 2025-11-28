import { parseCSV, parseMarkdown, parseFile } from '@/lib/fileParser';

describe('fileParser', () => {
  describe('parseCSV', () => {
    it('parses simple CSV with one column', () => {
      const content = `Task 1
Task 2
Task 3`;
      const result = parseCSV(content, 'tasks.csv');

      expect(result.title).toBe('Tasks');
      expect(result.items).toHaveLength(3);
      expect(result.items[0].title).toBe('Task 1');
      expect(result.items[1].title).toBe('Task 2');
      expect(result.items[2].title).toBe('Task 3');
    });

    it('parses CSV with title and notes columns', () => {
      const content = `Learn React,Read the documentation
Build a project,Create a todo app
Write tests,Use Jest`;
      const result = parseCSV(content, 'learning.csv');

      expect(result.items).toHaveLength(3);
      expect(result.items[0].title).toBe('Learn React');
      expect(result.items[0].notes).toBe('Read the documentation');
      expect(result.items[1].title).toBe('Build a project');
      expect(result.items[1].notes).toBe('Create a todo app');
    });

    it('skips header row if detected', () => {
      const content = `title,notes
Task 1,Note 1
Task 2,Note 2`;
      const result = parseCSV(content, 'tasks.csv');

      expect(result.items).toHaveLength(2);
      expect(result.items[0].title).toBe('Task 1');
    });

    it('handles quoted values with commas', () => {
      const content = `"Task with, comma","Note with, comma too"
Regular task,Regular note`;
      const result = parseCSV(content, 'test.csv');

      expect(result.items).toHaveLength(2);
      expect(result.items[0].title).toBe('Task with, comma');
      expect(result.items[0].notes).toBe('Note with, comma too');
    });

    it('throws error for empty file', () => {
      expect(() => parseCSV('', 'empty.csv')).toThrow('CSV file is empty');
    });

    it('generates title from filename', () => {
      const result = parseCSV('Task 1', 'my-project-tasks.csv');
      expect(result.title).toBe('My Project Tasks');
    });
  });

  describe('parseMarkdown', () => {
    it('parses task list items', () => {
      const content = `# My Checklist
- [ ] Task 1
- [x] Task 2
- [ ] Task 3`;
      const result = parseMarkdown(content, 'checklist.md');

      expect(result.title).toBe('My Checklist');
      expect(result.items).toHaveLength(3);
      expect(result.items[0].title).toBe('Task 1');
      expect(result.items[1].title).toBe('Task 2');
      expect(result.items[2].title).toBe('Task 3');
    });

    it('parses unordered list items', () => {
      const content = `- Item 1
- Item 2
* Item 3`;
      const result = parseMarkdown(content, 'list.md');

      expect(result.items).toHaveLength(3);
      expect(result.items[0].title).toBe('Item 1');
      expect(result.items[2].title).toBe('Item 3');
    });

    it('parses ordered list items', () => {
      const content = `1. First item
2. Second item
3. Third item`;
      const result = parseMarkdown(content, 'ordered.md');

      expect(result.items).toHaveLength(3);
      expect(result.items[0].title).toBe('First item');
      expect(result.items[1].title).toBe('Second item');
      expect(result.items[2].title).toBe('Third item');
    });

    it('uses first header as title', () => {
      const content = `# Project Tasks
## Description
- Task 1
- Task 2`;
      const result = parseMarkdown(content, 'project.md');

      expect(result.title).toBe('Project Tasks');
      expect(result.description).toBe('Description');
    });

    it('captures notes after list items', () => {
      const content = `- Task 1
Some notes about task 1
More details here
- Task 2`;
      const result = parseMarkdown(content, 'notes.md');

      expect(result.items[0].title).toBe('Task 1');
      expect(result.items[0].notes).toBe(
        'Some notes about task 1\nMore details here'
      );
      expect(result.items[1].title).toBe('Task 2');
      expect(result.items[1].notes).toBeNull();
    });

    it('throws error when no list items found', () => {
      const content = `# Just a header
Some paragraph text
No list items here`;
      expect(() => parseMarkdown(content, 'nolist.md')).toThrow(
        'No valid checklist items found'
      );
    });

    it('generates title from filename when no header', () => {
      const content = `- Task 1
- Task 2`;
      const result = parseMarkdown(content, 'my-tasks.md');

      expect(result.title).toBe('My Tasks');
    });
  });

  describe('parseFile', () => {
    it('routes CSV files to CSV parser', () => {
      const result = parseFile('Task 1\nTask 2', 'test.csv');
      expect(result.description).toContain('test.csv');
    });

    it('routes MD files to Markdown parser', () => {
      const result = parseFile('- Task 1\n- Task 2', 'test.md');
      expect(result.description).toContain('test.md');
    });

    it('routes .markdown files to Markdown parser', () => {
      const result = parseFile('- Task 1\n- Task 2', 'test.markdown');
      expect(result.description).toContain('test.markdown');
    });

    it('throws error for unsupported file types', () => {
      expect(() => parseFile('content', 'test.txt')).toThrow(
        'Unsupported file type'
      );
    });
  });
});
