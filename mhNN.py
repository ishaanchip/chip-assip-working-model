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
import csv
year = 2023

#testingData= [2022, 6	,5	,4,	5,	1,	2,	1,	2	,2	,2	,7	,-9,	-9	,-9	,2	,1,	2,	1,	-9,	2,	2	,1	,0	,0	,0	,0	,0	,0	,1	,0	,0	,0	,0	,0	,0	,1	,6,	3,	20220001783]
#dataNames = [ETHNIC,RACE,GENDER,SPHSERVICE,CMPSERVICE,OPISERVICE,RTCSERVICE,IJSSERVICE,MH1,MH2,MH3,SUB,MARSTAT,SMISED,SAP,EMPLOY,DETNLF,VETERAN,LIVARAG,NUMMHS,TRAUSTREFLG,ANXIETYFLG,ADHDFLG,CONDUCTFLG,DELIRDEMFLG,BIPOLARFLG,DEPRESSFLG,ODDFLG,PDDFLG,PERSONFLG,SCHIZOFLG,ALCSUBFLG,OTHERDISFLG,STATEFIP,DIVISION,REGION,CASEID]
#df = pd.read_csv("/Users/vrishin/Desktop/Neural Networks/sample-1000.csv")
df = pd.read_csv("/Users/vrishin/Desktop/Neural Networks/sample-20000.csv")

# Clean column names (optional, but recommended)
df.columns = df.columns.str.strip().str.upper()

# Drop missing/invalid MH2 rows
df = df[df['MH2'] != -9]

# Target variable
y = df['MH2'].astype(int) - 1  # Convert to 0-based index (1–13 becomes 0–12)

all_features = [
    'YEAR', 'AGE', 'EDUC', 'ETHNIC', 'RACE', 'GENDER', 'SPHSERVICE', 'CMPSERVICE',
    'OPISERVICE', 'RTCSERVICE', 'IJSSERVICE', 'MH1', 'MH2', 'MH3', 'SUB', 'MARSTAT',
    'SMISED', 'SAP', 'EMPLOY', 'DETNLF', 'VETERAN', 'LIVARAG', 'NUMMHS',
    'TRAUSTREFLG', 'ANXIETYFLG', 'ADHDFLG', 'CONDUCTFLG', 'DELIRDEMFLG',
    'BIPOLARFLG', 'DEPRESSFLG', 'ODDFLG', 'PDDFLG', 'PERSONFLG', 'SCHIZOFLG',
    'ALCSUBFLG', 'OTHERDISFLG', 'STATEFIP', 'DIVISION', 'REGION', 'CASEID'
]

# Select relevant feature columns (excluding MH2, MH3, and CASEID)
feature_cols = [
    'YEAR', 'AGE', 'EDUC', 'ETHNIC', 'RACE', 'GENDER', 'SPHSERVICE',
    'CMPSERVICE', 'OPISERVICE', 'RTCSERVICE', 'IJSSERVICE', 'MH1', 'SUB',
    'MARSTAT', 'SMISED', 'SAP', 'EMPLOY', 'DETNLF', 'VETERAN', 'LIVARAG',
    'NUMMHS', 'TRAUSTREFLG', 'ANXIETYFLG', 'ADHDFLG', 'CONDUCTFLG',
    'DELIRDEMFLG', 'BIPOLARFLG', 'DEPRESSFLG', 'ODDFLG', 'PDDFLG',
    'PERSONFLG', 'SCHIZOFLG', 'ALCSUBFLG', 'OTHERDISFLG',
    'STATEFIP', 'DIVISION', 'REGION'
]

X = df[feature_cols]

# Split columns into categorical and numeric
categorical_cols = [
    'EDUC', 'ETHNIC', 'RACE', 'GENDER', 'SPHSERVICE', 'CMPSERVICE',
    'OPISERVICE', 'RTCSERVICE', 'IJSSERVICE', 'MH1', 'SUB', 'MARSTAT',
    'SAP', 'EMPLOY', 'DETNLF', 'VETERAN', 'LIVARAG',
    'TRAUSTREFLG', 'ANXIETYFLG', 'ADHDFLG', 'CONDUCTFLG', 'DELIRDEMFLG',
    'BIPOLARFLG', 'DEPRESSFLG', 'ODDFLG', 'PDDFLG', 'PERSONFLG',
    'SCHIZOFLG', 'ALCSUBFLG', 'OTHERDISFLG', 'STATEFIP', 'DIVISION', 'REGION'
]

numeric_cols = ['YEAR', 'AGE', 'SMISED', 'NUMMHS']

# One-hot encode categorical columns and scale numeric ones
preprocessor = ColumnTransformer(transformers=[
    ('num', StandardScaler(), numeric_cols),
    ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols)
])

# Preprocess inputs
X_processed = preprocessor.fit_transform(X)

# Handle class imbalance
from imblearn.over_sampling import SMOTE

"""
smote = SMOTE(random_state=42, k_neighbors=1)
X_resampled, y_resampled = smote.fit_resample(X_processed, y)
"""
# Train/test/val split
X_train, X_temp, y_train, y_temp = train_test_split(X_processed, y, test_size=0.30, stratify=y, random_state=42)
X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.50, stratify=y_temp, random_state=42)
"""
# Train/test/val split
X_train, X_temp, y_train, y_temp = train_test_split(X_processed, y, test_size=0.30, stratify=y, random_state=42)
X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.50, stratify=y_temp, random_state=42)
"""
smote = SMOTE(random_state=42, k_neighbors=1)
X_resampled, y_resampled = smote.fit_resample(X_processed, y)
# One-hot encode targets
y_train_cat = to_categorical(y_train, num_classes=13)
y_val_cat = to_categorical(y_val, num_classes=13)
y_test_cat = to_categorical(y_test, num_classes=13)

# Build model
model = Sequential([
    Dense(128, activation='relu', input_shape=(X_train.shape[1],)),
    Dropout(0.3),
    Dense(64, activation='relu'),
    Dropout(0.3),
    Dense(13, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

model.summary()

# Train model
history = model.fit(
    X_train, y_train_cat,
    validation_data=(X_val, y_val_cat),
    epochs=30,
    batch_size=64,
    verbose=2
)

# Evaluate
y_pred_probs = model.predict(X_test)
y_pred = np.argmax(y_pred_probs, axis=1)

print("\nClassification Report:")
print(classification_report(y_test, y_pred, digits=4))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

def compare_predictions(y_true, y_pred, output_file=None):
    """
    Compares actual vs predicted MH2 values and optionally saves results to CSV.

    Args:
        y_true (np.array): Ground truth labels (0-indexed).
        y_pred (np.array): Predicted labels (0-indexed).
        output_file (str): Optional path to save the comparison CSV.

    Returns:
        pd.DataFrame: DataFrame of all comparisons (actual vs predicted).
    """
    # Convert from 0-based index to original MH2 codes (1–13)
    y_actual = y_true + 1
    y_predicted = y_pred + 1

    # Create comparison DataFrame
    comparison_df = pd.DataFrame({
        'Actual_MH2': y_actual,
        'Predicted_MH2': y_predicted
    })

    # Print overall match accuracy
    accuracy = np.mean(y_actual == y_predicted)
    print(f"\n✅ Prediction Match Accuracy: {accuracy:.4f}")

    # Show mismatch count
    mismatches = comparison_df[comparison_df['Actual_MH2'] != comparison_df['Predicted_MH2']]
    print(f"❌ Mismatches Found: {len(mismatches)} out of {len(y_actual)} rawr")
    print(mismatches)

    # Optional: Save to CSV
    if output_file:
        comparison_df.to_csv(output_file, index=False)
        print(f"📁 Comparison saved to: {output_file}")

    return comparison_df

# Run the comparison and save full results to CSV
compare_df = compare_predictions(y_test, y_pred, output_file="mh2_prediction_comparison.csv")

compare_predictions(y_test, y_pred, output_file="mh2_predictions_vs_actual.csv")

def makePrediction(input_data):
    """
    Make a prediction for a single input sample.

    Args:
        input_data (pd.DataFrame): DataFrame containing the input features.

    Returns:
        int: Predicted MH2 value (1–13).
    """
    # Preprocess the input data
    input_processed = preprocessor.transform(input_data)
    
    # Predict
    pred_probs = model.predict(input_processed)
    pred_class = np.argmax(pred_probs, axis=1)[0]  # Get the class index
    
    return pred_class + 1  # Convert back to 1-based index
mh2_labels = {
    1: "Trauma- and stressor-related disorders",
    2: "Anxiety disorders",
    3: "ADHD",
    4: "Conduct disorders",
    5: "Delirium/dementia disorders",
    6: "Bipolar disorders",
    7: "Depressive disorders",
    8: "Oppositional defiant disorders",
    9: "Pervasive developmental disorders",
    10: "Personality disorders",
    11: "Schizophrenia or other psychotic disorders",
    12: "Alcohol or substance use disorders",
    13: "Other disorders/conditions"
}

def add_and_predict_datapoint(new_data_dict, model, preprocessor, feature_cols):
    """
    Adds and predicts a single new data point using the trained model.

    Args:
        new_data_dict (dict): Input data for the new person (must match feature columns).
        model (Sequential): Trained Keras model.
        preprocessor (ColumnTransformer): Fitted transformer.
        feature_cols (list): List of all feature column names.

    Returns:
        int: Predicted MH2 class (1–13)
        str: Description of predicted class
    """
    # Create one-row DataFrame
    df_new = pd.DataFrame([new_data_dict])
    
    # Ensure all expected columns exist
    for col in feature_cols:
        if col not in df_new:
            df_new[col] = 0  # Fill missing features with 0

    df_new = df_new[feature_cols]

    # Preprocess input
    X_new = preprocessor.transform(df_new)

    # Predict
    prediction_probs = model.predict(X_new)
    prediction_class = np.argmax(prediction_probs, axis=1)[0]
    prediction_label = mh2_labels[prediction_class + 1]  # Convert back to 1-based label

    print(f"🧠 Predicted MH2 Class: {prediction_class + 1}")
    #print(f"🗂️  Diagnosis: {prediction_label}")

    return prediction_class + 1



def sampleConversion(input_data, all_features, feature_cols):
    input_list = list(map(int, input_data.strip().split(",")))
    
    # Step 1: Build full sample dict (includes MH2, MH3, CASEID)
    sample_dict_full = dict(zip(all_features, input_list))

    # Step 2: Filter to only model-used features
    sample_dict_used = {k: v for k, v in sample_dict_full.items() if k in feature_cols}

    # Step 3: Find extra/unexpected keys
    extra_keys = [k for k in sample_dict_full if k not in feature_cols]
    """
    print("\n✅ Sample dict used for prediction:")
    print(sample_dict_used)

    print("\n🛑 Extra keys not used by model:")
    print(extra_keys)
    """
    return sample_dict_used

input_data = "2022,2,2,4,5,1,2,1,2,2,2,3,8,-9,-9,1,2,2,-9,-9,2,2,2,0,0,1,0,0,0,0,1,0,0,0,0,0,1,6,3,20220062869"
def clean_data():
   #reading in csv file using csv library
   count = 0
   data = []
   with open(f"/Users/vrishin/Desktop/Neural Networks/sample-100-random.csv", 'r') as csv_file:
       csv_array = csv.reader(csv_file)


       for line in csv_array:
           if line[12] != "-9":
               #print(line)
               #print(line[12])
               count = count + 1
               data.append(line)
   return data
  
"""
arrSample = clean_data()
def massPrediciton(arrSample, all_features, feature_cols):
    arrPredictions = []
    
    Convert a list of input data strings into a DataFrame for batch prediction.

    Args:
        arrSample (list): List of input data strings.
        all_features (list): List of all feature names.
        feature_cols (list): List of feature names used by the model.

    Returns:
        pd.DataFrame: DataFrame ready for prediction.
    
    for i in range(len(arrSample)):

        test = arrSample[i]
        print("Expected", test[12]) 
        print("Acc", add_and_predict_datapoint(test, model, preprocessor, feature_cols))
        #arrPredictions.append(add_and_predict_datapoint(test, model, preprocessor, feature_cols))
    return arrPredictions
print("Mass Prediction Results:", massPrediciton(arrSample, all_features, feature_cols))
"""

print(sampleConversion(input_data, all_features, feature_cols))


add_and_predict_datapoint(sampleConversion(input_data, all_features, feature_cols), model, preprocessor, feature_cols)

#ETHNIC,RACE,GENDER,SPHSERVICE,CMPSERVICE,OPISERVICE,RTCSERVICE,IJSSERVICE,MH1,MH2,MH3,SUB,MARSTAT,SMISED,SAP,EMPLOY,DETNLF,VETERAN,LIVARAG,NUMMHS,TRAUSTREFLG,ANXIETYFLG,ADHDFLG,CONDUCTFLG,DELIRDEMFLG,BIPOLARFLG,DEPRESSFLG,ODDFLG,PDDFLG,PERSONFLG,SCHIZOFLG,ALCSUBFLG,OTHERDISFLG,STATEFIP,DIVISION,REGION,CASEID

