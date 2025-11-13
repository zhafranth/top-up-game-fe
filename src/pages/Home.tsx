import { Footer } from "../components/Footer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import confettiAnimation from "../assets/confetti.json";
import GradientText from "../components/GradientText";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from "../components/ui/dialog";
import { toast } from "sonner";
import { useProducts } from "../hooks/useProducts";
import { Product } from "../types/product";
import { ProductCardSkeleton } from "../components/ProductCardSkeleton";
import { transactionService } from "../services/transaction";
import { QRCodeCanvas } from "qrcode.react";
import type { Transaction } from "../services/transaction";

export function Home() {
  const navigate = useNavigate();
  const [royalId, setRoyalId] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [selectedTopUp, setSelectedTopUp] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [whatsappError, setWhatsappError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [nickname, setNickname] = useState("");

  // Tambahan state untuk alur pembayaran QRIS
  const [paymentStep, setPaymentStep] = useState<"confirm" | "qris">("confirm");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [qrisData, setQrisData] = useState<{
    qrUrl?: string;
    qrString?: string;
    redirectUrl?: string;
    referenceId?: string;
  } | null>(null);
  const [createdTransactionId, setCreatedTransactionId] = useState<
    number | null
  >(null);
  // Status pembayaran (untuk indikator pada modal)
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "pending" | "success" | "failed"
  >("idle");
  const [backendStatus, setBackendStatus] = useState<string | null>(null);

  // States for Check Pembayaran modal
  const [isCheckDialogOpen, setIsCheckDialogOpen] = useState(false);
  const [checkTransactionId, setCheckTransactionId] = useState("");
  const [checkLoading, setCheckLoading] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [checkResult, setCheckResult] = useState<Transaction | null>(null);

  // Reset state ketika dialog dibuka ulang
  useEffect(() => {
    if (isDialogOpen) {
      setPaymentStep("confirm");
      setPaymentError(null);
      setIsProcessingPayment(false);
      setPaymentStatus("idle");
      setBackendStatus(null);
    }
  }, [isDialogOpen]);

  // Polling status transaksi ketika sudah di step QRIS
  useEffect(() => {
    let intervalId: any;

    const isSuccess = (s: string) => {
      const x = s.toLowerCase();
      return (
        x.includes("paid") ||
        x.includes("success") ||
        x.includes("settlement") ||
        x.includes("completed") ||
        x.includes("captured")
      );
    };

    const isFailed = (s: string) => {
      const x = s.toLowerCase();
      return (
        x.includes("failed") ||
        x.includes("cancel") ||
        x.includes("expired") ||
        x.includes("void")
      );
    };

    const checkStatus = async () => {
      if (!createdTransactionId) return;
      try {
        const trx = await transactionService.getTransaction(
          createdTransactionId
        );
        const s = String(trx.status ?? "");
        setBackendStatus(s);
        if (s) {
          if (isSuccess(s)) {
            setPaymentStatus("success");
            setShowConfetti(true);
            // Stop polling on success
            if (intervalId) clearInterval(intervalId);
            // Hide confetti after a while
            setTimeout(() => setShowConfetti(false), 3500);
          } else if (isFailed(s)) {
            setPaymentStatus("failed");
            // Stop polling on terminal failure
            if (intervalId) clearInterval(intervalId);
          } else {
            setPaymentStatus("pending");
          }
        }
      } catch (err) {
        // Keep silent retry, do not spam UI
      }
    };

    if (isDialogOpen && paymentStep === "qris" && createdTransactionId) {
      // Immediately check once and then poll
      setPaymentStatus((prev) => (prev === "success" ? prev : "pending"));
      checkStatus();
      intervalId = setInterval(checkStatus, 3000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isDialogOpen, paymentStep, createdTransactionId]);

  // Fetch products from API
  const {
    data: productsResponse,
    isLoading,
    error,
  } = useProducts({ limit: 20 });

  const heroImages = [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
    "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  ];

  // Auto slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatPriceNoDecimal = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const validateWhatsappNumber = (number: string): boolean => {
    // Remove all non-digit characters
    const cleanNumber = number.replace(/\D/g, "");

    // Check if it's empty
    if (!cleanNumber) {
      setWhatsappError("Nomor WhatsApp tidak boleh kosong");
      return false;
    }

    // Check minimum length (at least 10 digits)
    if (cleanNumber.length < 10) {
      setWhatsappError("Nomor WhatsApp minimal 10 digit");
      return false;
    }

    // Check maximum length (max 15 digits)
    if (cleanNumber.length > 15) {
      setWhatsappError("Nomor WhatsApp maksimal 15 digit");
      return false;
    }

    // Check if it starts with valid Indonesian phone number patterns
    const validPrefixes = ["08", "628", "+628"];
    const hasValidPrefix =
      validPrefixes.some((prefix) => {
        if (prefix === "08") {
          return cleanNumber.startsWith("08");
        } else if (prefix === "628") {
          return cleanNumber.startsWith("628");
        }
        return false;
      }) || number.startsWith("+628");

    if (!hasValidPrefix) {
      setWhatsappError(
        "Nomor WhatsApp harus dimulai dengan 08, +628, atau 628"
      );
      return false;
    }

    setWhatsappError("");
    return true;
  };

  const handleWhatsappChange = (value: string) => {
    // Only allow numbers, +, and spaces for formatting
    const sanitized = value.replace(/[^0-9+\s]/g, "");
    setWhatsappNumber(sanitized);

    // Validate on change
    if (sanitized.trim()) {
      validateWhatsappNumber(sanitized);
    } else {
      setWhatsappError("");
    }
  };

  const handleTopUpSelect = (productId: number) => {
    setSelectedTopUp(productId);
  };

  const handleSubmit = async () => {
    if (!royalId || !whatsappNumber || !selectedTopUp) return;
    if (!validateWhatsappNumber(whatsappNumber)) return;

    const selectedProduct = productsResponse?.products?.find(
      (product: Product) => product.id === selectedTopUp
    );

    if (!selectedProduct) return;

    try {
      setIsProcessingPayment(true);
      setPaymentError(null);

      // 1) Create transaction
      const createRes = await transactionService.createTransaction({
        total_diamond: selectedProduct.total_diamond,
        total_amount: selectedProduct.price,
        no_wa: whatsappNumber,
      });
      const trxId = createRes.transaction.id;
      setCreatedTransactionId(trxId);
      localStorage.setItem("lastTransactionId", String(trxId));

      // 2) Initiate QRIS
      const qrisRes = await transactionService.initiateQrisPayment(trxId);
      const qrUrl = qrisRes.qris?.qr_url;
      const qrString = qrisRes.qris?.qr_string;
      const redirectUrl = qrisRes.qris?.redirect_url;
      setQrisData({
        qrUrl: qrUrl || undefined,
        qrString: qrString || undefined,
        redirectUrl: redirectUrl || undefined,
        referenceId: qrisRes.reference_id,
      });

      // 3) Show QR step
      setPaymentStep("qris");
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Gagal memproses pembayaran";
      setPaymentError(msg);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!royalId) return;

    try {
      const response = await transactionService.checkNickname(royalId);
      console.log("response", response);
      if (response.success === true) {
        setIsDialogOpen(true);
        setNickname(response.nick);
      } else {
        toast(
          "ID yang Anda masukkan tidak ditemukan. Silakan periksa kembali."
        );
      }
    } catch (error: any) {
      toast(
        error?.response?.data?.message ||
          "ID tidak ditemukan. Silakan coba lagi."
      );
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none h-screen w-screen">
          <Lottie
            animationData={confettiAnimation}
            style={{ width: "100vw", height: "100vh" }}
            loop={false}
          />
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Image Slider */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={image}
                alt={`Gaming background ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Original gradient overlay */}
        <div className="absolute inset-0 wave-gradient opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20"></div>

        {/* Check Payment Button - Top Left */}
        <div className="absolute top-6 left-6 z-20">
          <Dialog open={isCheckDialogOpen} onOpenChange={setIsCheckDialogOpen}>
            <button
              onClick={() => setIsCheckDialogOpen(true)}
              className="text-gray-300 hover:text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/30"
            >
              💳 Check Pembayaran
            </button>
            <DialogContent className="sm:max-w-[480px] bg-gray-900 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>Cek Status Pembayaran</DialogTitle>
                <DialogDescription>
                  Masukkan ID transaksi Anda
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-purple-300">
                    ID Transaksi
                  </label>
                  <input
                    type="text"
                    value={checkTransactionId}
                    onChange={(e) => setCheckTransactionId(e.target.value)}
                    placeholder="Masukkan ID transaksi"
                    className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                  />
                </div>
                {checkError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-md p-3">
                    {checkError}
                  </div>
                )}
                {checkLoading && (
                  <div className="text-gray-300 text-sm">Memeriksa...</div>
                )}
                {checkResult && (
                  <div className="space-y-2 text-sm text-gray-200">
                    <div className="flex justify-between">
                      <span className="font-medium">ID:</span>
                      <span>{checkResult.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <span>{String(checkResult.status)}</span>
                    </div>
                    {"total_amount" in checkResult ? (
                      <div className="flex justify-between">
                        <span className="font-medium">Total:</span>
                        <span>{checkResult.total_amount}</span>
                      </div>
                    ) : null}
                    {"total_diamond" in checkResult ? (
                      <div className="flex justify-between">
                        <span className="font-medium">Diamond:</span>
                        <span>{checkResult.total_diamond}</span>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
              <DialogFooter>
                <button
                  type="button"
                  onClick={() => setIsCheckDialogOpen(false)}
                  className="px-4 py-2 text-gray-300 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => {}}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-70"
                  disabled={checkLoading}
                >
                  {checkLoading ? "Memeriksa..." : "Cek"}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 px-4 py-2 rounded-full border border-purple-500/30 mb-6">
              <span className="text-2xl">🎮</span>
              <span className="text-purple-300 font-semibold">
                Gaming Store
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={6}
                className="font-bold"
              >
                Top Up Games
              </GradientText>
            </h1>
            <p className="text-white text-xl max-w-2xl mx-auto leading-relaxed">
              Pilih game favoritmu dan lakukan top up dengan mudah, aman, dan
              terpercaya.
              <span className="text-purple-400 font-semibold">
                Buka 24 jam
              </span>{" "}
              dengan payment terlengkap!
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="feature-chip text-green-400">
                <span className="text-lg">✅</span>
                <span className="font-medium">Legal 100%</span>
              </div>
              <div className="feature-chip text-blue-400">
                <span className="text-lg">⚡</span>
                <span className="font-medium">Proses Cepat</span>
              </div>
              <div className="feature-chip text-purple-400">
                <span className="text-lg">🔒</span>
                <span className="font-medium">Aman Terpercaya</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Card untuk Form Input Data Akun */}
        <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              1
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Data Akun</h2>
              <p className="text-gray-300 text-sm mt-1">
                Masukkan informasi akun game Anda
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Royal ID
              </label>
              <input
                type="text"
                value={royalId}
                onChange={(e) => setRoyalId(e.target.value)}
                placeholder="Masukkan Royal ID Anda"
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Nomor WhatsApp
              </label>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => handleWhatsappChange(e.target.value)}
                placeholder="Contoh: 08123456789 atau +628123456789"
                className={`w-full px-4 py-3 bg-black/30 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  whatsappError
                    ? "border-red-500 focus:border-red-400 focus:ring-red-400/20"
                    : "border-purple-500/30 focus:border-purple-400 focus:ring-purple-400/20"
                }`}
              />
              {whatsappError && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  {whatsappError}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Card untuk List Top Up */}
        <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              2
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">
                Pilih Paket Top Up
              </h2>
              <p className="text-gray-300 text-sm mt-1">
                Pilih paket diamond sesuai kebutuhan Anda
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              <ProductCardSkeleton count={8} />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400">
                Gagal memuat produk. Silakan coba lagi.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {productsResponse?.products?.map((product: Product) => {
                const originalPrice =
                  product.discount > 0
                    ? product.price / (1 - product.discount / 100)
                    : null;
                return (
                  <div key={product.id} className="relative">
                    {product.is_populer && (
                      <div className="absolute -top-0 -right-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold px-2 py-1 rounded-full z-30 shadow-lg">
                        POPULER
                      </div>
                    )}
                    <div
                      onClick={() => handleTopUpSelect(product.id)}
                      className={`relative overflow-hidden cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                        selectedTopUp === product.id
                          ? "border-purple-400 bg-purple-500/20 shadow-lg shadow-purple-500/25"
                          : "border-gray-600/50 bg-black/20 hover:border-purple-500/50"
                      } ${
                        product.is_populer ? "ring-2 ring-yellow-400/50" : ""
                      }`}
                      style={{ marginTop: product.is_populer ? "8px" : "0" }}
                    >
                      {/* Flayer Diskon Segitiga di Pojok Kiri Atas */}
                      {product.discount > 0 && (
                        <div className="absolute top-0 left-0 w-0 h-0 border-l-[65px] border-l-red-500 border-b-[65px] border-b-transparent z-20">
                          <span className="absolute top-[20px] -left-[60px] text-white text-[14px] font-bold transform rotate-[-45deg] w-[30px] text-center leading-tight">
                            -{product.discount}%
                          </span>
                        </div>
                      )}

                      <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">
                          {product.total_diamond} 💎
                        </div>
                        <div className="text-sm text-gray-300 mb-2">
                          {product.name}
                        </div>
                        {product.discount > 0 && originalPrice ? (
                          <div>
                            <div className="text-sm text-gray-400 line-through mb-1">
                              {formatPriceNoDecimal(originalPrice)}
                            </div>
                            <div className="text-lg font-semibold text-purple-300">
                              {formatPrice(product.price)}
                            </div>
                          </div>
                        ) : (
                          <div className="text-lg font-semibold text-purple-300">
                            {formatPrice(product.price)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Button Lanjutkan Pembayaran - Hanya muncul jika data lengkap */}
        {royalId && whatsappNumber && selectedTopUp && (
          <div className="flex justify-center mt-8">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <button
                onClick={handleConfirmPayment}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
              >
                Lanjutkan Pembayaran
                <span className="arrow-bounce text-xl">→</span>
              </button>
              <DialogContent className="sm:max-w-[480px] bg-gray-900 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>
                    {paymentStep === "confirm"
                      ? "Konfirmasi Pembayaran"
                      : "Scan QRIS untuk membayar"}
                  </DialogTitle>
                  <DialogDescription>
                    {paymentStep === "confirm"
                      ? "Pastikan data yang Anda masukkan sudah benar sebelum melanjutkan pembayaran."
                      : "Buka aplikasi pembayaran Anda, pilih QRIS, lalu scan QR berikut untuk menyelesaikan pembayaran."}
                  </DialogDescription>
                </DialogHeader>
                {paymentError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-md p-3">
                    {paymentError}
                  </div>
                )}
                <div className="grid gap-4 py-4">
                  {paymentStep === "confirm" ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Nickname:</span>
                        <span>{nickname}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Royal ID:</span>
                        <span>{royalId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">WhatsApp:</span>
                        <span>{whatsappNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Paket:</span>
                        <span>
                          {
                            productsResponse?.products?.find(
                              (product: Product) => product.id === selectedTopUp
                            )?.total_diamond
                          }{" "}
                          💎
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Harga:</span>
                        <span className="font-bold text-green-600">
                          {formatPrice(
                            productsResponse?.products?.find(
                              (product: Product) => product.id === selectedTopUp
                            )?.price || 0
                          )}
                        </span>
                      </div>
                      {(() => {
                        const selectedProduct =
                          productsResponse?.products?.find(
                            (product: Product) => product.id === selectedTopUp
                          );
                        const originalPrice =
                          selectedProduct && selectedProduct.discount > 0
                            ? selectedProduct.price /
                              (1 - selectedProduct.discount / 100)
                            : null;
                        return originalPrice ? (
                          <div className="flex justify-between text-sm text-gray-400">
                            <span>Harga Normal:</span>
                            <span className="line-through">
                              {formatPriceNoDecimal(originalPrice)}
                            </span>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Informasi nominal & diamond */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">Nominal</span>
                        <span className="font-semibold text-green-500">
                          {formatPrice(
                            productsResponse?.products?.find(
                              (product: Product) => product.id === selectedTopUp
                            )?.price || 0
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">Diamond</span>
                        <span className="font-semibold">
                          {
                            productsResponse?.products?.find(
                              (product: Product) => product.id === selectedTopUp
                            )?.total_diamond
                          }{" "}
                          💎
                        </span>
                      </div>

                      {/* QR & Status */}
                      <div className="mt-2 p-4 rounded-xl bg-black/30 border border-gray-700 flex flex-col items-center justify-center">
                        {isProcessingPayment ? (
                          <div className="flex flex-col items-center justify-center py-8">
                            <div className="h-10 w-10 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
                            <p className="mt-3 text-sm text-gray-300">
                              Menginisiasi pembayaran...
                            </p>
                          </div>
                        ) : qrisData?.qrUrl ? (
                          <img
                            src={qrisData.qrUrl}
                            alt="QRIS"
                            className="w-56 h-56 object-contain rounded"
                          />
                        ) : qrisData?.qrString ? (
                          <div className="bg-white p-3 rounded">
                            <QRCodeCanvas
                              value={qrisData.qrString}
                              size={220}
                              includeMargin={false}
                            />
                          </div>
                        ) : (
                          <div className="text-center text-gray-300 text-sm">
                            QR tidak tersedia. Silakan coba lagi.
                          </div>
                        )}

                        {/* Badge status pembayaran */}
                        <div className="mt-3">
                          {paymentStatus === "pending" && (
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                              Menunggu pembayaran
                              {backendStatus ? ` (${backendStatus})` : ""}
                            </span>
                          )}
                          {paymentStatus === "success" && (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                              Pembayaran diterima
                              {backendStatus ? ` (${backendStatus})` : ""}
                            </span>
                          )}
                          {paymentStatus === "failed" && (
                            <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                              Pembayaran gagal/expired
                              {backendStatus ? ` (${backendStatus})` : ""}
                            </span>
                          )}
                        </div>

                        {qrisData?.referenceId && (
                          <p className="mt-3 text-xs text-gray-400">
                            Ref: {qrisData.referenceId}
                          </p>
                        )}
                      </div>

                      <p className="text-xs text-gray-400 text-center">
                        Jangan tutup atau refresh halaman selama proses
                        pembayaran berlangsung.
                      </p>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  {paymentStep === "confirm" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsDialogOpen(false)}
                        className="px-4 py-2 text-gray-300 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-70"
                        disabled={isProcessingPayment}
                      >
                        {isProcessingPayment
                          ? "Memproses..."
                          : "Konfirmasi Pembayaran"}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsDialogOpen(false)}
                        className="px-4 py-2 text-gray-300 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors"
                      >
                        Tutup
                      </button>
                      {qrisData?.redirectUrl && (
                        <a
                          href={qrisData.redirectUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Bayar via halaman Zenospay
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsDialogOpen(false)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Saya sudah bayar
                      </button>
                      {/* <button
                        type="button"
                        onClick={initiateQrisAgain}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                        disabled={isProcessingPayment}
                      >
                        {isProcessingPayment ? "Membuat QR..." : "Buat QR baru"}
                      </button> */}
                    </>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => window.open("https://wa.me/6281234567890", "_blank")}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          title="Chat WhatsApp"
        >
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
          </svg>
        </button>
      </div>

      <Footer />
    </div>
  );
}
