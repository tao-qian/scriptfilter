import pickle
with open('negative.pkl','r') as f:
    negative_list = pickle.load(f)
with open('positive.pkl','r') as f:
    positive_list = pickle.load(f)

import requests
pages = []
failed_list = []
file_count = 0
batch_size = 200
for url in negative_list:
    result = None
    try:
        result = requests.get('http://'+url, allow_redirects=True,timeout=5)
    except:
        print "ERROR:"+url
        failed_list.append(url)
    pages.append((url,result))
    if(len(pages) == batch_size):
        with open('pages/negative_pages_'+str(file_count)+'.pkl','wb') as f:
            pickle.dump(pages, f)
        file_count += 1
        print "Finished processing "+str(batch_size)
        pages = []
        
if len(pages) != 0:
    with open('pages/negative_pages_'+str(file_count)+'.pkl','wb') as f:
        pickle.dump(pages, f)
        
with open('pages/negative_failed.pkl','wb') as f:
    pickle.dump(failed_list, f)
print "Finished "+str(len(failed_list))+" failed in negative"
    
pages = []
failed_list = []
file_count = 0
for url in positive_list:
    result = None
    try:
        result = requests.get('http://'+url, allow_redirects=True,timeout=5)
    except:
        print "ERROR:"+url
        failed_list.append(url)
    pages.append((url,result))
    if(len(pages) == batch_size):
        with open('pages/positive_pages_'+str(file_count)+'.pkl','wb') as f:
            pickle.dump(pages, f)
        file_count += 1
        print "Finished processing "+str(batch_size)
        pages = []
        
if len(pages) != 0:
    with open('pages/positive_pages_'+str(file_count)+'.pkl','wb') as f:
        pickle.dump(pages, f)
        
with open('pages/positive_failed.pkl','wb') as f:
    pickle.dump(failed_list,f)
print "Finished "+str(len(failed_list))+" failed in positive"
