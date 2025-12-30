import React, { useState, useEffect } from 'react';

// Color palette extracted from the design
const colors = {
  background: '#0a0e1a',
  cardBg: '#0d1321',
  cardBgLight: '#131a2e',
  primary: '#0066ff',
  primaryGlow: '#0088ff',
  accent: '#00d4ff',
  success: '#00c853',
  warning: '#ffc107',
  text: '#ffffff',
  textSecondary: '#7a8599',
  textMuted: '#4a5568',
  border: '#1a2236',
  gradientStart: '#0066ff',
  gradientEnd: '#00d4ff',
  glass: 'rgba(13, 19, 33, 0.8)',
  glassLight: 'rgba(255, 255, 255, 0.05)',
};

// Shared styles
const baseCardStyle = {
  background: `linear-gradient(145deg, ${colors.cardBg}, ${colors.cardBgLight})`,
  borderRadius: '24px',
  border: `1px solid ${colors.border}`,
  backdropFilter: 'blur(20px)',
  boxShadow: '0 8px 32px rgba(0, 102, 255, 0.1)',
};

const buttonPrimaryStyle = {
  background: `linear-gradient(135deg, ${colors.gradientStart}, ${colors.gradientEnd})`,
  border: 'none',
  borderRadius: '12px',
  color: colors.text,
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 20px rgba(0, 102, 255, 0.4)',
};

const inputStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: `1px solid ${colors.border}`,
  borderRadius: '12px',
  color: colors.text,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  outline: 'none',
  transition: 'all 0.3s ease',
};

// SVG Icons
const Icons = {
  Lock: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  Shield: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.primary}/>
          <stop offset="100%" stopColor={colors.accent}/>
        </linearGradient>
      </defs>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="url(#shieldGrad)" opacity="0.3"/>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="url(#shieldGrad)" strokeWidth="2" fill="none"/>
      <path d="M9 12l2 2 4-4" stroke={colors.accent} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Fingerprint: () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="1.5">
      <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/>
      <path d="M14 13.12c0 2.38 0 6.38-1 8.88"/>
      <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/>
      <path d="M2 12a10 10 0 0 1 18-6"/>
      <path d="M2 16h.01"/>
      <path d="M21.8 16c.2-2 .131-5.354 0-6"/>
      <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"/>
      <path d="M8.65 22c.21-.66.45-1.32.57-2"/>
      <path d="M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2"/>
    </svg>
  ),
  User: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Mail: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  Phone: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  Eye: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  EyeOff: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ),
  ArrowLeft: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Home: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Wallet: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
      <path d="M18 12a2 2 0 0 0 0 4h4v-4z"/>
    </svg>
  ),
  CreditCard: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  Settings: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  Bell: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Search: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Send: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  Download: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Plus: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Check: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  TrendingUp: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.success} strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  TrendingDown: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff4757" strokeWidth="2">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
      <polyline points="17 18 23 18 23 12"/>
    </svg>
  ),
  Upload: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={colors.textSecondary} strokeWidth="1.5">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  QRCode: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  Copy: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  ),
  Scan: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 19a2 2 0 0 1-2 2h-4"/>
      <path d="M23 5a2 2 0 0 0-2-2h-4"/>
      <path d="M1 19a2 2 0 0 0 2 2h4"/>
      <path d="M1 5a2 2 0 0 1 2-2h4"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
    </svg>
  ),
  Coin: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#ffc107" stroke="#ffb300" strokeWidth="2"/>
      <text x="12" y="16" textAnchor="middle" fill="#996600" fontSize="10" fontWeight="bold">$</text>
    </svg>
  ),
  Bag: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00c853" strokeWidth="2">
      <path d="M6 6h12l1.5 12H4.5L6 6z"/>
      <text x="12" y="14" textAnchor="middle" fill="#00c853" fontSize="8" fontWeight="bold">$</text>
    </svg>
  ),
};

// Phone Frame Component with 3D perspective
const PhoneFrame = ({ children, style = {}, transform = '', isActive = false, onClick }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '280px',
        height: '580px',
        background: colors.background,
        borderRadius: '36px',
        border: `2px solid ${isActive ? colors.primary : colors.border}`,
        boxShadow: hovered 
          ? `0 25px 80px rgba(0, 102, 255, 0.4), 0 0 40px rgba(0, 212, 255, 0.2), inset 0 0 60px rgba(0, 102, 255, 0.1)`
          : `0 20px 60px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 102, 255, 0.1)`,
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        transform: `${transform} ${hovered ? 'translateY(-10px) scale(1.02)' : ''} ${isActive ? 'scale(1.05)' : ''}`,
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transformStyle: 'preserve-3d',
        ...style,
      }}
    >
      {/* Notch */}
      <div style={{
        position: 'absolute',
        top: '8px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100px',
        height: '24px',
        background: '#000',
        borderRadius: '12px',
        zIndex: 10,
      }}/>
      {/* Screen content */}
      <div style={{
        width: '100%',
        height: '100%',
        padding: '40px 16px 24px',
        boxSizing: 'border-box',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        {children}
      </div>
      {/* Glow effect */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: `radial-gradient(circle at 50% 50%, rgba(0, 102, 255, ${hovered ? 0.15 : 0.05}) 0%, transparent 50%)`,
        pointerEvents: 'none',
        transition: 'all 0.4s ease',
      }}/>
    </div>
  );
};

// Glowing Shield Icon Component
const GlowingShield = ({ size = 80 }) => (
  <div style={{
    width: size,
    height: size,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  }}>
    <div style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      background: `radial-gradient(circle, ${colors.primary}40 0%, transparent 70%)`,
      animation: 'pulse 2s infinite',
      borderRadius: '50%',
    }}/>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.primary}/>
          <stop offset="100%" stopColor={colors.accent}/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path 
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" 
        fill="url(#shieldGradient)" 
        opacity="0.3"
        filter="url(#glow)"
      />
      <path 
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" 
        stroke="url(#shieldGradient)" 
        strokeWidth="1.5" 
        fill="none"
        filter="url(#glow)"
      />
      <path d="M9 12l2 2 4-4" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" filter="url(#glow)"/>
    </svg>
  </div>
);

// Screen Components

// 1. Login Screen
const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '20px' }}>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: colors.text,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          margin: 0,
          letterSpacing: '2px',
        }}>SIVANCE</h1>
      </div>
      
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginTop: '20px',
      }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="@ james_202"
            style={{
              ...inputStyle,
              width: '100%',
              padding: '14px 16px 14px 44px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: colors.textSecondary }}>
            <Icons.User />
          </span>
        </div>
        
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            style={{
              ...inputStyle,
              width: '100%',
              padding: '14px 44px 14px 44px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: colors.textSecondary }}>
            <Icons.Lock />
          </span>
          <span 
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: colors.textSecondary, cursor: 'pointer' }}
          >
            {showPassword ? <Icons.Eye /> : <Icons.EyeOff />}
          </span>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <span style={{ color: colors.primary, fontSize: '12px', cursor: 'pointer' }}>Forgot Password?</span>
        </div>
        
        <button style={{
          ...buttonPrimaryStyle,
          width: '100%',
          padding: '16px',
          fontSize: '16px',
          marginTop: '10px',
        }}>
          Sign In
        </button>
        
        <div style={{ textAlign: 'center', marginTop: 'auto' }}>
          <p style={{ color: colors.textSecondary, fontSize: '14px', margin: 0 }}>
            Don't have an account? <span style={{ color: colors.primary, cursor: 'pointer' }}>Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// 2. Reset Password Screen
const ResetPasswordScreen = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '10px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
      <Icons.ArrowLeft />
    </div>
    
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
      <GlowingShield size={100} />
    </div>
    
    <h2 style={{
      fontSize: '22px',
      fontWeight: '700',
      color: colors.text,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      textAlign: 'center',
      margin: '0 0 10px 0',
    }}>Reset Password</h2>
    
    <p style={{
      color: colors.textSecondary,
      fontSize: '13px',
      textAlign: 'center',
      margin: '0 0 30px 0',
      lineHeight: '1.5',
    }}>Enter your email address and we'll send you instructions to reset your password.</p>
    
    <div style={{ position: 'relative', marginBottom: '20px' }}>
      <input
        type="email"
        placeholder="Email"
        style={{
          ...inputStyle,
          width: '100%',
          padding: '14px 16px 14px 44px',
          fontSize: '14px',
          boxSizing: 'border-box',
        }}
      />
      <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: colors.textSecondary }}>
        <Icons.Mail />
      </span>
    </div>
    
    <button style={{
      ...buttonPrimaryStyle,
      width: '100%',
      padding: '16px',
      fontSize: '16px',
    }}>
      Send Reset Link
    </button>
  </div>
);

// 3. Create Account Screen
const CreateAccountScreen = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
      <Icons.ArrowLeft />
    </div>
    
    <h2 style={{
      fontSize: '20px',
      fontWeight: '700',
      color: colors.text,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      margin: '0 0 8px 0',
    }}>Create A Sivance Account</h2>
    
    <p style={{
      color: colors.textSecondary,
      fontSize: '12px',
      margin: '0 0 20px 0',
    }}>Join thousands of users managing their finances</p>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ position: 'relative' }}>
        <input placeholder="Full Name" style={{ ...inputStyle, width: '100%', padding: '12px 12px 12px 40px', fontSize: '13px', boxSizing: 'border-box' }}/>
        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: colors.textSecondary }}><Icons.User /></span>
      </div>
      <div style={{ position: 'relative' }}>
        <input placeholder="Email" style={{ ...inputStyle, width: '100%', padding: '12px 12px 12px 40px', fontSize: '13px', boxSizing: 'border-box' }}/>
        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: colors.textSecondary }}><Icons.Mail /></span>
      </div>
      <div style={{ position: 'relative' }}>
        <input placeholder="Phone" style={{ ...inputStyle, width: '100%', padding: '12px 12px 12px 40px', fontSize: '13px', boxSizing: 'border-box' }}/>
        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: colors.textSecondary }}><Icons.Phone /></span>
      </div>
      <div style={{ position: 'relative' }}>
        <input type="password" placeholder="Password" style={{ ...inputStyle, width: '100%', padding: '12px 12px 12px 40px', fontSize: '13px', boxSizing: 'border-box' }}/>
        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: colors.textSecondary }}><Icons.Lock /></span>
      </div>
    </div>
    
    <button style={{
      ...buttonPrimaryStyle,
      width: '100%',
      padding: '14px',
      fontSize: '15px',
      marginTop: '20px',
    }}>
      Create Account
    </button>
    
    <p style={{ color: colors.textSecondary, fontSize: '11px', textAlign: 'center', marginTop: '16px' }}>
      Already have an account? <span style={{ color: colors.primary }}>Sign In</span>
    </p>
  </div>
);

// 4. Fingerprint Screen
const FingerprintScreen = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{
      width: '140px',
      height: '140px',
      borderRadius: '50%',
      background: `linear-gradient(145deg, ${colors.cardBg}, ${colors.cardBgLight})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 0 60px ${colors.primary}40, inset 0 0 30px ${colors.primary}20`,
      marginBottom: '30px',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        border: `2px solid ${colors.primary}`,
        animation: 'ripple 2s infinite',
      }}/>
      <Icons.Fingerprint />
    </div>
    
    <h2 style={{
      fontSize: '20px',
      fontWeight: '700',
      color: colors.text,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      margin: '0 0 10px 0',
    }}>Add Your Fingerprint</h2>
    
    <p style={{
      color: colors.textSecondary,
      fontSize: '13px',
      textAlign: 'center',
      maxWidth: '200px',
      lineHeight: '1.5',
    }}>Place your finger on the sensor to register your fingerprint for secure access</p>
    
    <button style={{
      ...buttonPrimaryStyle,
      padding: '14px 40px',
      fontSize: '15px',
      marginTop: '40px',
    }}>
      Continue
    </button>
  </div>
);

// 5. Sign In With Fingerprint
const FingerprintSignInScreen = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
    <div style={{ marginBottom: '30px', marginTop: '20px' }}>
      <Icons.Upload />
    </div>
    
    <p style={{ color: colors.textSecondary, fontSize: '12px', marginBottom: '30px' }}>Upload Category</p>
    
    <div style={{
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      background: `linear-gradient(145deg, ${colors.cardBg}, ${colors.primary}20)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 0 40px ${colors.primary}30`,
      marginBottom: '30px',
    }}>
      <Icons.Fingerprint />
    </div>
    
    <h3 style={{
      fontSize: '18px',
      fontWeight: '600',
      color: colors.text,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      margin: '0 0 20px 0',
    }}>Sign In With Fingerprint</h3>
    
    <button style={{
      ...buttonPrimaryStyle,
      padding: '14px 50px',
      fontSize: '15px',
    }}>
      Sign In With Fingerprint
    </button>
  </div>
);

// 6. Welcome Screen
const WelcomeScreen = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
    <h1 style={{
      fontSize: '28px',
      fontWeight: '700',
      color: colors.text,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      letterSpacing: '2px',
      marginBottom: '10px',
    }}>SIVANCE</h1>
    
    <div style={{
      width: '160px',
      height: '160px',
      borderRadius: '50%',
      background: `linear-gradient(145deg, ${colors.primary}30, ${colors.accent}20)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '30px 0',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
        <div style={{ width: '40px', height: '40px' }}><Icons.Coin /></div>
        <div style={{ width: '50px', height: '50px' }}><Icons.Bag /></div>
        <div style={{ width: '30px', height: '30px' }}><Icons.Coin /></div>
      </div>
    </div>
    
    <h2 style={{
      fontSize: '22px',
      fontWeight: '600',
      color: colors.text,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      margin: '0 0 10px 0',
    }}>Welcome to Sivance</h2>
    
    <p style={{
      color: colors.textSecondary,
      fontSize: '13px',
      textAlign: 'center',
      maxWidth: '220px',
      lineHeight: '1.5',
      marginBottom: '40px',
    }}>Your smart financial companion for managing expenses and investments</p>
    
    <button style={{
      ...buttonPrimaryStyle,
      padding: '14px 60px',
      fontSize: '15px',
    }}>
      Sign In
    </button>
    
    <button style={{
      background: 'transparent',
      border: `1px solid ${colors.primary}`,
      borderRadius: '12px',
      color: colors.primary,
      padding: '14px 50px',
      fontSize: '15px',
      marginTop: '12px',
      cursor: 'pointer',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      Create Account
    </button>
  </div>
);

// 7. Dashboard Screen
const DashboardScreen = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <p style={{ color: colors.textSecondary, fontSize: '12px', margin: 0 }}>Welcome back</p>
        <h2 style={{ color: colors.text, fontSize: '18px', fontWeight: '600', margin: '4px 0 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>Mr John Dev</h2>
      </div>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: '#fff',
      }}/>
    </div>
    
    <div style={{
      ...baseCardStyle,
      padding: '20px',
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
    }}>
      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', margin: 0 }}>Total Balance</p>
      <h1 style={{ color: colors.text, fontSize: '32px', fontWeight: '700', margin: '8px 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>$2567</h1>
      <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', margin: 0 }}>Income</p>
          <p style={{ color: colors.text, fontSize: '14px', fontWeight: '600', margin: '2px 0 0' }}>$13,000</p>
        </div>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', margin: 0 }}>Expenses</p>
          <p style={{ color: colors.text, fontSize: '14px', fontWeight: '600', margin: '2px 0 0' }}>$2,438</p>
        </div>
      </div>
    </div>
    
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <p style={{ color: colors.text, fontSize: '14px', fontWeight: '600', margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>Transactions</p>
      <p style={{ color: colors.primary, fontSize: '12px', margin: 0, cursor: 'pointer' }}>See All</p>
    </div>
    
    {[
      { name: 'Shopping', amount: '-$120', icon: '🛒', color: '#ff6b6b' },
      { name: 'Transfer', amount: '+$500', icon: '↗️', color: '#00c853' },
      { name: 'Netflix', amount: '-$15', icon: '📺', color: '#e50914' },
    ].map((item, i) => (
      <div key={i} style={{
        ...baseCardStyle,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: `${item.color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
        }}>{item.icon}</div>
        <div style={{ flex: 1 }}>
          <p style={{ color: colors.text, fontSize: '14px', fontWeight: '500', margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>{item.name}</p>
          <p style={{ color: colors.textSecondary, fontSize: '11px', margin: '2px 0 0' }}>Today</p>
        </div>
        <p style={{ color: item.amount.includes('+') ? colors.success : '#ff6b6b', fontSize: '14px', fontWeight: '600', margin: 0 }}>{item.amount}</p>
      </div>
    ))}
    
    <BottomNav />
  </div>
);

// 8. Expense History Screen
const ExpenseHistoryScreen = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Icons.ArrowLeft />
      <h3 style={{ color: colors.text, fontSize: '16px', fontWeight: '600', margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>Expense History</h3>
      <Icons.Search />
    </div>
    
    <div style={{
      ...baseCardStyle,
      padding: '20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: colors.textSecondary, fontSize: '12px', margin: 0 }}>Total Expenses</p>
          <h2 style={{ color: colors.text, fontSize: '28px', fontWeight: '700', margin: '4px 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>$557.3</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Icons.TrendingUp />
          <span style={{ color: colors.success, fontSize: '12px' }}>+12%</span>
        </div>
      </div>
      
      {/* Mini Chart */}
      <div style={{ marginTop: '16px', height: '60px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
        {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
          <div key={i} style={{
            flex: 1,
            height: `${h}%`,
            background: `linear-gradient(180deg, ${colors.primary}, ${colors.accent})`,
            borderRadius: '4px',
            opacity: i === 3 ? 1 : 0.5,
          }}/>
        ))}
      </div>
    </div>
    
    <p style={{ color: colors.text, fontSize: '14px', fontWeight: '600', margin: '8px 0 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>Recent</p>
    
    {[
      { name: 'Grocery', amount: '-$85.50', date: 'Dec 28' },
      { name: 'Transport', amount: '-$25.00', date: 'Dec 27' },
      { name: 'Restaurant', amount: '-$65.00', date: 'Dec 26' },
    ].map((item, i) => (
      <div key={i} style={{
        ...baseCardStyle,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <p style={{ color: colors.text, fontSize: '14px', fontWeight: '500', margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>{item.name}</p>
          <p style={{ color: colors.textSecondary, fontSize: '11px', margin: '2px 0 0' }}>{item.date}</p>
        </div>
        <p style={{ color: '#ff6b6b', fontSize: '14px', fontWeight: '600', margin: 0 }}>{item.amount}</p>
      </div>
    ))}
  </div>
);

// 9. Income History Screen
const IncomeHistoryScreen = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Icons.ArrowLeft />
      <h3 style={{ color: colors.text, fontSize: '16px', fontWeight: '600', margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>Income History</h3>
    </div>
    
    <div style={{
      ...baseCardStyle,
      padding: '20px',
      background: `linear-gradient(145deg, ${colors.cardBg}, ${colors.primary}15)`,
    }}>
      <p style={{ color: colors.textSecondary, fontSize: '12px', margin: 0 }}>Total Income</p>
      <h2 style={{ color: colors.text, fontSize: '32px', fontWeight: '700', margin: '8px 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>$2567.78</h2>
      
      {/* Income Chart */}
      <div style={{ marginTop: '16px', height: '80px', position: 'relative' }}>
        <svg width="100%" height="100%" viewBox="0 0 200 80" preserveAspectRatio="none">
          <defs>
            <linearGradient id="incomeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors.success} stopOpacity="0.4"/>
              <stop offset="100%" stopColor={colors.success} stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d="M0,60 Q30,50 50,40 T100,30 T150,45 T200,20 L200,80 L0,80 Z" fill="url(#incomeGrad)"/>
          <path d="M0,60 Q30,50 50,40 T100,30 T150,45 T200,20" fill="none" stroke={colors.success} strokeWidth="2"/>
        </svg>
      </div>
    </div>
    
    <p style={{ color: colors.text, fontSize: '14px', fontWeight: '600', margin: '8px 0 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>Income History</p>
    
    {[
      { name: 'Salary', amount: '+$2000', date: 'Dec 25' },
      { name: 'Freelance', amount: '+$450', date: 'Dec 20' },
      { name: 'Investment', amount: '+$117.78', date: 'Dec 15' },
    ].map((item, i) => (
      <div key={i} style={{
        ...baseCardStyle,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <p style={{ color: colors.text, fontSize: '14px', fontWeight: '500', margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>{item.name}</p>
          <p style={{ color: colors.textSecondary, fontSize: '11px', margin: '2px 0 0' }}>{item.date}</p>
        </div>
        <p style={{ color: colors.success, fontSize: '14px', fontWeight: '600', margin: 0 }}>{item.amount}</p>
      </div>
    ))}
  </div>
);

// 10. Verify Now Screen
const VerifyScreen = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Icons.ArrowLeft />
    </div>
    
    <div style={{ textAlign: 'center', margin: '20px 0' }}>
      <GlowingShield size={80} />
    </div>
    
    <h2 style={{
      fontSize: '20px',
      fontWeight: '700',
      color: colors.text,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      textAlign: 'center',
      margin: 0,
    }}>Verify Now</h2>
    
    <p style={{
      color: colors.textSecondary,
      fontSize: '13px',
      textAlign: 'center',
      lineHeight: '1.5',
    }}>Complete verification to unlock all features</p>
    
    {[
      { title: 'Email Verification', status: 'Completed', done: true },
      { title: 'Phone Verification', status: 'Pending', done: false },
      { title: 'ID Verification', status: 'Pending', done: false },
    ].map((item, i) => (
      <div key={i} style={{
        ...baseCardStyle,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ color: colors.text, fontSize: '14px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>{item.title}</span>
        <span style={{
          color: item.done ? colors.success : colors.warning,
          fontSize: '12px',
          padding: '4px 12px',
          background: item.done ? `${colors.success}20` : `${colors.warning}20`,
          borderRadius: '20px',
        }}>{item.status}</span>
      </div>
    ))}
    
    <button style={{
      ...buttonPrimaryStyle,
      width: '100%',
      padding: '14px',
      fontSize: '15px',
      marginTop: '16px',
    }}>
      Verify Identity
    </button>
  </div>
);

// 11. Add New Card Screen
const AddCardScreen = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Icons.ArrowLeft />
      <h3 style={{ color: colors.text, fontSize: '16px', fontWeight: '600', margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>Add New Card</h3>
    </div>
    
    {/* Card Preview */}
    <div style={{
      ...baseCardStyle,
      padding: '24px',
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: '-30px',
        right: '-30px',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
      }}/>
      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', margin: 0 }}>Card Number</p>
      <p style={{ color: colors.text, fontSize: '18px', letterSpacing: '2px', margin: '8px 0 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>•••• •••• •••• 4589</p>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', margin: 0 }}>HOLDER</p>
          <p style={{ color: colors.text, fontSize: '12px', margin: '2px 0 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>John Dev</p>
        </div>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', margin: 0 }}>EXPIRES</p>
          <p style={{ color: colors.text, fontSize: '12px', margin: '2px 0 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>12/28</p>
        </div>
      </div>
    </div>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <input placeholder="Cardholder Name" style={{ ...inputStyle, padding: '14px 16px', fontSize: '14px' }}/>
      <input placeholder="Card Number" style={{ ...inputStyle, padding: '14px 16px', fontSize: '14px' }}/>
      <div style={{ display: 'flex', gap: '12px' }}>
        <input placeholder="MM/YY" style={{ ...inputStyle, flex: 1, padding: '14px 16px', fontSize: '14px' }}/>
        <input placeholder="CVV" style={{ ...inputStyle, flex: 1, padding: '14px 16px', fontSize: '14px' }}/>
      </div>
    </div>
    
    <button style={{
      ...buttonPrimaryStyle,
      width: '100%',
      padding: '14px',
      fontSize: '15px',
      marginTop: '12px',
    }}>
      Add Card
    </button>
  </div>
);

// 12. Forgot Password Screen
const ForgotPasswordScreen = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
      <Icons.ArrowLeft />
    </div>
    
    <div style={{
      ...baseCardStyle,
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: `linear-gradient(145deg, ${colors.primary}20, ${colors.cardBg})`,
    }}>
      <GlowingShield size={80} />
      
      <h2 style={{
        fontSize: '20px',
        fontWeight: '700',
        color: colors.text,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        margin: '20px 0 10px',
      }}>Forgot Password</h2>
      
      <p style={{
        color: colors.textSecondary,
        fontSize: '13px',
        textAlign: 'center',
        lineHeight: '1.5',
        maxWidth: '200px',
      }}>Enter your email to receive a password reset link</p>
    </div>
    
    <div style={{ marginTop: '24px' }}>
      <input
        type="email"
        placeholder="Enter your email"
        style={{ ...inputStyle, width: '100%', padding: '14px 16px', fontSize: '14px', boxSizing: 'border-box' }}
      />
    </div>
    
    <button style={{
      ...buttonPrimaryStyle,
      width: '100%',
      padding: '14px',
      fontSize: '15px',
      marginTop: '16px',
    }}>
      Send Reset Link
    </button>
  </div>
);

// 13. Welcome To Sivance Screen
const WelcomeToSivanceScreen = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{
      width: '140px',
      height: '140px',
      borderRadius: '50%',
      background: `linear-gradient(145deg, ${colors.primary}30, ${colors.accent}20)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '30px',
      boxShadow: `0 0 60px ${colors.primary}40`,
    }}>
      <GlowingShield size={80} />
    </div>
    
    <h2 style={{
      fontSize: '22px',
      fontWeight: '700',
      color: colors.text,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      margin: '0 0 10px',
    }}>Welcome to Sivance</h2>
    
    <p style={{
      color: colors.textSecondary,
      fontSize: '13px',
      textAlign: 'center',
      maxWidth: '220px',
      lineHeight: '1.6',
    }}>Your journey to financial freedom starts here. Let's get you set up.</p>
    
    <button style={{
      ...buttonPrimaryStyle,
      padding: '14px 60px',
      fontSize: '15px',
      marginTop: '40px',
    }}>
      Get Started
    </button>
  </div>
);

// 14. Profile Screen
const ProfileScreen = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Icons.ArrowLeft />
      <h3 style={{ color: colors.text, fontSize: '16px', fontWeight: '600', margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>Profile</h3>
      <Icons.Bell />
    </div>
    
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px 0' }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: '#fff',
        marginBottom: '12px',
      }}/>
      <h3 style={{ color: colors.text, fontSize: '18px', fontWeight: '600', margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>Mr John Dev</h3>
      <p style={{ color: colors.textSecondary, fontSize: '13px', margin: '4px 0 0' }}>john.dev@email.com</p>
    </div>
    
    {[
      { icon: <Icons.User />, label: 'Personal Info' },
      { icon: <Icons.CreditCard />, label: 'Payment Methods' },
      { icon: <Icons.Bell />, label: 'Notifications' },
      { icon: <Icons.Shield />, label: 'Security' },
      { icon: <Icons.Settings />, label: 'Settings' },
    ].map((item, i) => (
      <div key={i} style={{
        ...baseCardStyle,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ color: colors.primary }}>{item.icon}</div>
        <span style={{ color: colors.text, fontSize: '14px', flex: 1, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>{item.label}</span>
        <Icons.ChevronRight />
      </div>
    ))}
    
    <BottomNav />
  </div>
);

// 15. Transfer Screen
const TransferScreen = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Icons.ArrowLeft />
      <h3 style={{ color: colors.text, fontSize: '16px', fontWeight: '600', margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>Transfer</h3>
    </div>
    
    <div style={{
      ...baseCardStyle,
      padding: '20px',
      textAlign: 'center',
    }}>
      <p style={{ color: colors.textSecondary, fontSize: '12px', margin: '0 0 8px' }}>Available Balance</p>
      <h2 style={{ color: colors.text, fontSize: '28px', fontWeight: '700', margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>$2,567.78</h2>
    </div>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ position: 'relative' }}>
        <input placeholder="Recipient" style={{ ...inputStyle, width: '100%', padding: '14px 16px 14px 44px', fontSize: '14px', boxSizing: 'border-box' }}/>
        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: colors.textSecondary }}><Icons.User /></span>
      </div>
      
      <input placeholder="Amount" style={{ ...inputStyle, width: '100%', padding: '14px 16px', fontSize: '14px', boxSizing: 'border-box' }}/>
      
      <input placeholder="Note (optional)" style={{ ...inputStyle, width: '100%', padding: '14px 16px', fontSize: '14px', boxSizing: 'border-box' }}/>
    </div>
    
    <p style={{ color: colors.text, fontSize: '14px', fontWeight: '600', margin: '8px 0 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>Recent Recipients</p>
    
    <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
      {['Alex', 'Emma', 'Mike', 'Sara'].map((name, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '60px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fff', marginBottom: '6px' }}/>
          <span style={{ color: colors.textSecondary, fontSize: '11px' }}>{name}</span>
        </div>
      ))}
    </div>
    
    <button style={{
      ...buttonPrimaryStyle,
      width: '100%',
      padding: '14px',
      fontSize: '15px',
    }}>
      Transfer Now
    </button>
  </div>
);

// 16. QR Scanner Screen
const QRScannerScreen = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
      <Icons.ArrowLeft />
      <h3 style={{ color: colors.text, fontSize: '16px', fontWeight: '600', margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>Scan QR Code</h3>
    </div>
    
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '200px',
        height: '200px',
        border: `3px solid ${colors.primary}`,
        borderRadius: '20px',
        position: 'relative',
        background: `linear-gradient(145deg, ${colors.cardBg}, transparent)`,
      }}>
        {/* Corner decorations */}
        {[
          { top: '-3px', left: '-3px', borderTop: `4px solid ${colors.accent}`, borderLeft: `4px solid ${colors.accent}` },
          { top: '-3px', right: '-3px', borderTop: `4px solid ${colors.accent}`, borderRight: `4px solid ${colors.accent}` },
          { bottom: '-3px', left: '-3px', borderBottom: `4px solid ${colors.accent}`, borderLeft: `4px solid ${colors.accent}` },
          { bottom: '-3px', right: '-3px', borderBottom: `4px solid ${colors.accent}`, borderRight: `4px solid ${colors.accent}` },
        ].map((style, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: '30px',
            height: '30px',
            ...style,
            borderRadius: i === 0 ? '20px 0 0 0' : i === 1 ? '0 20px 0 0' : i === 2 ? '0 0 0 20px' : '0 0 20px 0',
          }}/>
        ))}
        
        {/* Scanning line */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '10px',
          right: '10px',
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)`,
          animation: 'scan 2s infinite',
        }}/>
      </div>
      
      <p style={{
        color: colors.textSecondary,
        fontSize: '13px',
        textAlign: 'center',
        marginTop: '24px',
        lineHeight: '1.5',
      }}>Position the QR code within the frame to scan</p>
    </div>
    
    <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: `${colors.primary}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.primary,
        }}>
          <Icons.QRCode />
        </div>
        <span style={{ color: colors.textSecondary, fontSize: '11px', marginTop: '6px' }}>My QR</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: `${colors.primary}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.primary,
        }}>
          <Icons.Upload />
        </div>
        <span style={{ color: colors.textSecondary, fontSize: '11px', marginTop: '6px' }}>Upload</span>
      </div>
    </div>
  </div>
);

// 17. Keyboard/Amount Entry Screen
const AmountEntryScreen = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
      <Icons.ArrowLeft />
      <h3 style={{ color: colors.text, fontSize: '16px', fontWeight: '600', margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>Enter Amount</h3>
    </div>
    
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <p style={{ color: colors.textSecondary, fontSize: '14px', margin: '0 0 8px' }}>Amount to send</p>
      <h1 style={{
        color: colors.text,
        fontSize: '48px',
        fontWeight: '700',
        margin: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>$150</h1>
    </div>
    
    {/* Numeric Keyboard */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px',
      marginBottom: '20px',
    }}>
      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'].map((key) => (
        <button
          key={key}
          style={{
            background: key === '⌫' ? `${colors.primary}20` : colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: '12px',
            color: colors.text,
            fontSize: '24px',
            fontWeight: '500',
            padding: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          {key}
        </button>
      ))}
    </div>
    
    <button style={{
      ...buttonPrimaryStyle,
      width: '100%',
      padding: '16px',
      fontSize: '16px',
    }}>
      Continue
    </button>
  </div>
);

// Bottom Navigation Component
const BottomNav = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '12px 0',
    marginTop: 'auto',
    borderTop: `1px solid ${colors.border}`,
  }}>
    {[
      { icon: <Icons.Home />, active: true },
      { icon: <Icons.Wallet />, active: false },
      { icon: <Icons.CreditCard />, active: false },
      { icon: <Icons.Settings />, active: false },
    ].map((item, i) => (
      <div key={i} style={{
        color: item.active ? colors.primary : colors.textSecondary,
        cursor: 'pointer',
        padding: '8px',
        transition: 'all 0.3s ease',
      }}>
        {item.icon}
      </div>
    ))}
  </div>
);

// Connection Line Component
const ConnectionLine = ({ x1, y1, x2, y2, color = colors.primary }) => {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  
  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <defs>
        <linearGradient id={`lineGrad-${x1}-${y1}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.8"/>
          <stop offset="50%" stopColor={colors.accent} stopOpacity="0.5"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.2"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path
        d={`M${x1},${y1} Q${midX},${y1} ${midX},${midY} T${x2},${y2}`}
        fill="none"
        stroke={`url(#lineGrad-${x1}-${y1})`}
        strokeWidth="2"
        strokeDasharray="8,4"
        filter="url(#glow)"
        style={{
          animation: 'flowLine 3s infinite linear',
        }}
      />
      <circle cx={x1} cy={y1} r="4" fill={colors.accent}>
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx={x2} cy={y2} r="4" fill={colors.primary}>
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
      </circle>
    </svg>
  );
};

// Main App Component
const SivanceApp = () => {
  const [activeScreen, setActiveScreen] = useState(null);
  const [hoveredLine, setHoveredLine] = useState(null);
  
  const screens = [
    { id: 'reset', component: <ResetPasswordScreen />, x: 0, y: 0, transform: 'perspective(1000px) rotateY(15deg)' },
    { id: 'expense', component: <ExpenseHistoryScreen />, x: 1, y: 0, transform: 'perspective(1000px) rotateY(5deg)' },
    { id: 'fingerprint', component: <FingerprintScreen />, x: 2, y: 0, transform: 'perspective(1000px) rotateY(-5deg)' },
    { id: 'create', component: <CreateAccountScreen />, x: 3, y: 0, transform: 'perspective(1000px) rotateY(-15deg)' },
    
    { id: 'login', component: <LoginScreen />, x: 0, y: 1, transform: 'perspective(1000px) rotateY(15deg) rotateX(-5deg)' },
    { id: 'welcome', component: <WelcomeScreen />, x: 1, y: 1, transform: 'perspective(1000px) rotateX(-5deg)' },
    { id: 'income', component: <IncomeHistoryScreen />, x: 2, y: 1, transform: 'perspective(1000px) rotateX(-5deg)' },
    { id: 'verify', component: <VerifyScreen />, x: 3, y: 1, transform: 'perspective(1000px) rotateY(-15deg) rotateX(-5deg)' },
    
    { id: 'profile', component: <ProfileScreen />, x: 0, y: 2, transform: 'perspective(1000px) rotateY(15deg) rotateX(-10deg)' },
    { id: 'addcard', component: <AddCardScreen />, x: 1, y: 2, transform: 'perspective(1000px) rotateX(-10deg)' },
    { id: 'forgot', component: <ForgotPasswordScreen />, x: 2, y: 2, transform: 'perspective(1000px) rotateX(-10deg)' },
    { id: 'welcometo', component: <WelcomeToSivanceScreen />, x: 3, y: 2, transform: 'perspective(1000px) rotateY(-15deg) rotateX(-10deg)' },
    
    { id: 'fingerprintsign', component: <FingerprintSignInScreen />, x: 0, y: 3, transform: 'perspective(1000px) rotateY(15deg) rotateX(-15deg)' },
    { id: 'transfer', component: <TransferScreen />, x: 1.5, y: 3, transform: 'perspective(1000px) rotateX(-15deg)' },
    { id: 'dashboard', component: <DashboardScreen />, x: 3, y: 3, transform: 'perspective(1000px) rotateY(-15deg) rotateX(-15deg)' },
  ];
  
  // Define connections between screens
  const connections = [
    { from: 'login', to: 'reset' },
    { from: 'login', to: 'create' },
    { from: 'login', to: 'welcome' },
    { from: 'welcome', to: 'fingerprint' },
    { from: 'create', to: 'verify' },
    { from: 'verify', to: 'dashboard' },
    { from: 'dashboard', to: 'expense' },
    { from: 'dashboard', to: 'income' },
    { from: 'dashboard', to: 'profile' },
    { from: 'dashboard', to: 'transfer' },
    { from: 'profile', to: 'addcard' },
    { from: 'reset', to: 'forgot' },
    { from: 'fingerprint', to: 'fingerprintsign' },
    { from: 'welcome', to: 'welcometo' },
  ];
  
  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      background: `radial-gradient(ellipse at center, ${colors.cardBgLight} 0%, ${colors.background} 50%, #000 100%)`,
      padding: '40px',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'auto',
    }}>
      {/* Global Styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
        @keyframes ripple {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes scan {
          0%, 100% { top: 20%; }
          50% { top: 80%; }
        }
        @keyframes flowLine {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 102, 255, 0.3); }
          50% { box-shadow: 0 0 40px rgba(0, 102, 255, 0.6); }
        }
        * {
          scrollbar-width: thin;
          scrollbar-color: ${colors.primary} ${colors.cardBg};
        }
        *::-webkit-scrollbar {
          width: 4px;
        }
        *::-webkit-scrollbar-track {
          background: ${colors.cardBg};
        }
        *::-webkit-scrollbar-thumb {
          background: ${colors.primary};
          border-radius: 4px;
        }
      `}</style>
      
      {/* Background Grid Effect */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `
          linear-gradient(${colors.border}20 1px, transparent 1px),
          linear-gradient(90deg, ${colors.border}20 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        pointerEvents: 'none',
        opacity: 0.3,
      }}/>
      
      {/* Ambient Glow Effects */}
      <div style={{
        position: 'fixed',
        top: '20%',
        left: '10%',
        width: '400px',
        height: '400px',
        background: `radial-gradient(circle, ${colors.primary}15 0%, transparent 70%)`,
        pointerEvents: 'none',
        animation: 'pulse 4s infinite',
      }}/>
      <div style={{
        position: 'fixed',
        bottom: '20%',
        right: '10%',
        width: '500px',
        height: '500px',
        background: `radial-gradient(circle, ${colors.accent}10 0%, transparent 70%)`,
        pointerEvents: 'none',
        animation: 'pulse 5s infinite 1s',
      }}/>
      
      {/* Title */}
      <h1 style={{
        textAlign: 'center',
        color: colors.text,
        fontSize: '48px',
        fontWeight: '800',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        letterSpacing: '8px',
        marginBottom: '20px',
        textShadow: `0 0 40px ${colors.primary}80`,
        position: 'relative',
        zIndex: 1,
      }}>
        SIVANCE
      </h1>
      <p style={{
        textAlign: 'center',
        color: colors.textSecondary,
        fontSize: '16px',
        marginBottom: '60px',
        position: 'relative',
        zIndex: 1,
      }}>
        Financial Management System
      </p>
      
      {/* Screens Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '40px',
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}>
        {screens.map((screen, index) => (
          <div
            key={screen.id}
            style={{
              gridColumn: screen.x === 1.5 ? 'span 2' : 'auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <PhoneFrame
              transform={screen.transform}
              isActive={activeScreen === screen.id}
              onClick={() => setActiveScreen(activeScreen === screen.id ? null : screen.id)}
            >
              {screen.component}
            </PhoneFrame>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div style={{
        marginTop: '60px',
        display: 'flex',
        justifyContent: 'center',
        gap: '40px',
        flexWrap: 'wrap',
        position: 'relative',
        zIndex: 1,
      }}>
        {[
          { label: 'Authentication Flow', color: colors.primary },
          { label: 'Dashboard Navigation', color: colors.accent },
          { label: 'User Actions', color: colors.success },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '30px',
              height: '3px',
              background: `linear-gradient(90deg, ${item.color}, transparent)`,
              borderRadius: '2px',
            }}/>
            <span style={{ color: colors.textSecondary, fontSize: '12px' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SivanceApp;