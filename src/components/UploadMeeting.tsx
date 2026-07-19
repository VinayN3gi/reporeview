"use client";

import React, { useState, useRef } from "react";
import { uploadMeetingFile } from "@/lib/firebase";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, FileVideo, CheckCircle2, X } from "lucide-react";

export function UploadMeeting() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        if (selectedFile.type === "audio/mpeg" || selectedFile.type === "video/mp4" || selectedFile.name.endsWith('.mp3') || selectedFile.name.endsWith('.mp4')) {
          setFile(selectedFile);
          setError(null);
          setIsSuccess(false);
        } else {
          setError("Please select an MP3 or MP4 file.");
          setFile(null);
        }
      }
    }
  };

  const handleUpload = () => {
    if (!file) return;

    setIsUploading(true);
    setProgress(0);
    setError(null);
    setIsSuccess(false);

    uploadMeetingFile(
      file,
      (p) => {
        setProgress(p);
      },
      (url) => {
        setIsUploading(false);
        setIsSuccess(true);
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
      (err) => {
        setIsUploading(false);
        setError(err.message);
      }
    );
  };

  const cancelUpload = () => {
    setFile(null);
    setIsSuccess(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto border border-primary/10 shadow-md">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-primary" />
          Upload Meeting Recording
        </CardTitle>
        <CardDescription>
          Upload your MP3 or MP4 meeting recordings to Firebase Storage.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!file && !isSuccess && (
          <div 
            className="border-2 border-dashed border-primary/20 rounded-xl p-8 text-center hover:bg-primary/5 transition-colors cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8 text-primary" />
              </div>
              <div className="text-sm font-medium">Click to browse or drag and drop</div>
              <div className="text-xs text-muted-foreground">MP3 or MP4 (Max 100MB)</div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="audio/mpeg,video/mp4,.mp3,.mp4"
              className="hidden"
            />
          </div>
        )}

        {file && !isSuccess && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
              <div className="flex items-center space-x-3 truncate">
                <div className="p-2 bg-primary/10 rounded-md shrink-0">
                  <FileVideo className="w-5 h-5 text-primary" />
                </div>
                <div className="truncate">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              {!isUploading && (
                <Button variant="ghost" size="icon" onClick={cancelUpload}>
                  <X className="w-4 h-4 text-muted-foreground" />
                </Button>
              )}
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Uploading...</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {!isUploading && (
              <Button onClick={handleUpload} className="w-full">
                Upload File
              </Button>
            )}
          </div>
        )}

        {error && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20">
            {error}
          </div>
        )}

        {isSuccess && (
          <div className="flex flex-col items-center justify-center py-6 space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="p-4 bg-green-500/10 rounded-full">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium">Upload Successful!</h3>
              <p className="text-sm text-muted-foreground">Your meeting has been securely saved.</p>
            </div>
            <Button variant="outline" onClick={() => setIsSuccess(false)} className="mt-2">
              Upload Another
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
