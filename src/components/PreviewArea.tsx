
const enhanceHtml = (code: string) => {
  const safeStyle = `<style>
  a[href="#"], a[href=""], a:not([href]), a[aria-disabled="true"] { pointer-events: none !important; opacity: 0.6; cursor: not-allowed; }
  button[disabled], .disabled { pointer-events: none; opacity: 0.6; cursor: not-allowed; }
  </style>`;
  const safeScript = `<script>
  document.addEventListener('click', function(e) {
    var target = e.target;
    var a = target && target.closest ? target.closest('a') : null;
    if (!a) return;
    var href = (a.getAttribute('href') || '').trim();
    if (!href || href === '#' || href.toLowerCase().startsWith('javascript:')) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
  </script>`;

  if (code.includes('</head>')) {
    return code.replace('</head>', `${safeStyle}\n${safeScript}\n</head>`);
  }
  if (code.includes('</body>')) {
    return `${safeStyle}` + code.replace('</body>', `${safeScript}</body>`);
  }
  return `${safeStyle}${code}${safeScript}`;
};

interface PreviewAreaProps {
  generatedCode: string;
  showCode?: boolean;
}

const PreviewArea = ({ generatedCode, showCode = false }: PreviewAreaProps) => {
  if (showCode) {
    return (
      <div className="h-full bg-background flex flex-col">
        {/* Code Header */}
        <div className="p-4 border-b border-lovable-border bg-lovable-surface">
          <div className="flex items-center justify-between">
            <h2 className="text-lovable-text-primary font-semibold">Code</h2>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 p-4 bg-lovable-surface overflow-auto">
          {generatedCode ? (
            <pre className="text-lovable-text-primary text-sm font-mono whitespace-pre-wrap break-words">
              <code>{generatedCode}</code>
            </pre>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-lovable-surface-hover rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-lovable-text-secondary text-2xl">📝</span>
                </div>
                <h3 className="text-lovable-text-primary font-semibold mb-2">No code yet</h3>
                <p className="text-lovable-text-secondary text-sm">
                  Start chatting to generate your website code
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Preview Header */}
      <div className="p-4 border-b border-lovable-border bg-lovable-surface">
        <div className="flex items-center justify-between">
          <h2 className="text-lovable-text-primary font-semibold">Preview</h2>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 p-4 bg-white">
        {generatedCode ? (
          <iframe
            srcDoc={enhanceHtml(generatedCode)}
            className="w-full h-full border border-gray-200 rounded-lg"
            title="Generated Website Preview"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-gray-400 text-3xl">🦙</span>
              </div>
              <h3 className="text-gray-600 font-semibold mb-2">Ready to build</h3>
              <p className="text-gray-400 text-sm">
                Your website will appear here once generated
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewArea;