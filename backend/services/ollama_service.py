# =========================================
# services/ollama_service.py
# =========================================

import ollama
import json
import re


# =========================================
# CLEAN JSON RESPONSE
# =========================================

def clean_json_response(content: str):

    # Remove markdown blocks

    content = content.strip()

    content = re.sub(
        r"```json",
        "",
        content
    )

    content = re.sub(
        r"```",
        "",
        content
    )

    content = content.strip()

    # Extract JSON safely

    try:

        start = content.index("{")
        end = content.rindex("}") + 1

        content = content[start:end]

    except Exception:
        pass

    return content


# =========================================
# GENERATE OLLAMA RESPONSE
# =========================================

def generate_ollama_json(prompt: str):

    try:

        response = ollama.chat(

            model="llama3",

            messages=[

                {
                    "role": "system",

                    "content": """
You are an elite Indian AI nutritionist.

IMPORTANT RULES:

- Return ONLY valid JSON
- No markdown
- No explanation text
- No bullet points
- No extra text
- JSON must be parsable
"""
                },

                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        content = response["message"]["content"]

        print("\n=================================")
        print("RAW OLLAMA RESPONSE")
        print("=================================\n")
        print(content)

        cleaned = clean_json_response(content)

        return json.loads(cleaned)

    except Exception as e:

        print("\nOLLAMA ERROR:")
        print(e)

        return None