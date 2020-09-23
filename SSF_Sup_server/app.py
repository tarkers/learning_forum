# -*- coding: utf-8 -*-
"""
Created on Tue Sep 22 23:43:39 2020

@author: a0970
"""
from werkzeug.utils import secure_filename
from flask import Response, Flask, render_template, jsonify, request, make_response, send_from_directory, abort
import os,random, string
from flask_cors import CORS

app = Flask(__name__)
app.config["DEBUG"] = True
app.config['CORS_HEADERS'] = 'Content-Type'
#cors = CORS(app, resources={"*": {"origins": "*"}})
CORS(app)

basedir = os.path.abspath(os.path.dirname(__file__))
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'JPG', 'PNG', 'gif', 'GIF'])
localuri = 'http://localhost:5000/'

def get_newname(o_filename):
    filename = os.path.splitext(o_filename)[0]
    extension = os.path.splitext(o_filename)[1]
    random_string = ''.join(random.choice(string.ascii_letters) for x in range(5))
    new_filename = f'{filename}-{random_string}{extension}'
    return new_filename

def allowed_file(filename):
  return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

#輔助服務器說明
@app.route('/', methods=['GET'])
def home():
    return "<h2><font size='6'>這裡是SSF系統的輔助伺服器</font></h2><div><font size='4'>包含以下三種功能</font></div><div><ol><li><font size='4'>文字內容轉換html5 code</font></li><li><font size='4'>圖片代管伺服器</font></li><li><font size='4'>表格轉換器</font></li></ol></div>"
#html5轉換器
@app.route('/writer', methods=['GET'])
def writer():
    return render_template('writer.html')
#圖片存儲轉換
@app.route('/saveImg', methods=['post'],strict_slashes=False)
def saveImg():
    img = request.files['image']
    place = request.files['place']
    file_dir = os.path.join(basedir, '\\imgs\\' + place)
    #place => \xxxxxxx\  name => xxxx.xx
    while(True):
        new_filename = get_newname(img.filename)
        if not(os.path.isfile(file_dir + new_filename)):
            break
    img.save(os.path.join(file_dir, new_filename))
    return jsonify({"data":{"link":localuri + 'image?path=' + '\\imgs\\' + place + new_filename}})

@app.route("/image", methods=['GET'])
def showImg():
    path = request.args.get('path')
    #path是檔案的相對位置
    resp = Response(open(path, 'rb'), mimetype="image/jpeg")
    return resp

#表格轉換
@app.route('/tableCovert', methods=['GET'])
def tableCovert():
    return "<h1>Hello Flask!</h1>"

if __name__=="__main__":
    app.run(host="0.0.0.0", port=5000)