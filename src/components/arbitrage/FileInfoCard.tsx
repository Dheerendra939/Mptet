import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { FileArchive, CheckCircle2, ShieldCheck, Download, HardDrive, Cpu } from 'lucide-react';

interface FileInfoCardProps {
  fileName?: string;
  fileSize?: string;
}

export const FileInfoCard: React.FC<FileInfoCardProps> = ({
  fileName = 'CloudStorage_Installer_x64_v4.8.zip',
  fileSize = '48.6 MB',
}) => {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-xs">
            <FileArchive className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 break-all leading-snug">
              {fileName}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">{fileSize}</span>
              <span>•</span>
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t.scannedClean}
              </span>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-lg text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{t.statusReady}</span>
        </div>
      </div>

      {/* Grid of specs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-xs">
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <span className="text-slate-400 block text-[11px] uppercase font-medium">{t.fileNameLabel}</span>
          <span className="font-semibold text-slate-800 truncate block mt-0.5">Setup_Package.zip</span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <span className="text-slate-400 block text-[11px] uppercase font-medium">{t.fileSizeLabel}</span>
          <span className="font-semibold text-slate-800 block mt-0.5">{fileSize}</span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <span className="text-slate-400 block text-[11px] uppercase font-medium">{t.fileFormatLabel}</span>
          <span className="font-semibold text-slate-800 block mt-0.5">ZIP Archive</span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <span className="text-slate-400 block text-[11px] uppercase font-medium">{t.statusLabel}</span>
          <span className="font-semibold text-emerald-600 block mt-0.5">Verified Safe</span>
        </div>
      </div>
    </div>
  );
};
