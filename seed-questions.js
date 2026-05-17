const { createClient } = require('@libsql/client');
require('dotenv').config({ path: '.env.local' });
const client = createClient({ 
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN
});
const crypto = require('crypto');

const questions = [
  // İŞİTME AZLIĞI
  { k: 'İşitme azlığı/ kaybı', y: 'tum', s: 'Karşılıklı konuşmaları anlamada zorluk yaşıyor musunuz?', o: ['Hiç', 'Bazen', 'Her zaman'] },
  { k: 'İşitme azlığı/ kaybı', y: 'tum', s: 'Gürültülü ortamlarda (kafe, sokak) sesleri ayırt edebiliyor musunuz?', o: ['Hiç', 'Bazen', 'Her zaman'] },
  { k: 'İşitme azlığı/ kaybı', y: 'tum', s: 'TV/Radyo sesini başkalarını rahatsız edecek kadar açıyor musunuz?', o: ['Hiç', 'Bazen', 'Her zaman'] },
  { k: 'İşitme azlığı/ kaybı', y: 'tum', s: 'İşitme sorunu nedeniyle sosyal ortamlardan kaçınıyor musunuz?', o: ['Hiç', 'Bazen', 'Her zaman'] },
  { k: 'İşitme azlığı/ kaybı', y: 'tum', s: 'Gün sonunda dinleme çabasından dolayı yorgun hissediyor musunuz?', o: ['Hiç', 'Bazen', 'Her zaman'] },
  { k: 'İşitme azlığı/ kaybı', y: 'tum', s: 'Mutfaktaki tabak çatal sesi, kapı çarpması veya trafikteki korna sesi sizi yerinizden sıçratacak kadar rahatsız ediyor mu?', o: ['Hiç', 'Bazen', 'Her zaman'] },
  { k: 'İşitme azlığı/ kaybı', y: 'tum', s: 'Sesleri duyuyor ama kelimeleri sanki ağız içinde yuvarlanıyormuş (mırıldanma gibi) gibi algılıyor musunuz?', o: ['Hiç', 'Bazen', 'Her zaman'] },
  { k: 'İşitme azlığı/ kaybı', y: 'tum', s: 'Telefonda iletişim kurmada zorluk yaşıyor musunuz?', o: ['Hiç', 'Bazen', 'Her zaman'] },
  { k: 'İşitme azlığı/ kaybı', y: 'tum', s: 'Karşınızdaki kişinin dudaklarına bakmadan söylediklerini anlayabiliyor musunuz?', o: ['Hiç', 'Bazen', 'Her zaman'] },
  { k: 'İşitme azlığı/ kaybı', y: 'tum', s: 'İşitme sorunu nedeniyle gitmekten kaçındığınız ortamlara tekrar gitmeye başladınız mı?', o: ['Evet', 'Hayır'] },
  { k: 'İşitme azlığı/ kaybı', y: 'tum', s: 'Son dönemde kulaklarınızda bir kaşıntı, nemlenme veya tıkalıymış hissi oluştu mu?', o: ['Evet', 'Hayır'] },

  // ÇINLAMA (18-65)
  { k: 'Çınlama (Tinnitus) Terapisi', y: '18-65 yaş', s: 'Lütfen şu anki çınlama şiddetinizi seçiniz.', o: ['çok hafif', 'orta', 'çok fazla', 'dayanılmaz derecede'] },
  { k: 'Çınlama (Tinnitus) Terapisi', y: '18-65 yaş', s: 'Çınlama nedeniyle gece uykudan uyanma veya uykuya dalma sürenizde uzama yaşıyor musunuz?', o: ['Evet', 'Hayır'] },
  { k: 'Çınlama (Tinnitus) Terapisi', y: '18-65 yaş', s: 'Kulaklık kullanımı veya yüksek sesli müzik dinleme alışkanlığınız (maruziyet) devam ediyor mu?', o: ['Evet', 'Hayır'] },
  { k: 'Çınlama (Tinnitus) Terapisi', y: '18-65 yaş', s: 'Son kontrolünüzden bu yana stres seviyenizde artış var mı?', o: ['Evet', 'Hayır'] },
  { k: 'Çınlama (Tinnitus) Terapisi', y: '18-65 yaş', s: 'Son kontrolünüzden bu yana kafein/sigara tüketiminizde artış var mı?', o: ['Evet', 'Hayır'] },
  { k: 'Çınlama (Tinnitus) Terapisi', y: '18-65 yaş', s: 'Size önerilen ses terapisi uygulamalarını günlük hayatınızda düzenli kullanıyor musunuz?', o: ['Kullanıyorum ve fayda sağlıyor.', 'Kullanıyorum ama fayda sağlamıyor.', 'Kullanmıyorum'] },
  { k: 'Çınlama (Tinnitus) Terapisi', y: '18-65 yaş', s: 'Kulağınızdaki çınlama gergin/ öfkeli olmanıza sebep oluyor mu?', o: ['Evet', 'Hayır'] },
  { k: 'Çınlama (Tinnitus) Terapisi', y: '18-65 yaş', s: 'Çınlamanız iş yerinde/ okulda/ arkadaş ortamında odaklanmanızı etkiliyor mu?', o: ['Evet', 'Hayır'] },

  // ÇINLAMA (65+)
  { k: 'Çınlama (Tinnitus) Terapisi', y: '65 yaş ve üzeri', s: 'Çınlama sesiniz, tansiyon değişikliklerinizle veya düzenli kullandığınız diğer ilaçlarla birlikte artış gösteriyor mu?', o: ['Evet', 'Hayır'] },
  { k: 'Çınlama (Tinnitus) Terapisi', y: '65 yaş ve üzeri', s: 'Çınlama nedeniyle gece uykudan uyanma veya uykuya dalma sürenizde uzama yaşıyor musunuz?', o: ['Evet', 'Hayır'] },
  { k: 'Çınlama (Tinnitus) Terapisi', y: '65 yaş ve üzeri', s: 'İşitme cihazınızı taktığınız süre boyunca çınlama sesinde azalma hissediyor musunuz?', o: ['Evet', 'Hayır'] },
  { k: 'Çınlama (Tinnitus) Terapisi', y: '65 yaş ve üzeri', s: 'Son randevunuzdan bu yana yeni bir tansiyon/kalp/diyabet ilacı kullanmaya başladınız mı?', o: ['Evet', 'Hayır'] },
  { k: 'Çınlama (Tinnitus) Terapisi', y: '65 yaş ve üzeri', s: 'Kulağınızdaki ses kalp atışı ritminde (nabızla uyumlu) mi atıyor, yoksa düz ve sürekli bir ses mi?', o: ['Kalp atışı ritminde', 'Düz ve sürekli ses'] },

  // DENGE (18-65)
  { k: 'Denge (Vestibüler) Rehabilitasyon', y: '18-65 yaş', s: 'Yatakta sağa/sola dönerken veya yukarı raftan bir şey alırken kısa ve şiddetli dönme hissi tekrar başladı mı?', o: ['Evet', 'Hayır'] },
  { k: 'Denge (Vestibüler) Rehabilitasyon', y: '18-65 yaş', s: 'Market koridorlarında yürürken, kalabalık halılara bakarken dengesizlik/sersemlik hissiniz tetikleniyor mu?', o: ['Evet', 'Hayır'] },
  { k: 'Denge (Vestibüler) Rehabilitasyon', y: '18-65 yaş', s: 'Son randevunuzdan bu yana kulakta tıkanıklık, uğultu ve işitme azalması yaratan şiddetli bir atak geçirdiniz mi?', o: ['Evet', 'Hayır'] },
  { k: 'Denge (Vestibüler) Rehabilitasyon', y: '18-65 yaş', s: 'Baş dönmesi ataklarınız aşırı stresli olduğunuz veya uykusuz kaldığınız günlerde mi ortaya çıkıyor?', o: ['Evet', 'Hayır'] },
  { k: 'Denge (Vestibüler) Rehabilitasyon', y: '18-65 yaş', s: 'Ataklar sırasında soğuk terleme, şiddetli çarpıntı veya bayılacak gibi olma hissi yaşıyor musunuz?', o: ['Evet', 'Hayır'] },
  { k: 'Denge (Vestibüler) Rehabilitasyon', y: '18-65 yaş', s: 'Son gelişinizden bu yana ev içinde veya dışarıda hiç yere düştünüz mü veya düşmekten son anda kurtuldunuz mu?', o: ['Evet', 'Hayır'] },
  { k: 'Denge (Vestibüler) Rehabilitasyon', y: '18-65 yaş', s: 'Gece tuvalete kalktığınızda dengenizi sağlamakta karanlıkta daha fazla mı zorlanıyorsunuz?', o: ['Evet', 'Hayır'] },
  { k: 'Denge (Vestibüler) Rehabilitasyon', y: '18-65 yaş', s: 'Gözlerinizin kararması ve baş dönmesi hissi, oturduğunuz yerden aniden kalktığınızda mı gerçekleşiyor?', o: ['Evet', 'Hayır'] },
  { k: 'Denge (Vestibüler) Rehabilitasyon', y: '18-65 yaş', s: 'Arabayı park etmek için boynunuzu çevirdiğinizde veya yukarı baktığınızda sersemlik hissediyor musunuz?', o: ['Evet', 'Hayır'] },
  { k: 'Denge (Vestibüler) Rehabilitasyon', y: '18-65 yaş', s: 'Baş dönmesi şikayetlerinizde şiddetli baş ağrısı, mide bulantısı veya yatma isteği oluyor mu?', o: ['Evet', 'Hayır'] },
  { k: 'Denge (Vestibüler) Rehabilitasyon', y: '18-65 yaş', s: 'Arabada seyahat ederken veya ekranda hareketli bir video izlerken mide bulantısı yaşıyor musunuz?', o: ['Evet', 'Hayır'] },
  { k: 'Denge (Vestibüler) Rehabilitasyon', y: '18-65 yaş', s: 'Yakın zamanda yüksek ateşli bir hastalık, orta kulak iltihabı gibi enfeksiyon geçirdiniz mi?', o: ['Evet', 'Hayır'] },

  // DENGE (65+)
  { k: 'Denge (Vestibüler) Rehabilitasyon', y: '65 yaş ve üzeri', s: 'Son gelişinizden bu yana ev içinde veya dışarıda hiç yere düştünüz mü?', o: ['Evet', 'Hayır'] },
  { k: 'Denge (Vestibüler) Rehabilitasyon', y: '65 yaş ve üzeri', s: 'Karanlıkta ya da engebeli yerlerde yürürken dengenizi sağlamakta zorluk yaşadınız mı?', o: ['Evet', 'Hayır'] },
  { k: 'Denge (Vestibüler) Rehabilitasyon', y: '65 yaş ve üzeri', s: 'Gözlerinizin kararması hissi, oturduğunuz yerden aniden ayağa kalktığınız ilk birkaç saniye içinde mi gerçekleşiyor?', o: ['Evet', 'Hayır'] },
  { k: 'Denge (Vestibüler) Rehabilitasyon', y: '65 yaş ve üzeri', s: 'Son kontrolünüzden bu yana tansiyon, kalp, prostat veya uyku ilaçlarınızın dozunda bir değişiklik yapıldı mı?', o: ['Evet', 'Hayır'] },
  { k: 'Denge (Vestibüler) Rehabilitasyon', y: '65 yaş ve üzeri', s: 'Yukarı doğru uzun süre baktığınızda sersemlik/dengesizlik hissediyor musunuz?', o: ['Evet', 'Hayır'] },
  { k: 'Denge (Vestibüler) Rehabilitasyon', y: '65 yaş ve üzeri', s: 'Yatakta sağa/sola dönerken kısa ve şiddetli dönme hissi tekrar başladı mı?', o: ['Evet', 'Hayır'] }
];

async function seed() {
  await client.execute('DELETE FROM anamnez_sorulari');
  let i = 1;
  for (const q of questions) {
    await client.execute({
      sql: 'INSERT INTO anamnez_sorulari (id, kategori, yas_grubu, soru, secenekler, sira, aktif, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)',
      args: [crypto.randomUUID(), q.k, q.y, q.s, JSON.stringify(q.o), i++, new Date().toISOString(), new Date().toISOString()]
    });
  }
  console.log('Tum sorular eklendi!');
}

seed().then(() => client.close()).catch(console.error);
