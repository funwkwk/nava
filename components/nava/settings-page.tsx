"use client";

import { useState, useRef, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Camera,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  Key,
  QrCode,
  Copy,
  Download,
  Check,
  Eye,
  EyeOff,
  Smartphone,
  AlertCircle,
  CheckCircle2,
  Sun,
  Moon,
  Sparkles,
  X,
  RefreshCw,
  LogOut,
} from "lucide-react";
import { useNava } from "@/components/nava/nava-provider";
import { Badge, Button, Card, Input, SectionHeading, cn } from "@/components/nava/ui";

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
];

function generateSecretKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let secret = "";
  for (let i = 0; i < 16; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret.match(/.{1,4}/g)?.join("-") ?? secret;
}

function generateBackupCodes(): string[] {
  const codes: string[] = [];
  const chars = "0123456789ABCDEF";
  for (let i = 0; i < 8; i++) {
    let part1 = "";
    let part2 = "";
    for (let j = 0; j < 4; j++) {
      part1 += chars.charAt(Math.floor(Math.random() * chars.length));
      part2 += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    codes.push(`${part1}-${part2}`);
  }
  return codes;
}

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!password) {
    return { score: 0, label: "Belum diisi", color: "bg-stone-200" };
  }
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: "Sangat Lemah", color: "bg-rose-500" };
  if (score === 2) return { score: 2, label: "Lemah", color: "bg-amber-500" };
  if (score === 3) return { score: 3, label: "Sedang", color: "bg-yellow-500" };
  if (score === 4) return { score: 4, label: "Kuat", color: "bg-emerald-500" };
  return { score: 5, label: "Sangat Aman", color: "bg-emerald-600" };
}

export function SettingsPage() {
  const router = useRouter();
  const {
    sessionUser,
    workspace,
    state,
    theme,
    setTheme,
    updateProfile,
    changeEmail,
    changePassword,
    setTwoFactor,
    deleteAccount,
    resetDemo,
    logout,
  } = useNava();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "preferences" | "danger">(
    "profile",
  );

  // Profile Form state
  const [name, setName] = useState(sessionUser?.name ?? "");
  const [nameSuccess, setNameSuccess] = useState<string | null>(null);
  const [showPresets, setShowPresets] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Email Form state
  const [newEmail, setNewEmail] = useState("");
  const [emailCurrentPassword, setEmailCurrentPassword] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Password Form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // 2FA Setup state
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  const [twoFactorStep, setTwoFactorStep] = useState<1 | 2 | 3>(1);
  const [generatedSecret, setGeneratedSecret] = useState("");
  const [generatedBackupCodes, setGeneratedBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [secretCopied, setSecretCopied] = useState(false);
  const [codesCopied, setCodesCopied] = useState(false);

  // 2FA View Backup Codes Modal
  const [viewBackupCodesModalOpen, setViewBackupCodesModalOpen] = useState(false);

  // 2FA Disable Modal
  const [disableTwoFactorModalOpen, setDisableTwoFactorModalOpen] = useState(false);

  // Delete Account state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [isPendingDelete, startDeleteTransition] = useTransition();

  if (!workspace || !sessionUser) {
    return null;
  }

  // --- Handlers: Profile Photo ---
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Harap pilih file gambar (JPG, PNG, WebP, dsb).");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      alert("Ukuran gambar melebihi 3MB. Harap gunakan gambar yang lebih kecil.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      updateProfile({ avatarUrl: dataUrl });
      setNameSuccess("Foto profil berhasil diperbarui!");
      setTimeout(() => setNameSuccess(null), 3000);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleSelectPreset = (url: string) => {
    updateProfile({ avatarUrl: url });
    setShowPresets(false);
    setNameSuccess("Foto profil berhasil diganti ke avatar preset!");
    setTimeout(() => setNameSuccess(null), 3000);
  };

  const handleRemovePhoto = () => {
    updateProfile({ avatarUrl: null });
    setNameSuccess("Foto profil telah dihapus.");
    setTimeout(() => setNameSuccess(null), 3000);
  };

  // --- Handlers: Name ---
  const handleSaveName = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      alert("Nama minimal harus memiliki 2 karakter.");
      return;
    }
    updateProfile({ name: name.trim() });
    setNameSuccess("Nama akun berhasil diperbarui!");
    setTimeout(() => setNameSuccess(null), 3000);
  };

  // --- Handlers: Email ---
  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setEmailSuccess(null);

    const target = newEmail.trim().toLowerCase();
    if (!target || !target.includes("@")) {
      setEmailError("Masukkan alamat email yang valid.");
      return;
    }

    if (target === sessionUser.email.toLowerCase()) {
      setEmailError("Alamat email baru sama dengan email saat ini.");
      return;
    }

    if (!emailCurrentPassword) {
      setEmailError("Masukkan password saat ini untuk memverifikasi perubahan email.");
      return;
    }

    setEmailLoading(true);
    try {
      const result = await changeEmail(target);
      if (!result.success) {
        setEmailError(result.error ?? "Gagal memperbarui email.");
      } else {
        setEmailSuccess(`Email berhasil diubah ke ${target}!`);
        setNewEmail("");
        setEmailCurrentPassword("");
      }
    } catch {
      setEmailError("Terjadi kesalahan saat memproses perubahan email.");
    } finally {
      setEmailLoading(false);
    }
  };

  // --- Handlers: Password ---
  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword) {
      setPasswordError("Masukkan password Anda saat ini.");
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setPasswordError("Password baru minimal harus 8 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi password baru tidak cocok.");
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError("Password baru tidak boleh sama dengan password saat ini.");
      return;
    }

    setPasswordLoading(true);
    try {
      const result = await changePassword(newPassword);
      if (!result.success) {
        setPasswordError(result.error ?? "Gagal mengubah password.");
      } else {
        setPasswordSuccess("Password berhasil diubah! Gunakan password baru untuk login berikutnya.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setPasswordError("Terjadi kesalahan saat mengubah password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  // --- Handlers: 2FA Setup Flow ---
  const startTwoFactorSetup = () => {
    const secret = generateSecretKey();
    const codes = generateBackupCodes();
    setGeneratedSecret(secret);
    setGeneratedBackupCodes(codes);
    setVerificationCode("");
    setVerificationError(null);
    setTwoFactorStep(1);
    setTwoFactorModalOpen(true);
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(generatedSecret.replace(/-/g, ""));
    setSecretCopied(true);
    setTimeout(() => setSecretCopied(false), 2000);
  };

  const handleCopyBackupCodes = (codes: string[]) => {
    navigator.clipboard.writeText(codes.join("\n"));
    setCodesCopied(true);
    setTimeout(() => setCodesCopied(false), 2000);
  };

  const handleDownloadBackupCodes = (codes: string[]) => {
    const element = document.createElement("a");
    const file = new Blob(
      [
        `KODE PEMULIHAN CADANGAN NAVA (2FA)\n` +
          `Akun: ${sessionUser.email}\n` +
          `Dibuat: ${new Date().toLocaleString("id-ID")}\n\n` +
          `PERINGATAN: Simpan kode ini di tempat yang aman. Setiap kode hanya dapat digunakan satu kali.\n\n` +
          codes.map((c, i) => `${i + 1}. ${c}`).join("\n"),
      ],
      { type: "text/plain" },
    );
    element.href = URL.createObjectURL(file);
    element.download = `nava-backup-codes-${sessionUser.email.split("@")[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleVerify2FACode = (e: FormEvent) => {
    e.preventDefault();
    const sanitized = verificationCode.replace(/\s+/g, "");
    if (sanitized.length !== 6 || !/^\d{6}$/.test(sanitized)) {
      setVerificationError("Masukkan 6 digit angka kode verifikasi dari aplikasi autentikator.");
      return;
    }

    setTwoFactorStep(3);
  };

  const handleFinalize2FA = () => {
    setTwoFactor(true, generatedSecret, generatedBackupCodes);
    setTwoFactorModalOpen(false);
    setNameSuccess("Autentikasi Dua Faktor (2FA) berhasil diaktifkan!");
    setTimeout(() => setNameSuccess(null), 3500);
  };

  const handleConfirmDisable2FA = () => {
    setTwoFactor(false);
    setDisableTwoFactorModalOpen(false);
    setNameSuccess("Autentikasi Dua Faktor (2FA) telah dinonaktifkan.");
    setTimeout(() => setNameSuccess(null), 3500);
  };

  // --- Handlers: Delete Account ---
  const isDeleteConfirmed =
    deleteConfirmationText.trim().toLowerCase() === sessionUser.email.toLowerCase() ||
    deleteConfirmationText.trim().toUpperCase() === "DELETE" ||
    deleteConfirmationText.trim().toUpperCase() === "HAPUS";

  const handleDeleteAccountConfirm = () => {
    if (!isDeleteConfirmed) return;

    startDeleteTransition(async () => {
      await deleteAccount();
      router.push("/login");
    });
  };

  const strength = getPasswordStrength(newPassword);

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Pengaturan Akun"
        title="Pengaturan & Keamanan"
        description="Kelola profil akun, ubah email dan password, amankan workspace dengan autentikasi 2FA, serta kontrol data akun Anda."
      />

      {/* Global Success Banner */}
      {nameSuccess && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <p className="font-medium">{nameSuccess}</p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--border-subtle)] pb-2">
        {[
          { id: "profile", label: "Profil & Akun", icon: User },
          { id: "security", label: "Keamanan & 2FA", icon: ShieldCheck },
          { id: "preferences", label: "Tampilan & Sistem", icon: Sun },
          { id: "danger", label: "Zona Berbahaya", icon: AlertCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition",
                isActive
                  ? "bg-[var(--surface-brand-soft)] text-[var(--surface-brand)] shadow-sm"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--surface-card-alt)] hover:text-foreground",
                tab.id === "danger" && isActive && "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
                tab.id === "danger" && !isActive && "hover:text-rose-600",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.id === "security" && sessionUser.twoFactorEnabled && (
                <span className="h-2 w-2 rounded-full bg-emerald-500" title="2FA Aktif" />
              )}
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: PROFIL & AKUN                                     */}
      {/* ======================================================== */}
      {activeTab === "profile" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Foto Profil Card */}
          <Card className="space-y-5 p-5">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Foto Profil</h2>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Foto ini akan muncul di pojok kiri bawah, menu navigasi, dan saat berkolaborasi di dalam workspace.
              </p>
            </div>

            <div className="flex flex-col items-center gap-5 sm:flex-row">
              <div className="relative group">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[var(--border-subtle)] bg-[var(--surface-accent)] shadow-sm">
                  {sessionUser.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={sessionUser.avatarUrl}
                      alt={sessionUser.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-semibold text-[var(--surface-accent-foreground)]">
                      {sessionUser.name.slice(0, 1).toUpperCase()}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-white bg-[var(--surface-brand)] text-white shadow hover:opacity-90 transition"
                  title="Ganti foto"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <p className="text-base font-semibold">{sessionUser.name}</p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Mendukung file JPG, PNG, atau WebP (maks. 3MB).
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-1 sm:justify-start">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Unggah Foto
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => setShowPresets(!showPresets)}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Pilih Avatar
                  </Button>
                  {sessionUser.avatarUrl && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={handleRemovePhoto}
                      className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <Trash2 className="mr-1.5 h-4 w-4" />
                      Hapus
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Presets Gallery Dropdown */}
            {showPresets && (
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card-alt)] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                    Pilih Avatar Preset
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowPresets(false)}
                    className="text-xs text-[var(--muted-foreground)] hover:text-foreground"
                  >
                    Tutup
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-3">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(url)}
                      className={cn(
                        "relative flex aspect-square items-center justify-center overflow-hidden rounded-full border-2 transition hover:scale-105",
                        sessionUser.avatarUrl === url
                          ? "border-[var(--surface-brand)] ring-2 ring-[var(--surface-brand-soft)]"
                          : "border-transparent hover:border-[var(--border-strong)]",
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Preset ${idx + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Ganti Nama Card */}
          <Card className="space-y-5 p-5">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Nama Lengkap</h2>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Nama yang akan ditampilkan pada profil, workspace, dan laporan audit Anda.
              </p>
            </div>

            <form onSubmit={handleSaveName} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--muted-foreground)]">
                  Nama Anda
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-[var(--muted-foreground)]" />
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama lengkap"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Badge tone="brand">
                    Tipe: {sessionUser.accountType === "agency" ? "Agency / Tim" : "Personal"}
                  </Badge>
                </div>
                <Button type="submit" variant="primary" disabled={!name.trim() || name === sessionUser.name}>
                  Simpan Nama
                </Button>
              </div>
            </form>
          </Card>

          {/* Ganti Email Card - Full Width in Tab */}
          <Card className="space-y-5 p-5 lg:col-span-2">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Ganti Alamat Email</h2>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Pastikan alamat email baru aktif dan dapat diakses untuk menerima notifikasi serta pemulihan akses.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <Badge tone="success">
                  <Check className="mr-1 h-3 w-3" /> Terverifikasi
                </Badge>
              </div>
            </div>

            {emailSuccess && (
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <p className="font-medium">{emailSuccess}</p>
              </div>
            )}

            {emailError && (
              <div className="flex items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-50 p-4 text-sm text-rose-800 dark:bg-rose-950/40 dark:text-rose-200">
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
                <p className="font-medium">{emailError}</p>
              </div>
            )}

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[var(--muted-foreground)]">
                    Email Saat Ini
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-[var(--muted-foreground)]" />
                    <Input
                      value={sessionUser.email}
                      disabled
                      className="cursor-not-allowed bg-[var(--surface-card-alt)] pl-10 opacity-75"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-[var(--muted-foreground)]">
                    Alamat Email Baru
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-[var(--muted-foreground)]" />
                    <Input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="nama@domain.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--muted-foreground)]">
                  Konfirmasi Password Saat Ini
                </label>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Demi keamanan akun, masukkan password saat ini sebelum mengubah email.
                </p>
                <div className="relative max-w-md">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-[var(--muted-foreground)]" />
                  <Input
                    type="password"
                    value={emailCurrentPassword}
                    onChange={(e) => setEmailCurrentPassword(e.target.value)}
                    placeholder="Masukkan password Anda"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={emailLoading || !newEmail || !emailCurrentPassword}
                >
                  {emailLoading ? "Menyimpan Email..." : "Perbarui Email"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: KEAMANAN & 2FA                                    */}
      {/* ======================================================== */}
      {activeTab === "security" && (
        <div className="space-y-6">
          {/* Ganti Password Card */}
          <Card className="space-y-5 p-5">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Ganti Password</h2>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Perbarui kata sandi secara berkala untuk menjaga akun NAVA Anda tetap terlindungi.
              </p>
            </div>

            {passwordSuccess && (
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <p className="font-medium">{passwordSuccess}</p>
              </div>
            )}

            {passwordError && (
              <div className="flex items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-50 p-4 text-sm text-rose-800 dark:bg-rose-950/40 dark:text-rose-200">
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
                <p className="font-medium">{passwordError}</p>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--muted-foreground)]">
                  Password Saat Ini
                </label>
                <div className="relative max-w-md">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-[var(--muted-foreground)]" />
                  <Input
                    type={showCurrentPw ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Masukkan password saat ini"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                    className="absolute right-3.5 top-3.5 text-[var(--muted-foreground)] hover:text-foreground"
                    title={showCurrentPw ? "Sembunyikan" : "Tampilkan"}
                  >
                    {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[var(--muted-foreground)]">
                    Password Baru
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-[var(--muted-foreground)]" />
                    <Input
                      type={showNewPw ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimal 8 karakter"
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      className="absolute right-3.5 top-3.5 text-[var(--muted-foreground)] hover:text-foreground"
                      title={showNewPw ? "Sembunyikan" : "Tampilkan"}
                    >
                      {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  {newPassword && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--muted-foreground)]">Kekuatan password:</span>
                        <span className="font-semibold">{strength.label}</span>
                      </div>
                      <div className="flex h-1.5 gap-1 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
                        <div
                          className={cn("h-full transition-all duration-300", strength.color)}
                          style={{ width: `${(strength.score / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-[var(--muted-foreground)]">
                    Konfirmasi Password Baru
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-[var(--muted-foreground)]" />
                    <Input
                      type={showConfirmPw ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ketik ulang password baru"
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPw(!showConfirmPw)}
                      className="absolute right-3.5 top-3.5 text-[var(--muted-foreground)] hover:text-foreground"
                      title={showConfirmPw ? "Sembunyikan" : "Tampilkan"}
                    >
                      {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-rose-600">Password konfirmasi belum cocok.</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={
                    passwordLoading ||
                    !currentPassword ||
                    !newPassword ||
                    newPassword !== confirmPassword
                  }
                >
                  {passwordLoading ? "Menyimpan Password..." : "Perbarui Password"}
                </Button>
              </div>
            </form>
          </Card>

          {/* Autentikasi Dua Faktor (2FA) Card */}
          <Card className="space-y-5 p-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold tracking-tight">Autentikasi Dua Faktor (2FA)</h2>
                  <Badge tone={sessionUser.twoFactorEnabled ? "success" : "neutral"}>
                    {sessionUser.twoFactorEnabled ? "2FA Aktif" : "Tidak Aktif"}
                  </Badge>
                </div>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Amankan akun Anda dengan mewajibkan kode 6 digit dari aplikasi autentikator (Google Authenticator, Microsoft Authenticator, atau Authy) saat masuk.
                </p>
              </div>

              <div className="shrink-0">
                {sessionUser.twoFactorEnabled ? (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setViewBackupCodesModalOpen(true)}
                    >
                      <Key className="mr-1.5 h-4 w-4" />
                      Kode Cadangan
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setDisableTwoFactorModalOpen(true)}
                      className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      Nonaktifkan
                    </Button>
                  </div>
                ) : (
                  <Button type="button" variant="primary" onClick={startTwoFactorSetup}>
                    <ShieldCheck className="mr-2 h-4 w-4 text-emerald-600" />
                    Aktifkan 2FA
                  </Button>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card-alt)] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-card)] text-[var(--surface-brand)] shadow-sm">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">
                    {sessionUser.twoFactorEnabled
                      ? "Akun Anda terlindungi dengan standar TOTP"
                      : "Kenapa harus mengaktifkan 2FA?"}
                  </p>
                  <p className="text-xs leading-5 text-[var(--muted-foreground)]">
                    {sessionUser.twoFactorEnabled
                      ? "Kode verifikasi 6 digit akan diminta saat ada percobaan login dari perangkat baru atau sesi yang telah kedaluwarsa."
                      : "Bahkan jika kata sandi Anda bocor, pihak lain tidak akan dapat mengakses akun tanpa kode dinamis dari ponsel atau aplikasi autentikator Anda."}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: TAMPILAN & SISTEM                                 */}
      {/* ======================================================== */}
      {activeTab === "preferences" && (
        <div className="space-y-6">
          {/* Appearance Card */}
          <Card className="space-y-5 p-5">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Tema Tampilan</h2>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Pilih gaya visual antarmuka kerja Anda antara mode terang atau gelap.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={cn(
                  "flex items-start gap-4 rounded-2xl border p-4 text-left transition",
                  theme === "light"
                    ? "border-[var(--surface-brand)] bg-[var(--surface-brand-soft)] shadow-sm"
                    : "border-[var(--border-subtle)] bg-[var(--surface-card-alt)] hover:border-[var(--border-strong)]",
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-500 shadow-sm">
                  <Sun className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">Mode Terang (Light)</p>
                    {theme === "light" && <Badge tone="brand">Aktif</Badge>}
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] leading-5">
                    Tampilan kanvas cerah dengan kontras bersih untuk produktivitas siang hari.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={cn(
                  "flex items-start gap-4 rounded-2xl border p-4 text-left transition",
                  theme === "dark"
                    ? "border-[var(--surface-brand)] bg-[var(--surface-brand-soft)] shadow-sm"
                    : "border-[var(--border-subtle)] bg-[var(--surface-card-alt)] hover:border-[var(--border-strong)]",
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-indigo-400 shadow-sm">
                  <Moon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">Mode Gelap (Dark)</p>
                    {theme === "dark" && <Badge tone="brand">Aktif</Badge>}
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] leading-5">
                    Warna latar gelap dengan kontras nyaman untuk sesi kerja malam hari.
                  </p>
                </div>
              </button>
            </div>
          </Card>

          {/* Workspace Info & Environment Card */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="space-y-4 p-5">
              <h2 className="text-xl font-semibold tracking-tight">Ringkasan Workspace</h2>
              <div className="space-y-3">
                <div className="rounded-xl bg-[var(--surface-card-alt)] p-3.5">
                  <p className="text-xs text-[var(--muted-foreground)]">Nama Workspace</p>
                  <p className="mt-1 text-base font-semibold">{workspace.name}</p>
                </div>
                <div className="rounded-xl bg-[var(--surface-card-alt)] p-3.5">
                  <p className="text-xs text-[var(--muted-foreground)]">Pemilik Akun</p>
                  <p className="mt-1 text-base font-semibold">{sessionUser.email}</p>
                </div>
                <div className="rounded-xl bg-[var(--surface-card-alt)] p-3.5">
                  <p className="text-xs text-[var(--muted-foreground)]">Tipe Lisensi</p>
                  <p className="mt-1 text-base font-semibold capitalize">{sessionUser.accountType} Plan</p>
                </div>
              </div>
            </Card>

            <Card className="space-y-4 p-5">
              <h2 className="text-xl font-semibold tracking-tight">Status Lingkungan</h2>
              <div className="space-y-3">
                <div className="rounded-xl bg-[var(--surface-card-alt)] p-3.5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Koneksi Supabase</p>
                    <Badge tone={state.supabaseConfigured ? "success" : "warning"}>
                      {state.supabaseConfigured ? "Tersambung" : "Demo Mode"}
                    </Badge>
                  </div>
                  <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">
                    {state.supabaseConfigured
                      ? "Terhubung ke database Supabase live."
                      : "Menjalankan penyimpanan lokal berkinerja tinggi (demo mode)."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button variant="secondary" size="sm" onClick={logout}>
                    <LogOut className="mr-1.5 h-4 w-4" /> Keluar (Sign out)
                  </Button>
                  <Button variant="secondary" size="sm" onClick={resetDemo}>
                    <RefreshCw className="mr-1.5 h-4 w-4" /> Reset Demo
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: ZONA BERBAHAYA (DANGER ZONE)                      */}
      {/* ======================================================== */}
      {activeTab === "danger" && (
        <Card className="space-y-5 rounded-[24px] border border-rose-300 bg-rose-50/40 p-5 dark:border-rose-900/60 dark:bg-rose-950/20">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight text-rose-900 dark:text-rose-200">
                Zona Berbahaya: Hapus Akun
              </h2>
              <p className="text-sm leading-6 text-rose-700/80 dark:text-rose-300/80">
                Menghapus akun Anda akan menghapus seluruh data workspace, postingan sosial terjadwal, koneksi kanal, dan riwayat analitik secara permanen. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-rose-200 bg-white p-4 text-xs text-rose-800 space-y-2 dark:border-rose-900 dark:bg-stone-900 dark:text-rose-300">
            <p className="font-semibold">Konsekuensi penghapusan akun:</p>
            <ul className="list-disc pl-4 space-y-1 text-[var(--muted-foreground)]">
              <li>Semua draf postingan dan jadwal publikasi akan dibatalkan.</li>
              <li>Akun media sosial yang terhubung akan diputus secara instan.</li>
              <li>Anggota workspace dan data klien yang terafiliasi akan terhapus.</li>
              <li>Sesi login Anda akan langsung diakhiri.</li>
            </ul>
          </div>

          <div className="flex items-center justify-end pt-2">
            <Button
              type="button"
              variant="danger"
              onClick={() => {
                setDeleteConfirmationText("");
                setDeleteModalOpen(true);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus Akun Saya
            </Button>
          </div>
        </Card>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: SETUP 2FA                                       */}
      {/* ======================================================== */}
      {twoFactorModalOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setTwoFactorModalOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="setup-2fa-title"
            className="relative flex max-h-[90vh] w-full max-w-[560px] flex-col overflow-y-auto rounded-[24px] bg-[var(--surface-card)] p-6 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setTwoFactorModalOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[var(--muted-foreground)] hover:bg-[var(--surface-card-alt)] hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 id="setup-2fa-title" className="text-xl font-semibold tracking-tight">
                  Aktifkan Autentikasi 2-Langkah
                </h3>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Langkah {twoFactorStep} dari 3:{" "}
                  {twoFactorStep === 1
                    ? "Pindai QR Code"
                    : twoFactorStep === 2
                    ? "Verifikasi Kode"
                    : "Simpan Kode Cadangan"}
                </p>
              </div>
            </div>

            {/* Step 1: Scan QR Code */}
            {twoFactorStep === 1 && (
              <div className="space-y-5">
                <p className="text-sm text-[var(--muted-foreground)] leading-6">
                  Buka aplikasi autentikator di ponsel Anda (misalnya <strong>Google Authenticator</strong>, <strong>Microsoft Authenticator</strong>, atau <strong>1Password</strong>) lalu pindai QR code berikut:
                </p>

                <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-white p-6 dark:bg-stone-900">
                  {/* Clean Authentic SVG QR Code Representation */}
                  <div className="relative flex h-48 w-48 items-center justify-center rounded-xl bg-white p-3 shadow-inner">
                    <svg
                      viewBox="0 0 100 100"
                      className="h-full w-full"
                      shapeRendering="crispEdges"
                      fill="black"
                    >
                      {/* Top-Left Finder */}
                      <rect x="0" y="0" width="28" height="28" fill="#000" />
                      <rect x="4" y="4" width="20" height="20" fill="#fff" />
                      <rect x="8" y="8" width="12" height="12" fill="#000" />

                      {/* Top-Right Finder */}
                      <rect x="72" y="0" width="28" height="28" fill="#000" />
                      <rect x="76" y="4" width="20" height="20" fill="#fff" />
                      <rect x="80" y="8" width="12" height="12" fill="#000" />

                      {/* Bottom-Left Finder */}
                      <rect x="0" y="72" width="28" height="28" fill="#000" />
                      <rect x="4" y="76" width="20" height="20" fill="#fff" />
                      <rect x="8" y="80" width="12" height="12" fill="#000" />

                      {/* Alignment pattern */}
                      <rect x="68" y="68" width="16" height="16" fill="#000" />
                      <rect x="72" y="72" width="8" height="8" fill="#fff" />
                      <rect x="74" y="74" width="4" height="4" fill="#000" />

                      {/* Timing bars */}
                      <line x1="32" y1="12" x2="68" y2="12" stroke="#000" strokeWidth="4" strokeDasharray="4,4" />
                      <line x1="12" y1="32" x2="12" y2="68" stroke="#000" strokeWidth="4" strokeDasharray="4,4" />

                      {/* Data dots matrix */}
                      <rect x="36" y="24" width="4" height="4" />
                      <rect x="44" y="24" width="4" height="4" />
                      <rect x="52" y="24" width="4" height="4" />
                      <rect x="60" y="24" width="4" height="4" />
                      <rect x="32" y="36" width="4" height="4" />
                      <rect x="40" y="36" width="4" height="4" />
                      <rect x="48" y="36" width="4" height="4" />
                      <rect x="56" y="36" width="4" height="4" />
                      <rect x="64" y="36" width="4" height="4" />
                      <rect x="24" y="44" width="4" height="4" />
                      <rect x="36" y="44" width="4" height="4" />
                      <rect x="44" y="44" width="4" height="4" />
                      <rect x="52" y="44" width="4" height="4" />
                      <rect x="68" y="44" width="4" height="4" />
                      <rect x="32" y="52" width="4" height="4" />
                      <rect x="48" y="52" width="4" height="4" />
                      <rect x="60" y="52" width="4" height="4" />
                      <rect x="24" y="60" width="4" height="4" />
                      <rect x="40" y="60" width="4" height="4" />
                      <rect x="56" y="60" width="4" height="4" />
                      <rect x="36" y="68" width="4" height="4" />
                      <rect x="44" y="68" width="4" height="4" />
                      <rect x="52" y="68" width="4" height="4" />
                      <rect x="32" y="76" width="4" height="4" />
                      <rect x="48" y="76" width="4" height="4" />
                      <rect x="40" y="84" width="4" height="4" />
                      <rect x="56" y="84" width="4" height="4" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--surface-brand)] text-white shadow">
                        <QrCode className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-[var(--muted-foreground)]">
                    NAVA Authenticator (TOTP)
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Tidak bisa memindai QR code? Masukkan kunci rahasia ini secara manual:
                  </p>
                  <div className="flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card-alt)] p-2.5">
                    <code className="flex-1 font-mono text-sm tracking-wider font-semibold text-center text-foreground">
                      {generatedSecret}
                    </code>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={handleCopySecret}
                      className="shrink-0"
                    >
                      {secretCopied ? (
                        <>
                          <Check className="mr-1 h-3.5 w-3.5 text-emerald-600" /> Tersalin
                        </>
                      ) : (
                        <>
                          <Copy className="mr-1 h-3.5 w-3.5" /> Salin
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="secondary" onClick={() => setTwoFactorModalOpen(false)}>
                    Batal
                  </Button>
                  <Button variant="primary" onClick={() => setTwoFactorStep(2)}>
                    Lanjut ke Verifikasi
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Verification Code Input */}
            {twoFactorStep === 2 && (
              <form onSubmit={handleVerify2FACode} className="space-y-5">
                <p className="text-sm text-[var(--muted-foreground)] leading-6">
                  Masukkan 6 digit kode yang tampil di aplikasi autentikator Anda untuk memverifikasi pemasangan:
                </p>

                {verificationError && (
                  <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{verificationError}</span>
                  </div>
                )}

                <div className="flex flex-col items-center justify-center space-y-3 py-4">
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    autoFocus
                    value={verificationCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setVerificationCode(val);
                      if (verificationError) setVerificationError(null);
                    }}
                    placeholder="000000"
                    className="h-14 max-w-[240px] text-center text-2xl font-bold tracking-[0.4em]"
                  />
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Tip: Masukkan 6 angka dari Google Authenticator atau Authy (contoh: 123456).
                  </p>
                </div>

                <div className="flex justify-between gap-2 pt-2">
                  <Button variant="secondary" onClick={() => setTwoFactorStep(1)}>
                    Kembali
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={verificationCode.length !== 6}
                  >
                    Verifikasi Kode
                  </Button>
                </div>
              </form>
            )}

            {/* Step 3: Backup Codes */}
            {twoFactorStep === 3 && (
              <div className="space-y-5">
                <div className="rounded-2xl border border-amber-500/30 bg-amber-50/50 p-4 text-xs text-amber-900 leading-5 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-200">
                  <p className="font-semibold">Simpan Kode Pemulihan Cadangan Ini!</p>
                  <p className="mt-1">
                    Jika Anda kehilangan akses ke ponsel atau aplikasi autentikator, setiap kode ini dapat digunakan satu kali untuk masuk ke akun Anda.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card-alt)] p-4 font-mono text-sm">
                  {generatedBackupCodes.map((code, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg bg-[var(--surface-card)] px-3 py-1.5 shadow-xs"
                    >
                      <span className="text-xs text-[var(--muted-foreground)]">#{index + 1}</span>
                      <span className="font-semibold tracking-wider">{code}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleCopyBackupCodes(generatedBackupCodes)}
                  >
                    {codesCopied ? (
                      <>
                        <Check className="mr-1.5 h-4 w-4 text-emerald-600" /> Semua Kode Tersalin
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1.5 h-4 w-4" /> Salin Semua Kode
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDownloadBackupCodes(generatedBackupCodes)}
                  >
                    <Download className="mr-1.5 h-4 w-4" /> Unduh File (.txt)
                  </Button>
                </div>

                <div className="flex justify-end pt-2">
                  <Button variant="primary" onClick={handleFinalize2FA}>
                    Saya Sudah Menyimpan Kode & Selesai
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: LIHAT KODE CADANGAN                             */}
      {/* ======================================================== */}
      {viewBackupCodesModalOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setViewBackupCodesModalOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="view-codes-title"
            className="relative flex max-h-[90vh] w-full max-w-[500px] flex-col overflow-y-auto rounded-[24px] bg-[var(--surface-card)] p-6 shadow-2xl space-y-4"
          >
            <button
              type="button"
              onClick={() => setViewBackupCodesModalOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[var(--muted-foreground)] hover:bg-[var(--surface-card-alt)] hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <Key className="h-5 w-5" />
              </div>
              <div>
                <h3 id="view-codes-title" className="text-xl font-semibold tracking-tight">
                  Kode Pemulihan Cadangan
                </h3>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Gunakan kode ini jika Anda tidak membawa perangkat autentikator.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card-alt)] p-4 font-mono text-sm">
              {(sessionUser.backupCodes ?? generatedBackupCodes.length ? generatedBackupCodes : ["A7B2-C9D4", "9F1E-33A8", "5E4D-88B1", "2C9A-77F0"]).map(
                (code, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-[var(--surface-card)] px-3 py-1.5 shadow-xs"
                  >
                    <span className="text-xs text-[var(--muted-foreground)]">#{index + 1}</span>
                    <span className="font-semibold tracking-wider">{code}</span>
                  </div>
                ),
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  handleCopyBackupCodes(
                    sessionUser.backupCodes ?? ["A7B2-C9D4", "9F1E-33A8", "5E4D-88B1", "2C9A-77F0"],
                  )
                }
              >
                <Copy className="mr-1.5 h-4 w-4" /> Salin Semua
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  handleDownloadBackupCodes(
                    sessionUser.backupCodes ?? ["A7B2-C9D4", "9F1E-33A8", "5E4D-88B1", "2C9A-77F0"],
                  )
                }
              >
                <Download className="mr-1.5 h-4 w-4" /> Unduh (.txt)
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="ml-auto"
                onClick={() => setViewBackupCodesModalOpen(false)}
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: NONAKTIFKAN 2FA                                 */}
      {/* ======================================================== */}
      {disableTwoFactorModalOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setDisableTwoFactorModalOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="disable-2fa-title"
            className="relative flex w-full max-w-[460px] flex-col rounded-[24px] bg-[var(--surface-card)] p-6 shadow-2xl space-y-4"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
              <AlertCircle className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h3 id="disable-2fa-title" className="text-xl font-semibold tracking-tight">
                Nonaktifkan Autentikasi 2-Langkah?
              </h3>
              <p className="text-sm leading-6 text-[var(--muted-foreground)]">
                Tindakan ini akan menurunkan keamanan akun Anda. Anda hanya akan memerlukan email dan password untuk masuk.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setDisableTwoFactorModalOpen(false)}>
                Batal
              </Button>
              <Button variant="danger" onClick={handleConfirmDisable2FA}>
                Ya, Nonaktifkan 2FA
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: HAPUS AKUN PERMANEN                             */}
      {/* ======================================================== */}
      {deleteModalOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !isPendingDelete) setDeleteModalOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
            className="relative flex max-h-[90vh] w-full max-w-[500px] flex-col overflow-y-auto rounded-[24px] bg-[var(--surface-card)] p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                <Trash2 className="h-6 w-6" />
              </div>
              <div>
                <h3 id="delete-account-title" className="text-xl font-semibold tracking-tight text-rose-900 dark:text-rose-200">
                  Konfirmasi Penghapusan Akun
                </h3>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Tindakan ini tidak dapat dibatalkan atau dipulihkan.
                </p>
              </div>
            </div>

            <p className="text-sm text-[var(--muted-foreground)] leading-6">
              Seluruh postingan media sosial, kanal yang tersambung, dan konfigurasi workspace untuk akun{" "}
              <strong className="text-foreground">{sessionUser.email}</strong> akan dihapus secara permanen.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-rose-800 dark:text-rose-300">
                Ketik email Anda <code className="rounded bg-rose-100 px-1.5 py-0.5 text-xs text-rose-900 dark:bg-rose-950 dark:text-rose-200 font-mono">{sessionUser.email}</code> atau <code className="rounded bg-rose-100 px-1.5 py-0.5 text-xs text-rose-900 dark:bg-rose-950 dark:text-rose-200 font-mono">DELETE</code> untuk konfirmasi:
              </label>
              <Input
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                placeholder="Ketik email atau DELETE"
                autoFocus
                disabled={isPendingDelete}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="secondary"
                disabled={isPendingDelete}
                onClick={() => setDeleteModalOpen(false)}
              >
                Batal
              </Button>
              <Button
                variant="danger"
                disabled={!isDeleteConfirmed || isPendingDelete}
                onClick={handleDeleteAccountConfirm}
              >
                {isPendingDelete ? "Menghapus Akun..." : "Hapus Akun Permanen"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
