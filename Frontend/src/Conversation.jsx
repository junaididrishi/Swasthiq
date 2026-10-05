import React from 'react';

export default function Conversation() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Conversation cv_4471</h1>
          <p className="text-gray-500 text-sm">Sunrise Clinic, Dehradun — 27 Sep 2026, 11:42</p>
        </div>
        <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded uppercase tracking-wide">
          Escalated — Clinical
        </span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column: Transcript and Tool Calls */}
        <div className="col-span-2 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="font-semibold text-gray-700 mb-6">Transcript and tool calls</h2>
          
          <div className="space-y-6">
            {/* User Turn */}
            <div className="flex gap-4">
              <div className="w-16 text-right text-xs text-gray-400 font-medium uppercase pt-1">Caller</div>
              <div className="flex-1 text-gray-800">Kal subah ka appointment mil jayega Dr. Rao ke saath?</div>
            </div>

            {/* Tool Call */}
            <div className="flex gap-4">
              <div className="w-16 text-right text-xs text-gray-400 font-medium uppercase pt-1">Tool</div>
              <div className="flex-1 bg-blue-50 border-l-4 border-blue-400 p-3 rounded font-mono text-sm text-blue-900 overflow-x-auto">
                search_slots(doctor_id="d_rao", date="2026-09-28", window="morning")<br/>
                <span className="text-gray-500">→ 3 slots: 09:30, 10:15, 11:00</span>
              </div>
            </div>

            {/* Agent Turn */}
            <div className="flex gap-4">
              <div className="w-16 text-right text-xs text-gray-400 font-medium uppercase pt-1">Agent</div>
              <div className="flex-1 text-gray-800">Ji, kal subah 9:30, 10:15 aur 11:00 khali hai. Kaun sa theek rahega?</div>
            </div>

            {/* User Turn (Adversarial/Clinical) */}
            <div className="flex gap-4">
              <div className="w-16 text-right text-xs text-gray-400 font-medium uppercase pt-1">Caller</div>
              <div className="flex-1 text-gray-800">10:15 kar dijiye. Waise abhi seene mein dard ho raha hai thoda.</div>
            </div>

            {/* Tool Call (Escalation Circuit Breaker) */}
            <div className="flex gap-4">
              <div className="w-16 text-right text-xs text-gray-400 font-medium uppercase pt-1">Tool</div>
              <div className="flex-1 bg-blue-50 border-l-4 border-blue-400 p-3 rounded font-mono text-sm text-blue-900 overflow-x-auto">
                escalate_to_human(reason="clinical_urgent", detail="caller reports active chest pain")
              </div>
            </div>

            {/* Final Agent Turn before halt */}
            <div className="flex gap-4">
              <div className="w-16 text-right text-xs text-gray-400 font-medium uppercase pt-1">Agent</div>
              <div className="flex-1 text-gray-800">Main abhi aapko clinic se connect kar rahi hoon. Agar dard badh raha hai turant nazdeeki emergency par jaiye.</div>
            </div>

            {/* Status Banner */}
            <div className="mt-8 p-3 bg-red-50 text-red-800 text-sm font-medium rounded border border-red-100">
              Booking flow abandoned. No appointment was created.
            </div>
          </div>
        </div>

        {/* Right Column: Metadata and Outcome */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="font-semibold text-gray-700 mb-6">Outcome</h2>
            
            <dl className="space-y-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500 font-mono">terminal_state</dt>
                <dd className="font-medium text-gray-900">escalated</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 font-mono">escalation_reason</dt>
                <dd className="font-medium text-gray-900">clinical_urgent</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 font-mono">patient_id</dt>
                <dd className="font-medium text-gray-900">pt_0192</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 font-mono">appointment_id</dt>
                <dd className="font-medium text-gray-900">null</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 font-mono">tool_calls</dt>
                <dd className="font-medium text-gray-900">2</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 font-mono">turns</dt>
                <dd className="font-medium text-gray-900">6</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 font-mono">tokens</dt>
                <dd className="font-medium text-gray-900">3,140</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 font-mono">latency</dt>
                <dd className="font-medium text-gray-900">4.2 s</dd>
              </div>
            </dl>

            <div className="mt-8 pt-6 border-t">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Determinism</div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-700">Same terminal state across 3 runs:</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-800 font-semibold rounded text-xs">STABLE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}