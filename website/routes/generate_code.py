from flask import (
    Blueprint, 
    render_template, 
    request, 
    jsonify,
    Response,
    session
)

from website import db
from website.models.chat_model import ChatHistory
from website.ai_api.openai import client

from pytz import timezone
from datetime import time,datetime

from website.models.chat_model import ChatHistory

manila_tz = timezone('Asia/Manila')


# Route name
generate_code = Blueprint('generate_code', __name__)

# Display the main page
@generate_code.route('/', methods=['GET'])  # ✅ Single route
@generate_code.route('/generate_html_page', methods=['GET'])  # ✅ Additional route
def generate_html_page():
    return render_template('/html/generate_code.html')

#sent prompt to ai
@generate_code.route("/generate_html/<string:prompt>")
def generate_html(prompt):
    try:
        if not prompt:
            return Response("Invalid input", status=400)
        
        rule_chat = f"Only respond the whole HTML or full HTML, JavaScript, and CSS for the user's request: ['{prompt}']. Always use Bootstrap and don't explain anything just give the raw code."

        stream = client.chat.completions.create(
            model="IONGPT",
            messages=[{"role": "user", "content": rule_chat}],
            stream=True,
        )

        def stream_response():
            for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield f"data: {chunk.choices[0].delta.content}\n\n"

        return Response(stream_response(), content_type="text/event-stream")
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    