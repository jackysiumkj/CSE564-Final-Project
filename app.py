from flask import Flask, render_template, send_file, jsonify, request
import pandas as pd
import numpy as np
import random
import json
from sklearn.preprocessing import LabelEncoder
from sklearn.decomposition import PCA

from data_sampling import data_sampling
from data_reduction import data_reduction, top_two_pc
from mds_handler import get_euclidean, get_correlation

app = Flask(__name__)

def get_request_dataset(req_dataset):
  global dataset, stratify_sample, random_sample

  if (req_dataset == 'org'):
    return dataset
  elif (req_dataset == 'rnd'):
    return random_sample
  elif (req_dataset == 'str'):
    return stratify_sample
  else:
    return None
  

@app.route('/', methods = ['GET'])
def index():
  return render_template('index.html')

@app.route('/pca_data', methods = ['GET'])
def getPcaData():
  global pca_dataset, pca_random, pca_straitfy

  res_data = pd.DataFrame()
  res_data['org'] = np.cumsum(pca_dataset.explained_variance_ratio_)
  res_data['rnd'] = np.cumsum(pca_random.explained_variance_ratio_)
  res_data['str'] = np.cumsum(pca_straitfy.explained_variance_ratio_)
  res_data = res_data.to_dict('records')
  res_data = json.dumps(res_data, indent=2)

  return jsonify(res_data)

@app.route('/top_two_pca_data/<req_dataset>', methods = ['GET'])
def getTopTwoPcaData(req_dataset):
  req_sample = get_request_dataset(req_dataset)

  top_two_pca_data = top_two_pc(req_sample.drop(['ARREST_BORO'], axis=1))
  top_two_pca_data['ARREST_BORO'] = req_sample['ARREST_BORO'].values

  res_data = top_two_pca_data.to_dict('records')
  res_data = json.dumps(res_data, indent=2)

  return jsonify(res_data)

@app.route('/mds_data/<mds_type>/<req_dataset>', methods = ['GET'])
def getMdsData(mds_type, req_dataset):
  req_sample = get_request_dataset(req_dataset)

  if mds_type == '' or mds_type == 'euclidean':
    res_data = get_euclidean(req_sample)
  elif mds_type == 'correlation':
    res_data = get_correlation(req_sample)
  
  res_data['ARREST_BORO'] = req_sample['ARREST_BORO'].values
  res_data = res_data.to_dict('records')
  res_data = json.dumps(res_data, indent=2)

  return jsonify(res_data)

@app.route('/three_highest_pca_data/<req_dataset>', methods = ['GET'])
def getThreeHighestPcaData(req_dataset):
  req_sample = get_request_dataset(req_dataset)

  res_data = req_sample[['JURISDICTION_CODE', 'ARREST_DATE', 'PERP_RACE', 'ARREST_BORO']]
  res_data = res_data.to_dict('records')
  res_data = json.dumps(res_data, indent=2)

  return jsonify(res_data)

if __name__ == '__main__':
  file_length = 214616
  desire_size = 2000
  skip = sorted(random.sample(range(1, file_length), file_length - desire_size))

  dataset = pd.read_csv('./data/NYPD_Arrest_Data__Year_to_Date_.csv', skiprows=skip)
  dataset = dataset.drop(['ARREST_KEY', 'X_COORD_CD', 'Y_COORD_CD', 'KY_CD', 'PD_DESC', 'OFNS_DESC', 'LAW_CODE'], axis=1)

  ages = []
  for age_group in dataset['AGE_GROUP']:
    if age_group == '<18': ages.append(random.randint(15, 17))
    elif age_group == '18-24': ages.append(random.randint(18, 24))
    elif age_group == '25-44': ages.append(random.randint(25, 44))
    elif age_group == '45-64': ages.append(random.randint(45, 64))
    elif age_group == '65+': ages.append(random.randint(65, 70))
    else: ages.append(random.randint(15, 70))

  dataset['AGE'] = ages

  dataset = dataset.apply(LabelEncoder().fit_transform)
  dataset = dataset.astype('float64') # To avoid convertion warning

  random_sample, stratify_sample = data_sampling(dataset)
  pca_dataset, pca_random, pca_straitfy = data_reduction(dataset, random_sample, stratify_sample)

  app.run(debug=True, port=3002)