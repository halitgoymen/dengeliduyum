export const REASONS = [
  'İşitme azlığı/ kaybı',
  'Çınlama (Tinnitus) Terapisi',
  'Denge (Vestibüler) Rehabilitasyon',
  'Mesleki ve Periyodik İşitme Taraması',
  'Çocuk randevusu (ebeveyn girişi)',
]

export const AGE_GROUPS = [
  '0-18 yaş',
  '18-65 yaş',
  '65 yaş ve üzeri',
]

// Soruları gruplayalım
export const QUESTIONS = {
  // BÖLÜM 1 Genel İşitsel Durum (İşitme azlığı/kaybı seçilirse tüm yaşlar için)
  isitme_azligi: [
    { id: 'q1_1', type: 'radio', options: ['Hiç', 'Bazen', 'Her zaman'], text: 'Karşılıklı konuşmaları anlamada zorluk yaşıyor musunuz?' },
    { id: 'q1_2', type: 'radio', options: ['Hiç', 'Bazen', 'Her zaman'], text: 'Gürültülü ortamlarda (kafe, sokak) sesleri ayırt edebiliyor musunuz?' },
    { id: 'q1_3', type: 'radio', options: ['Hiç', 'Bazen', 'Her zaman'], text: 'TV/Radyo sesini başkalarını rahatsız edecek kadar açıyor musunuz?' },
    { id: 'q1_4', type: 'radio', options: ['Hiç', 'Bazen', 'Her zaman'], text: 'İşitme sorunu nedeniyle sosyal ortamlardan kaçınıyor musunuz?' },
    { id: 'q1_5', type: 'radio', options: ['Hiç', 'Bazen', 'Her zaman'], text: 'Gün sonunda dinleme çabasından dolayı yorgun hissediyor musunuz?' },
    { id: 'q1_6', type: 'radio', options: ['Hiç', 'Bazen', 'Her zaman'], text: 'Mutfaktaki tabak çatal sesi, kapı çarpması veya trafikteki korna sesi sizi yerinizden sıçratacak kadar rahatsız ediyor mu?' },
    { id: 'q1_7', type: 'radio', options: ['Hiç', 'Bazen', 'Her zaman'], text: 'Sesleri duyuyor ama kelimeleri sanki ağız içinde yuvarlanıyormuş (mırıldanma gibi) gibi algılıyor musunuz?' },
    { id: 'q1_8', type: 'radio', options: ['Hiç', 'Bazen', 'Her zaman'], text: 'Telefonda iletişim kurmada zorluk yaşıyor musunuz?' },
    { id: 'q1_9', type: 'radio', options: ['Hiç', 'Bazen', 'Her zaman'], text: 'Karşınızdaki kişinin dudaklarına bakmadan söylediklerini anlayabiliyor musunuz?' },
    { id: 'q1_10', type: 'radio', options: ['Evet', 'Hayır'], text: 'İşitme sorunu nedeniyle gitmekten kaçındığınız ortamlara (kahvehane, tiyatro, akraba ziyareti vb.) tekrar gitmeye başladınız mı?' },
    { id: 'q1_11', type: 'radio', options: ['Evet', 'Hayır'], text: 'Son dönemde kulaklarınızda bir kaşıntı, nemlenme veya "tıkalıymış" hissi oluştu mu?' },
  ],
  cinlama_0_18: [
    { id: 'q_t1_1', type: 'radio', options: ['Evet', 'Hayır'], text: 'Çocuğunuz kulağından ses duyduğundan (uğultu, rüzgar sesi, ıslık vb.) şikayet ediyor mu?' },
    { id: 'q_t1_2', type: 'radio', options: ['Evet', 'Hayır'], text: 'Gece uykuya dalarken karanlık/sessiz ortamda korku veya huzursuzluk yaşıyor mu? veya uyurken arka planda bir ses açılmasını istiyor mu?' },
    { id: 'q_t1_3', type: 'radio', options: ['Evet', 'Hayır'], text: 'Son kontrolünüzden bu yana çocuğunuzda sese karşı aşırı duyarlılık (hiperakuzi), aniden kulaklarını kapatma veya hırçınlık gözlemlediniz mi?' },
    { id: 'q_t1_4', type: 'radio', options: ['Evet', 'Hayır'], text: 'Çınlama şikayetinin çocuğunuzun okuldaki dikkatini veya ders dinleme performansını olumsuz etkilediğini düşünüyor musunuz?' },
    { id: 'q_t1_5', type: 'radio', options: ['Her gün', 'Sadece yorgunken', 'Neredeyse hiç şikayet etmiyor'], text: 'Çocuğunuz kulağındaki sesten ne sıklıkla şikayet ediyor?' },
  ],
  cinlama_18_65: [
    { id: 'q_t2_1', type: 'radio', options: ['Çok hafif', 'Orta', 'Çok fazla', 'Dayanılmaz derecede'], text: 'Lütfen şu anki çınlama şiddetinizi seçiniz.' },
    { id: 'q_t2_2', type: 'radio', options: ['Evet', 'Hayır'], text: 'Çınlama nedeniyle gece uykudan uyanma veya uykuya dalma sürenizde uzama yaşıyor musunuz?' },
    { id: 'q_t2_3', type: 'radio', options: ['Evet', 'Hayır'], text: 'Kulaklık kullanımı veya yüksek sesli müzik dinleme alışkanlığınız (maruziyet) devam ediyor mu?' },
    { id: 'q_t2_4', type: 'radio', options: ['Evet', 'Hayır'], text: 'Son kontrolünüzden bu yana stres seviyenizde artış var mı?' },
    { id: 'q_t2_5', type: 'radio', options: ['Evet', 'Hayır'], text: 'Son kontrolünüzden bu yana kafein/sigara tüketiminizde artış var mı?' },
    { id: 'q_t2_6', type: 'radio', options: ['Kullanıyorum ve fayda sağlıyor', 'Kullanıyorum ama fayda sağlamıyor', 'Kullanmıyorum'], text: 'Size önerilen ses terapisi uygulamalarını günlük hayatınızda düzenli kullanıyor musunuz?' },
    { id: 'q_t2_7', type: 'radio', options: ['Evet', 'Hayır'], text: 'Kulağınızdaki çınlama gergin/ öfkeli olmanıza sebep oluyor mu?' },
    { id: 'q_t2_8', type: 'radio', options: ['Evet', 'Hayır'], text: 'Çınlamanız iş yerinde/ okulda/ arkadaş ortamında odaklanmanızı (konsantrasyon) veya stres seviyenizi etkiliyor mu?' },
  ],
  cinlama_65: [
    { id: 'q_t3_1', type: 'radio', options: ['Evet', 'Hayır'], text: 'Çınlama sesiniz, tansiyon değişikliklerinizle veya düzenli kullandığınız diğer kalp/şeker ilaçlarıyla birlikte artış gösteriyor mu?' },
    { id: 'q_t3_2', type: 'radio', options: ['Evet', 'Hayır'], text: 'Çınlama nedeniyle gece uykudan uyanma veya uykuya dalma sürenizde uzama yaşıyor musunuz?' },
    { id: 'q_t3_3', type: 'radio', options: ['Evet', 'Hayır'], text: 'İşitme cihazınızı taktığınız süre boyunca kulağınızdaki çınlama sesinde bir azalma veya kaybolma hissediyor musunuz?' },
    { id: 'q_t3_4', type: 'radio', options: ['Evet', 'Hayır'], text: 'Son randevunuzdan bu yana yeni bir tansiyon, kalp veya diyabet ilacı kullanmaya başladınız mı veya ilaç dozlarınız değişti mi?' },
    { id: 'q_t3_5', type: 'radio', options: ['Kalp atışı ritminde', 'Düz ve sürekli ses'], text: 'Kulağınızdaki ses kalp atışı ritminde (nabızla uyumlu) mi atıyor, yoksa düz ve sürekli bir ses mi?' },
  ],
  denge_18_65: [
    { id: 'q_d1_1', type: 'radio', options: ['Evet', 'Hayır'], text: 'Son uygulanan tedaviden bu yana, yatakta sağa/sola dönerken veya yukarı raftan bir şey alırken saniyeler süren o kısa ve şiddetli dönme hissi tekrar başladı mı?' },
    { id: 'q_d1_2', type: 'radio', options: ['Evet', 'Hayır'], text: 'Market koridorlarında yürürken, kalabalık desenli halılara bakarken veya telefonda hızlıca ekranı kaydırırken dengesizlik/sersemlik hissiniz tetikleniyor veya artıyor mu?' },
    { id: 'q_d1_3', type: 'radio', options: ['Evet', 'Hayır'], text: 'Son randevunuzdan bu yana saatlerce süren, beraberinde kulakta tıkanıklık, uğultu ve işitme azalması yaratan şiddetli bir atak geçirdiniz mi?' },
    { id: 'q_d1_4', type: 'radio', options: ['Evet', 'Hayır'], text: 'Baş dönmesi ataklarınız genellikle aşırı stresli olduğunuz, uykusuz kaldığınız günlerde veya hormonal değişim dönemlerinde mi ortaya çıkıyor?' },
    { id: 'q_d1_5', type: 'radio', options: ['Evet', 'Hayır'], text: 'Ataklar sırasında soğuk terleme, şiddetli çarpıntı veya bayılacak gibi olma hissi (senkop) yaşıyor musunuz?' },
    { id: 'q_d1_6', type: 'radio', options: ['Evet', 'Hayır'], text: 'Son gelişinizden bu yana ev içinde veya dışarıda hiç yere düştünüz mü veya düşmekten son anda kurtulduğunuz (sendeme) tehlikeli bir an yaşadınız mı?' },
    { id: 'q_d1_7', type: 'radio', options: ['Evet', 'Hayır'], text: 'Gece tuvalete kalktığınızda (karanlıkta) veya çim/çakıl gibi engebeli zeminlerde yürürken dengenizi sağlamakta, aydınlık düz zeminlere kıyasla çok daha fazla mı zorlanıyorsunuz?' },
    { id: 'q_d1_8', type: 'radio', options: ['Evet', 'Hayır'], text: 'Gözlerinizin kararması ve baş dönmesi hissi, daha çok oturduğunuz/yattığınız yerden aniden ayağa kalktığınız ilk birkaç saniye içinde mi gerçekleşiyor?' },
    { id: 'q_d1_9', type: 'radio', options: ['Evet', 'Hayır'], text: 'Arabayı park etmek için geri geri giderken boynunuzu çevirdiğinizde veya yukarı doğru uzun süre baktığınızda sersemlik/dengesizlik hissediyor musunuz?' },
  ]
}

export function getQuestionsFor(reason: string, ageGroup: string) {
  if (reason === 'İşitme azlığı/ kaybı') {
    return QUESTIONS.isitme_azligi
  }
  if (reason === 'Çınlama (Tinnitus) Terapisi') {
    if (ageGroup === '0-18 yaş') return QUESTIONS.cinlama_0_18
    if (ageGroup === '18-65 yaş') return QUESTIONS.cinlama_18_65
    return QUESTIONS.cinlama_65
  }
  if (reason === 'Denge (Vestibüler) Rehabilitasyon') {
    // Denge için sadece 18-65 yaş var PDF'te, diğerlerini de şimdilik buraya yönlendiriyorum veya boş dönebilir
    return QUESTIONS.denge_18_65
  }
  return [] // Diğer durumlarda standart not alanı falan çıkarılabilir
}
