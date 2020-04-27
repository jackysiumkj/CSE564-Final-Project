import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing.data import scale
from sklearn import preprocessing
from sklearn.cluster import KMeans

def pca_handler(data):
  data = data.apply(preprocessing.LabelEncoder().fit_transform)
  data = data.astype('float64')
  s_kmeans = KMeans(n_clusters=5).fit(data)
  pca_dataset = PCA().fit(scale(data))
  return pca_dataset