
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PgnImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (pgn: string) => void;
}

const PgnImportDialog: React.FC<PgnImportDialogProps> = ({
  open,
  onOpenChange,
  onImport
}) => {
  const [pgnText, setPgnText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleImport = () => {
    if (pgnText.trim()) {
      onImport(pgnText.trim());
      setPgnText('');
      setFile(null);
      onOpenChange(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setPgnText(content);
      };
      reader.readAsText(uploadedFile);
    }
  };

  const handleClose = () => {
    setPgnText('');
    setFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Import PGN</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="pgn-file">Upload PGN File</Label>
            <Input
              id="pgn-file"
              type="file"
              accept=".pgn,.txt"
              onChange={handleFileUpload}
              className="mt-1"
            />
          </div>
          
          <div className="text-center text-sm text-gray-500">
            or
          </div>
          
          <div>
            <Label htmlFor="pgn-text">Paste PGN Text</Label>
            <Textarea
              id="pgn-text"
              value={pgnText}
              onChange={(e) => setPgnText(e.target.value)}
              placeholder="1. e4 e5 2. Nf3 Nc6 3. Bb5..."
              className="mt-1 min-h-[200px] font-mono text-sm"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleImport}
            disabled={!pgnText.trim()}
          >
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PgnImportDialog;
