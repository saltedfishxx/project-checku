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


app = Flask(__name__)
#use CORS to enable CORS policy and have access control
CORS(app)

#default response    
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
    return jsonify({'data':"get holding record is called."})


@app.route('/getSuccessRec', methods=['GET'])
def getSuccessRecords():
    # returns reponse
    return jsonify({'data':"get success record is called."})


@app.route('/getRejectedRec', methods=['GET'])
def getRejectedRecords():
    # returns reponse
    return jsonify({'data':"get rejected record is called."})



######################## POST METHODS ################################
#api call for login and authorisation
@app.route('/login', methods=['POST'])
def login():
    #get requested data and convert to json
    data = request.get_json()

    # received data looks something like this:
    # {'email': 'johnomari@gmail.com', 'password': 'nani'}
    # to get the property values, use .get('key')
    email = data.get('email') 
    password = data.get('password')

    #have a separate method to search through database and check for login credentials
    isAuthenticated = checkLogin(email, password)

    # when returning response, remeber to convert to json
    # returns reponse
    if(isAuthenticated):
        return jsonify({'data':"post scanned chqe is called. User is authenticated. Email is " + email 
        + " and password is " + password })
    else:
        return jsonify({'data':"Invalid login credentials" })


#api call to get the scanned cheques and add to database
@app.route('/postScannedChqe', methods=['POST'])
def scanRecords():
    # returns reponse
    return jsonify({'data':"post scanned chqe is called."})


#api call to get the confirm rejected cheques and add to database
@app.route('/postRejectedChqe', methods=['POST'])
def addRejectedCheques():
    # returns reponse
    return jsonify({'data':"post rejected chqe is called."})


#api call to get the cheques that have been reviewed and add to database
@app.route('/postReviewChqe', methods=['POST'])
def addReviewCheques():
    # returns reponse
    return jsonify({'data':"post review chqe is called."})


#api call to send sms to customers
@app.route('/postSms', methods=['POST'])
def sendSms():
    # returns reponse
    return jsonify({'data':"post sms is called."})


#api call to get the confirm success cheques and add to database
@app.route('/postSuccessChqe', methods=['POST'])
def addSuccessCheques():
    # returns reponse
    return jsonify({'data':"post success chqe is called."})

#region OCR
@app.route('/ocr')
def scanCheque():
    ocr.ocr('../samplecheck1.jpg')
#endregion

######################## HELPER METHODS ################################
def checkLogin(email, password):
    # TODO: search in db to check if email password exists and is correct
    return True



if __name__ == '__main__':
    #run ml_model.py
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
