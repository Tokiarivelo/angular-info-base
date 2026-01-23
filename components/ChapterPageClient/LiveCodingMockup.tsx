'use client';

import { FileJson, Folder, Terminal } from 'lucide-react';

export default function LiveCodingMockup() {
  return (
    <div className="flex bg-[#1e1e1e] text-gray-300 font-mono text-sm h-full rounded-lg overflow-hidden border border-[#333]">
      {/* Sidebar Explorer */}
      <div className="w-64 border-r border-[#333] hidden md:flex flex-col">
        <div className="p-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
          Explorer
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-1 hover:bg-[#2a2d2e] cursor-pointer flex items-center gap-2 text-blue-400">
            <Folder className="w-4 h-4" />
            <span>src</span>
          </div>
          <div className="px-8 py-1 hover:bg-[#2a2d2e] cursor-pointer flex items-center gap-2 text-yellow-400">
            <Folder className="w-4 h-4" />
            <span>app</span>
          </div>
          <div className="px-12 py-1 bg-[#37373d] text-white flex items-center gap-2">
            <span className="text-blue-400">TS</span>
            <span>user-card.component.ts</span>
          </div>
          <div className="px-12 py-1 hover:bg-[#2a2d2e] cursor-pointer flex items-center gap-2">
            <span className="text-orange-400">HTML</span>
            <span>user-card.component.html</span>
          </div>
          <div className="px-12 py-1 hover:bg-[#2a2d2e] cursor-pointer flex items-center gap-2">
            <span className="text-blue-300">CSS</span>
            <span>user-card.component.css</span>
          </div>
          <div className="px-4 py-1 hover:bg-[#2a2d2e] cursor-pointer flex items-center gap-2 mt-2">
            <FileJson className="w-4 h-4 text-yellow-400" />
            <span>angular.json</span>
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Editor Tabs */}
        <div className="flex border-b border-[#333] bg-[#252526]">
          <div className="px-4 py-2 bg-[#1e1e1e] border-t-2 border-blue-500 text-white flex items-center gap-2 text-xs">
            <span className="text-blue-400">TS</span>
            user-card.component.ts
            <span className="ml-2 hover:bg-[#333] rounded-sm p-0.5 cursor-pointer">
              ×
            </span>
          </div>
          <div className="px-4 py-2 text-gray-500 hover:bg-[#2a2d2e] cursor-pointer flex items-center gap-2 text-xs border-r border-[#333]">
            <span className="text-orange-400">HTML</span>
            user-card.component.html
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="flex">
            <div className="text-gray-600 text-right pr-4 select-none mr-2 border-r border-[#333]">
              1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9<br />
              10
              <br />
              11
              <br />
              12
              <br />
              13
              <br />
              14
              <br />
              15
              <br />
              16
              <br />
              17
              <br />
              18
            </div>
            <div className="text-[#d4d4d4]">
              <div>
                <span className="text-[#c586c0]">import</span>{' '}
                {'{ Component, Input }'}{' '}
                <span className="text-[#c586c0]">from</span>{' '}
                <span className="text-[#ce9178]">
                  &apos;@angular/core&apos;
                </span>
                ;
              </div>
              <br />
              <div>
                <span className="text-[#569cd6]">@Component</span>({'{'}
              </div>
              <div className="pl-4">
                <span className="text-[#9cdcfe]">selector</span>:{' '}
                <span className="text-[#ce9178]">
                  &apos;app-user-card&apos;
                </span>
                ,
              </div>
              <div className="pl-4">
                <span className="text-[#9cdcfe]">templateUrl</span>:{' '}
                <span className="text-[#ce9178]">
                  &apos;./user-card.component.html&apos;
                </span>
                ,
              </div>
              <div className="pl-4">
                <span className="text-[#9cdcfe]">styleUrls</span>: [
                <span className="text-[#ce9178]">
                  &apos;./user-card.component.css&apos;
                </span>
                ]
              </div>
              <div>{'}'})</div>
              <div>
                <span className="text-[#c586c0]">export class</span>{' '}
                <span className="text-[#4ec9b0]">UserCardComponent</span> {'{'}
              </div>
              <div className="pl-4 text-[#6a9955]">
                {/* TIP: Add an input property for the user name */}
                {'// TIP: Add an input property for the user name'}
              </div>
              <div className="pl-4">
                <span className="text-[#569cd6]">@Input</span>() name:{' '}
                <span className="text-[#4ec9b0]">string</span> ={' '}
                <span className="text-[#ce9178]">&apos;&apos;</span>;
              </div>
              <div className="pl-4">
                <span className="text-[#569cd6]">@Input</span>() role:{' '}
                <span className="text-[#4ec9b0]">string</span> ={' '}
                <span className="text-[#ce9178]">&apos;User&apos;</span>;
              </div>
              <br />
              <div className="pl-4">
                <span className="text-[#dcdcaa]">constructor</span>() {'{}'}
              </div>
              <div>{'}'}</div>
            </div>
          </div>
        </div>

        {/* Terminal Panel */}
        <div className="h-32 border-t border-[#333] bg-[#1e1e1e]">
          <div className="flex items-center gap-4 px-4 py-1 text-xs border-b border-[#333]">
            <div className="uppercase cursor-pointer border-b border-white pb-1">
              Terminal
            </div>
            <div className="uppercase text-gray-500 cursor-pointer hover:text-gray-300">
              Output
            </div>
            <div className="uppercase text-gray-500 cursor-pointer hover:text-gray-300">
              Problems
            </div>
          </div>
          <div className="p-2 font-mono text-xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-green-500">✔</span>
              <span className="text-green-500">Compiled successfully.</span>
            </div>
            <div className="text-gray-400">
              <span className="text-blue-400">i</span> [wdm]: Compiling...
            </div>
            <div className="text-gray-400">
              <span className="text-blue-400">i</span> [wdm]: Compiled
              successfully.
            </div>
            <div className="text-gray-500 mt-2">
              Date: 2023-10-27T10:30:00.000Z - Hash: a1b2c3d4e5f6 - Time: 245ms
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
