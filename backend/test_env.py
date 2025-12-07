from dotenv import load_dotenv
load_dotenv()
import os

print("TEST:", os.getenv("TRANSPORT_API_APP_ID"))
