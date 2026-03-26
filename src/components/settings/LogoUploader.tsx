import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/Button';
import { uploadLogo, deleteLogo } from '../../lib/api';

export function LogoUploader() {
  const logoDataUrl = useAppStore((s) => s.settings.logoDataUrl);
  const userId = useAppStore((s) => s.userId);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  async function processFile(file: File) {
    setError('');
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be under 2MB.');
      return;
    }

    if (userId) {
      // Upload to Supabase Storage and store the public URL
      setUploading(true);
      try {
        const url = await uploadLogo(userId, file);
        updateSettings({ logoDataUrl: url });
      } catch (e) {
        setError('Upload failed. Please try again.');
        console.error(e);
      } finally {
        setUploading(false);
      }
    } else {
      // Fallback: no user yet, store as base64 (shouldn't normally happen)
      const reader = new FileReader();
      reader.onload = (e) => updateSettings({ logoDataUrl: e.target?.result as string });
      reader.readAsDataURL(file);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  async function removeLogo() {
    updateSettings({ logoDataUrl: null });
    if (inputRef.current) inputRef.current.value = '';
    if (userId) deleteLogo(userId).catch(console.error);
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-gray-700">Business Logo</p>

      {logoDataUrl ? (
        <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
          <img
            src={logoDataUrl}
            alt="Business logo"
            className="max-h-16 max-w-40 object-contain rounded"
          />
          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-500">Logo uploaded</p>
            <Button variant="danger" size="sm" onClick={removeLogo}>
              <X size={12} />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors
            ${uploading ? 'cursor-wait opacity-60' : 'cursor-pointer'}
            ${dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
        >
          <Upload size={24} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 font-medium">
            {uploading ? 'Uploading…' : 'Click to upload or drag & drop'}
          </p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, SVG up to 2MB</p>
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
