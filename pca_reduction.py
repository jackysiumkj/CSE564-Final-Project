import matplotlib.pyplot as plt
import pandas as pd
import random
import numpy as np
from sklearn import preprocessing

from sklearn.decomposition import PCA
from sklearn.preprocessing import scale
from sklearn.cluster import KMeans

file_length = 214616
desire_size = 1500
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

random_sample = dataset.sample(frac = .25)

s_kmeans = KMeans(n_clusters=5).fit(dataset)
stratify_sample = dataset.groupby(s_kmeans.labels_).apply(pd.DataFrame.sample, frac=.25)

dataset = dataset.values
random_sample = random_sample.values
stratify_sample = stratify_sample.values

pca_dataset = PCA().fit(scale(dataset))
pca_random = PCA().fit(scale(random_sample))
pca_stratify = PCA().fit(scale(stratify_sample))

plt.figure()
plt.plot(np.cumsum(pca_dataset.explained_variance_ratio_), '-o', label='org')
plt.plot(np.cumsum(pca_random.explained_variance_ratio_), '-o', label='random')
plt.plot(np.cumsum(pca_stratify.explained_variance_ratio_), '-x', label='stratify')
plt.xlabel('Components')
plt.ylabel('Variance')
plt.title('PCA')
plt.legend(loc='upper left')
plt.savefig('./data/imgs/pca_result.png', dpi=100)
plt.show()