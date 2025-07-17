// Utility function to copy text to clipboard with fallback
export async function copyToClipboard(text) {
  try {
    // Try modern Clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      console.log('Copied using Clipboard API:', text);
      return true;
    }
  } catch (error) {
    console.log('Clipboard API failed, trying fallback:', error.message);
  }

  // Fallback to document.execCommand for older browsers or permission issues
  try {
    // Create a temporary textarea element
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make it invisible but still selectable
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    // Use the older copy command
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (successful) {
      console.log('Copied using execCommand fallback:', text);
      return true;
    } else {
      throw new Error('execCommand copy failed');
    }
  } catch (error) {
    console.error('All copy methods failed:', error);
    // Last resort - show a prompt with the text to copy
    window.prompt('Copy this text manually:', text);
    return false;
  }
}