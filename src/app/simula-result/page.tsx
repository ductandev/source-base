"use client";

import { useState } from "react";
import { ArrowLeft, Bell, MapPin, ChevronDown, ChevronRight, Cloud } from "lucide-react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Slider from "@radix-ui/react-slider";
import { useRouter } from "next/navigation";

// ------------------- MAIN COMPONENT -------------------
export default function DisasterScreen() {
  const [selected, setSelected] = useState("flood");
  const [rainfall, setRainfall] = useState([0]);
  const [duration, setDuration] = useState([0]);

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Mobile */}
      <div className="lg:hidden">
        <MobileLayout
          selected={selected}
          setSelected={setSelected}
          rainfall={rainfall}
          setRainfall={setRainfall}
          duration={duration}
          setDuration={setDuration}
        />
      </div>

      {/* Desktop */}
      <div className="hidden lg:block">
        <DesktopLayout
          selected={selected}
          setSelected={setSelected}
          rainfall={rainfall}
          setRainfall={setRainfall}
          duration={duration}
          setDuration={setDuration}
        />
      </div>
    </div>
  );
}

// ------------------- MOBILE -------------------
function MobileLayout({
  selected,
  setSelected,
  rainfall,
  setRainfall,
  duration,
  setDuration,
}: any) {
  return (
    <div className="relative min-h-screen bg-neutral-100 pb-[106px]">
      {/* Top Bar */}
      <div className="px-5 pt-4 pb-3 flex items-center gap-4 bg-white shadow-sm">
        <button className="p-2 rounded-full hover:bg-gray-100 transition">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Simulation Result</h1>
      </div>

      {/* Content */}
      <main className="px-5 py-6 space-y-6">
        <DisasterControls
          selected={selected}
          setSelected={setSelected}
          rainfall={rainfall}
          setRainfall={setRainfall}
          duration={duration}
          setDuration={setDuration}
        />
      </main>
    </div>
  );
}

// ------------------- DESKTOP -------------------
function DesktopLayout({
  selected,
  setSelected,
  rainfall,
  setRainfall,
  duration,
  setDuration,
}: any) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* ---------------- HEADER GIỮ NGUYÊN ---------------- */}
      <header className="bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl text-neutral-900 flex items-center gap-2">
                <Cloud className="size-7 text-[#2B7FFF]" />
                 Weather App
              </h1>
              <nav className="flex items-center gap-6">
                <a
                  href="./home"
                  className="text-sm text-neutral-900 hover:text-[#2B7FFF] transition-colors"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="text-sm text-neutral-600 hover:text-[#2B7FFF] transition-colors"
                >
                  What If
                </a>
                <a
                  href="./simula-result"
                  className="text-sm text-neutral-600 hover:text-[#2B7FFF] transition-colors"
                >
                  Simulation
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-neutral-50 rounded-lg cursor-pointer hover:bg-neutral-100 transition-colors">
                <MapPin className="size-5 text-[#2B7FFF]" />
                <span className="text-sm text-[#101828]">Your Location</span>
                <ChevronDown className="size-4 text-[#4A5565]" />
              </div>
              <div className="relative">
                <button className="size-10 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors">
                  <Bell className="size-5 text-[#364153]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Controls */}
          <div className="xl:col-span-2 space-y-6">
            <DisasterControls
              selected={selected}
              setSelected={setSelected}
              rainfall={rainfall}
              setRainfall={setRainfall}
              duration={duration}
              setDuration={setDuration}
            />
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg text-neutral-900 font-semibold mb-4">
                Simulation Summary
              </h3>
              <p className="text-neutral-700 text-sm">
                Selected Disaster: {selected.charAt(0).toUpperCase() + selected.slice(1)}
              </p>
              <p className="text-neutral-700 text-sm">Rainfall: {rainfall[0]} mm/hr</p>
              <p className="text-neutral-700 text-sm">Duration: {duration[0]} hours</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ------------------- SHARED CONTROLS -------------------
function DisasterControls({
  selected,
  setSelected,
  rainfall,
  setRainfall,
  duration,
  setDuration,
}: any) {
  const disasterOptions = [
    { id: "flood", label: "Flood" },
    { id: "earthquake", label: "Earthquake" },
    { id: "hurricane", label: "Hurricane" },
    { id: "wildfire", label: "Wildfire" },
  ];
const router = useRouter();
  return (
    <div className="space-y-6">
      {/* Disaster Type */}
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-gray-800">Choose a Disaster Type</h2>
        <p className="text-gray-500 text-sm">
          Select the disaster type you want to simulate.
        </p>
      </div>

      <RadioGroup.Root
        value={selected}
        onValueChange={setSelected}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {disasterOptions.map((item) => (
          <label
            key={item.id}
            className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition
              ${selected === item.id ? "border-green-500 bg-green-50" : "border-gray-300 hover:bg-gray-100"}`}
          >
            <span className="text-sm text-gray-800">{item.label}</span>
            <RadioGroup.Item
              value={item.id}
              className={`w-5 h-5 rounded-full border flex items-center justify-center
                ${selected === item.id ? "border-green-500" : "border-gray-300"}`}
            >
              <RadioGroup.Indicator className="w-3 h-3 bg-green-500 rounded-full" />
            </RadioGroup.Item>
          </label>
        ))}
      </RadioGroup.Root>

      <hr className="border-gray-200" />

      {/* Sliders */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-gray-800">Adjust Parameters</h2>

        <div className="bg-gray-50 rounded-xl p-4 space-y-6 lg:flex lg:gap-6 lg:space-y-0">
          {/* Rainfall */}
          <div className="space-y-2 flex-1">
            <div className="flex justify-between text-sm text-gray-700">
              <span>Rainfall Intensity</span>
              <span className="font-medium">{rainfall[0]} mm/hr</span>
            </div>
            <Slider.Root
              value={rainfall}
              onValueChange={setRainfall}
              min={0}
              max={100}
              step={1}
              className="relative flex w-full h-6 items-center"
            >
              <Slider.Track className="bg-green-200 relative h-2 w-full rounded-full" />
              <Slider.Range className="absolute h-2 bg-green-500 rounded-full" />
              <Slider.Thumb className="block w-5 h-5 bg-white border border-green-600 rounded-full shadow hover:scale-110 transition-transform" />
            </Slider.Root>
          </div>

          {/* Duration */}
          <div className="space-y-2 flex-1">
            <div className="flex justify-between text-sm text-gray-700">
              <span>Duration</span>
              <span className="font-medium">{duration[0]} hours</span>
            </div>
            <Slider.Root
              value={duration}
              onValueChange={setDuration}
              min={0}
              max={24}
              step={1}
              className="relative flex w-full h-6 items-center"
            >
              <Slider.Track className="bg-green-200 relative h-2 w-full rounded-full" />
              <Slider.Range className="absolute h-2 bg-green-500 rounded-full" />
              <Slider.Thumb className="block w-5 h-5 bg-white border border-green-600 rounded-full shadow hover:scale-110 transition-transform" />
            </Slider.Root>
          </div>
        </div>
      </div>

      <button onClick={() => router.push('./simula-result/result')} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition">
        Run Simulation
      </button>
    </div>
  );
}
