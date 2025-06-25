
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, AlertCircle } from 'lucide-react';

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
  const [error, setError] = useState('');

  const validatePgn = (pgn: string): boolean => {
    // Basic PGN validation
    if (!pgn.trim()) return false;
    
    // Check if it contains chess moves (basic pattern)
    const movePattern = /\d+\.\s*[a-h1-8NBRQK+#=\-O]+/;
    return movePattern.test(pgn);
  };

  const handleImport = () => {
    const trimmedPgn = pgnText.trim();
    
    if (!trimmedPgn) {
      setError('Please enter or upload a PGN');
      return;
    }

    if (!validatePgn(trimmedPgn)) {
      setError('Invalid PGN format. Please check your input.');
      return;
    }

    console.log('Importing PGN:', trimmedPgn);
    onImport(trimmedPgn);
    setPgnText('');
    setFile(null);
    setError('');
    onOpenChange(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setError('');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setPgnText(content);
        console.log('File content loaded:', content.substring(0, 100) + '...');
      };
      reader.onerror = () => {
        setError('Error reading file');
      };
      reader.readAsText(uploadedFile);
    }
  };

  const handleClose = () => {
    setPgnText('');
    setFile(null);
    setError('');
    onOpenChange(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPgnText(e.target.value);
    setError('');
  };

  const samplePgn = `1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Bb7 10. d4 Re8`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Import PGN
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* File Upload Section */}
          <div className="space-y-2">
            <Label htmlFor="pgn-file" className="text-sm font-medium">Upload PGN File</Label>
            <div className="flex items-center gap-3">
              <Input
                id="pgn-file"
                type="file"
                accept=".pgn,.txt"
                onChange={handleFileUpload}
                className="flex-1"
              />
              {file && (
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <Upload className="w-4 h-4" />
                  {file.name}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>
          
          {/* Text Input Section */}
          <div className="space-y-2">
            <Label htmlFor="pgn-text" className="text-sm font-medium">Paste PGN Text</Label>
            <Textarea
              id="pgn-text"
              value={pgnText}
              onChange={handleTextChange}
              placeholder={`Paste your PGN here or try this example:\n\n${samplePgn}`}
              className="min-h-[200px] font-mono text-sm"
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* Sample Button */}
          {!pgnText && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPgnText(samplePgn)}
              className="w-full"
            >
              Load Sample PGN
            </Button>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleImport}
            disabled={!pgnText.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import PGN
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PgnImportDialog;
