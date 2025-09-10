
const enhanceHtml = (code: string) => {
  const smoothStyle = `<style>
  html { scroll-behavior: smooth; }
  [id] { scroll-margin-top: 88px; }
  </style>`;

  const smartScript = `<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Prevent form submissions
    document.querySelectorAll('form').forEach(function(form){
      form.addEventListener('submit', function(e){ e.preventDefault(); return false; });
    });

    // Intelligent link/button handling
    document.querySelectorAll('a, button').forEach(function(el){
      el.addEventListener('click', function(e){
        var href = this.getAttribute('href') || '';
        var onclick = this.getAttribute('onclick');

        // Anchor link handling with existence check
        if (href.startsWith('#')) {
          var id = href.slice(1);
          if (!id) { e.preventDefault(); return; }
          var target = document.getElementById(id);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            e.preventDefault();
          }
          return;
        }

        // External links -> new tab
        if (href && (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:'))) {
          e.preventDefault();
          window.open(href, '_blank');
          return;
        }

        // Block unknown internal navigations
        if (href && href !== '' && href !== '#') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        // Buttons without handlers: just gentle feedback
        if (this.tagName === 'BUTTON' && !onclick) {
          this.style.transform = 'scale(0.96)';
          setTimeout(() => { this.style.transform = ''; }, 140);
        }
      });
    });
  });
  </script>`;

  // Inject style into head if available
  let out = code;
  if (out.includes('</head>')) {
    out = out.replace('</head>', `${smoothStyle}\n</head>`);
  } else {
    out = smoothStyle + out;
  }

  if (out.includes('</body>')) {
    out = out.replace('</body>', `${smartScript}</body>`);
  } else {
    out = out + smartScript;
  }
  return out;
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