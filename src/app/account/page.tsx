'use client';

import { storage, Profile } from '@/lib/storage';

export default function AccountPage() {
  const [profile, setProfile] = useState<Profile>({
    name: '',
    avatarUrl: '',
    university: '',
    major: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<null | 'success' | 'error'>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const data = storage.getProfile();
      setProfile(data);

      // Background fetch for consistency
      fetch('/api/profile')
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) setProfile(data);
        })
        .catch(console.error);
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setSaveStatus(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);

    try {
      storage.setProfile(profile);
      
      // Still call API as a background "no-op" for consistency
      fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      setSaveStatus('success');
    } catch (error) {
      console.error('Failed to save profile', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setProfile(prev => ({ ...prev, avatarUrl: data.url }));
      } else {
        setUploadError(data.details || data.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload failed', error);
      setUploadError('An error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-[100dvh] flex-col items-center justify-center p-8 bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
        <div className="animate-pulse bg-white/50 dark:bg-slate-800/50 rounded-2xl p-12 w-full max-w-2xl backdrop-blur-xl border border-white/20 dark:border-slate-700/30">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mx-auto mb-8"></div>
          <div className="space-y-4">
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg w-full"></div>
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg w-full"></div>
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg w-full"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[100dvh] flex-col items-center py-8 px-4 sm:px-8 bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-50">
      <div className="w-full max-w-2xl mt-4 sm:mt-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2 text-center drop-shadow-sm">
          Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Account</span>
        </h1>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-10 font-medium">Manage your personal and academic profile.</p>

        <div className="bg-white/60 dark:bg-slate-950/40 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/40 dark:border-slate-800/60 transition-all hover:shadow-[0_20px_60px_-15px_rgba(79,70,229,0.2)] dark:hover:shadow-[0_20px_60px_-15px_rgba(79,70,229,0.1)]">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center gap-8 mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-100 dark:border-indigo-900/40 shadow-inner bg-slate-100 dark:bg-slate-800 flex items-center justify-center transition-transform hover:scale-105">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="Profile Avatar" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = ''; }} />
                  ) : (
                    <svg className="w-16 h-16 text-slate-400 dark:text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  )}
                </div>
                {isUploading && (
                  <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                    <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 w-full space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                      disabled={isUploading}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors disabled:opacity-50"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      {isUploading ? 'Uploading...' : 'Upload from device'}
                    </button>
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                    <span className="text-sm text-slate-500 dark:text-slate-400">or</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="avatarUrl" className="block text-sm font-medium text-slate-600 dark:text-slate-400">Picture URL</label>
                  <input
                    type="text"
                    id="avatarUrl"
                    name="avatarUrl"
                    value={profile.avatarUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-4 py-3 text-sm text-slate-900 dark:text-white shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-400"
                  />
                </div>
                {uploadError && <p className="text-xs font-medium text-rose-500 mt-1">{uploadError}</p>}
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-4 py-3 text-sm text-slate-900 dark:text-white shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="university" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">University</label>
                  <input
                    type="text"
                    id="university"
                    name="university"
                    value={profile.university}
                    onChange={handleChange}
                    placeholder="State University"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-4 py-3 text-sm text-slate-900 dark:text-white shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="major" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Major</label>
                  <input
                    type="text"
                    id="major"
                    name="major"
                    value={profile.major}
                    onChange={handleChange}
                    placeholder="Computer Science"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-4 py-3 text-sm text-slate-900 dark:text-white shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
              <div className="h-6">
                {saveStatus === 'success' && (
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Profile saved successfully
                  </span>
                )}
                {saveStatus === 'error' && (
                  <span className="text-sm font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    Failed to save profile
                  </span>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isSaving}
                className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Saving...
                  </>
                ) : (
                  <>
                    Save Changes
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
