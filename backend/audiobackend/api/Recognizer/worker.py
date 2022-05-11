import numpy as np
from scipy.io import wavfile
import librosa
import librosa.display
import matplotlib.pyplot as plt
import math
import base64


def calculate_score(f):
    signal , sr = librosa.load(f)
    
    
    signal = signal[:5*sr]
    #print(len(signal))
    mfcc = librosa.feature.mfcc(y= signal , n_mfcc = 13 , sr = sr)
    print(mfcc.shape)
    #avg_r = mfcc.mean(axis=1)
    #print(avg_r.shape)
    #score = avg_r.mean(axis = 0)
    return mfcc

def calculate_new_sample(name,scores,*args):
    if len(args) == 0 : return 
    print(args)
    new_avg = []
    for item in args:
        print(item)
        new_avg.append(calculate_score(item))
    #scores[name] = sum(new_avg) / len(new_avg)
    scores[name] = new_avg
    
    
def compare(f,scores):
    new_s  = calculate_score(f)
    res = {}
    for i in scores.keys():
        means = []
        for elem in scores[i]:
            means.append( np.mean( np.mean(np.absolute(elem - new_s),axis=1), axis = 0 ) ) 
        if len(means) == 0:
            res[i] = 2**16
        else:
            res[i] = min(means)
        #res[i] = np.mean(np.absolute(scores[i] - new_s))
    return {k : v for k,v in sorted(res.items() , key= lambda item : item[1])}
    
