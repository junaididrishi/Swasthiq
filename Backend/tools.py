import json
import os
import threading
from typing import Dict, Any, List

DB_PATH = os.path.join(os.path.dirname(__file__), "clinic.json")

with open(DB_PATH, "r", encoding="utf-8") as f:
    db: Dict[str, Any] = json.load(f)

# Mutex lock ensuring atomic updates during concurrent booking/rescheduling operations
booking_lock = threading.Lock()

def search_slots(doctor_id: str, date: str, window: str) -> Dict[str, Any]:
    doctor = next((d for d in db.get("doctors", []) if d["id"] == doctor_id), None)
    if not doctor:
        return {"status": "error", "message": f"Doctor '{doctor_id}' not found."}

    morning_slots = ["09:00", "09:30", "10:15", "11:00", "11:45"]
    evening_slots = ["14:00", "14:45", "15:30", "16:15", "17:00"]
    candidate_slots = morning_slots if window.lower() == "morning" else evening_slots

    booked_times = {
        appt["time"] for appt in db.get("appointments", [])
        if appt["doctor_id"] == doctor_id and appt["date"] == date
    }

    available_slots = [s for s in candidate_slots if s not in booked_times]
    return {
        "status": "success",
        "doctor_id": doctor_id,
        "date": date,
        "window": window,
        "available_slots": available_slots
    }

def book_appointment(patient_id: str, doctor_id: str, date: str, time: str) -> Dict[str, Any]:
    with booking_lock:
        patient = next((p for p in db.get("patients", []) if p["id"] == patient_id), None)
        if not patient:
            return {"status": "error", "message": "Patient not found."}

        conflict = next(
            (a for a in db.get("appointments", [])
             if a["doctor_id"] == doctor_id and a["date"] == date and a["time"] == time),
            None
        )

        if conflict:
            return {"status": "error", "message": "Slot is already booked. Please search again."}

        new_appt = {
            "id": f"apt_{len(db.get('appointments', [])) + 101}",
            "patient_id": patient_id,
            "doctor_id": doctor_id,
            "date": date,
            "time": time
        }
        db.setdefault("appointments", []).append(new_appt)
        return {"status": "success", "appointment": new_appt}

def lookup_patient(name_query: str) -> Dict[str, Any]:
    candidates = [p for p in db.get("patients", []) if name_query.lower() in p["name"].lower()]
    if not candidates:
        return {"status": "error", "message": "No patient found."}
    if len(candidates) > 1:
        return {"status": "ambiguous", "candidates": candidates}
    return {"status": "success", "patient": candidates[0]}

def reschedule_appointment(appointment_id: str, new_date: str, new_time: str) -> Dict[str, Any]:
    with booking_lock:
        appt = next((a for a in db.get("appointments", []) if a["id"] == appointment_id), None)
        if not appt:
            return {"status": "error", "message": "Appointment not found."}
        
        conflict = next(
            (a for a in db.get("appointments", []) 
             if a["doctor_id"] == appt["doctor_id"] and a["date"] == new_date and a["time"] == new_time), 
            None
        )
        if conflict:
            return {"status": "error", "message": "New slot already booked."}
        
        appt["date"] = new_date
        appt["time"] = new_time
        return {"status": "success", "appointment": appt}

def cancel_appointment(appointment_id: str, patient_id: str) -> Dict[str, Any]:
    with booking_lock:
        appts = db.get("appointments", [])
        appt = next((a for a in appts if a["id"] == appointment_id), None)
        if not appt:
            return {"status": "error", "message": "Appointment not found."}
        if appt["patient_id"] != patient_id:
            return {"status": "error", "message": "Not authorised to cancel this appointment."}
        
        db["appointments"] = [a for a in appts if a["id"] != appointment_id]
        return {"status": "success", "message": "Appointment cancelled."}

def escalate_to_human(reason: str, detail: str) -> Dict[str, Any]:
    return {"status": "escalated", "reason": reason, "detail": detail}