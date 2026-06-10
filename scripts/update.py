import json
import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("API_KEY")

headers = {
    "X-Auth-Token": API_KEY
}

# ------------------
# MATCHES
# ------------------

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
        "status": match["status"],
        "stage": match["stage"],
        "group": match["group"],
        "homeScore": match["score"]["fullTime"]["home"],
        "awayScore": match["score"]["fullTime"]["away"]
    })

with open("data/matches.json", "w") as file:
    json.dump(matches, file, indent=2)

# ------------------
# STANDINGS
# ------------------

response = requests.get(
    "https://api.football-data.org/v4/competitions/WC/standings",
    headers=headers
)

data = response.json()

standings = {}

for group in data["standings"]:

    group_name = group["group"]

    standings[group_name] = []

    for team in group["table"]:

        standings[group_name].append({
            "position": team["position"],
            "team": team["team"]["name"],
            "playedGames": team["playedGames"],
            "won": team["won"],
            "draw": team["draw"],
            "lost": team["lost"],
            "points": team["points"],
            "goalDifference": team["goalDifference"],
            "goalsFor": team["goalsFor"],
            "goalsAgainst": team["goalsAgainst"]
        })

with open("data/standings.json", "w") as file:
    json.dump(standings, file, indent=2)

print(f"Updated {len(matches)} matches")
print(f"Updated {len(standings)} groups")