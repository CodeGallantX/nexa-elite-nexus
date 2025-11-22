import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, Printer, Share2, X } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  reference: string;
  created_at: string;
  currency?: string;
}

interface TransactionReceiptProps {
  transaction: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userInfo?: {
    ign?: string;
    username?: string;
  };
}

export const TransactionReceipt: React.FC<TransactionReceiptProps> = ({
  transaction,
  open,
  onOpenChange,
  userInfo,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const formatTransactionType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handlePrint = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${transaction.reference}</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              padding: 20px;
              max-width: 600px;
              margin: 0 auto;
            }
            .receipt-container {
              border: 2px solid #000;
              padding: 20px;
              position: relative;
            }
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 80px;
              font-weight: bold;
              color: rgba(0, 0, 0, 0.05);
              white-space: nowrap;
              pointer-events: none;
              z-index: 0;
            }
            .content {
              position: relative;
              z-index: 1;
            }
            .header {
              text-align: center;
              border-bottom: 2px dashed #000;
              padding-bottom: 15px;
              margin-bottom: 15px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .tagline {
              font-size: 12px;
              color: #666;
            }
            .row {
              display: flex;
              justify-content: space-between;
              margin: 8px 0;
            }
            .label {
              font-weight: bold;
            }
            .amount {
              font-size: 24px;
              font-weight: bold;
              text-align: center;
              margin: 20px 0;
              padding: 15px;
              background: #f5f5f5;
              border: 2px solid #000;
            }
            .footer {
              border-top: 2px dashed #000;
              padding-top: 15px;
              margin-top: 15px;
              text-align: center;
              font-size: 11px;
            }
            .status {
              display: inline-block;
              padding: 5px 15px;
              border-radius: 20px;
              font-weight: bold;
              background: ${transaction.status === 'success' ? '#22c55e' : '#ef4444'};
              color: white;
            }
            @media print {
              body { padding: 0; }
              .receipt-container { border: none; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            window.onload = () => {
              window.print();
              window.onafterprint = () => window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownload = async () => {
    const html2canvas = (await import('html2canvas')).default;
    if (!receiptRef.current) return;

    const canvas = await html2canvas(receiptRef.current, {
      scale: 2,
      backgroundColor: '#ffffff',
    });

    const link = document.createElement('a');
    link.download = `receipt-${transaction.reference}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    toast({
      title: "Downloaded",
      description: "Receipt has been downloaded successfully",
    });
  };

  const handleShare = async () => {
    const html2canvas = (await import('html2canvas')).default;
    if (!receiptRef.current) return;

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        const file = new File([blob], `receipt-${transaction.reference}.png`, { type: 'image/png' });
        
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'Transaction Receipt',
              text: `NeXa Esports - Receipt #${transaction.reference}`,
              files: [file],
            });
            toast({
              title: "Shared",
              description: "Receipt has been shared successfully",
            });
          } catch (err) {
            if ((err as Error).name !== 'AbortError') {
              console.error('Error sharing:', err);
              toast({
                title: "Share failed",
                description: "Could not share the receipt",
                variant: "destructive",
              });
            }
          }
        } else {
          // Fallback: copy link or download
          toast({
            title: "Share not supported",
            description: "Your browser doesn't support sharing. The receipt has been downloaded instead.",
          });
          handleDownload();
        }
      });
    } catch (error) {
      console.error('Error preparing share:', error);
      toast({
        title: "Error",
        description: "Could not prepare receipt for sharing",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>Transaction Receipt</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 px-1">
          <div ref={receiptRef} className="relative border-2 border-border p-6 rounded-lg bg-background">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
              <div 
                className="text-[100px] font-bold opacity-5 transform -rotate-45 whitespace-nowrap select-none"
                style={{ 
                  color: 'hsl(var(--foreground))',
                  letterSpacing: '0.1em'
                }}
              >
                NeXa Esports
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Header */}
              <div className="text-center border-b-2 border-dashed border-border pb-4 mb-4">
                <div className="text-2xl font-bold mb-1">NeXa Esports</div>
                <div className="text-sm text-muted-foreground">Elite Gaming Clan</div>
                <div className="text-xs text-muted-foreground mt-1">Transaction Receipt</div>
              </div>

              {/* Transaction Details */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Reference:</span>
                  <span className="font-mono text-sm">{transaction.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Date:</span>
                  <span>{format(new Date(transaction.created_at), 'PPpp')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Type:</span>
                  <span>{formatTransactionType(transaction.type)}</span>
                </div>
                {userInfo && (
                  <>
                    {userInfo.ign && (
                      <div className="flex justify-between">
                        <span className="font-semibold">Player:</span>
                        <span>{userInfo.ign}</span>
                      </div>
                    )}
                    {userInfo.username && (
                      <div className="flex justify-between">
                        <span className="font-semibold">Username:</span>
                        <span>{userInfo.username}</span>
                      </div>
                    )}
                  </>
                )}
                <div className="flex justify-between">
                  <span className="font-semibold">Status:</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    transaction.status === 'success' 
                      ? 'bg-green-500/20 text-green-600' 
                      : 'bg-red-500/20 text-red-600'
                  }`}>
                    {transaction.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div className="my-6 p-4 bg-muted rounded-lg border-2 border-border text-center">
                <div className="text-sm text-muted-foreground mb-1">Amount</div>
                <div className="text-3xl font-bold">
                  {transaction.currency || '₦'}{Math.abs(transaction.amount).toLocaleString('en-NG', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>

              {/* Transaction ID */}
              <div className="text-center text-xs text-muted-foreground mb-4">
                Transaction ID: {transaction.id}
              </div>

              {/* Footer */}
              <div className="border-t-2 border-dashed border-border pt-4 text-center text-xs text-muted-foreground">
                <p>This is an official receipt from NeXa Esports</p>
                <p className="mt-1">Keep this receipt for your records</p>
                <p className="mt-2 font-mono">Generated: {format(new Date(), 'PPpp')}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end flex-shrink-0 pt-2">
            <Button onClick={handleShare} variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button onClick={handlePrint} variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
