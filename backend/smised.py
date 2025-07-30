import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.metrics import classification_report, confusion_matrix
from imblearn.over_sampling import SMOTE
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.utils import to_categorical


year=2023

full_all_features = [
    'YEAR', 'AGE', 'EDUC', 'ETHNIC', 'RACE', 'GENDER', 'SPHSERVICE', 'CMPSERVICE',
    'OPISERVICE', 'RTCSERVICE', 'IJSSERVICE', 'MH1', 'MH2', 'MH3', 'SUB', 'MARSTAT',
    'SMISED', 'SAP', 'EMPLOY', 'DETNLF', 'VETERAN', 'LIVARAG', 'NUMMHS',
    'TRAUSTREFLG', 'ANXIETYFLG', 'ADHDFLG', 'CONDUCTFLG', 'DELIRDEMFLG',
    'BIPOLARFLG', 'DEPRESSFLG', 'ODDFLG', 'PDDFLG', 'PERSONFLG', 'SCHIZOFLG',
    'ALCSUBFLG', 'OTHERDISFLG', 'STATEFIP', 'DIVISION', 'REGION', 'CASEID'
]


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










async def smi_sed_predictor(dataset, feature_columns, categorical_columns, numeric_columns, client):
    #DATA CLEANING (simple mutation of data [cleaning up structure, getting all patients that are applicable])
    #reading in data from csv
    df = pd.read_csv(f"data/random-{dataset}.csv")

    #standard column names [full uppercase and no abnormal spacing (ex: ["AGE", "EDUC"])]
    df.columns = df.columns.str.strip().str.upper()



    #setting target (y val) to the MH2 value (minus by 1 for One-Hot encoding [one hot index start at 0, data fields started at 1])
    y_raw = df['SMISED'].astype(int)
    y = y_raw.map({1: 0, 3: 1}).values



    #FEATURE SELECTION
    #list of all data points included in SAMSHA data set

    #list of all features used to predict most likely user's condition
    feature_columns = feature_columns
    #setting X to include data points from that of the featured columns
    X = df[feature_columns]

    # seperate columns based on category [number association no actual meaning (ex: MH1 = "1", MH1 = "2", two seperate conditons, first MH1 not better or worse or related to second MH1)]
    categorical_columns = categorical_columns
    #seperate columns based on numeric value [number associated have meaning and can be used (ex: AGE = "1", AGE = "2", as age gets bigger, can be correlation to other illnesses)]
    numeric_columns = numeric_columns


    #PREPROCESSING
    # transform column data accordingly [columns w categorial values will be One Hot encoded to give them some semantic, binary value for computer to parse, numeric values will be scaled to be standardized among the other numeric values]
    preprocessor = ColumnTransformer(transformers=[('num', StandardScaler(), numeric_columns),('cat', OneHotEncoder(handle_unknown='ignore'), categorical_columns)])

    #mutating columns based on preprocessor defined
    X_processed = preprocessor.fit_transform(X)

    #GETTING READY FOR TRAINING
    #splitting up data for different use-cases [X_train & y_train get 70% of data, X_temp & y_temp get 15%, and for actual tests X_test & y_test get 15%]
    X_train, X_temp, y_train, y_temp = train_test_split(X_processed, y, test_size=0.30, stratify=y, random_state=42) #stratify used to assure equal class distributions
    X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.70, stratify=y_temp, random_state=42)

    #smote generate 'fake' data to work w, promote prediction of obscure, infrequent classes
    smote = SMOTE(random_state=42, k_neighbors=1)
    X_smote_train, y_smote_train = smote.fit_resample(X_train, y_train)



    #transforms MH2 columns among all data sets to categorial One-Hot states to give computer some semantic, parseable value attributions 
    y_train_cat = to_categorical(y_smote_train, num_classes=2)
    y_val_cat = to_categorical(y_val, num_classes=2)
    y_test_cat = to_categorical(y_test, num_classes=2)


    #CREATING MODEL PROCESSOR
    #multi-layer neural network model
    model = Sequential([
        Dense(128, activation='relu', input_shape=(X_train.shape[1],)), #128 neurons in first layer
        Dropout(0.3), #random deactivation of 30% of neurons, prevent overfitting and dependence on a potential specific neuron for most likely output
        Dense(64, activation='relu'), #mid layer w 64 different neurons [128 -> 64]
        Dropout(0.3), #random deactivation of 30% of neurons, prevent overfitting and dependence on a potential specific neuron for most likely output
        Dense(2, activation='softmax') #final layer has all 13 potential illnesses represented, one w highest correlation makes it out [13 -> 1]
    ])

    model.compile(
        optimizer='adam', #popular optimizer model
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    model.summary()

    #TRAINING MODEL
    model_training_history = model.fit(
        X_smote_train, y_train_cat, #plugged in training data
        validation_data=(X_val, y_val_cat), #as going through testing, going to cross check w validation data to assure no overfitting of popular classes
        epochs=30, #goes through trainig data 30 times 
        batch_size=64, #amount of samples proccessed at a time 
        verbose=2 #terminal output of training status
    )

    #MODEL RESULTS

    #gets array of probabilities of each illness
    y_pred_probs = model.predict(X_test)
    #fetches highest probablity of model
    y_pred = np.argmax(y_pred_probs, axis=1)

    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, digits=4))

    print("\nConfusion Report:")
    print(confusion_matrix(y_test, y_pred))



    # # #TESTING SEPERATE CSV FILE [in depth testing of every patient]
    # # #reading in file
    user_df = pd.read_csv('data/random-1000.csv')

    #getting actual values to compare w predictions
    user_y_actual = user_df["SMISED"].map({1: 0, 3: 1}).values

    #prepping data
    user_df.columns = user_df.columns.str.strip().str.upper()
    user_x = user_df[feature_columns]
    user_x_processed = preprocessor.transform(user_x)

    #using model
    user_y_pred_probs = model.predict(user_x_processed)
    #getting max probability of condition
    user_y_pred = np.argmax(user_y_pred_probs, axis=1)  #add one to move back from [0 - 12] --> [1 - 13]

    # #looping thru each patient
    wrong_counter = 0
    should_be_one = 0
    wrong_row = []
    for i, pred in enumerate(user_y_pred):
        #print(f"Prediction #{i + 1}: {pred}")
        #print(f"Actual #{i + 1}: {user_y_actual[i]}")
        if pred != user_y_actual[i]:
            #print("WRONG ! ! !")
            wrong_counter = wrong_counter + 1
            wrong_row.append(i + 1)
            if pred == 0:
                should_be_one = should_be_one + 1
        #print("---------------")
    print(f"total wrong: {wrong_counter}")
    print(f"rows wrong: {wrong_row}")
    print(f"rows predicted zero when should've been one {should_be_one}")

    client_df = pd.DataFrame([client])
    client_x = client_df[feature_columns]
    client_x_processed = preprocessor.transform(client_x)
    client_y_pred_probs = model.predict(client_x_processed)
    client_x_pred = np.argmax(client_y_pred_probs, axis=1)
    print(client_x_pred)
    reverter = {
        0:"SMI",
        1:"NOT SMI"
    }
    return reverter[client_x_pred[0]]