"use client";

import { useState } from "react";
import svgPaths from "../common/imports/svg-gzld84qnt4";
import { Eye, EyeOff } from "lucide-react";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempted with:", { email, password });
    // Add your login logic here
  };

  const handleGoogleLogin = () => {
    console.log("Google login attempted");
    // Add Google OAuth logic here
  };

  return (
    <div className="bg-gradient-to-b from-[#ffffff] to-[#e9f6e9] relative size-full min-h-screen">
      {/* Main Content */}
      <div className="absolute content-stretch flex flex-col gap-[32px] items-center left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-[343px]">
        {/* Logo and Tagline */}
        <div className="content-stretch flex flex-col gap-[8px] items-center not-italic relative shrink-0 text-nowrap w-[169px]">
          <div
            className="bg-clip-text bg-gradient-to-l flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold from-[#46a758] justify-center leading-[0] relative shrink-0 text-[30px] to-[#a9dbb2]"
            style={{ WebkitTextFillColor: "transparent" }}
          >
            <p className="leading-[36px] text-nowrap whitespace-pre">AIHelp</p>
          </div>
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] relative shrink-0 text-[16px] text-neutral-950 whitespace-pre">
            Be Prepared. Stay Safe
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white content-stretch flex flex-col items-start px-0 py-[16px] relative rounded-[12px] shrink-0 w-full">
          <div
            aria-hidden="true"
            className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[12px]"
          />

          <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0 w-full">
            {/* Header */}
            <div className="relative shrink-0 w-full">
              <div className="size-full">
                <div className="content-stretch flex flex-col gap-[8px] items-start px-[16px] py-0 relative w-full">
                  <div className="content-stretch flex items-center justify-center relative shrink-0">
                    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[16px] text-neutral-950 text-nowrap whitespace-pre">
                      Login to your account
                    </p>
                  </div>
                  <div className="content-stretch flex items-center justify-center relative shrink-0 w-full">
                    <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[14px] text-neutral-500 text-nowrap whitespace-pre">
                      Enter your email below to login to your account
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="relative shrink-0 w-full">
              <div className="size-full">
                <div className="content-stretch flex flex-col items-start px-[16px] py-0 relative w-full">
                  <form
                    onSubmit={handleLogin}
                    className="content-stretch flex flex-col gap-[28px] items-start relative shrink-0 w-full"
                  >
                    {/* Email Field */}
                    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                      <div className="content-stretch flex items-center justify-center relative shrink-0">
                        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">
                          Email
                        </p>
                      </div>
                      <div className="bg-white h-[36px] relative rounded-[6px] shrink-0 w-full">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="m@example.com"
                          className="flex flex-row items-center overflow-clip rounded-[inherit] size-full px-[12px] py-[4px] font-['Inter:Regular',sans-serif] font-normal leading-[24px] text-[16px] text-neutral-900 border border-neutral-200 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-[#46a758] focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                      <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
                        <div className="content-stretch flex items-center justify-center relative shrink-0">
                          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">
                            Password
                          </p>
                        </div>
                        <button
                          type="button"
                          className="content-stretch flex items-center justify-center relative shrink-0 hover:opacity-70 transition-opacity"
                          onClick={() => console.log("Forgot password clicked")}
                        >
                          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">
                            Forgot password?
                          </p>
                        </button>
                      </div>
                      <div className="bg-white h-[36px] relative rounded-[6px] shrink-0 w-full">
                        <div className="flex flex-row items-center size-full border border-neutral-200 rounded-[6px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)] focus-within:ring-2 focus-within:ring-[#46a758] focus-within:border-transparent">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="flex-1 px-[12px] py-[4px] font-['Inter:Regular',sans-serif] font-normal leading-[20px] text-[14px] text-neutral-900 bg-transparent border-none outline-none"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="px-[12px] hover:opacity-70 transition-opacity"
                          >
                            {showPassword ? (
                              <Eye className="size-[20px] text-neutral-500" />
                            ) : (
                              <EyeOff className="size-[20px] text-neutral-500" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                      <button
                        type="submit"
                        className="bg-[#46a758] h-[36px] relative rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 w-full hover:bg-[#3d9249] transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center size-full">
                          <div className="content-stretch flex flex-col items-center justify-center px-[16px] py-[8px] relative size-full">
                            <div className="content-stretch flex items-center justify-center relative shrink-0">
                              <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-neutral-50 text-nowrap whitespace-pre">
                                Login
                              </p>
                            </div>
                          </div>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="bg-white h-[36px] relative rounded-[8px] shrink-0 w-full hover:bg-neutral-50 transition-colors"
                      >
                        <div
                          aria-hidden="true"
                          className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)]"
                        />
                        <div className="flex flex-col items-center justify-center size-full">
                          <div className="content-stretch flex flex-col items-center justify-center px-[16px] py-[8px] relative size-full">
                            <div className="content-stretch flex items-center justify-center relative shrink-0">
                              <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">
                                Login with Google
                              </p>
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </form>

                  {/* Sign Up Link */}
                  <div className="content-stretch flex items-center justify-center pb-0 pt-[16px] px-0 relative shrink-0 w-full">
                    <div className="basis-0 flex flex-col font-['Inter:Regular',sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[0px] text-center text-neutral-500">
                      <p className="leading-[20px] text-[14px]">
                        <span>{`Don't have an account? `}</span>
                        <button
                          type="button"
                          onClick={() => console.log("Sign up clicked")}
                          className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid font-['Inter:Regular',sans-serif] font-normal not-italic underline hover:opacity-70 transition-opacity"
                        >
                          Sign up
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-[-1px] h-[34px] left-1/2 transform -translate-x-1/2 w-[375px]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 375 34"
        >
          <path
            clipRule="evenodd"
            d={svgPaths.p2a4e3500}
            fill="var(--fill-0, #04070E)"
            fillRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}
