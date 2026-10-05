import json
from openai import OpenAI
from tools import (search_slots, book_appointment, lookup_patient, 
                   reschedule_appointment, cancel_appointment, escalate_to_human)

client = OpenAI()

SYSTEM_PROMPT = """You are Sunrise Clinic's front desk AI.
CRITICAL RULES:
1. CLINICAL URGENT: If a caller mentions physical symptoms (e.g., pain, bleeding, fever), instantly call `escalate_to_human` with reason 'clinical_urgent' and halt.
2. NO GUESSING: If multiple patients match a name, ask for clarification. Do not pick one randomly.
3. INVENTIONS: Never invent slots. Use `search_slots`.
4. AUTHORISATION: Verify identity before canceling/booking for adults."""

TOOLS = [
    {"type": "function", "function": {"name": "search_slots", "parameters": {"type": "object", "properties": {"doctor_id": {"type": "string"}, "date": {"type": "string"}, "window": {"type": "string", "enum": ["morning", "evening"]}}, "required": ["doctor_id", "date", "window"]}}},
    {"type": "function", "function": {"name": "book_appointment", "parameters": {"type": "object", "properties": {"patient_id": {"type": "string"}, "doctor_id": {"type": "string"}, "date": {"type": "string"}, "time": {"type": "string"}}, "required": ["patient_id", "doctor_id", "date", "time"]}}},
    {"type": "function", "function": {"name": "lookup_patient", "parameters": {"type": "object", "properties": {"name_query": {"type": "string"}}, "required": ["name_query"]}}},
    {"type": "function", "function": {"name": "cancel_appointment", "parameters": {"type": "object", "properties": {"appointment_id": {"type": "string"}, "patient_id": {"type": "string"}}, "required": ["appointment_id", "patient_id"]}}},
    {"type": "function", "function": {"name": "reschedule_appointment", "parameters": {"type": "object", "properties": {"appointment_id": {"type": "string"}, "new_date": {"type": "string"}, "new_time": {"type": "string"}}, "required": ["appointment_id", "new_date", "new_time"]}}},
    {"type": "function", "function": {"name": "escalate_to_human", "parameters": {"type": "object", "properties": {"reason": {"type": "string", "enum": ["clinical_urgent", "ambiguous_patient", "not_authorised", "medical_advice"]}, "detail": {"type": "string"}}, "required": ["reason", "detail"]}}}
]

def process_conversation(messages: list) -> dict:
    msgs = [{"role": "system", "content": SYSTEM_PROMPT}] + messages
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=msgs,
        tools=TOOLS,
        tool_choice="auto",
        temperature=0.0
    )
    
    message = response.choices[0].message
    
    if message.tool_calls:
        for tool_call in message.tool_calls:
            args = json.loads(tool_call.function.arguments)
            func_name = tool_call.function.name
            
            # Map LLM request to Python function
            tool_map = {
                "search_slots": search_slots,
                "book_appointment": book_appointment,
                "lookup_patient": lookup_patient,
                "cancel_appointment": cancel_appointment,
                "reschedule_appointment": reschedule_appointment,
                "escalate_to_human": escalate_to_human
            }
            
            if func_name in tool_map:
                result = tool_map[func_name](**args)
                if result.get("status") == "escalated":
                    return result # Terminal state
                return {"status": "tool_executed", "data": result}
                
    return {"status": "active", "reply": message.content}