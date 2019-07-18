'Read records from database'
import pyodbc
import platform

'Create dataframe'
import json
import pandas as pd

def createSqlConn():
    #Find all drivers
    # pyodbc.drivers()
    # output: ['SQL Server',
    #  'MySQL ODBC 5.3 ANSI Driver',
    #  'MySQL ODBC 5.3 Unicode Driver',
    #  'SQL Server Native Client 11.0',
    #  'SQL Server Native Client RDA 11.0',
    #  'ODBC Driver 13 for SQL Server']
    
    #Establish connection to db (msSQL)
    driver = 'ODBC Driver 13 for SQL Server'
    server = platform.node() + '\SQLEXPRESS' #'LAPTOP-5F3VRSBM\SQLEXPRESS'
    db = 'Checku'
    sql_conn = pyodbc.connect('DRIVER={'+driver+\
                              '};SERVER='+server+\
                              ';DATABASE='+db+\
                              ';Trusted_Connection=yes')
    
    return sql_conn


def getCheques(mainStatus):

    if mainStatus == "getRejectedRec":
        query = "Select PaymentRecord.PaymentID, accountNo, chequeNo, bankNo, BankBrNo as branchNo, PaymentRecord.policyNo as chequePolicyNo, Amount as chequeAmount, Addressee as addresseeCorrect, ChequeSignature as signatureExists, PaymentRecord.PremiumType as chequePremiumType, chequeName, Contact as chequeContact, CONVERT(varchar, date, 1)  as chequeDate , CONVERT(varchar, PaymentRecord.processedAt, 1) as processedDate, PaymentRecord.reviewedBy, PaymentRecord.RejectedReason as rejectReason from Cheque left join PaymentRecord on Cheque.ChequeId = PaymentRecord.ChequeId where PaymentRecord.Status = 'rejected' and PaymentRecord.ReviewedAt is NOT NULL"
    elif mainStatus == "getSuccessRec":
        query = "Select PaymentRecord.PaymentID, PaymentRecord.policyNo, Policy.policyType, PaymentRecord.premiumType, Cheque.amount, PaymentRecord.nric, Cheque.chequeName As customerName, CONVERT(varchar, Cheque.date, 1)  As paymentDate, CONVERT(varchar, PolicyAccount.dueDate, 1) , CONVERT(varchar, PaymentRecord.processedAt, 1)  As processedDate, PaymentRecord.reviewedBy from PaymentRecord left join Cheque on PaymentRecord.ChequeId = Cheque.ChequeId left join PolicyAccount on PaymentRecord.policyNo = PolicyAccount.policyNo left join Policy on PolicyAccount.PolicyTypeID = Policy.PolicyTypeID where PaymentRecord.status = 'successful' and PaymentRecord.ReviewedAt IS NOT NULL"
    elif mainStatus == "getHoldingRec":
        query = "select PaymentRecord.PaymentID, chequeNo, bankNo, BankBrNo as branchNo, accountNo, PaymentRecord.policyNo, PaymentRecord.premiumType, ChequeName As customerName, contact, amount, CONVERT(varchar, date, 1) As date, ChequeImgFront as imageFront, ChequeImgBack as imageBack, addressee, ChequeSignature as signatureExists  from Cheque left join PaymentRecord on cheque.ChequeId = PaymentRecord.ChequeId where PaymentRecord.status = 'holdingPending' and PaymentRecord.ReviewedAt IS NOT NULL"
    elif mainStatus == "getPendingRec":
        query = "select PaymentRecord.PaymentID, chequeNo, bankNo, BankBrNo as branchNo, accountNo, amount, PaymentRecord.policyNo As possiblePolicyNo, PaymentRecord.premiumType, ChequeName As possibleCustomer, contact,  CONVERT(varchar, SMS.SmsSentDate, 22) As dateSmsSent, sms.SmsCount As smsCycle, sms.verified as smsStatus from Cheque left join PaymentRecord on cheque.ChequeId = PaymentRecord.ChequeId left join SMS on PaymentRecord.PaymentID = SMS.PaymentID where PaymentRecord.status = 'holdingPending' and PaymentRecord.ReviewedAt IS NOT NULL"
        
    df = pd.read_sql(query, createSqlConn())
    returnedJson = {"data":[]}  
    if mainStatus == "getHoldingRec":
        for i in df.index:

            chequeDetail={"chequeDetail":{
            "PaymentID":str(df.loc[i]["PaymentID"]),
            "policyNo":str(df.loc[i]["policyNo"]),
            "premiumType":str(df.loc[i]["premiumType"]),
            "customerName":str(df.loc[i]["customerName"]),
            "contact":str(df.loc[i]["contact"]),
            "amount":str(df.loc[i]["amount"]),
            "date":str(df.loc[i]["date"]), 
            "chequeNo":str(df.loc[i]["chequeNo"]),
            "bankNo":str(df.loc[i]["bankNo"]),
            "accountNo":str(df.loc[i]["accountNo"]),
            "branchNo":str(df.loc[i]["branchNo"]),
            "imageFront":str(df.loc[i]["imageFront"]),
            "imageBack":str(df.loc[i]["imageBack"]),
            "addressee":str(df.loc[i]["addressee"]),
            "signatureExists":str(df.loc[i]["signatureExists"]) #lmao
                }
            }
            
            jsondata = json.dumps(chequeDetail, indent=4)       
            returnedJson["data"].append(json.loads(getAIResult(jsondata)))
    else:
        returnedJson = {"data" : df.to_dict(orient='records')}
                                    
    returnedJson = json.dumps(returnedJson)  
    return returnedJson

