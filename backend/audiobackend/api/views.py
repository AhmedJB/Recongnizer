from django.shortcuts import render
from regex import D
from rest_framework.views import APIView
from rest_framework.response import Response
from api.Recognizer.worker import *
from django.conf import settings
import base64
import uuid
import soundfile as sf
import wavio
import librosa
import speech_recognition as sr
# Create your views here.


class Test(APIView):

    def get(self,request,format=None):
        return Response({"status" : True});


class Recognize(APIView):

    def correct_path(self,data):
        corrected = []
        for d in data:
            corrected.append(settings.MEDIA_ROOT / d)
        print(corrected)
        return corrected

    def init_training(self):

        # init 
        scores = {
            "fadel" : [],
            "issam" : [],
            "ahmed" : []
        }

        fadel_files = self.correct_path(["fadel10.wav"])
        issam_files = self.correct_path(["issam10.wav"])#"issam14.wav","issam10.wav","issam11.wav","issam12.wav"
        ahmed_files = self.correct_path([])

        calculate_new_sample("fadel",scores,*fadel_files)
        calculate_new_sample("issam",scores,*issam_files)
        calculate_new_sample("ahmed",scores,*ahmed_files)
        #print(scores)
        return scores

    def write_file(self,data):
        base_64 = data.replace("data:audio/wav;base64,","")
        name = str(uuid.uuid4())+".wav"
        path = settings.MEDIA_ROOT / name
        f = open( path,'wb')
        f.write(base64.b64decode(base_64))
        f.close()
        return path

    def convert_file(self,f):
        wav, samplerate = librosa.load(f) 
        wavio.write(str(f), wav, samplerate ,sampwidth=2)
        print('done converting ....')

    def detect(self,f):
        r = sr.Recognizer()
        print(f)
        # Reading Audio file as source
        # listening the audio file and store in audio_text variable

        with sr.AudioFile(str(f)) as source:
            
            audio_text = r.listen(source)

            
        # recoginize_() method will throw a request error if the API is unreachable, hence using exception handling
        try:
                
                # using google speech recognition
            text = r.recognize_google(audio_text, language = "fr-FR")
            print('Converting audio transcripts into text ...')
            print(text)
            return text
        except Exception as e:
                print(str(e))
                print('Sorry.. run again...')
                return ""
    
    def post(self,request,format=None):
        data = request.data
        #print(data)
        base_64 = data['data']
        
        
        path =  self.write_file(base_64)
        print(path)
        scores = self.init_training()
        self.convert_file(path)
        #print(scores)
        dt = compare(path,scores)
        itms = list(dt.items())
        res = list(itms[0])
        message  = self.detect(path)
        resp = {
            "name" : res[0],
            "message" : message
        }
        return Response(resp)



