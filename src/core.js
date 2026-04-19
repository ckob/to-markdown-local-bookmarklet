export function extractAndShow(Readability, TurndownService, marked) {
  function processPage() {
    try {
      // Clone the document so Readability doesn't destroy the live page
      var clone = document.cloneNode(true);
      var article = new Readability(clone).parse();
      
      if (!article || !article.content) {
        alert("Couldn't find main article.");
        return;
      }

      var ts = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
      var md = "# " + article.title + "\n\n" + ts.turndown(article.content);
      
      showDialog(md);
      
    } catch(e) {
      alert("Error: " + e.message);
    }
  }

  function showDialog(md) {
    var existing = document.getElementById('md-extractor-modal');
    if(existing) {
        if (window.__md_extractor_cleanup) window.__md_extractor_cleanup();
        existing.remove();
    }

    var overlay = document.createElement('div');
    overlay.id = 'md-extractor-modal';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:999999;display:flex;justify-content:center;align-items:center;font-family:sans-serif;';

    var box = document.createElement('div');
    box.style.cssText = 'background:#fff;width:90%;max-width:1200px;height:90%;border-radius:8px;display:flex;flex-direction:column;padding:20px;box-shadow:0 10px 30px rgba(0,0,0,0.5);';

    var header = document.createElement('div');
    header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;';
    
    var title = document.createElement('h2');
    title.innerText = 'Local Markdown Extractor';
    title.style.cssText = 'margin:0;color:#333;font-size:20px;';

    var viewControls = document.createElement('div');
    viewControls.style.cssText = 'display:flex;gap:5px;';

    function createBtn(text, onClick) {
        var b = document.createElement('button');
        b.innerText = text;
        b.style.cssText = 'padding:5px 10px;cursor:pointer;border:1px solid #ccc;background:#f8f9fa;border-radius:4px;font-size:12px;color:#333;';
        b.onclick = onClick;
        return b;
    }

    var contentArea = document.createElement('div');
    contentArea.style.cssText = 'display:flex;flex-grow:1;gap:15px;overflow:hidden;margin-bottom:15px;';

    var ta = document.createElement('textarea');
    ta.value = md;
    ta.style.cssText = 'flex:1;padding:15px;font-family:monospace;font-size:14px;border:1px solid #ccc;border-radius:4px;resize:none;color:#333;line-height:1.5;';

    var preview = document.createElement('div');
    preview.style.cssText = 'flex:1;padding:15px;border:1px solid #ccc;border-radius:4px;overflow-y:auto;color:#333;line-height:1.6;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;';
    preview.innerHTML = marked.parse(md); 

    ta.addEventListener('input', function() {
        preview.innerHTML = marked.parse(ta.value);
    });

    var btnSplit = createBtn('Split', function() { ta.style.display='block'; preview.style.display='block'; });
    var btnRaw = createBtn('Raw', function() { ta.style.display='block'; preview.style.display='none'; });
    var btnPreview = createBtn('Preview', function() { ta.style.display='none'; preview.style.display='block'; });

    viewControls.appendChild(btnSplit);
    viewControls.appendChild(btnRaw);
    viewControls.appendChild(btnPreview);
    header.appendChild(title);
    header.appendChild(viewControls);

    var footer = document.createElement('div');
    footer.style.cssText = 'display:flex;justify-content:flex-end;gap:10px;';

    function closeModal() {
      overlay.remove();
      window.removeEventListener('keydown', handleEsc, true);
      delete window.__md_extractor_cleanup;
    }

    function handleEsc(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
      }
    }

    window.addEventListener('keydown', handleEsc, true);
    window.__md_extractor_cleanup = closeModal;

    var closeBtn = document.createElement('button');
    closeBtn.innerText = 'Close';
    closeBtn.style.cssText = 'padding:10px 20px;cursor:pointer;border:none;border-radius:4px;background:#eee;color:#333;font-size:14px;';
    closeBtn.onclick = closeModal;

    var copyBtn = document.createElement('button');
    copyBtn.innerText = 'Copy Markdown';
    copyBtn.style.cssText = 'padding:10px 20px;cursor:pointer;border:none;border-radius:4px;background:#007bff;color:#fff;font-size:14px;font-weight:bold;';
    copyBtn.onclick = function() {
      ta.select();
      try {
        document.execCommand('copy');
        copyBtn.innerText = 'Copied!';
        copyBtn.style.background = '#28a745';
        setTimeout(function() { 
          copyBtn.innerText = 'Copy Markdown'; 
          copyBtn.style.background = '#007bff';
        }, 2000);
      } catch(err) {
        alert('Failed to copy.');
      }
    };

    footer.appendChild(closeBtn);
    footer.appendChild(copyBtn);

    contentArea.appendChild(ta);
    contentArea.appendChild(preview);
    
    box.appendChild(header);
    box.appendChild(contentArea);
    box.appendChild(footer);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  processPage();
}
