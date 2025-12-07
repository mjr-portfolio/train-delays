import os
import requests
from datetime import datetime
from dotenv import load_dotenv; load_dotenv()


BASE_URL = "https://transportapi.com/v3/uk/train/station"


class TransportAPI:
    def __init__(self):
        self.app_id = os.getenv("TRANSPORT_API_APP_ID")
        self.app_key = os.getenv("TRANSPORT_API_APP_KEY")


    def get_departures(self, station_code):
        url = f"{BASE_URL}/{station_code}/live.json"

        params = {
            "app_id": self.app_id,
            "app_key": self.app_key,
            "darwin": "true",
            "train_status": "passenger"
        }

        print('id/key: ', self.app_id, self.app_key)

        print("FETCH URL:", url)

        response = requests.get(url, params=params)
        response.raise_for_status()   # good practice - fail loudly on 4xx/5xx

        data = response.json()
        return data
