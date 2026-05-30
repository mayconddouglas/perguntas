import jsPDF from 'jspdf';
import { briefingData } from '../questions';

export const generateBriefingPDF = (answers: Record<string, any>) => {
  const doc = new jsPDF();
  let yPos = 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text("Documento de Briefing", 20, yPos);
  
  yPos += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`, 20, yPos);
  yPos += 15;

  briefingData.forEach((category) => {
    const hasAnswers = category.questions.some(q => {
      const ans = answers[q.id];
      return ans && (Array.isArray(ans) ? ans.length > 0 : String(ans).trim() !== '');
    });
    
    if (!hasAnswers) return;

    if (yPos > 260) {
      doc.addPage();
      yPos = 20;
    }

    // Category Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(category.title, 20, yPos);
    yPos += 3;
    
    // Line separator
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 190, yPos);
    yPos += 8;

    category.questions.forEach((question) => {
      let answer = answers[question.id];
      if (!answer || (Array.isArray(answer) && answer.length === 0)) return;

      if (Array.isArray(answer)) {
        answer = answer.join(', ');
      }

      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      // Question
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(51, 65, 85); // slate-700
      
      const questionLines = doc.splitTextToSize(`Q: ${question.label}`, 170);
      doc.text(questionLines, 20, yPos);
      yPos += (questionLines.length * 5) + 2;

      // Answer
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(15, 23, 42); // slate-900
      
      const answerLines = doc.splitTextToSize(`R: ${answer.toString()}`, 170);
      doc.text(answerLines, 20, yPos);
      yPos += (answerLines.length * 5) + 6;
    });

    yPos += 8;
  });

  doc.save("Briefing_Projeto_Brazeo.pdf");
};
