import execjs
import ArrayHelper
with open('ArrayHelper.js', 'r') as file:
    js_code = file.read()

ctx = execjs.compile(js_code)
# arr = [1, 2, [1, 2, 3], 4, 5]
obj = [
    (1,),
    'Cimm is cool laboratory'
]
arr =   obj[0]
# print(ctx.call("ArrayHelper.equals", arr, arr))
print(ArrayHelper.ArrayHelper.equals(arr, arr))
# arrA = [1, 2, 3]
# arr1 = sorted(True)
# print(arr1)
print(list('CIMM'))