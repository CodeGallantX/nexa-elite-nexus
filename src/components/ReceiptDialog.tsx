import React, { useRef, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import { Share2, Download, X, Loader2 } from 'lucide-react';

interface ReceiptDialogProps {
  transaction: any;
  onClose: () => void;
}

const ReceiptDialog: React.FC<ReceiptDialogProps> = ({ transaction, onClose }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!transaction) return null;

  const generateImage = async () => {
    if (!receiptRef.current) return null;
    // Temporarily remove box shadow for capture
    const originalShadow = receiptRef.current.style.boxShadow;
    receiptRef.current.style.boxShadow = 'none';
    
    const canvas = await html2canvas(receiptRef.current, {
        useCORS: true,
        backgroundColor: null, // Make background transparent
        scale: 2, // Higher resolution
    });

    // Restore box shadow
    receiptRef.current.style.boxShadow = originalShadow;
    return canvas;
  };

  const handleDownload = async () => {
    setIsProcessing(true);
    const canvas = await generateImage();
    if (canvas) {
      const link = document.createElement('a');
      link.download = `receipt-${transaction.transaction_id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
    setIsProcessing(false);
  };

  const handleShare = async () => {
    setIsProcessing(true);
    const canvas = await generateImage();
    if (canvas && navigator.share) {
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.share({
              files: [new File([blob], `receipt-${transaction.transaction_id}.png`, { type: 'image/png' })],
              title: 'Transaction Receipt',
              text: `Receipt for transaction ${transaction.transaction_id}`,
            });
          } catch (error) {
            console.error('Sharing failed:', error);
          }
        }
      }, 'image/png');
    } else {
      const receiptDetails = `
        Receipt for Transaction ID: ${transaction.transaction_id}
        Amount: ₦${transaction.amount}
        Date: ${transaction.date}
        Type: ${transaction.type}
        ${transaction.sender ? `From: ${transaction.sender}` : ''}
        ${transaction.recipient ? `To: ${transaction.recipient}` : ''}
      `;
      navigator.clipboard.writeText(receiptDetails.trim());
      alert('Receipt details copied to clipboard!');
    }
    setIsProcessing(false);
  };

  const DetailRow: React.FC<{ label: string; value: any; highlight?: boolean }> = ({ label, value, highlight = false }) => (
    <div className="flex justify-between items-center py-3 border-b border-border/50">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`font-bold text-right ${highlight ? 'text-primary' : 'text-foreground'}`}>{value}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-slide-up">
      <div 
        ref={receiptRef}
        className="bg-card rounded-xl shadow-2xl max-w-sm w-full border border-border"
        style={{ boxShadow: '0 0 40px rgba(var(--primary-rgb), 0.1)' }}
      >
        <div 
          className="p-6 overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 200px)' }} // Adjust max height as needed
        >
          <div className="text-center mb-6">
            <img src="/nexa-logo.jpg" alt="Nexa Elite Logo" className="w-20 h-20 mx-auto rounded-full mb-4 border-2 border-primary" />
            <h2 className="text-2xl font-bold text-primary font-orbitron">Transaction Receipt</h2>
            <p className="text-sm text-muted-foreground">Nexa Elite Nexus</p>
          </div>

          <div className="text-center pt-2 pb-6">
            <p className="text-lg text-muted-foreground">Total Amount</p>
            <p className="text-5xl font-bold text-primary font-orbitron">
              ₦{Number(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="space-y-2">
            <DetailRow label="Type" value={transaction.type} highlight />
            <DetailRow label="Date" value={transaction.date} />
            <DetailRow label="Transaction ID" value={transaction.transaction_id} />
            
            <div className="pt-4">
              {transaction.sender && <DetailRow label="From" value={transaction.sender} />}
              {transaction.recipient && <DetailRow label="To" value={transaction.recipient} />}
            </div>

            {transaction.description && <DetailRow label="Description" value={transaction.description} />}

            <div className="text-center pt-8 pb-4">
              <p className={`mt-2 text-lg font-semibold ${transaction.status === 'Success' ? 'text-green-500' : 'text-yellow-500'}`}>
                Status: {transaction.status}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-background/50 rounded-b-xl grid grid-cols-3 gap-2 border-t border-border">
            <ActionButton onClick={handleShare} disabled={isProcessing} icon={Share2} label="Share" />
            <ActionButton onClick={handleDownload} disabled={isProcessing} icon={Download} label="Download" />
            <ActionButton onClick={onClose} icon={X} label="Close" />
        </div>
      </div>
    </div>
  );
};

const ActionButton: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  icon: React.ElementType;
  label: string;
}> = ({ onClick, disabled = false, icon: Icon, label }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="flex flex-col items-center justify-center p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
        aria-label={label}
    >
        {disabled ? <Loader2 className="h-6 w-6 animate-spin" /> : <Icon className="h-6 w-6" />}
        <span className="text-xs mt-1">{label}</span>
    </button>
);

export default ReceiptDialog;
