import execjs
import ArrayHelper
with open('ArrayHelper.js', 'r') as file:
    js_code = file.read()

ctx = execjs.compile(js_code)

obj = [
    # [1, 2, 3],
    [1, 2, [1, 2, 3], 4, 5],
    # {'1': 'one', 'cimm': 'cool'},
    # True,
    # False,
    # 1,
    # 1.0,
    # None,
    # 'Cimm is cool laboratory'
]
x = obj[0]
print(ctx.call("ArrayHelper.print", x))
print(ArrayHelper.ArrayHelper.print(x))
print(ctx.call("ArrayHelper.print", x) == ArrayHelper.ArrayHelper.print(x))
