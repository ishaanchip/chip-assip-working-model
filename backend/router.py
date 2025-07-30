from flask import Flask, jsonify, request
from flask_cors import CORS
#takes in dataset
from smised import smi_sed_predictor as predictor
import asyncio

app = Flask(__name__)
CORS(app) 

@app.route("/")
async def hello_world():
    sample_client = {
        'AGE': 3,
        'EDUC': 3,
        'ETHNIC': 4,
        'RACE': 6,
        'GENDER': 2,
        'MH1': 13,
        'MH2': -9,
        'MH3': -9,
        'MARSTAT': 1,
        'SAP': 3,
        'LIVARAG': 2,
        'STATEFIP': 2,
        'DIVISION': 9,
        'REGION': 4
    }







    full_feature_columns = [
        'AGE', 'EDUC', 'ETHNIC', 'RACE', 'GENDER', 'MH1','MH2', 'MH3',
        'MARSTAT', 'SAP',  'LIVARAG', 'STATEFIP', 'DIVISION', 'REGION'
    ]

    # seperate columns based on category [number association no actual meaning (ex: MH1 = "1", MH1 = "2", two seperate conditons, first MH1 not better or worse or related to second MH1)]
    full_category_columns = [
        'EDUC', 'ETHNIC', 'RACE', 'GENDER',  'MH1','MH2', 'MH3',
        'MARSTAT','SAP',  'LIVARAG','STATEFIP', 'DIVISION', 'REGION'
    ]
    #seperate columns based on numeric value [number associated have meaning and can be used (ex: AGE = "1", AGE = "2", as age gets bigger, can be correlation to other illnesses)]
    full_numeric_columns = ['AGE']

    results = await predictor("100000", full_feature_columns, full_category_columns, full_numeric_columns, sample_client)
    
    # return "<h1>Hello World</h1>"
    return {
        'patient_urgency': results,
        'patient_details':sample_client
    }


@app.route("/severity", methods=['POST'])
async def get_results():
    sample_client =  request.get_json()
    print(sample_client)
    full_feature_columns = [
        'AGE', 'EDUC', 'ETHNIC', 'RACE', 'GENDER', 'MH1','MH2', 'MH3',
        'MARSTAT', 'SAP',  'LIVARAG', 'STATEFIP', 'DIVISION', 'REGION'
    ]

    # seperate columns based on category [number association no actual meaning (ex: MH1 = "1", MH1 = "2", two seperate conditons, first MH1 not better or worse or related to second MH1)]
    full_category_columns = [
        'EDUC', 'ETHNIC', 'RACE', 'GENDER',  'MH1','MH2', 'MH3',
        'MARSTAT','SAP',  'LIVARAG','STATEFIP', 'DIVISION', 'REGION'
    ]
    #seperate columns based on numeric value [number associated have meaning and can be used (ex: AGE = "1", AGE = "2", as age gets bigger, can be correlation to other illnesses)]
    full_numeric_columns = ['AGE']

    results = await predictor("100000", full_feature_columns, full_category_columns, full_numeric_columns, sample_client)
    
    return {
        'patient_urgency': results,
        'patient_details':sample_client
    }
