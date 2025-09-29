import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, X } from "lucide-react";
import { ProductData } from './Dashboard';
import analyticsHero from "@/assets/analytics-hero.jpg";

interface FileUploadProps {
  onUpload: (data: ProductData[]) => void;
  onCancel: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUpload, onCancel }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Sample data for demonstration
  const sampleData: ProductData[] = [
    { id: 1, name: 'Premium Laptop Pro', category: 'Electronics', unitsSold: 320, revenue: 160000, profitMargin: 0.28, date: '2024-01-15' },
    { id: 2, name: 'Wireless Headphones X', category: 'Electronics', unitsSold: 1250, revenue: 125000, profitMargin: 0.42, date: '2024-01-22' },
    { id: 3, name: 'Ergonomic Office Chair', category: 'Furniture', unitsSold: 180, revenue: 54000, profitMargin: 0.22, date: '2024-02-05' },
    { id: 4, name: 'Smart Fitness Watch', category: 'Electronics', unitsSold: 675, revenue: 202500, profitMargin: 0.38, date: '2024-02-12' },
    { id: 5, name: 'LED Desk Lamp Pro', category: 'Furniture', unitsSold: 420, revenue: 21000, profitMargin: 0.35, date: '2024-02-28' },
    { id: 6, name: 'Gaming Mechanical Keyboard', category: 'Electronics', unitsSold: 890, revenue: 89000, profitMargin: 0.45, date: '2024-03-08' },
    { id: 7, name: 'Modern Coffee Table', category: 'Furniture', unitsSold: 125, revenue: 50000, profitMargin: 0.18, date: '2024-03-15' },
    { id: 8, name: 'Portable Bluetooth Speaker', category: 'Electronics', unitsSold: 567, revenue: 85050, profitMargin: 0.40, date: '2024-03-22' },
    { id: 9, name: 'Standing Desk Converter', category: 'Furniture', unitsSold: 235, revenue: 70500, profitMargin: 0.25, date: '2024-04-03' },
    { id: 10, name: 'Wireless Phone Charger', category: 'Electronics', unitsSold: 1100, revenue: 55000, profitMargin: 0.48, date: '2024-04-10' }
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    
    // Simulate file processing
    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (!fileExtension || !['csv', 'xlsx', 'xls'].includes(fileExtension)) {
        throw new Error('Invalid file format. Please upload CSV or Excel files only.');
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('File size too large. Please upload files smaller than 10MB.');
      }

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, use sample data
      setSuccess(true);
      setTimeout(() => {
        onUpload(sampleData);
      }, 1000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing the file.');
      setUploading(false);
    }
  };

  const handleSampleData = () => {
    setUploading(true);
    setError(null);
    
    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => {
        onUpload(sampleData);
      }, 1000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-bg p-6 flex items-center justify-center">
      <div className="max-w-4xl mx-auto w-full">
        <Card className="analytics-card animate-scale-in">
          <CardHeader className="text-center">
            <div className="flex justify-between items-start mb-4">
              <div />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onCancel}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Upload Product Data
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Upload your CSV or Excel file to analyze product performance
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Hero Image */}
            <div className="w-full h-48 rounded-lg overflow-hidden">
              <img 
                src={analyticsHero} 
                alt="Analytics Dashboard" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Upload Area */}
            <div
              className={`upload-area ${dragActive ? 'border-primary bg-primary/10' : ''} ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !uploading && document.getElementById('file-upload')?.click()}
            >
              <input
                id="file-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileInput}
                className="hidden"
                disabled={uploading}
              />
              
              {uploading ? (
                <div className="space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="text-lg font-medium">Processing your file...</p>
                </div>
              ) : success ? (
                <div className="space-y-4">
                  <CheckCircle className="w-12 h-12 text-success mx-auto" />
                  <p className="text-lg font-medium text-success">File processed successfully!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 text-primary mx-auto" />
                  <div>
                    <p className="text-lg font-medium">Drop your file here or click to browse</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Supports CSV, Excel (.xlsx, .xls) files up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* File Requirements */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Required Columns
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <div className="grid grid-cols-2 gap-4">
                  <ul className="space-y-1">
                    <li>• Product Name</li>
                    <li>• Category</li>
                    <li>• Units Sold</li>
                  </ul>
                  <ul className="space-y-1">
                    <li>• Revenue</li>
                    <li>• Profit Margin</li>
                    <li>• Date (optional)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Error Alert */}
            {error && (
              <Alert className="border-destructive/50 bg-destructive/10 animate-fade-in">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button 
                onClick={handleSampleData}
                variant="outline"
                className="flex-1"
                disabled={uploading || success}
              >
                Use Sample Data
              </Button>
              <Button 
                onClick={onCancel}
                variant="secondary"
                className="flex-1"
                disabled={uploading || success}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};