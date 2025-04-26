import { Link } from 'react-router-dom';
import LeftImage from '../assets/loginsignup2.png'; // Sol görsel
import RightImage from '../assets/loginsignup1.png'; // Sağ görsel

function Login() {
  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      minHeight: '100vh', 
      height: '100vh',
      backgroundColor: '#ffffff', 
      position: 'relative',
      overflow: 'hidden', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>

      {/* Sol Alt Görsel */}
      <img 
        src={LeftImage} 
        alt="Taskly Sol Görsel" 
        style={{ 
          position: 'absolute',
          left: '40px',
          bottom: '40px',
          width: '500px',
          opacity: 0.95
        }}
      />

      {/* Sağ Alt Görsel */}
      <img 
        src={RightImage} 
        alt="Taskly Sağ Görsel" 
        style={{ 
          position: 'absolute',
          right: '40px',
          bottom: '25px',
          width: '400px',
          opacity: 0.95
        }}
      />

      {/* Ortadaki Form */}
      <div style={{ 
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        zIndex: 2,
        textAlign: 'center'
      }}>
        {/* TASKLY Başlığı - formun içinde */}
        <h1 style={{ 
          fontSize: '36px', 
          color: '#1A73E8', 
          marginBottom: '10px',
          fontWeight: 'bold'
        }}>
          TASKLY
        </h1>

        {/* Giriş Yap Başlığı */}
        <h2 style={{ 
          fontSize: '24px',
          color: '#1A73E8',
          marginBottom: '20px'
        }}>
          Giriş Yap
        </h2>

        {/* Form Alanı */}
        <form>
          <input 
            type="email" 
            placeholder="E-posta" 
            style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px' }}
          />
          <input 
            type="password" 
            placeholder="Şifre" 
            style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px' }}
          />

          <button 
            type="submit"
            style={{ width: '100%', padding: '12px', backgroundColor: '#1A73E8', color: '#ffffff', fontSize: '16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
          >
            Giriş Yap
          </button>
        </form>

        {/* Kayıt Ol Linki */}
        <div style={{ marginTop: '20px' }}>
          <span>Hesabınız yok mu? </span>
          <Link to="/signup" style={{ color: '#1A73E8', textDecoration: 'none', fontWeight: 'bold' }}>
            Kayıt Ol
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
