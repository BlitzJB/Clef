import requests

def embed_data(_id):
    data = requests.get(f'https://ytmusic-interactions.blitzsite.repl.co/recommendations?video_id={_id}&limit=1').json()
    song = data[0]
    return {
        'title': song.get('title'),
        'url': f'https://clef.blitzsite.repl.co/song?id={song.get("id")}',
        'description': f'By {", ".join(song.get("artists"))} - {song.get("length")}m',
        'image': song.get('thumbnail').get('large')
    }