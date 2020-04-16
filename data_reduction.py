from sklearn.decomposition import PCA
from sklearn.preprocessing import scale
import numpy as np
import pandas as pd

def data_reduction(dataset, random_sample, stratify_sample):
  original_data_ = dataset.values
  random_sample_ = random_sample.values
  stratify_sample_ = stratify_sample.values

  pca_dataset = PCA().fit(scale(original_data_))
  pca_random = PCA().fit(scale(random_sample_))
  pca_stratify = PCA().fit(scale(stratify_sample_))

  return pca_dataset, pca_random, pca_stratify

  # There are 9 intrinsic dimensions after finding by PCA method, which can cover 90%
  # Start obtaining highest three attributes
  pca = PCA(n_components = 9)
  def_components = pca.fit_transform(scale(stratify_sample))
  def_loadings = pca.components_.T * np.sqrt(pca.explained_variance_)
  def_attributes = pd.DataFrame()
  def_attributes['attributes'] = stratify_sample.columns.values

  columns_ = ['pc1', 'pc2', 'pc3', 'pc4', 'pc5', 'pc6', 'pc7', 'pc8', 'pc9']
  sign_loadings = pd.DataFrame(def_loadings, columns=columns_)

  sorted_loadings = pd.concat([def_attributes, sign_loadings], sort=True, axis=1)
  sorted_loadings['sqr_loadings_sum'] = sorted_loadings.drop(['attributes'], axis=1).apply(
    lambda x: np.sqrt(
      np.square(x['pc1']) + 
      np.square(x['pc2']) + 
      np.square(x['pc3']) + 
      np.square(x['pc4']) + 
      np.square(x['pc5']) + 
      np.square(x['pc6']) + 
      np.square(x['pc7']) + 
      np.square(x['pc8']) + 
      np.square(x['pc9'])
    ),
    axis=1
  )
  sorted_loadings = sorted_loadings.sort_values(by=['sqr_loadings_sum'], ascending=False)
  # print(sorted_loadings)
  # These three attributes are the top three: 'JURISDICTION_CODE', 'ARREST_DATE', 'PERP_RACE'

def top_two_pc(stratify_sample):
  top_two_components = PCA(n_components=2).fit_transform(scale(stratify_sample))

  return pd.DataFrame(top_two_components, columns=['pc1','pc2'])