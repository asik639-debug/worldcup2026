import json
import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("API_KEY")

headers = {
    "X-Auth-Token": API_KEY
}

response = requests.get(
    "https://api.football-data.org/v4/competitions/WC/matches",
    headers=headers
)

data = response.json()

matches = []

for match in data["matches"]:

    matches.append({
        "home": match["homeTeam"]["name"],
        "away": match["awayTeam"]["name"],
        "time": match["utcDate"],
        "status": match["status"]
    })

with open("data/matches.json", "w") as file:
    json.dump(matches, file, indent=2)

print(f"Updated {len(matches)} matches")