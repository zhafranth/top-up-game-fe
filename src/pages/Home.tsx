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
  DialogTrigger,
} from "../components/ui/dialog";
import { useProducts } from "../hooks/useProducts";
import { Product } from "../types/product";
import { ProductCardSkeleton } from "../components/ProductCardSkeleton";



export function Home() {
  const navigate = useNavigate();
  const [royalId, setRoyalId] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [selectedTopUp, setSelectedTopUp] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [whatsappError, setWhatsappError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Fetch products from API
  const { data: productsResponse, isLoading, error } = useProducts({ limit: 20 });

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

  const handleSubmit = () => {
    if (!royalId || !whatsappNumber || !selectedTopUp) {
      return;
    }

    // Validate WhatsApp number before submitting
    if (!validateWhatsappNumber(whatsappNumber)) {
      return;
    }

    const selectedOption = productsResponse?.products?.find(
      (product: Product) => product.id === selectedTopUp
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

        {/* Login Button - Top Right */}
        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={() => navigate("/auth")}
            className="text-gray-300 hover:text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/30"
          >
            👤 Login
          </button>
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
              <p className="text-red-400">Gagal memuat produk. Silakan coba lagi.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {productsResponse?.products?.map((product: Product) => {
                const originalPrice = product.discount > 0 ? product.price / (1 - product.discount / 100) : null;
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
                      } ${product.is_populer ? "ring-2 ring-yellow-400/50" : ""}`}
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
                        {productsResponse?.products?.find(
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
                       const selectedProduct = productsResponse?.products?.find(
                         (product: Product) => product.id === selectedTopUp
                       );
                       const originalPrice = selectedProduct && selectedProduct.discount > 0 ? selectedProduct.price / (1 - selectedProduct.discount / 100) : null;
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
