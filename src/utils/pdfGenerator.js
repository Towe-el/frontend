import html2pdf from 'html2pdf.js'

export const generateEmotionSummaryPDF = async (contentRef) => {
  try {
    // Get the original element
    const element = contentRef.current;

    // Create a temporary container
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    document.body.appendChild(tempContainer);

    // Clone the content
    const clone = element.cloneNode(true);
    
    // Remove unnecessary elements
    const elementsToRemove = clone.querySelectorAll('.animate-bounce, nav, button');
    elementsToRemove.forEach(el => el.remove());

    // Reset styles
    const allElements = clone.getElementsByTagName('*');
    for (let el of allElements) {
      el.style.transform = 'none';
      el.style.transformStyle = 'flat';
      el.style.perspective = 'none';
      el.style.position = 'relative';
      el.style.zIndex = 'auto';
      el.style.height = 'auto';
      el.style.minHeight = 'auto';
      el.style.visibility = 'visible';
      el.style.opacity = '1';
    }

    // Add the clone to the temporary container
    tempContainer.appendChild(clone);

    // Configure PDF options
    const opt = {
      margin: 0.5,
      filename: 'emotion-summary.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.offsetWidth,
        height: element.offsetHeight,
        windowWidth: element.offsetWidth,
        windowHeight: element.offsetHeight
      },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    // Generate PDF
    const result = await html2pdf()
      .set(opt)
      .from(clone)
      .save();

    // Clean up
    document.body.removeChild(tempContainer);

    return result;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}; 