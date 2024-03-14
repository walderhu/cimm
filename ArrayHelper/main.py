import execjs
import ArrayHelper
with open('ArrayHelper.js', 'r') as file:
    js_code = file.read()

ctx = execjs.compile(js_code)
# arr = [1, 2, [1, 2, 3], 4, 5]
obj1 = {
    'hello': 1,
    'denis': 'python'
}
print(ctx.call("ArrayHelper.equals", obj1, obj1))
# print(ArrayHelper.ArrayHelper.equals(obj1, obj1))
# arrA = [1, 2, 3]
# arr1 = sorted(True)
# print(arr1)