import matplotlib.pyplot as plt
import pandas as pd
import random
import numpy as np
from sklearn import preprocessing

from sklearn.cluster import KMeans
from scipy.spatial.distance import cdist

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

dataset = dataset.apply(preprocessing.LabelEncoder().fit_transform)
dataset = dataset.astype('float64')

distortions = []
for k in range(1, 11):
  _kmeans = KMeans(n_clusters=k).fit(dataset)
  distortions.append(sum(np.min(cdist(dataset, _kmeans.cluster_centers_, 'euclidean'), axis=1)) / dataset.shape[0])

plt.figure()
plt.plot(range(1, 11), distortions, 'bx-')
plt.xlabel('k')
plt.ylabel('Distortion')
plt.title('The Elbow Method showing the optimal k')
plt.savefig('./data/imgs/elbow_method_result.png', dpi=100)
plt.show()