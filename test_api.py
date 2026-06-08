import requests
import os
from dotenv import load_dotenv

load_dotenv()

headers = {
    "X-Auth-Token": os.getenv("API_KEY")
}

response = requests.get(
    "https://api.football-data.org/v4/competitions/WC/matches",
    headers=headers
)

data = response.json()

match = data["matches"][0]

print(match.keys())
