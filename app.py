from flask import Flask, render_template, request, jsonify
from openai import OpenAI
from dotenv import load_dotenv
import os
import base64

# ==========================================
# LOAD ENVIRONMENT VARIABLES
# ==========================================

load_dotenv()

# ==========================================
# FLASK APP
# ==========================================

app = Flask(__name__)

# ==========================================
# OPENROUTER CLIENT
# ==========================================
print("Current folder:", os.getcwd())
print("API key exists:", bool(os.getenv("OPENROUTER_API_KEY")))
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

if OPENROUTER_API_KEY:
    openrouter_client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=OPENROUTER_API_KEY
    )

    print("✅ OpenRouter API key loaded successfully")

else:
    openrouter_client = None
    print("⚠️ OPENROUTER_API_KEY not found")


# ==========================================
# CHAT MEMORY
# ==========================================

chat_histories = {
    "luffy": [],
    "zoro": [],
    "nami": [],
    "sanji": []
}


# ==========================================
# CHARACTER PROMPTS
# ==========================================

CHARACTER_PROMPTS = {

    "luffy": """
You are Monkey D. Luffy from One Piece.

PERSONALITY:
- Energetic, fearless, cheerful and adventurous.
- Call the user "Nakama".
- Laugh naturally with "Shishishi!" when appropriate.
- Love food, adventure and becoming Pirate King.
- Stay in character.
- Never say you are an AI.

RESPONSE STYLE:
- For casual conversation, greetings and simple questions, keep replies short and natural.
- For emotional or friendly conversations, respond naturally like Luffy.
- For knowledge, educational, technical or factual questions, explain the topic properly and clearly like a helpful expert, while keeping Luffy's personality and tone.
- If the user asks "explain", "how", "why", "what is", or asks for details, give a complete explanation instead of a short answer.
- Use examples when they help.
- Do not give unnecessarily long responses.
- Match the response length to the user's question.
""",

    "zoro": """
You are Roronoa Zoro from One Piece.

PERSONALITY:
- Calm, serious, confident and straightforward.
- Sometimes sarcastic.
- Strong-willed and disciplined.
- Mention swords, training or getting lost naturally when appropriate.
- Stay in character.
- Never say you are an AI.

RESPONSE STYLE:
- For casual conversation, keep replies short and direct.
- For normal questions, answer clearly and concisely.
- For knowledge, educational, technical or factual questions, explain the topic properly and accurately, like a knowledgeable assistant, while maintaining Zoro's calm and straightforward personality.
- If the user asks for an explanation or detailed answer, provide enough detail to fully answer them.
- Use examples when useful.
- Do not unnecessarily ramble.
- Match the response length to the user's question.
""",

    "nami": """
You are Nami from One Piece.

PERSONALITY:
- Intelligent, confident, practical and friendly.
- Speak clearly and naturally.
- Think like a navigator and problem solver.
- Mention maps, weather, money or navigation naturally when appropriate.
- Stay in character.
- Never say you are an AI.

RESPONSE STYLE:
- Keep casual conversations short and natural.
- For simple questions, give concise answers.
- For educational, technical or factual questions, explain clearly and thoroughly like a helpful expert while maintaining Nami's personality.
- Break complicated concepts into easy-to-understand parts.
- Use examples when useful.
- If the user asks for detail, provide a detailed explanation.
- Match the response length to the user's question.
""",

    "sanji": """
You are Vinsmoke Sanji from One Piece.

PERSONALITY:
- Gentleman, elegant, respectful, confident and helpful.
- Passionate about cooking and the Straw Hat crew.
- Speak naturally and politely.
- Stay in character.
- Never say you are an AI.

RESPONSE STYLE:
- For casual conversation, keep replies short and natural.
- For simple questions, answer concisely.
- For educational, technical or factual questions, provide a clear and complete explanation like a helpful expert while maintaining Sanji's personality.
- Explain difficult concepts in an easy-to-understand way.
- Use examples when useful.
- If the user asks for detail, explain thoroughly.
- Match the response length to the user's question.
"""
}


# ==========================================
# HOME PAGE
# ==========================================

@app.route("/")
def home():
    return render_template("index.html")


# ==========================================
# CHARACTER CHAT PAGE
# ==========================================
@app.route("/chat/<character>")
def chat_page(character):
    character = character.lower()

    if character not in CHARACTER_PROMPTS:
        return "Character not found", 404

    return render_template(
        "chat.html",
        character=character
    )

@app.route("/api/chat", methods=["POST"])
def chat():
    print("🔥 CHAT REQUEST RECEIVED")

    if openrouter_client is None:
        return jsonify({
            "reply": "⚠️ OpenRouter API key missing."
        }), 500

    try:
        # -------------------------
        # TEXT
        # -------------------------
        user_message = request.form.get("message", "").strip()

        # -------------------------
        # CHARACTER
        # -------------------------
        character = request.form.get(
            "character",
            "luffy"
        ).lower()

        if character not in CHARACTER_PROMPTS:
            character = "luffy"

        # -------------------------
        # FILE
        # --------------------------
        uploaded_file = request.files.get("file")

        print("📝 MESSAGE:", user_message)
        print("📎 FILE:", uploaded_file.filename if uploaded_file else "NO FILE")

        # -------------------------
        # BASE MESSAGE
        # -------------------------
        messages = [
            {
                "role": "system",
                "content": CHARACTER_PROMPTS[character]
            }
        ]

        # Previous chat history
        messages.extend(chat_histories[character])

        # -------------------------
        # IMAGE MESSAGE
        # -------------------------
        if uploaded_file and uploaded_file.filename:

            file_type = uploaded_file.content_type or ""

            print("📂 FILE TYPE:", file_type)

            if file_type.startswith("image/"):

                image_bytes = uploaded_file.read()

                base64_image = base64.b64encode(
                    image_bytes
                ).decode("utf-8")

                image_data_url = (
                    f"data:{file_type};base64,{base64_image}"
                )

                content = [
                    {
                        "type": "text",
                        "text": user_message
                        if user_message
                        else "Explain this image."
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": image_data_url
                        }
                    }
                ]

                messages.append({
                    "role": "user",
                    "content": content
                })

            else:

                # Normal text/file case
                messages.append({
                    "role": "user",
                    "content": user_message
                })

        else:

            # -------------------------
            # NORMAL TEXT MESSAGE
            # -------------------------
            messages.append({
                "role": "user",
                "content": user_message
            })
      


        # -------------------------
        # OPENROUTER
        # -------------------------
        print("🚀 Sending request to OpenRouter...")

        response = openrouter_client.chat.completions.create(
            model="openrouter/free",
            messages=messages,
            max_tokens=500
        )

        reply = response.choices[0].message.content

        print("✅ AI RESPONSE:", reply)

        # -------------------------
        # SAVE HISTORY
        # -------------------------
        chat_histories[character].append({
            "role": "user",
            "content": user_message
        })

        chat_histories[character].append({
            "role": "assistant",
            "content": reply
        })

        return jsonify({
            "reply": reply
        })

    except Exception as e:

        print("🔥 OPENROUTER ERROR:")
        print(repr(e))

        return jsonify({
            "reply": f"⚠️ Error: {str(e)}"
        }), 500

# ==========================================
# TEST OPENROUTER
# ==========================================

@app.route("/test-ai")
def test_ai():

    if openrouter_client is None:
        return jsonify({
            "error": "OpenRouter client is None. API key load nahi hui."
        }), 500

    try:
        response = openrouter_client.chat.completions.create(
            model="liquid/lfm-2.5-2.6b:free",
            messages=[
                {
                    "role": "user",
                    "content": "Say hello in one short sentence."
                }
            ],
            max_tokens=100
        )

        return jsonify({
            "success": True,
            "response": response.choices[0].message.content
        })

    except Exception as e:

        print("🔥 OPENROUTER ERROR:")
        print(repr(e))

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# ==========================================
# RUN FLASK
# ==========================================

if __name__ == "__main__":
    app.run(debug=True)