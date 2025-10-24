import React from 'react';

const Privacy = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
      <h1>Gizlilik Politikası (Privacy Policy)</h1>
      <p>
        Bu belge "Social Media Admin Dashboard" (bundan sonra "Uygulama") için hazırlanmıştır. Lütfen yayınlamadan önce kendi yasal danışmanınızla gözden geçirin.
      </p>

      <h2>Genel</h2>
      <p>
        Uygulama adresi: <a href="https://social-media-dashboard-sepia-tau.vercel.app/" target="_blank" rel="noopener noreferrer">https://social-media-dashboard-sepia-tau.vercel.app/</a><br />
        İletişim: <a href="mailto:bahadirtortop@gmail.com">bahadirtortop@gmail.com</a>
      </p>
      <p>
        Bahadır Tortop tarafından geliştirilen Uygulama, kullanıcıların içerik üretmesini, görsel oluşturmasını ve onaylı içerikleri Facebook sayfalarına paylaşmasını sağlar. Bu politika, uygulamanın hangi verileri topladığı, bu verileri neden kullandığı ve kullanıcıların hangi haklara sahip olduğu konularını açıklar.
      </p>

      <h2>Toplanan Veriler</h2>
      <p>Uygulama aşağıdaki Facebook ve uygulama verilerini toplayabilir ve/veya kullanabilir:</p>
      <ul>
        <li>public_profile (kullanıcının Facebook kimliği ve adı)</li>
        <li>Bağlanan Facebook Page ID'leri ve Page Access Token'lar (sayfa üzerinde paylaşım yapmak için)</li>
        <li>Paylaşılan gönderi kimlikleri (facebook_post_id, story_facebook_id)</li>
        <li>Uygulama içi oluşturulan içerik verileri (başlık, metin, görsel URL'leri)</li>
        <li>Uygulama kullanım kayıtları (paylaşım zamanları, hata logları)</li>
        <li>İsteğe bağlı: kullanıcı tarafından sağlanan başka meta veriler (ör. ülke, konu seçimi)</li>
      </ul>
      <p><strong>Not:</strong> Token'lar sadece sunucu tarafında saklanır. Tarayıcıda uzun süreli token saklanmaz.</p>

      <h2>Verilerin Kullanım Amaçları</h2>
      <p>Toplanan veriler şu amaçlarla kullanılmaktadır:</p>
      <ul>
        <li>Kullanıcının talebi doğrultusunda Facebook Page üzerinde gönderi veya story paylaşımı yapmak.</li>
        <li>Kullanıcıya dashboard üzerinde paylaşım geçmişi, yayın istatistikleri ve genel yönetim araçları sağlamak.</li>
        <li>Hizmetin güvenliğini ve kalitesini artırmak (hata tespiti, loglama).</li>
        <li>Yasal yükümlülüklerin yerine getirilmesi.</li>
      </ul>

      <h2>Veri Saklama Süresi</h2>
      <p>
        Paylaşım kayıtları ve ilgili meta veriler (facebook_post_id, shared_at vb.) en az 90 gün saklanır. Bu süre projenizin ihtiyaçlarına göre değiştirilebilir. Kullanıcı veri silme talebi geldiğinde ilgili veriler GDPR/uygulanan yasalara uygun şekilde silinir veya anonimleştirilir.
      </p>

      <h2>Üçüncü Taraflarla Paylaşım</h2>
      <p>
        Uygulama, paylaşım için Facebook Graph API'yi kullanır; Page Access Token'lar Facebook ile paylaşılır (Facebook tarafından gereklidir). İlgili tokenlar ve hassas veriler sunucu tarafında güvenli şekilde saklanır. Başka üçüncü taraflarla veri paylaşımı yoktur (istisnalar açıkça belirtilir).
      </p>

      <h2>Kullanıcı Hakları ve Veri Silme (Data Deletion)</h2>
      <p>
        Kullanıcılar, verilerinin silinmesini veya erişim taleplerini <a href="mailto:bahadirtortop@gmail.com">bahadirtortop@gmail.com</a> adresinden talep edebilirler.<br />
      </p>

      <h2>Güvenlik</h2>
      <p>
        Veriler, sunucu tarafında güvenli olarak saklanır; üretim ortamında HTTPS kullanılır ve erişim kontrolleri uygulanır. Token ve diğer hassas bilgilerin erişimi sınırlandırılmıştır.
      </p>

      <h2>İletişim</h2>
      <p>
        Gizlilik politikası veya veri ile ilgili sorular için: <a href="mailto:bahadirtortop@gmail.com">bahadirtortop@gmail.com</a>
      </p>

      <h2>Değişiklikler</h2>
      <p>
        Bu politika zaman zaman güncellenebilir; önemli değişiklikler uygulama üzerinden veya bu sayfa üzerinden duyurulacaktır.
      </p>
    </div>
  );
};

export default Privacy;