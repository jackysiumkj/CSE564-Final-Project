import numpy as np
import pandas as pd

from sklearn.cluster import KMeans

def data_sampling(dataset):
  random_sample = dataset.sample(frac = .25)

  # By Elbow Method, we know that the optimized k value is 4
  s_kmeans = KMeans(n_clusters=4).fit(dataset)
  stratify_sample = dataset.groupby(s_kmeans.labels_).apply(pd.DataFrame.sample, frac=.25)

  return random_sample, stratify_sample