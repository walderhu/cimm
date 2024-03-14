import execjs
import ArrayHelper
with open('ArrayHelper.js', 'r') as file:
    js_code = file.read()

ctx = execjs.compile(js_code)

obj = [
    'hello'
]
x = obj[0]
# print(ctx.call("ArrayHelper.print", x))
print(ArrayHelper.ArrayHelper.print(x))
# print(ctx.call("ArrayHelper.print", x) == ArrayHelper.ArrayHelper.print(x))
