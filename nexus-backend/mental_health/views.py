from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
import os
import google.generativeai as genai
import openai
from dotenv import load_dotenv
from openai import OpenAI

dotenv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env.example')
load_dotenv(dotenv_path=dotenv_path, override=True)


print("\n[ENV] Loaded environment variables:")
for key, value in os.environ.items():
    if "KEY" in key or "TOKEN" in key:
        print(f"{key} = {value[:6]}...")  # Mask sensitive values

print("[ENV CHECK] GOOGLE_API_KEY:", os.getenv("GOOGLE_API_KEY"))
print("[ENV CHECK] OPENAI_API_KEY:", os.getenv("OPENAI_API_KEY"))


# ========= GOOGLE GEMINI CHAT VIEW =========

class ChatGeminiView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        message = request.data.get("message")

        google_api_key = os.getenv("GOOGLE_API_KEY")
        print("\n[Gemini] Request received")
        print(f"[Gemini] API Key Used: {google_api_key}")
        print(f"[Gemini] Payload: {message}")

        if not google_api_key:
            return JsonResponse({"error": "Missing GOOGLE_API_KEY in environment"}, status=500)
        if not message:
            return JsonResponse({"error": "Message is required"}, status=400)

        genai.configure(api_key=google_api_key)

        try:
            try:
                model = genai.GenerativeModel("models/gemini-1.5-flash")
            except Exception as e:
                print("[Gemini] Failed to use flash, trying 1.5-pro")
                model = genai.GenerativeModel("models/gemini-1.5-pro")

            prompt = self.build_prompt(message)
            response = model.generate_content(prompt)
            return JsonResponse({"response": response.text})
        except Exception as e:
            print(f"[Gemini] Error: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500)

    def build_prompt(self, message):
        return (
            "You are Nexus AI, a thoughtful assistant for actuarial students, offering both technical guidance and emotional support. "
            "Always begin by identifying the nature of the input:\n"
            "- If it is a greeting (e.g., 'hello', 'hi', 'howdy'), respond warmly and conversationally.\n"
            "- If it shows signs of stress, anxiety, or emotional distress (e.g., 'overwhelmed', 'anxious', 'burned out'), offer a short, empathetic response with a practical well-being suggestion.\n"
            "- If it is a technical query related to actuarial science (e.g., IFRS 17, cash flow modeling, risk adjustment), respond with a detailed, well-documented Python script or explanation suitable for actuarial students. Include relevant calculations, visualizations, and clear comments.\n"
            "Avoid over-analyzing simple or polite inputs. Format responses in Markdown for clarity.\n\n"
            f"User input: {message}"
        )


# ========= OPENAI CHAT VIEW (BACKUP OR PRIMARY) =========

class ChatOpenAIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        message = request.data.get("message")

        openai_api_key = os.getenv("OPENAI_API_KEY")
        print("\n[OpenAI] Request received")
        print(f"[OpenAI] API Key Used: {os.getenv("OPENAI_API_KEY")}")
        print(f"[OpenAI] Payload: {message}")

        if not openai_api_key:
            return JsonResponse({"error": "Missing OPENAI_API_KEY in environment"}, status=500)
        if not message:
            return JsonResponse({"error": "Message is required"}, status=400)

        try:
            openai.api_key = openai_api_key
            prompt = self.build_prompt(message)

            client = OpenAI(api_key=openai_api_key)
            completion = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
            )
            reply = completion.choices[0].message.content
            return JsonResponse({"response": reply})
        except Exception as e:
            print(f"[OpenAI] Error: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500)

    def build_prompt(self, message):
        return (
            "You are Nexus AI, a thoughtful assistant for actuarial students, offering both technical guidance and emotional support. "
            "Always begin by identifying the nature of the input:\n"
            "- If it is a greeting (e.g., 'hello', 'hi', 'howdy'), respond warmly and conversationally.\n"
            "- If it shows signs of stress, anxiety, or emotional distress (e.g., 'overwhelmed', 'anxious', 'burned out'), offer a short, empathetic response with a practical well-being suggestion.\n"
            "- If it is a technical query related to actuarial science (e.g., IFRS 17, cash flow modeling, risk adjustment), respond with a detailed, well-documented Python script or explanation suitable for actuarial students. Include relevant calculations, visualizations, and clear comments.\n"
            "Avoid over-analyzing simple or polite inputs. Format responses in Markdown for clarity.\n\n"
            f"User input: {message}"
        )

