
# coding: utf-8

# ### Import Modules
# 


#RecordLinkage for AI matching'
import sys
# from IPython import get_ipython
# get_ipython().system('{sys.executable} -m pip install --user recordlinkage')
import recordlinkage as rl
from recordlinkage.preprocessing import clean, phonetic
from recordlinkage.index import Block
from recordlinkage.index import Full

#Regex for cleaning data'
import re


#Read records from database'
import pyodbc
import platform

#Create dataframe'
import json
import pandas as pd
import numpy as np
import db
# set seed for reproducibility
np.random.seed(0)

#Create or Load Pickle'
import pickle

# ### Create sqlconn





# ### Create/Load Pickle Models


def create_pickle_models(hasPolicy, hasContact):    
    df_training = pd.read_csv('data/CustomerData.csv', skip_blank_lines=True)
    #Cleaning
    df_training.rename(columns={
                'Name':'name',
                'Policy Number':'policyno',
                'Phone':'contact',
                'Amount Remaining':'remainingamount'},
             inplace=True)  
    df_training = df_training.drop(columns=['Premium Type'])
    df_training["name"] = clean(df_training["name"].astype(str)) 
    df_training["contact"] = clean(df_training["contact"].astype(str)) 
    df_training["remainingamount"] = pd.Series(df_training['remainingamount']).astype(float)
    df_training["policyno"] = clean(df_training["policyno"].astype(str)) 
 
    
    if hasPolicy == False:
        df_training = df_training.drop(columns=['policyno'])
    if hasContact == False:
        df_training = df_training.drop(columns=['contact'])
        
    #Training
    all_training_pairs = Full().index(df_training)
    matches_training_pairs = Block('cluster').index(df_training)
    
    comp = create_comp(hasPolicy, hasContact)
    training_vectors = comp.compute(all_training_pairs, df_training)
    svm = rl.SVMClassifier()
    svm.fit(training_vectors, matches_training_pairs)
    
    if hasPolicy & hasContact:
        filename = 'AI_Model_withPolicy_withContact'
    elif hasPolicy:
        filename = 'AI_Model_withPolicy_withoutContact'
    elif hasContact:
        filename = 'AI_Model_withoutPolicy_withContact'
    else:
        filename = 'AI_Model_withoutPolicy_withoutContact'
        
    pickle.dump(svm, open(filename,'wb'))
    
def pickleExists(path):
    """Open file given by path if it exists, and return its contents.
    If it doesn't exist, save and return the default contents.
    """
    try:
        f = open(path, 'r')
        return True
    except IOError:
        return False


# pickle_models(True, False)
# pickle_models(False, True)
# pickle_models(True, True)
# pickle_models(False, False)


# ### Create comp for comparison vectors


def create_comp(hasPolicy, hasContact):
    comp = rl.Compare()
    comp.string('name','name', method="jarowinkler",  label="name")
    comp.numeric('remainingamount', 'remainingamount', label="remainingamount")
    if hasPolicy:
        comp.string('policyno','policyno',method="jarowinkler", label="policyno")
    if hasContact:
        comp.string('contact','contact',method="jarowinkler",  label="contact")
        
    return comp


# ### Clean prefixes/titles e.g. Mr, Ms, Mrs, Mrs.


def clean_prefixes_and_symbols_from_name(df, colName):
    #Define prefixes
    prefixes = ['mr', 'mr', 'ms', 'mrs', 'mdm', 'dr']
    
    #Remove prefix from FRONT of name
    title_regex = r'^\b(?:' + '|'.join(prefixes) + r')\.\s*' # mr., ms.
    title_without_dot_regex = r'^\b(?:' + '|'.join(prefixes) + r')\s*' # mr, ms
    
    #Remove symbols
    irrelevant_regex = re.compile(r'[^a-z0-9\s]')
    multispace_regex = re.compile(r'\s\s+')
    
    return df.assign(
        name=df[colName]
             .str.replace(title_regex, ' ')
             .str.replace(title_without_dot_regex, ' ')
             .str.replace(irrelevant_regex, ' ')
             .str.replace(multispace_regex, ' '))

# ### Create example JsonChequeDetails
# 


jsondata_dict = {"chequeDetail":{
"chequeNo": "00022",
"bankNo":"7214",
"branchNo" : "021",
"accountNo": "0302349182",
"policyNo": "",
"premiumType": "Premium",
"customerName": "Fu Di Hai",
"contact": "96488339",
"amount": "900",
"date": None,
"imageFront": "base64string",
"imageBack": "base64string",
"addressee" : "prudential assurance company",
"signatureExists": False}}

jsondata = json.dumps(jsondata_dict, indent=4)
#print(jsondata)


jsondata_dict = {"chequeDetail":{
"chequeNo": "00022",
"bankNo":"7214",
"branchNo" : "021",
"accountNo": "0302349182",
"policyNo": "",
"premiumType": "Premium",
"customerName": "Johnathan Joestar",
"contact": "99126969",
"amount": 400,
"date": "12/06/2019",
"imageFront": "base64string",
"imageBack": "base64string",
"addressee" : "prudential assurance company",
"signatureExists": False}}

jsondata = json.dumps(jsondata_dict, indent=4)
#print(jsondata)


# ### AI Function


def getAIResult(JsonChequeDetails):
    
#Given JsonChequeDetails as:
# {"chequeDetail":{
# "chequeNo": "00022",
# "bankNo":"7214",
# "branchNo" : "021",
# "accountNo": "0302349182",
# "policyNo": "9812731823",
# "premiumType": "Premium",
# "customerName": "Johnathan Joestar",
# "contact": "99126969",
# "amount": 400,
# "date": "12/06/2019",
# "imageFront": "base64string",
# "imageBack": "base64string",
# "addressee" : "prudential assurance company",
# "signatureExists": False}}


    #Get Cheque Details as df
    jdata = json.loads(JsonChequeDetails)
    json_df = pd.DataFrame(jdata)
    json_df = json_df.T
    # df = json_df.drop(columns=['chequeNo','bankNo','branchNo','accountNo','premiumType','date', 'imageFront', 'imageBack', 'addressee', 'signatureExists'])
    #Rename columns
    json_df.rename(columns={
                'customerName':'name',
                 'policyNo':'policyno',
                 'amount':'remainingamount'},
             inplace=True)
    #Drop all columns but these
    cols_to_keep = ['name','contact','policyno','remainingamount']
    df = json_df.drop(json_df.columns.difference(cols_to_keep), 1)
    #Clean cheque data
    df["name"] = clean(df["name"].astype(str)) 
    df = clean_prefixes_and_symbols_from_name(df, 'name')
    #Convert cheque amount to float 
    #Ensure float (cheque) to float (db) matching
    df['remainingamount'] = float(df['remainingamount']) 
    

    #Get Cust Data df from db
    sql_conn = db.createSqlConn()
    query = "select customer.nric, name, contact, PolicyAccount.policyno, PolicyAccount.remainingamount, policy.policytype, PolicyAccount.duedate from customer left join policyaccount on customer.nric = policyaccount.nric left join policy on policyaccount.policytypeid = policy.policytypeid"
    
    customer_data = pd.read_sql(query, sql_conn)
    
    #Clean db data to be displayed to cust 'lowercase, trim etc.'
    customer_data['duedate'] = pd.Series(customer_data['duedate']).astype(str)
    customer_data.duedate= customer_data.duedate.str.replace('-','/',regex=True)
    
    #Clean db data to be used in AI prediction
    customer_data_df = customer_data
    customer_data_df["name"] = clean(customer_data_df["name"].astype(str)) 
    customer_data_df["contact"] = clean(customer_data_df["contact"].astype(str)) 
    customer_data_df["policyno"] = clean(customer_data_df["policyno"].astype(str)) 
    customer_data_df['remainingamount'] = pd.Series(customer_data_df['remainingamount']).astype(float)
    customer_data_df = customer_data_df.drop(columns=['nric', 'policytype', 'duedate' ])
    
    #Delete columns if no Policy Number
    if not (df['policyno'][0]): #If policyno is empty
        df = df.drop(columns=['policyno'])
        customer_data_df = customer_data_df.drop(columns=['policyno'])
        hasPolicy = False
    else:
        hasPolicy = True
    
    if not (df['contact'][0]): #If contact is empty
        df = df.drop(columns=['contact'])
        customer_data_df = customer_data_df.drop(columns=['contact'])
        hasContact = False
    else:
        hasContact = True
    
    #Create indexer
    indexer = rl.Index()
    # indexer.block('Policy Number','Policy Number')
    indexer.full()
    pairs = indexer.index(customer_data_df, df)
    
    #Create comparison vectors
    comp = create_comp(hasPolicy, hasContact)
    comparison_vectors = comp.compute(pairs, customer_data_df, df)
    
    #Initialise svm model from pickle
    if hasPolicy & hasContact:
        filename = 'AI_Model_withPolicy_withContact'
    elif hasPolicy:
        filename = 'AI_Model_withPolicy_withoutContact'
    elif hasContact:
        filename = 'AI_Model_withoutPolicy_withContact'
    else:
        filename = 'AI_Model_withoutPolicy_withoutContact'
    
    #Check if pickle exists, if not create pickle
    if pickleExists(filename) == False:
            create_pickle_models(hasPolicy, hasContact)
        
    svm = pickle.load(open(filename, 'rb'))

    #Predict highest matched rows
    svm_pairs = svm.predict(comparison_vectors)
    comparison_vectors_svm = comp.compute(svm_pairs, customer_data_df, df)
    
    #Set weights for name, contact and/or policyno, remainingamount columns
    if hasPolicy & hasContact:
        scores_svm = np.average(comparison_vectors_svm.values, axis=1, weights=[10,30,30,30])
    elif hasPolicy: 
        scores_svm = np.average(comparison_vectors_svm.values, axis=1, weights=[10,10,10])
    elif hasContact:
        scores_svm = np.average(comparison_vectors_svm.values, axis=1, weights=[10,10,10])
    else: #no contact no policy
        scores_svm = np.average(comparison_vectors_svm.values, axis=1, weights=[50,50])
        
    #Find svm predicted rows & Add their scores to customer_data df
    scored_comparison_vectors_svm = comparison_vectors_svm.assign(score=scores_svm)
    indexes_svm = list(scored_comparison_vectors_svm.index.values)
    indexes_svm= [i[0] for i in indexes_svm]
    customer_data_scored_svm = customer_data.iloc[indexes_svm]
    customer_data_scored_svm = customer_data_scored_svm.assign(score=scores_svm)
    customer_data_scored_svm =customer_data_scored_svm.sort_values(by='score', ascending=False)
        
    #Convert df to json
    customer_data_scored_svm_dict = customer_data_scored_svm.to_dict(orient='records')
    json_data_dict = json.loads(JsonChequeDetails)["chequeDetail"]
    prediction_result = {"chequeDetail": json_data_dict, "prediction" : customer_data_scored_svm_dict}
    prediction_result = json.dumps(prediction_result, indent=4)
    
    
    return prediction_result

#print(getAIResult(jsondata))



