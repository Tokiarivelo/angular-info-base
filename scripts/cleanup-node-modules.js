#!/usr/bin/env node

/**
 * Cleanup script to remove large unnecessary files from node_modules
 * This helps reduce disk space usage during Vercel deployment
 * Specifically targets CKEditor5's large dist files that cause ENOSPC errors
 */

import { readdir, stat, unlink, rmdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const NODE_MODULES = join(__dirname, '..', 'node_modules');

// Patterns to remove (these are not needed in production)
const PATTERNS_TO_REMOVE = [
  '*.map',           // Source maps
  '*.ts',            // TypeScript source files (in dist folders)
  'README.md',       // Documentation
  'CHANGELOG.md',    // Change logs
  'LICENSE.txt',     // Already in LICENSE
  'CONTRIBUTING.md', // Contributing guidelines
];

// Directories to remove entirely
const DIRS_TO_REMOVE = [
  'test',
  'tests',
  '__tests__',
  'docs',
  'examples',
  'example',
  'coverage',
  '.github',
];

let totalSize = 0;
let filesRemoved = 0;
let dirsRemoved = 0;

async function getFileSize(path) {
  try {
    const stats = await stat(path);
    return stats.size;
  } catch {
    return 0;
  }
}

async function shouldRemove(filename, parentPath) {
  // Remove source maps
  if (filename.endsWith('.map')) {
    return true;
  }
  
  // Remove TypeScript files from dist directories
  if (filename.endsWith('.ts') && parentPath.includes('/dist/')) {
    return true;
  }
  
  // Remove documentation files
  const docFiles = ['README.md', 'CHANGELOG.md', 'CONTRIBUTING.md', 'LICENSE.txt'];
  if (docFiles.includes(filename)) {
    return true;
  }
  
  return false;
}

async function removeDirRecursive(dirPath) {
  try {
    const entries = await readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);
      if (entry.isDirectory()) {
        await removeDirRecursive(fullPath);
      } else {
        const size = await getFileSize(fullPath);
        await unlink(fullPath);
        totalSize += size;
        filesRemoved++;
      }
    }
    
    await rmdir(dirPath);
    dirsRemoved++;
  } catch (error) {
    // Silently continue if we can't remove something
  }
}

async function cleanDirectory(dirPath) {
  try {
    const entries = await readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        // Remove entire directories that match patterns
        if (DIRS_TO_REMOVE.includes(entry.name)) {
          console.log(`Removing directory: ${fullPath.replace(NODE_MODULES, 'node_modules')}`);
          await removeDirRecursive(fullPath);
        } else {
          // Recursively clean subdirectories
          await cleanDirectory(fullPath);
        }
      } else {
        // Remove individual files that match patterns
        if (await shouldRemove(entry.name, dirPath)) {
          const size = await getFileSize(fullPath);
          await unlink(fullPath);
          totalSize += size;
          filesRemoved++;
        }
      }
    }
  } catch (error) {
    // Silently continue if we can't access a directory
  }
}

async function main() {
  console.log('🧹 Cleaning up node_modules to reduce disk space...');
  console.log('📦 Targeting: source maps, docs, tests, and examples');
  
  try {
    const startTime = Date.now();
    await cleanDirectory(NODE_MODULES);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    const savedMB = (totalSize / (1024 * 1024)).toFixed(2);
    console.log(`✅ Cleanup complete in ${duration}s`);
    console.log(`📉 Removed ${filesRemoved} files and ${dirsRemoved} directories`);
    console.log(`💾 Saved approximately ${savedMB} MB of disk space`);
  } catch (error) {
    console.error('⚠️  Cleanup encountered an error:', error.message);
    // Don't fail the installation if cleanup fails
    process.exit(0);
  }
}

main();
