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


checking = [
    [1, 2, [1, 2, 3], 4, 5],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    {'1': 'one', 'cimm': 'cool'},
    (1, 2, 3),
    (1,),
    # range(10), #error
    # {1, 2, 3}, #error
    # frozenset([1, 2, 3]), # error
    True,
    False,
    1,
    1.0,
    None,
    # complex(1, 2), # error
    # object() # error
]

for check in checking:
    print(ctx.call("ArrayHelper.clone", check))
