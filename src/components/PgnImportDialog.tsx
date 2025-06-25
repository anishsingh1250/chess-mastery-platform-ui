
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, AlertCircle, Check } from 'lucide-react';

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
  const [isValidPgn, setIsValidPgn] = useState(false);

  const validatePgn = (pgn: string): boolean => {
    if (!pgn.trim()) return false;
    
    // More comprehensive PGN validation
    const cleanPgn = pgn.trim();
    
    // Check if it contains chess moves (basic pattern)
    const movePattern = /\d+\.\s*[a-h1-8NBRQK+#=\-Ox]+/;
    const hasBasicMoves = movePattern.test(cleanPgn);
    
    // Check for valid piece notation
    const validNotation = /^[1-9]\d*\.\s*[a-h1-8NBRQK+#=\-Ox\s]+/m;
    const hasValidNotation = validNotation.test(cleanPgn);
    
    return hasBasicMoves || hasValidNotation;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPgnText(value);
    setError('');
    
    if (value.trim()) {
      const isValid = validatePgn(value);
      setIsValidPgn(isValid);
      if (!isValid) {
        setError('Invalid PGN format. Please check your input.');
      }
    } else {
      setIsValidPgn(false);
    }
  };

  const handleImport = () => {
    const trimmedPgn = pgnText.trim();
    
    if (!trimmedPgn) {
      setError('Please enter or upload a PGN');
      return;
    }

    if (!validatePgn(trimmedPgn)) {
      setError('Invalid PGN format. Please check your input and try again.');
      return;
    }

    console.log('Importing PGN:', trimmedPgn);
    onImport(trimmedPgn);
    
    // Reset form
    setPgnText('');
    setFile(null);
    setError('');
    setIsValidPgn(false);
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
        
        // Validate the uploaded content
        const isValid = validatePgn(content);
        setIsValidPgn(isValid);
        
        if (!isValid) {
          setError('The uploaded file does not contain valid PGN format.');
        }
        
        console.log('File content loaded:', content.substring(0, 100) + '...');
      };
      reader.onerror = () => {
        setError('Error reading file. Please try again.');
      };
      reader.readAsText(uploadedFile);
    }
  };

  const handleClose = () => {
    setPgnText('');
    setFile(null);
    setError('');
    setIsValidPgn(false);
    onOpenChange(false);
  };

  const samplePgn = `[Event "Teaching Game"]
[Site "Chess Platform"]
[Date "2024.01.01"]
[White "Teacher"]
[Black "Student"]
[Result "*"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Bb7 10. d4 Re8`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
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
                  <Check className="w-4 h-4" />
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
            <Label htmlFor="pgn-text" className="text-sm font-medium flex items-center gap-2">
              Paste PGN Text
              {isValidPgn && (
                <span className="text-green-600 flex items-center gap-1 text-xs">
                  <Check className="w-3 h-3" />
                  Valid PGN
                </span>
              )}
            </Label>
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
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* Success Display */}
          {isValidPgn && !error && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-sm text-green-700">PGN format is valid and ready to import!</span>
            </div>
          )}

          {/* Sample Button */}
          {!pgnText && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPgnText(samplePgn);
                setIsValidPgn(true);
                setError('');
              }}
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
            disabled={!pgnText.trim() || !isValidPgn}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
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
