from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
from auto_update import AnimeUpdater

class APIHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        try:
            if self.path == '/api/latest-releases.json':
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                updater = AnimeUpdater()
                latest_data = updater.get_latest_episodes()
                self.wfile.write(json.dumps(latest_data).encode())
            else:
                super().do_GET()
        except Exception as e:
            self.send_error(500, str(e))

def run_server():
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, APIHandler)
    print('Starting server on port 8000...')
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()