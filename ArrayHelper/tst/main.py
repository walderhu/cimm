import execjs

def main():
    with open('main.js', 'r') as file:
        js_code = file.read()

    ctx = execjs.compile(js_code)
    result = ctx.call("my_function", 3, 5)
    print(result)

if __name__ == '__main__':
    main()
