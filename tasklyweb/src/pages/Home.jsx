import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Üst Menü */}
      <div style={{ padding: '20px 40px', backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: '#1A73E8' }}>TASKLY</h2>

        {/* Sağ üst Giriş Yap butonu */}
        <Link to="/login">
          <button style={{ backgroundColor: '#1A73E8', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '16px' }}>
            Giriş Yap
          </button>
        </Link>
      </div>
      <Link to="/dashboard">
          <button style={{ backgroundColor: '#1A73E8', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '16px' }}>
          dashboard
          </button>
        </Link>


      {/* Ana İçerik */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '80px', backgroundColor: '#f4f6f8', minHeight: 'calc(100vh - 90px)' }}>
        
        {/* Sol Alan */}
        <div style={{ flex: 1, paddingRight: '50px' }}>
          <h1 style={{ fontSize: '42px', color: '#0d0d0d', marginBottom: '20px' }}>
            Görevlerinizi her yerden yönetin ve tamamlayın
          </h1>
          <p style={{ fontSize: '18px', color: '#5f6368', marginBottom: '30px' }}>
            Taskly ile projelerinizi düzenleyin, ekip çalışmasını yönetin ve hedeflerinize ulaşın!
          </p>

          {/* E-Posta Inputu ve Buton */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input 
              type="email" 
              placeholder="E-posta adresinizi girin" 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', flex: '1', fontSize: '16px' }}
            />
            <Link to="/signup">
              <button style={{ backgroundColor: '#1A73E8', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '8px', fontSize: '16px' }}>
                Kayıt Ol
              </button>
            </Link>
          </div>

          {/* Videoyu izle */}
          <Link to="#" style={{ color: '#1A73E8', fontSize: '16px', textDecoration: 'none' }}>
            Videoyu İzleyin ▶
          </Link>
        </div>

        {/* Sağ Alan - Görsel (şimdilik boş) */}
        <div style={{ flex: 1 }}>
          <div style={{ width: '100%', height: '400px', backgroundColor: '#dfe1e5', borderRadius: '20px' }}>
            {/* Buraya ilerde görsel koyacağız */}
          </div>
        </div>
      </div>

      {/* Scroll sonrası Tanıtım */}
      <div style={{ padding: '80px', backgroundColor: '#ffffff' }}>
        <h2 style={{ fontSize: '36px', color: '#1A73E8', marginBottom: '30px', textAlign: 'center' }}>
          Taskly 101
        </h2>

        <div style={{ fontSize: '18px', color: '#5f6368', maxWidth: '800px', margin: 'auto', textAlign: 'center' }}>
          Taskly ile görevlerinizi yönetin, projelerinizi takip edin, ekip üyeleriyle etkili iletişim kurun ve verimliliğinizi artırın. 
          Şimdi başlayın ve işlerinizi kolaylaştırın!
        </div>
      </div>
    </div>
  );
}

export default Home;
