'use client';

import {
  FileJson,
  Folder,
  Terminal,
  Monitor,
  Code2,
  AlertTriangle,
  Play,
} from 'lucide-react';

export default function LiveCodingMockup() {
  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-gray-300 font-mono text-sm selection:bg-blue-500/30">
      {/* Top Bar - Quick Select */}
      {/* <div className="h-9 bg-[#2d2d2d] flex items-center px-4 border-b border-[#1f1f1f] shadow-sm">
           <span className="text-xs text-gray-500">Project: angular-demo</span>
      </div> */}

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Explorer */}
        <div className="w-56 bg-[#252526] border-r border-[#1f1f1f] hidden md:flex flex-col flex-shrink-0">
          <div className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
            <span>Explorer</span>
            <span className="text-[10px] opacity-50">...</span>
          </div>

          <div className="flex-1 overflow-y-auto py-1">
            {/* Structure Tree */}
            <div className="px-3 py-1 flex items-center gap-1.5 text-gray-400 hover:text-white cursor-default">
              <Folder className="w-3.5 h-3.5 fill-gray-500/20" />
              <span className="text-xs">src</span>
            </div>

            <div className="pl-6">
              <div className="px-3 py-1 flex items-center gap-1.5 text-gray-400 hover:text-white cursor-default group">
                <Folder className="w-3.5 h-3.5 fill-gray-500/20 group-hover:text-yellow-500 transition-colors" />
                <span className="text-xs">app</span>
              </div>

              <div className="pl-4 border-l border-[#333] ml-4 my-1 space-y-0.5">
                <FileItem
                  name="app.component.ts"
                  color="text-blue-400"
                  icon="TS"
                  active
                />
                <FileItem
                  name="app.component.html"
                  color="text-orange-400"
                  icon="HTML"
                />
                <FileItem
                  name="app.component.css"
                  color="text-blue-300"
                  icon="CSS"
                />
                <FileItem
                  name="app.module.ts"
                  color="text-blue-400"
                  icon="TS"
                />
              </div>
            </div>

            <div className="px-3 py-1 mt-2 flex items-center gap-1.5 text-gray-400 hover:text-white cursor-default">
              <FileJson className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-xs">angular.json</span>
            </div>
            <div className="px-3 py-1 flex items-center gap-1.5 text-gray-400 hover:text-white cursor-default">
              <FileJson className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs">package.json</span>
            </div>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
          {/* Editor Tabs */}
          <div className="flex bg-[#252526] overflow-x-auto scrollbar-hide">
            <Tab
              name="app.component.ts"
              icon="TS"
              color="text-blue-400"
              active
            />
            <Tab
              name="app.component.html"
              icon="HTML"
              color="text-orange-400"
            />
            <Tab name="app.component.css" icon="CSS" color="text-blue-300" />
          </div>

          {/* Code Content */}
          <div className="flex-1 overflow-auto relative">
            {/* Line Numbers + Code */}
            <div className="flex min-h-full">
              {/* Line Numbers */}
              <div className="w-12 flex-shrink-0 bg-[#1e1e1e] text-[#858585] text-right pr-3 pt-4 select-none text-[13px] leading-6 border-r border-[#333]/0">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Syntax Highlighted Code Mockup */}
              <div className="flex-1 pt-4 pl-4 font-[Consolas,Monaco,monospace] text-[13px] leading-6 text-[#d4d4d4]">
                <div>
                  <span className="text-[#c586c0]">import</span> {'{'} Component{' '}
                  {'}'} <span className="text-[#c586c0]">from</span>{' '}
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
                  <span className="text-[#ce9178]">&apos;app-root&apos;</span>,
                </div>
                <div className="pl-4">
                  <span className="text-[#9cdcfe]">templateUrl</span>:{' '}
                  <span className="text-[#ce9178]">
                    &apos;./app.component.html&apos;
                  </span>
                  ,
                </div>
                <div className="pl-4">
                  <span className="text-[#9cdcfe]">styleUrls</span>: [
                  <span className="text-[#ce9178]">
                    &apos;./app.component.css&apos;
                  </span>
                  ]
                </div>
                <div>{'}'})</div>
                <br />
                <div>
                  <span className="text-[#c586c0]">export class</span>{' '}
                  <span className="text-[#4ec9b0]">AppComponent</span> {'{'}
                </div>
                <div className="pl-4">
                  <span className="text-[#9cdcfe]">title</span> ={' '}
                  <span className="text-[#ce9178]">
                    &apos;angular-demo&apos;
                  </span>
                  ;
                </div>
                <div className="pl-4">
                  <span className="text-[#9cdcfe]">users</span> = [
                  <span className="text-[#ce9178]">&apos;John&apos;</span>,{' '}
                  <span className="text-[#ce9178]">&apos;Jane&apos;</span>,{' '}
                  <span className="text-[#ce9178]">&apos;Bob&apos;</span>];
                </div>
                <br />
                <div className="pl-4 group relative">
                  <span className="text-[#dcdcaa]">addUser</span>(name:{' '}
                  <span className="text-[#4ec9b0]">string</span>) {'{'}
                  {/* Cursor */}
                  <span className="absolute ml-[1px] w-[2px] h-5 bg-blue-400 animate-pulse top-0.5"></span>
                </div>
                <div className="pl-8">
                  <span className="text-[#c586c0]">this</span>.
                  <span className="text-[#9cdcfe]">users</span>.
                  <span className="text-[#dcdcaa]">push</span>(name);
                </div>
                <div className="pl-4">{'}'}</div>
                <div>{'}'}</div>
              </div>
            </div>
          </div>

          {/* Terminal Panel */}
          <div className="h-40 border-t border-[#333] bg-[#1e1e1e] flex flex-col">
            <div className="flex items-center gap-6 px-4 py-1.5 text-[11px] font-medium border-b border-[#2d2d2d] bg-[#252526]">
              <div className="uppercase cursor-pointer text-white border-b border-white pb-0.5">
                Terminal
              </div>
              <div className="uppercase text-gray-500 hover:text-gray-300 cursor-pointer">
                Output
              </div>
              <div className="uppercase text-gray-500 hover:text-gray-300 cursor-pointer flex items-center gap-1">
                Problems{' '}
                <span className="w-4 h-4 rounded-full bg-[#2d2d2d] text-center leading-4 text-[9px] text-gray-400">
                  0
                </span>
              </div>
            </div>
            <div className="flex-1 p-3 font-mono text-xs overflow-y-auto">
              <div className="flex items-center gap-2 mb-1.5 opacity-80">
                <span className="text-green-500 font-bold">➜</span>
                <span className="text-blue-400">~/project</span>
                <span className="text-gray-400">ng serve</span>
              </div>

              <div className="pl-4 space-y-1">
                <div className="text-white">
                  <span className="text-green-500">✔</span> Browser application
                  bundle generation complete.
                </div>
                <div className="text-gray-400 mt-2">
                  Initial Chunk Files | Names | Size
                </div>
                <div className="text-gray-500">main.js | main | 32.5 kB</div>
                <div className="text-gray-500">
                  polyfills.js | polyfills | 12.8 kB
                </div>
                <div className="text-gray-500">
                  styles.css | styles | 1.2 kB
                </div>

                <div className="text-green-400 mt-2 flex items-center gap-2">
                  <Play className="w-3 h-3 fill-green-400" />
                  Application bundle generation complete. [450ms]
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="h-6 bg-[#007acc] text-white flex items-center justify-between px-3 text-[11px]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-white/70">main*</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> 0
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span>Ln 14, Col 28</span>
          <span>UTF-8</span>
          <span>TypeScript</span>
        </div>
      </div>
    </div>
  );
}

function FileItem({
  name,
  color,
  icon,
  active,
}: {
  name: string;
  color: string;
  icon: string;
  active?: boolean;
}) {
  return (
    <div
      className={`px-2 py-0.5 flex items-center gap-1.5 cursor-pointer rounded-sm ${active ? 'bg-[#37373d] text-white' : 'text-gray-400 hover:bg-[#2a2d2e] hover:text-gray-200'}`}
    >
      <div className={`w-3.5 text-[9px] font-bold text-center ${color}`}>
        {icon}
      </div>
      <span className="text-[13px]">{name}</span>
    </div>
  );
}

function Tab({
  name,
  icon,
  color,
  active,
}: {
  name: string;
  icon: string;
  color: string;
  active?: boolean;
}) {
  return (
    <div
      className={`
            px-3 py-2 flex items-center gap-2 min-w-[140px] border-r border-[#1e1e1e] cursor-pointer text-xs
            ${active ? 'bg-[#1e1e1e] text-white border-t-2 border-t-yellow-500' : 'bg-[#2d2d2d] text-gray-500 hover:bg-[#2a2d2e]'}
        `}
    >
      <span className={`font-bold text-[10px] ${color}`}>{icon}</span>
      <span>{name}</span>
      {active && (
        <span className="ml-auto text-gray-400 hover:text-white hover:bg-white/20 rounded-sm px-1">
          ×
        </span>
      )}
    </div>
  );
}
