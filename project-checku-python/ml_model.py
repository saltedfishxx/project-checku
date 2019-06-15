# Import dependencies
# import pickle
# from sklearn.linear_model import LogisticRegression
# import pandas as pd
# import numpy as np


# def createML():
#     # Load the dataset in a dataframe object and include only four features as mentioned
#     url = "http://s3.amazonaws.com/assets.datacamp.com/course/Kaggle/train.csv"
#     df = pd.read_csv(url)
#     include = ['Age', 'Sex', 'Embarked', 'Survived']  # Only four features
#     df_ = df[include]

#     # Data Preprocessing
#     categoricals = []
#     for col, col_type in df_.dtypes.iteritems():
#         if col_type == 'O':
#             categoricals.append(col)
#         else:
#             df_[col].fillna(0, inplace=True)

#     df_ohe = pd.get_dummies(df_, columns=categoricals, dummy_na=True)

#     # Logistic Regression classifier
#     dependent_variable = 'Survived'
#     x = df_ohe[df_ohe.columns.difference([dependent_variable])]
#     y = df_ohe[dependent_variable]
#     lr = LogisticRegression()
#     lr.fit(x, y)

#     # Save your model
#     pickle.dump(lr, open("model.p", "wb"))
#     print("Model dumped!")

#     # Load the model that you just saved
#     lr = pickle.load(open("model.p", "rb"))

#     # Saving the data columns from training
#     model_columns = list(x.columns)
#     pickle.dump(model_columns, open("model_columns.p", "wb"))
#     print("Models columns dumped!")
