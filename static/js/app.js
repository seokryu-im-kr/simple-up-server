document.addEventListener('DOMContentLoaded', function () {
    // --- Copy Button ---
    const copyButton = document.getElementById('copy-button');
    const curlCommand = document.getElementById('curl-command');

    copyButton.addEventListener('click', () => {
        const commandText = curlCommand.innerText.trim().substring(2); // Remove '> '

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(commandText).then(() => {
                showCopiedFeedback();
            }, (err) => {
                console.error('Could not copy text: ', err);
                fallbackCopyTextToClipboard(commandText);
            });
        } else {
            fallbackCopyTextToClipboard(commandText);
        }
    });
    
    function showCopiedFeedback() {
        const originalContent = copyButton.innerHTML;
        copyButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
        `;
        setTimeout(() => {
            copyButton.innerHTML = originalContent;
        }, 2000);
    }

    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        
        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showCopiedFeedback();
            } else {
                console.error('Fallback: Oops, unable to copy');
            }
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    }

    // --- Drag and Drop ---
    const dropZone = document.getElementById('drop-zone');
    const fileUpload = document.getElementById('file-upload');
    const uploadForm = document.getElementById('upload-form');

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('bg-slate-700', 'border-white');
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.classList.remove('bg-slate-700', 'border-white');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('bg-slate-700', 'border-white');
        
        if (e.dataTransfer.files.length > 0) {
            fileUpload.files = e.dataTransfer.files;
            // Trigger the change event for the file input
            const event = new Event('change', { bubbles: true });
            fileUpload.dispatchEvent(event);
        }
    });

    // --- Auto-submit on file select ---
    fileUpload.addEventListener('change', () => {
        if (fileUpload.files.length > 0) {
            uploadForm.submit();
        }
    });
});
