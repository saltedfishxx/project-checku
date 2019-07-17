import cv2
import sys
import pytesseract
import base64
import io
from google.cloud import vision
import re
import AI
import json
import jellyfish
import pyodbc

def ocr(frontLink,backLink):
    imgstring = frontLink.replace('data:image/jpeg;base64,','')
    imgdata = base64.b64decode(str(imgstring))
    frontImg = 'front_image.jpeg'  # I assume you have a way of picking unique filenames
    with open(frontImg, 'wb') as f:
        f.write(imgdata)

    imgstring = backLink.replace('data:image/jpeg;base64,','')
    imgdata = base64.b64decode(str(imgstring))
    backImg = 'back_image.jpeg'  # I assume you have a way of picking unique filenames
    with open(backImg, 'wb') as f:
        f.write(imgdata)

    client = vision.ImageAnnotatorClient()

    with io.open(frontImg, 'rb') as image_file:
        content = image_file.read()
    image = vision.types.Image(content=content)

    response = client.document_text_detection(image=image)

    # print(response)
    frontData=response

    frontDataTxt=frontData.full_text_annotation.text.split('\n')
    print(frontDataTxt)

    #region get date
   
    
    #region get name
    name=frontDataTxt[frontDataTxt.index("Toppan Security Printing Pte. Ltd.")-1]
    print(name)

    #region addressee
    addressee=False
    for txt in frontDataTxt:
        print(txt)
        print(jellyfish.jaro_winkler(txt,"Prudential Assurance Company (S) P/L"))
        if jellyfish.jaro_winkler(txt,"Prudential Assurance Company (S) P/L")>=0.7:
            addressee=True
            break
    
    print(addressee)

    #region get amount
    amt=[x for x in frontDataTxt if 'S$' in x][0]
    amt=re.findall(r"\d*\.\d+|\d+", amt)[0]
    print(amt)

    #region bottom stuff
    chequeNo=None
    bankNo=None
    accountNo=None
    branchNo=None
    bottomData=frontDataTxt[-2]
    chequeNo=''.join(bottomData[6:14].split(' '))
    bankNo=''.join(bottomData[16:21].split(' '))
    branchNo=''.join(bottomData[21:24].split(' '))
    accountNo=''.join(bottomData[-13:-1].replace('.','').split(' '))
    print(chequeNo)
    print(bankNo)
    print(accountNo)
    print(branchNo)
    with io.open(backImg, 'rb') as image_file:
        content = image_file.read()
    image = vision.types.Image(content=content)

    response = client.document_text_detection(image=image)
    backData=response

    backDataTxt=backData.full_text_annotation.text.split('\n')
    print(backDataTxt)

    #region get contact
    contact=None
    for x in backDataTxt: 
        if x.isdigit():
            print('beepboop')
            contact=x
        else:
            print('boopbeep')
    print(contact)



    # tessaract
    # config = ('-l eng --oem 1 --psm 11')

    # im = cv2.imread(frontImg, cv2.IMREAD_COLOR)
    # frontText = pytesseract.image_to_string(im, config=config)

    # print("front"+frontText)

    # im = cv2.imread(backImg, cv2.IMREAD_COLOR)
    # backText = pytesseract.image_to_string(im, config=config)

    # print("back"+backText)

    chequeDetail={"chequeDetail":{
        "policyNo":None,
        "premiumType":None,
        "customerName":name,
        "contact":contact,
        "amount":amt,
        "date":None, #halp
        "chequeNo":chequeNo,
        "bankNo":bankNo,
        "accountNo":accountNo,
        "branchNo":branchNo,
        "imageFront":frontLink,
        "imageBack":backLink,
        # "addressee":"Prudential Assurance Company".lower() in frontData.full_text_annotation.text.lower(),
        "addresseeCorrect":addressee,
        "signatureExists":True #lmao
    }
    }
    # return AI.getAIResult(json.dumps(chequeDetail))

    # data to db
    conn = AI.createSqlConn()

    cursor = conn.cursor()

    cursor.execute('''
                    INSERT INTO Checku.dbo.Cheque(ChequeName,Addressee,Amount,Date,Contact,BankBrNo,ChequeImgBack,ChequeImgFront,ChequeSignature,AccountNo,ChequeNo,BankNo)
                    VALUES
                    (?,?,?,?,?,?,?,?,?,?,?,?)
                    ''',
                    name,addressee,amt,None,contact,branchNo,backLink,frontLink,None,accountNo,chequeNo,bankNo)
    conn.commit()