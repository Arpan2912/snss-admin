import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/AuthService';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err?.msg || 'Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                {/* Logo / Brand */}
                <div style={styles.brand}>
                    <div style={styles.brandIcon}>S</div>
                    <h1 style={styles.brandName}>SNSS Admin</h1>
                    <p style={styles.brandSub}>Sign in to manage your content</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    {error && (
                        <div style={styles.errorBox}>
                            <span style={styles.errorIcon}>⚠</span> {error}
                        </div>
                    )}

                    <div style={styles.fieldGroup}>
                        <label style={styles.label} htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@snssindia.in"
                            required
                            style={styles.input}
                            autoComplete="email"
                        />
                    </div>

                    <div style={styles.fieldGroup}>
                        <label style={styles.label} htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            style={styles.input}
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
                    >
                        {loading ? (
                            <span>Signing in<span style={styles.dots}>...</span></span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <p style={styles.footer}>
                    SNSS & Co. — Admin Panel
                </p>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    },
    card: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '48px 44px 36px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)',
    },
    brand: {
        textAlign: 'center',
        marginBottom: '36px',
    },
    brandIcon: {
        width: '60px',
        height: '60px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #ffc107, #ff9800)',
        color: '#1a1a2e',
        fontSize: '28px',
        fontWeight: '800',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px',
        boxShadow: '0 8px 24px rgba(255, 193, 7, 0.35)',
    },
    brandName: {
        color: '#ffffff',
        fontSize: '26px',
        fontWeight: '700',
        margin: '0 0 6px',
        letterSpacing: '-0.5px',
    },
    brandSub: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: '14px',
        margin: 0,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    fieldGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    label: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: '13px',
        fontWeight: '500',
        letterSpacing: '0.3px',
        textAlign: 'left',
        width: 'auto',
    },
    input: {
        background: 'rgba(255, 255, 255, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '10px',
        color: '#ffffff',
        fontSize: '15px',
        padding: '12px 16px',
        outline: 'none',
        transition: 'border-color 0.2s, background 0.2s',
        width: '100%',
        boxSizing: 'border-box',
    },
    button: {
        background: 'linear-gradient(135deg, #ffc107, #ff9800)',
        border: 'none',
        borderRadius: '10px',
        color: '#1a1a2e',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: '700',
        marginTop: '4px',
        padding: '14px',
        transition: 'opacity 0.2s, transform 0.15s',
        width: '100%',
        letterSpacing: '0.3px',
    },
    buttonDisabled: {
        opacity: 0.65,
        cursor: 'not-allowed',
    },
    errorBox: {
        background: 'rgba(220, 53, 69, 0.15)',
        border: '1px solid rgba(220, 53, 69, 0.4)',
        borderRadius: '10px',
        color: '#ff8080',
        fontSize: '14px',
        padding: '12px 16px',
        textAlign: 'left',
    },
    errorIcon: {
        marginRight: '6px',
    },
    dots: {
        display: 'inline-block',
        animation: 'none',
    },
    footer: {
        color: 'rgba(255,255,255,0.25)',
        fontSize: '12px',
        marginTop: '28px',
        marginBottom: 0,
        textAlign: 'center',
    },
};
