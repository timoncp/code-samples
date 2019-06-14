import JSPDF from 'jspdf';
import ChartJS from 'chart.js';

const exportToPdf = (cfg) => {
  if (!cfg) return null;

  const DEFAULT_WIDTH = 1000;
  const DEFAULT_HEIGHT = 540;
  const LEFT_PADDING = 5;
  const dpr = window.devicePixelRatio;
  window.devicePixelRatio = 2;

  const config = { ...cfg };
  const canvas = document.createElement('canvas');

  canvas.width = DEFAULT_WIDTH;
  canvas.height = DEFAULT_HEIGHT;

  document.body.appendChild(canvas);

  const pdf = new JSPDF('p', 'mm', 'a4');

  const aspectRatio = canvas.height / canvas.width;
  const width = pdf.internal.pageSize.width - (2 * LEFT_PADDING);
  const height = width * aspectRatio;

  const chart = new ChartJS(canvas, config);
  const img = canvas.toDataURL('jpeg');

  pdf.addImage(
    img, 'jpeg', LEFT_PADDING, 10, width, height,
  );

  pdf.save('Chart.pdf');
  chart.destroy();
  window.devicePixelRatio = dpr;
  return setTimeout(() => document.body.removeChild(canvas));
};

export default exportToPdf;
