import { Footer } from "../components/Footer";
import { useState } from "react";
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
  DialogTrigger,
} from "../components/ui/dialog";

interface TopUpOption {
  id: number;
  price: number;
  originalPrice: number;
  diamonds: number;
  discount?: number;
  isPopular?: boolean;
}

const topUpOptions: TopUpOption[] = [
  { id: 1, price: 10000, originalPrice: 10000, diamonds: 20 },
  { id: 2, price: 22500, originalPrice: 25000, diamonds: 50, discount: 10 },
  {
    id: 3,
    price: 42500,
    originalPrice: 50000,
    diamonds: 100,
    discount: 15,
    isPopular: true,
  },
  { id: 4, price: 85000, originalPrice: 100000, diamonds: 200, discount: 15 },
  { id: 5, price: 127500, originalPrice: 150000, diamonds: 300, discount: 15 },
  { id: 6, price: 200000, originalPrice: 250000, diamonds: 500, discount: 20 },
  {
    id: 7,
    price: 400000,
    originalPrice: 500000,
    diamonds: 1000,
    discount: 20,
    isPopular: true,
  },
  { id: 8, price: 600000, originalPrice: 750000, diamonds: 1500, discount: 20 },
  {
    id: 9,
    price: 750000,
    originalPrice: 1000000,
    diamonds: 2000,
    discount: 25,
  },
  {
    id: 10,
    price: 1200000,
    originalPrice: 1500000,
    diamonds: 3000,
    discount: 20,
  },
];

export function Home() {
  const [royalId, setRoyalId] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [selectedTopUp, setSelectedTopUp] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [whatsappError, setWhatsappError] = useState("");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const validateWhatsappNumber = (number: string): boolean => {
    // Remove all non-digit characters
    const cleanNumber = number.replace(/\D/g, '');
    
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
    const validPrefixes = ['08', '628', '+628'];
    const hasValidPrefix = validPrefixes.some(prefix => {
      if (prefix === '08') {
        return cleanNumber.startsWith('08');
      } else if (prefix === '628') {
        return cleanNumber.startsWith('628');
      }
      return false;
    }) || number.startsWith('+628');
    
    if (!hasValidPrefix) {
      setWhatsappError("Nomor WhatsApp harus dimulai dengan 08, +628, atau 628");
      return false;
    }
    
    setWhatsappError("");
    return true;
  };

  const handleWhatsappChange = (value: string) => {
    // Only allow numbers, +, and spaces for formatting
    const sanitized = value.replace(/[^0-9+\s]/g, '');
    setWhatsappNumber(sanitized);
    
    // Validate on change
    if (sanitized.trim()) {
      validateWhatsappNumber(sanitized);
    } else {
      setWhatsappError("");
    }
  };

  const handleTopUpSelect = (optionId: number) => {
    setSelectedTopUp(optionId);
  };

  const handleSubmit = () => {
    if (!royalId || !whatsappNumber || !selectedTopUp) {
      return;
    }

    // Validate WhatsApp number before submitting
    if (!validateWhatsappNumber(whatsappNumber)) {
      return;
    }

    const selectedOption = topUpOptions.find(
      (option) => option.id === selectedTopUp
    );
    console.log("Top up data:", {
      royalId,
      whatsappNumber,
      selectedOption,
    });

    // Trigger confetti animation
    setShowConfetti(true);

    // Hide confetti after 3 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    setIsDialogOpen(false);
  };

  const handleConfirmPayment = () => {
    setIsDialogOpen(true);
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
      {/* Carousel Section */}
      {/* <div className="container mx-auto px-4 py-6">
        <Carousel items={carouselItems} autoPlay={true} autoPlayInterval={4000} />
      </div> */}

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 wave-gradient opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-pink-600/10"></div>
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
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
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
              <h2 className="text-3xl font-bold text-white">
                Data Akun
              </h2>
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
                    ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20' 
                    : 'border-purple-500/30 focus:border-purple-400 focus:ring-purple-400/20'
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {topUpOptions.map((option) => (
              <div key={option.id} className="relative">
                {" "}
                {option.isPopular && (
                  <div className="absolute -top-0 -right-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold px-2 py-1 rounded-full z-30 shadow-lg">
                    POPULER
                  </div>
                )}
                <div
                  onClick={() => handleTopUpSelect(option.id)}
                  className={`relative overflow-hidden cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                    selectedTopUp === option.id
                      ? "border-purple-400 bg-purple-500/20 shadow-lg shadow-purple-500/25"
                      : "border-gray-600/50 bg-black/20 hover:border-purple-500/50"
                  } ${option.isPopular ? "ring-2 ring-yellow-400/50" : ""}`}
                  style={{ marginTop: option.isPopular ? "8px" : "0" }}
                >
                  {/* Flayer Diskon Segitiga di Pojok Kiri Atas */}
                  {option.discount && (
                    <div className="absolute top-0 left-0 w-0 h-0 border-l-[65px] border-l-red-500 border-b-[65px] border-b-transparent z-20">
                      <span className="absolute top-[20px] -left-[60px] text-white text-[14px] font-bold transform rotate-[-45deg] w-[30px] text-center leading-tight">
                        -{option.discount}%
                      </span>
                    </div>
                  )}

                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {option.diamonds} 💎
                    </div>
                    {option.discount ? (
                      <div>
                        <div className="text-sm text-gray-400 line-through mb-1">
                          {formatPrice(option.originalPrice)}
                        </div>
                        <div className="text-lg font-semibold text-purple-300">
                          {formatPrice(option.price)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-lg font-semibold text-purple-300">
                        {formatPrice(option.price)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Button Lanjutkan Pembayaran - Hanya muncul jika data lengkap */}
        {royalId && whatsappNumber && selectedTopUp && (
          <div className="flex justify-center mt-8">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button
                  onClick={handleConfirmPayment}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  Lanjutkan Pembayaran
                  <span className="arrow-bounce text-xl">→</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>Konfirmasi Pembayaran</DialogTitle>
                  <DialogDescription>
                    Pastikan data yang Anda masukkan sudah benar sebelum
                    melanjutkan pembayaran.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
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
                          topUpOptions.find(
                            (option) => option.id === selectedTopUp
                          )?.diamonds
                        }{" "}
                        💎
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Harga:</span>
                      <span className="font-bold text-green-600">
                        {formatPrice(
                          topUpOptions.find(
                            (option) => option.id === selectedTopUp
                          )?.price || 0
                        )}
                      </span>
                    </div>
                    {topUpOptions.find((option) => option.id === selectedTopUp)
                      ?.discount && (
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Harga Normal:</span>
                        <span className="line-through">
                          {formatPrice(
                            topUpOptions.find(
                              (option) => option.id === selectedTopUp
                            )?.originalPrice || 0
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
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
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                  >
                    Konfirmasi Pembayaran
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
