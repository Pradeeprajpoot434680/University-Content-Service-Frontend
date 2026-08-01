import React, { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { toast } from 'sonner';
import { loginSchema } from '../utils/zodSchemas';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
const LoginPage: React.FC = () => {

  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form submission
const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Zod Validation
    const result = loginSchema.safeParse({ identifier, password });

    if(identifier.split(".").length > 2){
      toast.error("Invalid Email or Phone No");
      return;
      }

    if (!result.success) {
      const errorMsg = result.error.issues.map(err => err.message).join("\n");
      toast.error(errorMsg);
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:8080/api/v1/auth/login', {
        identifier,
        password,
      });

      if (res.data.success) {
        // 2. Extract the enhanced data from your Java Map
        const { 
          accessToken, 
          userId, 
          email, 
          fullName, 
          universityId, 
          roles 
        } = res.data.data;

        // 3. Convert Java roles string "STUDENT,ADMIN" to Array ["STUDENT", "ADMIN"]
        const rolesArray = roles ? roles.split(',') : [];

        const decodedToken: any = jwtDecode(accessToken);
        const scopeId = decodedToken.scopeId;

        // 4. Update Zustand Store
        // This automatically saves to localStorage because of the 'persist' middleware
         useAuthStore.getState().setAuth(accessToken, {
          id: userId,
          email: email,
          universityId: universityId,
          roles: rolesArray,
          scopeId: scopeId
        });


        toast.success(`Welcome back, ${fullName}!`);
        
        // 5. Use navigate instead of window.location for a smoother SPA experience
        navigate('/dashboard'); 
        
      } else {
        // Handle "Please verify your account" or "Banned" messages from backend
        toast.error(res.data.message || 'Login failed');
        
        // Logic check: If user is not verified, redirect to verification page
        if (res.data.message.includes("verify")) {
           navigate(`/verify-account?email=${identifier}`);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login request failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="form-section">
          <h2>Sign In</h2>
          <p className="subtitle">Enter your credentials to access your account.</p>
          
          <form onSubmit={handleLogin}>
            <Input
              type="text"
              label="Email or Mobile Number"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              required
            />

            <div style={{ position: 'relative' }}>
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: 15,
                  cursor: 'pointer',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            <div className="options">
              <label><input type="checkbox" /> Remember me</label>
              <a href="/forgot-password">Forgot Password</a>
            </div>
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>

            <div className="signup-link">
              <p>Don't have an account? <a href="/signup">Sign Up</a>  &nbsp; Or&nbsp; <a href="/verify-account">Verify Your Account</a></p>
            </div>
          </form>

     {/* <div className="social-login">
      <p>or sign in with</p>
      <div className="social-icons">
        <Button
          variant="social"
          bgColor="#3b5998"
          width={50}
          height={50}
        >
          f
        </Button>

        <Button
          variant="social"
          bgColor="#1da1f2"
          width={50}
          height={50}
        >
          t
        </Button>

        <Button
          variant="social"
          bgColor="#ea4335"
          width={50}
          height={50}
        >
          G
        </Button>


      </div>
    </div> */}
        </div>

        <div className="image-section">
          <img src="sidebar.svg" alt="Login Illustration" />
        </div>
      </div>
    <style>{`
      .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: calc(100vh - 70px); /*  prevents navbar overlap */
        padding: 20px;
      }

      .login-card {
        display: flex;
        max-width: 900px;
        width: 100%;
        gap: 50px;
      }

      .form-section { flex: 1; }

      .image-section {
        flex: 1;
        display: flex;
        align-items: center;
      }

      .image-section img { width: 100%; }

      h2 {
        font-size: 28px;
        margin-bottom: 10px;
      }

      .subtitle {
        color: #888;
        margin-bottom: 30px;
        font-size: 14px;
      }

      .options {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        margin-bottom: 20px;
        color: #666;
      }

      .social-login {
        margin-top: 30px;
        text-align: left;
      }

      .social-icons {
        display: flex;
        margin-top: 10px;
        gap: 10px;
      }

      .signup-link {
        margin-top: 20px;
        font-size: 14px;
        color: #666;
      }

      .signup-link a {
        color: #3cd3ad;
        text-decoration: none;
      }

      .signup-link a:hover {
        text-decoration: underline;
      }

      @media (max-width: 768px) {
        .login-card {
          flex-direction: column;
          gap: 20px;
        }

        .image-section {
          display: none;
        }

        .form-section {
          width: 100%;
        }
      }
    `}</style>
    </div>
  );
};

export default LoginPage;