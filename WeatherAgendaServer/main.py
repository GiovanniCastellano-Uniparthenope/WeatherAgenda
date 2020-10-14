from http.server import BaseHTTPRequestHandler, HTTPServer
import time

class WeatherAgendaServer(BaseHTTPRequestHandler):
    def do_OPTIONS(self):           
        self.send_response(200)       
        self.send_header('Access-Control-Allow-Origin', '*')                
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "Accept")
        self.send_header("Content-Length", "0")
        self.send_header("Content-Type", "text/plain")
        
    def do_GET(self):  
        rootdir = 'event_files/'
        filename = 'event1.txt'
        try:
            f = open(rootdir + filename);
            fcontent = f.read()
            f.close()
            
            self.send_response(200)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header('Content-type', 'text/text')
            self.end_headers()

            self.wfile.write(bytes(fcontent, 'utf-8'));
            return
        except IOError:
            self.send_error(404, 'File not found')

    def do_POST(self):
        rootdir = 'event_files/'
        filename = 'event1.txt'
        try:
            print("Received POST request from " + self.path)

            self.send_response(200)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()

            length = int(self.headers.get('Content-Length', 0))
            content = self.rfile.read(length)
            content = str(content)
            content = content[2:len(content)-1]
            f = open(rootdir + filename, "w+")
            f.write(str(content))
            f.close()
            return
        except IOError:
            self.send_error(404, 'Unable to write file')



if __name__  == "__main__":
    webServer = HTTPServer(("localhost", 3000), WeatherAgendaServer)
    print("Server started http://%s:%s" % ("localhost", 3000))

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()
