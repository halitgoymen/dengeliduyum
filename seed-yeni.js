const { createClient } = require('@libsql/client');
require('dotenv').config({ path: '.env.local' });
const crypto = require('crypto');

const client = createClient({ 
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN
});

const sorular = [
  // --- TAKİPLİ HASTA ---
  
  // A) İşitme azlığı / kaybı (Tüm yaşlar)
  { id: 't_is_1', k: 'İşitme azlığı/ kaybı', y: 'tum', t: 'takipli', s: 'Karşılıklı konuşmaları anlamada zorluk yaşıyor musunuz?', o: ['Hiç', 'Bazen', 'Her zaman'] },
  { id: 't_is_2', k: 'İşitme azlığı/ kaybı', y: 'tum', t: 'takipli', s: 'Gürültülü ortamlarda (kafe, sokak) sesleri ayırt edebiliyor musunuz?', o: ['Hiç', 'Bazen', 'Her zaman'] },
  { id: 't_is_3', k: 'İşitme azlığı/ kaybı', y: 'tum', t: 'takipli', s: 'TV/Radyo sesini başkalarını rahatsız edecek kadar açıyor musunuz?', o: ['Hiç', 'Bazen', 'Her zaman'] },
  { id: 't_is_4', k: 'İşitme azlığı/ kaybı', y: 'tum', t: 'takipli', s: 'İşitme sorunu nedeniyle sosyal ortamlardan kaçınıyor musunuz?', o: ['Hiç', 'Bazen', 'Her zaman'] },
  { id: 't_is_5', k: 'İşitme azlığı/ kaybı', y: 'tum', t: 'takipli', s: 'Gün sonunda dinleme çabasından dolayı yorgun hissediyor musunuz?', o: ['Hiç', 'Bazen', 'Her zaman'] },
  { id: 't_is_6', k: 'İşitme azlığı/ kaybı', y: 'tum', t: 'takipli', s: 'Mutfaktaki tabak çatal sesi, kapı çarpması veya trafikteki korna sesi sizi yerinizden sıçratacak kadar rahatsız ediyor mu?', o: ['Hiç', 'Bazen', 'Her zaman'] },
  { id: 't_is_7', k: 'İşitme azlığı/ kaybı', y: 'tum', t: 'takipli', s: 'Sesleri duyuyor ama kelimeleri sanki ağız içinde yuvarlanıyormuş (mırıldanma gibi) gibi algılıyor musunuz?', o: ['Hiç', 'Bazen', 'Her zaman'] },
  { id: 't_is_8', k: 'İşitme azlığı/ kaybı', y: 'tum', t: 'takipli', s: 'Telefonda iletişim kurmada zorluk yaşıyor musunuz?', o: ['Hiç', 'Bazen', 'Her zaman'] },
  { id: 't_is_9', k: 'İşitme azlığı/ kaybı', y: 'tum', t: 'takipli', s: 'Karşınızdaki kişinin dudaklarına bakmadan söylediklerini anlayabiliyor musunuz?', o: ['Hiç', 'Bazen', 'Her zaman'] },
  { id: 't_is_10', k: 'İşitme azlığı/ kaybı', y: 'tum', t: 'takipli', s: 'İşitme sorunu nedeniyle gitmekten kaçındığınız ortamlara tekrar gitmeye başladınız mı?', o: ['Evet', 'Hayır'] },
  { id: 't_is_11', k: 'İşitme azlığı/ kaybı', y: 'tum', t: 'takipli', s: 'Son dönemde kulaklarınızda bir kaşıntı, nemlenme veya tıkalıymış hissi oluştu mu?', o: ['Evet', 'Hayır'] },
  // Cerrahi Sonrası
  { id: 't_cer_1', k: 'Cerrahi Sonrası Kontrol', y: 'tum', t: 'takipli', s: 'Operasyon bölgesinde akıntı veya kanama var mı?', o: ['Evet', 'Hayır'] },
  { id: 't_cer_2', k: 'Cerrahi Sonrası Kontrol', y: 'tum', t: 'takipli', s: 'Yüzünüzde hareket kısıtlılığı veya uyuşma hissediyor musunuz?', o: ['Evet', 'Hayır'] },
  { id: 't_cer_3', k: 'Cerrahi Sonrası Kontrol', y: 'tum', t: 'takipli', s: 'Tat alma duyunuzda bir değişiklik fark ettiniz mi?', o: ['Evet', 'Hayır'] },
  { id: 't_cer_4', k: 'Cerrahi Sonrası Kontrol', y: 'tum', t: 'takipli', s: 'Ameliyatlı kulakta ağrı veya zonklama var mı?', o: ['Evet', 'Hayır'] },
  { id: 't_cer_5', k: 'Cerrahi Sonrası Kontrol', y: 'tum', t: 'takipli', s: 'Baş dönmesi (vertigo) şikayetiniz var mı?', o: ['Evet', 'Hayır'] },
  // Ani İşitme Kaybı Sonrası
  { id: 't_ani_1', k: 'Ani İşitme Kaybı Sonrası Kontrol', y: 'tum', t: 'takipli', s: 'İşitmenizde aniden gerçekleşen o ilk duruma göre bir düzelme var mı?', o: ['Evet', 'Hayır'] },
  { id: 't_ani_2', k: 'Ani İşitme Kaybı Sonrası Kontrol', y: 'tum', t: 'takipli', s: 'Steroid (ilaç) tedavisine bağlı yan etki (mide ağrısı, uykusuzluk vb.) var mı?', o: ['Evet', 'Hayır'] },
  { id: 't_ani_3', k: 'Ani İşitme Kaybı Sonrası Kontrol', y: 'tum', t: 'takipli', s: 'Kulaktaki dolgunluk ve basınç hissi ne durumda?', o: ['Azaldı', 'Aynı', 'Arttı'] },
  { id: 't_ani_4', k: 'Ani İşitme Kaybı Sonrası Kontrol', y: 'tum', t: 'takipli', s: 'Eşlik eden çınlamanın (tinnitus) rahatsızlık boyutu nedir?', o: ['Azaldı', 'Aynı', 'Arttı'] },
  { id: 't_ani_5', k: 'Ani İşitme Kaybı Sonrası Kontrol', y: 'tum', t: 'takipli', s: 'Baş dönmesi yaşıyor musunuz? Yaşıyorsanız ne durumda?', o: ['Azaldı', 'Aynı', 'Arttı', 'Baş dönmesi yaşamıyorum'] },

  // B) Çınlama (18-65)
  { id: 't_cin_18_1', k: 'Çınlama (Tinnitus) Terapisi', y: '18-65 yaş', t: 'takipli', s: 'Lütfen şu anki çınlama şiddetinizi seçiniz.', o: ['çok hafif', 'orta', 'çok fazla', 'dayanılmaz derecede'] },
  { id: 't_cin_18_2', k: 'Çınlama (Tinnitus) Terapisi', y: '18-65 yaş', t: 'takipli', s: 'Çınlama nedeniyle gece uykudan uyanma veya uykuya dalma sürenizde uzama yaşıyor musunuz?', o: ['Evet', 'Hayır'] },
  { id: 't_cin_18_3', k: 'Çınlama (Tinnitus) Terapisi', y: '18-65 yaş', t: 'takipli', s: 'Kulaklık kullanımı veya yüksek sesli müzik dinleme alışkanlığınız devam ediyor mu?', o: ['Evet', 'Hayır'] },
  { id: 't_cin_18_4', k: 'Çınlama (Tinnitus) Terapisi', y: '18-65 yaş', t: 'takipli', s: 'Son kontrolünüzden bu yana stres seviyenizde artış var mı?', o: ['Evet', 'Hayır'] },
  { id: 't_cin_18_5', k: 'Çınlama (Tinnitus) Terapisi', y: '18-65 yaş', t: 'takipli', s: 'Son kontrolünüzden bu yana kafein/sigara tüketiminizde artış var mı?', o: ['Evet', 'Hayır'] },
  { id: 't_cin_18_6', k: 'Çınlama (Tinnitus) Terapisi', y: '18-65 yaş', t: 'takipli', s: 'Size önerilen ses terapisi uygulamalarını düzenli kullanıyor musunuz?', o: ['Kullanıyorum ve fayda sağlıyor.', 'Kullanıyorum ama fayda sağlamıyor.', 'Kullanmıyorum'] },
  { id: 't_cin_18_7', k: 'Çınlama (Tinnitus) Terapisi', y: '18-65 yaş', t: 'takipli', s: 'Kulağınızdaki çınlama gergin/ öfkeli olmanıza sebep oluyor mu?', o: ['Evet', 'Hayır'] },
  { id: 't_cin_18_8', k: 'Çınlama (Tinnitus) Terapisi', y: '18-65 yaş', t: 'takipli', s: 'Çınlamanız odaklanmanızı veya stres seviyenizi etkiliyor mu?', o: ['Evet', 'Hayır'] },

  // B) Çınlama (65+)
  { id: 't_cin_65_1', k: 'Çınlama (Tinnitus) Terapisi', y: '65 yaş ve üzeri', t: 'takipli', s: 'Çınlama sesiniz, tansiyon veya ilaç değişiklikleriyle birlikte artış gösteriyor mu?', o: ['Evet', 'Hayır'] },
  { id: 't_cin_65_2', k: 'Çınlama (Tinnitus) Terapisi', y: '65 yaş ve üzeri', t: 'takipli', s: 'Çınlama nedeniyle gece uykudan uyanma veya uykuya dalma sürenizde uzama yaşıyor musunuz?', o: ['Evet', 'Hayır'] },
  { id: 't_cin_65_3', k: 'Çınlama (Tinnitus) Terapisi', y: '65 yaş ve üzeri', t: 'takipli', s: 'İşitme cihazınızı taktığınız süre boyunca çınlama sesinde azalma hissediyor musunuz?', o: ['Evet', 'Hayır'] },
  { id: 't_cin_65_4', k: 'Çınlama (Tinnitus) Terapisi', y: '65 yaş ve üzeri', t: 'takipli', s: 'Son randevunuzdan bu yana yeni bir tansiyon/kalp ilacına başladınız mı?', o: ['Evet', 'Hayır'] },
  { id: 't_cin_65_5', k: 'Çınlama (Tinnitus) Terapisi', y: '65 yaş ve üzeri', t: 'takipli', s: 'Kulağınızdaki ses kalp atışı ritminde mi atıyor, yoksa düz ve sürekli bir ses mi?', o: ['Kalp atışı ritminde', 'Düz ve sürekli ses'] },

  // C) Denge (18-65)
  { id: 't_den_18_1', k: 'Denge (Vestibüler) Rehabilitasyon', y: '18-65 yaş', t: 'takipli', s: 'Yatakta dönerken kısa ve şiddetli dönme hissi tekrar başladı mı?', o: ['Evet', 'Hayır'] },
  { id: 't_den_18_2', k: 'Denge (Vestibüler) Rehabilitasyon', y: '18-65 yaş', t: 'takipli', s: 'Market koridorlarında veya kalabalık halılara bakarken sersemlik hissi tetikleniyor mu?', o: ['Evet', 'Hayır'] },
  { id: 't_den_18_3', k: 'Denge (Vestibüler) Rehabilitasyon', y: '18-65 yaş', t: 'takipli', s: 'Saatlerce süren, kulakta tıkanıklık ve uğultu yaratan şiddetli bir atak geçirdiniz mi?', o: ['Evet', 'Hayır'] },
  { id: 't_den_18_4', k: 'Denge (Vestibüler) Rehabilitasyon', y: '18-65 yaş', t: 'takipli', s: 'Ataklarınız aşırı stresli olduğunuz veya uykusuz kaldığınız günlerde mi ortaya çıkıyor?', o: ['Evet', 'Hayır'] },
  { id: 't_den_18_5', k: 'Denge (Vestibüler) Rehabilitasyon', y: '18-65 yaş', t: 'takipli', s: 'Ataklar sırasında soğuk terleme, çarpıntı veya bayılacak gibi olma hissi yaşıyor musunuz?', o: ['Evet', 'Hayır'] },
  { id: 't_den_18_6', k: 'Denge (Vestibüler) Rehabilitasyon', y: '18-65 yaş', t: 'takipli', s: 'Hiç yere düştünüz mü veya düşmekten son anda kurtuldunuz mu?', o: ['Evet', 'Hayır'] },
  { id: 't_den_18_7', k: 'Denge (Vestibüler) Rehabilitasyon', y: '18-65 yaş', t: 'takipli', s: 'Gece karanlıkta yürürken dengenizi sağlamakta daha fazla mı zorlanıyorsunuz?', o: ['Evet', 'Hayır'] },
  { id: 't_den_18_8', k: 'Denge (Vestibüler) Rehabilitasyon', y: '18-65 yaş', t: 'takipli', s: 'Gözlerinizin kararması hissi, oturduğunuz yerden aniden ayağa kalktığınızda mı oluyor?', o: ['Evet', 'Hayır'] },
  { id: 't_den_18_9', k: 'Denge (Vestibüler) Rehabilitasyon', y: '18-65 yaş', t: 'takipli', s: 'Boynunuzu çevirdiğinizde veya yukarı baktığınızda dengesizlik hissediyor musunuz?', o: ['Evet', 'Hayır'] },
  { id: 't_den_18_10', k: 'Denge (Vestibüler) Rehabilitasyon', y: '18-65 yaş', t: 'takipli', s: 'Baş dönmesi şikayetlerinde şiddetli baş ağrısı, mide bulantısı veya kusma oluyor mu?', o: ['Evet', 'Hayır'] },
  { id: 't_den_18_11', k: 'Denge (Vestibüler) Rehabilitasyon', y: '18-65 yaş', t: 'takipli', s: 'Seyahat ederken veya hareketli video izlerken mide bulantısı yaşıyor musunuz?', o: ['Evet', 'Hayır'] },
  { id: 't_den_18_12', k: 'Denge (Vestibüler) Rehabilitasyon', y: '18-65 yaş', t: 'takipli', s: 'Yakın zamanda yüksek ateşli bir hastalık veya orta kulak iltihabı geçirdiniz mi?', o: ['Evet', 'Hayır'] },

  // C) Denge (65+)
  { id: 't_den_65_1', k: 'Denge (Vestibüler) Rehabilitasyon', y: '65 yaş ve üzeri', t: 'takipli', s: 'Hiç yere düştünüz mü veya düşmekten son anda kurtulduğunuz an yaşadınız mı?', o: ['Evet', 'Hayır'] },
  { id: 't_den_65_2', k: 'Denge (Vestibüler) Rehabilitasyon', y: '65 yaş ve üzeri', t: 'takipli', s: 'Karanlıkta ya da engebeli yerlerde yürürken dengenizi sağlamakta zorlandınız mı?', o: ['Evet', 'Hayır'] },
  { id: 't_den_65_3', k: 'Denge (Vestibüler) Rehabilitasyon', y: '65 yaş ve üzeri', t: 'takipli', s: 'Gözlerinizin kararması hissi aniden ayağa kalktığınızda mı gerçekleşiyor?', o: ['Evet', 'Hayır'] },
  { id: 't_den_65_4', k: 'Denge (Vestibüler) Rehabilitasyon', y: '65 yaş ve üzeri', t: 'takipli', s: 'Tansiyon, kalp veya uyku ilaçlarınızın dozunda değişiklik yapıldı mı?', o: ['Evet', 'Hayır'] },
  { id: 't_den_65_5', k: 'Denge (Vestibüler) Rehabilitasyon', y: '65 yaş ve üzeri', t: 'takipli', s: 'Yukarı doğru uzun süre baktığınızda sersemlik hissediyor musunuz?', o: ['Evet', 'Hayır'] },
  { id: 't_den_65_6', k: 'Denge (Vestibüler) Rehabilitasyon', y: '65 yaş ve üzeri', t: 'takipli', s: 'Yatakta sağa/sola dönerken kısa ve şiddetli dönme hissi tekrar başladı mı?', o: ['Evet', 'Hayır'] },

  // D) Çocuk Randevusu (Takipli)
  { id: 't_coc_1', k: 'Çocuk randevusu (ebeveyn girişi)', y: '0-18 yaş', t: 'takipli', s: 'Bugünkü kontrol randevunuzun temel amacı nedir?', o: ['A) Yeni bir kötüleşme/değişiklik fark ettim.', 'B) Tedavi/ameliyat sonrası kontrol.', 'C) Rutin işitme testi tekrarı.'] },
  { id: 't_coc_2', k: 'Çocuk randevusu (ebeveyn girişi)', y: '0-18 yaş', t: 'takipli', s: 'Çocuğunuz halihazırda bir işitme cihazı veya koklear implant kullanıyor mu?', o: ['A) Evet, aktif kullanıyor.', 'B) Evet var ama kullanamıyor.', 'C) Hayır, kullanmıyor.'] },
  { id: 't_coc_3', k: 'Çocuk randevusu (ebeveyn girişi)', y: '0-18 yaş', t: 'takipli', s: 'Çocuğunuz özel eğitim veya Dil ve Konuşma Terapisi desteği alıyor mu?', o: ['Evet, alıyor ve ilerleme var', 'Terapi alıyor ama ilerleme yok', 'Hayır, almıyor'] },
  
  // Çocuk (A seçilirse - Durum güncellemesi)
  { id: 't_coc_4', k: 'Çocuk randevusu (ebeveyn girişi)', y: '0-18 yaş', t: 'takipli', s: 'Son kontrolden bu yana kulak enfeksiyonu, ateşli hastalık veya sese tepkide azalma yaşandı mı?', o: ['Evet, yaşandı', 'Hayır, sadece yavaş yavaş kötüleşti'], bagliSoruId: 't_coc_1', bagliCevap: 'A) Yeni bir kötüleşme/değişiklik fark ettim.', uyariMesaji: JSON.stringify({'Evet, yaşandı': 'Odyoloğa uyarı: Yeni tıbbi öykü mevcut. Karşılaştırma yapılmalı.'}) },
  { id: 't_coc_5', k: 'Çocuk randevusu (ebeveyn girişi)', y: '0-18 yaş', t: 'takipli', s: 'İşitmesindeki kötüleşme yavaş yavaş mı, aniden mi (1-3 gün) ortaya çıktı?', o: ['Yavaş yavaş gelişti.', 'Aniden işitmesi düştü/kapandı.'], bagliSoruId: 't_coc_1', bagliCevap: 'A) Yeni bir kötüleşme/değişiklik fark ettim.', uyariMesaji: JSON.stringify({'Aniden işitmesi düştü/kapandı.': 'KIRMIZI UYARI: Pediatrik Ani İşitme Kaybı Şüphesi!'}) },
  { id: 't_coc_6', k: 'Çocuk randevusu (ebeveyn girişi)', y: '0-18 yaş', t: 'takipli', s: 'Son zamanlarda aniden durup "başım dönüyor" dediği veya dengesizleştiği oluyor mu?', o: ['Hayır, dengesi normal', 'Evet, dengesi bozuldu'], bagliSoruId: 't_coc_1', bagliCevap: 'A) Yeni bir kötüleşme/değişiklik fark ettim.', uyariMesaji: JSON.stringify({'Evet, dengesi bozuldu': 'Odyoloğa uyarı: Yeni vestibüler semptom gelişimi. Pediatrik denge protokolü.'}) },
  { id: 't_coc_7', k: 'Çocuk randevusu (ebeveyn girişi)', y: '0-18 yaş', t: 'takipli', s: 'Çınlama şikayetinde son günlerde artış veya uyku bozukluğu oldu mu?', o: ['Çınlama şikayeti yok/rahat.', 'Evet, sesler arttı ve uykusu bozuldu.'], bagliSoruId: 't_coc_1', bagliCevap: 'A) Yeni bir kötüleşme/değişiklik fark ettim.' },

  // Çocuk (B seçilirse - Cerrahi Sonrası)
  { id: 't_coc_8', k: 'Çocuk randevusu (ebeveyn girişi)', y: '0-18 yaş', t: 'takipli', s: 'Tedavi sonrası kulağında yeni başlayan akıntı, koku veya kanama fark ettiniz mi?', o: ['Hayır, temiz ve kuru.', 'Evet, sıvı veya iltihap geliyor.'], bagliSoruId: 't_coc_1', bagliCevap: 'B) Tedavi/ameliyat sonrası kontrol.', uyariMesaji: JSON.stringify({'Evet, sıvı veya iltihap geliyor.': 'Odyoloğa uyarı: Aktif enfeksiyon şüphesi. Otoskopik muayene yapılmalı.'}) },
  { id: 't_coc_9', k: 'Çocuk randevusu (ebeveyn girişi)', y: '0-18 yaş', t: 'takipli', s: 'Çocuğunuz kulağının tıkalı/ağrılı olduğunu söylüyor mu veya kulağıyla oynuyor mu?', o: ['Hayır, tamamen geçti.', 'Ara sıra hafif ağrısı oluyor.', 'Evet, sürekli dokunuyor ve huzursuz.'], bagliSoruId: 't_coc_1', bagliCevap: 'B) Tedavi/ameliyat sonrası kontrol.', uyariMesaji: JSON.stringify({'Evet, sürekli dokunuyor ve huzursuz.': 'Odyoloğa uyarı: Tüp tıkanması veya efüzyon nüksü şüphesi. Timpanometri öncelikli.'}) },

  // Çocuk (C seçilirse - Rutin Test)
  { id: 't_coc_10', k: 'Çocuk randevusu (ebeveyn girişi)', y: '0-18 yaş', t: 'takipli', s: 'Seslere verdiği tepkilerde bir azalma hissettiniz mi?', o: ['Hayır, eskisi gibi aynı.', 'Evet, daha zor duyuyor.'], bagliSoruId: 't_coc_1', bagliCevap: 'C) Rutin işitme testi tekrarı.', uyariMesaji: JSON.stringify({'Evet, daha zor duyuyor.': 'Odyoloğa uyarı: İlerleyici kayıp şüphesi. Eşik karşılaştırması yapılmalı.'}) },
  { id: 't_coc_11', k: 'Çocuk randevusu (ebeveyn girişi)', y: '0-18 yaş', t: 'takipli', s: 'Televizyon/tablet sesini eskiye kıyasla çok fazla açma ihtiyacı duyuyor mu?', o: ['Hayır', 'Evet, daha yüksek sesle dinliyor.'], bagliSoruId: 't_coc_1', bagliCevap: 'C) Rutin işitme testi tekrarı.' },


  // --- YENİ HASTA ---
  
  // Yeni Hasta - Çocuk (0-18)
  { id: 'y_coc_1', k: 'Çocuk randevusu (ebeveyn girişi)', y: '0-18 yaş', t: 'yeni', s: 'Şikayetleri dışında, bilinen bir ek sağlık durumu/sendromu var mı?', o: ['Hayır, yok.', 'Evet, var (Otizm, DEHB, Serebral Palsi vb.)'] },
  { id: 'y_coc_2', k: 'Çocuk randevusu (ebeveyn girişi)', y: '0-18 yaş', t: 'yeni', s: 'Kliniğimize başvurunuzdaki temel endişeniz nedir?', o: ['A) Sadece sesleri duyması/konuşması.', 'B) Sadece yürümesi/dengesi.', 'C) Sadece kulağındaki sesler (çınlama).', 'D) İşitme + Çınlama.', 'E) İşitme + Denge.', 'F) Denge + Çınlama.', 'G) İşitme + Denge + Çınlama hepsini yaşıyor.'] },
  
  // Çocuk İşitme Havuzu (A, D, E, G)
  { id: 'y_coc_3', k: 'Çocuk randevusu (ebeveyn girişi)', y: '0-18 yaş', t: 'yeni', s: 'Hastanede yapılan yenidoğan işitme testinden (tarama) geçmiş miydi?', o: ['Geçti', 'Kaldı-Tekrar çağrıldı', 'Yapılmadı', 'Hatırlamıyorum'], bagliSoruId: 'y_coc_2', bagliCevap: 'A) Sadece sesleri duyması/konuşması.,D) İşitme + Çınlama.,E) İşitme + Denge.,G) İşitme + Denge + Çınlama hepsini yaşıyor.' },
  { id: 'y_coc_4', k: 'Çocuk randevusu (ebeveyn girişi)', y: '0-18 yaş', t: 'yeni', s: 'Beklenmedik, yüksek bir ses duyduğunda nasıl tepki verir?', o: ['Sıçrar veya irkilir', 'Bazen tepki verir', 'Hiç umursamaz'], bagliSoruId: 'y_coc_2', bagliCevap: 'A) Sadece sesleri duyması/konuşması.,D) İşitme + Çınlama.,E) İşitme + Denge.,G) İşitme + Denge + Çınlama hepsini yaşıyor.' },
  { id: 'y_coc_5', k: 'Çocuk randevusu (ebeveyn girişi)', y: '0-18 yaş', t: 'yeni', s: 'Ona ismiyle seslendiğinizde, sesin geldiği yönü bulup o tarafa döner mi?', o: ['Evet, döner', 'Bazen şaşırır, arar', 'Hayır, genelde tepki vermez'], bagliSoruId: 'y_coc_2', bagliCevap: 'A) Sadece sesleri duyması/konuşması.,D) İşitme + Çınlama.,E) İşitme + Denge.,G) İşitme + Denge + Çınlama hepsini yaşıyor.' },
  { id: 'y_coc_6', k: 'Çocuk randevusu (ebeveyn girişi)', y: '0-18 yaş', t: 'yeni', s: 'Yaşıtlarına kıyasla kelime dağarcığı ve konuşma gelişimi ne durumda?', o: ['Yaşıtları gibi akıcı', 'Söylenenleri anlıyor ama az konuşuyor', 'Yaşıtlarının gerisinde'], bagliSoruId: 'y_coc_2', bagliCevap: 'A) Sadece sesleri duyması/konuşması.,D) İşitme + Çınlama.,E) İşitme + Denge.,G) İşitme + Denge + Çınlama hepsini yaşıyor.' },
  
  // Çocuk Denge Havuzu (B, E, F, G)
  { id: 'y_coc_7', k: 'Çocuk randevusu (ebeveyn girişi)', y: '0-18 yaş', t: 'yeni', s: 'İlk adımlarını atma gibi hareketleri öğrenmesi nasıl ilerledi?', o: ['Zamanında normal', 'Beklenenden geç', 'Belirgin gecikme'], bagliSoruId: 'y_coc_2', bagliCevap: 'B) Sadece yürümesi/dengesi.,E) İşitme + Denge.,F) Denge + Çınlama.,G) İşitme + Denge + Çınlama hepsini yaşıyor.' },
  { id: 'y_coc_8', k: 'Çocuk randevusu (ebeveyn girişi)', y: '0-18 yaş', t: 'yeni', s: 'Düz zeminde yürürken yaşıtlarına göre daha sık takılır veya düşer mi?', o: ['Evet, sık düşüyor', 'Hayır, dengesi iyi'], bagliSoruId: 'y_coc_2', bagliCevap: 'B) Sadece yürümesi/dengesi.,E) İşitme + Denge.,F) Denge + Çınlama.,G) İşitme + Denge + Çınlama hepsini yaşıyor.' },

  // Çocuk Çınlama Havuzu (C, D, F, G)
  { id: 'y_coc_9', k: 'Çocuk randevusu (ebeveyn girişi)', y: '0-18 yaş', t: 'yeni', s: 'Kulağında/kafasında ses duyduğunu hiç söyledi mi?', o: ['Hayır', 'Evet, bazen söylüyor', 'Evet, çok rahatsız oluyor'], bagliSoruId: 'y_coc_2', bagliCevap: 'C) Sadece kulağındaki sesler (çınlama).,D) İşitme + Çınlama.,F) Denge + Çınlama.,G) İşitme + Denge + Çınlama hepsini yaşıyor.', uyariMesaji: JSON.stringify({'Evet, bazen söylüyor': 'Odyoloğa uyarı: Pediatrik Tinnitus Şüphesi.', 'Evet, çok rahatsız oluyor': 'Odyoloğa uyarı: Pediatrik Tinnitus Şüphesi.'}) },
  
  // Yeni Hasta Yetişkin (18-65 ve 65+)
  { id: 'y_yet_1', k: 'Yeni Hasta Şikayetleri', y: 'tum', t: 'yeni', s: 'Aşağıda verilen durumlardan uygun olan problemi seçiniz.', o: ['A) İşitmede azalma/ duyamama', 'B) Baş dönmesi / denge kaybı', 'C) Kulak çınlaması/ uğultu', 'D) Kulakta ağrı/ akıntı/ kanama'] },
  
  // Yetişkin İşitme
  { id: 'y_yet_2', k: 'Yeni Hasta Şikayetleri', y: 'tum', t: 'yeni', s: 'İşitmenizdeki bu azalma ne zaman oldu?', o: ['Aniden', 'Son birkaç ayda', 'Yıllar içinde kademeli'], bagliSoruId: 'y_yet_1', bagliCevap: 'A) İşitmede azalma/ duyamama', uyariMesaji: JSON.stringify({'Aniden': 'Ani işitme kaybı şüpheli vaka. Acil müdahale gerektirebilir.'}) },
  { id: 'y_yet_3', k: 'Yeni Hasta Şikayetleri', y: 'tum', t: 'yeni', s: 'Şikayetiniz tek kulağınızda mı yoksa her iki kulağınızda birden mi var?', o: ['Tek kulak', 'İki kulakta da var'], bagliSoruId: 'y_yet_1', bagliCevap: 'A) İşitmede azalma/ duyamama' },
  { id: 'y_yet_4', k: 'Yeni Hasta Şikayetleri', y: 'tum', t: 'yeni', s: 'Kulakta tıkanıklık veya yeni başlayan bir çınlama eşlik ediyor mu?', o: ['Evet', 'Hayır'], bagliSoruId: 'y_yet_1', bagliCevap: 'A) İşitmede azalma/ duyamama' },

  // Yetişkin Denge
  { id: 'y_yet_5', k: 'Yeni Hasta Şikayetleri', y: 'tum', t: 'yeni', s: 'Baş dönmenizi aşağıdaki şıklardan hangisi tarifliyor?', o: ['Etraf fıldır fıldır dönüyor', 'Sersem gibiyim/gözüm kararıyor'], bagliSoruId: 'y_yet_1', bagliCevap: 'B) Baş dönmesi / denge kaybı' },
  { id: 'y_yet_6', k: 'Yeni Hasta Şikayetleri', y: 'tum', t: 'yeni', s: 'Baş dönmesi şikayetinize çift görme, peltekleşme, yüzde uyuşma eşlik ediyor mu?', o: ['Evet', 'Hayır'], bagliSoruId: 'y_yet_1', bagliCevap: 'B) Baş dönmesi / denge kaybı', uyariMesaji: JSON.stringify({'Evet': 'SİSTEM UYARISI: En kısa sürede nöroloji veya acil servise gidiniz.'}) },
  
  // Yetişkin Çınlama
  { id: 'y_yet_7', k: 'Yeni Hasta Şikayetleri', y: 'tum', t: 'yeni', s: 'Sesi nasıl duyuyorsunuz?', o: ['Tek kulakta', 'İki kulakta', 'Kafamın içinde'], bagliSoruId: 'y_yet_1', bagliCevap: 'C) Kulak çınlaması/ uğultu' },

  // Ortak (Ağrı vb.)
  { id: 'y_yet_8', k: 'Yeni Hasta Şikayetleri', y: 'tum', t: 'yeni', s: 'Daha önce kulak zarı delinmesi, tüp takılması ameliyatı geçirdiniz mi?', o: ['Evet', 'Hayır'] }

];

async function seed() {
  await client.execute('DELETE FROM anamnez_sorulari');
  let i = 1;
  for (const q of sorular) {
    await client.execute({
      sql: 'INSERT INTO anamnez_sorulari (id, kategori, yas_grubu, hasta_tipi, soru, secenekler, bagli_soru_id, bagli_cevap, uyari_mesaji, sira, aktif, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)',
      args: [
        q.id, q.k, q.y, q.t, q.s, JSON.stringify(q.o), 
        q.bagliSoruId || null, 
        q.bagliCevap || null, 
        q.uyariMesaji || null, 
        i++, new Date().toISOString(), new Date().toISOString()
      ]
    });
  }
  console.log('Tüm YENİ sorular ve şartlı mantıklar eklendi!');
}

seed().then(() => client.close()).catch(e => { console.error(e); client.close(); });
