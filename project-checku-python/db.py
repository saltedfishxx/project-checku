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