import React from 'react';
import { Link } from 'react-router-dom';

export default function HandoffQueue() {
  const handoffs = [
    { id: 'cv_4471', said: '"Seene mein dard ho raha hai"', reason: 'CLINICAL', time: '11:42' },
    { id: 'cv_4468', said: 'Cancel for a different patient', reason: 'NOT AUTHORISED', time: '11:20' },
    { id: 'cv_4403', said: '"Sharma ji ke liye" — 3 matches', reason: 'AMBIGUOUS PATIENT', time: '10:57' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Handoff Queue</h1>
          <p className="text-gray-500 text-sm">Sunrise Clinic, Dehradun — escalated conversations</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3">Conversation</th>
              <th className="px-4 py-3">Caller Said</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {handoffs.map((h) => (
              <tr key={h.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-4"><Link className="text-blue-600 hover:underline" to="{`/conversation/${h.id}`}">{h.id}</Link></td>
                <td className="px-4 py-4 font-medium">{h.said}</td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${h.reason === 'CLINICAL' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {h.reason}
                  </span>
                </td>
                <td className="px-4 py-4 text-gray-500">{h.time}</td>
                <td className="px-4 py-4 text-right"><button className="bg-white border px-3 py-1 rounded">Resolve</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}