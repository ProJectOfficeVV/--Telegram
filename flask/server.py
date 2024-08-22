#!/usr/bin/env python
import os, json, time
from flask import Flask, render_template, request, url_for
import threading, requests
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler
from parser import parse_user_fields, build_team_tg_text

json_url = os.path.join(
    os.path.realpath(os.path.dirname(__file__)), 
    'static', 
    'groups.json'
)
data = json.load(open(json_url))

global GROUPS
GROUPS = data["groups"]
global TOKEN
TOKEN = os.environ.get("TOKEN")
global GROUP_ID
GROUP_ID = os.environ.get("GROUP_ID")
global URL
URL = os.environ.get("URL")

def main():
    try:
        application = ApplicationBuilder().token(TOKEN).build()
        start_handler = CommandHandler('start', start)
        application.add_handler(start_handler)
        application.run_polling()
    except:
        time.sleep(5)
        main()

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    chat_id = update.message.chat.id
    keyboard = [
        [InlineKeyboardButton("Создать заявку", url=f"{URL}/{chat_id}")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(
        "Привет👋\n\nДавай знакомиться - я VVLegalBot, вместе с коллегами буду помогать автоматизировать процессы выполнения задач во ВкусВилл.\n\nЯ помогу тебе выбрать к кому обратиться за помощью😉\n\nЧтобы продолжить общение, открой форму заявки по кнопке «Создать заявку» под сообщением",
        reply_markup=reply_markup
    )

class FlaskThread(threading.Thread):
    def run(self) -> None:
        app = Flask(__name__, static_url_path='/static')
        
        @app.route('/<chat_id>', methods=['GET', 'POST'])
        def form(chat_id):
            if request.method == 'POST':
                print(request.form)
                user_fields = parse_user_fields(request.form, GROUPS)
                if user_fields["text"] != "":
                    message_json = {
                        "chat_id": chat_id,
                        "parse_mode": "markdown",
                        "text": user_fields['text'],
                        "reply_markup": {
                            "inline_keyboard": [[{ "text": 'Создать новую заявку', "url": f"{URL}/{chat_id}" }]],
                        },
                    }
                    url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
                    res = requests.post(url, json=message_json).json() # this sends the message
                    group_message = build_team_tg_text(user_fields, res["result"]["chat"]["username"])
                    url_group = f"https://api.telegram.org/bot{TOKEN}/sendMessage?chat_id={GROUP_ID}&text={group_message}"
                    print(requests.get(url_group).json())

                return render_template('form.html', chat_id=chat_id, thank_you_page=True, order_json=user_fields["order_json"], ensure_ascii=False)
            else:
                return render_template('form.html', chat_id=chat_id, groups_json=url_for('static', filename='groups.json'), order_json={"main":True})

        app.run(host="0.0.0.0", port=9091, threaded=True)

class TelegramThread(threading.Thread):
    def run(self) -> None:
        main()

if __name__ == "__main__":
    flask_thread = FlaskThread()
    flask_thread.daemon = True
    flask_thread.start()

    main()