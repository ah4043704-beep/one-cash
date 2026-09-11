import requests
import time

BOT_TOKEN = "8648561705:AAEpX7xIfOryx2eu3A2tZpS0r9RF17llwGM"
BASE_URL = f"https://api.telegram.org/bot{BOT_TOKEN}"

def send_message(chat_id, text):
    requests.post(f"{BASE_URL}/sendMessage", json={
        "chat_id": chat_id,
        "text": text
    })

print("البوت شغال... انتظر رسائل /start")
offset = 0

while True:
    try:
        resp = requests.get(f"{BASE_URL}/getUpdates", params={"offset": offset, "timeout": 20}).json()
        if not resp.get("ok"):
            time.sleep(2)
            continue

        for update in resp.get("result", []):
            offset = update["update_id"] + 1
            msg = update.get("message")
            if not msg:
                continue
            
            chat_id = msg["chat"]["id"]
            text = msg.get("text", "")
            username = msg["from"].get("first_name", "حبيبنا")

            if text == "/start":
                send_message(chat_id, f"أهلاً وسهلاً يا {username} 👋\n\nمرحباً بك في متجر Dgbgfvbbv_store 🛍️\nكيف أقدر أساعدك اليوم؟")
                print(f"رديت على {chat_id}")

    except Exception as e:
        print(f"خطأ: {e}")
        time.sleep(3)
