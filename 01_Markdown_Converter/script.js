const markdownInput = document.getElementById('markdown-input');
const previewOutput = document.getElementById('preview-output');

function parseHeadings(text) {
    return text.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, content) => {
        const level = hashes.length;
        return `<h${level}>${content}</h${level}>`;
    });
}

function parseBoldAndItalic(text) {
    let parsedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    parsedText = parsedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    return parsedText;
}

function parseLinks(text) {
    return text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

function parseCodeBlocks(text) {
    return text.replace(/`(.*?)`/g, '<code>$1</code>');
}

function parseParagraphs(text) {
    const blocks = text.split(/\n\n+/);
    
    return blocks.map(block => {
        if (/^<\/?h[1-6]>/i.test(block)) {
            return block;
        }
        return `<p>${block.replace(/\n/g, '<br>')}</p>`;
    }).join('');
}

function convertMarkdownToHTML(markdownText) {
    let html = markdownText;
    
    html = parseHeadings(html);
    html = parseBoldAndItalic(html);
    html = parseLinks(html);
    html = parseCodeBlocks(html);
    html = parseParagraphs(html);
    
    return html;
}

function updatePreview() {
    const rawText = markdownInput.value;
    previewOutput.innerHTML = convertMarkdownToHTML(rawText);
}

markdownInput.addEventListener('input', updatePreview);

updatePreview();