from flask import Flask, request, jsonify, jsonify
# import pytest
import os
import sys
# import pickle
# import traceback
# import pandas as pd
# import numpy as np
# import ml_model
import ocr
from flask import request
from flask_cors import CORS
import pyodbc
import db

app = Flask(__name__)
# use CORS to enable CORS policy and have access control
CORS(app)

# default response


@app.route("/")
def main():
    return "Hello test"


######################### GET METHODS ################################
@app.route('/getPendingRec', methods=['GET'])
def getPendingRecords():

    # returns reponse
    return jsonify({'data': "get pending record is called."})


@app.route('/getHoldingRec', methods=['GET'])
def getHoldingRecords():
    # returns reponse
    return jsonify({'data': "get holding record is called."})


@app.route('/getSuccessRec', methods=['GET'])
def getSuccessRecords():
    return jsonify({'data': "get success record is called."})


@app.route('/getRejectedRec', methods=['GET'])
def getRejectedRecords():
    # returns reponse
    return jsonify({'data': "get rejected record is called."})


######################## POST METHODS ################################
# api call for login and authorisation
@app.route('/login', methods=['POST'])
def login():
    # get requested data and convert to json
    data = request.get_json()

    # received data looks something like this:
    # {'email': 'johnomari@gmail.com', 'password': 'nani'}
    # to get the property values, use .get('key')
    email = data.get('email')
    password = data.get('password')

    # have a separate method to search through database and check for login credentials
    isAuthenticated = checkLogin(email, password)

    # when returning response, remeber to convert to json
    # returns reponse
    if(isAuthenticated):
        return jsonify({'isAuthenticated': 'true', 'data': "post scanned chqe is called. User is authenticated. Email is " + email
                        + " and password is " + password})
    else:
        return jsonify({'data': "Invalid login credentials"})


# api call to send sms to customers
@app.route('/postSms', methods=['POST'])
def sendSms():
    # returns reponse
    return jsonify({'data': "post sms is called."})


# api call to process cheques through OCR
@app.route('/processCheques', methods=['POST'])
def scanCheque():
    # data in string format and you have to parse into list
    # e.g. data received [ {"back": { "name" : ...}, "front: {..}"}, {"back": {...}, "front: {..}"}]
    chequeList = request.get_json()["data"]

    status = 0
    # run ocr method while passing in received data
    print("No. of cheques recevied " + str(len(chequeList)))
    for cheque in chequeList:
        print("front cheque file name: " + cheque["front"]["name"])
        print("back cheque file name: " + cheque["back"]["name"])
        status = ocr.ocr(cheque["front"]["url"], cheque["back"]["url"])
        if(status == 400):
            return jsonify({'status': status})
            break
    return jsonify({'status': status})


@app.route('/getProcessedCheques', methods=['GET'])
def getProccessedCheques():
    status = request.args.get('status')
    print(status)
    if status == 'review':
        return db.getProccessedCheques("proccessReview")
    elif status == 'success':
        return db.getProccessedCheques("proccessSuccess")
    elif status == 'reject':
        return db.getProccessedCheques("proccessReject")
    else:
        return jsonify({'status': 400, 'data': 'Invalid status'})


######################## HELPER METHODS ################################


def checkLogin(email, password):
    # TODO: search in db to check if email password exists and is correct
    if email == "wakanda" and password == "jesus":
        return True


if __name__ == '__main__':
    # run ml_model.py
    # ml_model.createML()

    # Load "model.pkl"
    # lr = pickle.load(open("model.p", "rb"))
    # print('Model loaded')
    # # Load "model_columns.pkl"
    # model_columns = pickle.load(open("model_columns.p", "rb"))
    # print('Model columns loaded')

    # Get port from environment variable or choose 9099 as local default
    port = int(os.getenv("PORT", 5000))
    # Run the app, listening on all IPs with our chosen port number
    app.run(host="localhost", port=port, debug=True)
