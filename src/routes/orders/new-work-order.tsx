import { createFileRoute } from "@tanstack/react-router";
import MyImg from "../../assets/image.png";

export const Route = createFileRoute("/orders/new-work-order")({
  component: newWorkOrder,
});

function newWorkOrder() {
  return (
    <div>
      <CustomerDemographics />
      <div className="border-b min-w-screen" />
      <CustomerMeasurements />
    </div>
  );
}

function CustomerMeasurements() {
  return (
    <div className="min-h-screen p-6 bg-gray-50 flex flex-col">
      {/* Header */}
      <h1 className="text-2xl font-bold text-green-500 mb-6">
        Customer Measurement
      </h1>

      {/* Top controls */}
      <div className="flex items-center mb-6 gap-6">
        <div className="flex flex-row gap-8 justify-around bg-gray-300 px-20 py-10 rounded-xl">
          <div className="p-4 bg-white flex flex-col w-64 rounded-lg">
            <label className="font-semibold">Measurement Type</label>
            <select className="rounded border p-2 bg-white">
              <option>Body / Dishdasha</option>
            </select>
          </div>
          <div className="flex flex-col p-4 bg-white w-64 rounded-lg">
            <label className="font-semibold">Measurement ID</label>
            <select className="rounded border p-2 bg-white">
              <option>894-02</option>
              <option>894-01</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex flex-col gap-4">
            <button className="bg-black text-white px-4 py-2 rounded-lg">
              Save Current Measurement
            </button>
            <button className="bg-black text-white px-4 py-2 rounded-lg">
              Edit Existing
            </button>
          </div>
          <button className="bg-black text-white px-4 py-2 rounded-lg">
            New Measurement
          </button>
        </div>
      </div>
      <div className="flex flex-row justify-start items-baseline">
        <div className=" flex flex-col gap-8 mt-6 bg-gray-200 p-4 rounded-xl w-62">
          <div className="bg-white p-2">
            <label className="font-semibold">Fabric Reference No.</label>
            <ul className="mt-2 space-y-1 text-sm">
              <li>000123-1</li>
              <li>000123-2</li>
              <li>000123-3</li>
            </ul>
          </div>
          <div>
            <label className="font-semibold">Notes and Special requests</label>
            <textarea
              rows={10}
              placeholder={"Customer special request and notes"}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical transition duration-200"
            />
          </div>
        </div>
        <img src={MyImg} className="m-10 h-auto w-auto" />
      </div>
    </div>
  );
}
// src/components/CustomerDemographics.tsx
export function CustomerDemographics() {
  return (
    <form className="max-w-4xl mx-auto space-y-6 py-6 rounded-md">
      <h1 className="text-2xl font-bold text-green-500 underline mb-4">
        Customer Demographics
      </h1>

      {/* Customer Type with Search Button */}
      <div className="flex flex-row justify-between items-center">
        <section className="bg-gray-300 rounded-xl p-4 flex items-center gap-6">
          <div className="w-48">
            <label className="block font-semibold mb-2">Customer Type</label>
            <select className="w-full rounded border border-gray-400 p-2 bg-white">
              <option>New / Existing</option>
            </select>
          </div>
        </section>

        <button className="bg-black text-white px-6 py-2 rounded-lg">
          Search Customer Info.
        </button>
      </div>

      {/* Search Customer Inputs */}
      <section className="bg-gray-300 rounded-xl p-4 border-b border-gray-400 flex gap-4">
        <input
          type="text"
          placeholder="Mobile Number"
          className="flex-1 rounded border border-gray-400 px-2 py-1 bg-white"
        />
        <input
          type="text"
          placeholder="Order Number"
          className="flex-1 rounded border border-gray-400 px-2 py-1 bg-white"
        />
        <select className="w-48 rounded border border-gray-400 px-2 py-1 bg-white">
          <option>Customer ID</option>
        </select>
      </section>

      {/* Name Section */}
      <section className="bg-gray-300 rounded-xl p-4">
        <label className="font-bold mr-3">*Name</label>
        <input
          type="text"
          placeholder="Customer Full Name"
          className="w-full rounded border border-gray-400 px-2 py-1 bg-white"
        />
      </section>

      {/* Nickname and Mobile Number Section */}
      <section className="bg-gray-300 rounded-xl p-4 flex flex-wrap gap-6">
        {/* Nick Name */}
        <div className="flex-1 min-w-[200px]">
          <label className="font-semibold mr-2 block mb-1">Nick Name</label>
          <input
            type="text"
            placeholder="Nick Name"
            className="w-full rounded border border-gray-400 px-2 py-1 bg-white"
          />
        </div>

        {/* Mobile No */}
        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="font-bold block">*Mobile No</label>
          <div className="flex gap-2">
            <select className="w-28 rounded border border-gray-400 px-2 py-1 bg-white">
              <option>Country Code</option>
            </select>
            <input
              type="text"
              placeholder="Mobile Number"
              className="flex-1 rounded border border-gray-400 px-2 py-1 bg-white"
            />
          </div>
        </div>
      </section>

      {/* WhatsApp and Influencer Section */}
      <section className="bg-gray-300 rounded-xl p-4 flex flex-wrap gap-6 items-center">
        {/* WhatsApp */}
        <div className="flex items-center gap-2 bg-white p-2 rounded shadow">
          <img
            alt="WhatsApp"
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            className="w-5 h-5"
          />
          <label>
            <input type="checkbox" /> WhatsApp
          </label>
        </div>

        {/* Influencer */}
        <div className="flex items-center gap-2">
          <label className="font-semibold">Influencer</label>
          <input type="checkbox" />
          <input
            type="text"
            placeholder="Insta ID"
            className="rounded border border-gray-400 px-2 py-1 bg-white"
          />
        </div>
      </section>

      {/* Email Section */}
      <section className="bg-gray-300 rounded-xl p-4">
        <label className="font-semibold mr-2">E-mail</label>
        <input
          type="email"
          placeholder="Customer Email ID"
          className="w-full rounded border border-gray-400 px-2 py-1 bg-white"
        />
      </section>

      {/* Customer Type & Nationality */}
      <section className="bg-gray-300 rounded-xl p-4 flex flex-wrap gap-6">
        <div className="flex-1 min-w-[200px]">
          <label className="block font-semibold mb-1">Customer Type</label>
          <select className="w-full rounded border border-gray-400 px-2 py-1 bg-white">
            <option>Regular / VIP</option>
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block font-semibold mb-1">
            Customer Nationality
          </label>
          <select className="w-full rounded border border-gray-400 px-2 py-1 bg-white">
            <option>Kuwaiti</option>
            <option>Saudi</option>
            <option>Bahraini</option>
            <option>Qatari</option>
            <option>Emirati</option>
          </select>
        </div>
      </section>

      {/* Address Section */}
      <section className="bg-gray-300 rounded-xl p-4 ">
        <h1 className="text-lg font-semibold">Address</h1>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-1">Governorate</label>
            <input className="w-full rounded border border-gray-400 px-2 py-1 mb-2 bg-white" />
            <label className="block mb-1">Block</label>
            <input className="w-full rounded border border-gray-400 px-2 py-1 mb-2 bg-white" />
            <label className="block mb-1">Street</label>
            <input className="w-full rounded border border-gray-400 px-2 py-1 mb-2 bg-white" />
            <label className="block mb-1">House / Building no.</label>
            <input className="w-full rounded border border-gray-400 px-2 py-1 bg-white" />
          </div>

          <div>
            <label className="block mb-1">Floor</label>
            <input className="w-full rounded border border-gray-400 px-2 py-1 mb-2 bg-white" />
            <label className="block mb-1">Apt. No</label>
            <input className="w-full rounded border border-gray-400 px-2 py-1 mb-2 bg-white" />
            <label className="block mb-1">Landmark</label>
            <input className="w-full rounded border border-gray-400 px-2 py-1 mb-2 bg-white" />
            <label className="block mb-1">DOB</label>
            <input
              type="date"
              className="w-full rounded border border-gray-400 px-2 py-1 bg-white"
            />
          </div>
        </div>
      </section>

      {/* Buttons Section */}
      <section className="flex gap-6 justify-center">
        <button
          type="button"
          className="bg-black text-white px-6 py-2 rounded flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M17 12a1 1 0 100 2H7a1 1 0 110-2h10z" />
            <path d="M7 5a1 1 0 100 2h10a1 1 0 100-2H7z" />
          </svg>
          Save Draft
        </button>
        <button
          type="button"
          className="bg-gray-400 text-black px-6 py-2 rounded flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 20h9" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Edit
        </button>
        <button type="submit" className="bg-black text-white px-6 py-2 rounded">
          Save
        </button>
      </section>
    </form>
  );
}
