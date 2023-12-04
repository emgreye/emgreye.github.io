import random

def geni():
    return int(5* ((pow(30, -random.uniform(0,1))))+1)

array = []
for i in range(20):
    array.append(geni())
print(array)