import pandas as pd

from sklearn.preprocessing import scale
from sklearn.manifold import MDS
from sklearn.metrics import euclidean_distances

def get_euclidean(sample):
  
  mds_df_resulst = pd.DataFrame()
  
  sample_matrix = pd.DataFrame(scale(sample))
  euclidean_vec = MDS(n_components=2).fit_transform(sample_matrix)
  euclidean_vec = pd.DataFrame(euclidean_vec)

  mds_df_resulst['x'] = euclidean_vec[0]
  mds_df_resulst['y'] = euclidean_vec[1]

  return mds_df_resulst

def get_correlation(sample):

  mds_df_resulst = pd.DataFrame()

  sample_matrix = pd.DataFrame(scale(sample))
  sample_matrix = sample_matrix.transpose()
  sample_corr_m = sample_matrix.corr()
  
  correlations = MDS(n_components=2, dissimilarity='precomputed').fit_transform(1 - sample_corr_m)
  correlations = pd.DataFrame(correlations)
  
  mds_df_resulst['x'] = correlations[0]
  mds_df_resulst['y'] = correlations[1]
  
  return mds_df_resulst