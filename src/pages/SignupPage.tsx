// import React, { useState, useEffect } from 'react';
// import Input from '../components/Input';
// import Button from '../components/Button';
// import { ChevronLeft } from 'lucide-react';
// import axios from 'axios';
// import { toast } from 'sonner';
// import { emailOrPhoneSchema, handleValidationErrors, otpSchema, signupSchema, userInfoSchema } from '../utils/zodSchemas';
// import { useNavigate } from 'react-router-dom';
// import { Eye, EyeOff } from "lucide-react";
// import { AuthBaseURL } from '../utils/URL';
// import { useAuthStore } from '../store/authStore';
// type SignupStep = 'ACCOUNT_CREATE' | 'OTP_VERIFY' | 'USER_INFO' | 'ACCOUNT_INFO';

// interface University { id: string; name: string; }
// interface Department { id: string; name: string; universityId: string; }
// interface Program { id: string; name: string; departmentId: string; }

// const weakPasswords = [
//   // Indian names
//   ""," ",
//   "rahul","rohit","amit","vikas","suresh","mahesh","ramesh","deepak","sunil","anil",
//   "raj","arjun","krishna","shivam","yash","karan","manish","pankaj","sachin","virat",
//   "neha","pooja","anjali","priya","kavita","sunita","rekha","meena","komal","ritu",
//   "aarti","shweta","divya","payal","sonam","nisha","tina","rani","simran","preeti",
//   "abhishek","akash","alok","aman","anand","ashish","ayush","bhavesh","chandan","dinesh",
//   "gopal","harish","jatin","kiran","lokesh","mukesh","naveen","nikhil","pradeep","rahuldev",
//   "ravi","sanjay","tarun","umesh","varun","vivek","yogesh","aditya","harsh","lakshay",
//   "bharti","chitra","deepika","geeta","hema","jyoti","khushi","lata","madhu","namita",
//   "pallavi","radha","sapna","tanvi","usha","vaishali","vidya","yamini","zoya","isha",

//   // Names + common suffixes
//   "rahul123","rohit123","amit123","vikas123","pooja123","neha123","priya123",
//   "karan123","arjun123","shivam123","yash123","raj123","sonam123","nisha123",
//   "rahul@123","rohit@123","amit@123","neha@123",
//   "rahul1","rohit1","amit1","vikas1","neha1","pooja1","priya1",
//   "rahul2024","rohit2024","amit2024","neha2024","pooja2024",

//   // Numeric weak passwords
//   "000000","111111","222222","333333","444444","555555","666666","777777","888888","999999",
//   "00000000","11111111","123123","123321","654321","112233","121212","101010",
//   "123456","12345678","123456789","987654321","12341234","43214321","567890","678901","789012",
//   "246810","135790","909090","808080","707070","606060","12344321","111222","999000","121314","151617",
//   "01012000","02022002","15081947","26011950","31122000","01011999","07071997","12051998",

//   // Keyboard patterns
//   "qwerty","qwerty123","asdfgh","asdfghjkl","zxcvbn","qazwsx","qwertyuiop","asdf1234",
//   "poiuytrewq","mnbvcxz","1q2w3e","1qaz2wsx","zaq12wsx","q1w2e3r4","qazxsw","wsxedc","plmokn","okmijn",

//   // Common global weak passwords
//   "password","password123","admin","admin123","root","root123","letmein","welcome",
//   "iloveyou","monkey","dragon","football","login","passw0rd","abc123",
//   "welcome1","welcome1234","admin@123","root@123","user@123",
//   "test@test","changeme","default","administrator","superuser",
//   "pass123","pass@123","mypassword","secure123","temp@123",
//   "adminadmin","rootroot","guestguest","testtest","useruser",
//   "password1","password12","password@1","passpass",

//   // Indian context variations
//   "india123","bharat123","delhi123","mumbai123","jaipur123","kolkata123","chennai123","bangalore123","hyderabad123",
//   "india@123","bharat@123","hindustan","delhi@123","mumbai@123",
//   "cricket123","ipl123","cricket@123","virat1234","dhoni123","rohit45",
//   "ganesh","krishna123","shiva123","ram123",

//   // Festivals / cultural
//   "diwali123","holi123","ganpati123","navratri123","eid123","ramzan123",

//   // Simple predictable patterns
//   "aaaaaa","bbbbbb","cccccc","dddddd","abcdef","abcdefg","abcd1234",
//   "xyz123","abcabc","12121212","696969","7777777","8888888",

//   // Common phrases
//   "iloveindia","ilovemom","ilovedad","lovely123","cutie123",
//   "sweet123","angel123","babygirl","babyboy","mylove123",

//   // Simple combos
//   "test123","user123","guest123","demo123","temp123","hello123","welcome123"
// ];


// console.log("Total weak passwords:", weakPasswords.length);

// const SignupPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [step, setStep] = useState<SignupStep>('ACCOUNT_CREATE');
//   const [universities, setUniversities] = useState<University[]>([]);
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [programs, setPrograms] = useState<Program[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const accessToken = useAuthStore.getState().accessToken;
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     identifier: '',
//     password: '',
//     confirmPassword: '',
//     otp: '',
//     firstName: '',
//     lastName: '',
//     universityId: '',
//     departmentId: '',
//     programId: '',
//     batchYear: '',
//   });

//   // Fetch Universities on mount
//   useEffect(() => {
//     const fetchUniversities = async () => {
//       try {
//         const res = await axios.get('http://localhost:8080/api/v1/get/universities');
//         setUniversities(res.data.data);
//       } catch (err) { console.error(err); }
//     };
//     fetchUniversities();
//   }, []);

//   // Fetch Departments when University changes
//   useEffect(() => {
//     if (!formData.universityId) return;
//     const fetchDepartments = async () => {
//       try {
//         const res = await axios.get(`http://localhost:8080/api/v1/get/departments/${formData.universityId}`);
//         setDepartments(res.data.data);
//       } catch (err) { console.error(err); }
//     };
//     fetchDepartments();
//   }, [formData.universityId]);

//   // Fetch Programs when Department changes
//   useEffect(() => {
//     if (!formData.departmentId) return;
//     const fetchPrograms = async () => {
//       try {
        
//         const res = await axios.get(`http://localhost:8080/api/v1/get/programs/${formData.departmentId}`);
//         setPrograms(res.data.data);
//       } catch (err) { console.error(err); }
//     };
//     fetchPrograms();
//   }, [formData.departmentId]);

//   // Password validation rules for live UI
//   const passwordChecks = [
//     { label: "At least 6 characters", test: (p: string) => p.length >= 6 },
//     { label: "Contains uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
//     { label: "Contains special character", test: (p: string) => /[!@#$%^&*(),.?\":{}|<>]/.test(p) },
//     { label: "Not a common weak password", test: (p: string) => !weakPasswords.includes(p) },
//   ];

//   // Step 1: Signup
//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const result = signupSchema.safeParse(formData);
//      if (handleValidationErrors(result)) return;
//      if(formData.identifier.split(".").length > 2){
//       toast.error("Invalid Email or Phone No");
//       return;
//      }
//     setIsLoading(true);
//     try {
//       const response = await axios.post('http://localhost:8080/api/v1/auth/signup', {
//         email: formData.identifier,
//         password: formData.password,
//         universityId: formData.universityId,
//       });

//       if (!response.data.success) {
//         toast(response.data.message);
//         return;
//       }
//       toast("Signup successful! Please check your email for the OTP.");
//       setStep('OTP_VERIFY');
//     } catch (err: any) {
//       alert(err.response?.data?.message || "Signup failed");
//     } finally { setIsLoading(false); }
//   };

//   // Step 2: OTP Verification
//  const handleOtpVerify = async (e: React.FormEvent) => {
//   e.preventDefault();

//   // 1. Validation
//   const result = otpSchema.safeParse(formData);
//   if (handleValidationErrors(result)) return;

//   try {
//     const res = await axios.post(`${AuthBaseURL}/verify-otp`, {
//       recipient: formData.identifier,
//       otp: formData.otp,
//       type: "EMAIL_VERIFY",
//     });

//     // 2. Check for success first
//     if (!res.data.success) {
//       toast.error(res.data.message || "Invalid OTP");
//       return;
//     }

//     // 3. Safe Extraction
//     const { accessToken, refreshToken, email, userId } = res.data.data;

//     // 4. Update Zustand Store (Assuming your store has these fields)
//     // We pass the token and a user object constructed from the response
//     useAuthStore.getState().setAuth(accessToken, {
//       id: userId,
//       email: email,
//       roles: ["STUDENT"], // Default role after verification
//     });

//     // 5. Optional: Store refreshToken in secure cookie or localStorage
//     localStorage.setItem("refreshToken", refreshToken);

//     toast.success("Account Verified!");
//     setStep('USER_INFO'); // Move to Step 3

//   } catch (err: any) {
//     const errorMsg = err.response?.data?.message || "OTP verification failed";
//     toast.error(errorMsg);
//   }
// };

//   // Step 3 & 4: User Info & Account Info
//   const handleUserProfile = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const result = userInfoSchema.safeParse(formData);
//     if (handleValidationErrors(result)) return;

//     try {
//       await axios.post('http://localhost:8080/api/v1/users/internal/store', {
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         universityId: formData.universityId,
//         departmentId: formData.departmentId,
//         programId: formData.programId,
//         batchYear: formData.batchYear,
//       }, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//         withCredentials: true,
//       });
//       toast("Signup Complete!");
//       setStep('ACCOUNT_CREATE');
//       navigate('/dashboard');
//     } catch (err: any) {
//       toast(err.response?.data?.message || "Failed to save profile");
//     }
//   };

//   const prevStep = () => {
//     if (step === 'OTP_VERIFY') setStep('ACCOUNT_CREATE');
//     else if (step === 'USER_INFO') setStep('OTP_VERIFY');
//   };

//   return (
//     <div className="signup-container">
//       <div className="signup-card">
//         <div className="form-section">
//           <div className="form-header-nav">
//             {step !== 'ACCOUNT_CREATE' && (
//               <button className="back-btn" onClick={prevStep}>
//                 <ChevronLeft size={18} /> Back  
//               </button>
//             )}
//             <div className="progress-container">
//               <div className="progress-bar" style={{ width: `${step === 'ACCOUNT_CREATE' ? 25 : step === 'OTP_VERIFY' ? 50 : step === 'USER_INFO' ? 75 : 100}%` }}></div>
//             </div>
//           </div>

//             {step === 'ACCOUNT_CREATE' && (
//   <form onSubmit={handleSignup} className="fade-in">
//     <h2>Create Account</h2>
//     <p className="subtitle">Join us to get started with your journey.</p>

//     <Input 
//       type="email" 
//       label="Email" 
//       value={formData.identifier} 
//       onChange={e => setFormData({...formData, identifier: e.target.value})} 
//       required 
//     />

//     <div className="select-group">
//       <label className="input-label">University</label>
//       <select 
//         value={formData.universityId} 
//         onChange={e => setFormData({...formData, universityId: e.target.value})} 
//         required
//       >
//         <option value="">Select University</option>
//         {universities.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
//       </select>
//     </div>

//     {/* Password Field with Eye */}
//     <div style={{ position: "relative" }}>
//       <Input 
//         type={showPassword ? "text" : "password"} 
//         label="Password" 
//         value={formData.password} 
//         onChange={e => setFormData({...formData, password: e.target.value})} 
//         required 
//       />
//       <span 
//         onClick={() => setShowPassword(!showPassword)} 
//         style={{ position: "absolute", right: "12px", top: "15px", cursor: "pointer" }}
//       >
//         {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//       </span>
//     </div>

//         {/* Live password feedback */}
//         <ul style={{ fontSize: "12px", marginTop: "4px" }}>
//           {passwordChecks.map((check, i) => (
//             <li key={i} style={{ color: check.test(formData.password) ? "green" : "red" }}>
//               {check.label}
//             </li>
//           ))}
//         </ul>

//         {/* Confirm Password Field with Eye */}
//         <div style={{ position: "relative" }}>
//           <Input 
//             type={showConfirmPassword ? "text" : "password"} 
//             label="Confirm Password" 
//             value={formData.confirmPassword} 
//             onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
//             required 
//           />
//           <span 
//             onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
//             style={{ position: "absolute", right: "12px", top: "15px", cursor: "pointer" }}
//           >
//             {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//           </span>
//         </div>

//         <Button type="submit" disabled={isLoading}>{isLoading ? "Signing up..." : "Continue"}</Button>
//       </form>
//     )}

//           {step === 'OTP_VERIFY' && (
//             <form onSubmit={handleOtpVerify} className="fade-in">
//               <h2>Verify Account</h2>
//               <Input type="text" label="Enter OTP" maxLength={6} value={formData.otp} onChange={e => setFormData({...formData, otp: e.target.value})} required />
//               <Button type="submit">Verify Code</Button>
//             </form>
//           )}

//           {step === 'USER_INFO' && (
//             <form onSubmit={handleUserProfile} className="fade-in">
//               <h2>User Info</h2>
//               <Input type="text" label="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
//               <Input type="text" label="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />

//               <select value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})} required>
//                 <option value="">Select Department</option>
//                 {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
//               </select>

//               <select value={formData.programId} onChange={e => setFormData({...formData, programId: e.target.value})} required>
//                 <option value="">Select Program</option>
//                 {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
//               </select>

//               <Input type="number" label="Batch Year" value={formData.batchYear} onChange={e => setFormData({...formData, batchYear: e.target.value})} required />
//               <Button type="submit">Finish</Button>
//             </form>
//           )}

//           <div className="login-prompt">
//             <p>Already a member? <a href="/signin">Sign In</a></p>
//           </div>
//         </div>

//         <div className="image-section">
//           <img src="/sidebar.svg" alt="Illustration" />
//         </div>
//       </div>

//       <style>{`
//         .signup-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #fff; font-family: 'Inter', sans-serif; }
//         .signup-card { display: flex; max-width: 1000px; width: 90%; padding: 40px; gap: 80px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
//         .form-section { flex: 1; min-width: 380px; }
//         .image-section { flex: 1.2; display: flex; align-items: center; justify-content: center; background: #f8fafc; border-radius: 30px; padding: 40px; }
//         .image-section img { width: 100%; max-width: 400px; height: auto; }
//         .form-header-nav { display: flex; align-items: center; gap: 20px; margin-bottom: 30px; height: 32px; }
//         .back-btn { background: none; border: none; color: #64748b; display: flex; align-items: center; gap: 4px; cursor: pointer; font-weight: 600; font-size: 14px; padding: 0; }
//         .progress-container { flex: 1; height: 6px; background: #f1f5f9; border-radius: 10px; overflow: hidden; }
//         .progress-bar { height: 100%; background: #3cd3ad; transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
//         h2 { font-size: 32px; font-weight: 700; color: #1e293b; margin: 0 0 8px; }
//         .subtitle { color: #64748b; margin-bottom: 32px; font-size: 15px; }
//         .select-group { display: flex; flex-direction: column; margin-bottom: 20px; }
//         .input-label { font-size: 14px; font-weight: 600; color: #1e293b; margin-bottom: 8px; }
//         select, .custom-select { width: 100%; padding: 12px 16px; border: 1px solid #e2e8f0; font-size: 14px; border-radius: 10px; background: #fff; color: #475569; outline: none; margin-bottom: 20px; }
//         select:focus, .custom-select:focus { border-color: #3cd3ad; box-shadow: 0 0 0 3px rgba(60, 211, 173, 0.1); }
//         .fade-in { animation: fadeIn 0.4s ease-out; }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//         .login-prompt { margin-top: 20px; font-size: 14px; color: #64748b; }
//         .login-prompt a { color: #3cd3ad; font-weight: 600; text-decoration: none; }
//       `}</style>
//     </div>
//   );
// };

// export default SignupPage;


import React, { useState, useEffect } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { ChevronLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import {  handleValidationErrors, otpSchema, signupSchema, userInfoSchema } from '../utils/zodSchemas';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from "lucide-react";
import { AuthBaseURL } from '../utils/URL';
import { useAuthStore } from '../store/authStore';

type SignupStep = 'ACCOUNT_CREATE' | 'OTP_VERIFY' | 'USER_INFO';

interface University { id: string; name: string; }
interface Department { id: string; name: string; universityId: string; }
interface Program { id: string; name: string; departmentId: string; }

const weakPasswords = [
  "", " ", "rahul", "rohit", "amit", "password", "password123", "admin", "123456"
];

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<SignupStep>('ACCOUNT_CREATE');
  const [universities, setUniversities] = useState<University[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 🔑 Local component state to preserve tokens until profile registration finishes
  const [tempAuthData, setTempAuthData] = useState<{
    accessToken: string;
    userId: string;
    email: string;
  } | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    confirmPassword: '',
    otp: '',
    firstName: '',
    lastName: '',
    universityId: '',
    departmentId: '',
    programId: '',
    batchYear: '',
  });

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/v1/get/universities');
        setUniversities(res.data.data);
      } catch (err) { console.error(err); }
    };
    fetchUniversities();
  }, []);

  useEffect(() => {
    if (!formData.universityId) return;
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/v1/get/departments/${formData.universityId}`);
        setDepartments(res.data.data);
      } catch (err) { console.error(err); }
    };
    fetchDepartments();
  }, [formData.universityId]);

  useEffect(() => {
    if (!formData.departmentId) return;
    const fetchPrograms = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/v1/get/programs/${formData.departmentId}`);
        setPrograms(res.data.data);
      } catch (err) { console.error(err); }
    };
    fetchPrograms();
  }, [formData.departmentId]);

  const passwordChecks = [
    { label: "At least 6 characters", test: (p: string) => p.length >= 6 },
    { label: "Contains uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { label: "Contains special character", test: (p: string) => /[!@#$%^&*(),.?\":{}|<>]/.test(p) },
    { label: "Not a common weak password", test: (p: string) => !weakPasswords.includes(p) },
  ];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = signupSchema.safeParse(formData);
    if (handleValidationErrors(result)) return;
    if(formData.identifier.split(".").length > 2){
      toast.error("Invalid Email or Phone No");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/signup', {
        email: formData.identifier,
        password: formData.password,
        universityId: formData.universityId,
      });

      if (!response.data.success) {
        toast(response.data.message);
        return;
      }
      toast("Signup successful! Please check your email for the OTP.");
      setStep('OTP_VERIFY');
    } catch (err: any) {
      alert(err.response?.data?.message || "Signup failed");
    } finally { setIsLoading(false); }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = otpSchema.safeParse(formData);
    if (handleValidationErrors(result)) return;

    try {
      const res = await axios.post(`${AuthBaseURL}/verify-otp`, {
        recipient: formData.identifier,
        otp: formData.otp,
        type: "EMAIL_VERIFY",
      });

      if (!res.data.success) {
        toast.error(res.data.message || "Invalid OTP");
        return;
      }

      const { accessToken, refreshToken, email, userId } = res.data.data;

      // 💾 Cache locally to remain an unauthenticated "Guest" for the next step
      setTempAuthData({ accessToken, userId, email });
      localStorage.setItem("refreshToken", refreshToken);

      toast.success("Account Verified! Please fill in your profile info.");
      setStep('USER_INFO'); 
    } catch (err: any) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    }
  };

  const handleUserProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = userInfoSchema.safeParse(formData);
    if (handleValidationErrors(result)) return;
    if (!tempAuthData) {
      toast.error("Session expired. Please sign in.");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('http://localhost:8080/api/v1/users/internal/store', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        universityId: formData.universityId,
        departmentId: formData.departmentId,
        programId: formData.programId,
        batchYear: formData.batchYear,
      }, {
        headers: { Authorization: `Bearer ${tempAuthData.accessToken}` },
        withCredentials: true,
      });

      toast("Signup Complete!");

      // 🔓 Now initialize global application state to log the user in
      useAuthStore.getState().setAuth(tempAuthData.accessToken, {
        id: tempAuthData.userId,
        email: tempAuthData.email,
        roles: ["STUDENT"],
      });

      navigate('/dashboard');
    } catch (err: any) {
      toast(err.response?.data?.message || "Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };

  const prevStep = () => {
    if (step === 'OTP_VERIFY') setStep('ACCOUNT_CREATE');
    else if (step === 'USER_INFO') setStep('OTP_VERIFY');
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="form-section">
          <div className="form-header-nav">
            {step !== 'ACCOUNT_CREATE' && (
              <button type="button" className="back-btn" onClick={prevStep}>
                <ChevronLeft size={18} /> Back  
              </button>
            )}
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${step === 'ACCOUNT_CREATE' ? 33 : step === 'OTP_VERIFY' ? 66 : 100}%` }}></div>
            </div>
          </div>

          {step === 'ACCOUNT_CREATE' && (
            <form onSubmit={handleSignup} className="fade-in">
              <h2>Create Account</h2>
              <p className="subtitle">Join us to get started with your journey.</p>

              <Input 
                type="email" 
                label="Email" 
                value={formData.identifier} 
                onChange={e => setFormData({...formData, identifier: e.target.value})} 
                required 
              />

              <div className="select-group">
                <label className="input-label">University</label>
                <select 
                  value={formData.universityId} 
                  onChange={e => setFormData({...formData, universityId: e.target.value})} 
                  required
                >
                  <option value="">Select University</option>
                  {universities.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>

              <div style={{ position: "relative" }}>
                <Input 
                  type={showPassword ? "text" : "password"} 
                  label="Password" 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                  required 
                />
                <span 
                  onClick={() => setShowPassword(!showPassword)} 
                  style={{ position: "absolute", right: "12px", top: "15px", cursor: "pointer" }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>

              <ul style={{ fontSize: "12px", marginTop: "4px" }}>
                {passwordChecks.map((check, i) => (
                  <li key={i} style={{ color: check.test(formData.password) ? "green" : "red" }}>
                    {check.label}
                  </li>
                ))}
              </ul>

              <div style={{ position: "relative" }}>
                <Input 
                  type={showConfirmPassword ? "text" : "password"} 
                  label="Confirm Password" 
                  value={formData.confirmPassword} 
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
                  required 
                />
                <span 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                  style={{ position: "absolute", right: "12px", top: "15px", cursor: "pointer" }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>

              <Button type="submit" disabled={isLoading}>{isLoading ? "Signing up..." : "Continue"}</Button>
            </form>
          )}

          {step === 'OTP_VERIFY' && (
            <form onSubmit={handleOtpVerify} className="fade-in">
              <h2>Verify Account</h2>
              <Input type="text" label="Enter OTP" maxLength={6} value={formData.otp} onChange={e => setFormData({...formData, otp: e.target.value})} required />
              <Button type="submit">Verify Code</Button>
            </form>
          )}

          {step === 'USER_INFO' && (
            <form onSubmit={handleUserProfile} className="fade-in">
              <h2>User Info</h2>
              <Input type="text" label="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
              <Input type="text" label="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />

              <div className="select-group">
                <label className="input-label">Department</label>
                <select value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})} required>
                  <option value="">Select Department</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>

              <div className="select-group">
                <label className="input-label">Program</label>
                <select value={formData.programId} onChange={e => setFormData({...formData, programId: e.target.value})} required>
                  <option value="">Select Program</option>
                  {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              <Input type="number" label="Batch Year" value={formData.batchYear} onChange={e => setFormData({...formData, batchYear: e.target.value})} required />
              <Button type="submit" disabled={isLoading}>{isLoading ? "Finishing..." : "Finish"}</Button>
            </form>
          )}

          <div className="login-prompt">
            <p>Already a member? <a href="/signin">Sign In</a></p>
          </div>
        </div>

        <div className="image-section">
          <img src="/sidebar.svg" alt="Illustration" />
        </div>
      </div>

      <style>{`
        .signup-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #fff; font-family: 'Inter', sans-serif; }
        .signup-card { display: flex; max-width: 1000px; width: 90%; padding: 40px; gap: 80px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .form-section { flex: 1; min-width: 380px; }
        .image-section { flex: 1.2; display: flex; align-items: center; justify-content: center; background: #f8fafc; border-radius: 30px; padding: 40px; }
        .image-section img { width: 100%; max-width: 400px; height: auto; }
        .form-header-nav { display: flex; align-items: center; gap: 20px; margin-bottom: 30px; height: 32px; }
        .back-btn { background: none; border: none; color: #64748b; display: flex; align-items: center; gap: 4px; cursor: pointer; font-weight: 600; font-size: 14px; padding: 0; }
        .progress-container { flex: 1; height: 6px; background: #f1f5f9; border-radius: 10px; overflow: hidden; }
        .progress-bar { height: 100%; background: #3cd3ad; transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        h2 { font-size: 32px; font-weight: 700; color: #1e293b; margin: 0 0 8px; }
        .subtitle { color: #64748b; margin-bottom: 32px; font-size: 15px; }
        .select-group { display: flex; flex-direction: column; margin-bottom: 20px; }
        .input-label { font-size: 14px; font-weight: 600; color: #1e293b; margin-bottom: 8px; }
        select, .custom-select { width: 100%; padding: 12px 16px; border: 1px solid #e2e8f0; font-size: 14px; border-radius: 10px; background: #fff; color: #475569; outline: none; margin-bottom: 20px; }
        select:focus, .custom-select:focus { border-color: #3cd3ad; box-shadow: 0 0 0 3px rgba(60, 211, 173, 0.1); }
        .fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .login-prompt { margin-top: 20px; font-size: 14px; color: #64748b; }
        .login-prompt a { color: #3cd3ad; font-weight: 600; text-decoration: none; }
        @media (max-width: 768px) {
          .signup-container { min-height: 100dvh; align-items: flex-start; padding: 32px 16px; }
          .signup-card { width: 100%; padding: 0; gap: 0; box-shadow: none; }
          .form-section { min-width: 0; width: 100%; }
          .image-section { display: none; }
        }
      `}</style>
    </div>
  );
};

export default SignupPage;
