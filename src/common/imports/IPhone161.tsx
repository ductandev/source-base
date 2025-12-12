import svgPaths from "./svg-gzld84qnt4";

function Wrapper4({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="flex flex-col items-center justify-center size-full">
      <div className="content-stretch flex flex-col items-center justify-center px-[16px] py-[8px] relative size-full">{children}</div>
    </div>
  );
}
type TextTextProps = {
  text: string;
};

function TextText({ text }: TextTextProps) {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">{text}</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center not-italic relative shrink-0 text-nowrap w-[169px]">
      <div className="bg-clip-text bg-gradient-to-l flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold from-[#46a758] justify-center leading-[0] relative shrink-0 text-[30px] to-[#a9dbb2]" style={{ WebkitTextFillColor: "transparent" }}>
        <p className="leading-[36px] text-nowrap whitespace-pre">AIHelp</p>
      </div>
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] relative shrink-0 text-[16px] text-neutral-950 whitespace-pre">Be Prepared. Stay Safe</p>
    </div>
  );
}

function Text() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Text">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[16px] text-neutral-950 text-nowrap whitespace-pre">Login to your account</p>
    </div>
  );
}

function Text1() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[14px] text-neutral-500 text-nowrap whitespace-pre">Enter your email below to login to your account</p>
    </div>
  );
}

function Wrapper() {
  return (
    <div className="relative shrink-0 w-full" data-name="Wrapper">
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start px-[16px] py-0 relative w-full">
          <Text />
          <Text1 />
        </div>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-neutral-900 text-nowrap whitespace-pre">m@example.com</p>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white h-[36px] relative rounded-[6px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] py-[4px] relative size-full">
          <Text2 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[6px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function WithLabel() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="With Label">
      <TextText text="Email" />
      <Input />
    </div>
  );
}

function Text3() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">Forgot password?</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <TextText text="Password" />
      <Text3 />
    </div>
  );
}

function EyeOff() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="eye-off">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="eye-off">
          <g id="Vector"></g>
          <path d={svgPaths.p1cc71200} id="Vector_2" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p13ff8180} id="Vector_3" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M3 3L21 21" id="Vector_4" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-px min-w-px overflow-clip relative shrink-0" data-name="Text">
      <div className="basis-0 flex flex-col font-['Inter:Regular',sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-neutral-900">
        <p className="leading-[20px]">*******</p>
      </div>
      <EyeOff />
    </div>
  );
}

function Select() {
  return (
    <div className="bg-white h-[36px] relative rounded-[6px] shrink-0 w-full" data-name="Select">
      <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[6px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] py-[4px] relative size-full">
          <Text4 />
        </div>
      </div>
    </div>
  );
}

function WithLabel1() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="With Label">
      <Frame />
      <Select />
    </div>
  );
}

function Text5() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Text">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-neutral-50 text-nowrap whitespace-pre">Login</p>
    </div>
  );
}

function Buttons() {
  return (
    <div className="bg-[#46a758] h-[36px] relative rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Buttons">
      <Wrapper4>
        <Text5 />
      </Wrapper4>
    </div>
  );
}

function Buttons1() {
  return (
    <div className="bg-white h-[36px] relative rounded-[8px] shrink-0 w-full" data-name="Buttons">
      <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <Wrapper4>
        <TextText text="Login with Google" />
      </Wrapper4>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Buttons />
      <Buttons1 />
    </div>
  );
}

function Wrapper1() {
  return (
    <div className="content-stretch flex flex-col gap-[28px] items-start relative shrink-0 w-full" data-name="Wrapper">
      <WithLabel />
      <WithLabel1 />
      <Frame2 />
    </div>
  );
}

function Text6() {
  return (
    <div className="content-stretch flex items-center justify-center pb-0 pt-[16px] px-0 relative shrink-0 w-full" data-name="Text">
      <div className="basis-0 flex flex-col font-['Inter:Regular',sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[0px] text-center text-neutral-500">
        <p className="leading-[20px] text-[14px]">
          <span>{`Don't have an account? `}</span>
          <span className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid font-['Inter:Regular',sans-serif] font-normal not-italic underline">Sign up</span>
        </p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="size-full">
        <div className="content-stretch flex flex-col items-start px-[16px] py-0 relative w-full">
          <Wrapper1 />
          <Text6 />
        </div>
      </div>
    </div>
  );
}

function Wrapper2() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0 w-full" data-name="Wrapper">
      <Wrapper />
      <Frame1 />
    </div>
  );
}

function Wrapper3() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start px-0 py-[16px] relative rounded-[12px] shrink-0 w-full" data-name="Wrapper">
      <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Wrapper2 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] items-center left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-[343px]">
      <Frame3 />
      <Wrapper3 />
    </div>
  );
}

function MobileSignal() {
  return (
    <div className="h-[10px] relative shrink-0 w-[18px]" data-name="Mobile Signal">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 10">
        <g id="Mobile Signal">
          <path d={svgPaths.pa13f700} fill="var(--fill-0, #04070E)" id="Mobile Signal_2" />
        </g>
      </svg>
    </div>
  );
}

function Wifi() {
  return (
    <div className="h-[10.965px] relative shrink-0 w-[15.272px]" data-name="Wifi">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 11">
        <g id="Wifi">
          <path d={svgPaths.p3e788c00} fill="var(--fill-0, #04070E)" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Battery() {
  return (
    <div className="[grid-area:1_/_1] h-[13px] ml-0 mt-[calc(50%-6.5px)] relative w-[26.978px]" data-name="Battery">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 13">
        <g id="Battery">
          <path d={svgPaths.p35a5ef80} id="Rectangle" opacity="0.2" stroke="var(--stroke-0, #04070E)" />
          <path d={svgPaths.p31381a00} fill="var(--fill-0, #04070E)" id="Combined Shape" opacity="0.2" />
          <path d={svgPaths.p3838ab00} fill="var(--fill-0, #04070E)" id="Rectangle_2" />
        </g>
      </svg>
    </div>
  );
}

function Battery1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Battery">
      <Battery />
    </div>
  );
}

function StatusPhone() {
  return (
    <div className="content-stretch flex gap-[5px] items-center relative shrink-0" data-name="Status Phone">
      <MobileSignal />
      <Wifi />
      <Battery1 />
    </div>
  );
}

function NativeStatusBar() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-0 px-[30px] py-[14px] top-0 w-[375px]" data-name="Native / Status Bar">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#04070e] text-[16px] text-nowrap">
        <p className="leading-[16px] whitespace-pre">9:41</p>
      </div>
      <StatusPhone />
    </div>
  );
}

function NativeHomeIndicator() {
  return (
    <div className="absolute bottom-[-1px] h-[34px] left-0 w-[375px]" data-name="Native / Home Indicator">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 375 34">
        <g id="Native / Home Indicator">
          <path clipRule="evenodd" d={svgPaths.p2a4e3500} fill="var(--fill-0, #04070E)" fillRule="evenodd" id="rectangle" />
        </g>
      </svg>
    </div>
  );
}

export default function IPhone() {
  return (
    <div className="bg-gradient-to-b from-[#ffffff] relative size-full to-[#e9f6e9]" data-name="iPhone 16 - 1">
      <Frame4 />
      <NativeStatusBar />
      <NativeHomeIndicator />
    </div>
  );
}