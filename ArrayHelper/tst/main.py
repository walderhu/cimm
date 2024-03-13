import execjs
import ArrayHelper
with open('ArrayHelper.js', 'r') as file:
    js_code = file.read()

ctx = execjs.compile(js_code)
arr = [1, 2, [1, 2, 3], 4, 5]

# js = ctx.call("ArrayHelper.clone", arr)
# py = ArrayHelper.ArrayHelper.clone(arr)


def testing(arr): return ctx.call("ArrayHelper.clone",
                                  arr) == ArrayHelper.ArrayHelper.clone(arr)


check = 'hello'
print(hasattr(check, '__iter__'))
print(ctx.call("ArrayHelper.clone", check))
print(ArrayHelper.ArrayHelper.clone(check))
